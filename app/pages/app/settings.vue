<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

const { user } = useAuth()

useSeoMeta({
  title: 'Settings',
  description: 'Manage your account settings',
})
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold">
        Settings
      </h1>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        Manage your account preferences
      </p>
    </div>

    <!-- Account Information -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-bold">
          Account Information
        </h2>
      </template>

      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <p class="mt-1 text-gray-900 dark:text-gray-100">
            {{ user?.email || 'Not available' }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            User ID
          </label>
          <p class="mt-1 font-mono text-sm text-gray-600 dark:text-gray-400">
            {{ user?.id || 'Not available' }}
          </p>
        </div>
      </div>
    </UCard>

    <!-- Preferences -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-bold">
          Preferences
        </h2>
      </template>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">
              Email Notifications
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Receive email reminders before payments
            </p>
          </div>
          <UToggle />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">
              Dark Mode
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Toggle between light and dark themes
            </p>
          </div>
          <UToggle />
        </div>
      </div>
    </UCard>

    <!-- About -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-bold">
          About
        </h2>
      </template>

      <div class="space-y-2">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          SubTracker helps you manage all your recurring subscriptions in one place.
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Track your monthly costs, get reminders for upcoming payments, and never forget to cancel unwanted subscriptions.
        </p>
      </div>

      <template #footer>
        <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Version 1.0.0</span>
          <UButton
            variant="link"
            to="/"
            :padded="false"
          >
            Learn more
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
