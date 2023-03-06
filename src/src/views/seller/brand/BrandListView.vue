<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { NAlert, NTable, NText, useDialog } from "naive-ui";
import LoadingIndicator from "../../../components/LoadingIndicator.vue";
import PageTitle from "../../../components/PageTitle.vue";
import brandApis from "../../../api/brand.js";

const fetchInProgress = ref(false);
const fetchSucceeded = ref(false);
const generalError = ref(null);
const brands = ref([]);

async function getBrands() {
  try {
    fetchInProgress.value = true;
    brands.value = await brandApis.getBrands();
    brands.value = brands.value.sort((a, b) => a.name.localeCompare(b.name));
    fetchSucceeded.value = true;
  } catch (e) {
    generalError.value = e.message;
  } finally {
    fetchInProgress.value = false;
  }
}

const dialog = useDialog();
function confirmBrandDeletion(brandId) {
  dialog.error({
    showIcon: false,
    title: "Are you sure?",
    content: "The selected brand will be permanently deleted",
    positiveText: "Delete",
    negativeText: "Cancel",
    onPositiveClick: () => {
      deleteProduct(brandId);
    },
  });
}

async function deleteProduct(brandId) {
  try {
    await brandApis.deleteBrand(brandId);
    brands.value = brands.value.filter((brand) => brand.id !== brandId);
  } catch (e) {
    generalError.value = e.message;
  }
}

onMounted(() => {
  getBrands();
});
</script>
<template>
  <page-title
    text="Brands"
    actionText="Add"
    :actionTo="{ name: 'seller-brand-add' }"
  />
  <loading-indicator v-if="fetchInProgress" />
  <n-alert v-if="generalError" title="Error" type="error" class="mb-4">
    {{ generalError }}
  </n-alert>
  <template v-if="fetchSucceeded">
    <n-table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Contact</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="brand in brands" :key="brand.id">
          <td>{{ brand.name }}</td>
          <td>
            <a :href="`mailto:${brand.email}`">
              <n-text type="primary">
                {{ brand.email.split("@")[0] }}
              </n-text>
            </a>
          </td>
          <td class="w-1 whitespace-nowrap">
            <router-link
              :to="{ name: 'seller-brand-edit', params: { brandId: brand.id } }"
            >
              <fa-icon :icon="['fas', 'pencil']" fixed-width />
            </router-link>
            <fa-icon
              @click="confirmBrandDeletion(brand.id)"
              :icon="['fas', 'trash']"
              fixed-width
              class="cursor-pointer ml-3"
            />
          </td>
        </tr>
      </tbody>
    </n-table>
    <div v-if="brands.length === 0" class="text-center py-2">
      No brands found
    </div>
  </template>
</template>
