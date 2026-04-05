import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Toaster, toast } from "sonner";

export const EditCategories = () => {
  const editCat = JSON.parse(localStorage.getItem("editCateg"));
  const [name, setName] = useState(editCat.name);
  const [description, setDescription] = useState(editCat.description);
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");

  const goTo = useNavigate();

  function handleCancel(e) {
    e.preventDefault();
    goTo("/categorias");
    localStorage.removeItem("editCateg");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const { data } = await api.put(`/categories/${editCat.id}`, { name, description });
      toast.success(data.message);
      setName("");
      setDescription("");
      setTimeout(() => {
        localStorage.removeItem("editCateg");
        goTo("/categorias");
        window.location.reload();
      }, 2000);
    } catch (_) {}
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
                <h1 className="m-0 App-header focus-in-contract alphi-6">
                  Editar {editCat.name}
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
                      background: "#C0392B",
                    }}
                  >
                    <form action="/" method="post" onSubmit={handleSubmit}>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="form-control"
                          placeholder="Nombre de la categoría"
                          name="name"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-tag text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="form-control"
                          placeholder="Descripción"
                          name="description"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-file-alt text-white" />
                          </div>
                        </div>
                      </div>
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
