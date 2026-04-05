import React, { useEffect, useState } from "react";
import "./Products.css";
import { Products } from "./Products.jsx";
import { Filters } from "./Filters.jsx";
import { useFilters } from "../../hooks/useFilters";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../auth/AuthProvider.jsx";
import { Cart } from "./Cart.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { Tooltip } from "react-tooltip";

export const Catalogo = () => {
  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isAdmin =
    auth.isAuthenticated && userObject && userObject.role === "ADMIN";
  const [datum, setDatum] = useState([]);
  const products = datum;
  const { filterProducts, filters } = useFilters();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchDataAsync();
  }, [page]);

  const filteredProducts = filterProducts(products);
  const isFiltered =
    filters.category !== "all" || (filters.search || "").trim() !== "";

  const fetchDataAsync = async () => {
    try {
      const { data: apiData } = await api.get(`/products?page=${page}&take=50`);
      const apiDatum = apiData.data.filter((datu) => datu.active !== false);
      setDatum((prev) => prev.concat(!isAdmin || !auth.isAuthenticated ? apiDatum : apiData.data));
      setHasMore(apiData.meta.hasNextPage);
    } catch (_) {}
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
                hasMore={!isFiltered && hasMore}
                loader={<h4>Cargando...</h4>}
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
