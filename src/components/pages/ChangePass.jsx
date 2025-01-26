import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../auth/constants";
import { Toaster, toast } from "sonner";
import { useAuth } from "../../auth/AuthProvider";

export const ChangePass = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const auth = useAuth();
  const [newPass, setNewPass] = useState("");
  const userObject = JSON.parse(auth.getUser() || "{}");
  const [successResponse, setSuccessResponse] = useState("");
  const [errorResponse, setErrorResponse] = useState("");

  const goTo = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/users/${userObject.id}/change-pass`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPass,
          }),
        }
      );
      if (response.ok) {
        console.log("Login successfully");
        const json = await response.json();
        console.log(json);
        toast.success("Celular/Contraseña actualizada!", {
          description:
            "En el siguiente inicio de sesión usa tu nueva contraseña",
        });

        setSuccessResponse("");
        setErrorResponse(null);
        setNewPass("");
        setTimeout(() => {
          goTo("/");
        }, 3000);
      } else {
        console.log("Something went wrong");
        await response.json();
        toast.error("Oops, algo salio mal.", {
          description:
            "Verifica tu celular/contraseña actual e inténtalo nuevamente",
        });
        setErrorResponse();
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
                <h1
                  className="m-0 App-header focus-in-contract alphi-2"
                  style={{ backgroundColor: "#17a2b8" }}
                >
                  Actualizar celular
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
          <div className="video-wrapper">
            <video playsInline autoPlay muted loop poster="">
              <source
                src={process.env.PUBLIC_URL + "/dist/img/panaderia.mp4"}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="container-fluid ctry video-header">
              <div className="register-box">
                <div className="register-logo">
                  <Link to="/">
                    <img
                      src={
                        process.env.PUBLIC_URL + "/dist/img/logo_punto_azul.png"
                      }
                      alt="Monsalve Logo"
                      className="brand-image-xl img-circle elevation-3"
                      style={{ opacity: ".8", maxHeight: "140px" }}
                    />
                  </Link>
                </div>
                {!!errorResponse && (
                  <div className="errorMessage">{errorResponse}</div>
                )}
                {!!successResponse && (
                  <div className="successMessage">{successResponse}</div>
                )}
                <div className="card">
                  <div
                    className="card-body register-card-body"
                    style={{ borderRadius: "100px" }}
                  >
                    <form action="/" method="post" onSubmit={handleSubmit}>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          className="form-control"
                          placeholder="nuevo celular"
                          name="newPass"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-mobile" />
                          </div>
                        </div>
                      </div>
                      <div className="row ctry">
                        {/* /.col */}
                        <div className="col-4">
                          <button
                            type="submit"
                            className="btn btn-primary btn-block btn-xs"
                          >
                            Listo!
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
