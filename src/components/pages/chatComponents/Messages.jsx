import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../../context/ChatContext";
import { db } from "../../../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (data.chatId) {
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages || []); // Asegúrate de que sea un array
      });

      return () => {
        unSub();
      };
    }
  }, [data.chatId]);

  return (
    <div className="c-messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
