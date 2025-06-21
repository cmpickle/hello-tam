import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { authService } from '../../lib/api/auth-service'
import type { AuthState, AuthContextType, User, ApiError } from '../../lib/api/types'

// Auth reducer actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKENS'; payload: { accessToken: string | null; refreshToken: string | null } }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }

// Initial auth state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }

    case 'SET_TOKENS':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }

    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      }

    case 'CLEAR_ERROR':
      return { ...state, error: null }

    default:
      return state
  }
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      // Check if user is already authenticated
      const isAuthenticated = await authService.isAuthenticated()

      if (isAuthenticated) {
        // Get stored user data and tokens
        const [user, tokens] = await Promise.all([
          authService.getCurrentUser(),
          authService.getStoredTokens(),
        ])

        if (user) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user,
              accessToken: tokens.accessToken || '',
              refreshToken: tokens.refreshToken || '',
            },
          })
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize authentication' })
    }
  }

  const login = async (username: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      const result = await authService.login(username, password)

      dispatch({ type: 'LOGIN_SUCCESS', payload: result })
    } catch (error) {
      console.error('Login failed:', error)

      let errorMessage = 'Login failed. Please try again.'

      if (error && typeof error === 'object' && 'message' in error) {
        const apiError = error as ApiError
        errorMessage = apiError.message || errorMessage
      }

      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      await authService.logout()
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout fails, clear local state
      dispatch({ type: 'LOGOUT' })
    }
  }

  const refreshAuth = async (): Promise<void> => {
    try {
      const newAccessToken = await authService.refreshToken()

      dispatch({
        type: 'SET_TOKENS',
        payload: {
          accessToken: newAccessToken,
          refreshToken: state.refreshToken,
        },
      })
    } catch (error) {
      console.error('Token refresh failed:', error)
      // If refresh fails, log out the user
      await logout()
      throw error
    }
  }

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshAuth,
    clearError,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
