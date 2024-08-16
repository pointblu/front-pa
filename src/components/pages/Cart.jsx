import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import "./Cart.css";
import { useCart } from "../../hooks/useCarts";
import { API_URL } from "../../auth/constants";
import { Toaster, toast } from "sonner";
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
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");
  const emptyCart = JSON.parse(localStorage.getItem("cart"));
  const emptyCanje = JSON.parse(localStorage.getItem("canje"));
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
  const [canjeCounter, setCanjeCounter] = useState(0);

  const [payment, setPayment] = useState("EFECTIVO");

  const [note, setNote] = useState("");
  const handlePayment = () => {
    if (payment === "EFECTIVO") {
      setPayment("TRANSFERENCIA");
    } else {
      setPayment("EFECTIVO");
    }
  };

  async function handleSubmit(e, action) {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const cartDetails = JSON.parse(localStorage.getItem("cart"));
      const canjeDetails = JSON.parse(localStorage.getItem("canje"));
      const domicilio = {
        id: "0e230b3f-34d2-4b6a-b0f4-a646bca3d893",
        quantity: 1,
        price: 0,
      };
      cartDetails.push(domicilio);
      const calculatedTotal = cartDetails.reduce(
        (acc, details) => acc + details.price * details.quantity,
        0
      );
      const formattedTotal = calculatedTotal.toFixed(2);
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
          total: parseFloat(formattedTotal),
          status: "REQUESTED",
          buyer: buyerId.id,
          paymentImage:
            "https://res.cloudinary.com/diitm4dx7/image/upload/v1705016689/acuse-base-1705016688615.webp",
          paymented: false,
          paymentType: payment,
          paymentCash: 0,
          paymentChange: 0,
          note: note,
        }),
      });
      console.log("respuesta al crar pruechase: ", response);
      if (response.ok) {
        console.log("Purchase register successfully");
        const json = await response.json();
        setSuccessResponse(json.message);
        localStorage.setItem("purchase", JSON.stringify(json.data.id));
        setErrorResponse(null);
        const puntales = JSON.parse(localStorage.getItem("points"));
        const redimidos = JSON.parse(localStorage.getItem("userInfo"));
        const pointers = await fetch(
          `${API_URL}/users/add/${buyerId.id}/points/${
            redimidos.points - puntales
          }`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
              "Access-Control-Allow-Origin": "*",
              mode: "no-cors",
            },
          }
        );
        console.log(pointers);
        // if (!pointers.ok) {
        //   throw new Error(`HTTP error! Status: ${pointers.status}`);
        // }
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
                seller: "210e8aec-2cc3-4547-877e-d38d61aaa4df", //crear manejo de vendedor cuando sea punto de venta, default el ADMIN
                detail: json.data.id,
                active: true,
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
        if (canjeDetails?.length > 0) {
          await Promise.all(
            canjeDetails.map(async (e) => {
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
                  seller: "210e8aec-2cc3-4547-877e-d38d61aaa4df", //crear manejo de vendedor cuando sea punto de venta, default el ADMIN
                  detail: json.data.id,
                  active: false,
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
        }

        clearCart();
        clearCanje();
        setTimeout(() => {
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

  const { cart, clearCart, addToCart, decrementQuantity, removeFromCart } =
    useCart();
  useEffect(() => {
    // Actualizar el contador cada vez que cambie el carrito
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
            onClick={handlePayment}
            data-tooltip-id="tt-cart"
            data-tooltip-content="Forma de pago"
            data-tooltip-place="left"
            data-tooltip-float={false}
            data-tooltip-class-name="custom-tooltip"
          >
            <i
              className="fas fa-money-bill-wave nav-icon"
              style={{ marginRight: "5px", maxWidth: "60px" }}
            />{" "}
            {payment}
          </button>

          <form action="/" method="post" onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                className="input-group mb-1 ml-1"
                style={{ maxWidth: "160px" }}
              >
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="form-control"
                  placeholder="Comentarios"
                  name="note"
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                className="iconio-button"
                disabled={!emptyCart?.length > 0}
                style={{ maxWidth: "37px" }}
                data-tooltip-id="tt-cart"
                data-tooltip-content="Confirmar pedido"
                data-tooltip-place="left"
                data-tooltip-float={false}
                data-tooltip-class-name="custom-tooltip"
              >
                <i className="fas fa-check nav-icon" />
              </button>
            </div>
          </form>
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
