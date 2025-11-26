<script setup lang="ts">
const { user, signOut } = useAuth()
const router = useRouter()

const links = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/app',
  },
  {
    label: 'Subscriptions',
    icon: 'i-lucide-credit-card',
    to: '/app/subscriptions',
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/app/settings',
  },
]

async function handleSignOut() {
  await signOut()
  router.push('/auth/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Top Navigation Bar -->
    <header class="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo/Brand -->
          <NuxtLink
            to="/app"
            class="flex items-center gap-2"
          >
            <UIcon
              name="i-lucide-wallet"
              class="h-6 w-6 text-primary"
            />
            <span class="text-xl font-bold">SubTracker</span>
          </NuxtLink>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center gap-1">
            <UButton
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              variant="ghost"
              :icon="link.icon"
            >
              {{ link.label }}
            </UButton>
          </nav>

          <!-- User Menu -->
          <UDropdown
            v-if="user"
            :items="[
              [
                {
                  label: user.email,
                  icon: 'i-lucide-user',
                  disabled: true,
                },
              ],
              [
                {
                  label: 'Sign out',
                  icon: 'i-lucide-log-out',
                  click: handleSignOut,
                },
              ],
            ]"
          >
            <UButton
              icon="i-lucide-user"
              variant="ghost"
              trailing-icon="i-lucide-chevron-down"
            >
              Account
            </UButton>
          </UDropdown>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <UMain class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </UMain>

    <!-- Mobile Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:hidden">
      <div class="flex items-center justify-around px-4 py-3">
        <UButton
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          variant="ghost"
          :icon="link.icon"
          size="sm"
        >
          <span class="sr-only">{{ link.label }}</span>
        </UButton>
      </div>
    </nav>
  </div>
</template>
