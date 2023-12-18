import "../../App.css";
import {
  Catalogo,
  Categorias,
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
import { CreateProduct } from "../pages/CreateProducts";
import { CreateCategories } from "./../pages/CreateCategories";
import { CartProvider } from "../../context/cart";

export const AppRouter = () => {
  return (
    <CartProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Protected />}>
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/producto" element={<CreateProduct />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categoria" element={<CreateCategories />} />
        </Route>
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/ingreso" element={<Login />} />
      </Routes>
      <SideNav />
      <MobileNav />
      <Footer />
    </CartProvider>
  );
};
