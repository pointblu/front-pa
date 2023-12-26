import DataTable from "react-data-table-component";
import { API_URL } from "../../auth/constants";
import { useAuth } from "../../auth/AuthProvider";
import { useEffect, useState, useRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.module.css";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";

registerLocale("es", es);
const token = JSON.parse(localStorage.getItem("token"));

const columns = (isAdmin) => [
  {
    name: "CLIENTE",
    selector: (row) => row.buyer.name,
    minWidth: "120px",
    sortable: true,
  },
  {
    name: "TOTAL",
    selector: (row) => `$ ${row.total.toFixed(2)}`,
    minWidth: "120px",
  },
  {
    name: "ESTADO",
    selector: (row) => row.status,
    cell: (row) => {
      const statusMap = {
        REQUESTED: ["Enviado", "fas fa-share nav-icon", "goldenrod"],
        ROUTED: ["En ruta", "fas fa-shipping-fast nav-icon", "cadetblue"],
        DELIVERED: ["Entregado", "fas fa-check nav-icon", "green"],
        CANCELED: ["Cancelado", "fas fa-times nav-icon", "red"],
      };

      const estadoTexto = statusMap[row.status] || "Desconocido";

      return (
        <div
          style={{
            display: "flex",
            gap: "2px",
            flexDirection: "row",
            color: estadoTexto[2],
          }}
        >
          <i className={estadoTexto[1]} />
          <p style={{ lineHeight: "1", fontSize: "0.7rem" }}>
            <strong>{estadoTexto[0]}</strong>
          </p>
        </div>
      );
    },
    minWidth: "110px",
    sortable: true,
    filter: true,
  },
  {
    name: "ACCIONES",
    cell: (row) => (
      <div style={{ display: "flex", gap: "5px", flexDirection: "row" }}>
        {isAdmin && row.status === "REQUESTED" ? (
          <button className="ican-button act-rut">
            <i className="fas fa-shipping-fast nav-icon" />
          </button>
        ) : null}
        {row.status === "ROUTED" ? (
          <button className="ican-button act-chk">
            <i className="fas fa-check nav-icon" />
          </button>
        ) : null}
        {row.status === "REQUESTED" ? (
          <button className="ican-button act-ccl">
            <i className="fas fa-times nav-icon" />
          </button>
        ) : null}
      </div>
    ),
  },
];

const ExpandedComponent = ({ data }) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  return (
    <div ref={printRef} className="section">
      <pre>
        <div>
          <button className="iconise-button" onClick={handlePrint}>
            <i className="fas fa-print nav-icon" />
          </button>
        </div>
        <header className="text-center">
          <h3 className="company-name">PANADERIA PUNTO AZUL</h3>
          <p> El Manantial, Soledad-AT </p>
          <p>TEL: 310 555 5555</p>
          <p className="bill">¡Bienvenido!</p>
        </header>
        <div className="main-body separator">
          <div className="info-item-list">
            <table className="table1" style={{ width: "100%" }}>
              <thead>
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
              </thead>
              <tbody>
                {data.prDetail.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>{purchase.product.name}</td>
                    <td className="text-center">{purchase.quantity}</td>
                    <td className="text-right">
                      ${purchase.product.price.toFixed(2)}
                    </td>
                    <td className="text-right">
                      ${purchase.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="dark-background sub-total">
                  <td className="pad-l-5">SUB TOTAL</td>
                  <td className="text-right " colSpan={3}>
                    ${data.total.toFixed(2)}
                  </td>
                </tr>
                <tr className="total">
                  <td>TOTAL A PAGAR</td>
                  <td></td>
                  <td></td>
                  <td className="info-total-price text-right">
                    ${data.total.toFixed(2)}
                  </td>
                </tr>
              </tbody>
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
                  <td className="text-right">
                    {Intl.DateTimeFormat("es-ES", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }).format(new Date(data.createdAt))}
                  </td>
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

const dataFilter = [
  { id: 1, value: "", name: "Todos" },
  { id: 2, value: "REQUESTED", name: "Enviado" },
  { id: 3, value: "ROUTED", name: "En ruta" },
  { id: 4, value: "DELIVERED", name: "Entregado" },
  { id: 5, value: "CANCELED", name: "Cancelado" },
];

const CustomNoDataComponent = () => (
  <div className="text-center">¡No hay registros para mostrar!</div>
);
export function Pedido() {
  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isAdmin =
    auth.isAuthenticated && userObject && userObject.role === "ADMIN";
  const [datum, setDatum] = useState([]);
  const [statum, setStatum] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const response = await fetch(
          `${API_URL}/purchases?status=${statum}&startDate=${
            startDate ? format(startDate, "yyyy-MM-dd") : ""
          }&endDate=${endDate ? format(endDate, "yyyy-MM-dd") : ""}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const apiData = await response.json();
        setDatum(apiData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataAsync();
  }, [statum, startDate, endDate]);

  const handleChangeStatus = (event) => {
    setStatum(event.target.value);
  };

  const handleChangeDate = (date) => {
    setStartDate(date[0]);
    setEndDate(date[1]);
  };

  const handleClearDate = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div>
      <div
        className="filterbar"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          justifyItems: "self-start",
        }}
      >
        <div>
          <select
            onChange={handleChangeStatus}
            className="form-control form-control-sm custom-form custom-input-form"
          >
            {dataFilter.map((stat) => {
              return (
                <option key={stat.id} value={stat.value}>
                  {stat.name.toUpperCase()}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "row", gap: "0.6rem" }}>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={handleChangeDate}
              locale="es"
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccione un interválo"
              onKeyDown={(e) => {
                e.preventDefault();
              }}
              className="custom-input-form"
            />
            <button className="iconise-button" onClick={handleClearDate}>
              <i className="fas fa-eraser nav-icon" />
            </button>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns(isAdmin)}
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
        noDataComponent={<CustomNoDataComponent />}
      />
    </div>
  );
}
