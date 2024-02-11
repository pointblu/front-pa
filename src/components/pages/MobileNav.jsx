/* eslint-disable jsx-a11y/img-redundant-alt */
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { Toaster, toast } from "sonner";
import { Tooltip } from "react-tooltip";

/* eslint-disable jsx-a11y/anchor-is-valid */
export const MobileNav = () => {
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
    <div style={{ position: "fixed", width: "100%", bottom: 0, zIndex: 9998 }}>
      <Toaster position="top-center" richColors />
      {/* Main Sidebar Container */}
      <div className="mobile-menu navbar navbar-expand navbar-dark">
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
        <div className="sidebar">
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills navbar-nav fixed"
              style={{
                gap: "0.2rem",
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                overflowX: "scroll",
                fontSize: "0.6rem",
              }}
            >
              <Tooltip id="tt-menu-m" />
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}

              {isAdmin && (
                <li
                  className="nav-item mx-2"
                  style={{
                    minWidth: "45px",
                    position: "relative",
                    zIndex: 1100,
                  }}
                  data-tooltip-id="tt-menu-m"
                  data-tooltip-content="Usuarios"
                  data-tooltip-place="top"
                  data-tooltip-float={false}
                  data-tooltip-class-name="custom-tooltip"
                >
                  <NavLink
                    to="/usuarios"
                    className="nav-link"
                    style={{ backgroundColor: "grey" }}
                  >
                    <i className="fas fa-users nav-icon" />
                  </NavLink>
                </li>
              )}

              <li
                className="nav-item mx-2"
                style={{ minWidth: "45px", position: "relative", zIndex: 9999 }}
                data-tooltip-id="tt-menu-m"
                data-tooltip-content="Catalogo"
                data-tooltip-place="top"
                data-tooltip-float={false}
                data-tooltip-class-name="custom-tooltip"
              >
                <NavLink
                  to="/catalogo"
                  className="nav-link"
                  style={{ backgroundColor: "cadetblue" }}
                >
                  <i className="fas fa-boxes nav-icon" />
                </NavLink>
              </li>

              <li
                className="nav-item mx-2"
                style={{ minWidth: "45px", position: "relative", zIndex: 9999 }}
                data-tooltip-id="tt-menu-m"
                data-tooltip-content="Pedidos"
                data-tooltip-place="top"
                data-tooltip-float={false}
                data-tooltip-class-name="custom-tooltip"
              >
                <NavLink
                  to="/pedidos"
                  className="nav-link"
                  style={{ backgroundColor: "#C3a873" }}
                  onClick={!auth.isAuthenticated && handleNoAuth}
                >
                  <i className="fas fa-shopping-basket nav-icon" />
                </NavLink>
              </li>
              {isAdmin && (
                <li
                  className="nav-item mx-2"
                  style={{
                    minWidth: "45px",
                    position: "relative",
                    zIndex: 9999,
                  }}
                  data-tooltip-id="tt-menu-m"
                  data-tooltip-content="Ventas"
                  data-tooltip-place="top"
                  data-tooltip-float={false}
                  data-tooltip-class-name="custom-tooltip"
                >
                  <NavLink
                    to="/ventas"
                    className="nav-link"
                    style={{ backgroundColor: "#91b77d" }}
                  >
                    <i className="fas fa-cash-register nav-icon" />
                  </NavLink>
                </li>
              )}
              {isAdmin && (
                <li
                  className="nav-item mx-2"
                  style={{
                    minWidth: "45px",
                    position: "relative",
                    zIndex: 9999,
                  }}
                  data-tooltip-id="tt-menu-m"
                  data-tooltip-content="Categorias"
                  data-tooltip-place="top"
                  data-tooltip-float={false}
                  data-tooltip-class-name="custom-tooltip"
                >
                  <NavLink
                    to="/categorias"
                    className="nav-link"
                    style={{ backgroundColor: "#803b3b" }}
                  >
                    <i className="fas fa-tag nav-icon" />
                  </NavLink>
                </li>
              )}

              {isAdmin && (
                <li
                  className="nav-item mx-2"
                  style={{
                    minWidth: "45px",
                    position: "relative",
                    zIndex: 9999,
                  }}
                  data-tooltip-id="tt-menu-m"
                  data-tooltip-content="Cuentas"
                  data-tooltip-place="top"
                  data-tooltip-float={false}
                  data-tooltip-class-name="custom-tooltip"
                >
                  <NavLink
                    to="/cuentas"
                    className="nav-link"
                    style={{ backgroundColor: "#3279fd" }}
                  >
                    <i className="fas fa-university nav-icon" />
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </div>
    </div>
  );
};
