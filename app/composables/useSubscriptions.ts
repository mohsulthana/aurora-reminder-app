export type BillingCycle = 'weekly' | 'monthly' | 'yearly'

export interface Subscription {
  id: string
  user_id: string
  name: string
  amount: number
  currency: string
  billing_cycle: BillingCycle
  next_billing_date: string
  status: 'active' | 'cancelled'
  created_at?: string
  updated_at?: string
}

type SubscriptionPayload = Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>

const subscriptions = ref<Subscription[]>([])
const loading = ref(false)

export function useSubscriptions() {
  const { $supabase } = useNuxtApp()
  const { user } = useAuth()

  const fetchSubscriptions = async () => {
    if (!user.value) {
      console.error('User not authenticated')
      return
    }

    loading.value = true
    try {
      const { data, error } = await $supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.value.id)
        .order('next_billing_date', { ascending: true })

      if (error)
        throw error
      subscriptions.value = data || []
    }
    catch (error) {
      console.error('Error fetching subscriptions:', error)
      subscriptions.value = []
    }
    finally {
      loading.value = false
    }
  }

  const createSubscription = async (payload: SubscriptionPayload) => {
    if (!user.value) {
      console.error('User not authenticated')
      return { data: null, error: new Error('Not authenticated') }
    }

    loading.value = true
    try {
      const { data, error } = await $supabase
        .from('subscriptions')
        .insert({
          ...payload,
          user_id: user.value.id,
        })
        .select()
        .single()

      if (error)
        throw error

      // Add to local state
      if (data) {
        subscriptions.value.push(data)
      }

      return { data, error: null }
    }
    catch (error) {
      console.error('Error creating subscription:', error)
      return { data: null, error }
    }
    finally {
      loading.value = false
    }
  }

  const updateSubscription = async (
    id: string,
    payload: Partial<Omit<Subscription, 'id' | 'user_id'>>,
  ) => {
    if (!user.value) {
      console.error('User not authenticated')
      return { data: null, error: new Error('Not authenticated') }
    }

    loading.value = true
    try {
      const { data, error } = await $supabase
        .from('subscriptions')
        .update(payload)
        .eq('id', id)
        .eq('user_id', user.value.id)
        .select()
        .single()

      if (error)
        throw error

      // Update local state
      if (data) {
        const index = subscriptions.value.findIndex(s => s.id === id)
        if (index !== -1) {
          subscriptions.value[index] = data
        }
      }

      return { data, error: null }
    }
    catch (error) {
      console.error('Error updating subscription:', error)
      return { data: null, error }
    }
    finally {
      loading.value = false
    }
  }

  const deleteSubscription = async (id: string) => {
    if (!user.value) {
      console.error('User not authenticated')
      return { error: new Error('Not authenticated') }
    }

    loading.value = true
    try {
      const { error } = await $supabase
        .from('subscriptions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.value.id)

      if (error)
        throw error

      // Remove from local state
      subscriptions.value = subscriptions.value.filter(s => s.id !== id)

      return { error: null }
    }
    catch (error) {
      console.error('Error deleting subscription:', error)
      return { error }
    }
    finally {
      loading.value = false
    }
  }

  const getSubscription = async (id: string) => {
    if (!user.value) {
      console.error('User not authenticated')
      return { data: null, error: new Error('Not authenticated') }
    }

    loading.value = true
    try {
      const { data, error } = await $supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.value.id)
        .single()

      if (error)
        throw error
      return { data, error: null }
    }
    catch (error) {
      console.error('Error fetching subscription:', error)
      return { data: null, error }
    }
    finally {
      loading.value = false
    }
  }

  return {
    subscriptions: readonly(subscriptions),
    loading: readonly(loading),
    fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    getSubscription,
  }
}
