import DataTable from "react-data-table-component";
import { purchases } from "../../mocks/purchases";

const columns = [
  { name: "CLIENTE", selector: (row) => row.user.name },
  { name: "TOTAL", selector: (row) => `$ ${row.total.toFixed(2)}` },
  { name: "ESTADO", selector: (row) => row.status },
];

const ExpandedComponent = ({ data }) => {
  return (
    <div className="section">
      <pre>
        {data.purchaseDetails.map((purchase) => (
          <li key={purchase.id}>
            {purchase.qty} {purchase.productId} por ${" "}
            {purchase.subTotal.toFixed(2)}
          </li>
        ))}
        <p>{data.user.address}</p>
      </pre>
    </div>
  );
};

export function Pedido() {
  return (
    <div>
      <DataTable
        columns={columns}
        data={purchases}
        pagination
        expandableRows
        expandableRowsComponent={ExpandedComponent}
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
