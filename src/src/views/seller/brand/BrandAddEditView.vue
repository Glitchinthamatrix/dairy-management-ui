<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  NAlert,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSpace,
} from "naive-ui";
import FormWrapper from "../../../components/FormWrapper.vue";
import LoadingIndicator from "../../../components/LoadingIndicator.vue";
import PageTitle from "../../../components/PageTitle.vue";
import validation from "../../../utils/validation";
import brandApis from "../../../api/brand.js";

const route = useRoute();
const router = useRouter();
const isEditMode = route.meta.editMode;
const brandId = route.params.brandId;

const formRef = ref(null);
const form = ref({
  name: null,
  email: null,
});
const fieldErrors = ref({});
validation.initErrors(form.value, fieldErrors.value);
const submitInProgress = ref(false);
const generalError = ref(null);

const rules = {
  name: {
    required: true,
    message: "Name is required",
  },
  email: [
    { required: true, message: "Email is required" },
    { type: "email", message: "A valid email is required" },
  ],
};

async function getBrand() {
  try {
    const res = await brandApis.getBrand(brandId);
    populateForm(res);
  } catch (e) {
    generalError.value = e.message;
  }
}

function populateForm(model) {
  form.value.name = model.name;
  form.value.email = model.email;
}

async function onSave() {
  try {
    await formRef.value.validate();
  } catch (errors) {
    validation.setValidationErrors(form.value, fieldErrors.value, errors);
    return;
  }

  try {
    submitInProgress.value = true;
    if (isEditMode) {
      await brandApis.updateBrand(brandId, form.value);
    } else {
      await brandApis.addBrand(form.value);
    }
    goToBrands();
  } catch (e) {
    validation.setErrors(form.value, fieldErrors.value, e);
    generalError.value = e.message;
  } finally {
    submitInProgress.value = false;
  }
}

function onCancel() {
  goToBrands();
}

function goToBrands() {
  router.push({ name: "seller-brands" });
}

onMounted(() => {
  if (isEditMode) {
    getBrand();
  }
});
</script>
<template>
  <page-title :text="`${isEditMode ? 'Edit' : 'Add'} Brand`" />
  <n-alert v-if="generalError" title="Error" type="error" class="mb-4">
    {{ generalError }}
  </n-alert>
  <n-card>
    <form-wrapper>
      <n-form ref="formRef" :model="form" :rules="rules">
        <n-form-item
          label="Name"
          path="name"
          :validation-status="fieldErrors.name.validationStatus"
          :feedback="fieldErrors.name.feedback"
          class="transition-margin duration-150"
          :class="{ 'mb-4': fieldErrors.name.hasError }"
        >
          <n-input
            type="text"
            v-model:value="form.name"
            placeholder=""
            clearable=""
          />
        </n-form-item>
        <n-form-item
          label="Email"
          path="email"
          :validation-status="fieldErrors.email.validationStatus"
          :feedback="fieldErrors.email.feedback"
          class="transition-margin duration-150"
          :class="{ 'mb-4': fieldErrors.email.hasError }"
        >
          <n-input
            type="text"
            v-model:value="form.email"
            placeholder=""
            clearable=""
          />
        </n-form-item>
      </n-form>
      <n-space>
        <n-button
          @click="onSave"
          type="primary"
          size="large"
          :disabled="submitInProgress"
        >
          <template v-if="!submitInProgress"> Save </template>
          <template v-else>
            <loading-indicator size="lg" />
          </template>
        </n-button>
        <n-button @click="onCancel" type="default" size="large">
          Cancel
        </n-button>
      </n-space>
    </form-wrapper>
  </n-card>
</template>
