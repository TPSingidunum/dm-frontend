<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-default' }">
      <template #header="{ collapsed }">
        <p v-if="!collapsed" class="text-2xl font-bold w-full shrink-0">DM</p>
        <UIcon v-else name="i-simple-icons-nuxtdotjs" class="size-5 text-primary mx-auto" />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" />
        <UNavigationMenu :collapsed="collapsed" :items="items[1]" orientation="vertical" class="mt-auto" />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute()

const items: NavigationMenuItem[][] = [[
  {
    label: 'Frontend Page',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: 'Dashboard',
    icon: 'i-lucide-house',
    to: '/admin',
    active: route.path == "/admin"
  },
  {
    label: 'Categories',
    icon: 'i-lucide-inbox',
    to: '/admin/category',
    active: route.path == '/admin/category'
  },
  {
    label: 'Products',
    icon: 'i-lucide-inbox',
    to: '/admin/product',
    active: route.path.startsWith('/admin/product')
  },
  {
    label: 'Events',
    icon: 'i-lucide-inbox',
    to: '/admin/event',
    active: route.path.startsWith('/admin/event')
  },
  {
    label: 'Marketing',
    icon: 'i-lucide-inbox',
    to: '/admin/marketing',
    active: route.path.startsWith('/admin/marketing')
  }
]]
</script>