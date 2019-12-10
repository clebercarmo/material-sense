import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL:
    "https://inglezaonline.com.br/cgi-bin/ws.do/WService=reservas/action/data"
});

api.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
