<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { NAlert, NAvatar, NButton, NTag, NUpload, useDialog } from "naive-ui";
import LoadingIndicator from "../../components/LoadingIndicator.vue";
import orderApis from "../../api/order.js";
import userApis from "../../api/user.js";
import { useAuthStore } from "../../stores/auth";
import { useUserStore } from "../../stores/user.js";
import { formatDateUi } from "../../utils/date.js";
import {
  FILE_STATUS_REMOVED,
  USER_ICON_PNG,
  VITE_API_BASE_URL,
} from "../../constants.js";

const fetchDataInProgress = ref(false);
const fetchDataSucceeded = ref(false);
const picture = ref(null);
const submitInProgress = ref(false);
const generalError = ref(null);

const auth = useAuthStore();
const user = useUserStore();

const cart = ref([]);
const wishlist = ref([]);
const orders = ref([]);

async function fetchData() {
  try {
    fetchDataInProgress.value = true;
    cart.value = await user.getCart(true);
    wishlist.value = await user.getWishlist(true);
    orders.value = await user.getOrders(true);
    console.log(orders.value);
    fetchDataSucceeded.value = true;
  } catch (e) {
    generalError.value = e.message;
  } finally {
    fetchDataInProgress.value = false;
  }
}

function onFileSelected(input) {
  if (input.file.status === FILE_STATUS_REMOVED) {
    picture.value = null;
  } else {
    picture.value = input.file.file;
  }
}

async function onSubmit() {
  try {
    submitInProgress.value = true;
    const formData = new FormData();
    formData.append("picture", picture.value);
    await userApis.updateUserPicture(auth.user.id, formData);
    window.location.reload();
  } catch (e) {
    generalError.value = e.message;
  } finally {
    submitInProgress.value = false;
  }
}

const dialog = useDialog();
function confirmOrderCancellation(orderId) {
  dialog.error({
    showIcon: false,
    title: "Are you sure?",
    content: "The selected order will be canclled",
    positiveText: "Yes, I'm sure",
    negativeText: "No",
    onPositiveClick: () => {
      cancelOrder(orderId);
    },
  });
}

async function cancelOrder(orderId) {
  try {
    await orderApis.cancelOrder(orderId);
    orders.value.forEach((order) => {
      if (order.id === orderId) {
        order.isCancelled = true;
      }
    });
  } catch (e) {
    generalError.value = e.message;
  }
}

onMounted(() => {
  fetchData();
});
</script>
<template>
  <n-alert v-if="generalError" title="Error" type="error" class="mb-4">
    {{ generalError }}
  </n-alert>
  <div class="text-center">
    <div class="flex justify-center mb-2">
      <n-avatar
        :src="`${
          auth.user
            ? `${VITE_API_BASE_URL}users/${auth.user.id}/picture`
            : USER_ICON_PNG
        }`"
        round
        :size="200"
      />
    </div>
    <div>
      <n-upload accept=".jpg,.jpeg" :on-change="onFileSelected">
        <n-button>Select New Profile Picture</n-button>
      </n-upload>
      <n-button @click="onSubmit" :disabled="picture === null" type="primary">
        <template v-if="submitInProgress">
          <loading-indicator size="lg" />
        </template>
        <template v-else>Change</template>
      </n-button>
    </div>
  </div>
  <div class="mt-5">
    <loading-indicator v-if="fetchDataInProgress" />
    <template v-if="fetchDataSucceeded">
      <div class="grid grid-cols-12">
        <div class="col-span-12">
          <!-- Header -->
          <div class="flex justify-center items-center mb-2">
            <fa-icon :icon="['fas', 'truck']" size="lg" />
            <div class="font-semibold text-black text-lg text-center ml-1">
              Orders
            </div>
          </div>
          <!-- Header ends -->

          <!-- Orders -->
          <div
            v-for="order in orders"
            :key="order.id"
            class="grid grid-cols-12 p-2 mb-1 bg-slate-200 rounded"
          >
            <div class="col-span-9">
              <div class="flex items-center">
                <router-link
                  :to="{
                    name: 'customer-product-details',
                    params: { productId: order.product.id },
                  }"
                >
                  <div class="font-semibold text-md">
                    {{ order.product.title }}
                  </div>
                </router-link>
                <n-tag
                  v-if="order.isCancelled"
                  type="error"
                  size="small"
                  round
                  class="ml-1"
                >
                  Cancelled
                </n-tag>
              </div>
              <div v-if="order.product.description">
                {{ order.product.description }}
              </div>
              <div v-if="order.orderDate">
                {{ formatDateUi(order.orderDate) }} -
                {{ formatDateUi(order.deliveryDate) }}
              </div>
            </div>
            <div
              v-if="!order.isCancelled"
              class="col-span-3 flex justify-end items-center"
            >
              <n-button
                @click="confirmOrderCancellation(order.id)"
                size="medium"
              >
                Cancel
              </n-button>
            </div>
          </div>
          <div v-if="orders.length === 0" class="text-center">
            No orders found
          </div>
          <!-- Orders end -->
        </div>
        <div class="col-span-12 lg:col-span-6 p-1">
          <!-- Header -->
          <div class="flex justify-center items-center mb-2">
            <fa-icon :icon="['fas', 'cart-shopping']" size="lg" />
            <div class="font-semibold text-black text-lg text-center ml-1">
              Cart
            </div>
          </div>
          <!-- Header ends -->

          <!-- Cart Products -->
          <div
            v-for="product in cart"
            :key="product.id"
            class="grid grid-cols-12 p-2 mb-1 bg-slate-200 rounded"
          >
            <div class="col-span-9">
              <router-link
                :to="{
                  name: 'customer-product-details',
                  params: { productId: product.id },
                }"
              >
                <div class="font-semibold text-md">
                  {{ product.title }}
                </div>
              </router-link>
              <div v-if="product.description">
                {{ product.description }}
              </div>
            </div>
            <div class="col-span-3 font-semibold text-right">
              {{ product.price }}Rs
            </div>
          </div>
          <div v-if="cart.length === 0" class="text-center">
            Nothing in cart
          </div>
          <!-- Cart products end -->
        </div>
        <div class="col-span-12 lg:col-span-6 p-1">
          <!-- Header -->
          <div class="flex justify-center items-center mb-2">
            <fa-icon :icon="['fas', 'heart']" size="lg" />
            <div class="font-semibold text-black text-lg text-center ml-1">
              Wishlist
            </div>
          </div>
          <!-- Header ends -->

          <!-- Wishlist products -->
          <div
            v-for="product in wishlist"
            :key="product.id"
            class="grid grid-cols-12 p-2 mb-1 bg-slate-200 rounded"
          >
            <div class="col-span-9">
              <router-link
                :to="{
                  name: 'customer-product-details',
                  params: { productId: product.id },
                }"
              >
                <div class="font-semibold text-md">
                  {{ product.title }}
                </div>
              </router-link>
              <div v-if="product.description">
                {{ product.description }}
              </div>
            </div>
            <div class="col-span-3 font-semibold text-right">
              {{ product.price }}Rs
            </div>
          </div>
          <div v-if="wishlist.length === 0" class="text-center">
            Nothing in wishlist
          </div>
          <!-- Wishlist products end -->
        </div>
      </div>
    </template>
  </div>
</template>
