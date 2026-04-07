import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { toast, Toaster } from "sonner";
import { useAuth } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export function DeliveryPayouts() {
  const auth = useAuth();
  const navigate = useNavigate();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isAdmin = auth.isAuthenticated && userObject.role === "ADMIN";

  const [summary, setSummary] = useState([]);
  const [paying, setPaying] = useState(null);

  const fetchSummary = useCallback(() => {
    api.get("/Purchases/delivery/earnings-summary")
      .then(({ data: res }) => setSummary(res.data ?? res))
      .catch(() => toast.error("Error al cargar resumen de ganancias"));
  }, []);

  useEffect(() => {
    if (!isAdmin) { navigate("/"); return; }
    fetchSummary();
  }, [isAdmin, navigate, fetchSummary]);

  const handlePayout = async (userId, name) => {
    setPaying(userId);
    try {
      const { data: res } = await api.post(`/Purchases/delivery/${userId}/payout`);
      const paid = res.data?.paidAmount ?? 0;
      toast.success(`Pago de $${paid.toFixed(0)} registrado a ${name}`);
      fetchSummary();
    } catch {
      toast.error("Error al registrar el pago");
    } finally {
      setPaying(null);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="content-wrapper">
      <Toaster position="top-center" richColors />
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0 App-header focus-in-contract alphi-1">Pagos domiciliarios</h1>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <div style={{ maxWidth: "560px" }}>
            {summary.length === 0 && (
              <p style={{ color: "#888" }}>No hay domiciliarios activos registrados.</p>
            )}
            {summary.map((person) => (
              <div
                key={person.id}
                className="card"
                style={{
                  padding: "1rem 1.25rem",
                  marginBottom: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{person.name}</div>
                  <div style={{ fontSize: "0.9rem", color: person.balance > 0 ? "#2E7D32" : "#888" }}>
                    Saldo pendiente: <strong>${(person.balance ?? 0).toFixed(0)}</strong>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-success"
                  disabled={paying === person.id || person.balance <= 0}
                  onClick={() => handlePayout(person.id, person.name)}
                >
                  <i className="fas fa-money-bill-wave nav-icon" style={{ marginRight: "0.35rem" }} />
                  {paying === person.id ? "Procesando..." : "Pagar"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
