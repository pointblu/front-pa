import { useRef, useState } from "react";
import { API_URL } from "../../auth/constants";
import "./UploadImage.css";

export const UploadImage = () => {
  const [image, setImage] = useState(null);
  const hiddenFileInput = useRef(null);
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
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
      setErrorResponse("Please select an image.");
      return;
    }
    setUploading(true); // Deshabilitar el botón de carga durante la carga

    try {
      let myHeaders = new Headers();
      const token = JSON.parse(localStorage.getItem("token"));
      myHeaders.append("Authorization", `Bearer ${token}`);

      let formdata = new FormData();
      formdata.append("file", image);

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      const response = await fetch(`${API_URL}/files`, requestOptions);
      if (response.ok) {
        console.log("Image uploaded successfully");
        const json = await response.json();
        setSuccessResponse(json.message);
        setErrorResponse(null);
        //setImage(json.data.fileUrl); // Assuming you want to set the image after successful upload
        localStorage.setItem("urlImage", JSON.stringify(json.data.fileUrl));
      } else {
        console.log("Something went wrong");
        const json = await response.json();
        setErrorResponse(JSON.stringify(json));
        setSuccessResponse(null);
      }
    } catch (error) {
      console.error("Error during upload:", error);
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
    <div>
      <label htmlFor="image-upload-input" className="imput mb-3">
        {image ? image.name : "Seleciona una imagen"}
      </label>
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt=""
            className="img-display-after"
          />
        ) : (
          <img
            src={process.env.PUBLIC_URL + "/dist/img/logo_punto_azul_pq.png"}
            alt=""
            className="img-display-before"
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
        <button
          className="btn btn-secondary btn-block btn-xs"
          onClick={handleUploadButtonClick}
          disabled={uploading}
        >
          {uploading ? "Cargando..." : "Cargar"}
        </button>
      </div>
    </div>
  );
};
