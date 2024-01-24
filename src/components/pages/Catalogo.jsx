import React, { useEffect, useState } from "react";
import "./Products.css";
import { Products } from "./Products.jsx";
import { Filters } from "./Filters.jsx";
import { useFilters } from "../../hooks/useFilters";
import { API_URL } from "../../auth/constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider.jsx";
import { Cart } from "./Cart.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { Tooltip } from "react-tooltip";

const token = JSON.parse(localStorage.getItem("token"));

export const Catalogo = () => {
  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isAdmin =
    auth.isAuthenticated && userObject && userObject.role === "ADMIN";
  const [datum, setDatum] = useState([]);
  const products = datum;
  const { filterProducts } = useFilters();
  const [page, setPage] = useState(1);
  const [infoPage, setInfoPage] = useState(null);

  useEffect(() => {
    fetchDataAsync();
  }, [page]);

  const filteredProducts = filterProducts(products);

  const fetchDataAsync = async () => {
    try {
      const response = await fetch(`${API_URL}/products?pag=${page}&take=50`, {
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
      const apiDatum = apiData.data.filter((datu) => {
        return datu.active !== false;
      });

      let newDatum = datum.concat(
        !isAdmin || !auth.isAuthenticated ? apiDatum : apiData.data
      );
      setDatum(newDatum);
      setInfoPage(apiData.meta.hasNextPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const goTo = useNavigate();
  const handleButtonClick = () => {
    goTo("/producto");
  };
  return (
    <div>
      {/* Content Wrapper. Contains page content */}

      <Cart />
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
        {isAdmin && (
          <div
            className="button-containero"
            style={{ display: "flex", overflow: "visible" }}
          >
            <Tooltip
              id="tt-add-product"
              style={{ position: "relative", zIndex: 2 }}
            />
            <button
              className="flyer"
              data-aos="fade-left"
              onClick={handleButtonClick}
              data-tooltip-id="tt-add-product"
              data-tooltip-content="- Agregar producto"
              data-tooltip-float={false}
              data-tooltip-place="bootom"
              data-tooltip-offset={-165}
              data-tooltip-class-name="custom-tooltip"
            >
              <i className="fas fa-plus nav-icon" />
            </button>
          </div>
        )}
        <section className="content products">
          <div className="container-fluid">
            <div
              className="col-sm-12 infinite-scroll-container"
              id="infiniteScroll"
            >
              <InfiniteScroll
                dataLength={datum.length}
                next={() => {
                  setPage(page + 1);
                }}
                hasMore={infoPage}
                loader={infoPage ? <h4>Cargando... {infoPage}</h4> : null}
              >
                <Products products={filteredProducts} />
              </InfiniteScroll>
            </div>
            {/* /.row (main row) */}
          </div>
          {/* /.container-fluid */}
        </section>
      </div>
    </div>
  );
};
