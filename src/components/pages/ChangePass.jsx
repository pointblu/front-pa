import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { Toaster, toast } from "sonner";
import { useAuth } from "../../auth/AuthProvider";
import { changePassSchema } from "../../schemas";

export const ChangePass = () => {
  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const goTo = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(changePassSchema) });

  async function onSubmit({ newPass }) {
    try {
      await api.post(`/users/${userObject.id}/change-pass`, { newPass });
      toast.success("Celular/Contraseña actualizada!", {
        description: "En el siguiente inicio de sesión usa tu nueva contraseña",
      });
      setTimeout(() => goTo("/"), 3000);
    } catch (_) {}
  }

  return (
    <div>
      <Toaster position="top-center" richColors />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1 className="m-0 App-header focus-in-contract alphi-2">Actualizar celular</h1>
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
                <div className="register-logo">
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
                          {...register("newPass")}
                          className={`form-control${errors.newPass ? " is-invalid" : ""}`}
                          placeholder="nuevo celular"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-mobile" />
                          </div>
                        </div>
                      </div>
                      {errors.newPass && (
                        <div className="errorMessage mb-2">{errors.newPass.message}</div>
                      )}
                      <div className="row ctry mt-3">
                        <div className="col-4">
                          <button
                            type="submit"
                            className="btn btn-primary btn-block btn-xs"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Guardando..." : "Listo!"}
                          </button>
                        </div>
                      </div>
                    </form>
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
