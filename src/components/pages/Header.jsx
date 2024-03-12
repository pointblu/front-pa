/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { Toaster, toast } from "sonner";
import { API_URL } from "../../auth/constants";
import { useSpring, animated } from "react-spring";
import { Tooltip } from "react-tooltip";
import "./Header.css";
import { format } from "date-fns";
import { UserNumber } from "../../context/point";
import { getUserLocation } from "../helpers/getUserLocation";

const token = JSON.parse(localStorage.getItem("token"));

function UserNumb({ n }) {
  const { animatedNumber } = useSpring({
    from: { animatedNumber: 0 },
    animatedNumber: Number(n),
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return <animated.div>{animatedNumber.to((n) => n.toFixed(0))}</animated.div>;
}

export const Header = () => {
  const [datum, setDatum] = useState([]);
  const [apiData, setApiData] = useState([]);
  const goTo = useNavigate();
  const categories = apiData;
  localStorage.setItem("categorias", JSON.stringify(categories));

  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");

  const isClient =
    auth.isAuthenticated && userObject && userObject.role === "CLIENT";

  useEffect(() => {
    fetchDataAsync();
    fetchCategoriesAsync();
  }, []);

  const fetchCategoriesAsync = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
          mode: "no-cors",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const dates = await response.json();

      setApiData(dates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataAsync = async () => {
    try {
      const response = await fetch(`${API_URL}/users/all/counter`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
          mode: "no-cors",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const datos = await response.json();

      setDatum(datos);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const convertDateFormat = (fecha) => {
    const fechaOriginal = new Date(fecha);
    return format(fechaOriginal, "dd/MM/yyyy");
  };

  const fetchPostionAsync = async (userId, lat, lon) => {
    try {
      const response = await fetch(
        `${API_URL}/users/position/${userId}/lat/${lat}/lon/${lon}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*",
            mode: "no-cors",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleButtonClick = () => {
    const obtenerUbicacion = async () => {
      const usuarioTelegram = "+573023234804";
      try {
        const data = await getUserLocation();
        fetchPostionAsync(userObject.id, data[0], data[1]);
        window.open(`tg://resolve?domain=${usuarioTelegram}`, "_blank");
      } catch (error) {
        toast.error("Para usae el chat debes activar tu localización...", {
          description: "...y tener instalado Telegram",
        });
      }
    };
    obtenerUbicacion();
  };

  async function handleSignOut(e) {
    e.preventDefault();
    toast.success("¡Hasta la vista!", {
      description: "Tu cierre de sesión fue exitoso.",
      duration: 3000,
    });
    goTo("/catalogo");
    auth.signout();
  }
  return (
    <div>
      <Toaster position="top-center" richColors />
      {/* Navbar */}
      <nav
        className="main-header navbar navbar-expand navbar-cyan navbar-dark"
        style={{ zIndex: 9999 }}
      >
        {/* Left navbar links */}
        <ul
          className="navbar-nav"
          style={{ display: "flex", overflow: "visible" }}
        >
          <li className="nav-item hamburger">
            <Link
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              data-tooltip-id="tt-menu"
              data-tooltip-content="Menú"
              data-tooltip-place="bottom"
              data-tooltip-float={false}
              data-tooltip-offset={-10}
              data-tooltip-class-name="custom-tooltip"
            >
              <i className="fas fa-bars" />
            </Link>
            <Tooltip id="tt-menu" />
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link
              to="/"
              className="nav-link"
              data-tooltip-id="tt-home"
              data-tooltip-content="Ir al Inicio"
              data-tooltip-place="bottom"
              data-tooltip-float={false}
              data-tooltip-offset={-10}
              data-tooltip-class-name="custom-tooltip"
            >
              <i className="fas fa-home" />
            </Link>
            <Tooltip id="tt-home" />
          </li>
          {!auth.isAuthenticated && (
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/ingreso"
                data-tooltip-id="tt-login"
                data-tooltip-content="Ingresa"
                data-tooltip-place="bottom"
                data-tooltip-float={false}
                data-tooltip-offset={-10}
                data-tooltip-class-name="custom-tooltip"
              >
                <i className="fas fa-sign-in-alt" />
              </Link>
              <Tooltip id="tt-login" />
            </li>
          )}

          {!auth.isAuthenticated && (
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/registro"
                data-tooltip-id="tt-register"
                data-tooltip-content="Registrate"
                data-tooltip-place="right"
                data-tooltip-float={false}
                data-tooltip-offset={-10}
                data-tooltip-class-name="custom-tooltip"
              >
                <i className="fas fa-user-plus" />
              </Link>
              <Tooltip id="tt-register" />
            </li>
          )}

          {isClient && (
            <li
              className="nav-item"
              data-tooltip-id="tt-pass"
              data-tooltip-content="Actualizar celular"
              data-tooltip-float={false}
              data-tooltip-offset={-10}
              data-tooltip-class-name="custom-tooltip"
            >
              <Link className="nav-link" to="/actualizar-celular">
                <Tooltip id="tt-pass" />
                <i className="fas fa-mobile" />
              </Link>
            </li>
          )}
        </ul>
        {/* Right navbar links */}
        <ul
          className="navbar-nav ml-auto"
          style={{ display: "flex", overflow: "visible" }}
        >
          {auth.isAuthenticated && (
            <li
              className="nav-item"
              data-tooltip-id="tt-puntos"
              data-tooltip-content="Puntos Azules"
              data-tooltip-float={false}
              data-tooltip-class-name="custom-tooltip"
            >
              <Link className="nav-link" to="/canjear">
                <img
                  src={process.env.PUBLIC_URL + "/dist/img/puntos_azules.png"}
                  alt="Número resaltado"
                  style={{
                    width: "1.5rem",
                    position: "relative",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                  }}
                />
                <span
                  className="badge badge-dark navbar-badge"
                  style={{ right: "-0.5rem" }}
                >
                  <UserNumber n={userObject.points} />
                </span>
                <span
                  className="badge navbar-badge"
                  style={{ left: "-0.5rem", top: "2rem" }}
                >
                  Validos hasta el:{" "}
                  {auth.isAuthenticated &&
                    convertDateFormat(userObject.resetpointsat)}
                </span>
              </Link>

              <Tooltip id="tt-puntos" />
            </li>
          )}
          <li
            className="nav-item"
            style={{ flexFlow: "row" }}
            data-tooltip-id="tt-user-registered"
            data-tooltip-content="Usuarios registrados"
            data-tooltip-float={false}
            data-tooltip-class-name="custom-tooltip"
          >
            <div className="nav-link">
              <Tooltip id="tt-user-registered" />
              <i className="fas fa-users" />
              <span className="badge badge-success navbar-badge">
                <UserNumb n={datum} />
              </span>
            </div>
          </li>
          {/* cesta de compras */}
          {auth.isAuthenticated && (
            <li
              className="nav-item"
              data-tooltip-id="tt-purchases"
              data-tooltip-content="Ir a pedidos"
              data-tooltip-float={false}
              data-tooltip-offset={-10}
              data-tooltip-class-name="custom-tooltip"
            >
              <Link className="nav-link" to="/pedidos">
                <Tooltip id="tt-purchases" />
                <i className="fas fa-shopping-basket" />
                <span className="badge badge-warning navbar-badge">15</span>
              </Link>
            </li>
          )}

          {auth.isAuthenticated && (
            <li
              className="nav-item"
              data-tooltip-id="tt-logout"
              data-tooltip-content="Salir"
              data-tooltip-float={false}
              data-tooltip-offset={-10}
              data-tooltip-class-name="custom-tooltip"
            >
              <a className="nav-link" onClick={handleSignOut}>
                <i className="fas fa-sign-out-alt" />
                <Tooltip id="tt-logout" />
              </a>
            </li>
          )}
        </ul>
        {auth.isAuthenticated && (
          <div
            className="button-containero"
            style={{
              display: "flex",
              overflow: "visible",
              zIndex: 99999,
            }}
          >
            <Tooltip id="tt-chat" style={{ position: "relative", zIndex: 2 }} />
            <button
              className="flyerin"
              data-tooltip-id="tt-chat"
              data-tooltip-content="PQR"
              onClick={handleButtonClick}
              data-tooltip-float={false}
              data-tooltip-place="left"
              data-tooltip-offset={10}
              data-tooltip-class-name="custom-tooltip"
            >
              <i className="fas fa-headset nav-icon" />
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};
