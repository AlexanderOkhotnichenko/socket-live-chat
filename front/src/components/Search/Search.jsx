import React from "react";
import { FaSearch } from "react-icons/fa";

export function Search({ id, background, placeholder, height, iconSize, iconColor, onChange, value }) {
  const defaultValue = {
    background: "rgb(240 244 250)",
    placeholder: "Search...",
    icon: {
      size: 20,
      color: "#60a5fa"
    },
  }

  return (
    <div className="w-full h-auto rounded overflow-hidden flex" style={{ backgroundColor: background || defaultValue.background, height: height }}>
      <input
        id={id}
        type="text"
        placeholder={placeholder || defaultValue.placeholder}
        className="block w-full h-full outline-none py-1 px-5 bg-transparent"
        onChange={onChange}
        value={value}
      />
      <div className="w-14 flex justify-center items-center">
        <FaSearch size={iconSize || defaultValue.icon.size} color={iconColor || defaultValue.icon.color} />
      </div>
    </div>
  );
}
