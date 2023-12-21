import DataTable from "react-data-table-component";
import { API_URL } from "../../auth/constants";
import { fetchData } from "../../fetchData/fetchData";

const apiData = fetchData(`${API_URL}/purchases`);

const columns = [
  { name: "CLIENTE", selector: (row) => row.buyer.name },
  { name: "TOTAL", selector: (row) => `$ ${row.total.toFixed(2)}` },
  { name: "ESTADO", selector: (row) => row.status },
];

const ExpandedComponent = ({ data }) => {
  return (
    <div className="section">
      <pre>
        <header className="text-center">
          <h3 className="company-name">PANADERIA PUNTO AZUL</h3>
          <p> El Manantial, Soledad-AT </p>
          <p>TEL: 310 555 5555</p>
          <p className="bill">¡Bienvenido!</p>
        </header>
        <div className="main-body separator">
          <div className="info-item-list">
            <table className="table1" style={{ width: "100%" }}>
              <tr>
                <td>
                  <strong>Prod.</strong>
                </td>
                <td className="text-right">
                  <strong>Cant.</strong>
                </td>
                <td className="text-right">
                  <strong>P. unid.</strong>
                </td>
                <td className="text-right">
                  <strong>Sub-tot.</strong>
                </td>
              </tr>
              {data.prDetail.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.product.name}</td>
                  <td className="text-right">{purchase.quantity}</td>
                  <td className="text-right">
                    $ {purchase.product.price.toFixed(2)}
                  </td>
                  <td className="text-right">
                    $ {purchase.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="dark-background sub-total">
                <td className="pad-l-5">SUB TOTAL</td>
                <td className="text-right " colSpan={3}>
                  $ {data.total.toFixed(2)}
                </td>
              </tr>
              <tr className="total">
                <td>TOTAL A PAGAR</td>
                <td></td>
                <td></td>
                <td className="info-total-price text-right">
                  $ {data.total.toFixed(2)}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <footer className="info-client">
          <div className="info-table-client border-bottom">
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Cliente: </td>
                  <td className="text-right">
                    <strong>{data.buyer.name}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Dirección: </td>
                  <td
                    className="text-right"
                    style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    <strong>{data.buyer.address}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Teléfono: </td>
                  <td className="text-right">
                    <strong>{data.buyer.phone}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Fecha: </td>
                  <td className="text-right">27/10/2020</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="info-graditude-text text-center border-bottom">
            <h1>!Gracias por su compra!</h1>
          </div>
        </footer>
      </pre>
    </div>
  );
};

export function Pedido() {
  const datum = apiData.read();
  return (
    <div>
      <DataTable
        columns={columns}
        data={datum.data}
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
