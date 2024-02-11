import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../auth/constants";
import { Toaster, toast } from "sonner";

export const EditBank = () => {
  const editBank = JSON.parse(localStorage.getItem("editBank"));

  const [name, setName] = useState(editBank?.name);
  const [type, setType] = useState(editBank?.type);
  const [account, setAccount] = useState(editBank?.account);
  const [active, setActive] = useState(editBank?.active);
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(editBank?.urlImage);
  const referencia = useRef();
  const uploadFiles = () => {
    referencia.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const maxSizeMB = 1; // Tamaño máximo permitido en megabytes
    const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convertir a bytes
    if (file.size > maxSizeBytes) {
      toast.error("Oops, la imagen es muy grande.", {
        description: `Intenta con un tamaño menor a ${maxSizeMB} Mb`,
      });
      return;
    }
    const imgname = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = Math.max(img.width, img.height);
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          (maxSize - img.width) / 2,
          (maxSize - img.height) / 2
        );
        canvas.toBlob(
          (blob) => {
            const file = new File([blob], imgname, {
              type: "image/png",
              lastModified: Date.now(),
            });

            console.log(file);
            setImage(file);
          },
          "image/jpeg",
          0.8
        );
      };
    };
    setImage(file);
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result.toString());
      };
      reader.readAsDataURL(image);
    } else {
      setPreview("");
    }
  }, [image]);

  const goTo = useNavigate();

  function handleCancel(e) {
    e.preventDefault();
    goTo("/cuentas");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const formData = new FormData();
      formData.append("file", image);
      formData.append("name", name);
      formData.append("type", type);
      formData.append("account", account);
      formData.append("active", active);

      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Cache-Control": "no-store",
        },
        body: formData,
        redirect: "follow",
      };

      const response = await fetch(
        `${API_URL}/banks/${editBank.id}`,
        requestOptions
      );

      if (response.ok) {
        console.log("User register successfully");
        const json = await response.json();
        setSuccessResponse(json.message);
        toast.success(json.message);
        setErrorResponse(null);
        setName("");
        setType("");
        setActive(false);
        setAccount("");
        goTo("/cuentas");

        localStorage.removeItem("editBank");
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

  //const response = await fetch(`${API_URL}/products/${editProd.id}`, {

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
                <h1 className="m-0 App-header focus-in-contract alphi-7">
                  Editar banco
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
                      background: "#3279fd",
                    }}
                  >
                    <form action="/" method="post" onSubmit={handleSubmit}>
                      <div className="input-group mb-3 upload-image">
                        <input
                          id="image-upload-input"
                          accept="image/*"
                          type="file"
                          style={{ display: "none" }}
                          className="form-control"
                          ref={referencia}
                          onChange={handleImageChange}
                          name="image"
                        />
                        {image ? (
                          <img
                            src={preview}
                            onClick={uploadFiles}
                            style={{ width: "100", cursor: "pointer" }}
                            alt=""
                          />
                        ) : (
                          <img
                            src={editBank?.urlImage}
                            alt=""
                            onClick={uploadFiles}
                          />
                        )}
                      </div>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="form-control"
                          placeholder="Banco"
                          name="name"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-university text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          className="form-control"
                          placeholder="Tipo de cuenta"
                          name="type"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-piggy-bank text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={account}
                          onChange={(e) => setAccount(e.target.value)}
                          className="form-control"
                          placeholder="Número de Cuenta"
                          name="account"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-hashtag  text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="custom-control-input"
                            name="active"
                            id="customSwitch1"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customSwitch1"
                          >
                            Publicar
                          </label>
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
