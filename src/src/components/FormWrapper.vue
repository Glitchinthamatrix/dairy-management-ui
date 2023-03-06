<script setup>
defineProps({
  gridColClass: {
    type: String,
    default: "xl:col-span-6 lg:col-span-8 md:col-span-10 col-span-12",
  },
});
</script>

<template>
  <div class="grid grid-cols-12">
    <div :class="gridColClass">
      <slot />
    </div>
  </div>
</template>
