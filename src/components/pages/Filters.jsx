import React, { useEffect, useRef, useState } from "react";
import { useFilters } from "../../hooks/useFilters.jsx";
import api from "../../services/api";

export function Filters() {
  const { setFilters } = useFilters();
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    // Intento 1: localStorage (inmediato, sin espera)
    try {
      const cached = JSON.parse(localStorage.getItem("categorias"));
      const list = cached?.data ?? cached;
      if (Array.isArray(list) && list.length > 0) setCategories(list);
    } catch (_) {}

    // Intento 2: API (actualiza aunque ya haya datos en cache)
    api
      .get("/categories")
      .then(({ data }) => {
        const list = data?.data ?? data;
        if (Array.isArray(list) && list.length > 0) setCategories(list);
      })
      .catch(() => {});
  }, []);

  const handleCategoryClick = (categId, categName) => {
    setActiveCategory(categId);
    setFilters((prev) => ({
      ...prev,
      category: categId !== "all" ? categName : "all",
    }));
  };

  const scroll = (dir) => {
    if (listRef.current) listRef.current.scrollLeft += dir * 200;
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "3.5rem",
        left: 0,
        width: "100%",
        zIndex: 9900,
        background: "#343a40",
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: "0.3rem 0.5rem",
        boxSizing: "border-box",
      }}
    >
      {/* Buscador */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.15)",
          borderRadius: "16px",
          padding: "0.15rem 0.65rem",
          flexShrink: 0,
        }}
      >
        <i
          className="fas fa-search"
          style={{ fontSize: "0.72rem", color: "#fff", marginRight: "0.4rem", opacity: 0.8 }}
        />
        <input
          type="text"
          placeholder="Buscar..."
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            fontSize: "0.76rem",
            width: "85px",
          }}
        />
      </div>

      {/* Chevron izquierdo */}
      <button
        onClick={() => scroll(-1)}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontSize: "0.85rem",
          padding: "0 0.3rem",
          flexShrink: 0,
        }}
      >
        <i className="fas fa-chevron-left" />
      </button>

      {/* Lista de categorías scrollable */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <ul
          ref={listRef}
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            overflowX: "auto",
            listStyle: "none",
            margin: 0,
            padding: "0.1rem 0",
            gap: "0.5rem",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <li
            onClick={() => handleCategoryClick("all")}
            style={{
              whiteSpace: "nowrap",
              cursor: "pointer",
              fontSize: "0.78rem",
              color: activeCategory === "all" ? "#ffc107" : "#fff",
              fontWeight: activeCategory === "all" ? 700 : 400,
              padding: "0.1rem 0.5rem",
              borderRadius: "10px",
              background: activeCategory === "all" ? "rgba(255,193,7,0.15)" : "transparent",
              flexShrink: 0,
            }}
          >
            TODAS
          </li>
          {categories.map((categ) => (
            <li
              key={categ.id}
              onClick={() => handleCategoryClick(categ.id, categ.name)}
              style={{
                whiteSpace: "nowrap",
                cursor: "pointer",
                fontSize: "0.78rem",
                color: categ.id === activeCategory ? "#ffc107" : "#fff",
                fontWeight: categ.id === activeCategory ? 700 : 400,
                padding: "0.1rem 0.5rem",
                borderRadius: "10px",
                background: categ.id === activeCategory ? "rgba(255,193,7,0.15)" : "transparent",
                flexShrink: 0,
              }}
            >
              {categ.name.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>

      {/* Chevron derecho */}
      <button
        onClick={() => scroll(1)}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontSize: "0.85rem",
          padding: "0 0.3rem",
          flexShrink: 0,
        }}
      >
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  );
}
