import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useAuth } from "../../auth/AuthProvider";
import { useCart } from "../../hooks/useCarts";
import { useCanje } from "../../hooks/useCanje";
import api from "../../services/api";
import { MapPicker } from "./MapPicker";
import "./Checkout.css";

const STEPS = [
  { label: "Tu pedido", icon: "fas fa-shopping-basket" },
  { label: "Pago y nota", icon: "fas fa-money-bill-wave" },
  { label: "Confirmar", icon: "fas fa-check-circle" },
];

function CheckoutStepper({ current }) {
  return (
    <div className="checkout-stepper">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={s.label}>
            <div
              className={`co-step${done ? " co-completed" : active ? " co-active" : ""}`}
            >
              <div className="co-circle">
                {done ? <i className="fas fa-check" /> : <span>{i + 1}</span>}
              </div>
              <span className="co-label">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`co-connector${done ? " co-done" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Step 1: cart review ──────────────────────────────────────────────────── */
function Step1({ cart, canje, subtotal, domicilio }) {
  return (
    <div className="checkout-card">
      <h5 style={{ marginBottom: "1rem" }}>Productos en tu pedido</h5>

      {cart.length === 0 && (
        <p className="text-muted text-center">Tu carrito está vacío.</p>
      )}

      {cart.map((item) => (
        <div className="checkout-item-row" key={item.id}>
          <img
            className="checkout-item-img"
            src={item.image || "https://via.placeholder.com/52"}
            alt={item.name}
          />
          <span className="checkout-item-name">{item.name}</span>
          <span className="checkout-item-qty">× {item.quantity}</span>
          <span className="checkout-item-price">
            ${(item.price * item.quantity).toFixed(0)}
          </span>
        </div>
      ))}

      {canje.length > 0 && (
        <>
          <p
            style={{ marginTop: "0.75rem", fontWeight: 600, fontSize: "0.8rem" }}
          >
            Canjes de puntos:
          </p>
          {canje.map((item) => (
            <div className="checkout-item-row" key={item.id}>
              <img
                className="checkout-item-img"
                src={item.image || "https://via.placeholder.com/52"}
                alt={item.name}
              />
              <span className="checkout-item-name">
                {item.name}
                <span className="co-canje-badge">Canje</span>
              </span>
              <span className="checkout-item-qty">× {item.quantity}</span>
              <span className="checkout-item-price">{item.points} pts</span>
            </div>
          ))}
        </>
      )}

      <div style={{ marginTop: "1rem" }}>
        <div className="checkout-total-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(0)}</span>
        </div>
        {domicilio > 0 && (
          <div className="checkout-total-row">
            <span>Domicilio</span>
            <span>${domicilio.toFixed(0)}</span>
          </div>
        )}
        <div className="checkout-total-row grand-total">
          <span>Total a pagar</span>
          <span>${(subtotal + domicilio).toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: payment + note + map ────────────────────────────────────────── */
function Step2({ payment, setPayment, note, setNote, banks, onLocationSelect }) {
  return (
    <div className="checkout-card">
      <h5 style={{ marginBottom: "1rem" }}>Forma de pago</h5>

      <div className="payment-toggle">
        <button
          type="button"
          className={`payment-option${payment === "EFECTIVO" ? " selected" : ""}`}
          onClick={() => setPayment("EFECTIVO")}
        >
          <i className="fas fa-money-bill-wave" />
          Efectivo
        </button>
        <button
          type="button"
          className={`payment-option${payment === "TRANSFERENCIA" ? " selected" : ""}`}
          onClick={() => setPayment("TRANSFERENCIA")}
        >
          <i className="fas fa-university" />
          Transferencia
        </button>
      </div>

      {payment === "TRANSFERENCIA" && banks.length > 0 && (
        <div className="bank-info-box">
          <p style={{ fontWeight: 600, marginBottom: "0.4rem" }}>
            Cuentas disponibles:
          </p>
          <ul>
            {banks.map((b) => (
              <li key={b.id}>
                {b.type} {b.name} — <strong>{b.account}</strong>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: "0.5rem", color: "#555" }}>
            Después de crear el pedido podrás subir el comprobante desde la
            sección <em>Mis pedidos</em>.
          </p>
        </div>
      )}

      <h5 style={{ marginTop: "1.2rem", marginBottom: "0.5rem" }}>
        Nota de entrega
      </h5>
      <textarea
        className="form-control"
        rows={3}
        placeholder="Instrucciones especiales, dirección adicional, etc."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={300}
        style={{ resize: "none", borderRadius: "0.4rem" }}
      />
      <small className="text-muted">{note.length}/300</small>

      <MapPicker onLocationSelect={onLocationSelect} />
    </div>
  );
}

/* ── Step 3: confirm summary ──────────────────────────────────────────────── */
function Step3({ cart, canje, payment, note, subtotal, domicilio }) {
  return (
    <div className="checkout-card">
      <h5 style={{ marginBottom: "1rem" }}>Resumen del pedido</h5>

      {cart.map((item) => (
        <div className="checkout-total-row" key={item.id}>
          <span>
            {item.name} × {item.quantity}
          </span>
          <span>${(item.price * item.quantity).toFixed(0)}</span>
        </div>
      ))}

      {canje.map((item) => (
        <div className="checkout-total-row" key={item.id}>
          <span>
            {item.name} × {item.quantity}{" "}
            <span className="co-canje-badge">Canje</span>
          </span>
          <span>{item.points * item.quantity} pts</span>
        </div>
      ))}

      <div
        style={{
          borderTop: "1px solid #ddd",
          marginTop: "0.5rem",
          paddingTop: "0.5rem",
        }}
      >
        {domicilio > 0 && (
          <div className="checkout-total-row">
            <span>Domicilio</span>
            <span>${domicilio.toFixed(0)}</span>
          </div>
        )}
        <div className="checkout-total-row grand-total">
          <span>Total</span>
          <span>${(subtotal + domicilio).toFixed(0)}</span>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <p style={{ fontSize: "0.85rem" }}>
          <strong>Forma de pago:</strong> {payment}
        </p>
        {note && (
          <p style={{ fontSize: "0.85rem" }}>
            <strong>Nota:</strong> {note}
          </p>
        )}
      </div>

      {payment === "TRANSFERENCIA" && (
        <div
          className="bank-info-box"
          style={{ marginTop: "0.75rem", background: "#fffae0" }}
        >
          <i className="fas fa-info-circle" style={{ marginRight: "6px" }} />
          Después de confirmar, sube el comprobante en <em>Mis pedidos</em>.
        </div>
      )}
    </div>
  );
}

const WHATSAPP_STORE = process.env.REACT_APP_WHATSAPP_STORE || "";

/* ── Step "done": success + WhatsApp CTA ─────────────────────────────────── */
function StepDone({ orderId, total, payment, onGoToOrders }) {
  const shortId = orderId ? orderId.slice(0, 8).toUpperCase() : "";
  const formattedTotal = Number(total || 0).toLocaleString("es-CO");

  const waText = encodeURIComponent(
    `Hola Punto Azul 🍞 Acabo de crear mi pedido #${shortId} por $${formattedTotal} (${payment}). ¡Por favor confírmenme! 😊`
  );
  const waUrl = WHATSAPP_STORE
    ? `https://wa.me/${WHATSAPP_STORE}?text=${waText}`
    : null;

  return (
    <div className="checkout-card" style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
      <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✅</div>
      <h4 style={{ marginBottom: "0.25rem" }}>¡Pedido creado con éxito!</h4>
      <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        Pedido <strong>#{shortId}</strong> · Total{" "}
        <strong>${formattedTotal}</strong>
      </p>

      {waUrl && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success btn-block"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "1rem",
            padding: "0.65rem",
            borderRadius: "0.5rem",
            marginBottom: "0.75rem",
            textDecoration: "none",
          }}
        >
          <i className="fab fa-whatsapp" style={{ fontSize: "1.2rem" }} />
          Confirmar por WhatsApp
        </a>
      )}

      <button
        className="btn btn-outline-secondary btn-block"
        style={{ borderRadius: "0.5rem" }}
        onClick={onGoToOrders}
      >
        Ver mis pedidos
      </button>
    </div>
  );
}

/* ── Main Checkout component ──────────────────────────────────────────────── */
export function Checkout() {
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState("EFECTIVO");
  const [note, setNote] = useState("");
  const [banks, setBanks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [doneOrder, setDoneOrder] = useState(null); // { id, total }

  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isSeller = auth.isAuthenticated && userObject.role === "SELLER";
  const goTo = useNavigate();

  const { cart, clearCart } = useCart();
  const { canje, clearCanje } = useCanje();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const domicilio = isSeller ? 0 : 1000;

  useEffect(() => {
    if (cart.length === 0) goTo("/catalogo");
  }, []);

  useEffect(() => {
    api
      .get("/banks")
      .then(({ data }) => setBanks(data.data || []))
      .catch(() => {});
  }, []);

  async function handleConfirm() {
    setSubmitting(true);
    try {
      const cartDetails = JSON.parse(localStorage.getItem("cart")) || [];
      const canjeDetails = JSON.parse(localStorage.getItem("canje")) || [];
      const domicilioItem = {
        id: "0e230b3f-34d2-4b6a-b0f4-a646bca3d893",
        quantity: 1,
        price: 0,
      };
      const allDetails = [...cartDetails, domicilioItem];
      const calculatedTotal = allDetails.reduce(
        (acc, d) => acc + d.price * d.quantity,
        0
      );

      const buyerId = JSON.parse(localStorage.getItem("userInfo"));

      // Guardar ubicación de entrega en el perfil del usuario si fue seleccionada
      if (deliveryLocation) {
        await Promise.allSettled([
          api.patch(`/users/${buyerId.id}`, { address: deliveryLocation.address }),
          api.get(`/users/position/${buyerId.id}/lat/${deliveryLocation.lat}/lon/${deliveryLocation.lng}`),
        ]);
      }

      const { data: json } = await api.post("/purchases", {
        total: parseFloat(calculatedTotal.toFixed(2)),
        status: "REQUESTED",
        buyer: buyerId.id,
        paymentImage:
          "https://res.cloudinary.com/diitm4dx7/image/upload/v1705016689/acuse-base-1705016688615.webp",
        paymented: false,
        paymentType: payment,
        paymentCash: 0,
        paymentChange: 0,
        note,
      });

      localStorage.setItem("purchase", JSON.stringify(json.data.id));

      const puntales = JSON.parse(localStorage.getItem("points")) || 0;
      const redimidos = JSON.parse(localStorage.getItem("userInfo"));
      await api.get(
        `/users/add/${buyerId.id}/points/${redimidos.points - puntales}`
      );

      const SELLER_ID = "210e8aec-2cc3-4547-877e-d38d61aaa4df";
      await Promise.all(
        allDetails.map((e) =>
          api.post("/purchaseDetails", {
            subtotal: 0,
            cost: 0,
            quantity: parseInt(e.quantity, 10),
            product: e.id,
            seller: SELLER_ID,
            detail: json.data.id,
            active: true,
          })
        )
      );

      if (canjeDetails.length > 0) {
        await Promise.all(
          canjeDetails.map((e) =>
            api.post("/purchaseDetails", {
              subtotal: 0,
              cost: 0,
              quantity: parseInt(e.quantity, 10),
              product: e.id,
              seller: SELLER_ID,
              detail: json.data.id,
              active: false,
            })
          )
        );
      }

      clearCart();
      clearCanje();
      setDoneOrder({ id: json.data.id, total: calculatedTotal });
    } catch (_) {
      toast.error("Hubo un error al crear el pedido. Intenta de nuevo.");
      setSubmitting(false);
    }
  }

  if (doneOrder) {
    return (
      <div>
        <div className="content-wrapper">
          <section className="content" style={{ paddingTop: "2rem" }}>
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-md-5 col-lg-4">
                  <StepDone
                    orderId={doneOrder.id}
                    total={doneOrder.total}
                    payment={payment}
                    onGoToOrders={() => {
                      goTo("/pedidos");
                      window.location.reload();
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-center" richColors />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1
                  className="m-0 App-header focus-in-contract alphi-3"
                  style={{ backgroundColor: "#F1d100" }}
                >
                  Confirmar pedido
                </h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-md-7 col-lg-6">
                <CheckoutStepper current={step} />

                {step === 0 && (
                  <Step1
                    cart={cart}
                    canje={canje}
                    subtotal={subtotal}
                    domicilio={domicilio}
                  />
                )}
                {step === 1 && (
                  <Step2
                    payment={payment}
                    setPayment={setPayment}
                    note={note}
                    setNote={setNote}
                    banks={banks}
                    onLocationSelect={setDeliveryLocation}
                  />
                )}
                {step === 2 && (
                  <Step3
                    cart={cart}
                    canje={canje}
                    payment={payment}
                    note={note}
                    subtotal={subtotal}
                    domicilio={domicilio}
                  />
                )}

                <div className="checkout-nav">
                  {step > 0 ? (
                    <button
                      className="btn-back"
                      onClick={() => setStep((s) => s - 1)}
                      disabled={submitting}
                    >
                      <i className="fas fa-arrow-left" /> Atrás
                    </button>
                  ) : (
                    <button
                      className="btn-back"
                      onClick={() => goTo("/catalogo")}
                    >
                      <i className="fas fa-arrow-left" /> Seguir comprando
                    </button>
                  )}

                  {step < 2 ? (
                    <button
                      className="btn-next"
                      onClick={() => setStep((s) => s + 1)}
                      disabled={cart.length === 0}
                    >
                      Siguiente <i className="fas fa-arrow-right" />
                    </button>
                  ) : (
                    <button
                      className="btn-confirm"
                      onClick={handleConfirm}
                      disabled={submitting || cart.length === 0}
                    >
                      {submitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin" /> Enviando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check" /> Confirmar pedido
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
