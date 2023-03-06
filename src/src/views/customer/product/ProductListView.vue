<script setup>
import { onMounted, ref, watch } from "vue";
import {
  NAlert,
  NCard,
  NCarousel,
  NCarouselItem,
  NInput,
  NSelect,
} from "naive-ui";
import ButtonLink from "../../../components/ButtonLink.vue";
import LoadingIndicator from "../../../components/LoadingIndicator.vue";
import categoryApis from "../../../api/category.js";
import productApis from "../../../api/product.js";
import debounce from "debounce";
import { VITE_API_BASE_URL } from "../../../constants.js";

const FILTER_PRICE_LOWEST_TO_HIGHEST = "PRI-LOW-HIG";
const FILTER_PRICE_HIGHEST_TO_LOWEST = "PRI-HIG-LOW";
const FILTER_REVIEWS_LEAST_TO_MOST = "REV-LEA-MOS";
const FILTER_REVIEWS_MOST_TO_LEAST = "REV-MOS-LEA";
const FILTER_ORDERS_LEAST_TO_MOST = "ORD-LEA-MOS";
const FILTER_ORDERS_MOST_TO_LEAST = "ORD-MOS-LEA";
const FILTER_TITLE_ALPHABETICAL = "TIT-ALPHA";
const FILTER_LATEST_TO_OLDEST = "LAT-OLD";
const FILTER_OLDEST_TO_LATEST = "OLD-LAT";
const FILTER_TITLE_ALPHABETICAL_REVERSED = "TIT-ALPHA-REV";

const fetchInProgress = ref(false);
const fetchSucceeded = ref(false);
const generalError = ref(null);
const products = ref([]);
const productTitleToSearch = ref(null);
const selectedCategory = ref(null);
let baseProducts = null;
const categoryOptions = ref([]);
const filterOptions = [
  { label: "Price, Low - High", value: FILTER_PRICE_LOWEST_TO_HIGHEST },
  { label: "Price, High - Low", value: FILTER_PRICE_HIGHEST_TO_LOWEST },
  { label: "Reviews, Most - Least", value: FILTER_REVIEWS_MOST_TO_LEAST },
  { label: "Reviews, Least - Most", value: FILTER_REVIEWS_LEAST_TO_MOST },
  { label: "Orders, Most - Least", value: FILTER_ORDERS_MOST_TO_LEAST },
  { label: "Orders, Least - Most", value: FILTER_ORDERS_LEAST_TO_MOST },
  { label: "Latest - Oldest", value: FILTER_LATEST_TO_OLDEST },
  { label: "Oldest - Latest", value: FILTER_OLDEST_TO_LATEST },
  { label: "A - Z", value: FILTER_TITLE_ALPHABETICAL },
  { label: "Z - A", value: FILTER_TITLE_ALPHABETICAL_REVERSED },
];

watch(productTitleToSearch, handleSearchQueryChange);
watch(selectedCategory, handleSearchQueryChange);
const searchProducts = debounce(fetchSearchedProducts, 250);

async function getProducts() {
  try {
    fetchInProgress.value = true;
    if (baseProducts === null) {
      baseProducts = await productApis.getProducts();
      getCategories();
    }
    products.value = baseProducts;
    fetchSucceeded.value = true;
  } catch (e) {
    generalError.value = e.message;
  } finally {
    fetchInProgress.value = false;
  }
}

async function getCategories() {
  const categories = await categoryApis.getCategories();
  categoryOptions.value = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));
  categoryOptions.value.unshift({
    label: "None",
    value: null,
  });
}

async function fetchSearchedProducts() {
  try {
    fetchInProgress.value = true;
    products.value = await productApis.searchProducts(
      productTitleToSearch.value,
      selectedCategory.value
    );
    fetchSucceeded.value = true;
  } catch (e) {
    generalError.value = e.message;
  } finally {
    fetchInProgress.value = false;
  }
}

function handleSearchQueryChange() {
  if (productTitleToSearch.value || selectedCategory.value) {
    debounce(searchProducts, 250)();
  } else {
    getProducts();
  }
}

function onFilter(mode) {
  if (mode === FILTER_PRICE_LOWEST_TO_HIGHEST) {
    products.value = products.value.sort((a, b) => a.price - b.price);
  } else if (mode === FILTER_PRICE_HIGHEST_TO_LOWEST) {
    products.value = products.value.sort((a, b) => b.price - a.price);
  } else if (mode === FILTER_REVIEWS_LEAST_TO_MOST) {
    products.value = products.value.sort(
      (a, b) => a.reviews.length - b.reviews.length
    );
  } else if (mode === FILTER_REVIEWS_MOST_TO_LEAST) {
    products.value = products.value.sort(
      (a, b) => b.reviews.length - a.reviews.length
    );
  } else if (mode === FILTER_ORDERS_LEAST_TO_MOST) {
    products.value = products.value.sort((a, b) => a.orderCount - b.orderCount);
  } else if (mode === FILTER_ORDERS_MOST_TO_LEAST) {
    products.value = products.value.sort((a, b) => b.orderCount - a.orderCount);
  } else if (mode === FILTER_TITLE_ALPHABETICAL) {
    products.value = products.value.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  } else if (mode === FILTER_LATEST_TO_OLDEST) {
    products.value = products.value.sort(
      (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)
    );
  } else if (mode === FILTER_OLDEST_TO_LATEST) {
    products.value = products.value.sort(
      (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
    );
  } else {
    products.value = products.value.sort((a, b) =>
      b.title.localeCompare(a.title)
    );
  }
}

onMounted(() => {
  getProducts();
});
</script>
<template>
  <div class="grid grid-cols-12 px-1">
    <div class="col-span-12 md:col-span-6">
      <n-input
        v-model:value="productTitleToSearch"
        size="medium"
        placeholder="Search, eg. Pancake"
      />
    </div>
    <div class="col-span-12 md:col-span-3 pt-1 md:pt-0">
      <n-select
        v-model:value="selectedCategory"
        :options="categoryOptions"
        placeholder="Category"
      />
    </div>
    <div class="col-span-12 md:col-span-3 md:pl-4 pt-1 md:pt-0">
      <n-select
        @update:value="onFilter"
        :options="filterOptions"
        placeholder="Filter"
      />
    </div>
  </div>
  <loading-indicator v-if="fetchInProgress" class="mt-5" />
  <n-alert v-if="generalError" title="Error" type="error" class="mb-4">
    {{ generalError }}
  </n-alert>
  <template v-if="fetchSucceeded">
    <div class="grid grid-cols-12">
      <div
        v-for="product in products"
        :key="product.id"
        class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3 p-1"
      >
        <n-card content-style="padding: 0px">
          <n-carousel
            :show-arrow="product.images.length > 1"
            :show-dots="product.images.length > 1"
          >
            <n-carousel-item
              v-for="(address, index) in product.images"
              :key="index"
            >
              <img
                class="carousel-img"
                :src="`${VITE_API_BASE_URL}assets/images/products/${address}`"
              />
            </n-carousel-item>
          </n-carousel>
          <div class="px-2 py-1">
            <div>
              <span class="font-semibold text-[16px]">{{ product.title }}</span>
              <template v-if="product.brand">
                <span> by {{ product.brand.name }}</span>
              </template>
            </div>
            <div v-if="product.description">
              {{ product.description.substring(0, 80)
              }}{{ product.description.length > 80 ? "..." : "" }}
            </div>
            <div class="flex justify-between items-center">
              <div>
                <span class="font-semibold">₹{{ product.price }}</span>
              </div>
              <button-link
                type="default"
                text="Details"
                :to="{
                  name: 'customer-product-details',
                  params: { productId: product.id },
                }"
                size="medium"
              />
            </div>
          </div>
        </n-card>
      </div>
    </div>
    <div v-if="products.length === 0">
      <div class="text-center py-2">
        No {{ productTitleToSearch ? " Matching " : "" }} Products Found
      </div>
    </div>
  </template>
</template>
<style scoped>
.carousel-img {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
