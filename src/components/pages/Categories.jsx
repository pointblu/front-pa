import DataTable from "react-data-table-component";

const columns = [
  { name: "NOMBRE", selector: (row) => row.name },
  { name: "DESCRIPCIÓN", selector: (row) => row.description },
];

export function Categories() {
  const datum = JSON.parse(localStorage.getItem("categorias"));
  return (
    <div>
      <DataTable
        name="datTab"
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
    </div>
  );
}
