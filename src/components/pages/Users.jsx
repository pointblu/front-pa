import DataTable from "react-data-table-component";
import { users } from "../../mocks/users";

const columns = [
  { name: "NOMBRE", selector: (row) => row.name },
  { name: "CORREO-E", selector: (row) => row.email },
  { name: "CELULAR", selector: (row) => row.mobile },
  { name: "DIRECCIÓN", selector: (row) => row.address },
];

export function Users() {
  return (
    <div>
      <DataTable
        columns={columns}
        data={users}
        pagination
        paginationComponentOptions={{
          rowsPerPageText: "Registros por página:",
          rangeSeparatorText: "de",
          noRowsPerPage: false,
          selectAllRowsItem: false,
          selectAllRowsItemText: "Todas",
        }}
      />
    </div>
  );
}
