<template>
  <div>
    <h1 class="text-center py-5 text-2xl font-bold">Shop</h1>
    <div class="p-10 pt-0 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <UCard v-for="product in products">
        <template #header>
          <UBadge>Sale</UBadge>
        </template>

        <NuxtLink :to="`/product/${product.slug}`">
          <NuxtImg class="mx-auto w-full"
            src="https://gigatron.rs/_next/image?url=https%3A%2F%2Fbackend.gigatron.rs%2Fmedia%2Fcatalog%2Fproduct%2Fg%2Fo%2Fgoy_pkart_250218_eu_1__1.jpg&w=256&q=50" />
          <p class="text-2xl font-bold pt-4">{{ product.name }}</p>
          <p class="text-gray-600">{{ product.description }}</p>
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


const products: Product[] = await $fetch("/api/shop");

function addToShoppingCart(id: number) {
  console.log("Adding product " + id + " to shopping cart")
}

</script>