<script setup>
import { NAlert, NSwitch, NTag } from "naive-ui";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import orderApis from "../../../api/order.js";
import LoadingIndicator from "../../../components/LoadingIndicator.vue";
import PageTitle from "../../../components/PageTitle.vue";
import { formatDateUi } from "../../../utils/date.js";

const fetchOrdersInProgress = ref(false);
const fetchOrdersSucceeded = ref(false);
const generalError = ref(null);
const orders = ref([]);
const areCancelledOrdersHidden = ref(false);

onMounted(() => {
  fetchOrders();
});

async function fetchOrders() {
  try {
    fetchOrdersInProgress.value = true;
    orders.value = await orderApis.getOrders();
    orders.value = orders.value.sort(
      (a, b) => new Date(a.orderDate) - new Date(b.orderDate)
    );
    fetchOrdersSucceeded.value = true;
  } catch (e) {
    generalError.value = e.message;
  } finally {
    fetchOrdersInProgress.value = false;
  }
}
</script>
<template>
  <div class="flex justify-between">
    <page-title text="Orders" />
    <div class="flex">
      <n-switch v-model:value="areCancelledOrdersHidden" />
      <p class="ml-2">Hide Cancelled Orders</p>
    </div>
  </div>
  <loading-indicator v-if="fetchOrdersInProgress" />
  <n-alert v-if="generalError" title="Error" type="error" class="mb-4">
    {{ generalError }}
  </n-alert>
  <template v-if="fetchOrdersSucceeded">
    <div class="grid grid-cols-12">
      <div class="col-span-12 border-b">
        <div class="grid grid-cols-12 pb-3">
          <strong class="col-span-2">Product</strong>
          <strong class="col-span-3">Ordered By</strong>
          <strong class="col-span-2">Ordred On</strong>
          <strong class="col-span-2">Delivery Date</strong>
          <strong class="col-span-3">Deliver To</strong>
        </div>
      </div>
      <template v-if="orders.length > 0">
        <template v-for="order in orders" :key="order.id">
          <div
            v-if="!areCancelledOrdersHidden || !order.isCancelled"
            class="col-span-12 py-1"
          >
            <div class="grid grid-cols-12">
              <div class="col-span-2">
                <div class="flex">
                  <router-link
                    :to="{
                      name: 'seller-product',
                      params: { productId: order.product.id },
                    }"
                  >
                    {{ order.product.title }}
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
              </div>
              <div class="col-span-3">
                {{ order.buyer.name }}({{ order.buyer.email }})
              </div>
              <div class="col-span-2">{{ formatDateUi(order.orderDate) }}</div>
              <div class="col-span-2">
                {{ formatDateUi(order.deliveryDate) }}
              </div>
              <div class="col-span-3">{{ order.deliveryAddress }}</div>
            </div>
          </div>
        </template>
      </template>
    </div>
    <div v-if="orders.length === 0" class="text-center py-2">
      No orders found
    </div>
  </template>
</template>
