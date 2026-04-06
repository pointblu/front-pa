import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import api from "../../services/api";
import { Tooltip } from "react-tooltip";
import { Toaster, toast } from "sonner";

const ROLE_COLORS = {
  ADMIN:    { bg: "#2E7D32", label: "Admin" },
  SELLER:   { bg: "#8B5E3C", label: "Vendedor" },
  CLIENT:   { bg: "#C3A873", label: "Cliente" },
  DELIVERY: { bg: "#00695C", label: "Domiciliario" },
};

const columns = (handleDeleteUser, handleRoleChange) => [
  {
    name: "NOMBRE",
    selector: (row) => (
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "wrap",
          textOverflow: "unset",
        }}
      >
        {row.name}
      </div>
    ),
    minWidth: "200px",
  },
  {
    name: "CORREO-E",
    selector: (row) => (
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "unset",
        }}
      >
        {row.email}
      </div>
    ),
    minWidth: "200px",
  },
  { name: "CELULAR", selector: (row) => row.phone },
  {
    name: "DIRECCIÓN",
    selector: (row) => (
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "wrap",
          textOverflow: "unset",
        }}
      >
        {row.address}
      </div>
    ),
    minWidth: "200px",
  },
  {
    name: "ÚLTIMA UBICACIÓN",
    selector: (row) => (
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "wrap",
          textOverflow: "unset",
        }}
      >
        {row.latitude},{row.longitude}
      </div>
    ),
    minWidth: "200px",
  },
  {
    name: "PUNTOS MONSALVE",
    selector: (row) => (
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "wrap",
          textOverflow: "unset",
        }}
      >
        {row.points}
      </div>
    ),
    minWidth: "200px",
  },
  {
    name: "ROL",
    minWidth: "140px",
    cell: (row) => {
      const color = ROLE_COLORS[row.role]?.bg ?? "#999";
      const label = ROLE_COLORS[row.role]?.label ?? row.role ?? "—";
      return (
        <span style={{
          background: color, color: "#fff", borderRadius: "4px",
          padding: "2px 8px", fontSize: "0.75rem", fontWeight: 600,
        }}>
          {label}
        </span>
      );
    },
  },
  {
    name: "ACCIONES",
    minWidth: "180px",
    cell: (row) => (
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <Tooltip id="tt-delete" />
        <Tooltip id="tt-role" />
        <select
          defaultValue={row.role ?? "CLIENT"}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          className="form-control form-control-sm custom-input-form"
          style={{ fontSize: "0.75rem", padding: "2px 4px", maxWidth: "120px" }}
          data-tooltip-id="tt-role"
          data-tooltip-content="Cambiar rol"
          data-tooltip-place="top"
        >
          <option value="CLIENT">Cliente</option>
          <option value="SELLER">Vendedor</option>
          <option value="DELIVERY">Domiciliario</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          onClick={() => handleDeleteUser(row.id)}
          className="ican-button act-ccl"
          data-tooltip-id="tt-delete"
          data-tooltip-content="Eliminar usuario"
          data-tooltip-place="right"
        >
          <i className="fas fa-times nav-icon" />
        </button>
      </div>
    ),
  },
];

const CustomNoDataComponent = () => (
  <div className="text-center">¡No hay registros para mostrar!</div>
);

export function Users() {
  const [datum, setDatum] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchDataAsync();
  }, [page, perPage]);

  useEffect(() => {
    const result = datum.filter((item) => {
      return item.name.toLowerCase().match(search.toLocaleLowerCase());
    });
    setFilter(result);
  }, [search, datum]);

  const fetchDataAsync = async () => {
    try {
      const { data: apiData } = await api.get(`/users?page=${page}&take=${perPage}`);
      const apiDatum = apiData.data.filter((datu) => datu.active !== false);
      setDatum(apiDatum);
      setFilter(apiDatum);
      setTotalRows(apiData.meta.itemsCount);
    } catch (_) {}
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      toast.success("Eliminaste este usuario!");
      fetchDataAsync();
      window.location.reload();
    } catch (_) {}
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      const label = ROLE_COLORS[newRole]?.label ?? newRole;
      toast.success(`Rol actualizado a ${label}`);
      fetchDataAsync();
    } catch (_) {
      toast.error("Error al cambiar el rol");
    }
  };
  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };
  const tableHeaderstyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "12px",
      },
    },
  };

  return (
    <div>
      <Toaster position="top-center" richColors />
      <DataTable
        columns={columns(handleDeleteUser, handleRoleChange)}
        data={filter}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        customStyles={tableHeaderstyle}
        fixedHeader
        paginationComponentOptions={{
          rowsPerPageText: "Registros por página:",
          rangeSeparatorText: "de",
          noRowsPerPage: false,
          selectAllRowsItem: false,
          selectAllRowsItemText: "Todas",
        }}
        noDataComponent={<CustomNoDataComponent />}
        subHeader
        subHeaderComponent={
          <div
            className="filterbari"
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyItems: "self-start",
              maxWidth: "auto",
              marginLeft: "-2rem",
            }}
          >
            <input
              type="text"
              className="custom-input-form"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
        subHeaderAlign="left"
      />
    </div>
  );
}
