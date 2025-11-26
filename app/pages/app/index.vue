<script setup lang="ts">
import type { BillingCycle } from '~/composables/useSubscriptions'
import { z } from 'zod'

definePageMeta({
  layout: 'app',
})

const { subscriptions, fetchSubscriptions, createSubscription, loading } = useSubscriptions()

// Modal state
const isOpen = ref(false)
const isSubmitting = ref(false)

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().min(3, 'Currency is required'),
  billing_cycle: z.enum(['weekly', 'monthly', 'yearly']),
  next_billing_date: z.string().min(1, 'Next billing date is required'),
  status: z.enum(['active', 'cancelled']),
})

type Schema = z.output<typeof schema>

const state = reactive({
  name: '',
  amount: 0,
  currency: 'USD',
  billing_cycle: 'monthly' as BillingCycle,
  next_billing_date: new Date().toISOString().split('T')[0],
  status: 'active' as 'active' | 'cancelled',
})

async function onSubmit(event: { data: Schema }) {
  isSubmitting.value = true
  const { error } = await createSubscription(event.data)

  if (!error) {
    isOpen.value = false
    // Reset form
    Object.assign(state, {
      name: '',
      amount: 0,
      currency: 'USD',
      billing_cycle: 'monthly',
      next_billing_date: new Date().toISOString().split('T')[0],
      status: 'active',
    })
    // Refresh subscriptions list
    await fetchSubscriptions()
  }

  isSubmitting.value = false
}

// Fetch subscriptions on mount
onMounted(async () => {
  // Scroll to top on mount
  if (import.meta.client) {
    window.scrollTo(0, 0)
  }
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
  <div class="w-full space-y-6 pb-20 md:pb-0">
    <!-- Welcome Header -->
    <div class="w-full">
      <h1 class="text-2xl font-bold sm:text-3xl">
        Welcome back!
      </h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
        Here's what's happening with your subscriptions
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    <UCard class="overflow-visible">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold">
            Upcoming Payments
          </h2>
          <UButton
            to="/app/subscriptions"
            variant="ghost"
            trailing-icon="i-lucide-arrow-right"
            size="xs"
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
          class="mt-4"
          @click="isOpen = true"
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

    <!-- Add Subscription Modal -->
    <UModal v-model:open="isOpen" title="Add Subscription">
      <template #body>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            label="Name"
            name="name"
            required
          >
            <UInput
              v-model="state.name"
              placeholder="Netflix, Spotify, etc."
            />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField
              label="Amount"
              name="amount"
              required
            >
              <UInput
                v-model.number="state.amount"
                type="number"
                step="0.01"
                min="0"
              />
            </UFormField>

            <UFormField
              label="Currency"
              name="currency"
              required
            >
              <UInput
                v-model="state.currency"
                placeholder="USD"
              />
            </UFormField>
          </div>

          <UFormField
            label="Billing Cycle"
            name="billing_cycle"
            required
          >
            <USelect
              v-model="state.billing_cycle"
              :options="[
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]"
              option-attribute="label"
              value-attribute="value"
            />
          </UFormField>

          <UFormField
            label="Next Billing Date"
            name="next_billing_date"
            required
          >
            <UInput
              v-model="state.next_billing_date"
              type="date"
            />
          </UFormField>

          <UFormField
            label="Status"
            name="status"
            required
          >
            <USelect
              v-model="state.status"
              :options="[
                { label: 'Active', value: 'active' },
                { label: 'Cancelled', value: 'cancelled' },
              ]"
              option-attribute="label"
              value-attribute="value"
            />
          </UFormField>

          <div class="flex justify-end gap-2">
            <UButton
              variant="outline"
              @click="isOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              :loading="isSubmitting"
            >
              Add Subscription
            </UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>
