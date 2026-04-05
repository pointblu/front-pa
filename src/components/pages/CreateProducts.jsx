import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { Toaster, toast } from "sonner";
import { UploadImage } from "./UploadImage";
import { productSchema } from "../../schemas";

export const CreateProduct = () => {
  const [imageUrl, setImageUrl] = useState(() =>
    JSON.parse(localStorage.getItem("urlImage"))
  );
  const categories = JSON.parse(localStorage.getItem("categorias")) ?? [];
  const goTo = useNavigate();

  // Sincroniza imageUrl cuando UploadImage actualiza localStorage
  useEffect(() => {
    const onStorage = () => setImageUrl(JSON.parse(localStorage.getItem("urlImage")));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(productSchema) });

  async function onSubmit({ name, cost, price, description, stock, brand, category }) {
    if (!imageUrl) {
      toast.error("Debes cargar una imagen antes de guardar");
      return;
    }
    try {
      const { data } = await api.post("/products", {
        name,
        cost,
        price,
        description,
        stock,
        brand,
        category,
        image: imageUrl,
      });
      toast.success(data.message);
      reset();
      localStorage.removeItem("urlImage");
      setImageUrl(null);
      setTimeout(() => { goTo("/catalogo"); window.location.reload(); }, 2000);
    } catch (_) {}
  }

  function handleCancel() {
    if (imageUrl) localStorage.removeItem("urlImage");
    goTo("/catalogo");
  }

  return (
    <div>
      <Toaster position="top-center" richColors />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1 className="m-0 App-header focus-in-contract alphi-1">Crear Producto</h1>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="content-wrapper" style={{ marginTop: "1rem" }}>
            <div className="container-fluid ctry">
              <div className="register-box">
                <div className="card">
                  <div className="card-body register-card-body" style={{ borderRadius: "0.6rem", background: "#6B3A00" }}>
                    <UploadImage
                      setIsButtonDisabled={() => setImageUrl(JSON.parse(localStorage.getItem("urlImage")))}
                      fromPayment={false}
                    />
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <div className="input-group mb-1">
                        <input
                          type="text"
                          {...register("name")}
                          className={`form-control${errors.name ? " is-invalid" : ""}`}
                          placeholder="Nombre del producto"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-wine-bottle text-white" />
                          </div>
                        </div>
                      </div>
                      {errors.name && <div className="errorMessage mb-2">{errors.name.message}</div>}

                      <div className="input-group mb-1">
                        <div className="input-group-prepend bg-light">
                          <span className="input-group-text"><i className="fas fa-dollar-sign"></i></span>
                        </div>
                        <input
                          type="number"
                          {...register("cost")}
                          className={`form-control${errors.cost ? " is-invalid" : ""}`}
                          placeholder="Costo"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-hand-holding-usd text-white" />
                          </div>
                        </div>
                      </div>
                      {errors.cost && <div className="errorMessage mb-2">{errors.cost.message}</div>}

                      <div className="input-group mb-1">
                        <div className="input-group-prepend bg-light">
                          <span className="input-group-text"><i className="fas fa-dollar-sign"></i></span>
                        </div>
                        <input
                          type="number"
                          {...register("price")}
                          className={`form-control${errors.price ? " is-invalid" : ""}`}
                          placeholder="Precio"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-money-bill-wave text-white" />
                          </div>
                        </div>
                      </div>
                      {errors.price && <div className="errorMessage mb-2">{errors.price.message}</div>}

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

                      <div className="input-group mb-1">
                        <div className="input-group-prepend bg-light">
                          <span className="input-group-text">Und.</span>
                        </div>
                        <input
                          type="number"
                          {...register("stock")}
                          className={`form-control${errors.stock ? " is-invalid" : ""}`}
                          placeholder="Existencias"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-boxes text-white" />
                          </div>
                        </div>
                      </div>
                      {errors.stock && <div className="errorMessage mb-2">{errors.stock.message}</div>}

                      <div className="input-group mb-3">
                        <input
                          type="text"
                          {...register("brand")}
                          className="form-control"
                          placeholder="Marca"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-certificate text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="input-group mb-1">
                        <select
                          {...register("category")}
                          className={`form-control${errors.category ? " is-invalid" : ""}`}
                        >
                          <option value="">Categoría</option>
                          {(Array.isArray(categories) ? categories : []).map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-tag text-white" />
                          </div>
                        </div>
                      </div>
                      {errors.category && <div className="errorMessage mb-2">{errors.category.message}</div>}

                      <div className="row ctry mt-3">
                        <div className="col-4">
                          <button
                            type="submit"
                            className="btn btn-outline-light btn-block btn-sm"
                            disabled={isSubmitting || !imageUrl}
                          >
                            {isSubmitting ? "Guardando..." : "Guardar"}
                          </button>
                        </div>
                        <div className="col-4">
                          <button
                            type="button"
                            className="btn btn-outline-light btn-block btn-sm"
                            onClick={handleCancel}
                          >
                            Cancelar
                          </button>
                        </div>
                        {!imageUrl && (
                          <div className="errorMessage">¡Debe cargar una imagen!</div>
                        )}
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
