import { Button, Paragraph, YStack, Card, H1, Text } from '@my/ui'
import { ChevronLeft, User, Home, Trophy, DollarSign } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'
import { AuthGuard } from '../../provider/auth/auth-guard'
import { useAuth } from '../../provider/auth/auth-context'

export function UserDetailScreen({ id }: { id: string }) {
  const router = useRouter()
  const { user, logout } = useAuth()

  if (!id) {
    return null
  }

  return (
    <AuthGuard>
      <YStack
        flex={1}
        justify="center"
        items="center"
        gap="$4"
        bg="$background"
        p="$4"
      >
        <Card
          padding={20}
          gap={20}
          width="100%"
          maxWidth={400}
        >
          <YStack
            gap="$4"
            items="center"
          >
            <User
              size={48}
              color="$blue10"
            />
            <H1 textAlign="center">User Dashboard</H1>

            {user && (
              <>
                <Text
                  textAlign="center"
                  fontSize="$6"
                  fontWeight="600"
                >
                  {user.first_name} {user.last_name}
                </Text>
                <Text
                  textAlign="center"
                  color="$color10"
                  fontSize="$4"
                >
                  @{user.username}
                </Text>
                <Text
                  textAlign="center"
                  color="$color8"
                  fontSize="$3"
                >
                  {user.email}
                </Text>

                <YStack
                  gap="$2"
                  width="100%"
                  mt="$4"
                >
                  <YStack
                    direction="row"
                    justify="space-between"
                    items="center"
                  >
                    <Text>Role:</Text>
                    <Text
                      fontWeight="600"
                      color="$blue10"
                    >
                      {user.profile.role.charAt(0).toUpperCase() + user.profile.role.slice(1)}
                    </Text>
                  </YStack>

                  <YStack
                    direction="row"
                    justify="space-between"
                    items="center"
                  >
                    <YStack
                      direction="row"
                      items="center"
                      gap="$2"
                    >
                      <Trophy
                        size={16}
                        // color="$orange10"
                      />
                      <Text>Points:</Text>
                    </YStack>
                    <Text
                      fontWeight="600"
                      // color="$orange10"
                    >
                      {user.profile.total_points}
                    </Text>
                  </YStack>

                  <YStack
                    direction="row"
                    justify="space-between"
                    items="center"
                  >
                    <YStack
                      direction="row"
                      items="center"
                      gap="$2"
                    >
                      <DollarSign
                        size={16}
                        color="$green10"
                      />
                      <Text>Money:</Text>
                    </YStack>
                    <Text
                      fontWeight="600"
                      color="$green10"
                    >
                      ${user.profile.total_money.toFixed(2)}
                    </Text>
                  </YStack>

                  <YStack
                    direction="row"
                    justify="space-between"
                    items="center"
                  >
                    <Text>Age:</Text>
                    <Text fontWeight="600">{user.profile.age} years old</Text>
                  </YStack>

                  <YStack
                    direction="row"
                    justify="space-between"
                    items="center"
                  >
                    <Text>Member since:</Text>
                    <Text
                      fontWeight="600"
                      fontSize="$2"
                    >
                      {new Date(user.profile.date_joined).toLocaleDateString()}
                    </Text>
                  </YStack>

                  {user.households.length > 0 && (
                    <YStack
                      direction="row"
                      justify="space-between"
                      items="center"
                    >
                      <Text>Households:</Text>
                      <Text fontWeight="600">{user.households.length}</Text>
                    </YStack>
                  )}
                </YStack>
              </>
            )}
          </YStack>

          <YStack
            gap="$3"
            mt="$4"
          >
            <Button
              icon={Home}
              onPress={() => router.push('/')}
            >
              Back to Home
            </Button>
            <Button
              theme="red"
              onPress={logout}
            >
              Logout
            </Button>
          </YStack>
        </Card>
      </YStack>
    </AuthGuard>
  )
}
