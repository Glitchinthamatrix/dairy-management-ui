<script setup>
import { useRouter } from "vue-router";
import { NButton } from "naive-ui";

const router = useRouter();

const props = defineProps({
  text: String,
  to: Object,
  type: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "large",
  },
});

function onClick() {
  router.push(props.to);
}
</script>

<template>
  <n-button :type="type" :size="size" @click="onClick">
    {{ text }}
  </n-button>
</template>
