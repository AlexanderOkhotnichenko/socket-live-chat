import React, { useContext } from "react";
import moment from "moment";
import TailSpin from "react-loading-icons/dist/esm/components/tail-spin";
import { IoClose } from "react-icons/io5";
import { MainContext } from "../../context/rootContext";

export function Message({ user, message, setMessage, isLoading, allMessage, currentMessage }) {
  const { inputUploadedImageRef, inputUploadedVideoRef } = useContext(MainContext);

  const handleDeleteUploadedImage = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });

    inputUploadedImageRef.current.value = "";
  };

  const handleDeleteUploadedVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });

    inputUploadedVideoRef.current.value = "";
  };
  
  return (
    <section className="relative">
      {isLoading ? (
          <div className="absolute w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-65 z-30">
            <div className="w-full h-full flex items-center justify-center">
              <TailSpin />
            </div>
          </div>
        ) : (
          ""
      )}
      <div className="flex flex-col-reverse w-full h-[calc(100vh-130px)] overflow-x-hidden overflow-y-scroll scrollbar">
        {message?.imageUrl ? (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-65 z-30">
            <div
              className={`${
                isLoading
                  ? "before:bg-opacity-65 before:pointer-events-none"
                  : "before:bg-opacity-0 before:pointer-events-none"
              } bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md opacity-1 overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gray-600`}
            >
              <div className="flex justify-between py-2 mx-2.5 border-b">
                <button
                  className="group p-1 cursor-pointer"
                  onClick={handleDeleteUploadedImage}
                >
                  <IoClose
                    size={24}
                    className="duration-200 fill-blue-custome group-hover:fill-blue-500"
                  />
                </button>
                <div className="text-lg">Send Photo</div>
              </div>
              <div className="py-2 p-2.5 max-w-450">
                <img
                  src={message?.imageUrl}
                  alt="uploadImage"
                  className="block w-full min-w-64 rounded-md max-h-[calc(80vh-130px)] object-contain"
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {message?.videoUrl ? (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-65 z-30">
            <div className="bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md opacity-1 overflow-hidden">
              <div className="flex justify-between py-2 mx-2.5 border-b">
                <button
                  className="group p-1 cursor-pointer"
                  onClick={handleDeleteUploadedVideo}
                >
                  <IoClose
                    size={24}
                    className="duration-200 fill-blue-custome group-hover:fill-blue-500"
                  />
                </button>
                <div className="text-lg">Send Video</div>
              </div>
              <div className="py-2 p-2.5 max-w-450">
                <video
                  src={message?.videoUrl}
                  controls
                  className="block w-full h-auto min-w-64 rounded-md"
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="flex flex-col gap-2.5 p-2" ref={currentMessage}>
          {allMessage.map((msg, index) => {
            return (
              <div key={index} className={`px-3 py-1.5 rounded-md w-fit max-w-80 shadow-md break-words ls:max-w-[280px] ${user?._id === msg?.msgByUserId ? "ml-auto bg-blue-200" : "bg-[rgb(228,238,249)]"}`}>
                <div className="flex flex-col w-full relative">
                  {
                    msg?.imageUrl && (
                      <div className="w-full max-w-64 mb-2 mx-auto">
                        <img src={msg?.imageUrl} alt="" className="block rounded-md w-full h-full object-scale-down" />
                      </div>)
                  }
                  {
                    msg?.videoUrl && (
                      <div className="w-full max-w-64 mb-2 mx-auto">
                        <video src={msg?.videoUrl} className="block rounded-md w-full h-full object-scale-down" controls></video>
                      </div>)
                  }
                  <p className="text-base">{msg?.text}</p>
                  <span className={`block text-sm text-blue-500 ${user?._id === msg?.msgByUserId ? "text-right" : ""}`}>
                    {moment(msg.createdAt).format("hh:mm")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
