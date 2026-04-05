import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { UserNumber } from "../../context/point";
import api from "../../services/api";
import { Toaster } from "sonner";

const STATUS_LABEL = {
  REQUESTED: "En proceso",
  ROUTED: "En ruta",
  DELIVERED: "Entregado",
  CANCELED: "Cancelado",
};

function convertDate(dateStr) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

function PointsBadge({ change, type }) {
  if (type === "EARNED") {
    return (
      <span style={{ color: "#28a745", fontWeight: 700 }}>
        +{change} <i className="fas fa-star" style={{ fontSize: "0.7rem" }} />
      </span>
    );
  }
  if (type === "LOST") {
    return (
      <span style={{ color: "#dc3545", fontWeight: 700 }}>
        {change} <i className="fas fa-star" style={{ fontSize: "0.7rem" }} />
      </span>
    );
  }
  return <span style={{ color: "#aaa" }}>—</span>;
}

export function PointsHistory() {
  const auth = useAuth();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo?.id) return;
    api
      .get(`/purchases/points-history?buyerId=${userInfo.id}`)
      .then(({ data: res }) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const resetDate = data?.resetPointsAt
    ? convertDate(data.resetPointsAt)
    : userInfo?.resetpointsat
    ? convertDate(userInfo.resetpointsat)
    : "—";

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
                  Mis Puntos Azules
                </h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-7">

                {/* Balance card */}
                <div
                  className="card"
                  style={{
                    background: "linear-gradient(135deg,#f1d100 0%,#e6c200 100%)",
                    borderRadius: "0.75rem",
                    marginBottom: "1.5rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  }}
                >
                  <div className="card-body text-center" style={{ padding: "1.75rem" }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.25rem", color: "#555" }}>
                      Saldo actual
                    </p>
                    <div style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1, color: "#333" }}>
                      <UserNumber />
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#555", marginTop: "0.4rem" }}>
                      <i className="fas fa-star" style={{ marginRight: "4px" }} />
                      Puntos Azules
                    </p>
                    <hr style={{ borderColor: "rgba(0,0,0,0.15)", margin: "0.75rem 0" }} />
                    <p style={{ fontSize: "0.75rem", color: "#555", marginBottom: 0 }}>
                      Válidos hasta: <strong>{resetDate}</strong>
                    </p>
                  </div>
                </div>

                {/* History table */}
                <div className="card" style={{ borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                  <div className="card-header" style={{ background: "#fff", borderBottom: "2px solid #f1d100", borderRadius: "0.5rem 0.5rem 0 0" }}>
                    <h5 style={{ margin: 0, fontWeight: 700 }}>
                      <i className="fas fa-history" style={{ marginRight: "8px", color: "#c9ae00" }} />
                      Historial de movimientos
                    </h5>
                  </div>
                  <div className="card-body" style={{ padding: "0.5rem 0" }}>
                    {loading && (
                      <p className="text-center text-muted" style={{ padding: "1.5rem" }}>
                        <i className="fas fa-spinner fa-spin" /> Cargando...
                      </p>
                    )}

                    {!loading && (!data?.history || data.history.length === 0) && (
                      <p className="text-center text-muted" style={{ padding: "1.5rem" }}>
                        No hay movimientos de puntos aún.
                      </p>
                    )}

                    {!loading && data?.history?.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-hover" style={{ marginBottom: 0 }}>
                          <thead>
                            <tr style={{ fontSize: "0.75rem", color: "#888" }}>
                              <th>Fecha</th>
                              <th>Estado</th>
                              <th>Total pedido</th>
                              <th className="text-center">Puntos</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.history.map((row) => (
                              <tr key={row.id} style={{ fontSize: "0.82rem" }}>
                                <td style={{ whiteSpace: "nowrap" }}>
                                  {convertDate(row.date)}
                                </td>
                                <td>
                                  <span
                                    style={{
                                      fontSize: "0.72rem",
                                      padding: "2px 8px",
                                      borderRadius: "10px",
                                      fontWeight: 600,
                                      background:
                                        row.status === "DELIVERED" ? "#d4edda"
                                        : row.status === "CANCELED" ? "#f8d7da"
                                        : row.status === "ROUTED" ? "#d1ecf1"
                                        : "#fff3cd",
                                      color:
                                        row.status === "DELIVERED" ? "#155724"
                                        : row.status === "CANCELED" ? "#721c24"
                                        : row.status === "ROUTED" ? "#0c5460"
                                        : "#856404",
                                    }}
                                  >
                                    {STATUS_LABEL[row.status] || row.status}
                                  </span>
                                </td>
                                <td>${row.total.toFixed(0)}</td>
                                <td className="text-center">
                                  <PointsBadge
                                    change={row.pointsChange}
                                    type={row.type}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
