import { axios } from "../utils/axios";

export default {
  createSession: (data) => axios.post("/sessions", data),
  deleteSession: () => axios.delete("/sessions"),
};
