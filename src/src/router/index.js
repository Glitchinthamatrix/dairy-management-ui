import { createRouter, createWebHistory } from "vue-router";
import guards from "../router/guards";

import BrandAddEditSellerView from "../views/seller/brand/BrandAddEditView.vue";
import BrandListSellerView from "../views/seller/brand/BrandListView.vue";
import CategoryAddEditAdminView from "../views/admin/category/CategoryAddEditView.vue";
import CategoryListAdminView from "../views/admin/category/CategoryListView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/auth/LoginView.vue";
import OrderListSellerView from "../views/seller/order/OrderListView.vue";
import ProductAddEditSellerView from "../views/seller/product/ProductAddEditView.vue";
import ProductDetailsCustomerView from "../views/customer/product/ProductDetailsView.vue";
import ProductDetailsSellerView from "../views/seller/product/ProductDetailsView.vue";
import ProductListAdminView from "../views/admin/product/ProductListView.vue";
import ProductListCustomerView from "../views/customer/product/ProductListView.vue";
import ProductListSellerView from "../views/seller/product/ProductListView.vue";
import ProfileCustomerView from "../views/customer/ProfileView.vue";
import ProfileSellerView from "../views/seller/ProfileView.vue";
import SignupView from "../views/auth/SignUpView.vue";
import UserListAdminView from "../views/admin/users/UserListView.vue";

const LAYOUT_BASIC = "basic";

const routes = [
  // Auth
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      layout: LAYOUT_BASIC,
    },
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignupView,
    meta: {
      layout: LAYOUT_BASIC,
    },
  },

  // Admin routes
  {
    path: "/admin",
    name: "admin-home",
    component: HomeView,
  },
  {
    path: "/admin/categories",
    name: "admin-categories",
    component: CategoryListAdminView,
  },
  {
    path: "/admin/categories/add",
    name: "admin-category-add",
    component: CategoryAddEditAdminView,
  },
  {
    path: "/admin/products",
    name: "admin-products",
    component: ProductListAdminView,
  },
  {
    path: "/admin/users",
    name: "admin-users",
    component: UserListAdminView,
  },

  // Seller routes
  {
    path: "/seller",
    name: "seller-home",
    component: HomeView,
  },
  {
    path: "/seller/products",
    name: "seller-products",
    component: ProductListSellerView,
  },
  {
    path: "/seller/products/:productId",
    name: "seller-product",
    component: ProductDetailsSellerView,
  },
  {
    path: "/seller/products/add",
    name: "seller-product-add",
    component: ProductAddEditSellerView,
    meta: {
      editMode: false,
    },
  },
  {
    path: "/seller/products/:productId/edit",
    name: "seller-product-edit",
    component: ProductAddEditSellerView,
    meta: {
      editMode: true,
    },
  },
  {
    path: "/seller/brands",
    name: "seller-brands",
    component: BrandListSellerView,
  },
  {
    path: "/seller/brands/add",
    name: "seller-brand-add",
    component: BrandAddEditSellerView,
    meta: {
      editMode: false,
    },
  },
  {
    path: "/seller/brands/:brandId/edit",
    name: "seller-brand-edit",
    component: BrandAddEditSellerView,
    meta: {
      editMode: true,
    },
  },
  {
    path: "/seller/orders",
    name: "seller-orders",
    component: OrderListSellerView,
  },
  {
    path: "/seller/profile",
    name: "seller-profile",
    component: ProfileSellerView,
  },

  // Customer routes
  {
    path: "/customer/products",
    name: "customer-products",
    component: ProductListCustomerView,
    meta: {
      layout: LAYOUT_BASIC,
    },
  },
  {
    path: "/customer/products/:productId",
    name: "customer-product-details",
    component: ProductDetailsCustomerView,
    meta: {
      layout: LAYOUT_BASIC,
    },
  },
  {
    path: "/customer/profile",
    name: "customer-profile",
    component: ProfileCustomerView,
    meta: {
      layout: LAYOUT_BASIC,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

// Check authentication on each route
router.beforeEach(guards.checkAuth);

export default router;
