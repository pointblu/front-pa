import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = () => {
  return (
    <div className="c-sidebar">
      <Navbar />
      <div className="search">
        {" "}
        {/* Envuelve el componente Search para control individual del scroll */}
        <Search />
      </div>
      <div className="chats">
        {" "}
        {/* Envuelve el componente Chats similar a Search */}
        <Chats />
      </div>
    </div>
  );
};

export default Sidebar;
