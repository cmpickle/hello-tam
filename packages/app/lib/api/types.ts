// Generated types from Home Economy API OpenAPI specification

export interface ApiResponse<T = any> {
  errorMessage?: string
  traceId: string
  data?: T
  per_page?: number
  current_page?: number
  total?: number
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  profile: {
    role: 'parent' | 'teen' | 'child'
    age: number
    avatar?: string
    total_points: number
    total_money: number
    date_joined: string
  }
  households: number[]
}

export interface LoginRequest {
  username: string
  password: string
  traceId: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface RefreshRequest {
  refresh_token: string
  traceId: string
}

export interface RefreshResponse {
  access_token: string
}

export interface Household {
  id: number
  name: string
  address?: string
  settings: {
    point_to_dollar_rate: number
    auto_approve_rewards: boolean
    chore_approval_required: boolean
    teen_privileges?: {
      can_create_events: boolean
      can_redeem_rewards: boolean
      max_reward_value?: number
    }
    child_privileges?: {
      can_create_events: boolean
      can_redeem_rewards: boolean
      max_reward_value?: number
    }
  }
  members: User[]
  heads: number[]
  created_at: string
}

export interface Chore {
  id: number
  name: string
  description?: string
  point_value: number
  due_date: string
  status: 'incomplete' | 'pending' | 'completed' | 'skipped'
  assigned_to?: number
  assigned_to_user?: User
  household: number
  household_name: string
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'annually'
  creation_method: 'manual' | 'recurring' | 'system'
  created_at: string
  created_by: number
  completed_at?: string
  approved_at?: string
  notes?: string
}

export interface Reward {
  id: number
  title: string
  description?: string
  image?: string
  cost_points?: number
  cost_dollars?: number
  household: number
  household_name: string
  is_active: boolean
  age_restrictions?: {
    min_age?: number
    max_age?: number
    roles_allowed?: ('parent' | 'teen' | 'child')[]
  }
  created_at: string
  created_by: number
  user_can_afford: boolean
}

export interface Transaction {
  id: number
  user: number
  user_name: string
  household: number
  household_name: string
  transaction_type: 'chore_completion' | 'reward_redemption' | 'manual_adjustment' | 'bonus'
  amount_points: number
  amount_dollars: number
  description: string
  related_chore?: number
  related_reward?: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  created_by: number
  approved_at?: string
  approved_by?: number
}

export interface Event {
  id: number
  title: string
  description?: string
  event_date: string
  created_by: number
  created_at: string
  notification_settings: {
    notify_1_day: boolean
    notify_1_hour: boolean
    notify_15_min: boolean
    custom_notifications?: {
      time_before: number
      message: string
    }[]
  }
  time_until_event: {
    days: number
    hours: number
    minutes: number
    seconds: number
    total_seconds: number
    progress_percentage: number
  }
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  clearError: () => void
}

export interface ApiError {
  message: string
  traceId?: string
  status?: number
  details?: any
}
