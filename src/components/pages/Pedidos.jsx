import React, { useEffect } from "react";
import { Pedido } from "./Pedido";
import "./Pedidos.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth as authu } from "../../firebase";

export const Pedidos = () => {
  useEffect(() => {
    const fetchData = async () => {
      const userDataRaw = localStorage.getItem("userInfo");
      if (userDataRaw) {
        const userData = JSON.parse(userDataRaw);

        try {
          // Intentar iniciar sesión con Firebase
          await signInWithEmailAndPassword(
            authu,
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
    fetchData();
  }, []);
  // El array vacío asegura que esto solo se ejecute una vez después del montaje inicial
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
                  className="m-0 App-header focus-in-contract alphi-3"
                  style={{ backgroundColor: "#F1d100" }}
                >
                  Pedidos
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
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12">
                <Pedido />
              </div>
            </div>

            {/* /.row (main row) */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
    </div>
  );
};
