<template>
  <div class="px-10 pt-4">
    <UButton icon="i-lucide-arrow-left-to-line" @click="router.back" />
  </div>
  <div class="grid grid-cols-3 gap-2 px-20 pt-5">
    <div class="col-span-2 h-full">
      <NuxtImg class="mx-auto w-1/2 border" :src="data.img_url" />
      <p class="pt-5">
        {{ data.description }}
      </p>
    </div>
    <div>
      <div>
        <h1>Recomendations</h1>
        <div v-for="r in recomendations">
          {{  r.name }}
        </div>
      </div>
    </div>
    <div class="relative">
      <div class="fixed px-5 py-5 border-2 rounded-lg w-[300px]">
        <UBadge color="error">Sale</UBadge>
        <p class="text-2xl font-bold pt-4">{{ data.name }}</p>
        <p class="text-gray-600">{{ data.description }}</p>
        <p class="text-2xl pb-2 font-bold">15$</p>
        <UButton @click="addToCart(data.product_id)" class="w-full mb-2 cursor-pointer">Add to cart</UButton>
        <UButton @click="buy(data.product_id)" variant="outline" class="w-full cursor-pointer">Buy</UButton>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/Product';

const router = useRouter()
const route = useRoute()
const toast = useToast()
const slug = route.params.slug;

const data: Product = await $fetch("/api/product/" + slug)

// onMounted -> Does a task during the page render 
onMounted(async () => {
  trackEvent('view', data.product_id)
})

const recomendations = ref([])
onMounted(async () => {
  recomendations.value = await $fetch("/ml/recommendations/"+data.product_id)
})

useSeoMeta({
  title: data.seo?.title,
  ogTitle: data.seo?.title,
  description: data.seo?.description.substring(0, 150) + " ...",
  ogDescription: data.seo?.description.substring(0, 150) + " ...",
  ogImage: data.img_url,
  ogUrl: 'http://localhost:3000/product/' + slug,
  twitterTitle: data.seo?.title,
  twitterDescription: data.seo?.description.substring(0, 150) + " ...",
  twitterImage: data.img_url,
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/ico',
      href: '/favicon.ico'
    }
  ],
  meta: [
    { name: 'keywords', content: data.seo?.key_words.join(", ") },
  ],

})

async function addToCart(product_id: number) {
  const result = await addToShoppingCartEvent(product_id);
  if (result) {
    toast.add({
      title: 'Succsessfully added to shopping cart',
      description: data.name,
      icon: 'i-lucide-calendar-days'
    })
  }
}

async function buy(product_id: number) {
  const result = await buyProductEvent(product_id);
  if (result) {
    toast.add({
      title: 'Succsessfully bought item',
      description: data.name,
      icon: 'i-lucide-calendar-days'
    })
  }
}
</script>
