<script setup>
import { useThemeVars } from "naive-ui";
import ButtonLink from "./ButtonLink.vue";

defineProps({
  text: String,
  actionText: String,
  actionTo: Object,
});

const themeVars = useThemeVars();
</script>

<template>
  <h1
    class="text-3xl font-semibold mb-8 flex justify-between"
    :style="{ 'min-height': themeVars.heightLarge }"
  >
    <span>{{ text }}</span>
    <button-link
      :text="actionText"
      :to="actionTo"
      type="primary"
      size="large"
      v-if="actionText !== undefined"
    />
  </h1>
</template>
