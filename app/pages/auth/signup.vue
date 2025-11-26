<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: 'auth',
})

const { signUp } = useAuth()
const router = useRouter()

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

async function onSubmit(event: { data: Schema }) {
  error.value = ''
  loading.value = true

  const { error: signUpError } = await signUp(event.data.email, event.data.password)

  if (signUpError) {
    error.value = (signUpError as Error).message || 'Failed to sign up'
    loading.value = false
  }
  else {
    success.value = true
    setTimeout(() => {
      router.push('/app')
    }, 2000)
  }
}

useSeoMeta({
  title: 'Sign Up',
  description: 'Create a new account',
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h2 class="text-2xl font-bold">
            Create an account
          </h2>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Get started with your subscription tracker
          </p>
        </div>
      </template>

      <UForm
        v-if="!success"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Email"
          name="email"
          required
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
            icon="i-lucide-mail"
            size="lg"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
          required
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            size="lg"
          />
        </UFormField>

        <UFormField
          label="Confirm Password"
          name="confirmPassword"
          required
        >
          <UInput
            v-model="state.confirmPassword"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            size="lg"
          />
        </UFormField>

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :title="error"
          icon="i-lucide-alert-circle"
        />

        <UButton
          type="submit"
          block
          size="lg"
          :loading="loading"
        >
          Create account
        </UButton>
      </UForm>

      <UAlert
        v-else
        color="success"
        variant="soft"
        title="Account created successfully!"
        description="Redirecting to your dashboard..."
        icon="i-lucide-check-circle"
      />

      <template #footer>
        <div class="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?
          <UButton
            variant="link"
            to="/auth/login"
            :padded="false"
          >
            Sign in
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
