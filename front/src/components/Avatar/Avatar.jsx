import React from "react";
import { useSelector } from "react-redux";
import defaultAvatar from "../../assets/img/defaultAvatar.jpg"

export function Avatar({ imageUrl, imageName, userId, size, className }) {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);
  const isOnline = onlineUser.includes(userId);

  return (
    <div className={`relative ${className}`} style={{ width: `${size}rem`, height: `${size}rem` }}>
      {isOnline && <span className="absolute bottom-0 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-10"></span>}
      <img src={imageUrl || defaultAvatar} alt={imageName || null} title={imageName || null} className="flex w-full h-full object-cover rounded-full" />
    </div>
  );
}