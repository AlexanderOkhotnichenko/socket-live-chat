import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUser, setSocketConnection } from "../redux/userSlice";
import { fetchUserData } from "../utils/fetchUserData";
import { Panel } from "../components/Panel";
import { Loading } from "../components/Loading/Loading";
import { SearchUser } from "../components/SearchUser";
import { Chat } from "../components/Chat";

export function HomePage() {
  const { userId } = useParams();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData(dispatch).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    socketConnection.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
      dispatch(setSocketConnection(null));
    };
  }, [dispatch]);

  return (
    <div className="flex h-full">
      {loading ? (<Loading text={"Loading..."} />
      ) : (
        <>
          <Panel />
          {userId !== "settings" && userId && <Chat />}
          <SearchUser user={user} />
        </>
      )}
    </div>
  );
}
