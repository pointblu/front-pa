import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useCart } from "../../hooks/useCarts";
import { useAuth } from "../../auth/AuthProvider";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useCanje } from "../../hooks/useCanje";
import { usePoints } from "../../context/point";
import { useSpring, animated } from "react-spring";
import api from "../../services/api";
import { Toaster, toast } from "sonner";
import { useFilters } from "../../hooks/useFilters";

export function Products({ products, from }) {
  useEffect(() => {
    AOS.init({
      once: false,
      duration: 800,
      easing: "ease-out",
    });
  }, []);

  const [showNumber, setShowNumber] = useState(false);
  const [animatedProduct, setAnimatedProduct] = useState(null);
  const [quickView, setQuickView] = useState(null);
  const fadeInOutProps = useSpring({
    opacity: showNumber ? 1 : 0,
    transform: showNumber ? "translateY(-30)" : "translateY(10px)",
    config: { duration: 300 },
    onRest: () => setShowNumber(false),
  });

  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isClient =
    auth.isAuthenticated && userObject && userObject.role === "CLIENT";

  const isSeller =
    auth.isAuthenticated && userObject && userObject.role === "SELLER";

  const isAdmin =
    auth.isAuthenticated && userObject && userObject.role === "ADMIN";
  const { addToCart, removeFromCart, cart } = useCart();
  const { addToCanje, removeFromCanje, canje } = useCanje();
  const { favorites, setFavorites } = useFilters();
  const { handleAddPoints, handleRemovePoints } = usePoints();

  const checkProductInCart = (product) => {
    return cart.some((item) => item.id === product.id);
  };

  const checkProductInCanje = (product) => {
    return canje.some((item) => item.id === product.id);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      toast.success("Eliminaste este producto!");
    } catch (_) {}
  };

  const handleToggleFavorite = async (product) => {
    try {
      const userId = userObject.id;
      const { data } = await api.post(`/users/${userId}/favorites/${product.id}`);
      const newFavs = data.data || [];
      setFavorites(newFavs);
      // Update localStorage so favorites survive page refresh
      const info = JSON.parse(localStorage.getItem("userInfo") || "{}");
      info.favorites = newFavs;
      localStorage.setItem("userInfo", JSON.stringify(info));
    } catch (_) {}
  };

  function handleEditProduct(prod) {
    localStorage.setItem("editProduct", JSON.stringify(prod));
  }

  function handleAddCanje(prod) {
    addToCanje(prod);
    handleRemovePoints(prod.points);
    window.location.reload();
  }

  function handleRemoveCanje(prod) {
    removeFromCanje(prod);
    handleAddPoints(prod.points);
    window.location.reload();
  }

  const handleButtonClick = (product, action) => {
    setAnimatedProduct(product);

    // Ejecutar la acción correspondiente (addToCart o handleRemoveCanje)
    action(product);

    // Después de un breve intervalo, resetear el producto animado
    setTimeout(() => {
      setAnimatedProduct(null);
    }, 500); // Ajusta según la duración de tu animación
  };

  return (
    <>
    {/* Modal vista rápida */}
    {quickView && (
      <div
        onClick={() => setQuickView(null)}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "linear-gradient(135deg,#fff 60%,#fff9e6)",
            borderRadius: "16px", maxWidth: "420px", width: "90%",
            padding: "1.5rem", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          <button
            onClick={() => setQuickView(null)}
            style={{
              position: "absolute", top: "0.75rem", right: "0.75rem",
              background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#555",
            }}
          >
            <i className="fas fa-times" />
          </button>
          <img
            src={quickView.image} alt={quickView.name}
            style={{ width: "100%", borderRadius: "10px", maxHeight: "200px", objectFit: "contain", background: "#f5f5f5" }}
          />
          <h5 style={{ margin: "1rem 0 0.25rem", fontWeight: 700, color: "#222" }}>{quickView.name}</h5>
          <p style={{ fontSize: "0.82rem", color: "#555", margin: "0 0 0.75rem" }}>{quickView.description}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#00008b" }}>${quickView.price}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "1rem", color: "#8b0000" }}>
              {quickView.points}
              <img src={process.env.PUBLIC_URL + "/dist/img/logo_punto_azul_pq.png"} alt="puntos" style={{ width: "20px", height: "20px" }} />
            </span>
            <span style={{ fontSize: "0.8rem", color: quickView.stock > 0 ? "#2d7a2d" : "#c00", fontWeight: 600 }}>
              {quickView.stock > 0 ? `Stock: ${quickView.stock}` : "AGOTADO"}
            </span>
          </div>
        </div>
      </div>
    )}
    <ul style={{ marginTop: "5rem" }}>
      {products.map((product) => {
        const isProductInCart = checkProductInCart(product);
        const isProductInCanje = checkProductInCanje(product);
        const isProductAnimated =
          animatedProduct && animatedProduct.id === product.id;
        return (
          <li key={product.id} className="card" data-aos="fade-up">
            {product.stock <= 0 && <div className="agotado">AGOTADO</div>}
            <div className="price">${product.price}</div>
            <img
              src={product.image} alt={product.name}
              onClick={() => setQuickView(product)}
              style={{ cursor: "zoom-in" }}
              title="Vista rápida"
            />
            <div className="pricePoint">
              <div style={{ position: "relative" }}>
                {product.points}
                <img
                  src={
                    process.env.PUBLIC_URL + "/dist/img/logo_punto_azul_pq.png"
                  }
                  alt="Número resaltado"
                  style={{
                    width: "25px",
                    height: "25px",
                    position: "absolute",
                    top: ".2rem",
                    right: "-2rem",
                    zIndex: 1,
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>{" "}
            <div className="product-info">
              <strong>{product.name}</strong>
              <div className="description">{product.description} </div>
            </div>
            <div
              className="button-container"
              style={{
                display: "flex",
                gap: "0.5rem",
                flexDirection: "row",
                justifyContent: "space-between",
                overflow: "visible",
              }}
            >
              {from !== "redimir" ? (
                <button
                  className="icon-button"
                  style={{
                    backgroundColor: isProductInCart
                      ? "goldenrod"
                      : "burlywood",
                    display:
                      (isAdmin && auth.isAuthenticated) || !auth.isAuthenticated
                        ? "none"
                        : "block",
                  }}
                  onClick={() => {
                    handleButtonClick(product, addToCart);
                    setShowNumber(true);
                  }}
                  disabled={isAdmin || product.stock <= 0}
                  data-tooltip-id={"tt-add-basket" + product.id}
                  data-tooltip-content="Agregar a la cesta"
                  data-tooltip-float={false}
                  data-tooltip-place="top"
                >
                  <i className="fas fa-shopping-basket" />
                  <Tooltip id={"tt-add-basket" + product.id} />
                  <sup>
                    <i className="fas fa-plus nav-icon" />
                    {isProductAnimated && (
                      <animated.div style={fadeInOutProps}>
                        <p
                          style={{
                            color: "white",
                            zIndex: 2,
                            fontSize: "1rem",
                          }}
                        >
                          +1
                        </p>
                      </animated.div>
                    )}
                  </sup>
                </button>
              ) : (
                <button
                  className="icon-button"
                  style={{
                    backgroundColor: isProductInCanje
                      ? "goldenrod"
                      : "burlywood",
                    display:
                      (isAdmin && auth.isAuthenticated) || !auth.isAuthenticated
                        ? "none"
                        : "block",
                  }}
                  onClick={() => {
                    isProductInCanje
                      ? handleRemoveCanje(product)
                      : handleAddCanje(product);
                  }}
                  disabled={isAdmin || product.stock <= 0}
                  data-tooltip-id={"tt-add-basket" + product.id}
                  data-tooltip-content="Agregar a la cesta"
                  data-tooltip-float={false}
                  data-tooltip-place="top"
                >
                  <i className="fas fa-shopping-basket" />
                  <Tooltip id={"tt-add-basket" + product.id} />
                  <sup>
                    <i className="fas fa-plus nav-icon" />
                  </sup>
                </button>
              )}

              <Link to={`/editar-producto`}>
                <button
                  className="icon-button"
                  onClick={() => handleEditProduct(product)}
                  style={{
                    display:
                      isClient || !auth.isAuthenticated || isSeller
                        ? "none"
                        : "block",
                  }}
                  data-tooltip-id={"tt-edit-product" + product.id}
                  data-tooltip-content="Editar producto"
                  data-tooltip-float={false}
                  data-tooltip-place="top"
                >
                  <i className="fas fa-edit" />
                </button>
                <Tooltip id={"tt-edit-product" + product.id} />
              </Link>
              <Link
                to={`/reposicion/${product.id}/${product.cost}/${product.stock}/${product.name}`}
              >
                <button
                  className="icon-button"
                  style={{
                    display:
                      isClient || !auth.isAuthenticated ? "none" : "block",
                  }}
                  data-tooltip-id={"tt-replenish" + product.id}
                  data-tooltip-content="-  Reponer existencias"
                  data-tooltip-float={false}
                  data-tooltip-place="botton"
                >
                  <i className="fas fa-calendar-plus" />
                </button>
                <Tooltip id={"tt-replenish" + product.id} />
              </Link>

              <button
                className="icon-button"
                onClick={() => handleDeleteProduct(product.id)}
                style={{
                  display:
                    isClient || !auth.isAuthenticated || isSeller
                      ? "none"
                      : "block",
                }}
                data-tooltip-id={"tt-delete-product" + product.id}
                data-tooltip-content="Quitar producto"
                data-tooltip-float={false}
                data-tooltip-place="top"
              >
                <i className="fas fa-times" />
              </button>
              <Tooltip id={"tt-delete-product" + product.id} />

              {isClient && (
                <button
                  className="icon-button"
                  onClick={() => handleToggleFavorite(product)}
                  style={{ background: "none", border: "none", padding: "0.2rem", cursor: "pointer" }}
                  data-tooltip-id={"tt-fav-" + product.id}
                  data-tooltip-content={favorites.includes(product.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                  data-tooltip-float={false}
                  data-tooltip-place="top"
                >
                  <i
                    className={favorites.includes(product.id) ? "fas fa-heart" : "far fa-heart"}
                    style={{ color: favorites.includes(product.id) ? "#e74c3c" : "#999", fontSize: "1rem" }}
                  />
                  <Tooltip id={"tt-fav-" + product.id} />
                </button>
              )}

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  textAlign: "end",
                }}
              >
                Stock: {product.stock}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
    </>
  );
}
