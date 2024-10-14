import React, { useContext, useState } from "react";
import Img from "../../../assets/img/img.png";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Toaster, toast } from "sonner";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Permite el uso de shift+enter para nuevas líneas si fuera necesario
      e.preventDefault(); // Previene el comportamiento por defecto de la tecla Enter
      handleSend();
    }
  };

  const getUserBgColor = async (userId) => {
    const userDoc = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return userData.bgColor || "green"; // Devuelve el color de fondo predeterminado si no está definido
    } else {
      console.error("Usuario no encontrado");
      return "orange"; // Devuelve un color predeterminado si el usuario no existe
    }
  };

  const handleSend = async () => {
    if (!currentUser || !data.user) {
      console.error(
        "No se puede enviar el mensaje, el usuario actual o el usuario de datos no está definido."
      );
      return; // Termina la ejecución si alguno es nulo
    }
    if (!currentUser.uid || !data.user.uid) {
      console.error("No se puede enviar el mensaje, falta UID del usuario.");
      toast.error("Debes seleccionar un usuario para enviarle mensajes!");
      return; // Termina la ejecución si alguno de los UIDs es nulo o undefined
    }

    // Verifica si el chat aún existe
    const chatRef = doc(db, "chats", data.chatId);
    const chatSnapshot = await getDoc(chatRef);
    if (!chatSnapshot.exists()) {
      console.error("El chat no existe. No se puede enviar el mensaje.");
      toast.error(
        "El chat ha sido eliminado. Selecciona un usuario disponible"
      );
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    }

    const currentUserBgColor = await getUserBgColor(currentUser.uid);
    const otherUserBgColor = await getUserBgColor(data.user.uid);
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          readed: false,
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".bgColor"]: currentUserBgColor,
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".bgColor"]: otherUserBgColor,
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };
  return (
    <div className="input">
      <Toaster position="top-center" richColors />
      <input
        type="text"
        placeholder="Escribe algo..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        value={text}
      />
      <div className="send">
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
};

export default Input;
