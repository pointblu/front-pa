import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { AuthContext } from "../../../context/AuthContext";
import { useAuth } from "../../../auth/AuthProvider";

const predefinedUsername = "Monsalve";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isAdmin =
    auth.isAuthenticated && userObject && userObject.role === "ADMIN";
  useEffect(() => {
    if (!isAdmin) {
      setUsername(predefinedUsername);
      handleSearch(predefinedUsername); // Realizar búsqueda automática con nombre predeterminado
    }
  }, [isAdmin]);
  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.substr(0, 2).toUpperCase();
  };

  const handleSearch = async (searchName) => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", searchName)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter" && isAdmin) {
      handleSearch(username);
    }
  };

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername("");
  };
  return (
    <div className="c-search">
      {isAdmin && (
        <div className="c-searchForm">
          <input
            type="text"
            placeholder="Buscar un usuario"
            onKeyDown={handleKey}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
      )}
      {err && <span>Usuario no encontrado!</span>}
      {user && (
        <div className="c-userChat" onClick={handleSelect}>
          <div
            className="user-initials"
            style={{ backgroundColor: user.bgColor }}
          >
            {getInitials(user.displayName)}
          </div>
          <div className="c-userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
