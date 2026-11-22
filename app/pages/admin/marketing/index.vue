<template>
  <div class="w-full">
    <UDashboardNavbar title="Marketing">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>

    <div class="p-5 space-y-4">
      <UAlert v-if="loadError" color="warning" variant="subtle" :title="loadError" />

      <div class="flex items-center gap-3">
        <span class="text-sm font-medium">Campaign</span>
        <USelect v-model="selectedCampaignId" :items="campaignItems" class="w-72" />
      </div>

      <TargetingPreview :campaign-id="selectedCampaignId" />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Campaign {
  id: number
  name: string
  channel: string
  budget: number
  contact_cost: number
  max_contacts: number
}

definePageMeta({
  layout: 'admin'
})

const campaigns = ref<Campaign[]>([])
const selectedCampaignId = ref(1)
const loadError = ref('')

const campaignItems = computed(() =>
  campaigns.value.length > 0
    ? campaigns.value.map(c => ({ label: `${c.id} · ${c.name} (${c.channel})`, value: c.id }))
    : [{ label: 'Campaign 1', value: 1 }, { label: 'Campaign 2', value: 2 }, { label: 'Campaign 3', value: 3 }]
)

onMounted(async () => {
  try {
    const data = await $fetch<Campaign[]>('/ml/campaigns')
    campaigns.value = data
    if (data[0]) {
      selectedCampaignId.value = data[0].id
    }
  } catch {
    loadError.value = 'Could not load /ml/campaigns — make sure the ML backend is running on port 3001.'
  }
})
</script>
