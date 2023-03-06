import { axios } from "../utils/axios";

export default {
  getCategories: () => axios.get("/categories"),
  addCategory: (data) => axios.post("/categories", data),
  deleteCategory: (id) => axios.delete(`/categories/${id}`),
};
