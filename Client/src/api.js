import axios from "axios";

const api = axios.create({
  baseURL: 'https://www.hostlocksd3b.online/api'
});

api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.token && user.token.length > 20) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export default api;