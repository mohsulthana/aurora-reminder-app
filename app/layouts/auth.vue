<template>
  <div class="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
    <UButton
      icon="i-lucide-chevron-left"
      to="/"
      size="sm"
      color="neutral"
      variant="ghost"
      class="absolute left-4 top-4 sm:left-8 sm:top-8 z-10"
    />

    <div class="w-full max-w-md">
      <slot />
    </div>
  </div>
</template>
