<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { NAlert, NAvatar, NCarousel } from "naive-ui";
import LoadingIndicator from "../../../components/LoadingIndicator.vue";
import productApis from "../../../api/product.js";
import { format } from "../../../utils/number.js";
import {
  VITE_API_BASE_URL,
  PRODUCT_UNIT_COUNT_THRESHOLD,
  USER_ICON_PNG,
} from "../../../constants.js";

const route = useRoute();
const productId = route.params.productId;

const fetchDataInProgress = ref(false);
const fetchDataSucceeded = ref(false);
const generalError = ref(null);
const product = ref(null);

async function fetchData() {
  try {
    fetchDataInProgress.value = true;
    product.value = await productApis.getProduct(productId);
    fetchDataSucceeded.value = true;
  } catch (e) {
    generalError.value = e.message;
  } finally {
    fetchDataInProgress.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>
<template>
  <loading-indicator v-if="fetchDataInProgress" class="mt-5" />
  <n-alert v-if="generalError" title="Error" type="error" class="mb-4">
    {{ generalError }}
  </n-alert>
  <div v-if="fetchDataSucceeded" class="grid grid-cols-12">
    <!-- Product Details -->
    <div class="col-span-12">
      <div style="width: 50vw">
        <n-carousel
          :show-arrow="product.images.length > 1"
          :show-dots="product.images.length > 1"
        >
          <img
            v-for="(address, index) in product.images"
            :key="index"
            class="carousel-img"
            :src="`${VITE_API_BASE_URL}assets/images/products/${address}`"
          />
        </n-carousel>
      </div>
      <div class="pt-2 text-black">
        <div class="flex justify-between items-center">
          <div class="font-bold text-lg">
            <span>{{ product.title }}</span>
            <span v-if="product.brand" class="font-medium text-base">
              by {{ product.brand.name }}
            </span>
          </div>
        </div>
        <div v-if="product.description" class="py-1">
          {{ product.description }}
        </div>
        <div class="flex justify-between py-1">
          <div>
            <span class="font-semibold text-md">
              {{
                format(
                  product.unitsAvailable > PRODUCT_UNIT_COUNT_THRESHOLD
                    ? 1000000
                    : product.unitsAvailable
                )
              }}+
            </span>
            Units available
          </div>
        </div>
      </div>
    </div>
    <!-- Product Details End -->

    <!-- Reviews -->
    <div class="col-span-12">
      <div class="w-full h-full flex flex-col">
        <div class="h-full p-1">
          <div
            v-if="product.reviews.length === 0"
            class="bg-slate-200 rounded-md text-center p-2 font-semibold text-lg"
          >
            No reviews yet
          </div>
          <div
            v-for="review in product.reviews"
            :key="review.id"
            class="p-1 bg-slate-200 rounded-md mb-1"
          >
            <div
              class="flex justify-between items-center font-semibold text-black pb-1 pr-1"
            >
              <div class="flex items-center">
                <n-avatar
                  :src="`${VITE_API_BASE_URL}users/${review.author.id}/picture`"
                  :fallback-src="USER_ICON_PNG"
                  size="small"
                  round
                />
                <div class="ml-1">{{ review.author.name }}</div>
              </div>
            </div>
            <div>{{ review.comment }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Reviews End -->
  </div>
</template>
