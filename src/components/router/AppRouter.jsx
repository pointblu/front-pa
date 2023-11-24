import "../../App.css";
import {
  Catalogo,
  Footer,
  Header,
  Home,
  Login,
  Pedidos,
  Register,
  SideNav,
  Usuarios,
  Ventas,
} from "../pages";

import { Route, Routes } from "react-router-dom";

export const AppRouter = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/ingreso" element={<Login />} />
      </Routes>
      <SideNav />
      <Footer />
    </>
  );
};
