import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../auth/AuthProvider";
import api from "../../services/api";
import { Toaster, toast } from "sonner";
import { loginSchema } from "../../schemas";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();
  const goTo = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit({ userName, password }) {
    try {
      const { data: json } = await api.post("/auth/login", { userName, password });
      if (json.accessToken) {
        auth.saveUser(json);
        toast.success("¡Conexión establecida!", {
          description: "Tu inicio de sesión fue exitoso.",
        });
        setTimeout(() => { goTo("/pedidos"); }, 3000);
      }
    } catch (_) {
      toast.error("Oops, algo salió mal.", {
        description: "Verifica tus credenciales e inténtalo nuevamente",
      });
    }
  }

  if (auth.isAuthenticated) {
    setTimeout(() => {
      window.location.reload(true);
      return <Navigate to="/pedidos" />;
    }, 3000);
  }

  return (
    <div>
      <Toaster position="top-center" richColors />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1 className="m-0 App-header focus-in-contract alphi-2">Ingresar</h1>
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
                          {...register("userName")}
                          className={`form-control${errors.userName ? " is-invalid" : ""}`}
                          placeholder="Correo electrónico"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-envelope" />
                          </div>
                        </div>
                      </div>
                      {errors.userName && (
                        <div className="errorMessage mb-2">{errors.userName.message}</div>
                      )}
                      <div className="input-group mb-1">
                        <input
                          type={showPassword ? "text" : "password"}
                          {...register("password")}
                          className={`form-control${errors.password ? " is-invalid" : ""}`}
                          placeholder="Contraseña"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <i
                              onClick={() => setShowPassword((v) => !v)}
                              style={{ cursor: "pointer" }}
                              className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"}
                            />
                          </div>
                        </div>
                      </div>
                      {errors.password && (
                        <div className="errorMessage mb-2">{errors.password.message}</div>
                      )}
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
                    <Link to="/recuperar" className="text-center ctry">
                      Olvide mis datos!
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
