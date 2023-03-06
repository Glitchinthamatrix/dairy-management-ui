<script setup>
import { ref } from "vue";
import { NAlert, NAvatar, NButton, NUpload } from "naive-ui";
import LoadingIndicator from "../../components/LoadingIndicator.vue";
import userApis from "../../api/user.js";
import { useAuthStore } from "../../stores/auth";
import {
  FILE_STATUS_REMOVED,
  USER_ICON_PNG,
  VITE_API_BASE_URL,
} from "../../constants.js";

const picture = ref(null);
const submitInProgress = ref(false);
const generalError = ref(null);

const auth = useAuthStore();

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
</template>
