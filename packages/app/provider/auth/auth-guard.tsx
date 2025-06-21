import React, { type ReactNode } from 'react'
import { useRouter } from 'solito/navigation'
import { useAuth } from './auth-context'
import { YStack, Text, Spinner } from '@my/ui'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, fallback, redirectTo = '/' }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <YStack
          flex={1}
          justify="center"
          items="center"
          bg="$background"
        >
          <Spinner
            size="large"
            color="$blue10"
          />
          <Text
            mt="$4"
            color="$color10"
          >
            Checking authentication...
          </Text>
        </YStack>
      )
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Use setTimeout to avoid navigation during render
    setTimeout(() => {
      router.replace(redirectTo)
    }, 0)

    return (
      fallback || (
        <YStack
          flex={1}
          justify="center"
          items="center"
          bg="$background"
        >
          <Text color="$color10">Redirecting to login...</Text>
        </YStack>
      )
    )
  }

  // Render protected content if authenticated
  return <>{children}</>
}

// Hook to check if user has specific role permissions
export function useRoleGuard(allowedRoles: ('parent' | 'teen' | 'child')[]) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return { hasAccess: false, userRole: null }
  }

  const userRole = user.profile.role
  const hasAccess = allowedRoles.includes(userRole)

  return { hasAccess, userRole }
}

// Component to guard content based on user roles
interface RoleGuardProps {
  children: ReactNode
  allowedRoles: ('parent' | 'teen' | 'child')[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { hasAccess } = useRoleGuard(allowedRoles)

  if (!hasAccess) {
    return (
      fallback || (
        <YStack
          flex={1}
          justify="center"
          items="center"
          bg="$background"
          p="$4"
        >
          <Text
            textAlign="center"
            color="$red10"
            fontSize="$5"
            fontWeight="bold"
          >
            Access Denied
          </Text>
          <Text
            textAlign="center"
            color="$color10"
            mt="$2"
          >
            You don't have permission to access this content.
          </Text>
        </YStack>
      )
    )
  }

  return <>{children}</>
}
