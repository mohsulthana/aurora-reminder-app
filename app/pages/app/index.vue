<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

const { subscriptions, fetchSubscriptions, loading } = useSubscriptions()

// Fetch subscriptions on mount
onMounted(async () => {
  await fetchSubscriptions()
})

// Calculate upcoming payments (next 30 days)
const upcomingPayments = computed(() => {
  const today = new Date()
  const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

  return subscriptions.value
    .filter(sub => sub.status === 'active')
    .filter((sub) => {
      const nextBilling = new Date(sub.next_billing_date)
      return nextBilling >= today && nextBilling <= thirtyDaysLater
    })
    .sort((a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime())
})

// Calculate total monthly cost
const totalMonthlyCost = computed(() => {
  return subscriptions.value
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => {
      const amount = sub.amount
      switch (sub.billing_cycle) {
        case 'weekly':
          return total + (amount * 52 / 12)
        case 'yearly':
          return total + (amount / 12)
        default:
          return total + amount
      }
    }, 0)
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

useSeoMeta({
  title: 'Dashboard',
  description: 'Your subscription dashboard',
})
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div>
      <h1 class="text-3xl font-bold">
        Welcome back!
      </h1>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        Here's what's happening with your subscriptions
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-6 md:grid-cols-3">
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Active Subscriptions
            </p>
            <p class="mt-1 text-3xl font-bold">
              {{ subscriptions.filter(s => s.status === 'active').length }}
            </p>
          </div>
          <UIcon
            name="i-lucide-credit-card"
            class="h-10 w-10 text-primary"
          />
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Monthly Cost
            </p>
            <p class="mt-1 text-3xl font-bold">
              {{ formatCurrency(totalMonthlyCost, 'USD') }}
            </p>
          </div>
          <UIcon
            name="i-lucide-dollar-sign"
            class="h-10 w-10 text-primary"
          />
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Upcoming (30 days)
            </p>
            <p class="mt-1 text-3xl font-bold">
              {{ upcomingPayments.length }}
            </p>
          </div>
          <UIcon
            name="i-lucide-calendar"
            class="h-10 w-10 text-primary"
          />
        </div>
      </UCard>
    </div>

    <!-- Upcoming Payments -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold">
            Upcoming Payments
          </h2>
          <UButton
            to="/app/subscriptions"
            variant="ghost"
            trailing-icon="i-lucide-arrow-right"
          >
            View all
          </UButton>
        </div>
      </template>

      <div
        v-if="loading"
        class="flex justify-center py-8"
      >
        <UIcon
          name="i-lucide-loader-2"
          class="h-8 w-8 animate-spin text-primary"
        />
      </div>

      <div
        v-else-if="upcomingPayments.length === 0"
        class="py-8 text-center"
      >
        <UIcon
          name="i-lucide-calendar-check"
          class="mx-auto h-12 w-12 text-gray-400"
        />
        <p class="mt-4 text-gray-500 dark:text-gray-400">
          No upcoming payments in the next 30 days
        </p>
        <UButton
          to="/app/subscriptions"
          class="mt-4"
        >
          Add a subscription
        </UButton>
      </div>

      <div
        v-else
        class="divide-y divide-gray-200 dark:divide-gray-800"
      >
        <div
          v-for="subscription in upcomingPayments.slice(0, 5)"
          :key="subscription.id"
          class="flex items-center justify-between py-4"
        >
          <div>
            <p class="font-medium">
              {{ subscription.name }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(subscription.next_billing_date) }}
            </p>
          </div>
          <div class="text-right">
            <p class="font-medium">
              {{ formatCurrency(subscription.amount, subscription.currency) }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ subscription.billing_cycle }}
            </p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Quick Actions -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-bold">
          Quick Actions
        </h2>
      </template>

      <div class="grid gap-4 sm:grid-cols-2">
        <UButton
          to="/app/subscriptions"
          variant="outline"
          size="lg"
          block
          icon="i-lucide-plus"
        >
          Add Subscription
        </UButton>
        <UButton
          to="/app/subscriptions"
          variant="outline"
          size="lg"
          block
          icon="i-lucide-list"
        >
          View All Subscriptions
        </UButton>
      </div>
    </UCard>
  </div>
</template>
