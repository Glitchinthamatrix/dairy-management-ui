import { axios } from "../utils/axios";

export default {
  getProducts: () => axios.get("/products"),
  searchProducts: (title, category) =>
    axios.get(
      `/products/search?${title ? `title=${title}` : ""}${
        category ? `&category=${category}` : ""
      }`
    ),
  getProduct: (productId) => axios.get(`/products/${productId}`),
  addProduct: (data) => axios.post("/products", data),
  updateProduct: (id, data) => axios.put(`/products/${id}`, data),
  addProductImage: (productId, data) =>
    axios.post(`/products/${productId}/images`, data),
  deleteProductImage: (productId, address) =>
    axios.delete(`/products/${productId}/images/${address}`),
  deleteProduct: (id) => axios.delete(`/products/${id}`),
  addReview: (id, data) => axios.post(`/products/${id}/reviews`, data),
};
