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
  Replenish,
  EditProduct,
  EditCategories,
  CreatePayment,
  CreateAdvertisement,
  EditAdvertisement,
  Recover,
  Redimir,
  CreateBank,
  Cuentas,
  EditBank,
  ChangePass,
  Chat,
} from "../pages";
import { Route, Routes } from "react-router-dom";
import Protected from "./Protected";
import { MobileNav } from "../pages/MobileNav";
import { CreateProduct } from "../pages/CreateProducts";
import { CreateCategories } from "./../pages/CreateCategories";
import { CartProvider } from "../../context/cart";
import { CanjeProvider } from "../../context/canje";
import { PointProvider } from "../../context/point";

export const AppRouter = () => {
  return (
    <PointProvider>
      <CanjeProvider>
        <CartProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/" element={<Protected />}>
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/producto" element={<CreateProduct />} />
              <Route path="/editar-producto" element={<EditProduct />} />
              <Route path="/editar-categoria" element={<EditCategories />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/categoria" element={<CreateCategories />} />
              <Route path="/pago" element={<CreatePayment />} />
              <Route path="/crear-anuncio" element={<CreateAdvertisement />} />
              <Route path="/editar-anuncio" element={<EditAdvertisement />} />
              <Route path="/cuentas" element={<Cuentas />} />
              <Route path="/crear-cuenta" element={<CreateBank />} />
              <Route path="/editar-cuenta" element={<EditBank />} />
              <Route
                path="/reposicion/:productId/:pCost/:pStock/:pName"
                element={<Replenish />}
              />
            </Route>
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/ingreso" element={<Login />} />
            <Route path="/recuperar" element={<Recover />} />
            <Route path="/canjear" element={<Redimir />} />
            <Route path="/actualizar-celular" element={<ChangePass />} />
            <Route path="/pqr" element={<Chat />} />
          </Routes>
          <SideNav />
          <MobileNav />
          <Footer />
        </CartProvider>
      </CanjeProvider>
    </PointProvider>
  );
};
