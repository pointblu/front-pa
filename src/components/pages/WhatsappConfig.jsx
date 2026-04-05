import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

export const WhatsappConfig = () => {
  const [status, setStatus] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrLoading, setQrLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await api.get("/Whatsapp/status");
      setStatus(data.data);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQr = useCallback(async () => {
    setQrLoading(true);
    setMessage(null);
    try {
      const { data } = await api.get("/Whatsapp/qr");
      if (data.data?.qr) {
        setQrData(data.data.qr);
        setMessage(null);
      } else {
        setQrData(null);
        setMessage(data.message);
      }
    } catch {
      setMessage("Error al obtener el QR. Intenta de nuevo.");
    } finally {
      setQrLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 8000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0 App-header focus-in-contract alphi-5">
            WhatsApp
          </h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">

              {/* Estado */}
              <div
                className="card mb-4"
                style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
              >
                <div
                  className="card-header"
                  style={{ backgroundColor: "#fff8e7", borderBottom: "2px solid #D4A017" }}
                >
                  <h6 style={{ margin: 0, color: "#2E1A00", fontWeight: 700 }}>
                    <i className="fab fa-whatsapp mr-2" style={{ color: "#25D366" }} />
                    Estado de conexión
                  </h6>
                </div>
                <div className="card-body text-center" style={{ padding: "24px" }}>
                  {loading ? (
                    <p style={{ color: "#6B3A00" }}>Verificando...</p>
                  ) : status?.connected ? (
                    <>
                      <div style={{ fontSize: "3rem" }}>✅</div>
                      <p style={{ color: "#2E7D32", fontWeight: 700, margin: "8px 0 4px" }}>
                        Conectado
                      </p>
                      <p style={{ color: "#555", fontSize: "0.85rem" }}>
                        Las notificaciones están activas. Los pedidos nuevos y cambios de estado
                        se enviarán automáticamente.
                      </p>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "3rem" }}>📵</div>
                      <p style={{ color: "#C0392B", fontWeight: 700, margin: "8px 0 4px" }}>
                        Desconectado
                      </p>
                      <p style={{ color: "#555", fontSize: "0.85rem" }}>
                        Escanea el QR con el celular administrador para activar las notificaciones.
                      </p>
                      <button
                        className="btn btn-success mt-3"
                        style={{ borderRadius: 6, fontWeight: 600 }}
                        onClick={fetchQr}
                        disabled={qrLoading}
                      >
                        <i className="fab fa-whatsapp mr-2" />
                        {qrLoading ? "Cargando QR..." : "Obtener QR para escanear"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* QR */}
              {(qrData || message) && !status?.connected && (
                <div
                  className="card"
                  style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                >
                  <div
                    className="card-header"
                    style={{ backgroundColor: "#fff8e7", borderBottom: "2px solid #25D366" }}
                  >
                    <h6 style={{ margin: 0, color: "#2E1A00", fontWeight: 700 }}>
                      Escanea el QR
                    </h6>
                  </div>
                  <div className="card-body text-center" style={{ padding: "24px" }}>
                    {qrData ? (
                      <>
                        <img
                          src={qrData}
                          alt="WhatsApp QR"
                          style={{ width: 220, height: 220, border: "4px solid #25D366", borderRadius: 8 }}
                        />
                        <p style={{ color: "#555", fontSize: "0.82rem", marginTop: 12 }}>
                          Abre WhatsApp en el celular →{" "}
                          <strong>Dispositivos vinculados → Vincular dispositivo</strong>
                        </p>
                        <p style={{ color: "#888", fontSize: "0.78rem" }}>
                          El QR expira en ~60 segundos. Si caduca, vuelve a generarlo.
                        </p>
                        <button
                          className="btn btn-outline-success btn-sm mt-1"
                          onClick={fetchQr}
                          disabled={qrLoading}
                        >
                          <i className="fas fa-sync-alt mr-1" />
                          Regenerar QR
                        </button>
                      </>
                    ) : (
                      <p style={{ color: "#6B3A00" }}>{message}</p>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
