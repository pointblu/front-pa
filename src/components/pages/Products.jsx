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
import { API_URL } from "../../auth/constants";
import { Toaster, toast } from "sonner";

const token = JSON.parse(localStorage.getItem("token"));

export function Products({ products, from }) {
  useEffect(() => {
    AOS.init({
      once: false, // La animación solo ocurrirá una vez
      duration: 800, // Duración de la animación en milisegundos
      easing: "ease-out",
    });
  }, []);

  const [showNumber, setShowNumber] = useState(false);
  const [animatedProduct, setAnimatedProduct] = useState(null);
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
  const { addToCart, removeFromCart, cart } = useCart();

  const { addToCanje, removeFromCanje, canje } = useCanje();

  const { handleAddPoints, handleRemovePoints } = usePoints();

  const checkProductInCart = (product) => {
    return cart.some((item) => item.id === product.id);
  };

  const checkProductInCanje = (product) => {
    return canje.some((item) => item.id === product.id);
  };

  const handleDeleteProduct = async (productId) => {
    console.log(productId);
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
          mode: "no-cors",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      toast.success("Eliminaste este producto!");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
            <img src={product.image} alt={product.name} />
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
                      !isClient && auth.isAuthenticated ? "none" : "block",
                  }}
                  onClick={() => {
                    handleButtonClick(product, addToCart);
                    setShowNumber(true);
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
                      !isClient && auth.isAuthenticated ? "none" : "block",
                  }}
                  onClick={() => {
                    isProductInCanje
                      ? handleRemoveCanje(product)
                      : handleAddCanje(product);
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
