<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
{
    label: 'Home',
    to: '/',
    active: route.path == "/"
  },
  {
    label: 'Shop',
    to: '/shop',
    active: route.path.startsWith('/shop')
  },
  {
    label: 'Category',
    to: '/category',
    active: route.path.startsWith('/category')
  },
])
</script>

<template>
  <UApp>
    <UHeader>
        <UNavigationMenu :items="items" />
    </UHeader>

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <UFooter />
  </UApp>
</template>
