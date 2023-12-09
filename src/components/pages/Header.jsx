/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { Toaster, toast } from "sonner";

export const Header = () => {
  const auth = useAuth();

  async function handleSignOut(e) {
    e.preventDefault();
    toast.success("¡Hasta la vista!", {
      description: "Tu cierre de sesión fue exitoso.",
    });
    setTimeout(() => {
      auth.signout();
    }, 3000);
  }
  return (
    <div>
      <Toaster position="top-center" richColors />
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-cyan navbar-dark">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item hamburger">
            <Link className="nav-link" data-widget="pushmenu" href="#">
              <i className="fas fa-bars" />
            </Link>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/" className="nav-link">
              <i className="fas fa-home" />
            </Link>
          </li>
          {!auth.isAuthenticated && (
            <li className="nav-item">
              <Link className="nav-link" to="/ingreso">
                <i className="fas fa-sign-in-alt" />
              </Link>
            </li>
          )}

          {!auth.isAuthenticated && (
            <li className="nav-item">
              <Link className="nav-link" to="/registro">
                <i className="fas fa-user-plus" />
              </Link>
            </li>
          )}
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          {/* cesta de compras */}
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="fas fa-shopping-basket" />
              <span className="badge badge-warning navbar-badge">15</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-item dropdown-header">15 Pedidos</span>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                <i className="fas fa-shipping-fast" />
                En ruta{" "}
                <span className="float-right text-muted text-sm">3</span>
              </a>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                <i className="fas fa-thumbs-up" /> Despachados{" "}
                <span className="float-right text-muted text-sm">12</span>
              </a>
              <div className="dropdown-divider" />
              <Link to="pedidos" className="dropdown-item dropdown-footer">
                Ver todos los pedidos
              </Link>
            </div>
          </li>
          {auth.isAuthenticated && (
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleSignOut}>
                <i className="fas fa-sign-out-alt" />
              </a>
            </li>
          )}
        </ul>
      </nav>
      {/* /.navbar */}
    </div>
  );
};
