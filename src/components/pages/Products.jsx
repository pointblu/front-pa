import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useCart } from "../../hooks/useCarts";
import { useAuth } from "../../auth/AuthProvider";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";

export function Products({ products }) {
  useEffect(() => {
    AOS.init({
      once: false, // La animación solo ocurrirá una vez
      duration: 800, // Duración de la animación en milisegundos
      easing: "ease-out",
    });
  }, []);

  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isClient =
    auth.isAuthenticated && userObject && userObject.role === "CLIENT";

  const { addToCart, removeFromCart, cart } = useCart();

  const checkProductInCart = (product) => {
    return cart.some((item) => item.id === product.id);
  };

  function handleEditProduct(prod) {
    localStorage.setItem("editProduct", JSON.stringify(prod));
  }

  return (
    <ul style={{ marginTop: "5rem" }}>
      {products.map((product) => {
        const isProductInCart = checkProductInCart(product);
        return (
          <li key={product.id} className="card" data-aos="fade-up">
            {product.stock <= 0 && <div className="agotado">AGOTADO</div>}
            <div className="price">${product.price}</div>
            <img src={product.image} alt={product.name} />
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
              <button
                className="icon-button"
                style={{
                  backgroundColor: isProductInCart ? "goldenrod" : "burlywood",
                  display: !isClient && auth.isAuthenticated ? "none" : "block",
                }}
                onClick={() => {
                  isProductInCart
                    ? removeFromCart(product)
                    : addToCart(product);
                }}
                disabled={!isClient || product.stock < 0}
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

              <Link to={`/editar-producto`}>
                <button
                  className="icon-button"
                  onClick={() => handleEditProduct(product)}
                  style={{
                    display:
                      isClient || !auth.isAuthenticated ? "none" : "block",
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
  );
}
