import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { Toaster, toast } from "sonner";
import { categorySchema } from "../../schemas";

export const CreateCategories = () => {
  const goTo = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(categorySchema) });

  async function onSubmit({ name, description }) {
    try {
      const { data } = await api.post("/categories", { name, description });
      toast.success(data.message);
      reset();
      setTimeout(() => { goTo("/categorias"); window.location.reload(); }, 2000);
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
                <h1 className="m-0 App-header focus-in-contract alphi-6">Crear Categoría</h1>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="content-wrapper" style={{ marginTop: "1rem" }}>
            <div className="container-fluid ctry">
              <div className="register-box">
                <div className="card">
                  <div className="card-body register-card-body" style={{ borderRadius: "0.6rem", background: "#C0392B" }}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <div className="input-group mb-1">
                        <input
                          type="text"
                          {...register("name")}
                          className={`form-control${errors.name ? " is-invalid" : ""}`}
                          placeholder="Nombre de la categoría"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-tag text-white" />
                          </div>
                        </div>
                      </div>
                      {errors.name && <div className="errorMessage mb-2">{errors.name.message}</div>}

                      <div className="input-group mb-3">
                        <textarea
                          {...register("description")}
                          className="form-control"
                          placeholder="Descripción"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-file-alt text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="row ctry">
                        <div className="col-4">
                          <button
                            type="submit"
                            className="btn btn-outline-light btn-block btn-sm"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Guardando..." : "Guardar"}
                          </button>
                        </div>
                        <div className="col-4">
                          <button
                            type="button"
                            className="btn btn-outline-light btn-block btn-sm"
                            onClick={() => goTo("/categorias")}
                          >
                            Cancelar
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
