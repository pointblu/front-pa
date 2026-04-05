import React, { useEffect, useState } from "react";
import "./Products.css";
import { Products } from "./Products.jsx";
import { Filters } from "./Filters.jsx";
import { useFilters } from "../../hooks/useFilters.jsx";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider.jsx";
import { Cart } from "./Cart.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { Tooltip } from "react-tooltip";

export const Redimir = () => {
  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isAdmin =
    auth.isAuthenticated && userObject && userObject.role === "ADMIN";
  const userData = JSON.parse(localStorage.getItem("userInfo"));
  const [datum, setDatum] = useState([]);
  const products = datum;
  const { filterProducts } = useFilters();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataAsync();
  }, [page]);

  const filteredProducts = filterProducts(products);

  const fetchDataAsync = async () => {
    try {
      const { data: apiData } = await api.get(`/products?page=${page}&take=50`);
      const userPoints = userData?.points ?? 0;
      const apiDatum = apiData.data.filter(
        (datu) => datu.active !== false && datu.points <= userPoints
      );
      setDatum((prev) => prev.concat(!isAdmin || !auth.isAuthenticated ? apiDatum : apiData.data));
      setHasMore(apiData.meta.hasNextPage);
    } catch (_) {
      setHasMore(false);
    } finally {
      setLoading(false);
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
              {loading ? (
                <h4>Cargando...</h4>
              ) : filteredProducts.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: "2rem", color: "#888" }}>
                  No hay productos disponibles para canjear con tus puntos actuales.
                </p>
              ) : (
                <InfiniteScroll
                  dataLength={datum.length}
                  next={() => {
                    setPage(page + 1);
                  }}
                  hasMore={hasMore}
                  loader={<h4>Cargando...</h4>}
                >
                  <Products products={filteredProducts} from="redimir" />
                </InfiniteScroll>
              )}
            </div>
            {/* /.row (main row) */}
          </div>
          {/* /.container-fluid */}
        </section>
      </div>
    </div>
  );
};
