import DataTable from "react-data-table-component";
import { API_URL } from "../../auth/constants";
import { useAuth } from "../../auth/AuthProvider";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.module.css";
import { format } from "date-fns";
import ConectorPluginV3 from "../../pos-print/ConectorJavaScriptB";
import { Toaster, toast } from "sonner";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";

registerLocale("es", es);
const token = JSON.parse(localStorage.getItem("token"));
const columns = (
  isAdmin,
  isSeller,
  handleUpdateStatus,
  handleCreatePayment
) => [
  {
    name: "FECHA",
    selector: (row) =>
      Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(new Date(row.createdAt)),

    minWidth: "120px",
    sortable: false,
  },
  {
    name: "CLIENTE",
    selector: (row) => row.buyer.name,
    minWidth: "120px",
    sortable: false,
  },
  {
    name: "TOTAL",
    selector: (row) =>
      `$ ${isSeller ? row.total.toFixed(2) : (row.total + 1000).toFixed(2)}`,
    minWidth: "120px",
  },
  {
    name: "ESTADO",
    selector: (row) => row.status,
    cell: (row) => {
      const statusMap = {
        REQUESTED: ["En proceso", "fas fa-share nav-icon", "goldenrod"],
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
    sortable: false,
    filter: true,
  },
  {
    name: "ACCIONES",
    cell: (row) => (
      <div style={{ display: "flex", gap: "5px", flexDirection: "row" }}>
        <Tooltip id="tt-action" />
        {(isAdmin || isSeller) && row.status === "REQUESTED" ? (
          <button
            className="ican-button act-rut"
            onClick={() =>
              handleUpdateStatus("ROUTED", row.id, row.total, row.paymentType)
            }
            data-tooltip-id="tt-action"
            data-tooltip-content="Despachar"
            data-tooltip-place="left"
            data-tooltip-float={false}
            data-tooltip-class-name="custom-tooltip"
          >
            <i className="fas fa-shipping-fast nav-icon" />
          </button>
        ) : null}
        {row.status === "ROUTED" ? (
          <button
            className="ican-button act-chk"
            onClick={() =>
              handleUpdateStatus(
                "DELIVERED",
                row.id,
                row.total,
                row.paymentType
              )
            }
            data-tooltip-id="tt-action"
            data-tooltip-content="Entregado"
            data-tooltip-place="left"
            data-tooltip-float={false}
            data-tooltip-class-name="custom-tooltip"
          >
            <i className="fas fa-check nav-icon" />
          </button>
        ) : null}
        {row.status === "REQUESTED" ? (
          <button
            className="ican-button act-ccl"
            onClick={() =>
              handleUpdateStatus("CANCELED", row.id, row.total, row.paymentType)
            }
            data-tooltip-id="tt-action"
            data-tooltip-content="Cancelar"
            data-tooltip-place="top"
            data-tooltip-float={false}
            data-tooltip-class-name="custom-tooltip"
          >
            <i className="fas fa-times nav-icon" />
          </button>
        ) : null}
        {row.status === "REQUESTED" &&
        row.paymented === false &&
        (!isAdmin || !isSeller) ? (
          <Link to={`/pago`}>
            <button
              className="ican-button"
              onClick={() => handleCreatePayment(row)}
              data-tooltip-id="tt-action"
              data-tooltip-content="Pagar"
              data-tooltip-place="right"
              data-tooltip-float={false}
              data-tooltip-class-name="custom-tooltip"
            >
              <i className="fas fa-money-bill-wave nav-icon" />
            </button>
          </Link>
        ) : null}
      </div>
    ),
  },
];

const ExpandedComponent = (props) => {
  const { isAdmin, isSeller, data } = props;
  console.log("Esta es la data", data);
  const handlePrintPos = async () => {
    try {
      const conector = new ConectorPluginV3();
      const respuesta = conector
        .Iniciar()
        .DeshabilitarElModoDeCaracteresChinos()
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
        .DescargarImagenDeInternetEImprimir(
          "https://res.cloudinary.com/diitm4dx7/image/upload/v1737845955/logo_punto_azul_ah2ksi.png",
          0,
          216
        )
        .Feed(1)
        .EscribirTexto("P & R MONSALVE\n")
        .EscribirTexto("Ciudad Bonita, Soledad-AT\n")
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
          .EscribirTexto(
            `$${purchase.active ? purchase.subtotal.toFixed(1) : 0.0}\n`
          );
      }); // Continuar con las operaciones comunes
      conector
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
        .EscribirTexto(`____________________\n`)
        .EscribirTexto(`Domicilio: \n`)
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
        .EscribirTexto(`$ ${isSeller ? 0.0 : 1000.0} \n`)
        .EscribirTexto(`____________________\n`)
        .EscribirTexto(
          `TOTAL: $${
            isSeller ? data.total.toFixed(1) : (data.total + 1000).toFixed(1)
          } \n`
        )
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
        .EscribirTexto("____________________\n")
        .Feed(1)
        .EstablecerEnfatizado(true)
        .EstablecerTamañoFuente(1, 1)
        .TextoSegunPaginaDeCodigos(2, "cp850", "¡Gracias por su compra!\n")
        .Feed(1)
        .EscribirTexto(".............................\n")
        .Feed(1)
        .EstablecerTamañoFuente(1, 1)
        .EscribirTexto("DATOS DE ENVIO\n")
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
        .EscribirTexto(`Cliente: \n`)
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
        .TextoSegunPaginaDeCodigos(2, "cp850", `${data.buyer.name} \n`)
        .Feed(1)
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
        .TextoSegunPaginaDeCodigos(2, "cp850", `Dirección: \n`)
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
        .TextoSegunPaginaDeCodigos(2, "cp850", `${data.buyer.address} \n`)
        .Feed(1)
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
        .TextoSegunPaginaDeCodigos(2, "cp850", `Teléfono: \n`)
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
        .EscribirTexto(`${data.buyer.phone} \n`)
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
        .TextoSegunPaginaDeCodigos(2, "cp850", `NOTA: \n`)
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
        .EscribirTexto(`${data.note} \n`)
        .Feed(2)
        .EscribirTexto(".............................\n")
        .Feed(3)
        .Corte(1)
        .Pulso(48, 60, 120)
        .imprimirEn("ZJ-58");
      if (respuesta === true) {
        toast.success("Impersión exitosa");
      } else {
        toast.error("Oops, Error al imprimir.", {
          description:
            "Valida que este funcionando el controlador de impresión",
        });
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error("Error de red durante la impresión. Puede ser ignorado.");
        toast.error(
          "Error al imprimir. Problema de red. Consulta la consola para más detalles."
        );
      } else {
        console.error("Error durante la impresión:", error);
        toast.error(
          "Error al imprimir. Consulta la consola para más detalles."
        );
      }
    }
  };

  return (
    <div className="row">
      <div className="section col-md-6">
        {(isAdmin || isSeller) && (
          <div>
            <Tooltip id="tt-print" />
            <button
              className="iconise-button"
              onClick={handlePrintPos}
              data-tooltip-id="tt-print"
              data-tooltip-content="Imprimir"
              data-tooltip-place="bottom"
              data-tooltip-float={false}
              data-tooltip-class-name="custom-tooltip"
            >
              <i className="fas fa-print nav-icon" />
            </button>
          </div>
        )}
        <pre style={{ maxWidth: "250px" }}>
          <header className="text-center">
            <img
              src="https://res.cloudinary.com/diitm4dx7/image/upload/v1737845955/logo_punto_azul_ah2ksi.png"
              alt="logo"
              style={{ width: "180px", filter: "grayscale(100%)" }}
            />
            <h3 className="company-name">P & R MONSALVE</h3>
            <p> El Manantial, Soledad-AT </p>
            <p>TEL: 322 9560143</p>
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
                        {purchase.product.name !== "DOMICILIO"
                          ? purchase.product.name
                          : ""}
                      </td>
                      <td className="text-rigth" style={{ width: "10px" }}>
                        {purchase.product.name !== "DOMICILIO"
                          ? purchase.quantity
                          : ""}
                      </td>
                      <td
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          visibility:
                            purchase.product.name === "DOMICILIO"
                              ? "hidden"
                              : "visible",
                        }}
                      >
                        $
                        {purchase.active
                          ? purchase.product.price.toFixed(1)
                          : 0.0}
                      </td>
                      <td
                        className="text-right"
                        style={{
                          display:
                            purchase.product.name === "DOMICILIO"
                              ? "none"
                              : "block",
                        }}
                      >
                        ${purchase.active ? purchase.subtotal.toFixed(1) : 0}
                      </td>
                    </tr>
                  ))}

                  <tr className="dark-background sub-total">
                    <td className="pad-l-5">SUB TOTAL</td>
                    <td colSpan={3} className="text-right">
                      ${data.total.toFixed(1)}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                    >
                      Domicilio
                    </td>
                    <td className="text-rigth" style={{ width: "10px" }}>
                      1
                    </td>
                    <td
                      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                    >
                      {isSeller ? "$0.00" : "$1000.0"}
                    </td>
                    <td className="text-right">
                      {isSeller ? "$0.00" : "$1000.0"}
                    </td>
                  </tr>
                  <tr className="total">
                    <td>TOTAL A PAGAR</td>
                    <td colSpan={3} className="info-total-price text-right">
                      ${" "}
                      {isSeller
                        ? data.total.toFixed(1)
                        : (data.total + 1000).toFixed(1)}
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
                    <td
                      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                    >
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
                    <td style={{ width: "45px" }}>NOTA: </td>
                    <td>
                      <strong>{data.note}</strong>
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
      <div className="section col-md-6">
        <div className="pre-a" style={{ maxWidth: "450px" }}>
          <header className="text-center">
            <h3 className="company-name">
              Forma de pago: <strong>{data.paymentType}</strong>
            </h3>
          </header>
          {data.paymentType === "EFECTIVO" ? (
            <div
              className="main-body separator"
              style={{ marginTop: "0.5rem" }}
            >
              <p>
                Monto entregado:{" "}
                <strong>$ {data.paymentCash.toFixed(1)}</strong>
              </p>
              <p>
                Vuelto:{" "}
                <strong>
                  ${" "}
                  {isSeller
                    ? (data.paymentCash - data.total).toFixed(1)
                    : data.paymentCash - data.total - 1000}
                </strong>
              </p>
            </div>
          ) : (
            <div
              className="main-body separator"
              style={{ marginTop: "0.5rem" }}
            >
              {data.paymented === false ? (
                <div className="no-pago">NO PAGADO</div>
              ) : (
                <div className="pago">PAGADO</div>
              )}
              <img src={data.paymentImage} alt={data.paymentType} />
            </div>
          )}
          <footer
            className="info-client"
            style={{ marginTop: "0.5rem" }}
          ></footer>
        </div>
      </div>
    </div>
  );
};

const dataFilter = [
  { id: 1, value: "", name: "Todos" },
  { id: 2, value: "REQUESTED", name: "En proceso" },
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

  const isSeller =
    auth.isAuthenticated && userObject && userObject.role === "SELLER";
  const [datum, setDatum] = useState([]);
  const [statum, setStatum] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userInfo"));
  const fetchDataAsync = async () => {
    try {
      const response = await fetch(
        `${API_URL}/purchases?status=${statum}&buyerId=${
          isAdmin ? "" : userData.id
        }&startDate=${
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

  const handleUpdateStatus = async (status, id, total, paymentType) => {
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
          paymentType: paymentType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (status === "CANCELED") {
        const posible = Number(userData.points) - Math.ceil(total / 6000);
        userData.points = posible < 0 ? 0 : posible;

        localStorage.setItem("userInfo", JSON.stringify(userData));
        window.location.reload();
      }
      toast.success("Se estan actualizando los cambios", {
        duration: 10000,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function handleCreatePayment(payment) {
    localStorage.setItem("editPayment", JSON.stringify(payment));
  }
  const tableHeaderstyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "12px",
      },
    },
  };
  const sortedData = datum?.data
    ? datum.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];
  return (
    <div>
      <Toaster position="top-center" richColors closeButton="true" />
      <DataTable
        columns={columns(
          isAdmin,
          isSeller,
          handleUpdateStatus,
          handleCreatePayment
        )}
        data={sortedData}
        pagination
        customStyles={tableHeaderstyle}
        highlightOnHover="true"
        expandableRows
        expandableRowsComponent={(datum) => (
          <ExpandedComponent
            isAdmin={isAdmin}
            isSeller={isSeller}
            data={datum.data}
          />
        )}
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
                    placeholderText="Interválo de fechas"
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    className="custom-input-form"
                  />
                  <Tooltip id="tt-clean" />
                  <button
                    className="iconise-button"
                    onClick={handleClearDate}
                    data-tooltip-id="tt-clean"
                    data-tooltip-content="Limpiar intervalo"
                    data-tooltip-place="right"
                    data-tooltip-float={false}
                  >
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
