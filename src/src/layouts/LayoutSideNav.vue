<script setup>
import { NLayout, NLayoutContent, NLayoutHeader, NLayoutSider } from "naive-ui";
import PageHeader from "../components/PageHeader.vue";
import SideNav from "../components/SideNav.vue";
</script>

<template>
  <n-layout class="layout" position="absolute" has-sider>
    <n-layout-sider class="layout-sider" :width="240">
      <side-nav />
    </n-layout-sider>
    <n-layout>
      <n-layout-header class="layout-header" position="absolute">
        <page-header />
      </n-layout-header>
      <n-layout-content class="layout-content">
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

.layout-sider {
  box-shadow: rgb(29 35 41 / 5%) 2px 0px 8px;
  z-index: 13;
}

.layout-content {
  background-color: #f5f7f9;
  min-height: 100vh;
  padding: 96px 32px 32px 32px;
}
</style>
