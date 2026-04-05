import { useSocket } from "../../hooks/useSocket";
import { useAuth } from "../../auth/AuthProvider";

export function NotificationsListener() {
  const auth = useAuth();
  const userInfo = auth.isAuthenticated
    ? JSON.parse(localStorage.getItem("userInfo") || "null")
    : null;
  const role = userInfo?.role ?? null;

  useSocket(userInfo, role);
  return null;
}
