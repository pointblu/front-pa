/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Link } from "react-router-dom";

export const Header=()=> {
  return (
    <div>
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-cyan navbar-dark">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars" />
            </Link>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/" className="nav-link">
              <i className="fas fa-home" />
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/ingreso" role="button">
              <i className="fas fa-sign-in-alt" />
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/registro" role="button">
              <i className="fas fa-user-plus" />
            </Link>
          </li>
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
                <i className="fas fa-shipping-fast" /> En ruta
                <span className="float-right text-muted text-sm">3</span>
              </a>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                <i className="fas fa-thumbs-up" /> Despachados
                <span className="float-right text-muted text-sm">12</span>
              </a>
              <div className="dropdown-divider" />
              <Link to="pedidos" className="dropdown-item dropdown-footer">
                Ver todos los pedidos
              </Link>
            </div>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#" role="button">
              <i className="fas fa-sign-out-alt" />
            </a>
          </li>
        </ul>
      </nav>
      {/* /.navbar */}
    </div>
  );
}

