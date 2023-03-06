<script setup>
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import { NConfigProvider, NDialogProvider, NGlobalStyle } from "naive-ui";
import LayoutBasic from "./layouts/LayoutBasic.vue";
import LayoutSideNav from "./layouts/LayoutSideNav.vue";
import themeOverrides from "./libs/naive-ui";

const LAYOUT_BASIC = "basic";
const route = useRoute();

const layout = computed(() => {
  return route.meta.layout === LAYOUT_BASIC ? LayoutBasic : LayoutSideNav;
});
</script>
<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <component :is="layout">
        <router-view />
      </component>
      <n-global-style />
    </n-dialog-provider>
  </n-config-provider>
</template>
