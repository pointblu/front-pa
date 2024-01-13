import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../auth/constants";
import { Toaster, toast } from "sonner";
import { UploadImage } from "./UploadImage";

export const CreateProduct = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");
  const imageUrl = JSON.parse(localStorage.getItem("urlImage"));
  const categories = JSON.parse(localStorage.getItem("categorias"));
  const goTo = useNavigate();

  useEffect(() => {
    // Verifica si existe la URL de la imagen en localStorage
    setIsButtonDisabled(!imageUrl);
  }, [imageUrl]);

  function handleCancel(e) {
    e.preventDefault();
    if (imageUrl) localStorage.removeItem("urlImage");
    goTo("/catalogo");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const numericCost = parseFloat(cost);
      const numericPrice = parseFloat(price);
      const numericStock = parseInt(stock, 10);

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({
          name,
          cost: numericCost,
          price: numericPrice,
          description,
          stock: numericStock,
          brand,
          category,
          image: imageUrl,
        }),
      });

      if (response.ok) {
        console.log("User register successfully");
        const json = await response.json();
        setSuccessResponse(json.message);
        toast.success(json.message);
        setErrorResponse(null);
        setName("");
        setCost("");
        setPrice("");
        setDescription("");
        setStock("");
        setBrand("");
        setCategory("");
        localStorage.removeItem("urlImage");
        setTimeout(() => {
          goTo("/catalogo");
          window.location.reload();
        }, 2000);
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
                <h1 className="m-0 App-header focus-in-contract alphi-1">
                  Crear Producto
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
                      background: "cadetblue",
                    }}
                  >
                    <UploadImage
                      setIsButtonDisabled={setIsButtonDisabled}
                      fromPayment={false}
                    />
                    <form action="/" method="post" onSubmit={handleSubmit}>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="form-control"
                          placeholder="Nombre del producto"
                          name="name"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-wine-bottle text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend bg-light">
                          <span className="input-group-text">
                            <i className="fas fa-dollar-sign"></i>
                          </span>
                        </div>
                        <input
                          type="number"
                          value={cost}
                          onChange={(e) => setCost(e.target.value)}
                          className="form-control"
                          placeholder="Costo"
                          name="cost"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-hand-holding-usd text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend bg-light">
                          <span className="input-group-text">
                            <i className="fas fa-dollar-sign"></i>
                          </span>
                        </div>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="form-control"
                          placeholder="Precio"
                          name="price"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-money-bill-wave text-white" />
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
                      <div className="input-group mb-3">
                        <div className="input-group-prepend bg-light">
                          <span className="input-group-text">Und.</span>
                        </div>
                        <input
                          type="number"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          className="form-control"
                          placeholder="Existencias"
                          name="stock"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-boxes text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          className="form-control"
                          placeholder="Marca"
                          name="brand"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-certificate text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="form-control"
                          name="category"
                        >
                          <option value="">Categoría</option>
                          {categories.data.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-tag text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="row ctry">
                        {/* /.col */}

                        <div className="col-4">
                          <button
                            type="submit"
                            className="btn btn-outline-light btn-block btn-sm"
                            disabled={isButtonDisabled}
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
                        <div className="errorMessage">
                          {isButtonDisabled && "¡Debe cargar una imagen!"}
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
