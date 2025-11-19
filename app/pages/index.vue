<template>
  <div class="p-10">
    <h1 class="text-center py-5 text-3xl font-bold">Welcome to DM Store</h1>
    
    <ProductRecommendedProducts @add-to-cart="addToShoppingCart" />

    <div class="text-center mt-8">
      <NuxtLink to="/shop">
        <UButton size="lg">Browse All Products</UButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { trackEvent } = useEventTracking();

function addToShoppingCart(id: number) {
  console.log("Adding product " + id + " to shopping cart")
  trackEvent(id, 'add_to_cart');
}
</script>
