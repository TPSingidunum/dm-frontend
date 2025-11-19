<template>
  <div>
    <h1 class="text-center py-5 text-2xl font-bold">Shop</h1>
    
    <ProductRecommendedProducts @add-to-cart="addToShoppingCart" />

    <div class="p-10 pt-0 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <UCard v-for="product in products">
        <template #header>
          <UBadge>Sale</UBadge>
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
            <UButton class="cursor-pointer" icon="i-lucide-shopping-cart" @click="addToShoppingCart(product.product_id)" />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/Product';

const { trackEvent } = useEventTracking();
const products: Product[] = await $fetch("/api/shop");

function addToShoppingCart(id: number) {
  console.log("Adding product " + id + " to shopping cart")
  trackEvent(id, 'add_to_cart');
}

</script>