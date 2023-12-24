import DataTable from "react-data-table-component";

const columns = [
  { name: "NOMBRE", selector: (row) => row.name, maxWidth: "120px" },
  {
    name: "DESCRIPCIÓN",
    selector: (row) => (
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "wrap",
          textOverflow: "unset",
        }}
      >
        {row.description}
      </div>
    ),
    minWidth: "400px",
  },
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
          noDataComponent: "¡No hay datos para mostrar!",
        }}
      />
    </div>
  );
}
