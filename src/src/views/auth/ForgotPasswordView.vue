<script setup>
import { NAlert, NButton, NCard, NForm, NFormItem, NInput } from "naive-ui";
import { ref } from "vue";
import validation from "../../utils/validation";
import LoadingIndicator from "../../components/LoadingIndicator.vue";

const formRef = ref(null);
const form = ref({
  email: null,
});
const submitInProgress = ref(false);
const submitted = ref(false);

const generalError = ref(undefined);
const fieldErrors = ref({});
validation.initErrors(form.value, fieldErrors.value);

const rules = {
  email: [
    {
      required: true,
      message: "Email is required",
    },
    {
      type: "email",
      message: "A valid email is required",
    },
  ],
};

async function sendMail() {
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
        <h1 class="text-3xl text-center font-bold mb-8">forgot password</h1>
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
          We have sent you a mail. Please check your inbox.
        </n-alert>
        <n-form
          ref="formRef"
          :model="form"
          :rules="rules"
          :show-label="false"
          @submit.prevent="sendMail"
          size="large"
          v-if="!submitted"
        >
          <n-form-item
            label="Email"
            path="email"
            :validation-status="fieldErrors.email.validationStatus"
            :feedback="fieldErrors.email.feedback"
            class="transition-margin duration-150"
            :class="{ 'mb-4': fieldErrors.email.hasError }"
          >
            <n-input
              v-model:value="form.email"
              size="large"
              placeholder="email"
            />
          </n-form-item>
          <n-button
            attr-type="submit"
            block
            type="primary"
            size="large"
            @click="sendMail"
          >
            <template v-if="!submitInProgress"> Send Mail </template>
            <template v-else>
              <loading-indicator size="lg" />
            </template>
          </n-button>
        </n-form>
      </n-card>
    </div>
  </div>
</template>
