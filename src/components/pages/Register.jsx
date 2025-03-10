import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { API_URL } from "../../auth/constants";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Toaster, toast } from "sonner";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");

  const authi = useAuth();
  const goTo = useNavigate();

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  function getRandomElement(array) {
    if (!array || array.length === 0) {
      return null; // Retorna null si el array está vacío o no definido
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  function generateDateBasedNumber() {
    const now = new Date();

    // Formato: AñoMesDiaHoraMinutoSegundo (ejemplo: 20231004123045)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Meses van de 0 a 11
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return String(`${year}${month}${day}${hours}${minutes}${seconds}`);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          userName: generateDateBasedNumber(),
          email,
          phone,
          address,
          active: true,
        }),
      });
      if (response.ok) {
        const avatar = [
          "https://res.cloudinary.com/diitm4dx7/image/upload/v1714068869/avatar-1-1714068867304.webp",
          "https://res.cloudinary.com/diitm4dx7/image/upload/v1714068908/avatar-2-1714068907683.webp",
          "https://res.cloudinary.com/diitm4dx7/image/upload/v1714068939/avatar-3-1714068938456.webp",
          "https://res.cloudinary.com/diitm4dx7/image/upload/v1714068968/avatar-4-1714068967839.webp",
          "https://res.cloudinary.com/diitm4dx7/image/upload/v1714069045/avatar-5-1714069044953.webp",
          "https://res.cloudinary.com/diitm4dx7/image/upload/v1714069087/avatar-6-1714069086825.webp",
          "https://res.cloudinary.com/diitm4dx7/image/upload/v1714069129/avatar-7-1714069128539.webp",
          "https://res.cloudinary.com/diitm4dx7/image/upload/v1714069162/avatar-8-1714069162362.webp",
          "https://res.cloudinary.com/diitm4dx7/image/upload/v1714069186/avatar-9-1714069185976.webp",
          "https://res.cloudinary.com/diitm4dx7/image/upload/v1714069207/avatar-10-1714069207291.webp",
        ];

        const defaultPhotoUrl = await getRandomElement(avatar);
        const password = phone;
        const displayName = name;
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const bgColor = getRandomColor();
        console.log(res);
        // Update profile with default photoURL
        await updateProfile(res.user, {
          displayName,
          photoURL: defaultPhotoUrl, // Usar la URL predeterminada
        });

        // Create user on firestore with default photoURL
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
          bgColor: bgColor,
          photoURL: defaultPhotoUrl, // Usar la URL predeterminada
        });

        // Create empty user chats on firestore
        await setDoc(doc(db, "userChats", res.user.uid), {});

        console.log("User register successfully");
        const json = await response.json();
        setSuccessResponse(json.message);
        toast.success(json.message);
        setErrorResponse(null);
        // Limpiar los campos del formulario
        setName(""); // Agrega estas líneas
        setEmail(""); // Agrega estas líneas
        setPhone(""); // Agrega estas líneas
        setAddress(""); // Agrega estas líneas
        //Redirigir al login
        setTimeout(() => {
          goTo("/ingreso");
        }, 3000);
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
        setErrorResponse();
        setSuccessResponse(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (authi.isAuthenticated) {
    setTimeout(() => {
      return <Navigate to="/" />;
    }, 3000);
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
                <h1
                  className="m-0 App-header focus-in-contract alphi-2"
                  style={{ backgroundColor: "#17a2b8" }}
                >
                  Registrarme
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
          <div className="video-wrapper">
            <video playsInline autoPlay muted loop poster="">
              <source
                src={process.env.PUBLIC_URL + "/dist/img/panaderia.mp4"}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="container-fluid ctry video-header">
              <div className="register-box">
                <div
                  className="register-logo"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Link to="/">
                    <img
                      src={
                        process.env.PUBLIC_URL + "/dist/img/logo_punto_azul.png"
                      }
                      alt="Monsalve Logo"
                      className="brand-image-xl img-circle elevation-3"
                      style={{ opacity: ".8", maxHeight: "140px" }}
                    />
                  </Link>
                </div>
                {!!errorResponse && (
                  <div className="errorMessage">{errorResponse}</div>
                )}
                {!!successResponse && (
                  <div className="successMessage">{successResponse}</div>
                )}
                <div className="card">
                  <div
                    className="card-body register-card-body"
                    style={{ borderRadius: "100px" }}
                  >
                    <form action="/" method="post" onSubmit={handleSubmit}>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="form-control"
                          placeholder="nombre"
                          name="name"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-user" />
                          </div>
                        </div>
                      </div>

                      <div className="input-group mb-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control"
                          placeholder="correo electrónico"
                          name="email"
                          autoComplete="off"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-envelope" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="form-control"
                          placeholder="número celular /contraseña"
                          name="phone"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-mobile" />
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="form-control"
                          placeholder="dirección"
                          name="address"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-map-marker-alt" />
                          </div>
                        </div>
                      </div>
                      <div className="row ctry">
                        {/* /.col */}
                        <div className="col-4">
                          <button
                            type="submit"
                            className="btn btn-primary btn-block btn-xs"
                          >
                            Listo!
                          </button>
                        </div>
                        {/* /.col */}
                      </div>
                    </form>

                    <Link to="/ingreso" className="text-center ctry">
                      Ya estoy registrado
                    </Link>
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
