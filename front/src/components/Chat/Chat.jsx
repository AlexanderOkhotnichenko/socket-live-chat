import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChatProfile } from "../ChatProfile";
import { Message } from "../Message"
import { ChatActionBar } from "../ChatActionBar";

export function Chat() {
  const params = useParams();
  const user = useSelector((state) => state?.user);
  const socketConnection = useSelector((state) => state?.user?.socketConnection);
  const [dataUser, setDataUser] = useState({
    _id: "",
    firstName: "",
    email: "",
    profile_pic: "",
    online: false,
  });
  const [message, setMessage] = useState({
    imageUrl: "",
    videoUrl: "",
    text: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.emit('seen',params.userId);

      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection.on("message", (data) => {
        setAllMessage(data);
      });

    }
  }, [socketConnection, params?.userId, user]);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  return (
    <div className="w-auto flex-grow">
      <ChatProfile dataUser={dataUser} />
      <Message user={user} message={message} setMessage={setMessage} isLoading={isLoading} allMessage={allMessage} currentMessage={currentMessage} />
      <ChatActionBar user={user} message={message} setMessage={setMessage} isLoading={isLoading} setIsLoading={setIsLoading} socketConnection={socketConnection} />
    </div>
  );
}
