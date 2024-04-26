import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  if (!currentUser) {
    // Renderiza algo diferente o nada si no hay usuario
    return (
      <div className="c-navbar">
        <span className="c-logo">Punto Azul</span>
        <div className="c-user">No tienes acceso a este chat...</div>
      </div>
    );
  }
  return (
    <div className="c-navbar">
      <span className="c-logo">Punto Azul</span>
      <div className="c-user">
        <span>{currentUser.displayName}</span>
        <img src={currentUser.photoURL} alt="" />
      </div>
    </div>
  );
};

export default Navbar;
