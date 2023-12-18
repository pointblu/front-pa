import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useCart } from "../../hooks/useCarts";

export function Products({ products }) {
  useEffect(() => {
    AOS.init({
      once: false, // La animación solo ocurrirá una vez
      duration: 800, // Duración de la animación en milisegundos
      easing: "ease-out",
    });
  }, []);

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
            <div className="price">${product.price}</div>
            <img src={product.image} alt={product.name} />
            <div className="product-info">
              <strong>{product.name}</strong>
              <div className="description">{product.description}</div>
            </div>
            <div className="button-container">
              <button
                className="icon-button"
                style={{ backgroundColor: isProductInCart ? "red" : "#09f" }}
                onClick={() => {
                  isProductInCart
                    ? removeFromCart(product)
                    : addToCart(product);
                }}
              >
                <i className="fas fa-shopping-basket" />
                <sup>
                  <i className="fas fa-plus nav-icon" />
                </sup>
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
