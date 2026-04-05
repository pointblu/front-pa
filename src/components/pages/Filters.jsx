import React, { useEffect, useRef, useState } from "react";
import { useFilters } from "../../hooks/useFilters.jsx";
import api from "../../services/api";

export function Filters() {
  const { setFilters } = useFilters();
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const listRef = useRef(null);

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

  const scroll = (dir) => {
    if (listRef.current) listRef.current.scrollLeft += dir * 200;
  };

  const btnStyle = {
    background: "none", border: "none", cursor: "pointer",
    padding: "0 0.4rem", color: "#fff", fontSize: "0.9rem", flexShrink: 0,
  };

  return (
    <div>
      <div
        style={{ position: "fixed", width: "100%", zIndex: 9900, top: "3.5rem" }}
      >
        <div
          className="navbar navbar-dark navbar-light"
          style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", gap: "0.4rem", padding: "0.2rem 0.5rem" }}
        >
          {/* Buscador */}
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.15)", borderRadius: "20px", padding: "0.15rem 0.7rem", flexShrink: 0 }}>
            <i className="fas fa-search text-white" style={{ fontSize: "0.72rem", marginRight: "0.4rem", opacity: 0.8 }} />
            <input
              type="text"
              placeholder="Buscar..."
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "0.76rem", width: "90px" }}
            />
          </div>
          {/* Chevron izquierdo */}
          <button style={btnStyle} onClick={() => scroll(-1)}>
            <i className="fas fa-chevron-left" />
          </button>
          {/* Lista de categorías */}
          <ul
            ref={listRef}
            className="nav nav-pills navbar-nav d-flex flex-row flex-nowrap"
            style={{ overflowX: "auto", flexWrap: "nowrap", scrollBehavior: "smooth", flex: 1, margin: 0, padding: 0, msOverflowStyle: "none", scrollbarWidth: "none" }}
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
          {/* Chevron derecho */}
          <button style={btnStyle} onClick={() => scroll(1)}>
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      </div>
    </div>
  );
}
