<template>
  <div class="grid grid-cols-3 gap-2 px-20 pt-5">
    <div class="col-span-2 h-full">
      <NuxtImg class="mx-auto w-1/2 border"
        src="https://gigatron.rs/_next/image?url=https%3A%2F%2Fbackend.gigatron.rs%2Fmedia%2Fcatalog%2Fproduct%2Fg%2Fo%2Fgoy_pkart_250218_eu_1__1.jpg&w=256&q=50" />
      <p class="pt-5">
        On the edge of Japan's snowy north, in the shadow of the imposing Yōtei mountain, your new journey begins. Here
        the world changes - nature is wild, the sky lights up with auroras, and every path leads to the unknown. In the
        role of the warrior Atsu, you head to unexplored regions, far from the famous feudal Japan. Every step through
        the snow, fields of flowers or dense forests reveals part of the story, part of the past, but also a clue to the
        future.
        Ghost of Yōtei has been carefully crafted for PlayStation 5. Thanks to the powerful hardware, the graphics are
        breathtaking and the world is detailed, vivid and completely immersive. On the PlayStation 5 Pro console,
        everything looks even better – with even better performance and sharper visuals. Atsu's story is not just about
        fighting. Behind every conflict lies a deeper struggle - with one's own past. Each mission brings her closer to
        healing and restoring what she lost. Her quest is not revenge, but the hope that she can find peace again.
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

const route = useRoute()
const slug = route.params.slug;

const data: Product = await $fetch("/api/product/" + slug)

</script>
