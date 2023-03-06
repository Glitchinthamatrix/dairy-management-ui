<script setup>
import { ref } from "vue";
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
import FormWrapper from "../../../components/FormWrapper.vue";
import LoadingIndicator from "../../../components/LoadingIndicator.vue";
import PageTitle from "../../../components/PageTitle.vue";
import validation from "../../../utils/validation";
import categoryApis from "../../../api/category.js";

const router = useRouter();

const formRef = ref(null);
const form = ref({
  name: null,
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
};

async function onSave() {
  try {
    await formRef.value.validate();
  } catch (errors) {
    validation.setValidationErrors(form.value, fieldErrors.value, errors);
    return;
  }

  try {
    submitInProgress.value = true;
    await categoryApis.addCategory(form.value);
    goToCategories();
  } catch (e) {
    validation.setErrors(form.value, fieldErrors.value, e);
    generalError.value = e.message;
  } finally {
    submitInProgress.value = false;
  }
}

function onCancel() {
  goToCategories();
}

function goToCategories() {
  router.push({ name: "admin-categories" });
}
</script>
<template>
  <page-title text="Add Category" />
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
