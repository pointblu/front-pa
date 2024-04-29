import { useMessage } from "../../context/MessageContext";

export const NotificationComponent = () => {
  const { newMessageReceived } = useMessage();

  return (
    <div>
      {newMessageReceived && (
        <span className="badge badge-success navbar-badge">+</span>
      )}
    </div>
  );
};
