import { useAuthToken } from "@/app/modules/auth/composables/useAuthToken";
import axios from "axios";

// REVISAR SI EL SCOPE TIENE ALGO QUE VER
const { getAccess, getRefresh, setTokens, removeTokens } = useAuthToken();

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado refrescar ya
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = getRefresh();
      if (!refresh) {
        removeTokens();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/token/refresh/`,
          {
            refresh,
          }
        );
        setTokens(res.data.access, refresh);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest); // reintenta la request original
      } catch (err) {
        removeTokens(); // refresh inválido → cerrar sesión
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
