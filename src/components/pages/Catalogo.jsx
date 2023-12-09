import React, { useState } from "react";
import "./Products.css";
import { Products } from "./Products.jsx";
import { Filters } from "./Filters.jsx";
import { products as initialProducts } from "./../../mocks/products";
import { useFilters } from "../../hooks/useFilters";

export const Catalogo = () => {
  const [products] = useState(initialProducts);
  const { filterProducts } = useFilters();
  const filteredProducts = filterProducts(products);

  return (
    <div>
      {/* Content Wrapper. Contains page content */}
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
        <div style={{ margin: "6.5rem 0" }}></div>
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
    </div>
  );
};
