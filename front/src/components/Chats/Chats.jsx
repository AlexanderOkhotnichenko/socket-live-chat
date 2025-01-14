import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { IoPersonAddSharp } from "react-icons/io5";
import { ListChats } from "../ListChats";
import { MainContext } from "../../context/rootContext";
import { Search } from "../Search";

export function Chats() {
  const { setIsOpenSearchUser } = useContext(MainContext);
  const [allUsers, setAllUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const location = useLocation();
  const basePath = location.pathname === '/';
  
  const filterUsers = allUsers.filter(user =>
    user?.userData?.firstName?.toLowerCase()?.includes(searchUser?.toLowerCase())
  );

  return (
    <section className={`${!basePath ? "md:hidden" : ""} flex flex-col justify-between w-full h-full p-3 border border-emerald-400 bg-white border-r-2 xs:max-w-full ls:min-w-0`}>
      {/* <h2 className="text-3xl pb-7 font-bold">Chats</h2>
      <div className="flex gap-2">
        <Search value={searchUser} onChange={(event) => setSearchUser(event.target.value)} />
        <div className="flex items-center justify-center bg-blue-500 p-1.5 rounded cursor-pointer h-11 px-2.5 duration-200 hover:bg-blue-600" onClick={() => setIsOpenSearchUser(true)}>
          <IoPersonAddSharp className="text-2xl fill-white" />
        </div>
      </div>
      <span className="block my-5 h-px bg-neutral-300"></span>
      <ListChats allUsers={filterUsers} setAllUsers={setAllUsers} /> */}
      <div className="bg-red-500">123</div>
      <div className="bg-blue-500">456</div>
    </section>
  );
}
