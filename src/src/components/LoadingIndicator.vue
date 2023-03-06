<script setup>
defineProps({
  size: {
    type: String,
    default: "2x",
  },
});
</script>

<template>
  <div class="text-center">
    <fa-icon :icon="['fas', 'spinner']" :size="size" spin />
  </div>
</template>
