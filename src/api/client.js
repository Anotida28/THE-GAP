import axios from "axios";

export const api = axios.create({
  baseURL:"https://unextravagantly-astrometric-darnell.ngrok-free.dev"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
