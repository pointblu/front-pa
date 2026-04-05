import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import "./Cart.css";
import { useCart } from "../../hooks/useCarts";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCanje } from "./../../hooks/useCanje";
import { Tooltip } from "react-tooltip";

function CartItem({
  image,
  price,
  name,
  quantity,
  addToCart,
  decrementQuantity,
  removeFromCart,
}) {
  return (
    <li>
      <img src={image} alt={name} />

      <div>{name}</div>

      <div>
        <small>Cantidad: </small>
        <button
          className="iconio-button"
          onClick={quantity <= 1 ? removeFromCart : decrementQuantity}
        >
          <i className="fas fa-minus" style={{ fontSize: "0.6rem" }} />
        </button>

        <strong>
          <small> {quantity} </small>
        </strong>

        <button className="iconio-button" onClick={addToCart}>
          <i className="fas fa-plus" style={{ fontSize: "0.6rem" }} />
        </button>
        <div>
          <strong> $ {(price * quantity).toFixed(2)} </strong>
        </div>
      </div>
    </li>
  );
}

function CanjeItem({ image, name, quantity, points }) {
  return (
    <li>
      <img src={image} alt={name} />

      <div>{name}</div>

      <div>
        <small>Cantidad: </small>
        <strong>
          <small> {quantity} </small>
        </strong>
        <div>
          <strong> {points} Puntos azules</strong>
        </div>
      </div>
    </li>
  );
}

export function Cart() {
  const emptyCart = JSON.parse(localStorage.getItem("cart"));
  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isClient =
    auth.isAuthenticated && userObject && userObject.role === "CLIENT";
  const isSeller =
    auth.isAuthenticated && userObject && userObject.role === "SELLER";
  const goTo = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const [cartCounter, setCartCounter] = useState(0);

  const { cart, clearCart, addToCart, decrementQuantity, removeFromCart } =
    useCart();
  useEffect(() => {
    setCartCounter(cart.length);
  }, [cart]);

  const { canje, clearCanje, addToCanje, decrementQuantityCanje } = useCanje();

  return (
    <div>
      <Toaster position="top-center" richColors />
      {(isClient || isSeller) && (
        <div className="button-containeru">
          <button
            data-widget="control-sidebar"
            data-slide="true"
            className="nav-link flyer"
            data-aos="fade-left"
            onClick={scrollToTop}
          >
            <i className="fas fa-shopping-basket nav-icon" />
            <span className="badge badge-light navbar-badge">
              {cartCounter}
            </span>
          </button>
        </div>
      )}

      {/* Control Sidebar */}
      <aside className="control-sidebar control-sidebar-dark basket">
        <div className="button-containeri">
          <Tooltip id="tt-cart" />
          <button
            className="iconio-button"
            onClick={() => goTo("/checkout")}
            disabled={!emptyCart?.length}
            data-tooltip-id="tt-cart"
            data-tooltip-content="Confirmar pedido"
            data-tooltip-place="left"
            data-tooltip-float={false}
            data-tooltip-class-name="custom-tooltip"
          >
            <i className="fas fa-check nav-icon" />
          </button>
          <div>
            <button
              className="iconio-button"
              onClick={() => {
                clearCart();
                clearCanje();
              }}
              style={{ maxWidth: "37px" }}
              data-tooltip-id="tt-cart"
              data-tooltip-content="Vaciar cesta"
              data-tooltip-place="left"
              data-tooltip-float={false}
              data-tooltip-class-name="custom-tooltip"
            >
              <i className="fas fa-eraser nav-icon" />
            </button>
          </div>
        </div>
        <ul className="sub-basket">
          {cart.map((product) => (
            <CartItem
              key={product.id}
              addToCart={() => addToCart(product)}
              decrementQuantity={() => decrementQuantity(product)}
              removeFromCart={() => removeFromCart(product)}
              {...product}
            />
          ))}
          {canje.map((product) => (
            <CanjeItem
              key={product.id}
              addToCanje={() => addToCanje(product)}
              decrementQuantityCanje={() => decrementQuantityCanje(product)}
              {...product}
            />
          ))}
        </ul>
      </aside>
    </div>
  );
}
