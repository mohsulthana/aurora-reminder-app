<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: 'auth',
})

const { signIn, signInWithGoogle, signInWithGithub } = useAuth()
const router = useRouter()

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')

async function onSubmit(event: { data: Schema }) {
  error.value = ''
  loading.value = true

  const { error: signInError } = await signIn(event.data.email, event.data.password)

  if (signInError) {
    error.value = (signInError as Error).message || 'Failed to sign in'
    loading.value = false
  }
  else {
    await router.push('/app')
  }
}

async function handleGoogleSignIn() {
  error.value = ''
  const { error: signInError } = await signInWithGoogle()
  if (signInError) {
    error.value = (signInError as Error).message || 'Failed to sign in with Google'
  }
}

async function handleGithubSignIn() {
  error.value = ''
  const { error: signInError } = await signInWithGithub()
  if (signInError) {
    error.value = (signInError as Error).message || 'Failed to sign in with GitHub'
  }
}

useSeoMeta({
  title: 'Login',
  description: 'Login to your account',
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h2 class="text-2xl font-bold">
            Welcome back
          </h2>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>
      </template>

      <UForm
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
          Sign in
        </UButton>
      </UForm>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <div class="grid gap-3">
        <UButton
          variant="outline"
          block
          size="lg"
          icon="i-simple-icons-google"
          :loading="loading"
          @click="handleGoogleSignIn"
        >
          Google
        </UButton>
        <UButton
          variant="outline"
          block
          size="lg"
          icon="i-simple-icons-github"
          :loading="loading"
          @click="handleGithubSignIn"
        >
          GitHub
        </UButton>
      </div>

      <template #footer>
        <div class="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?
          <UButton
            variant="link"
            to="/auth/signup"
            :padded="false"
          >
            Sign up
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
