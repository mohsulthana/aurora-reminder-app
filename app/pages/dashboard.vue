<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <UContainer class="py-8">
    <UPageHeader
      title="Dashboard"
      description="Welcome to your dashboard."
    />

    <UPageBody>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            Overview
          </h3>
        </template>
        <p>This is your dashboard placeholder.</p>
      </UCard>
    </UPageBody>
  </UContainer>
</template>
