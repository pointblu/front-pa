import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useCart } from "../../hooks/useCarts";
import { useAuth } from "../../auth/AuthProvider";
import { Link } from "react-router-dom";

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
              >
                <i className="fas fa-shopping-basket" />
                <sup>
                  <i className="fas fa-plus nav-icon" />
                </sup>
              </button>
              <button
                className="icon-button"
                style={{
                  display: isClient || !auth.isAuthenticated ? "none" : "block",
                }}
              >
                <i className="fas fa-edit" />
              </button>

              <Link
                to={`/reposicion/${product.id}/${product.cost}/${product.stock}/${product.name}`}
              >
                <button
                  className="icon-button"
                  style={{
                    display:
                      isClient || !auth.isAuthenticated ? "none" : "block",
                  }}
                >
                  <i className="fas fa-calendar-plus" />
                </button>
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
