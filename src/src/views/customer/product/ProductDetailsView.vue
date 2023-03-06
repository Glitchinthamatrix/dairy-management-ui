<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  NAlert,
  NAvatar,
  NButton,
  NCard,
  NCarousel,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NSpace,
} from "naive-ui";
import LoadingIndicator from "../../../components/LoadingIndicator.vue";
import cartApis from "../../../api/cart.js";
import orderApis from "../../../api/order.js";
import productApis from "../../../api/product.js";
import reviewApis from "../../../api/review.js";
import wishlistApis from "../../../api/wishlist.js";
import { useAuthStore } from "../../../stores/auth.js";
import { useUserStore } from "../../../stores/user.js";
import { format } from "../../../utils/number.js";
import {
  VITE_API_BASE_URL,
  PRODUCT_UNIT_COUNT_THRESHOLD,
  USER_ICON_PNG,
} from "../../../constants.js";
import validation from "../../../utils/validation.js";

const route = useRoute();
const router = useRouter();
const productId = route.params.productId;

const auth = useAuthStore();
const user = useUserStore();

const fetchDataInProgress = ref(false);
const fetchDataSucceeded = ref(false);
const generalError = ref(null);
const product = ref(null);
const reviewText = ref(null);
const reviewSubmitInProgress = ref(false);
const isReviewModeByReviewId = ref({});
const reviewTextToUpdateByReviewId = ref({});
const reviewUpdateInProgress = ref(false);
const isProductInCart = ref(false);
const isProductInWishlist = ref(false);
const isModalVisible = ref(false);
const orderFormRef = ref(null);
const orderForm = ref({ deliveryAddress: null });
const orderFormFieldErrors = ref({});
const orderSubmitInProgress = ref(false);
validation.initErrors(orderForm.value, orderFormFieldErrors.value);

const orderFormRules = {
  deliveryAddress: {
    required: true,
    message: "Delivery address is required",
  },
};

async function fetchData() {
  try {
    fetchDataInProgress.value = true;
    product.value = await productApis.getProduct(productId);
    const cart = await user.getCart();
    isProductInCart.value =
      cart.find((product) => product.id === productId) !== undefined;
    fetchDataSucceeded.value = true;
    const wishlist = await user.getWishlist();
    isProductInWishlist.value =
      wishlist.find((product) => product.id === productId) !== undefined;
    prepareOrderForm();
  } catch (e) {
    generalError.value = e.message;
  } finally {
    fetchDataInProgress.value = false;
  }
}

function prepareOrderForm() {
  orderForm.value.deliveryAddress = auth.deliveryAddress;
}

async function onProductLike() {
  try {
    if (isProductInWishlist.value) {
      await wishlistApis.removeProductFromWishlist(auth.wishlistId, {
        data: {
          product: productId,
        },
      });
      isProductInWishlist.value = false;
    } else {
      await wishlistApis.addProductToWishlist(auth.wishlistId, {
        product: productId,
      });
      isProductInWishlist.value = true;
    }
  } catch (e) {
    generalError.value = e.message;
  }
}

async function onCartClick() {
  try {
    if (isProductInCart.value) {
      await cartApis.removeProductFromCart(auth.cartId, {
        data: {
          product: productId,
        },
      });
      isProductInCart.value = false;
    } else {
      await cartApis.addProductToCart(auth.cartId, {
        product: productId,
      });
      isProductInCart.value = true;
    }
  } catch (e) {
    generalError.value = e.message;
  }
}

async function onOrderClick() {
  try {
    await orderFormRef.value.validate();
  } catch (e) {
    validation.setValidationErrors(
      orderForm.value,
      orderFormFieldErrors.value,
      e
    );
    return;
  }

  try {
    orderSubmitInProgress.value = true;
    await orderApis.addOrder({
      deliveryAddress: orderForm.value.deliveryAddress,
      product: productId,
    });
    router.push({ name: "customer-profile" });
  } catch (e) {
    generalError.value = e.message;
    validation.setErrors(orderForm.value, orderFormFieldErrors.value, e);
  } finally {
    orderSubmitInProgress.value = false;
  }
}

async function onReviewPostClick() {
  try {
    reviewSubmitInProgress.value = true;
    const review = await productApis.addReview(productId, {
      comment: reviewText.value,
    });
    reviewText.value = null;
    product.value.reviews.push(review);
  } catch (e) {
    generalError.value = e.message;
  } finally {
    reviewSubmitInProgress.value = false;
  }
}

function onReviewEditClick(id, comment) {
  isReviewModeByReviewId.value[id] = true;
  reviewTextToUpdateByReviewId.value[id] = comment;
}

async function onReviewUpdateClick(reviewId) {
  try {
    reviewUpdateInProgress.value = true;
    const updated = await reviewApis.updateReview(reviewId, {
      comment: reviewTextToUpdateByReviewId.value[reviewId],
    });
    product.value.reviews = product.value.reviews.map((review) =>
      review.id === reviewId ? updated : review
    );
    reviewTextToUpdateByReviewId.value[reviewId] = null;
    isReviewModeByReviewId.value[reviewId] = false;
  } catch (e) {
    generalError.value = e.message;
  } finally {
    reviewUpdateInProgress.value = false;
  }
}

function onReviewUpdateCancel(reviewId) {
  isReviewModeByReviewId.value[reviewId] = false;
  reviewTextToUpdateByReviewId.value[reviewId] = null;
}

function showModal() {
  isModalVisible.value = true;
}

function hideModal() {
  isModalVisible.value = false;
}

onMounted(() => {
  fetchData();
});
</script>
<template>
  <loading-indicator v-if="fetchDataInProgress" class="mt-5" />
  <n-alert v-if="generalError" title="Error" type="error" class="mb-4">
    {{ generalError }}
  </n-alert>
  <div v-if="fetchDataSucceeded" class="grid grid-cols-12">
    <!-- Product Details -->
    <div class="col-span-12 md:col-span-7">
      <div>
        <n-carousel
          :show-arrow="product.images.length > 1"
          :show-dots="product.images.length > 1"
        >
          <img
            v-for="(address, index) in product.images"
            :key="index"
            class="carousel-img"
            :src="`${VITE_API_BASE_URL}assets/images/products/${address}`"
          />
        </n-carousel>
      </div>
      <div class="pt-2 text-black">
        <div class="flex justify-between items-center">
          <div class="font-bold text-lg">
            <span>{{ product.title }}</span>
            <span v-if="product.brand" class="font-medium text-base">
              by {{ product.brand.name }}
            </span>
          </div>
          <n-button @click="showModal" type="primary"> Order </n-button>
        </div>
        <div v-if="product.description" class="py-1">
          {{ product.description }}
        </div>
        <div class="flex justify-between py-1">
          <div>
            <span class="font-semibold text-md">
              {{
                format(
                  product.unitsAvailable > PRODUCT_UNIT_COUNT_THRESHOLD
                    ? 1000000
                    : product.unitsAvailable
                )
              }}+
            </span>
            Units available
          </div>
          <div class="flex justify-end">
            <fa-icon
              @click="onProductLike"
              :icon="[`${isProductInWishlist ? 'fas' : 'far'}`, 'heart']"
              size="2x"
              :style="{ color: isProductInWishlist ? 'red' : 'black' }"
              class="cursor-pointer px-4"
            />
            <img
              @click="onCartClick"
              :src="`${VITE_API_BASE_URL}assets/images/trolley-${
                isProductInCart ? 'solid' : 'regular'
              }.png`"
              style="height: 28px"
              class="cursor-pointer"
            />
          </div>
        </div>
        <div class="flex flex-row items-end py-4">
          <n-input
            v-model:value="reviewText"
            :rows="1"
            type="textarea"
            placeholder="Write about your experience"
          />
          <div class="pl-2">
            <n-button
              @click="onReviewPostClick"
              :disabled="!reviewText"
              type="primary"
            >
              <template v-if="reviewSubmitInProgress">
                <loading-indicator size="lg" />
              </template>
              <template v-else> Post </template>
            </n-button>
          </div>
        </div>
      </div>
    </div>
    <!-- Product Details End -->

    <!-- Reviews -->
    <div class="col-span-12 md:col-span-5 h-100 px-1">
      <div class="w-full h-full flex flex-col">
        <div class="h-full p-1">
          <div
            v-if="product.reviews.length === 0"
            class="bg-slate-200 rounded-md text-center p-2 font-semibold text-lg"
          >
            No reviews yet
          </div>
          <div
            v-for="review in product.reviews"
            :key="review.id"
            class="p-1 bg-slate-200 rounded-md mb-1"
          >
            <template v-if="!isReviewModeByReviewId[review.id]">
              <div
                class="flex justify-between items-center font-semibold text-black pb-1 pr-1"
              >
                <div class="flex items-center">
                  <n-avatar
                    :src="`${VITE_API_BASE_URL}users/${review.author.id}/picture`"
                    :fallback-src="USER_ICON_PNG"
                    size="small"
                    round
                  />
                  <div class="ml-1">{{ review.author.name }}</div>
                </div>
                <fa-icon
                  v-if="review.author.id === auth.user.id"
                  @click="onReviewEditClick(review.id, review.comment)"
                  :icon="['fas', 'pencil']"
                  class="cursor-pointer"
                />
              </div>
              <div>{{ review.comment }}</div>
            </template>
            <template v-else>
              <div class="flex justify-between items-end">
                <n-input
                  v-model:value="reviewTextToUpdateByReviewId[review.id]"
                  :rows="1"
                  type="textarea"
                  placeholder=""
                />
                <span class="ml-1 flex items-center">
                  <n-button
                    @click="onReviewUpdateCancel(review.id)"
                    :disabled="reviewUpdateInProgress"
                    type="default"
                    size="medium"
                  >
                    Cancel
                  </n-button>
                  <div class="ml-1">
                    <n-button
                      @click="onReviewUpdateClick(review.id)"
                      type="primary"
                      size="medium"
                    >
                      <template v-if="reviewUpdateInProgress">
                        <loading-indicator size="lg" />
                      </template>
                      <template v-else>Save</template>
                    </n-button>
                  </div>
                </span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- Reviews End -->
  </div>
  <n-modal
    :show="isModalVisible"
    :on-esc="hideModal"
    :on-mask-click="hideModal"
  >
    <div class="w-11/12 md:w-1/2">
      <n-card>
        <n-form ref="orderFormRef" :model="orderForm" :rules="orderFormRules">
          <n-form-item
            label="Delivery Address"
            path="deliveryAddress"
            :validation-status="
              orderFormFieldErrors.deliveryAddress.validationStatus
            "
            :feedback="orderFormFieldErrors.deliveryAddress.feedback"
            class="transition-margin duration-150"
            :class="{ 'mb-4': orderFormFieldErrors.deliveryAddress.hasError }"
          >
            <n-input
              v-model:value="orderForm.deliveryAddress"
              type="textarea"
              placeholder=""
            />
          </n-form-item>
          <div class="flex justify-end">
            <n-space>
              <n-button @click="hideModal"> Cancel </n-button>
              <n-button type="primary" @click="onOrderClick">
                <template v-if="orderSubmitInProgress">
                  <loading-indicator size="lg" />
                </template>
                <template v-else>Order</template>
              </n-button>
            </n-space>
          </div>
        </n-form>
      </n-card>
    </div>
  </n-modal>
</template>
