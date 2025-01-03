import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../auth/constants";
import { Toaster, toast } from "sonner";
import { UploadImage } from "./UploadImage";
import { Tooltip } from "react-tooltip";
import { useAuth } from "../../auth/AuthProvider";

const userData = JSON.parse(localStorage.getItem("userInfo"));
const token = JSON.parse(localStorage.getItem("token"));

export const CreatePayment = () => {
  const editPayment = JSON.parse(localStorage.getItem("editPayment"));
  const [total, setTotal] = useState(editPayment.total);
  const [status, setStatus] = useState(editPayment.status);
  const [active, setActive] = useState(editPayment.active);
  const [banks, setBanks] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [paymentType, setPaymentType] = useState(editPayment.paymentType);
  const [paymentCash, setPaymentCash] = useState("");
  const [paymentChange, setPaymentChange] = useState(
    editPayment.paymentChange > 0 ? editPayment.paymentChange : ""
  );
  const [paymented, setPaymented] = useState(editPayment.paymented);
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");
  const imageUrl = JSON.parse(localStorage.getItem("urlImage"));

  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isSeller =
    auth.isAuthenticated && userObject && userObject.role === "SELLER";

  const isTrans = editPayment.paymentType === "TRANSFERENCIA";
  const goTo = useNavigate();

  const fetchDataAsync = async () => {
    try {
      const response = await fetch(`${API_URL}/banks`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
          mode: "no-cors",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const apiData = await response.json();
      setBanks(apiData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataAsync();
    setIsButtonDisabled(!imageUrl);
  }, [imageUrl]);

  const calculatePaymentChange = (cashValue) => {
    const numericCash = isTrans ? 0 : parseFloat(cashValue);
    const numericTotal = parseFloat(total);

    // Calcular el cambio
    const calculatedChange =
      numericCash - (numericTotal + (isSeller ? 0 : 1000));

    // Actualizar el estado de paymentChange
    setPaymentChange(isNaN(calculatedChange) ? 0 : calculatedChange);
  };

  function handleCancel(e) {
    e.preventDefault();
    if (imageUrl) localStorage.removeItem("urlImage");
    goTo("/pedidos");
    localStorage.removeItem("editPayment");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const numericCash = isTrans ? 0 : parseFloat(paymentCash);
      const numericChange = isTrans ? 0 : parseFloat(paymentChange);

      const response = await fetch(`${API_URL}/purchases/${editPayment.id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({
          total,
          status,
          active,
          paymentCash: numericCash,
          paymented: true,
          paymentType: paymentType,
          paymentImage: imageUrl,
        }),
      });

      if (response.ok) {
        console.log("User register successfully");
        userData.points = Number(userData.points) + Math.ceil(total / 6000);
        localStorage.setItem("userInfo", JSON.stringify(userData));
        const json = await response.json();
        setSuccessResponse(json.message);
        toast.success(json.message);
        setErrorResponse(null);
        setTotal("");
        setStatus("");
        setActive("");
        setPaymentType("");
        setPaymentCash("");
        setPaymentChange("");
        setPaymented("");
        localStorage.removeItem("urlImage");
        localStorage.removeItem("editPayment");
        goTo("/pedidos");
        window.location.reload();
      } else {
        console.log("Something went wrong");
        const json = await response.json();
        if (json.statusCode === 422) {
          toast.error("Oops, campos sin llenar.", {
            description: " Completa tu información",
          });
        } else {
          toast.error(json.message);
        }
        setErrorResponse("");
        setSuccessResponse(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Toaster position="top-center" richColors />
      {/* Content Wrapper. Contains page content */}
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1 className="m-0 App-header focus-in-contract alphi-4">
                  Pagos
                </h1>
              </div>
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}
        <section className="content">
          <div className="content-wrapper" style={{ marginTop: "1rem" }}>
            <div className="container-fluid ctry">
              <div className="register-box">
                {!!errorResponse && (
                  <div className="errorMessage">{errorResponse}</div>
                )}
                {!!successResponse && (
                  <div className="successMessage">{successResponse}</div>
                )}

                <div className="card ">
                  <div
                    className="card-body register-card-body"
                    style={{
                      borderRadius: "0.6rem",
                      background: "green",
                    }}
                  >
                    {isTrans && (
                      <div>
                        <p style={{ color: "white", fontSize: "1rem" }}>
                          Puedes hacer tu transferencia a:{" "}
                        </p>
                        <ul style={{ color: "white", fontSize: "0.8rem" }}>
                          {banks.map((bank) => {
                            return (
                              <li key={bank.id}>
                                <div className="row">
                                  CUENTA {bank.type} {bank.name} N°:{" "}
                                  <strong>{bank.account}</strong>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                        <p style={{ color: "white", fontSize: "1rem" }}>
                          y pasa la imagen
                        </p>
                        <UploadImage
                          setIsButtonDisabled={setIsButtonDisabled}
                          fromPayment={true}
                        />
                      </div>
                    )}

                    <form action="/" method="post" onSubmit={handleSubmit}>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={paymentType}
                          onChange={(e) => setPaymentType(e.target.value)}
                          className="form-control"
                          placeholder="Forma de Pago"
                          name="paymentType"
                          disabled="true"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-receipt text-white" />
                          </div>
                        </div>
                      </div>
                      {!isTrans && (
                        <div className="input-group mb-3">
                          <div className="input-group-prepend bg-light">
                            <span className="input-group-text">
                              <i className="fas fa-dollar-sign"></i>
                            </span>
                          </div>
                          <input
                            type="number"
                            value={paymentCash}
                            onChange={(e) => {
                              setPaymentCash(e.target.value);
                              calculatePaymentChange(e.target.value);
                            }}
                            className="form-control"
                            placeholder="¿Qué billetiene tienes?"
                            name="paymentCash"
                            autoComplete="off"
                          />
                          <div className="input-group-append">
                            <div className="input-group-text">
                              <Tooltip id="tt-cash" />
                              <span
                                className="fas fa-hand-holding-usd text-white"
                                data-tooltip-id="tt-cash"
                                data-tooltip-html="💵<br />Indique el monto neto en efectivo <br />con el que va a pagar"
                                data-tooltip-place="right"
                                data-tooltip-float={false}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {!isTrans && (
                        <div className="input-group mb-3">
                          <div className="input-group-prepend bg-light">
                            <span className="input-group-text">
                              <i className="fas fa-dollar-sign"></i>
                            </span>
                          </div>
                          <input
                            type="text"
                            value={paymentChange}
                            onChange={(e) => setPaymentChange(e.target.value)}
                            className="form-control"
                            placeholder="Vuelto"
                            name="paymentChange"
                            autoComplete="off"
                            disabled="true"
                          />
                          <div className="input-group-append">
                            <div className="input-group-text">
                              <span className="fas fa-money-bill-wave text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="row ctry">
                        {/* /.col */}

                        <div className="col-4">
                          <button
                            type="submit"
                            className="btn btn-outline-light btn-block btn-sm"
                          >
                            Guardar
                          </button>
                        </div>
                        <div className="col-4">
                          <button
                            className="btn btn-outline-light btn-block btn-sm"
                            onClick={handleCancel}
                          >
                            Cancelar
                          </button>
                        </div>

                        {/* /.col */}
                      </div>
                    </form>
                  </div>
                  {/* /.form-box */}
                </div>
                {/* /.card */}
              </div>
            </div>
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
    </div>
  );
};
