<script setup>
import { NAlert, NInput, NTable, useDialog } from "naive-ui";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import productApis from "../../../api/product";
import LoadingIndicator from "../../../components/LoadingIndicator.vue";
import PageTitle from "../../../components/PageTitle.vue";
import debounce from "debounce";

const fetchProductsInProgress = ref(false);
const fetchProductsSucceeded = ref(false);
const generalError = ref(null);
let baseProducts = [];
const products = ref([]);
const searchText = ref(null);

onMounted(() => {
  fetchProducts();
});

async function fetchProducts() {
  try {
    fetchProductsInProgress.value = true;
    baseProducts = await productApis.getProducts();
    baseProducts = baseProducts.sort((a, b) => a.title.localeCompare(b.title));
    products.value = baseProducts;
    fetchProductsSucceeded.value = true;
  } catch (e) {
    generalError.value = e.message;
  } finally {
    fetchProductsInProgress.value = false;
  }
}

function onSearchTextChange(value) {
  searchText.value = value;
  if (!searchText.value) {
    products.value = baseProducts;
    return;
  }
  getMatchingProducts();
}

const getMatchingProducts = debounce(searchProducts, 250);

function searchProducts() {
  products.value = baseProducts.filter((product) => {
    return product.title.search(new RegExp(searchText.value, "i")) !== -1;
  });
}

const dialog = useDialog();
function confirmProductDeletion(productId) {
  dialog.error({
    showIcon: false,
    title: "Are you sure?",
    content: "The selected product will be permanently deleted",
    positiveText: "Delete",
    negativeText: "Cancel",
    onPositiveClick: () => {
      deleteProduct(productId);
    },
  });
}

async function deleteProduct(productId) {
  try {
    await productApis.deleteProduct(productId);
    products.value = products.value.filter(
      (product) => product.id !== productId
    );
  } catch (e) {
    generalError.value = e.message;
  }
}
</script>
<template>
  <page-title
    text="Products"
    actionText="Add"
    :actionTo="{ name: 'seller-product-add' }"
  />
  <n-alert v-if="generalError" title="Error" type="error" class="mb-4">
    {{ generalError }}
  </n-alert>
  <n-input
    @update:value="onSearchTextChange"
    :value="searchText"
    placeholder=""
    class="mb-1"
  />
  <loading-indicator v-if="fetchProductsInProgress" />
  <template v-if="fetchProductsSucceeded">
    <n-table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Brand</th>
          <th>Category</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-if="products.length > 0">
        <tr v-for="product in products" :key="product.id">
          <td>
            <router-link
              :to="{
                name: 'seller-product',
                params: { productId: product.id },
              }"
            >
              {{ product.title }}
            </router-link>
          </td>
          <td>{{ product.price }}</td>
          <td>{{ product.brand ? product.brand.name : null }}</td>
          <td>{{ product.category ? product.category.name : null }}</td>
          <td class="w-1 whitespace-nowrap">
            <router-link
              :to="{
                name: 'seller-product-edit',
                params: { productId: product.id },
              }"
            >
              <fa-icon :icon="['fas', 'pencil']" fixed-width />
            </router-link>
            <fa-icon
              @click="confirmProductDeletion(product.id)"
              :icon="['fas', 'trash']"
              fixed-width
              class="cursor-pointer ml-3"
            />
          </td>
        </tr>
      </tbody>
    </n-table>
    <div v-if="products.length === 0" class="text-center py-2">
      No products found
    </div>
  </template>
</template>
