import React, { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CiLogout } from "react-icons/ci";
import { IoChatboxEllipsesOutline, IoSettingsOutline } from "react-icons/io5";
import { logout } from "../../redux/userSlice";
import { MainContext } from "../../context/rootContext";
import { EditProfile } from "../EditProfile";
import { Avatar } from "../Avatar";
import { ThemeSwitch } from "../ThemeSwitch";
import axios from "axios";

export function Sidebar() {
  const { setProfile } = useContext(MainContext);
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const basePath = location.pathname === '/';
  
  const isActiveLink = (path) => {
    return (location.pathname === path || (path === "/" && location.pathname !== "/settings" && !location.pathname.startsWith("/settings")));
  }

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, { withCredentials: true });
    
      if (response?.data?.success) {
        dispatch(logout());
        localStorage.removeItem('token');
        window.location.reload();
        navigate("/email");
      }
    } catch (error) {
      console.error("Logout failed:", error?.response?.data?.message || error.message);
    }
  };

  return (
    <aside className={`${!basePath ? "xs:hidden": ""} flex flex-col justify-between gap-4 w-[84px] h-full p-3 border-r-2 border-primary-border-color bg-primary-background duration-200 xs:p-2 xs:w-fit`}>
      <div className="flex flex-col gap-4">
        <NavLink to="/" title="Chats" className={`${isActiveLink("/") ? "bg-background-blue" : "hover:bg-background-blue"} group flex justify-center items-center rounded-md p-2 duration-200`}>
          <IoChatboxEllipsesOutline className={`${isActiveLink("/") ? "text-white" : "group-hover:text-hover-primary-text-color"} w-9 h-9 block cursor-pointer text-primary-text-color duration-200`} />
        </NavLink>
        <NavLink to="/settings" title="Settings" className={`${isActiveLink("/settings") ? "bg-background-blue" : "hover:bg-background-blue"} group flex justify-center items-center rounded-md p-2 duration-200`}>
          <IoSettingsOutline className={`${isActiveLink("/settings") ? "text-white" : "group-hover:text-hover-primary-text-color"} w-9 h-9 block cursor-pointer text-primary-text-color duration-200`} />
        </NavLink>
      </div>
      <div className="flex flex-col items-center gap-4">
        <button className="cursor-pointer" onClick={() => setProfile(true)} title={user?.firstName}>
          <Avatar imageUrl={user?.profile_pic} imageName={user?.firstName} userId={user?._id} className="w-14 h-14 xs:w-12 xs:h-12" />
        </button>
        {/* <ThemeSwitch /> */}
        <button className="group block cursor-pointer" title="logout" onClick={handleLogout}>
          <CiLogout className="w-9 h-9 text-primary-text-color duration-200 group-hover:text-gray-500" />
        </button>
      </div>
      <EditProfile user={user} />
    </aside>
  );
}
