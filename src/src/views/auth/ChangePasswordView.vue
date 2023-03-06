<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  NAlert,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSpace,
} from "naive-ui";
import authApi from "../../api/auth";
import { useBreadcrumbStore } from "../../stores/breadcrumb";
import FormWrapper from "../../components/FormWrapper.vue";
import PageTitle from "../../components/PageTitle.vue";
import validation from "../../utils/validation";

const breadcrumbStore = useBreadcrumbStore();
const router = useRouter();

const submitInProgress = ref(false);

const formRef = ref(null);
const form = ref({
  currentPassword: null,
  newPassword: null,
  confirmNewPassword: null,
});

const rules = {
  currentPassword: {
    required: true,
    message: "Current Password is required",
  },
  newPassword: { required: true, message: "New Password is required" },
  confirmNewPassword: {
    validator: () => {
      return (
        form.value.confirmNewPassword !== null &&
        form.value.newPassword === form.value.confirmNewPassword
      );
    },
    message: () => {
      if (!form.value.confirmNewPassword) {
        return "Confirm password is required";
      } else {
        return "New Password & Confirm Password do not match";
      }
    },
  },
};

const fieldErrors = ref({});
const generalError = ref(undefined);
validation.initErrors(form.value, fieldErrors.value);

onMounted(() => {
  setBreadcrumbs();
});

function setBreadcrumbs() {
  breadcrumbStore.setBreadcrumbs([{ name: "Home", to: { name: "home" } }]);
}

async function onChangePassword() {
  try {
    await formRef.value.validate();
  } catch (e) {
    validation.setValidationErrors(form.value, fieldErrors.value, e);
    return;
  }
  try {
    submitInProgress.value = true;
    await authApi.changePassword({
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword,
    });
    goToHome();
  } catch (e) {
    generalError.value = e.message;
    validation.setErrors(form.value, fieldErrors.value, e);
  } finally {
    submitInProgress.value = false;
  }
}

function goToHome() {
  router.push({ name: "home" });
}
</script>

<template>
  <page-title text="Change Password" />
  <n-alert v-if="generalError" title="Error" type="error" class="mb-4">
    {{ generalError }}
  </n-alert>
  <n-card>
    <form-wrapper>
      <n-form ref="formRef" :rules="rules" :model="form" size="large">
        <n-form-item
          label="Current Password"
          path="currentPassword"
          class="transition-margin duration-150"
          :validation-status="fieldErrors.currentPassword.validationStatus"
          :feedback="fieldErrors.currentPassword.feedback"
          :class="{ 'mb-4': fieldErrors.currentPassword.hasError }"
        >
          <n-input
            v-model:value="form.currentPassword"
            type="password"
            clearable
            placeholder=""
          />
        </n-form-item>
        <n-form-item
          label="New Password"
          path="newPassword"
          class="transition-margin duration-150"
          :validation-status="fieldErrors.newPassword.validationStatus"
          :feedback="fieldErrors.newPassword.feedback"
          :class="{ 'mb-4': fieldErrors.newPassword.hasError }"
        >
          <n-input
            v-model:value="form.newPassword"
            type="password"
            clearable
            placeholder=""
          />
        </n-form-item>
        <n-form-item
          label="Confirm New Password"
          path="confirmNewPassword"
          class="transition-margin duration-150"
          :validation-status="fieldErrors.confirmNewPassword.validationStatus"
          :feedback="fieldErrors.confirmNewPassword.feedback"
          :class="{ 'mb-4': fieldErrors.confirmNewPassword.hasError }"
        >
          <n-input
            v-model:value="form.confirmNewPassword"
            type="password"
            clearable
            placeholder=""
          />
        </n-form-item>
        <n-space>
          <n-button type="primary" size="large" @click="onChangePassword">
            <template v-if="submitInProgress">
              <fa-icon :icon="['fas', 'spinner']" />
            </template>
            <template v-else> Change Password </template>
          </n-button>
        </n-space>
      </n-form>
    </form-wrapper>
  </n-card>
</template>
