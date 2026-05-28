import axios from "axios";
import conf from "../conf/conf";

const baseUrl = (conf.backendBaseUrl || "").replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${baseUrl}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
