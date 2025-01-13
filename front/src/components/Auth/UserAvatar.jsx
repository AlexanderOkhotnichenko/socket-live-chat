import React from "react";
import { FaUserAlt } from "react-icons/fa";

export function UserAvatar({ userId, name, imgUrl }) {
  const Avatar = ({ url, name }) => {
    return (
      <div className="flex flex-col items-center gap-2 overflow-hidden">
        {url ? (
          <img src={url} alt={name} className="block w-32 h-32 object-cover rounded-50% shadow-md border" />
        ) : (
          <div className="relative bg-slate-200 w-32 h-32 rounded-md shadow-md border">
            <FaUserAlt className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-slate-500 z-10" />
          </div>
        )}
        <h3 className="text-slate-700 text-2xl">{name}</h3>
      </div>
    );
  };

  return (
    <div className="flex justify-center mb-6">
      <Avatar url={imgUrl} name={name} />
    </div>
  );
}
