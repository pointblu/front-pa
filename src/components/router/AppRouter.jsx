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
import Protected from "./Protected";
import { MobileNav } from "../pages/MobileNav";

export const AppRouter = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Protected />}>
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/ventas" element={<Ventas />} />
        </Route>
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/ingreso" element={<Login />} />
      </Routes>
      <SideNav />
      <MobileNav />
      <Footer />
    </>
  );
};
