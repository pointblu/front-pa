import Input from "./Input";
import Messages from "./Messages";
import More from "../../../assets/img/more.png";
import { ChatContext } from "./../../../context/ChatContext";
import { useContext } from "react";

const Chato = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="c-chat">
      <div className="c-chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="c-chatIcons">
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chato;
