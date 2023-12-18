/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { Toaster, toast } from "sonner";
import { API_URL } from "../../auth/constants";
import { fetchData } from "../../fetchData/fetchData";

const apiData = fetchData(`${API_URL}/categories`);

export const Header = () => {
  const categories = apiData.read();
  localStorage.setItem("categorias", JSON.stringify(categories));

  const auth = useAuth();

  async function handleSignOut(e) {
    e.preventDefault();
    toast.success("¡Hasta la vista!", {
      description: "Tu cierre de sesión fue exitoso.",
      duration: 3000,
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
          <li className="nav-item">
            <Link className="nav-link" to="/pedidos">
              <i className="fas fa-shopping-basket" />
              <span className="badge badge-warning navbar-badge">15</span>
            </Link>
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
