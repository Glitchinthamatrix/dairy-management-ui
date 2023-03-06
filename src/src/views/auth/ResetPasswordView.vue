<script setup>
import { NAlert, NButton, NCard, NForm, NFormItem, NInput } from "naive-ui";
import { ref } from "vue";
import validation from "../../utils/validation";
import LoadingIndicator from "../../components/LoadingIndicator.vue";

const formRef = ref(null);
const form = ref({
  newPassword: null,
  confirmNewPassword: null,
});
const submitInProgress = ref(false);
const submitted = ref(false);

const generalError = ref(undefined);
const fieldErrors = ref({});
validation.initErrors(form.value, fieldErrors.value);

const rules = {
  newPassword: {
    required: true,
    message: "New Password is required",
  },
  confirmNewPassword: {
    validator: () => {
      return (
        form.value.confirmNewPassword !== null &&
        form.value.newPassword === form.value.confirmNewPassword
      );
    },
    message: () => {
      if (!form.value.confirmNewPassword) {
        return "Confirm New Password is required";
      } else {
        return "New Password & Confirm New Password do not match";
      }
    },
  },
};

async function onResetPassword() {
  try {
    await formRef.value.validate();
  } catch (errors) {
    validation.setValidationErrors(form.value, fieldErrors.value, errors);
    return;
  }
  try {
    submitInProgress.value = true;
    // API call
    submitted.value = true;
  } catch (e) {
    generalError.value = e.message;
    validation.setErrors(form.value, fieldErrors.value, e);
  } finally {
    submitInProgress.value = false;
  }
}
</script>

<template>
  <div class="flex flex-row items-center h-screen">
    <div class="w-96 mx-auto">
      <n-card size="huge" class="shadow-md px-2 py-8">
        <h1 class="text-3xl text-center font-bold mb-8">reset password</h1>
        <n-alert
          type="error"
          :show-icon="false"
          v-if="generalError"
          class="mb-4"
        >
          {{ generalError }}
        </n-alert>
        <n-alert
          type="success"
          :show-icon="false"
          v-if="submitted"
          class="mb-4"
        >
          Your password was reset successfully.
        </n-alert>
        <n-form
          ref="formRef"
          :model="form"
          :rules="rules"
          :show-label="false"
          @submit.prevent="onResetPassword"
          size="large"
          v-if="!submitted"
        >
          <n-form-item
            path="newPassword"
            class="transition-margin duration-150"
            :validation-status="fieldErrors.newPassword.validationStatus"
            :feedback="fieldErrors.newPassword.feedback"
            :class="{ 'mb-4': fieldErrors.newPassword.hasError }"
          >
            <n-input
              v-model:value="form.newPassword"
              type="password"
              placeholder="New Password"
            />
          </n-form-item>
          <n-form-item
            path="confirmNewPassword"
            class="transition-margin duration-150"
            :validation-status="fieldErrors.confirmNewPassword.validationStatus"
            :feedback="fieldErrors.confirmNewPassword.feedback"
            :class="{ 'mb-4': fieldErrors.confirmNewPassword.hasError }"
          >
            <n-input
              v-model:value="form.confirmNewPassword"
              type="password"
              placeholder="Confirm New Password"
            />
          </n-form-item>
          <n-button
            attr-type="submit"
            block
            type="primary"
            size="large"
            @click="onResetPassword"
          >
            <template v-if="!submitInProgress"> Reset Password </template>
            <template v-else>
              <loading-indicator size="lg" />
            </template>
          </n-button>
        </n-form>
      </n-card>
    </div>
  </div>
</template>
