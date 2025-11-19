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
    <div class="relative">
      <div class="fixed px-5 py-5 border-2 rounded-lg w-[300px]">
        <UBadge color="error">Sale</UBadge>
        <p class="text-2xl font-bold pt-4">{{ data.name }}</p>
        <p class="text-gray-600">{{ data.description }}</p>
        <p class="text-2xl font-bold">15$</p>
        <UButton class="w-full">Add to cart</UButton>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/Product';

const router = useRouter()
const route = useRoute()
const slug = route.params.slug;

const data: Product = await $fetch("/api/product/" + slug)

useSeoMeta({
  title: data.seo?.title, 
  ogTitle: data.seo?.title,
  description: data.seo?.description.substring(0,150) + " ...",
  ogDescription: data.seo?.description.substring(0,150) + " ...",
  ogImage: data.img_url, 
  ogUrl: 'http://localhost:3000/product/' + slug,
  twitterTitle: data.seo?.title,
  twitterDescription: data.seo?.description.substring(0,150) + " ...",
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
</script>
