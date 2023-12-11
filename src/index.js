import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { FiltersProvider } from "./context/filters";
import { AuthProvider } from "./auth/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <FiltersProvider>
    <AuthProvider>
      <HashRouter basename={process.env.PUBLIC_URL}>
        <App />
      </HashRouter>
    </AuthProvider>
  </FiltersProvider>
);
