import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TiArrowLeft } from "react-icons/ti";
import { Avatar } from "../Avatar";
import { Link } from "react-router-dom";

export function ChatProfile({ dataUser }) {
  return (
    <section className="w-full bg-white border-b-2">
      <div className="flex py-2 px-4 xs:px-1.5">
        <Link to="/" className="items-center mr-2.5 hidden text-primary-text-color md:flex">
          <TiArrowLeft size={36} />
        </Link>
        <Avatar imageUrl={dataUser?.profile_pic} imageName={dataUser?.firstName} userId={dataUser?._id} size={3} className="mr-2.5" />
        <div className="flex flex-col justify-center flex-grow">
          <h4 className="block text-lg leading-5">{dataUser?.firstName}</h4>
          <span className={`block text-sm ${dataUser?.online ? "text-blue-custome" : "text-gray-500"}`}>
            {dataUser?.online ? "online" : "offline"}
          </span>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex">
            <button className="group block ml-1 p-1.5 rounded-50% hover:bg-blue-100 duration-200">
              <BsThreeDotsVertical className="block text-xl duration-200 group-hover:text-blue-custome" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
