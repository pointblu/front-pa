import React, { useEffect, useState } from "react";
import { useFilters } from "../../hooks/useFilters.jsx";
import api from "../../services/api";

export function Filters() {
  const { setFilters } = useFilters();
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories")
      .then(({ data }) => setCategories(data?.data ?? []))
      .catch(() => {});
  }, []);

  const handleCategoryClick = (categId, categName) => {
    setActiveCategory(categId);
    setFilters((prevState) => ({
      ...prevState,
      category: categId !== "all" ? categName : "all",
    }));
  };

  useEffect(() => {
    const rightArrow = document.querySelector(".scrollable .right-arrow i");
    const leftArrow = document.querySelector(".scrollable .left-arrow i");
    const tabList = document.querySelector(".scrollable ul");

    const handleRightArrowClick = () => {
      tabList.scrollLeft += 200;
    };

    const handleLeftArrowClick = () => {
      tabList.scrollLeft -= 200;
    };

    if (rightArrow) {
      rightArrow.addEventListener("click", handleRightArrowClick);
    }

    if (leftArrow) {
      leftArrow.addEventListener("click", handleLeftArrowClick);
    }

    return () => {
      // Cleanup: remove event listeners when the component unmounts
      if (rightArrow) {
        rightArrow.removeEventListener("click", handleRightArrowClick);
      }

      if (leftArrow) {
        leftArrow.removeEventListener("click", handleLeftArrowClick);
      }
    };
  }, []);

  return (
    <div>
      <div
        style={{
          position: "fixed",
          width: "100%",
          zIndex: 9900,
          top: "3.5rem",
        }}
      >
        {/* Fila 1: buscador */}
        <div className="navbar navbar-dark navbar-light justify-content-center" style={{ padding: "0.2rem 1rem", minHeight: "unset" }}>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.15)", borderRadius: "20px", padding: "0.15rem 0.8rem", width: "100%", maxWidth: "340px" }}>
            <i className="fas fa-search text-white" style={{ fontSize: "0.75rem", marginRight: "0.5rem", opacity: 0.8 }} />
            <input
              type="text"
              placeholder="Buscar producto..."
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: "0.78rem",
                width: "100%",
              }}
            />
          </div>
        </div>
        {/* Fila 2: categorías con chevrons */}
        <div className="navbar navbar-expand navbar-dark navbar-light justify-content-center" style={{ padding: "0 0.5rem" }}>
          <div className="sidebar scrollable" style={{ width: "100%" }}>
            <div className="left-arrow active">
              <i className="fas fa-chevron-left text-white" />
            </div>
            <nav className="mt-2">
              <ul
                className="nav nav-pills navbar-nav d-flex flex-row flex-nowrap"
                style={{ whiteSpace: "nowrap", overflowX: "auto", flexWrap: "nowrap" }}
              >
                <li
                  className={`mx-2 text-white ${activeCategory === "all" ? "active" : ""}`}
                  style={{ fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap", display: "inline-block" }}
                  onClick={() => handleCategoryClick("all")}
                >
                  TODAS
                </li>
                {categories.map((categ) => (
                  <li
                    className={`mx-2 text-white ${categ.id === activeCategory ? "active" : ""}`}
                    key={categ.id}
                    style={{ fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap", display: "inline-block" }}
                    onClick={() => handleCategoryClick(categ.id, categ.name)}
                  >
                    {categ.name.toUpperCase()}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="right-arrow active">
              <i className="fas fa-chevron-right text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
