import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
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
    selector: (row) => row.buyer?.name ?? "-",
    minWidth: "130px",
  },
  {
    name: "GANANCIA",
    selector: (row) => `$ ${(row.deliveryEarning ?? 0).toFixed(0)}`,
    minWidth: "100px",
    right: true,
  },
];

export function DeliveryEarnings() {
  const [data, setData] = useState({ total: 0, records: [] });

  useEffect(() => {
    api.get("/Purchases/delivery/earnings")
      .then(({ data: res }) => setData(res))
      .catch(() => toast.error("Error al cargar ganancias"));
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h4>Mis ganancias</h4>

      <div
        style={{
          background: "#2E7D32",
          color: "#fff",
          borderRadius: "8px",
          padding: "1rem 1.5rem",
          display: "inline-block",
          marginBottom: "1.5rem",
          fontSize: "1.1rem",
          fontWeight: 700,
        }}
      >
        Total acumulado: $ {data.total.toFixed(0)}
      </div>

      <DataTable
        columns={columns}
        data={data.records}
        pagination
        highlightOnHover
        noDataComponent={
          <div style={{ padding: "1rem" }}>No hay ganancias registradas aún.</div>
        }
        customStyles={{ headCells: { style: { fontWeight: "bold", fontSize: "12px" } } }}
        paginationComponentOptions={{
          rowsPerPageText: "Registros por página:",
          rangeSeparatorText: "de",
        }}
      />
    </div>
  );
}
