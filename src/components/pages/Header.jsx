/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
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
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { NotificationComponent } from "./Notification";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useMessage } from "../../context/MessageContext";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

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
  const [lastMessages, setLastMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { handleMessageReceived } = useMessage();

  useEffect(() => {
    if (!currentUser) {
      console.log("No user ID available");
      return;
    }

    // Asumimos que cada documento de chat tiene una estructura con un array de mensajes
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, orderBy("messages", "desc"), limit(50)); // Limitamos a los últimos 50 chats modificados

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesFromOthers = [];
      querySnapshot.forEach((doc) => {
        const messages = doc.data().messages || [];
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1]; // Último mensaje
          if (
            lastMessage.senderId !== currentUser.uid &&
            !lastMessage?.readed
          ) {
            messagesFromOthers.push({
              ...lastMessage,
              chatId: doc.id,
            });
          }
        }
      });
      setLastMessages(messagesFromOthers);
    });
    if (lastMessages.length > 0) {
      handleMessageReceived(true);
    } else {
      handleMessageReceived(false);
    }
    return () => {
      unsubscribe();
    };
  }, [currentUser, handleMessageReceived, lastMessages]);

  const [datum, setDatum] = useState([]);
  const [apiData, setApiData] = useState([]);
  const goTo = useNavigate();
  const categories = apiData;
  localStorage.setItem("categorias", JSON.stringify(categories));

  const authi = useAuth();
  const userObject = JSON.parse(authi.getUser() || "{}");

  const isClient =
    authi.isAuthenticated && userObject && userObject.role === "CLIENT";

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
    if (!fecha) return "Fecha no disponible"; // Asegúrate de que la fecha existe

    const fechaOriginal = new Date(fecha);
    if (isNaN(fechaOriginal.getTime())) {
      console.error("Fecha no válida:", fecha);
      return "Fecha no válida"; // Manejo del caso en que la fecha no sea válida
    }

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
      try {
        const data = await getUserLocation();
        fetchPostionAsync(userObject.id, data[0], data[1]);
        /* const whatsappURL = `https://wa.me/message/76HIJOVYGKBKO1`;
        window.open(whatsappURL, "_blank");*/
        goTo("/pqr");
      } catch (error) {
        toast.error(
          "Para usar el chat debes activar tu localización..." /*, {
          description: "...y tener instalado whatsapp",
        }*/
        );
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
    signOut(auth);
    authi.signout();
  }
  return (
    <div>
      <Toaster position="top-center" richColors />
      {/* Navbar */}
      <nav
        className="main-header navbar navbar-expand navbar-yellow navbar-light"
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
          {!authi.isAuthenticated && (
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

          {!authi.isAuthenticated && (
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
          {authi.isAuthenticated && (
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
                  {authi.isAuthenticated &&
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
          {authi.isAuthenticated && (
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
              </Link>
            </li>
          )}

          {authi.isAuthenticated && (
            <li
              className="nav-item"
              data-tooltip-id="tt-unsuscribe"
              data-tooltip-content="Cerrar mi cuenta"
              data-tooltip-float={false}
              data-tooltip-offset={-10}
              data-tooltip-class-name="custom-tooltip"
            >
              <a
                className="nav-link"
                href="https://unsuscribe.monsalvepanaderia.online/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Tooltip id="tt-unsuscribe" />
                <i className="fas fa-user-slash" />
              </a>
            </li>
          )}

          {authi.isAuthenticated && (
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
        {authi.isAuthenticated && (
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
              data-tooltip-content="Chat"
              onClick={handleButtonClick}
              data-tooltip-float={false}
              data-tooltip-place="left"
              data-tooltip-offset={10}
              data-tooltip-class-name="custom-tooltip"
            >
              <i
                className="fab fa-rocketchat nav-icon"
                style={{ fontSize: "1.5rem" }}
              />
              <NotificationComponent />
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};
