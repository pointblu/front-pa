import DataTable from "react-data-table-component";
import { API_URL } from "../../auth/constants";
import { useAuth } from "../../auth/AuthProvider";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.module.css";
import { format } from "date-fns";
import ConectorPluginV3 from "../../pos-print/ConectorJavaScriptB";

registerLocale("es", es);
const token = JSON.parse(localStorage.getItem("token"));

const columns = (isAdmin, handleUpdateStatus) => [
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
          <button
            className="ican-button act-rut"
            onClick={() => handleUpdateStatus("ROUTED", row.id, row.total)}
          >
            <i className="fas fa-shipping-fast nav-icon" />
          </button>
        ) : null}
        {row.status === "ROUTED" ? (
          <button
            className="ican-button act-chk"
            onClick={() => handleUpdateStatus("DELIVERED", row.id, row.total)}
          >
            <i className="fas fa-check nav-icon" />
          </button>
        ) : null}
        {row.status === "REQUESTED" ? (
          <button
            className="ican-button act-ccl"
            onClick={() => handleUpdateStatus("CANCELED", row.id, row.total)}
          >
            <i className="fas fa-times nav-icon" />
          </button>
        ) : null}
      </div>
    ),
  },
];

const ExpandedComponent = ({ data }) => {
  const handlePrintPos = async () => {
    const conector = new ConectorPluginV3();
    const respuesta = await conector
      .Iniciar()
      .DeshabilitarElModoDeCaracteresChinos()
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
      .Feed(1)
      .EscribirTexto("PANADERIA PUNTO AZUL\n")
      .EscribirTexto("El Manantial, Soledad-AT\n")
      .TextoSegunPaginaDeCodigos(2, "cp850", "Teléfono: 322 9560143\n")
      .EscribirTexto(
        "Fecha y hora: " + new Intl.DateTimeFormat("es-MX").format(new Date())
      )
      .Feed(1);
    data.prDetail.forEach((purchase) => {
      conector
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
        .EscribirTexto(`____________________\n`)
        .EscribirTexto(`${purchase.quantity} ${purchase.product.name}\n`)
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
        .EscribirTexto(`$${purchase.subtotal.toFixed(1)}\n`);
    }); // Continuar con las operaciones comunes
    conector
      .EscribirTexto("____________________\n")
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
      .EscribirTexto(`Domicilio: \n`)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
      .EscribirTexto(`$ 1000.0 \n`)
      .EscribirTexto(`TOTAL: $${data.total.toFixed(1) + 1000} \n`)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
      .EscribirTexto("____________________\n")
      .EstablecerEnfatizado(true)
      .EstablecerTamañoFuente(1, 1)
      .TextoSegunPaginaDeCodigos(2, "cp850", "¡Gracias por su compra!\n")
      .Feed(1)
      .EscribirTexto("____________________\n")
      .Feed(1)
      .EstablecerTamañoFuente(1, 1)
      .EscribirTexto("DATOS DE ENVIO\n")
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
      .EscribirTexto(`Cliente: \n`)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
      .TextoSegunPaginaDeCodigos(2, "cp850", `${data.buyer.name} \n`)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
      .TextoSegunPaginaDeCodigos(2, "cp850", `Dirección: \n`)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
      .TextoSegunPaginaDeCodigos(2, "cp850", `${data.buyer.address} \n`)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
      .TextoSegunPaginaDeCodigos(2, "cp850", `Teléfono: \n`)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
      .EscribirTexto(`${data.buyer.phone} \n`)
      .Feed(3)
      .Corte(1)
      .Pulso(48, 60, 120)
      .imprimirEn("ZJ-58");
    if (respuesta === true) {
      console.log("Impreso correctamente");
    } else {
      console.log("Error: " + respuesta);
    }
  };

  return (
    <div className="section">
      <div>
        <button className="iconise-button" onClick={handlePrintPos}>
          <i className="fas fa-print nav-icon" />
        </button>
      </div>
      <pre>
        <header className="text-center">
          <h3 className="company-name">PANADERIA PUNTO AZUL</h3>
          <p> El Manantial, Soledad-AT </p>
          <p>TEL: 310 555 5555</p>
          <p className="bill">¡Bienvenido!</p>
        </header>
        <div className="main-body separator">
          <div className="info-item-list">
            <table className="table1" style={{ width: "95%" }}>
              <thead>
                <tr>
                  <td>
                    <strong>Prod.</strong>
                  </td>
                  <td style={{ width: "10px" }}>
                    <strong>Cant.</strong>
                  </td>
                  <td>
                    <strong>P/unid.</strong>
                  </td>
                  <td className="text-right">
                    <strong>Sub-tot.</strong>
                  </td>
                </tr>
              </thead>
              <tbody>
                {data.prDetail.map((purchase) => (
                  <tr key={purchase.id}>
                    <td
                      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                    >
                      {purchase.product.name}
                    </td>
                    <td className="text-rigth" style={{ width: "10px" }}>
                      {purchase.quantity}
                    </td>
                    <td
                      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                    >
                      ${purchase.product.price.toFixed(1)}
                    </td>
                    <td className="text-right">
                      ${purchase.subtotal.toFixed(1)}
                    </td>
                  </tr>
                ))}
                <tr className="dark-background sub-total">
                  <td className="pad-l-5">SUB TOTAL</td>
                  <td colSpan={3} className="text-right">
                    ${data.total.toFixed(1)}
                  </td>
                </tr>
                <tr className="total">
                  <td>TOTAL A PAGAR</td>
                  <td colSpan={3} className="info-total-price text-right">
                    ${data.total.toFixed(1)}
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
                  <td style={{ width: "45px" }}>Cliente: </td>
                  <td>
                    <strong>{data.buyer.name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "45px" }}>Direccion: </td>
                  <td style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                    <strong>{data.buyer.address}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "45px" }}>Telefono: </td>
                  <td>
                    <strong>{data.buyer.phone}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "45px" }}>Fecha: </td>
                  <td style={{ textAlign: "start" }}>
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
            "Access-Control-Allow-Origin": "*",
            mode: "no-cors",
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

  useEffect(() => {
    // Hacer la primera llamada
    fetchDataAsync();

    // Configurar un intervalo para llamar cada minuto
    const intervalId = setInterval(() => {
      fetchDataAsync();
    }, 30000); // 60000 milisegundos = 1 minuto

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
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

  const handleUpdateStatus = async (status, id, total) => {
    try {
      const response = await fetch(`${API_URL}/purchases/${id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "no-cors",
        },
        body: JSON.stringify({
          total: total,
          status: status,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchDataAsync();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const tableHeaderstyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "12px",
      },
    },
  };
  return (
    <div>
      <DataTable
        columns={columns(isAdmin, handleUpdateStatus)}
        data={datum.data}
        pagination
        customStyles={tableHeaderstyle}
        highlightOnHover="true"
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
        subHeader
        subHeaderComponent={
          <div>
            <div
              className="filterbar"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.5rem",
                justifyItems: "self-start",
                maxWidth: "auto",
                marginLeft: "-2rem",
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "0.6rem",
                  }}
                >
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
          </div>
        }
        subHeaderAlign="left"
      />
    </div>
  );
}
