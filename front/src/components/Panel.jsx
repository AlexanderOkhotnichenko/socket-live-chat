import React from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Chats } from "./Chats";

export function Panel() {
  const location = useLocation();
  const basePath = location.pathname === "/";

  return (
    <div className={`${!basePath ? "xs:hidden" : ""} flex xs:w-full`}>
      <Sidebar />
      <Chats />
    </div>
  );
}
