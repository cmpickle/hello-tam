import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResponse, ApiError } from './types'
import { tokenStorage } from '../storage/token-storage'

class ApiClient {
  private client: AxiosInstance
  private baseURL: string
  private refreshPromise: Promise<string> | null = null

  constructor() {
    // Use staging URL by default - can be overridden via environment variables
    this.baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://eco.cameronpickle.com/api/v1'

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await tokenStorage.getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newToken = await this.refreshToken()
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.client(originalRequest)
          } catch (refreshError) {
            // Refresh failed, redirect to login
            await tokenStorage.clearTokens()
            throw this.createApiError(refreshError, 'Authentication expired')
          }
        }

        throw this.createApiError(error)
      }
    )
  }

  private async refreshToken(): Promise<string> {
    // Prevent multiple concurrent refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performTokenRefresh()

    try {
      const token = await this.refreshPromise
      return token
    } finally {
      this.refreshPromise = null
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = await tokenStorage.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const traceId = this.generateTraceId()

    // Don't use the interceptor for refresh request to avoid infinite loops
    const response = await axios.post(
      `${this.baseURL}/auth/refresh`,
      { refresh_token: refreshToken, traceId },
      { headers: { 'Content-Type': 'application/json' } }
    )

    const { access_token } = response.data.data
    await tokenStorage.setAccessToken(access_token)

    return access_token
  }

  private createApiError(error: any, message?: string): ApiError {
    const apiError: ApiError = {
      message: message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
      traceId: error.response?.data?.traceId,
      details: error.response?.data,
    }

    // Use server error message if available
    if (error.response?.data?.errorMessage) {
      apiError.message = error.response.data.errorMessage
    }

    return apiError
  }

  private generateTraceId(): string {
    // Simple UUID v4 generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url, config)
    return response.data
  }

  // Expose trace ID generator for use in API calls
  generateRequestTraceId(): string {
    return this.generateTraceId()
  }
}

export const apiClient = new ApiClient()
