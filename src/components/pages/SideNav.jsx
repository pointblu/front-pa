/* eslint-disable jsx-a11y/img-redundant-alt */
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { Toaster, toast } from "sonner";

/* eslint-disable jsx-a11y/anchor-is-valid */
export const SideNav = () => {
  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isAdmin =
    auth.isAuthenticated && userObject && userObject.role === "ADMIN";
  const goTo = useNavigate();
  function handleNoAuth(e) {
    e.preventDefault();
    toast.info("¡Bienvenido a Punto Azul!", {
      description:
        "Regístrate para disfrutar de nuestras delicias recién horneadas. ¡Tus pedidos te esperan!",
    });
    goTo("/registro");
  }

  return (
    <div>
      {/* Main Sidebar Container */}
      <Toaster position="top-center" richColors />
      <aside
        className="main-sidebar sidebar-dark-primary elevation-4 sidebar-collapse"
        style={{ zIndex: "9999" }}
      >
        {/* Brand Logo */}
        <Link to="/" className="brand-link">
          <img
            src={process.env.PUBLIC_URL + "/dist/img/logo_punto_azul_pq.png"}
            alt="Punto Azul Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light text-md">
            Panaderia <b>Punto Azul</b>
          </span>
        </Link>
        {/* Sidebar */}
        <div className="sidebar" style={{ position: "fixed" }}>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}

              {isAdmin && (
                <li className="nav-item text-left">
                  <NavLink
                    to="/usuarios"
                    className="nav-link"
                    style={{ backgroundColor: "grey" }}
                  >
                    <i className="fas fa-users nav-icon" />
                    <p>USUARIOS</p>
                  </NavLink>
                </li>
              )}

              <li className="nav-item text-left ">
                <NavLink
                  to="/catalogo"
                  className="nav-link"
                  style={{ backgroundColor: "cadetblue" }}
                >
                  <i className="fas fa-boxes nav-icon" />
                  <p>CATÁLOGO</p>
                </NavLink>
              </li>

              <li className="nav-item text-left">
                <NavLink
                  to="/pedidos"
                  className="nav-link"
                  style={{ backgroundColor: "#C3a873" }}
                  onClick={!auth.isAuthenticated && handleNoAuth}
                >
                  <i className="fas fa-shopping-basket nav-icon" />
                  <p>PEDIDOS</p>
                </NavLink>
              </li>
              {isAdmin && (
                <li className="nav-item text-left">
                  <NavLink
                    to="/ventas"
                    className="nav-link"
                    style={{ backgroundColor: "#91b77d" }}
                  >
                    <i className="fas fa-cash-register nav-icon" />
                    <p>VENTAS</p>
                  </NavLink>
                </li>
              )}

              {isAdmin && (
                <li className="nav-item text-left">
                  <NavLink
                    to="/categorias"
                    className="nav-link"
                    style={{ backgroundColor: "#803b3b" }}
                  >
                    <i className="fas fa-tag nav-icon" />
                    <p>CATEGORÍAS</p>
                  </NavLink>
                </li>
              )}

              {isAdmin && (
                <li className="nav-item text-left">
                  <NavLink
                    to="/cuentas"
                    className="nav-link"
                    style={{ backgroundColor: "#3279fd" }}
                  >
                    <i className="fas fa-university nav-icon" />
                    <p>CUENTAS</p>
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
};
