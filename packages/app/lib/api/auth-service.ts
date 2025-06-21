import { apiClient } from './client'
import { tokenStorage } from '../storage/token-storage'
import type {
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  User,
  ApiError,
} from './types'

class AuthService {
  async login(
    username: string,
    password: string
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    try {
      const traceId = apiClient.generateRequestTraceId()

      const request: LoginRequest = {
        username,
        password,
        traceId,
      }

      const response = await apiClient.post<LoginResponse>('/auth/login', request)

      if (!response.data) {
        throw new Error('Invalid response from server')
      }

      const { access_token, refresh_token, user } = response.data

      // Store tokens securely
      await Promise.all([
        tokenStorage.setTokens(access_token, refresh_token),
        tokenStorage.setUserData(user),
      ])

      return {
        user,
        accessToken: access_token,
        refreshToken: refresh_token,
      }
    } catch (error) {
      // Clean up any partial storage on error
      await tokenStorage.clearTokens()
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear stored tokens and user data
      await tokenStorage.clearTokens()
    } catch (error) {
      console.error('Error during logout:', error)
      // Still clear tokens even if there's an error
      await tokenStorage.clearTokens()
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = await tokenStorage.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const traceId = apiClient.generateRequestTraceId()

      const request: RefreshRequest = {
        refresh_token: refreshToken,
        traceId,
      }

      const response = await apiClient.post<RefreshResponse>('/auth/refresh', request)

      if (!response.data?.access_token) {
        throw new Error('Invalid refresh response from server')
      }

      const { access_token } = response.data
      await tokenStorage.setAccessToken(access_token)

      return access_token
    } catch (error) {
      // If refresh fails, clear all tokens
      await tokenStorage.clearTokens()
      throw error
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await tokenStorage.getUserData()
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      return await tokenStorage.hasValidTokens()
    } catch (error) {
      console.error('Failed to check authentication status:', error)
      return false
    }
  }

  async getStoredTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        tokenStorage.getAccessToken(),
        tokenStorage.getRefreshToken(),
      ])
      return { accessToken, refreshToken }
    } catch (error) {
      console.error('Failed to get stored tokens:', error)
      return { accessToken: null, refreshToken: null }
    }
  }
}

export const authService = new AuthService()
