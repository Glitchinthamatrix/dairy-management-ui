import { useAuthStore } from "../stores/auth";
import storage from "../utils/storage";
import { STORAGE_KEY_TOKEN } from "../constants";

export default {
  // eslint-disable-next-line no-unused-vars
  async checkAuth(to, from) {
    const auth = useAuthStore();

    if (to.name === "login" || to.name === "sign-up") {
      // If user is navigating to login or sign-up page, allow the navigation
      return true;
    } else if (to.name === "forgot-password") {
      // If user is navigating to forgot password page, allow the navigation
      return true;
    } else if (to.name === "reset-password") {
      // If user is navigating to reset password page, allow the navigation
      return true;
    } else if (auth.isAuthenticated) {
      // If user is authenticated, allow the navigation.
      return true;
    } else if (storage.itemExists(STORAGE_KEY_TOKEN)) {
      // If token is in storage, restore existing session and then
      // allow the navigation.
      await auth.restoreExistingSession();
      if (from.name === undefined && to.name === undefined) {
        const route = { name: "customer-products" };
        if (auth.isAnAdmin) {
          route.name = "admin-home";
        } else if (auth.isASeller) {
          route.name = "seller-home";
        }
        return route;
      } else {
        return true;
      }
    } else {
      // If user is not authenticated or token is not in storage,
      // navigate to login page
      return { name: "login" };
    }
  },
};
