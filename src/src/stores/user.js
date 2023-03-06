import { defineStore } from "pinia";
import cartApis from "../api/cart.js";
import orderApis from "../api/order.js";
import wishlistApis from "../api/wishlist.js";
import { useAuthStore } from "./auth.js";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      wishlist: null,
      cart: null,
      orders: null,
    };
  },
  getters: {
    getWishlist: (state) => {
      return (refresh = false) => state.fetchWishlist(refresh);
    },
    getCart: (state) => {
      return (refresh = false) => state.fetchCart(refresh);
    },
    getOrders: (state) => {
      return (refresh = false) => state.fetchOrders(refresh);
    },
  },
  actions: {
    async fetchWishlist(refresh) {
      if (this.wishlist === null || refresh) {
        const auth = useAuthStore();
        const wishlist = await wishlistApis.getWishlist(auth.wishlistId);
        this.wishlist = wishlist.products;
      }
      return this.wishlist;
    },
    async fetchCart(refresh) {
      if (this.cart === null || refresh) {
        const auth = useAuthStore();
        const cart = await cartApis.getCart(auth.cartId);
        this.cart = cart.products;
      }
      return this.cart;
    },
    async fetchOrders(refresh) {
      if (this.orders === null || refresh) {
        this.orders = await orderApis.getOrders();
      }
      return this.orders;
    },
  },
});
