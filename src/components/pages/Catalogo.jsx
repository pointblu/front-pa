import React, { Suspense } from "react";
import "./Products.css";
import { Products } from "./Products.jsx";
import { Filters } from "./Filters.jsx";
import { useFilters } from "../../hooks/useFilters";
import { API_URL } from "../../auth/constants";
import { fetchData } from "../../fetchData/fetchData";
import { useNavigate } from "react-router-dom";

const apiData = fetchData(`${API_URL}/products`);

export const Catalogo = () => {
  const products = apiData.read();
  const { filterProducts } = useFilters();
  const filteredProducts = filterProducts(products.data);
  const goTo = useNavigate();
  const handleButtonClick = () => {
    // Dirige a la ruta que desees al hacer clic en el botón
    goTo("/producto");
  };
  return (
    <div>
      {/* Content Wrapper. Contains page content */}
      <Suspense>
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          {/* <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1
                  className="m-0 App-header focus-in-contract alphi-1"
                  style={{ backgroundColor: "cadetblue" }}
                >
                  Catálogo
                </h1>
              </div>
            </div>
            
          </div>
        
        </div>*/}

          {<Filters />}
          <div className="button-containero">
            <button
              className="flyer"
              data-aos="fade-left"
              onClick={handleButtonClick}
            >
              <i className="fas fa-plus nav-icon" />
            </button>
          </div>

          <section className="content products">
            <div className="container-fluid">
              <div className=" col-sm-12">
                <Products products={filteredProducts} />
              </div>
              {/* /.row (main row) */}
            </div>
            {/* /.container-fluid */}
          </section>
        </div>
      </Suspense>
    </div>
  );
};
