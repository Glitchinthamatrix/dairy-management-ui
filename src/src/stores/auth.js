import { defineStore } from "pinia";
import sessionsApi from "../api/session";
import usersApi from "../api/user";
import { STORAGE_KEY_TOKEN } from "../constants";
import storage from "../utils/storage";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      token: null,
      user: null,
    };
  },

  getters: {
    isAuthenticated: (state) => state.token !== null,
    userName: (state) => (state.user !== null ? state.user.name : ""),
    isAnAdmin: (state) => state.user !== null && state.user.isAnAdmin,
    isASeller: (state) => state.user !== null && state.user.isASeller,
    isACustomer: (state) =>
      state.user !== null && !state.user.isAdmin && !state.user.isASeller,
    cartId: (state) => (state.isACustomer ? state.user.cart : null),
    wishlistId: (state) => (state.isACustomer ? state.user.wishlist : null),
    deliveryAddress: (state) =>
      state.isACustomer ? state.user.deliveryAddress : null,
  },

  actions: {
    async login(data) {
      this.clearSession();
      var res = await sessionsApi.createSession(data);
      await this.startNewSession(res.authToken);
    },

    clearSession() {
      this.$reset();
      storage.removeItem(STORAGE_KEY_TOKEN);
    },

    async startNewSession(token) {
      console.log("storing token ", token, " with key ", STORAGE_KEY_TOKEN);
      storage.setItem(STORAGE_KEY_TOKEN, token);
      // localStorage.setItem(STORAGE_KEY_TOKEN, token);
      await this.initSession(token);
    },

    async restoreExistingSession() {
      const token = storage.getItem(STORAGE_KEY_TOKEN);
      await this.initSession(token);
    },

    async initSession(token) {
      this.token = token;
      this.user = await usersApi.getCurrentUser();
    },

    async logout() {
      try {
        await sessionsApi.deleteSession();
      } catch (e) {
        // Do nothing
      } finally {
        this.endSession();
      }
    },

    endSession() {
      this.clearSession();
    },
  },
});
