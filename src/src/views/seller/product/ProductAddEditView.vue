<script setup>
import {
  NAlert,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NSpace,
  NText,
  NUpload,
  NUploadDragger,
} from "naive-ui";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import FormWrapper from "../../../components/FormWrapper.vue";
import LoadingIndicator from "../../../components/LoadingIndicator.vue";
import PageTitle from "../../../components/PageTitle.vue";
import validation from "../../../utils/validation";
import brandApis from "../../../api/brand";
import categoryApis from "../../../api/category";
import productsApis from "../../../api/product";
import { FILE_STATUS_REMOVED, VITE_API_BASE_URL } from "../../../constants.js";

const route = useRoute();
const router = useRouter();

const isEditMode = route.meta.editMode;
const productId = route.params.productId;

const fetchInProgress = ref(false);
const fetchSucceeded = ref(false);
const formRef = ref(null);
const form = ref({
  title: null,
  description: null,
  price: null,
  brand: null,
  category: null,
  unitsAvailable: null,
});
const productImagesFormRef = ref(null);
const productImagesForm = ref({
  images: [],
});
// Store product image URLs in edit-mode
const submitInProgress = ref(false);
const generalError = ref(null);
const fieldErrors = ref({});
validation.initErrors(form.value, fieldErrors.value);
const productImagesFieldErrors = ref({});
validation.initErrors(productImagesForm.value, productImagesFieldErrors.value);
const brandOptions = ref([]);
const categoryOptions = ref([]);

const rules = {
  title: {
    required: true,
    message: "Title is required",
  },
  price: {
    required: true,
    message: "Price is required",
  },
};
const productImagesFormRules = {
  images: {
    validator: () => productImagesForm.value.images.length > 0,
    message: "Image is required",
  },
};

async function getData() {
  try {
    fetchInProgress.value = true;
    const brands = await brandApis.getBrands();
    const categories = await categoryApis.getCategories();
    brandOptions.value = brands.map((brand) => ({
      label: brand.name,
      value: brand.id,
    }));
    categoryOptions.value = categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
    if (isEditMode) {
      await getProduct();
    }
    fetchSucceeded.value = true;
  } catch (e) {
    generalError.value = e.message;
  } finally {
    fetchInProgress.value = false;
  }
}

async function getProduct() {
  try {
    const res = await productsApis.getProduct(productId);
    populateForm(res);
  } catch (e) {
    generalError.value = e.message;
  }
}

function populateForm(model) {
  form.value.title = model.title;
  form.value.price = model.price;
  form.value.description = model.description;
  form.value.unitsAvailable = model.unitsAvailable;
  if (model.brand) {
    form.value.brand = model.brand.id;
  }
  if (model.category) {
    form.value.category = model.category.id;
  }
  productImagesForm.value.images = model.images;
}

function onFileSelected(file) {
  if (file.file.status === FILE_STATUS_REMOVED) {
    productImagesForm.value.images = productImagesForm.value.images.filter(
      (selectedFile) =>
        typeof selectedFile === "string" ||
        selectedFile.name !== file.file.file.name
    );
  } else {
    productImagesForm.value.images.push(file.file.file);
  }
}

async function onImageRemove(address) {
  try {
    await productsApis.deleteProductImage(productId, address);
    const filtered = productImagesForm.value.images.filter(
      (image) => typeof image !== "string" || image !== address
    );
    productImagesForm.value.images = filtered;
  } catch (e) {
    generalError.value = e.message;
  }
}

async function onSave() {
  try {
    await formRef.value.validate();
  } catch (errors) {
    validation.setValidationErrors(form.value, fieldErrors.value, errors);
    return;
  }

  try {
    await productImagesFormRef.value.validate();
  } catch (errors) {
    validation.setValidationErrors(
      productImagesForm.value,
      productImagesFieldErrors.value,
      errors
    );
    return;
  }

  try {
    submitInProgress.value = true;
    let product = null;
    if (isEditMode) {
      product = await productsApis.updateProduct(productId, form.value);
    } else {
      product = await productsApis.addProduct(form.value);
    }
    for (let image of productImagesForm.value.images) {
      if (typeof image === "string") {
        continue;
      }
      const data = new FormData();
      data.append("image", image);
      await productsApis.addProductImage(product.id, data);
    }
    goToProducts();
  } catch (e) {
    generalError.value = e.message;
    validation.setErrors(form.value, fieldErrors.value, e);
  } finally {
    submitInProgress.value = false;
  }
}

async function onCancel() {
  try {
    await productImagesFormRef.value.validate();
    goToProducts();
  } catch (e) {
    validation.setValidationErrors(
      productImagesForm.value,
      productImagesFieldErrors.value,
      e
    );
  }
}

function goToProducts() {
  router.push({ name: "seller-products" });
}

onMounted(() => {
  getData();
});
</script>
<template>
  <page-title :text="`${isEditMode ? 'Edit' : 'Add'} Product`" />
  <loading-indicator v-if="fetchInProgress" />
  <n-alert v-if="generalError" title="Error" type="error" class="mb-4">
    {{ generalError }}
  </n-alert>
  <n-card v-if="fetchSucceeded">
    <form-wrapper>
      <n-form ref="formRef" :model="form" :rules="rules">
        <n-form-item
          label="Title"
          path="title"
          :validation-status="fieldErrors.title.validationStatus"
          :feedback="fieldErrors.title.feedback"
          class="transition-margin duration-150"
          :class="{ 'mb-4': fieldErrors.title.hasError }"
        >
          <n-input
            type="text"
            v-model:value="form.title"
            placeholder=""
            clearable
          />
        </n-form-item>
        <n-form-item
          label="Price"
          path="price"
          :validation-status="fieldErrors.price.validationStatus"
          :feedback="fieldErrors.price.feedback"
          class="transition-margin duration-150"
          :class="{ 'mb-4': fieldErrors.price.hasError }"
        >
          <n-input-number
            v-model:value="form.price"
            :show-button="false"
            placeholder=""
            clearable
          />
        </n-form-item>
        <n-form-item
          label="Brand"
          path="brand"
          :validation-status="fieldErrors.brand.validationStatus"
          :feedback="fieldErrors.brand.feedback"
          class="transition-margin duration-150"
          :class="{ 'mb-4': fieldErrors.brand.hasError }"
        >
          <n-select
            :options="brandOptions"
            v-model:value="form.brand"
            placeholder=""
          />
        </n-form-item>
        <n-form-item
          label="Category"
          path="category"
          :validation-status="fieldErrors.brand.validationStatus"
          :feedback="fieldErrors.brand.feedback"
          class="transition-margin duration-150"
          :class="{ 'mb-4': fieldErrors.brand.hasError }"
        >
          <n-select
            :options="categoryOptions"
            v-model:value="form.category"
            placeholder=""
          />
        </n-form-item>
        <n-form-item
          label="Description"
          path="description"
          :validation-status="fieldErrors.description.validationStatus"
          :feedback="fieldErrors.description.feedback"
          class="transition-margin duration-150"
          :class="{ 'mb-4': fieldErrors.description.hasError }"
        >
          <n-input
            v-model:value="form.description"
            type="textarea"
            placeholder=""
          />
        </n-form-item>
      </n-form>
      <n-form
        ref="productImagesFormRef"
        :model="productImagesFormRef"
        :rules="productImagesFormRules"
      >
        <n-form-item
          label="Images"
          path="images"
          :validation-status="productImagesFieldErrors.images.validationStatus"
          :feedback="productImagesFieldErrors.images.feedback"
          class="transition-margin duration-150"
          :class="{ 'mb-4': productImagesFieldErrors.images.hasError }"
        >
          <n-upload accept=".png,.jpg" :on-change="onFileSelected" multiple>
            <n-upload-dragger>
              <div class="mb-5 mt-6 px-8 text-gray-400">
                <fa-icon :icon="['fas', 'arrow-up-from-bracket']" size="3x" />
              </div>
              <div class="mb-6 px-8 text-lg text-gray-600 w-100">
                Click or drag a file to this area to upload
              </div>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>
        <template
          v-for="(imageAddress, index) in productImagesForm.images"
          :key="index"
        >
          <div
            v-if="typeof imageAddress === 'string'"
            class="flex justify-between p-2 mt-1 bg-[#F3F3F3]"
          >
            <a
              :href="`${VITE_API_BASE_URL}assets/images/products/${imageAddress}`"
              target="_blank"
            >
              <n-text type="primary">{{ imageAddress.split("/")[1] }}</n-text>
            </a>
            <div class="d-flex justify-center">
              <fa-icon
                @click="onImageRemove(imageAddress)"
                :icon="['fas', 'xmark']"
                fixed-width
                class="cursor-pointer"
              />
            </div>
          </div>
        </template>
      </n-form>
      <div class="mt-5">
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
      </div>
    </form-wrapper>
  </n-card>
</template>
