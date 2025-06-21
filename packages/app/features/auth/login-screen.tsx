import { Button, Card, H1, Input, Text, useToastController, YStack, Spinner } from '@my/ui'
import { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import { useRouter } from 'solito/navigation'
import { useAuth } from '../../provider/auth/auth-context'

export function LoginScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const { user, isAuthenticated, isLoading, error, login, clearError } = useAuth()
  const router = useRouter()
  const toast = useToastController()

  const [username, setUsername] = useState('nate')
  const [password, setPassword] = useState('password')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const linkTarget = pagesMode ? '/pages-example-user' : '/user'
      router.push(`${linkTarget}/${user.username}`)
    }
  }, [isAuthenticated, user, router, pagesMode])

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.show('Login Failed', {
        message: error,
        native: true,
      })
      clearError()
    }
  }, [error, toast, clearError])

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.show('Validation Error', {
        message: 'Please enter both username and password',
        native: true,
      })
      return
    }

    try {
      setIsSubmitting(true)
      await login(username.trim(), password)

      toast.show('Login Successful', {
        message: `Welcome back, ${username}!`,
        native: true,
      })
    } catch (error) {
      // Error is handled by the auth context and useEffect above
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading spinner during initial auth check
  if (isLoading) {
    return (
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
          Loading...
        </Text>
      </YStack>
    )
  }

  // If already authenticated, don't show login form (redirect will happen via useEffect)
  if (isAuthenticated && user) {
    return (
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
          Redirecting...
        </Text>
      </YStack>
    )
  }

  // Show login form
  return (
    <YStack
      flex={1}
      justify="center"
      items="center"
      gap="$8"
      p="$4"
      bg="$background"
    >
      <Card
        padding={20}
        gap={20}
        width="100%"
        maxWidth={400}
      >
        <H1 textAlign="center">Home Economy</H1>
        <Text
          textAlign="center"
          color="$color10"
        >
          Sign in to your account
        </Text>

        <Input
          placeholder="Enter your username"
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
          onSubmitEditing={() => password.trim() && handleLogin()}
          returnKeyType="next"
          disabled={isSubmitting}
          onFocus={(e) => {
            e.target.select()
          }}
          onBlur={(e) => {
            if (Platform.OS === 'ios') {
              e.target.blur()
            }
          }}
        />

        <Input
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleLogin}
          returnKeyType="done"
          disabled={isSubmitting}
          onFocus={(e) => {
            e.target.select()
          }}
          onBlur={(e) => {
            if (Platform.OS === 'ios') {
              e.target.blur()
            }
          }}
        />

        <Button
          onPress={handleLogin}
          mt="$4"
          disabled={isSubmitting || !username.trim() || !password.trim()}
          icon={
            isSubmitting ? (
              <Spinner
                size="small"
                color="white"
              />
            ) : undefined
          }
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </Card>
    </YStack>
  )
}
