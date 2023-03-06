<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { NDropdown, NAvatar } from "naive-ui";
import { useAuthStore } from "../stores/auth";
import Breadcrumb from "./Breadcrumb.vue";
import { VITE_API_BASE_URL, USER_ICON_PNG } from "../constants.js";

const auth = useAuthStore();
const router = useRouter();

const isAnAdmin = computed(() => auth.isAnAdmin);
const isASeller = computed(() => auth.isASeller);
const isACustomer = computed(() => auth.isACustomer);

const dropdownOptions = computed(() => {
  return [
    {
      label: auth.userName,
      key: "username",
      disabled: true,
      props: {
        class: "username",
      },
    },
    {
      type: "divider",
      key: "user-divider",
    },
    {
      type: "divider",
      key: "user-divider",
    },
    {
      label: "Home",
      key: "home",
    },
    {
      type: "divider",
      key: "user-divider",
    },
    {
      label: "Profile",
      key: "profile",
    },
    {
      type: "divider",
      key: "user-divider",
    },
    {
      label: "Logout",
      key: "logout",
    },
  ];
});

function handleOptionSelect(key) {
  if (key === "profile") {
    if (isASeller.value) {
      router.push({ name: "seller-profile" });
    } else if (isACustomer.value) {
      router.push({ name: "customer-profile" });
    }
  } else if (key === "home") {
    if (isASeller.value) {
      router.push({ name: "seller-home" });
    } else if (isAnAdmin.value) {
      router.push({ name: "admin-home" });
    } else {
      router.push({ name: "customer-products" });
    }
  } else if (key === "logout") {
    logout();
  }
}

function logout() {
  router.push({ name: "login" });
  auth.logout();
}
</script>

<template>
  <div class="layout-header">
    <div class="layout-header-left">
      <breadcrumb />
    </div>
    <div class="layout-header-right">
      <n-dropdown
        :options="dropdownOptions"
        @select="handleOptionSelect"
        trigger="click"
        size="large"
        :show-arrow="true"
      >
        <n-avatar
          :src="`${
            auth.user
              ? `${VITE_API_BASE_URL}users/${auth.user.id}/picture`
              : USER_ICON_PNG
          }`"
          :fallback-src="USER_ICON_PNG"
          size="large"
          round
          class="cursor-pointer"
        />
      </n-dropdown>
    </div>
  </div>
</template>

<style>
.n-dropdown-menu
  .n-dropdown-option
  .n-dropdown-option-body.n-dropdown-option-body--disabled.username {
  opacity: 1;
  font-weight: bold;
}
</style>

<style scoped>
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}
</style>
