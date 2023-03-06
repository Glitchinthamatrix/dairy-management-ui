import { axios } from "../utils/axios";

export default {
  getCart: (id) => axios.get(`/carts/${id}`),
  addProductToCart: (id, data) => axios.put(`/carts/${id}`, data),
  removeProductFromCart: (id, data) => axios.delete(`/carts/${id}`, data),
};
