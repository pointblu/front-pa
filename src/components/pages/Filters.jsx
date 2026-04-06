import React, { useEffect, useRef, useState } from "react";
import { useFilters } from "../../hooks/useFilters.jsx";
import { useAuth } from "../../auth/AuthProvider";
import { useDebounce } from "../../hooks/useDebounce";

function useSidebarWidth() {
  const [left, setLeft] = useState("4.6rem");
  const pollRef = useRef(null);

  useEffect(() => {
    const measure = () => {
      const sidebar = document.querySelector(".main-sidebar");
      if (sidebar) setLeft(sidebar.offsetWidth + "px");
    };

    // Al detectar cambio de clase en body, hace polling durante la transición CSS (~300ms)
    const startPolling = () => {
      if (pollRef.current) clearInterval(pollRef.current);
      let ticks = 0;
      pollRef.current = setInterval(() => {
        measure();
        ticks++;
        if (ticks >= 8) {          // 8 × 50ms = 400ms (cubre la transición de AdminLTE)
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      }, 50);
    };

    measure(); // medición inicial

    const observer = new MutationObserver(startPolling);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return left;
}

export function Filters() {
  const { setFilters, categories } = useFilters();
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 350);
  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isClient = auth.isAuthenticated && userObject?.role === "CLIENT";
  const listRef = useRef(null);
  const sidebarLeft = useSidebarWidth();

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCategoryClick = (categId, categName) => {
    setActiveCategory(categId);
    setFilters((prev) => ({
      ...prev,
      category: categId === "all" ? "all" : (categId === "__favorites__" ? "__favorites__" : categName),
    }));
  };

  const scroll = (dir) => {
    if (listRef.current) listRef.current.scrollLeft += dir * 200;
  };

  const chevron = {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.85rem",
    padding: "0 0.35rem",
    flexShrink: 0,
    lineHeight: 1,
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "3.5rem",
        left: sidebarLeft,
        transition: "left 0.3s ease",
        right: 0,
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
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Buscar productos"
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
      <button style={chevron} onClick={() => scroll(-1)} aria-label="Desplazar categorías a la izquierda">
        <i className="fas fa-chevron-left" aria-hidden="true" />
      </button>

      {/* Lista scrollable — contenedor con overflow hidden para no desbordarse */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <ul
          ref={listRef}
          className="cat-list"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            overflowX: "scroll",
            listStyle: "none",
            margin: 0,
            padding: "0.1rem 0",
            gap: "0.4rem",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",      /* Firefox */
            msOverflowStyle: "none",     /* IE/Edge */
          }}
        >
          <li
            onClick={() => handleCategoryClick("all")}
            style={itemStyle(activeCategory === "all")}
          >
            TODAS
          </li>
          {isClient && (
            <li
              onClick={() => handleCategoryClick("__favorites__")}
              style={{
                ...itemStyle(activeCategory === "__favorites__"),
                color: activeCategory === "__favorites__" ? "#ff6b6b" : "#ffb3b3",
              }}
            >
              <i className="fas fa-heart" style={{ marginRight: "0.3rem" }} />
              FAVORITOS
            </li>
          )}
          {categories.map((categ) => (
            <li
              key={categ.id}
              onClick={() => handleCategoryClick(categ.id, categ.name)}
              style={itemStyle(categ.id === activeCategory)}
            >
              {categ.name.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>

      {/* Chevron derecho */}
      <button style={chevron} onClick={() => scroll(1)} aria-label="Desplazar categorías a la derecha">
        <i className="fas fa-chevron-right" aria-hidden="true" />
      </button>
    </div>
  );
}

function itemStyle(active) {
  return {
    whiteSpace: "nowrap",
    cursor: "pointer",
    fontSize: "0.78rem",
    color: active ? "#ffc107" : "#fff",
    fontWeight: active ? 700 : 400,
    padding: "0.1rem 0.6rem",
    borderRadius: "10px",
    background: active ? "rgba(255,193,7,0.18)" : "transparent",
    flexShrink: 0,
    userSelect: "none",
  };
}
