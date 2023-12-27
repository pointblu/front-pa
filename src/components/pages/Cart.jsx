import React, { useRef, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import "./Cart.css";
import { useCart } from "../../hooks/useCarts";
import { API_URL } from "../../auth/constants";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

function CartItem({
  image,
  price,
  name,
  quantity,
  addToCart,
  decrementQuantity,
}) {
  return (
    <li>
      <img src={image} alt={name} />

      <div>{name}</div>

      <div>
        <small>Cantidad: </small>
        <button className="iconio-button" onClick={decrementQuantity}>
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

export function Cart() {
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");
  const emptyCart = JSON.parse(localStorage.getItem("cart"));
  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isClient =
    auth.isAuthenticated && userObject && userObject.role === "CLIENT";
  const goTo = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const cartDetails = JSON.parse(localStorage.getItem("cart"));
      const calculatedTotal = cartDetails.reduce(
        (acc, details) => acc + details.price * details.quantity,
        0
      );
      const numericTotal = parseFloat(0);
      const buyerId = JSON.parse(localStorage.getItem("userInfo"));
      const response = await fetch(`${API_URL}/purchases`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({
          total: parseFloat(calculatedTotal),
          status: "REQUESTED",
          buyer: buyerId.id,
        }),
      });

      if (response.ok) {
        console.log("Purchase register successfully");
        const json = await response.json();
        setSuccessResponse(json.message);
        localStorage.setItem("purchase", JSON.stringify(json.data.id));
        setErrorResponse(null);

        await Promise.all(
          cartDetails.map(async (e) => {
            const responseDetail = await fetch(`${API_URL}/purchaseDetails`, {
              method: "POST",
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
              },
              body: JSON.stringify({
                subtotal: numericTotal,
                cost: numericTotal,
                quantity: parseInt(e.quantity, 10),
                product: e.id,
                seller: "3d0a9e53-75ad-41f0-be59-bd50fe95513d", //crear manejo de vendedor cuando sea punto de venta, default el ADMIN
                detail: json.data.id,
              }),
            });

            if (!responseDetail.ok) {
              // Manejar el caso en que la creación de un Purchase Detail falle
              const jsonDetail = await responseDetail.json();
              toast.error(jsonDetail.message);
              setSuccessResponse(null);
            }
            return responseDetail;
          })
        );

        clearCart();
        setTimeout(async () => {
          goTo("/pedidos");
          window.location.reload();
        }, 3000);
        toast.success("¡Su pedido fue creado con éxito!");
      } else {
        console.log("Something went wrong");
        const json = await response.json();
        setErrorResponse(json.message);
        toast.error(json.message);
        setSuccessResponse(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const { cart, clearCart, addToCart, decrementQuantity } = useCart();
  return (
    <div>
      <Toaster position="top-center" richColors />
      {isClient && (
        <div className="button-containeru">
          <button
            data-widget="control-sidebar"
            data-slide="true"
            className="nav-link flyer"
            data-aos="fade-left"
            onClick={scrollToTop}
          >
            <i className="fas fa-shopping-basket nav-icon" />
          </button>
        </div>
      )}

      {/* Control Sidebar */}
      <aside className="control-sidebar control-sidebar-dark basket">
        <div className="button-containeri">
          <button className="iconio-button" onClick={clearCart}>
            <i className="fas fa-eraser nav-icon" />
          </button>
          <form action="/" method="post" onSubmit={handleSubmit}>
            <button className="iconio-button" disabled={!emptyCart?.length > 0}>
              <i className="fas fa-check nav-icon" />
            </button>
          </form>
        </div>
        <ul className="sub-basket">
          {cart.map((product) => (
            <CartItem
              key={product.id}
              addToCart={() => addToCart(product)}
              decrementQuantity={() => decrementQuantity(product)}
              {...product}
            />
          ))}
        </ul>
      </aside>
    </div>
  );
}
