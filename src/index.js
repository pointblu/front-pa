import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { FiltersProvider } from "./context/filters";
import { AuthProvider } from "./auth/AuthProvider";

if (!navigator.geolocation) {
  alert("Tu navegador no tiene opción de Geolocalización");
  throw new Error("Tu navegador no tiene opción de Geolocalización");
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <FiltersProvider>
    <AuthProvider>
      <HashRouter basename={process.env.PUBLIC_URL}>
        <App />
      </HashRouter>
    </AuthProvider>
  </FiltersProvider>
);
