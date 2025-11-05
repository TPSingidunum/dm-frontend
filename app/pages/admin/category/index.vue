<template>
  <div class="w-full">
    <UDashboardNavbar title="Categories">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>
    <div>
      <div class="p-5">
        <div class="flex flex-col flex-1 w-full">
          <div class="flex py-3.5">
            <!-- <UInput :model-value="table?.tableApi?.getColumn('name')?.getFilterValue() as string" class="max-w-sm"
              placeholder="Filter name..."/> -->
            <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter name..."/>
          </div>

          <UTable ref="table" :data="categories" v-model:global-filter="globalFilter" :columns="columns" class="flex-1" :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
            td: 'border-b border-default',
            separator: 'h-0'
          }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui';
import type { Category } from '~/types/Category';
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

definePageMeta({
  layout: 'admin'
})

const toast = useToast()
const { copy } = useClipboard()
const table = useTemplateRef('table')
const categories: Category[] = await $fetch("/api/category");

// export interface Category {
//   category_id: number
//   name: string
//   slug: string
// }

const globalFilter = ref('')

const columns: TableColumn<Category>[] = [
  {
    accessorKey: 'category_id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('category_id')}`
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.getValue('name')
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => row.getValue('slug')
  },
  {
    accessorKey: 'created_at',
    header: 'Created at',
    cell: ({ row }) => {
      return new Date(row.getValue('created_at')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    }
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated at',
    cell: ({ row }) => {
      return new Date(row.getValue('updated_at')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row),
            'aria-label': 'Actions dropdown'
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown'
            })
        )
      )
    }
  }
]

function getRowItems(row: Row<Category>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy category ID',
      onSelect() {
        copy(row.original.category_id.toString())

        toast.add({
          title: 'Category ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Edit customer'
    },
  ]
}
</script>