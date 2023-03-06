import { axios } from "../utils/axios.js";

export default {
  getOrders: () => axios.get("/orders"),
  addOrder: (data) => axios.post("/orders", data),
  cancelOrder: (id) => axios.put(`/orders/${id}/cancel`),
};
