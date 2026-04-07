import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../auth/AuthProvider";
import { Toaster, toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

const STATUS_MAP = {
  REQUESTED: { label: "En proceso", color: "goldenrod", icon: "fas fa-share" },
  ROUTED:    { label: "En ruta",    color: "cadetblue", icon: "fas fa-shipping-fast" },
  DELIVERED: { label: "Entregado",  color: "green",     icon: "fas fa-check" },
  CANCELED:  { label: "Cancelado",  color: "red",       icon: "fas fa-times" },
};

const columns = [
  {
    name: "FECHA",
    selector: (row) =>
      Intl.DateTimeFormat("es-ES", {
        day: "numeric", month: "numeric", year: "numeric",
        hour: "numeric", minute: "numeric", hour12: true,
      }).format(new Date(row.createdAt)),
    minWidth: "130px",
  },
  {
    name: "CLIENTE",
    selector: (row) => row.buyer?.name ?? "-",
    minWidth: "120px",
  },
  {
    name: "DIRECCIÓN",
    selector: (row) => row.buyer?.address ?? "-",
    minWidth: "150px",
    wrap: true,
  },
  {
    name: "TOTAL",
    selector: (row) => `$ ${row.total.toFixed(0)}`,
    minWidth: "90px",
  },
  {
    name: "ESTADO",
    cell: (row) => {
      const s = STATUS_MAP[row.status] ?? { label: row.status, color: "#333", icon: "" };
      return (
        <span style={{ color: s.color, fontWeight: 600, fontSize: "0.75rem" }}>
          <i className={`${s.icon} nav-icon`} /> {s.label}
        </span>
      );
    },
    minWidth: "110px",
  },
  {
    name: "MAPA",
    cell: (row) => (
      <Link to={`/domicilios/mapa/${row.id}`}>
        <button className="ican-button" title="Ver en mapa">
          <i className="fas fa-map-marker-alt nav-icon" />
        </button>
      </Link>
    ),
    minWidth: "70px",
  },
];

const CustomNoData = () => (
  <div className="text-center" style={{ padding: "1rem" }}>
    No tienes pedidos asignados.
  </div>
);

export function DeliveryOrders() {
  const auth = useAuth();
  const navigate = useNavigate();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (userObject.role !== "DELIVERY") { navigate("/"); return; }

    let cancelled = false;
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/Purchases/delivery/mine");
        if (!cancelled) setOrders(Array.isArray(data.data ?? data) ? (data.data ?? data) : []);
      } catch {
        toast.error("Error al cargar pedidos");
      }
    };

    fetchOrders();
    const id = setInterval(fetchOrders, 30000);
    return () => { cancelled = true; clearInterval(id); };
  }, []); // eslint-disable-line

  return (
    <div className="content-wrapper">
      <Toaster position="top-center" richColors />
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0 App-header focus-in-contract alphi-2">Mis pedidos</h1>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <DataTable
            columns={columns}
            data={orders}
            pagination
            highlightOnHover
            noDataComponent={<CustomNoData />}
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
