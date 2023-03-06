<script setup>
import { computed } from "vue";
import { NMenu } from "naive-ui";
import { useAuthStore } from "../stores/auth";
import { renderIcon, renderRouterLink } from "../utils/naive-ui";

const auth = useAuthStore();

const adminMenuOptions = [
  {
    label: renderRouterLink("admin-categories", "Categories"),
    key: "categories",
    icon: renderIcon(["fas", "shapes"]),
  },
  {
    label: renderRouterLink("admin-products", "Products"),
    key: "products",
    icon: renderIcon(["fas", "cart-shopping"]),
  },
  {
    label: renderRouterLink("admin-users", "Users"),
    key: "users",
    icon: renderIcon(["fas", "users"]),
  },
];

const sellerMenuOptions = [
  {
    label: renderRouterLink("seller-products", "Products"),
    key: "products",
    icon: renderIcon(["fas", "cart-shopping"]),
  },
  {
    label: renderRouterLink("seller-brands", "Brands"),
    key: "brands",
    icon: renderIcon(["fas", "building"]),
  },
  {
    label: renderRouterLink("seller-orders", "Orders"),
    key: "orders",
    icon: renderIcon(["fas", "truck"]),
  },
];

const menuOptions = computed(() =>
  auth.isAnAdmin ? adminMenuOptions : sellerMenuOptions
);
</script>

<template>
  <div class="side-nav">
    <div class="px-14 py-3 w-60 h-16 mb-2" />
    <n-menu :indent="20" :options="menuOptions" />
  </div>
</template>
