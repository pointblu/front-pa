import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../auth/AuthProvider";
import api from "../../services/api";
import { Toaster, toast } from "sonner";
import { registerSchema } from "../../schemas";

function generateDateBasedNumber() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

export const Register = () => {
  const authi = useAuth();
  const goTo = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit({ name, email, phone, address }) {
    try {
      const { data: json } = await api.post("/users", {
        name,
        userName: generateDateBasedNumber(),
        email,
        phone,
        address,
        active: true,
      });
      if (json) {
        toast.success(json.message);
        setTimeout(() => { goTo("/ingreso"); }, 3000);
      }
    } catch (_) {}
  }

  if (authi.isAuthenticated) {
    setTimeout(() => { return <Navigate to="/" />; }, 3000);
  }

  return (
    <div>
      <Toaster position="top-center" richColors />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1 className="m-0 App-header focus-in-contract alphi-2">Registrarme</h1>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="video-wrapper">
            <video playsInline autoPlay muted loop poster="">
              <source src={process.env.PUBLIC_URL + "/dist/img/panaderia.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="container-fluid ctry video-header">
              <div className="register-box">
                <div className="register-logo" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Link to="/">
                    <img
                      src={process.env.PUBLIC_URL + "/dist/img/logo_punto_azul.png"}
                      alt="Monsalve Logo"
                      className="brand-image-xl img-circle elevation-3"
                      style={{ opacity: ".8", maxHeight: "140px" }}
                    />
                  </Link>
                </div>
                <div className="card">
                  <div className="card-body register-card-body" style={{ borderRadius: "100px" }}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <div className="input-group mb-1">
                        <input
                          type="text"
                          {...register("name")}
                          className={`form-control${errors.name ? " is-invalid" : ""}`}
                          placeholder="nombre"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-user" />
                          </div>
                        </div>
                      </div>
                      {errors.name && <div className="errorMessage mb-2">{errors.name.message}</div>}

                      <div className="input-group mb-1">
                        <input
                          type="email"
                          {...register("email")}
                          className={`form-control${errors.email ? " is-invalid" : ""}`}
                          placeholder="correo electrónico"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-envelope" />
                          </div>
                        </div>
                      </div>
                      {errors.email && <div className="errorMessage mb-2">{errors.email.message}</div>}

                      <div className="input-group mb-1">
                        <input
                          type="text"
                          {...register("phone")}
                          className={`form-control${errors.phone ? " is-invalid" : ""}`}
                          placeholder="número celular / contraseña"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-mobile" />
                          </div>
                        </div>
                      </div>
                      {errors.phone && <div className="errorMessage mb-2">{errors.phone.message}</div>}

                      <div className="input-group mb-1">
                        <input
                          type="text"
                          {...register("address")}
                          className="form-control"
                          placeholder="dirección"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-map-marker-alt" />
                          </div>
                        </div>
                      </div>

                      <div className="row ctry mt-3">
                        <div className="col-4">
                          <button
                            type="submit"
                            className="btn btn-primary btn-block btn-xs"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Cargando..." : "Listo!"}
                          </button>
                        </div>
                      </div>
                    </form>
                    <Link to="/ingreso" className="text-center ctry">
                      Ya estoy registrado
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
