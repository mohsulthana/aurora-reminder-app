export default defineNuxtRouteMiddleware(async (to) => {
  const { user, loadUser } = useAuth()

  // Load user if not already loaded
  if (!user.value) {
    await loadUser()
  }

  // Protect /app routes
  if (to.path.startsWith('/app')) {
    if (!user.value) {
      return navigateTo('/auth/login')
    }
  }

  // Redirect authenticated users away from auth pages
  if (to.path.startsWith('/auth/') && user.value) {
    return navigateTo('/app')
  }
})
