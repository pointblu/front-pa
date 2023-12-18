import React from "react";
import { useAuth } from "../../auth/AuthProvider";
import "./Cart.css";
import { useCart } from "../../hooks/useCarts";

function CartItem({ image, price, name, quantity, addToCart }) {
  return (
    <li>
      <img src={image} alt={name} />

      <div>{name}</div>

      <div>
        <small>Qty: {quantity} </small>
        <button className="icon-button" onClick={addToCart}>
          <i className="fas fa-plus" style={{ fontSize: "0.6rem" }} />
        </button>
        <strong> $ {(price * quantity).toFixed(2)} </strong>
      </div>
    </li>
  );
}

export function Cart() {
  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isClient =
    auth.isAuthenticated && userObject && userObject.role === "CLIENT";
  const { cart, clearCart, addToCart } = useCart();
  return (
    <div>
      {isClient && (
        <div className="button-containeru">
          <button
            data-widget="control-sidebar"
            data-slide="true"
            className="nav-link flyer"
            data-aos="fade-left"
          >
            <i className="fas fa-shopping-basket nav-icon" />
          </button>
        </div>
      )}

      {/* Control Sidebar */}
      <aside className="control-sidebar control-sidebar-dark basket">
        <ul className="sub-basket">
          {cart.map((product) => (
            <CartItem
              key={product.id}
              addToCart={() => addToCart(product)}
              {...product}
            />
          ))}
        </ul>
        <div className="button-containeri">
          <button className="icon-button" onClick={clearCart}>
            <i className="fas fa-eraser nav-icon" />
          </button>
        </div>
      </aside>
    </div>
  );
}
