<script setup lang="ts">
import type { BillingCycle } from '~/composables/useSubscriptions'
import { z } from 'zod'

definePageMeta({
  layout: 'app',
})

const route = useRoute()
const router = useRouter()
const { getSubscription, updateSubscription, deleteSubscription } = useSubscriptions()

const subscriptionId = route.params.id as string

const loading = ref(true)
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
  next_billing_date: '',
  status: 'active' as 'active' | 'cancelled',
})

// Load subscription data
onMounted(async () => {
  const { data, error } = await getSubscription(subscriptionId)

  if (error || !data) {
    router.push('/app/subscriptions')
    return
  }

  Object.assign(state, {
    name: data.name,
    amount: data.amount,
    currency: data.currency,
    billing_cycle: data.billing_cycle,
    next_billing_date: data.next_billing_date.split('T')[0],
    status: data.status,
  })

  loading.value = false
})

async function onSubmit(event: { data: Schema }) {
  isSubmitting.value = true
  const { error } = await updateSubscription(subscriptionId, event.data)

  if (!error) {
    router.push('/app/subscriptions')
  }

  isSubmitting.value = false
}

async function handleDelete() {
  if (confirm('Are you sure you want to delete this subscription?')) {
    await deleteSubscription(subscriptionId)
    router.push('/app/subscriptions')
  }
}

useSeoMeta({
  title: 'Edit Subscription',
  description: 'Edit your subscription details',
})
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <UButton
        icon="i-lucide-arrow-left"
        variant="ghost"
        to="/app/subscriptions"
      >
        <span class="sr-only">Back</span>
      </UButton>
      <div>
        <h1 class="text-3xl font-bold">
          Edit Subscription
        </h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Update your subscription details
        </p>
      </div>
    </div>

    <!-- Form -->
    <UCard v-if="!loading">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
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
            size="lg"
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
              size="lg"
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
              size="lg"
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
            size="lg"
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
            size="lg"
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
            size="lg"
          />
        </UFormField>

        <div class="flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
          <UButton
            variant="outline"
            color="error"
            icon="i-lucide-trash-2"
            @click="handleDelete"
          >
            Delete
          </UButton>

          <div class="flex gap-2">
            <UButton
              variant="outline"
              to="/app/subscriptions"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              :loading="isSubmitting"
            >
              Save Changes
            </UButton>
          </div>
        </div>
      </UForm>
    </UCard>

    <div
      v-else
      class="flex justify-center py-12"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="h-8 w-8 animate-spin text-primary"
      />
    </div>
  </div>
</template>
