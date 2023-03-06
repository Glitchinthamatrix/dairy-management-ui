import { axios } from "../utils/axios";

export default {
  getCurrentUser: () => axios.get("/users/me/"),
  updateUserPicture: (id, data) => axios.put(`/users/${id}/picture`, data),
  getUsers: () => axios.get("/users"),
  deleteUser: (id) => axios.delete(`/users/${id}`),
};
