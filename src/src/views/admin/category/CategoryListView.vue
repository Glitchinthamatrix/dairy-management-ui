<script setup>
import { onMounted, ref } from "vue";
import { NAlert, NTable, useDialog } from "naive-ui";
import LoadingIndicator from "../../../components/LoadingIndicator.vue";
import PageTitle from "../../../components/PageTitle.vue";
import categoryApis from "../../../api/category";

const fetchCategoriesInProgress = ref(false);
const fetchCategoriesSucceeded = ref(false);
const generalError = ref(null);
const categories = ref([]);

onMounted(() => {
  fetchCategories();
});

async function fetchCategories() {
  try {
    fetchCategoriesInProgress.value = true;
    categories.value = await categoryApis.getCategories();
    fetchCategoriesSucceeded.value = true;
  } catch (e) {
    generalError.value = e.message;
  } finally {
    fetchCategoriesInProgress.value = false;
  }
}

const dialog = useDialog();
function confirmCategoryDeletion(categoryId) {
  dialog.error({
    showIcon: false,
    title: "Are you sure?",
    content: "The selected category will be permanently deleted",
    positiveText: "Delete",
    negativeText: "Cancel",
    onPositiveClick: () => {
      deleteCategory(categoryId);
    },
  });
}

async function deleteCategory(categoryId) {
  try {
    await categoryApis.deleteCategory(categoryId);
    categories.value = categories.value.filter(
      (category) => category.id !== categoryId
    );
  } catch (e) {
    generalError.value = e.message;
  }
}
</script>
<template>
  <page-title
    text="Categories"
    actionText="Add"
    :actionTo="{ name: 'admin-category-add' }"
  />
  <loading-indicator v-if="fetchCategoriesInProgress" />
  <n-alert v-if="generalError" title="Error" type="error" class="mb-4">
    {{ generalError }}
  </n-alert>
  <template v-if="fetchCategoriesSucceeded">
    <n-table>
      <thead>
        <tr>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-if="categories.length > 0">
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.name }}</td>
          <td class="w-1 whitespace-nowrap">
            <fa-icon
              @click="confirmCategoryDeletion(category.id)"
              :icon="['fas', 'trash']"
              fixed-width
              class="cursor-pointer"
            />
          </td>
        </tr>
      </tbody>
    </n-table>
    <div v-if="categories.length === 0" class="text-center py-2">
      No categories found
    </div>
  </template>
</template>
