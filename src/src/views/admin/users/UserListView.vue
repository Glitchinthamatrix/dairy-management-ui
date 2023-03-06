<script setup>
import { NAlert, NTable, useDialog } from "naive-ui";
import { onMounted, ref } from "vue";
import userApis from "../../../api/user.js";
import LoadingIndicator from "../../../components/LoadingIndicator.vue";
import PageTitle from "../../../components/PageTitle.vue";

const USER_TYPE_SELLER = "Seller";
const USER_TYPE_CUSTOMER = "Customer";

const fetchUsersInProgress = ref(false);
const fetchUsersSucceeded = ref(false);
const generalError = ref(null);
const users = ref([]);

async function fetchUsers() {
  try {
    fetchUsersInProgress.value = true;
    users.value = await userApis.getUsers();
    users.value = users.value.sort((a, b) => a.name.localeCompare(b.name));
    fetchUsersSucceeded.value = true;
  } catch (e) {
    generalError.value = e.message;
  } finally {
    fetchUsersInProgress.value = false;
  }
}

const dialog = useDialog();
function confirmUserDeletion(userId) {
  dialog.error({
    showIcon: false,
    title: "Are you sure?",
    content: "The selected user will be permanently deleted",
    positiveText: "Delete",
    negativeText: "Cancel",
    onPositiveClick: () => {
      deleteUser(userId);
    },
  });
}

async function deleteUser(userId) {
  try {
    await userApis.deleteUser(userId);
    users.value = users.value.filter((product) => product.id !== userId);
  } catch (e) {
    generalError.value = e.message;
  }
}

onMounted(() => {
  fetchUsers();
});
</script>
<template>
  <page-title text="Users" />
  <loading-indicator v-if="fetchUsersInProgress" />
  <n-alert v-if="generalError" title="Error" type="error" class="mb-4">
    {{ generalError }}
  </n-alert>
  <template v-if="fetchUsersSucceeded">
    <n-table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-if="users.length > 0">
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.isASeller ? USER_TYPE_SELLER : USER_TYPE_CUSTOMER }}</td>
          <td>{{ user.email }}</td>
          <td class="w-1 whitespace-nowrap">
            <!-- <router-link
              :to="{
                name: 'seller-product-edit',
                params: { userId: product.id },
              }"
            >
              <fa-icon :icon="['fas', 'pencil']" fixed-width />
            </router-link> -->
            <fa-icon
              @click="confirmUserDeletion(user.id)"
              :icon="['fas', 'trash']"
              fixed-width
              class="cursor-pointer ml-3"
            />
          </td>
        </tr>
      </tbody>
    </n-table>
    <div v-if="users.length === 0" class="text-center py-2">No users found</div>
  </template>
</template>
