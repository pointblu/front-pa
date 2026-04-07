import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast, Toaster } from "sonner";
import { useAuth } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

const columns = [
  {
    name: "FECHA",
    selector: (row) =>
      Intl.DateTimeFormat("es-ES", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      }).format(new Date(row.createdAt)),
    minWidth: "140px",
  },
  {
    name: "CLIENTE",
    selector: (row) => row.buyerName ?? "-",
    minWidth: "130px",
  },
  {
    name: "GANANCIA",
    selector: (row) => `$ ${(row.deliveryEarning ?? 0).toFixed(0)}`,
    minWidth: "100px",
    right: true,
  },
  {
    name: "ESTADO",
    cell: (row) => (
      <span style={{ color: row.paid ? "green" : "goldenrod", fontWeight: 600, fontSize: "0.75rem" }}>
        {row.paid ? "Pagado" : "Pendiente"}
      </span>
    ),
    minWidth: "90px",
  },
];

export function DeliveryEarnings() {
  const auth = useAuth();
  const navigate = useNavigate();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const [data, setData] = useState({ balance: 0, totalEarned: 0, records: [] });

  useEffect(() => {
    if (userObject.role !== "DELIVERY") { navigate("/"); return; }

    api.get("/Purchases/delivery/earnings")
      .then(({ data: res }) => setData(res.data ?? res))
      .catch(() => toast.error("Error al cargar ganancias"));
  }, []); // eslint-disable-line

  return (
    <div className="content-wrapper">
      <Toaster position="top-center" richColors />
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0 App-header focus-in-contract alphi-2">Mis ganancias</h1>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <div
              className="small-box"
              style={{
                background: "#2E7D32", color: "#fff", borderRadius: "8px",
                padding: "1rem 1.5rem", fontSize: "1.1rem", fontWeight: 700,
              }}
            >
              Saldo pendiente: $ {(data.balance ?? 0).toFixed(0)}
            </div>
            <div
              className="small-box"
              style={{
                background: "#455a64", color: "#fff", borderRadius: "8px",
                padding: "1rem 1.5rem", fontSize: "1rem", fontWeight: 600,
              }}
            >
              Total histórico: $ {(data.totalEarned ?? 0).toFixed(0)}
            </div>
          </div>

          <DataTable
            columns={columns}
            data={data.records ?? []}
            pagination
            highlightOnHover
            noDataComponent={<div style={{ padding: "1rem" }}>No hay ganancias registradas aún.</div>}
            customStyles={{ headCells: { style: { fontWeight: "bold", fontSize: "12px" } } }}
            paginationComponentOptions={{
              rowsPerPageText: "Registros por página:",
              rangeSeparatorText: "de",
            }}
          />
        </div>
      </section>
    </div>
  );
}
