import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

const STATUS_LABELS = {
  ROUTED: "En ruta 🚚",
  DELIVERED: "Entregado ✅",
  CANCELED: "Cancelado ❌",
  REQUESTED: "En proceso ⏳",
};

export function useSocket(userInfo, role) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userInfo) return;

    const wsUrl = (process.env.REACT_APP_API_URL || "").replace("/api", "");
    const socket = io(wsUrl, { transports: ["websocket"], reconnectionDelay: 3000 });
    socketRef.current = socket;

    const isStaff = role === "ADMIN" || role === "SELLER";

    socket.on("purchase:new", ({ total }) => {
      if (isStaff) {
        toast.info("Nuevo pedido recibido", {
          description: `Total: $${Number(total).toFixed(0)}`,
          duration: 8000,
        });
      }
    });

    socket.on("purchase:updated", ({ status, buyerId, buyerName }) => {
      const label = STATUS_LABELS[status] || status;
      if (isStaff) {
        toast.info(`Pedido actualizado — ${label}`, {
          description: `Cliente: ${buyerName}`,
          duration: 6000,
        });
      } else if (userInfo.id === buyerId) {
        toast.success(`Tu pedido cambió de estado`, {
          description: label,
          duration: 8000,
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userInfo?.id, role]);
}
