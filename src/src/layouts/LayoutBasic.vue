<script setup>
import { computed } from "vue";
import { NLayout, NLayoutContent, NLayoutHeader } from "naive-ui";
import { useAuthStore } from "../stores/auth";
import PageHeader from "../components/PageHeader.vue";

const auth = useAuthStore();

const isALoggedInCustomer = computed(
  () => auth.isAuthenticated && auth.isACustomer
);
</script>

<template>
  <n-layout class="layout" position="absolute" has-sider>
    <n-layout>
      <n-layout-header
        v-if="isALoggedInCustomer"
        class="layout-header"
        position="absolute"
      >
        <page-header />
      </n-layout-header>
      <n-layout-content
        class="layout-content"
        :class="{ 'layout-content-padding': isALoggedInCustomer }"
      >
        <slot />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.layout-header {
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  height: 64px;
  z-index: 11;
}
.layout-content {
  background-color: #f5f7f9;
  min-height: 100vh;
}

.layout-content-padding {
  padding: 75px 10px 10px 10px;
}
</style>
