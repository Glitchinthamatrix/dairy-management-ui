import { axios } from "../utils/axios";

export default {
  getWishlist: (id) => axios.get(`/wishlists/${id}`),
  addProductToWishlist: (id, data) => axios.put(`/wishlists/${id}`, data),
  removeProductFromWishlist: (id, data) =>
    axios.delete(`/wishlists/${id}`, data),
};
