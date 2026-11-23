<!-- Day 4 targeting preview: reads /ml/campaigns/... via the Nuxt proxy to :3001; sends nothing. -->
<template>
  <UCard>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-lg font-bold">Targeting preview · campaign {{ campaignId }}</h2>
        <div class="flex items-center gap-2">
          <USelect
            v-model="mode"
            :items="[
              { label: 'ML (decision score)', value: 'ml' },
              { label: 'Rule (recent buyers)', value: 'rule' }
            ]"
            class="w-52"
          />
          <UButton class="cursor-pointer" :loading="loading" @click="load">Load preview</UButton>
        </div>
      </div>
    </template>

    <UAlert v-if="error" color="error" variant="subtle" :title="error" class="mb-4" />

    <template v-if="audience">
      <p class="text-sm text-gray-600 mb-3">
        {{ audience.limit_applied }} contacts limit · {{ audience.totals.contacts }} selected ·
        cost €{{ audience.totals.cost }} · expected profit €{{ audience.totals.expected_profit }}
        <span v-if="audience.excluded">
          · excluded: missing {{ audience.excluded.missing_count }}, too low {{ audience.excluded.too_low_count }}, not worth {{ audience.excluded.not_worth_count }}
        </span>
      </p>

      <table class="w-full text-sm border-collapse mb-4">
        <thead>
          <tr class="border-b text-left">
            <th class="py-1.5 pr-3">#</th>
            <th class="py-1.5 pr-3">Customer</th>
            <th class="py-1.5 pr-3">Segment</th>
            <th class="py-1.5 pr-3">P(buy 7d)</th>
            <th class="py-1.5 pr-3">Value €</th>
            <th class="py-1.5">Score €</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in audience.audience" :key="row.customer_id" class="border-b last:border-b-0">
            <td class="py-1.5 pr-3">{{ row.rank }}</td>
            <td class="py-1.5 pr-3">{{ row.customer_id }}</td>
            <td class="py-1.5 pr-3">{{ row.segment }}</td>
            <td class="py-1.5 pr-3">{{ row.probability ?? 'n/a' }}</td>
            <td class="py-1.5 pr-3">{{ row.value }}</td>
            <td class="py-1.5">{{ row.score ?? 'n/a' }}</td>
          </tr>
        </tbody>
      </table>
    </template>

    <div v-if="comparison" class="text-sm space-y-1 border-t pt-3">
      <p>
        Score vs rule: {{ comparison.overlap.both.length }} in both ({{ comparison.overlap.both.join(', ') || 'none' }}) ·
        score expected profit €{{ comparison.score.totals.expected_profit }} vs
        rule expected profit €{{ comparison.rule.totals.expected_profit }}
      </p>
      <p class="text-xs text-gray-500">{{ comparison.note }}</p>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
interface AudienceRow {
  rank: number
  customer_id: number
  segment: string
  probability: number | null
  value: number
  expected_value: number | null
  score: number | null
}

interface Totals {
  contacts: number
  cost: number
  expected_purchases: number
  expected_net_value: number
  expected_profit: number
  unscored: number
}

interface AudienceResponse {
  campaign_id: number
  mode: string
  limit_applied: number
  audience: AudienceRow[]
  totals: Totals
  excluded: Record<string, number> | null
}

interface ComparisonResponse {
  campaign_id: number
  limit_applied: number
  score: { customer_ids: number[]; totals: Totals }
  rule: { customer_ids: number[]; totals: Totals }
  overlap: { both: number[]; only_score: number[]; only_rule: number[] }
  note: string
}

const props = defineProps<{ campaignId: number }>()
const mode = ref<'ml' | 'rule'>('ml')
const audience = ref<AudienceResponse | null>(null)
const comparison = ref<ComparisonResponse | null>(null)
const loading = ref(false)
const error = ref('')

async function load() {
  error.value = ''
  loading.value = true
  try {
    const base = `/ml/campaigns/${props.campaignId}`
    audience.value = await $fetch<AudienceResponse>(`${base}/recommended-audience`, { query: { mode: mode.value, limit: 5 } })
    comparison.value = await $fetch<ComparisonResponse>(`${base}/targeting-comparison`, { query: { limit: 5 } })
  } catch (e: unknown) {
    const status = (e as { statusCode?: number })?.statusCode
    error.value = status === 400 || status === 404 ? 'Campaign does not exist' : 'ML API unavailable'
  } finally {
    loading.value = false
  }
}

watch(() => props.campaignId, () => {
  audience.value = null
  comparison.value = null
  error.value = ''
})
</script>
