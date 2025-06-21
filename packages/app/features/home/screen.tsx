import {
  Anchor,
  Button,
  Card,
  H1,
  Paragraph,
  Separator,
  Sheet,
  SwitchRouterButton,
  SwitchThemeButton,
  Text,
  useToastController,
  XStack,
  YStack,
  Spinner,
} from '@my/ui'
import {
  ChevronDown,
  ChevronUp,
  User,
  Trophy,
  DollarSign,
  Calendar,
  Settings,
} from '@tamagui/lucide-icons'
import { useState, useEffect } from 'react'
import { useRouter } from 'solito/navigation'
import { useAuth } from '../../provider/auth/auth-context'

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const toast = useToastController()

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = async () => {
    try {
      await logout()
      toast.show('Logged Out', {
        message: 'You have been logged out successfully',
        native: true,
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navigateToProfile = () => {
    if (user) {
      const linkTarget = pagesMode ? '/pages-example-user' : '/user'
      router.push(`${linkTarget}/${user.username}`)
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

  // If not authenticated, show loading while redirecting
  if (!isAuthenticated) {
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
          Redirecting to login...
        </Text>
      </YStack>
    )
  }

  // Show home dashboard for authenticated users
  return (
    <YStack
      flex={1}
      p="$4"
      gap="$4"
      bg="$background"
    >
      {/* Header */}
      <Card
        padding={20}
        gap={15}
      >
        <YStack
          direction="row"
          justify="space-between"
          items="center"
        >
          <YStack>
            <H1>Welcome back!</H1>
            {user && (
              <Text
                color="$color10"
                fontSize="$4"
              >
                {user.first_name} {user.last_name}
              </Text>
            )}
          </YStack>
          <Button
            size="$3"
            circular
            icon={Settings}
            onPress={handleLogout}
            theme="red"
          />
        </YStack>
      </Card>

      {/* Quick Stats */}
      {user && (
        <XStack
          gap="$4"
          flexWrap="wrap"
        >
          <Card
            flex={1}
            minWidth={150}
            padding={15}
            gap={10}
          >
            <YStack
              direction="row"
              items="center"
              gap="$2"
            >
              <Trophy
                size={20}
                color="$orange10"
              />
              <Text
                fontSize="$3"
                color="$color10"
              >
                Points
              </Text>
            </YStack>
            <Text
              fontSize="$6"
              fontWeight="bold"
              color="$orange10"
            >
              {user.profile.total_points}
            </Text>
          </Card>

          <Card
            flex={1}
            minWidth={150}
            padding={15}
            gap={10}
          >
            <YStack
              direction="row"
              items="center"
              gap="$2"
            >
              <DollarSign
                size={20}
                color="$green10"
              />
              <Text
                fontSize="$3"
                color="$color10"
              >
                Money
              </Text>
            </YStack>
            <Text
              fontSize="$6"
              fontWeight="bold"
              color="$green10"
            >
              ${user.profile.total_money.toFixed(2)}
            </Text>
          </Card>
        </XStack>
      )}

      {/* Quick Actions */}
      <Card
        padding={20}
        gap={15}
      >
        <Text
          fontSize="$5"
          fontWeight="600"
        >
          Quick Actions
        </Text>
        <YStack gap="$3">
          <Button
            icon={User}
            onPress={navigateToProfile}
            justifyContent="flex-start"
          >
            View Profile
          </Button>
          <Button
            icon={Calendar}
            onPress={() => {}}
            justifyContent="flex-start"
            disabled
            opacity={0.5}
          >
            View Chores (Coming Soon)
          </Button>
          <Button
            icon={Trophy}
            onPress={() => {}}
            justifyContent="flex-start"
            disabled
            opacity={0.5}
          >
            Browse Rewards (Coming Soon)
          </Button>
        </YStack>
      </Card>

      {/* Demo Sheet */}
      <Card
        padding={20}
        gap={15}
        items="center"
      >
        <Text
          fontSize="$4"
          fontWeight="600"
        >
          Demo Features
        </Text>
        <SheetDemo />
      </Card>
    </YStack>
  )
}

function SheetDemo() {
  const toast = useToastController()

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay
          bg="$shadow4"
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle bg="$color8" />
        <Sheet.Frame
          items="center"
          justify="center"
          gap="$10"
          bg="$color2"
        >
          <XStack gap="$2">
            <Paragraph text="center">Made by</Paragraph>
            <Anchor
              color="$blue10"
              href="https://twitter.com/natebirdman"
              target="_blank"
            >
              @natebirdman,
            </Anchor>
            <Anchor
              color="$blue10"
              href="https://github.com/tamagui/tamagui"
              target="_blank"
              rel="noreferrer"
            >
              give it a ⭐️
            </Anchor>
          </XStack>

          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
