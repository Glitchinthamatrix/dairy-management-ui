<script setup>
import { NAlert, NTable, useDialog } from "naive-ui";
import { onMounted, ref } from "vue";
import productsApis from "../../../api/product";
import LoadingIndicator from "../../../components/LoadingIndicator.vue";
import PageTitle from "../../../components/PageTitle.vue";

const fetchProductsInProgress = ref(false);
const fetchProductsSucceeded = ref(false);
const generalError = ref(null);
const products = ref([]);

onMounted(() => {
  fetchProducts();
});

async function fetchProducts() {
  try {
    fetchProductsInProgress.value = true;
    products.value = await productsApis.getProducts();
    products.value = products.value.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    fetchProductsSucceeded.value = true;
  } catch (e) {
    generalError.value = e.message;
  } finally {
    fetchProductsInProgress.value = false;
  }
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
    await productsApis.deleteProduct(productId);
    products.value = products.value.filter(
      (product) => product.id !== productId
    );
  } catch (e) {
    generalError.value = e.message;
  }
}
</script>
<template>
  <page-title text="Products" />
  <loading-indicator v-if="fetchProductsInProgress" />
  <n-alert v-if="generalError" title="Error" type="error" class="mb-4">
    {{ generalError }}
  </n-alert>
  <template v-if="fetchProductsSucceeded">
    <n-table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          <th>Added By</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-if="products.length > 0">
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.title }}</td>
          <td>{{ product.category.name }}</td>
          <td>{{ product.addedBy.name }}</td>
          <td>{{ product.price }}</td>
          <td class="w-1 whitespace-nowrap">
            <!-- <router-link
              :to="{
                name: 'seller-product-edit',
                params: { productId: product.id },
              }"
            >
              <fa-icon :icon="['fas', 'pencil']" fixed-width />
            </router-link> -->
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
