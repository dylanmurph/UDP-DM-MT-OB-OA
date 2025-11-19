import axios from "axios";

const api = axios.create({
  baseURL: 'https://www.hostlocksd3b.online/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token.length > 20) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export default api;