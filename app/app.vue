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
    label: 'Product',
    to: '/product',
    active: route.path.startsWith('/product')
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
