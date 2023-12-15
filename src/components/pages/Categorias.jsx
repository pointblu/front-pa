import React, { useEffect } from "react";
import { Categories } from "./Categories";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider.jsx";
import AOS from "aos";
import "aos/dist/aos.css";

export const Categorias = () => {
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
  const goTo = useNavigate();
  const handleButtonClick = () => {
    goTo("/categoria");
  };
  return (
    <div>
      {/* Content Wrapper. Contains page content */}
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1
                  className="m-0 App-header focus-in-contract alphi-6"
                  style={{ backgroundColor: "grey" }}
                >
                  Categorías
                </h1>
              </div>
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}
        <section className="content">
          {isAdmin && (
            <div className="button-containero" style={{ position: "relative" }}>
              <button
                className="flyer"
                data-aos="fade-left"
                onClick={handleButtonClick}
              >
                <i className="fas fa-plus nav-icon" />
              </button>
            </div>
          )}
          <div className="container-fluid">
            <div className="row">
              <div className=" col-sm-12">
                <Categories />
              </div>
            </div>

            {/* /.row (main row) */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
    </div>
  );
};
