<template>
  <div>
    <h1 class="text-center pt-10 text-2xl font-bold">Product</h1>
    <div class="p-10 grid grid-cols-3 gap-2">
      <UBlogPost
        v-for="product in products"
        class="w-[400px]"
        :title="product.name"
        :description="product.description"
        :to="`/product/${product.slug}`"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>

const products = await $fetch("/api/product");

</script>