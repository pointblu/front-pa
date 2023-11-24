import DataTable from "react-data-table-component";
import { purchaseDetails } from "../../mocks/purchaseDetails";

const columns = [
  { name: "CATEGORÍA", selector: (row) => row.product.category },
  { name: "PRODUCTO", selector: (row) => row.product.name },
  { name: "FECHA", selector: (row) => row.createdAt },
  { name: "COSTO", selector: (row) => `$ ${row.unitCost.toFixed(2)}` },
  { name: "PRECIO", selector: (row) => `$ ${row.unitPrice.toFixed(2)}` },
  { name: "CANTIDAD", selector: (row) => row.qty },
  { name: "TOTAL", selector: (row) => `$ ${row.subTotal.toFixed(2)}` },
  {
    name: "UTILIDAD",
    selector: (row) =>
      `${(((row.unitPrice - row.unitCost) / row.unitPrice) * 100).toFixed(
        2
      )} %`,
  },
];

export function PurchaseDetails() {
  return (
    <div>
      <DataTable
        columns={columns}
        data={purchaseDetails}
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
