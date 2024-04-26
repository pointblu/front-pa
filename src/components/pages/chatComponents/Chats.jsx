import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import { db } from "../../../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (!currentUser) {
      console.log("No hay usuario autenticado");
      return; // Salir del efecto si no hay usuario
    }
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };
  if (!currentUser) {
    return (
      <div style={{ color: "white" }}>No tienes acceso a este chat...</div>
    );
  }
  return (
    <div className="c-chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="c-userChat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className="c-userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
