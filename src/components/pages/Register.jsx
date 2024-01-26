import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { API_URL } from "../../auth/constants";
import { Toaster, toast } from "sonner";

export const Register = () => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");

  const auth = useAuth();
  const goTo = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          userName,
          email,
          phone,
          address,
        }),
      });
      if (response.ok) {
        console.log("User register successfully");
        const json = await response.json();
        setSuccessResponse(json.message);
        toast.success(json.message);
        setErrorResponse(null);
        // Limpiar los campos del formulario
        setName(""); // Agrega estas líneas
        setUserName(""); // Agrega estas líneas
        setEmail(""); // Agrega estas líneas
        setPhone(""); // Agrega estas líneas
        setAddress(""); // Agrega estas líneas
        //Redirigir al login
        setTimeout(() => {
          goTo("/ingreso");
        }, 3000);
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
        setErrorResponse();
        setSuccessResponse(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (auth.isAuthenticated) {
    setTimeout(() => {
      return <Navigate to="/" />;
    }, 3000);
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
                  Registrarme
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
                      alt="Punto Azul Logo"
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
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="form-control"
                          placeholder="nombre"
                          name="name"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-user" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="form-control"
                          placeholder="usuario de ingreso"
                          name="userName"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-user-secret" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control"
                          placeholder="correo electrónico"
                          name="email"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-envelope" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="form-control"
                          placeholder="número celular"
                          name="phone"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-mobile" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="form-control"
                          placeholder="dirección"
                          name="address"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-map-marker-alt" />
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

                    <Link to="/ingreso" className="text-center ctry">
                      Ya estoy registrado
                    </Link>
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
