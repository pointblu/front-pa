import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../auth/constants";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("token") || "null");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
let isRefreshing = false;
let pendingQueue = []; // requests waiting for token refresh

function processPendingQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (!error.response) {
      toast.error("Sin conexión", {
        description: "Verifica tu conexión a internet e intenta de nuevo.",
      });
      return Promise.reject(error);
    }

    const { status } = error.response;

    // ── Auto-refresh on 401 ──────────────────────────────────────────────────
    if (status === 401 && !original._retry) {
      const refreshToken = localStorage.getItem("refreshToken");

      // No refresh token → go to login
      if (!refreshToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        window.location.href = "/#/ingreso";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${API_URL}/Auth/refresh`, {
          refreshToken,
        });

        const newToken = data.accessToken;
        localStorage.setItem("token", JSON.stringify(newToken));
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        original.headers.Authorization = `Bearer ${newToken}`;

        processPendingQueue(null, newToken);
        return api(original);
      } catch (refreshError) {
        processPendingQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        toast.error("Sesión expirada", {
          description: "Vuelve a iniciar sesión para continuar.",
          duration: 4000,
        });
        window.location.href = "/#/ingreso";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      toast.error("Acceso denegado", {
        description: "No tienes permiso para realizar esta acción.",
      });
    } else if (status >= 500) {
      toast.error("Error del servidor", {
        description: "Algo salió mal en el servidor. Intenta más tarde.",
      });
    }

    return Promise.reject(error);
  }
);

export default api;
