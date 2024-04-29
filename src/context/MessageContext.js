import React, { createContext, useContext, useState } from "react";

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const [newMessageReceived, setNewMessageReceived] = useState(false);

  const handleMessageReceived = (status) => {
    setNewMessageReceived(status);
  };

  return (
    <MessageContext.Provider
      value={{
        newMessageReceived,
        handleMessageReceived,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
