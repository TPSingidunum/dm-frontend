<template>
  <div v-if="recommendations.length > 0" class="mt-8">
    <h2 class="text-2xl font-bold mb-4">Recommended for You</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <UCard v-for="product in recommendations" :key="product.product_id">
        <template #header>
          <UBadge color="primary">Recommended</UBadge>
        </template>

        <NuxtLink :to="`/product/${product.slug}`">
          <NuxtImg class="mx-auto w-full" :src="product.img_url" />
          <p class="text-2xl font-bold pt-4">{{ product.name }}</p>
          <p class="text-gray-600">{{ product.description.substring(0,40) }}</p>
        </NuxtLink>

        <template #footer>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold">15$</p>
            </div>
            <UButton class="cursor-pointer" icon="i-lucide-shopping-cart" @click="$emit('addToCart', product.product_id)" />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/Product';

const { getUserId } = useEventTracking();
const recommendations = ref<Product[]>([]);

onMounted(async () => {
  try {
    const userId = getUserId();
    const data = await $fetch<Product[]>(`/api/recommendations/${userId}`);
    recommendations.value = data;
  } catch (error) {
    console.error('Failed to load recommendations:', error);
  }
});

defineEmits(['addToCart']);
</script>
