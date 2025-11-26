<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
})

const { user } = useAuth()

const heroLinks = computed(() => {
  if (user.value) {
    return [{
      label: 'Go to Dashboard',
      icon: 'i-lucide-layout-dashboard',
      trailing: true,
      to: '/dashboard',
      size: 'xl' as const,
    }]
  }

  return [{
    label: 'Get started',
    icon: 'i-lucide-arrow-right',
    trailing: true,
    to: '/signup',
    size: 'xl' as const,
  }, {
    label: 'Sign in',
    icon: 'i-lucide-log-in',
    size: 'xl' as const,
    variant: 'subtle' as const,
    color: 'neutral' as const,
    to: '/login',
  }]
})

const ctaLinks = computed(() => {
  if (user.value) {
    return [{
      label: 'Go to Dashboard',
      icon: 'i-lucide-layout-dashboard',
      trailing: true,
      to: '/dashboard',
      size: 'xl' as const,
    }]
  }

  return [{
    label: 'Get started',
    icon: 'i-lucide-arrow-right',
    trailing: true,
    to: '/signup',
    size: 'xl' as const,
  }, {
    label: 'Sign in',
    icon: 'i-lucide-log-in',
    size: 'xl' as const,
    variant: 'subtle' as const,
    color: 'neutral' as const,
    to: '/login',
  }]
})
</script>

<template>
  <div v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="heroLinks"
    >
      <template #top>
        <HeroBackground />
      </template>

      <template #title>
        <MDC
          :value="page.title"
          unwrap="p"
        />
      </template>

      <ImagePlaceholder />
    </UPageHero>

    <UPageSection
      v-for="(section, index) in page.sections"
      :key="index"
      :title="section.title"
      :description="section.description"
      :orientation="section.orientation"
      :reverse="section.reverse"
      :features="section.features"
    >
      <ImagePlaceholder />
    </UPageSection>

    <UPageSection
      :title="page.features.title"
      :description="page.features.description"
    >
      <UPageGrid>
        <UPageCard
          v-for="(item, index) in page.features.items"
          :key="index"
          v-bind="item"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      id="testimonials"
      :headline="page.testimonials.headline"
      :title="page.testimonials.title"
      :description="page.testimonials.description"
    >
      <UPageColumns class="xl:columns-4">
        <UPageCard
          v-for="(testimonial, index) in page.testimonials.items"
          :key="index"
          variant="subtle"
          :description="testimonial.quote"
          :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]' }"
        >
          <template #footer>
            <UUser
              v-bind="testimonial.user"
              size="lg"
            />
          </template>
        </UPageCard>
      </UPageColumns>
    </UPageSection>

    <USeparator />

    <UPageCTA
      v-bind="page.cta"
      :links="ctaLinks"
      variant="naked"
      class="overflow-hidden"
    >
      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
