import { Suspense } from "react";
import DataTable from "react-data-table-component";
import { API_URL } from "../../auth/constants";
import { fetchData } from "../../fetchData/fetchData";

const apiData = fetchData(`${API_URL}/users`);
const columns = [
  { name: "NOMBRE", selector: (row) => row.name },
  { name: "CORREO-E", selector: (row) => row.email },
  { name: "CELULAR", selector: (row) => row.phone },
  { name: "DIRECCIÓN", selector: (row) => row.address },
];

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
        />
      </Suspense>
    </div>
  );
}
