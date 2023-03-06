import baseAxios from "axios";
import router from "../router";
import { useAuthStore } from "../stores/auth";

export const axios = baseAxios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request Interceptor
axios.interceptors.request.use(
  (config) => {
    if (config.url.startsWith("/")) {
      // Add Authorization header
      const auth = useAuthStore();
      if (auth.token) {
        config.headers["Authorization"] = auth.token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
const HTTP_ERROR_BAD_REQUEST = 400;
const HTTP_ERROR_UNAUTHORIZED = 401;
const HTTP_ERROR_FORBIDDEN = 403;
const HTTP_ERROR_NOT_FOUND = 404;
const HTTP_ERROR_UNPROCESSABLE_ENTITY = 422;

axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === HTTP_ERROR_UNPROCESSABLE_ENTITY) {
        return Promise.reject(error.response.data);
      }

      if (
        error.response.status === HTTP_ERROR_BAD_REQUEST ||
        error.response.status === HTTP_ERROR_UNAUTHORIZED ||
        error.response.status === HTTP_ERROR_FORBIDDEN ||
        error.response.status === HTTP_ERROR_NOT_FOUND
      ) {
        const auth = useAuthStore();
        auth.endSession();
        router.push({ name: "login" });
        return Promise.reject({});
      }
    }
    return Promise.reject({
      message: "An unexpected error occured. Please try again",
    });
  }
);
