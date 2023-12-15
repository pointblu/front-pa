import { Outlet, Navigate } from "react-router-dom";

export default function Protected() {
  const auth = JSON.parse(localStorage.getItem("isAuth"));

  return auth ? <Outlet /> : <Navigate to="/" />;
}
