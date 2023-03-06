import { axios } from "../utils/axios";

export default {
  getBrands: () => axios.get("/brands"),
  getBrand: (id) => axios.get(`/brands/${id}`),
  addBrand: (data) => axios.post("/brands", data),
  updateBrand: (id, data) => axios.put(`/brands/${id}`, data),
  deleteBrand: (id) => axios.delete(`/brands/${id}`),
};
