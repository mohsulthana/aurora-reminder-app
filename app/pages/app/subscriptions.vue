<script setup lang="ts">
import type { BillingCycle } from '~/composables/useSubscriptions'
import { z } from 'zod'

definePageMeta({
  layout: 'app',
})

const { subscriptions, fetchSubscriptions, createSubscription, deleteSubscription, loading } = useSubscriptions()

// Fetch subscriptions on mount
onMounted(async () => {
  await fetchSubscriptions()
})

// Create subscription modal
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
  }

  isSubmitting.value = false
}

async function handleDelete(id: string) {
  if (confirm('Are you sure you want to delete this subscription?')) {
    await deleteSubscription(id)
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'amount', label: 'Amount' },
  { key: 'billing_cycle', label: 'Billing Cycle' },
  { key: 'next_billing_date', label: 'Next Billing' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

useSeoMeta({
  title: 'Subscriptions',
  description: 'Manage your subscriptions',
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">
          Subscriptions
        </h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Manage all your recurring subscriptions
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        size="lg"
        @click="isOpen = true"
      >
        Add Subscription
      </UButton>
    </div>

    <!-- Subscriptions Table -->
    <UCard>
      <div
        v-if="loading"
        class="flex justify-center py-12"
      >
        <UIcon
          name="i-lucide-loader-2"
          class="h-8 w-8 animate-spin text-primary"
        />
      </div>

      <div
        v-else-if="subscriptions.length === 0"
        class="py-12 text-center"
      >
        <UIcon
          name="i-lucide-inbox"
          class="mx-auto h-12 w-12 text-gray-400"
        />
        <p class="mt-4 text-lg font-medium">
          No subscriptions yet
        </p>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Get started by adding your first subscription
        </p>
        <UButton
          class="mt-4"
          @click="isOpen = true"
        >
          Add Subscription
        </UButton>
      </div>

      <UTable
        v-else
        :columns="columns"
        :rows="subscriptions as any"
      >
        <template #amount-data="{ row }">
          {{ formatCurrency((row as any).amount, (row as any).currency) }}
        </template>

        <template #billing_cycle-data="{ row }">
          <UBadge variant="subtle">
            {{ (row as any).billing_cycle }}
          </UBadge>
        </template>

        <template #next_billing_date-data="{ row }">
          {{ formatDate((row as any).next_billing_date) }}
        </template>

        <template #status-data="{ row }">
          <UBadge
            :color="(row as any).status === 'active' ? 'success' : 'neutral'"
            variant="subtle"
          >
            {{ (row as any).status }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UButton
              :to="`/app/subscriptions/${(row as any).id}`"
              variant="ghost"
              icon="i-lucide-pencil"
              size="sm"
            >
              <span class="sr-only">Edit</span>
            </UButton>
            <UButton
              variant="ghost"
              icon="i-lucide-trash-2"
              size="sm"
              color="error"
              @click="handleDelete((row as any).id)"
            >
              <span class="sr-only">Delete</span>
            </UButton>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Create Subscription Modal -->
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
