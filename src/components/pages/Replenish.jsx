import React, { useEffect, useState } from "react";
import { API_URL } from "../../auth/constants";
import { Toaster, toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";

export const Replenish = () => {
  const { productId, pCost, pStock, pName } = useParams();

  const [stock, setStock] = useState(null);
  const [cost, setCost] = useState(null);

  const goTo = useNavigate();

  function handleCancel(e) {
    e.preventDefault();
    goTo("/catalogo");
  }

  useEffect(() => {
    setStock(pStock);
    setCost(pCost);
  }, [pStock, pCost]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const numericCost = parseFloat(cost);
      const numericStock = parseInt(stock, 10);
      const response = await fetch(
        `${API_URL}/products/${productId}/replenish`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
          body: JSON.stringify({
            stock: numericStock,
            cost: numericCost,
          }),
        }
      );

      if (response.ok) {
        console.log("Replenish register successfully");
        const json = await response.json();
        toast.success(json.message);
        setStock("");
        setCost("");
        goTo("/catalogo");
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
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Toaster position="top-center" richColors />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1 className="m-0 App-header focus-in-contract alphi-1">
                  Reponer {pName}
                </h1>
              </div>
            </div>
            {/* /.row */}
          </div>
        </div>
        <section className="content">
          <div className="content-wrapper" style={{ marginTop: "1rem" }}>
            <div className="container-fluid ctry">
              <div className="register-box">
                <div className="card">
                  <div
                    className="card-body register-card-body"
                    style={{
                      borderRadius: "0.6rem",
                      background: "cadetblue",
                    }}
                  >
                    <form action="/" method="post" onSubmit={handleSubmit}>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend bg-light bg-xsm">
                          <span className="input-group-text text-xs">Und.</span>
                        </div>
                        <input
                          type="text"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          className="form-control form-control-sm"
                          placeholder="stock"
                          name="stock"
                          autoComplete="off"
                        />
                        <div className="input-group-append bg-sm">
                          <div className="input-group-text ">
                            <span className="fas fa-boxes text-white text-sm" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend bg-light bg-sm">
                          <span className="input-group-text">
                            <i className="fas fa-dollar-sign"></i>
                          </span>
                        </div>
                        <input
                          value={cost}
                          onChange={(e) => setCost(e.target.value)}
                          className="form-control form-control-sm"
                          placeholder="costo"
                          name="cost"
                          autoComplete="off"
                        />
                        <div className="input-group-append bg-sm">
                          <div className="input-group-text">
                            <span className="fas fa-hand-holding-usd text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="row ctry">
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
                      </div>
                    </form>
                  </div>
                  {/* /.form-box */}
                </div>
                {/* /.card */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
