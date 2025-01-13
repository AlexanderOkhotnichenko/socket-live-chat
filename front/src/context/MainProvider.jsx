import React, { useRef, useState } from "react";
import { MainContext } from "./rootContext";

export function MainProvider({ children }) {
  const [profile, setProfile] = useState(false);
  const [isOpenSearchUser, setIsOpenSearchUser] = useState(false);
  const inputUploadedImageRef = useRef(null);
  const inputUploadedVideoRef = useRef(null);

  const contextValue = {
    profile, setProfile,
    isOpenSearchUser, setIsOpenSearchUser,
    inputUploadedImageRef, inputUploadedVideoRef,
  };

  return (
    <MainContext.Provider value={contextValue}>
      {children}
    </MainContext.Provider>
  );
}
