<template>
  <div>
    <div class="px-10 flex items-center">
      <UButton icon="i-lucide-arrow-left-to-line" @click="router.back" />
      <h1 class="text-center text-2xl font-bold py-4 mx-auto">{{ data.category.name }}</h1>
    </div>
    <div class="p-10 pt-0 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <UCard v-for="product in data.products">
        <template #header>
          <UBadge>Sale</UBadge>
        </template>

        <NuxtLink :to="`/product/${product.slug}`">
          <NuxtImg class="mx-auto w-full" :src="product.img_url" />
          <p class="text-2xl font-bold pt-4">{{ product.name }}</p>
          <p class="text-gray-600">{{ product.description }}</p>
        </NuxtLink>

        <template #footer>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold">15$</p>
            </div>
            <UButton class="cursor-pointer" icon="i-lucide-shopping-cart"
              @click="addToShoppingCart(product.product_id)" />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Category } from '~/types/Category';
import type { Product } from '~/types/Product';

const router = useRouter()
const route = useRoute()
const slug = route.params.slug;

interface CategoryData {
  category: Category
  products: Product[]
}

const data: CategoryData  = await $fetch("/api/category/" + slug);

function addToShoppingCart(id: number) {
  console.log("Adding product " + id + " to shopping cart")
}

</script>