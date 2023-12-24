import { Suspense } from "react";
import DataTable from "react-data-table-component";
import { API_URL } from "../../auth/constants";
import { fetchData } from "../../fetchData/fetchData";

const apiData = fetchData(`${API_URL}/users`);
const columns = [
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
];
const CustomNoDataComponent = () => (
  <div className="text-center">¡No hay registros para mostrar!</div>
);
export function Users() {
  const datum = apiData.read();
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable
          columns={columns}
          data={datum.data}
          pagination
          paginationComponentOptions={{
            rowsPerPageText: "Registros por página:",
            rangeSeparatorText: "de",
            noRowsPerPage: false,
            selectAllRowsItem: false,
            selectAllRowsItemText: "Todas",
          }}
          noDataComponent={<CustomNoDataComponent />}
        />
      </Suspense>
    </div>
  );
}
