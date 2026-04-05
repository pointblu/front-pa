import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../auth/constants";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Adjunta el token JWT en cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("token") || "null");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Sin respuesta del servidor (red caída, CORS, timeout)
      toast.error("Sin conexión", {
        description: "Verifica tu conexión a internet e intenta de nuevo.",
      });
      return Promise.reject(error);
    }

    const { status } = error.response;

    if (status === 401) {
      toast.error("Sesión expirada", {
        description: "Vuelve a iniciar sesión para continuar.",
        duration: 4000,
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      // HashRouter usa /#/ruta
      window.location.href = "/#/ingreso";
    } else if (status === 403) {
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
