import type { User } from '@supabase/supabase-js'

const user = ref<User | null>(null)
const loading = ref(true)

export function useAuth() {
  const { $supabase } = useNuxtApp()

  const loadUser = async () => {
    loading.value = true
    try {
      const { data: { user: currentUser }, error } = await $supabase.auth.getUser()
      if (error) {
        // Ignore AuthSessionMissingError as it's expected when not logged in
        if (error.message !== 'Auth session missing!') {
          console.error('Error loading user:', error)
        }
        user.value = null
        return
      }
      user.value = currentUser
    }
    catch (error: any) {
      // Ignore AuthSessionMissingError as it's expected when not logged in
      if (error?.message !== 'Auth session missing!') {
        console.error('Error loading user:', error)
      }
      user.value = null
    }
    finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    try {
      const { data, error } = await $supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error)
        throw error
      user.value = data.user
      return { data, error: null }
    }
    catch (error) {
      console.error('Error signing in:', error)
      return { data: null, error }
    }
    finally {
      loading.value = false
    }
  }

  const signUp = async (email: string, password: string) => {
    loading.value = true
    try {
      const { data, error } = await $supabase.auth.signUp({
        email,
        password,
      })
      if (error)
        throw error
      user.value = data.user
      return { data, error: null }
    }
    catch (error) {
      console.error('Error signing up:', error)
      return { data: null, error }
    }
    finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    try {
      const { error } = await $supabase.auth.signOut()
      if (error)
        throw error
      user.value = null
      return { error: null }
    }
    catch (error) {
      console.error('Error signing out:', error)
      return { error }
    }
    finally {
      loading.value = false
    }
  }

  const signInWithGoogle = async () => {
    loading.value = true
    try {
      const { data, error } = await $supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      })
      if (error)
        throw error
      return { data, error: null }
    }
    catch (error) {
      console.error('Error signing in with Google:', error)
      return { data: null, error }
    }
    finally {
      loading.value = false
    }
  }

  const signInWithGithub = async () => {
    loading.value = true
    try {
      const { data, error } = await $supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      })
      if (error)
        throw error
      return { data, error: null }
    }
    catch (error) {
      console.error('Error signing in with GitHub:', error)
      return { data: null, error }
    }
    finally {
      loading.value = false
    }
  }

  // Listen to auth state changes
  if (import.meta.client) {
    $supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user ?? null
    })
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGithub,
    loadUser,
  }
}
