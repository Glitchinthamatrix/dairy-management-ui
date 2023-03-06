<script setup>
import { NBreadcrumb, NBreadcrumbItem } from "naive-ui";
import { useBreadcrumbStore } from "../stores/breadcrumb";

const breadcrumbStore = useBreadcrumbStore();
</script>

<template>
  <n-breadcrumb separator=">" v-if="breadcrumbStore.breadcrumbs !== null">
    <n-breadcrumb-item
      v-for="(breadcrumbItem, index) in breadcrumbStore.breadcrumbs"
      :key="index"
    >
      <template v-if="breadcrumbItem.to !== undefined">
        <router-link :to="breadcrumbItem.to">
          {{ breadcrumbItem.name }}
        </router-link>
      </template>
      <template v-else>
        {{ breadcrumbItem.name }}
      </template>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>
