import DataTable from "react-data-table-component";
import { API_URL } from "../../auth/constants";
import { fetchData } from "../../fetchData/fetchData";

const apiData = fetchData(`${API_URL}/purchaseDetails`);
const columns = [
  {
    name: "FECHA",
    selector: (row) => (
      <div
        style={{
          maxHeight: "200px",
          overflow: "hidden",
          whiteSpace: "wrap",
          textOverflow: "unset",
        }}
      >
        {Intl.DateTimeFormat("es-ES", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }).format(new Date(row.createdAt))}
      </div>
    ),
  },
  {
    name: "CATEGORÍA",
    selector: (row) => row.product.category.name,
    minWidth: "120px",
  },
  { name: "PRODUCTO", selector: (row) => row.product.name, minWidth: "160px" },
  {
    name: "COSTO UNIT.",
    selector: (row) => `$ ${row.product.cost}`,
    minWidth: "120px",
  },
  {
    name: "PRECIO UNIT.",
    selector: (row) => `$ ${row.product.price}`,
    minWidth: "120px",
  },
  { name: "CANTIDAD", selector: (row) => row.quantity },
  {
    name: "COSTO TOTAL",
    selector: (row) => `$ ${row.cost}`,
    minWidth: "120px",
  },
  { name: "TOTAL", selector: (row) => `$ ${row.subtotal}`, minWidth: "120px" },
  {
    name: "UTILIDAD",
    selector: (row) =>
      `$ ${((row.product.price - row.product.cost) * row.quantity).toFixed(2)}`,
  },
  {
    name: "MARGEN",
    selector: (row) =>
      `${(
        ((row.product.price - row.product.cost) / row.product.price) *
        100
      ).toFixed(2)} %`,
  },
];

export function PurchaseDetails() {
  const purchaseDetails = apiData.read();
  return (
    <div>
      <DataTable
        columns={columns}
        data={purchaseDetails.data}
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
