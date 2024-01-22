import React, { useEffect, useState } from "react";
import "./Home.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../../auth/AuthProvider";
import { API_URL } from "../../auth/constants";
import Carousel from "nuka-carousel";
import { Link, useNavigate } from "react-router-dom";

const token = JSON.parse(localStorage.getItem("token"));

export const Home = () => {
  useEffect(() => {
    AOS.init({
      once: false, // La animación solo ocurrirá una vez
      duration: 800, // Duración de la animación en milisegundos
      easing: "ease-out",
    });
  }, []);
  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isAdmin =
    auth.isAuthenticated && userObject && userObject.role === "ADMIN";

  const isClient =
    auth.isAuthenticated && userObject && userObject.role === "CLIENT";

  const [datum, setDatum] = useState([]);

  useEffect(() => {
    fetchDataAsync();
  }, []);

  const goTo = useNavigate();
  const handleButtonClick = () => {
    goTo("/crear-anuncio");
  };
  const fetchDataAsync = async () => {
    try {
      const response = await fetch(`${API_URL}/advertisements`, {
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

      const apiData = await response.json();
      const filteredData = apiData.data.filter((item) => item.active === true);
      setDatum(isClient || !auth.isAuthenticated ? filteredData : apiData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const params = {
    wrapAround: true,
    autoplay: true,
    autoplayInterval: 5000,
    animation: "zoom",
    defaultControlsConfig: {
      containerClassName: "slide-content",
      nextButtonClassName: "next-button",
      nextButtonText: ">",
      prevButtonClassName: "prev-button",
      prevButtonText: "<",
      pagingDotsStyle: {
        fill: "white",
      },
      nextButtonStyle: {
        backgroundColor: "rgba(173, 216, 230, 0.85)",
      },
      prevButtonStyle: {
        backgroundColor: "rgba(173, 216, 230, 0.85)",
      },
    },
  };

  function handleEditAdvertisement(advertisem) {
    localStorage.setItem("editAdvertisement", JSON.stringify(advertisem));
  }

  return (
    <div>
      {/* Content Wrapper. Contains page content */}
      <div className="content-wrapper home-container">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1
                  className="m-0 App-header focus-in-contract alphi-5"
                  style={{ backgroundColor: "#17a2b8" }}
                >
                  Inicio {userObject.name}
                </h1>
              </div>
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {isAdmin && (
          <div className="button-containero" style={{ zIndex: 9999 }}>
            <button
              className="flyer"
              data-aos="fade-left"
              onClick={handleButtonClick}
            >
              <i className="fas fa-plus nav-icon" />
            </button>
          </div>
        )}
        {/* Main content */}
        <div className="container-advertisement">
          <Carousel {...params}>
            {datum.map((advertisement) => (
              <div key={advertisement.id}>
                <Link to={`/editar-anuncio`}>
                  <button
                    className="icon-button"
                    onClick={() => handleEditAdvertisement(advertisement)}
                    style={{
                      display:
                        isClient || !auth.isAuthenticated ? "none" : "block",
                      marginLeft: "2rem",
                    }}
                  >
                    <i className="fas fa-edit" />
                  </button>
                </Link>
                {isAdmin && !advertisement.active && (
                  <i className="fas fa-eye-slash nav-icon no-visible" />
                )}
                <img src={advertisement.urlImage} alt="p1" />
                <div className="info">
                  <h1>{advertisement.title}</h1>
                  <p>{advertisement.description}</p>
                  <a
                    href={`https://api.whatsapp.com/send?phone=+57${advertisement.whatsapp}&text=¡Hola! Me interesa obtener más información sobre su negocio. ¿Podría proporcionarme detalles adicionales? ¡Gracias!`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="icon-buttoni">
                      <i className="fab fa-whatsapp" />
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};
