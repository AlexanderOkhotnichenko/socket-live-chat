import React, { useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { IoCheckmark } from "react-icons/io5";
import { Avatar } from "../Avatar";
import { IoPersonAddSharp } from "react-icons/io5"

export function ListChats({ allUsers, setAllUsers }) {
  const user = useSelector((state) => state?.user);
  const socketConnection = useSelector((state) => state?.user?.socketConnection);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("user-list", user?._id);
      socketConnection.on("conversation", (data) => {
        const conversationUserData = data.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userData: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userData: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userData: conversationUser.sender,
            };
          }
        });

        setAllUsers(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  return (
    <ul className="flex flex-col gap-2.5 flex-1">
      {!allUsers.length &&
      <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-8">
        <IoPersonAddSharp size={48} className="mb-4 text-gray-300" />
        <p className="text-lg">No users available</p>
        <p className="text-sm">Start a conversation with someone!</p>
      </div>}
      {allUsers.map((conversation, index) => {
        return (
          <li key={index} className="bg-[rgb(240,244,250)] shadow cursor-pointer rounded-md duration-200 group hover:bg-blue-custome">
            <NavLink key={conversation?._id} to={"/" + conversation?.userData?._id} id={conversation?.receiver?._id} title={conversation?.receiver?.firstName} className="flex gap-2 p-2">
              <div>
                <Avatar
                  imageUrl={conversation?.userData?.profile_pic}
                  imageName={conversation?.userData?.firstName}
                  userId={conversation?.userData?._id}
                  size={3}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold pr-2 duration-200 group-hover:text-white">{conversation?.userData?.firstName}</h3>
                  <div className="flex items-center">
                    <span className={`${conversation?.lastMsg?.seen ? 'text-blue-custome group-hover:text-white' : 'text-gray-500 group-hover:text-white'} relative w-4 h-4 text-base duration-200`}>
                      <IoCheckmark className="absolute -left-1 duration-200" />
                      <IoCheckmark className={`${conversation?.lastMsg?.seen ? 'left-0' : '-left-1'} absolute duration-200`} />
                    </span>
                    <span className="block text-sm text-gray-500 duration-200 group-hover:text-white">{moment(conversation?.lastMsg?.createdAt).format("hh:mm")}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between overflow-hidden">
                  <p className="flex max-w-[240px] text-gray-600 pr-1 duration-200 group-hover:text-white xs:max-w-[210px] ls:max-w-[150px]">
                    {conversation?.lastMsg?.imageUrl && (
                      <div className="flex gap-1 items-end pr-1">
                        <img src={conversation?.lastMsg?.imageUrl || ""} className="block w-6 h-6 object-scale-down" />
                        {!conversation?.lastMsg?.text && <span className="block text-gray-600 duration-200 group-hover:text-white">Photo</span>}
                      </div>
                    )}
                    {conversation?.lastMsg?.videoUrl && (
                      <div className="flex gap-1 items-end">
                        <video src={conversation?.lastMsg?.videoUrl || ""} className="block w-6 h-6 object-scale-down" controls></video>
                        {!conversation?.lastMsg?.text && <span className="block text-gray-600 duration-200 group-hover:text-white">Video</span>}
                      </div>
                    )}
                    <span className="block overflow-hidden whitespace-nowrap text-ellipsis">{conversation?.lastMsg?.text}</span>
                  </p>
                  {
                    Boolean(conversation?.unseenMsg) && (
                      <span className='flex items-center justify-center text-sm text-white bg-blue-custome w-5 h-5 rounded-50% duration-200 group-hover:text-blue-custome group-hover:bg-white'>{conversation?.unseenMsg}</span>
                    )
                  }
                </div>
              </div>
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}
