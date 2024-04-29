import React, { useContext, useEffect } from "react";
import Sidebar from "./chatComponents/Sidebar";
import "./Chat.css";
import Chato from "./chatComponents/Chato";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useMessage } from "../../context/MessageContext";

export const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { handleMessageReceived } = useMessage();

  useEffect(() => {
    if (data.chatId && currentUser?.uid) {
      const chatDocRef = doc(db, "chats", data.chatId);

      const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const messages = docSnapshot.data().messages || [];
          if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            // Verificar si el último mensaje no ha sido leído y no es del usuario actual
            if (
              !lastMessage.readed &&
              lastMessage.senderId !== currentUser.uid
            ) {
              // Marcar como leído
              const updatedMessages = [...messages];
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMessage,
                readed: true,
              };
              updateDoc(chatDocRef, { messages: updatedMessages });
            }
          }
        }
      });

      return () => unsubscribe();
    }
  }, [data.chatId, currentUser?.uid]);
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
                  CHAT
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="c-home">
          <div className="c-container">
            <Sidebar />
            <Chato />
          </div>
        </div>
      </div>
    </div>
  );
};
