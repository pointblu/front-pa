import DataTable from "react-data-table-component";
import { OrderStepper } from "./OrderStepper";
import api from "../../services/api";
import { useAuth } from "../../auth/AuthProvider";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.module.css";
import { format } from "date-fns";
import { usePrinter } from "../../hooks/usePrinter";
import { Toaster, toast } from "sonner";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";

registerLocale("es", es);
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
      `$ ${isSeller ? row.total.toFixed(0) : (row.total + 1000).toFixed(0)}`,
    minWidth: "100px",
  },
  {
    name: "DOMICILIARIO",
    selector: (row) => row.deliveryPerson?.name ?? "-",
    minWidth: "120px",
    omit: !isAdmin,
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
  const { isAdmin, isSeller, data, onRefresh } = props;
  const { printOrder } = usePrinter();
  const [deliveryUsers, setDeliveryUsers] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(data.deliveryPersonId ?? "");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      api.get("/Purchases/delivery/users")
        .then(({ data: users }) => setDeliveryUsers(users))
        .catch(() => {});
    }
  }, [isAdmin]);

  const handleAssignDelivery = async () => {
    if (!selectedDelivery) return;
    setAssigning(true);
    try {
      await api.post(`/Purchases/${data.id}/assign-delivery`, {
        deliveryPersonId: selectedDelivery,
      });
      toast.success("Domiciliario asignado");
      if (onRefresh) onRefresh();
    } catch {
      toast.error("Error al asignar domiciliario");
    } finally {
      setAssigning(false);
    }
  };

  const handlePrintPos = async () => {
    try {
      await printOrder(data, isSeller);
      toast.success("Impresión exitosa");
    } catch (error) {
      console.error("Error durante la impresión:", error);
      toast.error("Error al imprimir", {
        description: error?.message ?? "Consulta la consola para más detalles.",
      });
    }
  };

  return (
    <div>
      <OrderStepper status={data.status} />
      <div className="row">
      <div className="section col-md-6">
        {(isAdmin || isSeller) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
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

            {isAdmin && deliveryUsers.length > 0 && (
              <>
                <select
                  className="form-control form-control-sm custom-input-form"
                  style={{ maxWidth: "180px" }}
                  value={selectedDelivery}
                  onChange={(e) => setSelectedDelivery(e.target.value)}
                  aria-label="Seleccionar domiciliario"
                >
                  <option value="">-- Domiciliario --</option>
                  {deliveryUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <button
                  className="iconise-button"
                  onClick={handleAssignDelivery}
                  disabled={assigning || !selectedDelivery}
                  title="Asignar domiciliario"
                >
                  <i className="fas fa-motorcycle nav-icon" />
                </button>
              </>
            )}
          </div>
        )}
        <pre style={{ maxWidth: "250px" }}>
          <header className="text-center">
            <img
              src="https://res.cloudinary.com/diitm4dx7/image/upload/v1737845955/logo_punto_azul_ah2ksi.png"
              alt="logo"
              style={{ width: "140px", filter: "grayscale(100%)" }}
            />
            <h3 className="company-name">P &amp; R MONSALVE</h3>
            <p>El Manantial, Soledad-AT</p>
            <p>TEL: 322 9560143</p>
            <p className="bill">¡Bienvenido!</p>
          </header>

          <div className="main-body separator">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <colgroup>
                <col style={{ width: "40%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "24%" }} />
                <col style={{ width: "24%" }} />
              </colgroup>
              <thead>
                <tr>
                  <td><strong>Prod.</strong></td>
                  <td style={{ textAlign: "center" }}><strong>Cant.</strong></td>
                  <td style={{ textAlign: "right" }}><strong>P/unid.</strong></td>
                  <td style={{ textAlign: "right" }}><strong>Sub-tot.</strong></td>
                </tr>
              </thead>
              <tbody>
                {data.prDetail
                  .filter((p) => p.product.name !== "DOMICILIO")
                  .map((purchase) => (
                    <tr key={purchase.id}>
                      <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                        {purchase.product.name}
                      </td>
                      <td style={{ textAlign: "center" }}>{purchase.quantity}</td>
                      <td style={{ textAlign: "right" }}>
                        ${purchase.active ? purchase.product.price.toFixed(0) : "0"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        ${purchase.active ? purchase.subtotal.toFixed(0) : "0"}
                      </td>
                    </tr>
                  ))}

                <tr className="dark-background sub-total">
                  <td className="pad-l-5" colSpan={2}><strong>SUB TOTAL</strong></td>
                  <td colSpan={2} className="text-right">
                    <strong>${data.total.toFixed(0)}</strong>
                  </td>
                </tr>

                <tr>
                  <td>Domicilio</td>
                  <td style={{ textAlign: "center" }}>1</td>
                  <td style={{ textAlign: "right" }}>{isSeller ? "$0" : "$1000"}</td>
                  <td style={{ textAlign: "right" }}>{isSeller ? "$0" : "$1000"}</td>
                </tr>

                <tr className="total">
                  <td colSpan={2}><strong>TOTAL A PAGAR</strong></td>
                  <td colSpan={2} className="info-total-price text-right">
                    <strong>
                      ${isSeller ? data.total.toFixed(0) : (data.total + 1000).toFixed(0)}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <footer className="info-client">
            <div className="info-table-client border-bottom">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ width: "55px", verticalAlign: "top" }}>Cliente:</td>
                    <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                      <strong>{data.buyer.name}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "55px", verticalAlign: "top" }}>Direccion:</td>
                    <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                      <strong>{data.buyer.address}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "55px" }}>Telefono:</td>
                    <td><strong>{data.buyer.phone}</strong></td>
                  </tr>
                  <tr>
                    <td style={{ width: "55px", verticalAlign: "top" }}>NOTA:</td>
                    <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                      <strong>{data.note || "-"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "55px" }}>Fecha:</td>
                    <td>
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
  const [refreshKey, setRefreshKey] = useState(0);
  const userData = JSON.parse(localStorage.getItem("userInfo"));
  useEffect(() => {
    if (!isAdmin && !isSeller && !userData?.id) return;

    let cancelled = false;

    const fetchDataAsync = async () => {
      try {
        const { data: apiData } = await api.get(
          `/purchases?status=${statum}&buyerId=${
            isAdmin || isSeller ? "" : userData.id
          }&startDate=${
            startDate ? format(startDate, "yyyy-MM-dd") : ""
          }&endDate=${endDate ? format(endDate, "yyyy-MM-dd") : ""}`
        );
        if (!cancelled) setDatum(apiData);
      } catch (_) {}
    };

    fetchDataAsync();
    const intervalId = setInterval(fetchDataAsync, 30000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [statum, startDate, endDate, isAdmin, isSeller, refreshKey]);

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
      await api.put(`/purchases/${id}`, { total, status, paymentType });
      if (status === "CANCELED") {
        const posible = Number(userData.points) - Math.ceil(total / 6000);
        userData.points = posible < 0 ? 0 : posible;
        localStorage.setItem("userInfo", JSON.stringify(userData));
        window.location.reload();
      }
      toast.success("Estado actualizado", { duration: 3000 });
      setRefreshKey((k) => k + 1);
    } catch (_) {}
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
            onRefresh={() => setRefreshKey((k) => k + 1)}
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
