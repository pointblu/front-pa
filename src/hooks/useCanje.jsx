import { useContext } from "react";
import { CanjeContext } from "../context/canje.jsx";

export const useCanje = () => {
  const context = useContext(CanjeContext);

  if (context === undefined) {
    throw new Error("useCanje must be used within a CanjeProvider");
  }

  return context;
};
