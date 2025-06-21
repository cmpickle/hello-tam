import AsyncStorage from '@react-native-async-storage/async-storage'

const TOKEN_KEYS = {
  ACCESS_TOKEN: '@home_economy_access_token',
  REFRESH_TOKEN: '@home_economy_refresh_token',
  USER_DATA: '@home_economy_user_data',
} as const

class TokenStorage {
  async setAccessToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token)
    } catch (error) {
      console.error('Failed to save access token:', error)
      throw new Error('Failed to save access token')
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
    } catch (error) {
      console.error('Failed to get access token:', error)
      return null
    }
  }

  async setRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token)
    } catch (error) {
      console.error('Failed to save refresh token:', error)
      throw new Error('Failed to save refresh token')
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN)
    } catch (error) {
      console.error('Failed to get refresh token:', error)
      return null
    }
  }

  async setUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(userData))
    } catch (error) {
      console.error('Failed to save user data:', error)
      throw new Error('Failed to save user data')
    }
  }

  async getUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(TOKEN_KEYS.USER_DATA)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Failed to get user data:', error)
      return null
    }
  }

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await Promise.all([this.setAccessToken(accessToken), this.setRefreshToken(refreshToken)])
    } catch (error) {
      console.error('Failed to save tokens:', error)
      throw new Error('Failed to save tokens')
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(TOKEN_KEYS.USER_DATA),
      ])
    } catch (error) {
      console.error('Failed to clear tokens:', error)
      throw new Error('Failed to clear tokens')
    }
  }

  async hasValidTokens(): Promise<boolean> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.getAccessToken(),
        this.getRefreshToken(),
      ])
      return !!(accessToken && refreshToken)
    } catch (error) {
      console.error('Failed to check token validity:', error)
      return false
    }
  }
}

export const tokenStorage = new TokenStorage()
