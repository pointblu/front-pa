import React, { useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth as authi } from "../../firebase";
import Sidebar from "./chatComponents/Sidebar";
import "./Chat.css";
import Chato from "./chatComponents/Chato";
export const Chat = () => {
  useEffect(() => {
    const fetchData = async () => {
      const userDataRaw = localStorage.getItem("userInfo");
      if (userDataRaw) {
        const userData = JSON.parse(userDataRaw);
        console.log(userData);

        try {
          // Intentar iniciar sesión con Firebase
          await signInWithEmailAndPassword(
            authi,
            userData.email,
            userData.phone
          ); // Asegúrate de que 'password' sea la clave correcta
          console.log("Logged in with Firebase successfully");
        } catch (error) {
          console.error("Error logging in with Firebase", error);
        }
      } else {
        console.log("No user data found in localStorage");
      }
    };

    // Llamar a la función asíncrona
    fetchData();
  }, []); // El array vacío asegura que esto solo se ejecute una vez después del montaje inicial

  // Resto del componente
  return (
    <div>
      {/* Content Wrapper. Contains page content */}

      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1
                  className="m-0 App-header focus-in-contract alphi-8"
                  style={{ backgroundColor: "black" }}
                >
                  PQR CHAT
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div classname="c-home">
          <div className="c-container">
            <Sidebar />
            <Chato />
          </div>
        </div>
      </div>
    </div>
  );
};
