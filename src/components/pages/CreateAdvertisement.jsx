import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { Toaster, toast } from "sonner";
import { advertisementSchema } from "../../schemas";
import "./Advertisement.css";

export const CreateAdvertisement = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const referencia = useRef();
  const goTo = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(advertisementSchema),
    defaultValues: { active: false },
  });

  const uploadFiles = () => referencia.current.click();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const maxSizeBytes = 1 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error("Oops, la imagen es muy grande.", {
        description: "Intenta con un tamaño menor a 1 Mb",
      });
      return;
    }
    const imgname = file.name;
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
        ctx.drawImage(img, (maxSize - img.width) / 2, (maxSize - img.height) / 2);
        canvas.toBlob(
          (blob) => {
            setImage(new File([blob], imgname, { type: "image/png", lastModified: Date.now() }));
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
      reader.onloadend = () => setPreview(reader.result.toString());
      reader.readAsDataURL(image);
    } else {
      setPreview("");
    }
  }, [image]);

  async function onSubmit({ title, description, whatsapp, link, active }) {
    if (!image) {
      toast.error("Debes seleccionar una imagen");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("title", title);
      formData.append("description", description ?? "");
      formData.append("whatsapp", whatsapp ?? "");
      formData.append("active", String(active ?? false));
      formData.append("link", link ?? "");

      const { data } = await api.post("/advertisements", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(data.message);
      reset();
      setImage(null);
      setTimeout(() => { goTo("/"); window.location.reload(); }, 2000);
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
                <h1 className="m-0 App-header focus-in-contract alphi-1">Crear Anuncio</h1>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="content-wrapper" style={{ marginTop: "1rem" }}>
            <div className="container-fluid ctry">
              <div className="register-box">
                <div className="card">
                  <div className="card-body register-card-body" style={{ borderRadius: "0.6rem", background: "cadetblue" }}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <div className="input-group mb-3 upload-image">
                        <input
                          id="image-upload-input"
                          accept="image/*"
                          type="file"
                          style={{ display: "none" }}
                          className="form-control"
                          ref={referencia}
                          onChange={handleImageChange}
                        />
                        {image ? (
                          <img src={preview} onClick={uploadFiles} style={{ width: "100%", cursor: "pointer" }} alt="preview" />
                        ) : (
                          <img
                            src="https://res.cloudinary.com/diitm4dx7/image/upload/v1705802329/UPLOAD_1-1705802328143.webp"
                            alt="Subir imagen"
                            onClick={uploadFiles}
                          />
                        )}
                      </div>

                      <div className="input-group mb-1">
                        <input
                          type="text"
                          {...register("title")}
                          className={`form-control${errors.title ? " is-invalid" : ""}`}
                          placeholder="Titulo"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-ad text-white" />
                          </div>
                        </div>
                      </div>
                      {errors.title && <div className="errorMessage mb-2">{errors.title.message}</div>}

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

                      <div className="input-group mb-3">
                        <input
                          type="text"
                          {...register("whatsapp")}
                          className="form-control"
                          placeholder="WhatsApp"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fab fa-whatsapp text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="input-group mb-1">
                        <input
                          type="text"
                          {...register("link")}
                          className={`form-control${errors.link ? " is-invalid" : ""}`}
                          placeholder="Página web (opcional)"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-link text-white" />
                          </div>
                        </div>
                      </div>
                      {errors.link && <div className="errorMessage mb-2">{errors.link.message}</div>}

                      <div className="form-group">
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            {...register("active")}
                            className="custom-control-input"
                            id="customSwitch1"
                          />
                          <label className="custom-control-label" htmlFor="customSwitch1">
                            Publicar
                          </label>
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
                            onClick={() => goTo("/")}
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
