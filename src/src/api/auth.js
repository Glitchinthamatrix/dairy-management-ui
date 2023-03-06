import { axios } from "../utils/axios";

export default {
  signUp: (data) => axios.post("/auth/sign-up/", data),
  changePassword: (data) => axios.put("/auth/v1/change-password/", data),
};
