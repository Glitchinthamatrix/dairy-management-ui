import { axios } from "../utils/axios";

export default {
  updateReview: (id, data) => axios.put(`/reviews/${id}`, data),
};
