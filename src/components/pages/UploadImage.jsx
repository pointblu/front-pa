import { useRef, useState } from "react";
import api from "../../services/api";
import { Toaster, toast } from "sonner";
import "./UploadImage.css";

export const UploadImage = ({ setIsButtonDisabled, fromPayment }) => {
  const editProd = JSON.parse(localStorage.getItem("editProduct"));
  const editPay = JSON.parse(localStorage.getItem("editPayment"));
  const [image, setImage] = useState(null);
  const hiddenFileInput = useRef(null);
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");
  const [uploading, setUploading] = useState(false);

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
  const handleUploadButtonClick = async () => {
    if (!image || uploading) {
      setErrorResponse("");
      return;
    }
    setUploading(true); // Deshabilitar el botón de carga durante la carga

    try {
      const formdata = new FormData();
      formdata.append("file", image);

      const { data } = await api.post("/files", formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(data.message);
      localStorage.setItem("urlImage", JSON.stringify(data.data.fileUrl));
      setIsButtonDisabled(false);
    } catch (_) {
    } finally {
      setUploading(false); // Habilitar el botón de carga después de la carga (éxito o error)
    }
  };

  const handleClick = (event) => {
    if (!uploading && !image) {
      hiddenFileInput.current.click();
    }
  };
  return (
    <div style={{ marginBottom: "1rem" }}>
      <Toaster position="top-center" richColors />
      <label
        htmlFor="image-upload-input"
        className="imput mb-3"
        style={{ color: fromPayment ? "white" : "gray" }}
      >
        {image ? image.name : "Selecciona una imagen"}
      </label>
      <div
        onClick={handleClick}
        style={{ cursor: "pointer" }}
        className="box-decoration"
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt=""
            className="after-upload"
          />
        ) : (
          <img
            src={
              fromPayment
                ? editPay.paymentImage
                : editProd?.image ??
                  process.env.PUBLIC_URL + "/dist/img/photo.png"
            }
            alt=""
            className={editProd ? "after-upload" : ""}
          />
        )}
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
        {!!successResponse && (
          <div className="successMessage">{successResponse}</div>
        )}
        <input
          id="image-upload-input"
          type="file"
          onChange={handleImageChange}
          ref={hiddenFileInput}
          className="form-control"
          style={{ height: "10rem", display: "none" }}
          name="image"
        />
        <div className="row ctry">
          <div className="col-4">
            <button
              className="btn btn-outline-light btn-block btn-sm"
              onClick={handleUploadButtonClick}
              disabled={uploading}
            >
              {uploading ? "Cargando..." : "Cargar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
