<script setup>
import {
  NAlert,
  NButton,
  NCard,
  NCheckbox,
  NForm,
  NFormItem,
  NInput,
  useThemeVars,
} from "naive-ui";
import { ref } from "vue";
import authApi from "../../api/auth";
import validation from "../../utils/validation";
import { useRouter } from "vue-router";
import LoadingIndicator from "../../components/LoadingIndicator.vue";

const router = useRouter();
const themeVars = useThemeVars();

const formRef = ref(null);
const form = ref({
  name: null,
  email: null,
  password: null,
  isASeller: false,
  shippingAddress: null,
});
const submitInProgress = ref(false);

const generalError = ref(undefined);
const fieldErrors = ref({});
validation.initErrors(form.value, fieldErrors.value);

const rules = {
  name: {
    validator: () =>
      form.value.name && /^[A-Za-z]+\s+[A-Za-z]+$/.test(form.value.name),
    message: () =>
      !form.value.name
        ? "Full name is required"
        : "A valid full name is required",
  },
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
  password: [
    {
      required: true,
      message: "Password is required",
    },
  ],
  shippingAddress: {
    required: !form.value.isASeller,
    message: "Shipping Address is required",
  },
};

async function login() {
  try {
    await formRef.value.validate();
  } catch (errors) {
    validation.setValidationErrors(form.value, fieldErrors.value, errors);
    return;
  }
  try {
    submitInProgress.value = true;
    await authApi.signUp(form.value);
    router.push({ name: "login" });
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
        <h1 class="text-4xl text-center font-bold mb-8">
          <span :style="{ color: themeVars.primaryColor }">Dairy Magic</span>
        </h1>
        <n-alert
          type="error"
          :show-icon="false"
          v-if="generalError"
          class="mb-4"
        >
          {{ generalError }}
        </n-alert>
        <n-form
          ref="formRef"
          :model="form"
          :rules="rules"
          :show-label="false"
          @submit.prevent="login"
          size="large"
        >
          <n-form-item
            label="Full Name"
            path="name"
            :validation-status="fieldErrors.name.validationStatus"
            :feedback="fieldErrors.name.feedback"
            class="transition-margin duration-150"
            :class="{ 'mb-4': fieldErrors.name.hasError }"
          >
            <n-input
              v-model:value="form.name"
              size="large"
              placeholder="Full Name"
            />
          </n-form-item>
          <!-- Email -->
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

          <!-- Password -->
          <n-form-item
            label="Password"
            path="password"
            :validation-status="fieldErrors.password.validationStatus"
            :feedback="fieldErrors.password.feedback"
            class="transition-margin duration-150"
            :class="{ 'mb-4': fieldErrors.password.hasError }"
          >
            <n-input
              type="password"
              v-model:value="form.password"
              size="large"
              placeholder="password"
            />
          </n-form-item>
          <n-form-item
            v-if="!form.isASeller"
            label="Shipping Address"
            path="shippingAddress"
            :validation-status="fieldErrors.shippingAddress.validationStatus"
            :feedback="fieldErrors.shippingAddress.feedback"
            class="transition-margin duration-150"
            :class="{ 'mb-4': fieldErrors.shippingAddress.hasError }"
          >
            <n-input
              v-model:value="form.shippingAddress"
              size="large"
              placeholder="Shipping Address"
            />
          </n-form-item>
          <n-form-item>
            <n-checkbox
              type="password"
              v-model:checked="form.isASeller"
              label="I'd like to sign uo as a seller"
            />
          </n-form-item>

          <!-- Login -->
          <n-button
            attr-type="submit"
            block
            type="primary"
            size="large"
            :disabled="submitInProgress"
          >
            <template v-if="!submitInProgress"> SignUp </template>
            <template v-else>
              <loading-indicator size="lg" />
            </template>
          </n-button>
          <div class="mt-5"></div>
          <!-- Forgot Password -->
          <div class="text-center">
            <router-link to="login">Already registered? Login</router-link>
          </div>
        </n-form>
      </n-card>
    </div>
  </div>
</template>
