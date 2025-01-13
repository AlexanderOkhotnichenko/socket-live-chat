import React, { useContext, useState } from 'react'
import { PiLink, PiTelegramLogo } from 'react-icons/pi'
import { MainContext } from "../../context/rootContext";
import { IoImage, IoVideocam } from 'react-icons/io5';
import { toastMessage } from '../../helpers/toastMessage';
import { uploadFile } from '../../helpers/uploadFile';
import { useParams } from 'react-router-dom';

export function ChatActionBar({ user, message, setMessage, socketConnection, isLoading, setIsLoading }) {
  const { inputUploadedImageRef, inputUploadedVideoRef } = useContext(MainContext);
  const [openUploadFile, setOpenUploadFile] = useState(false);
  const params = useParams();
  let timeoutId;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setOpenUploadFile(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setOpenUploadFile(false);
    }, 500);
  };

  const handleUploadImage = async (event) => {
      const file = event.target.files[0];
      const validImageFormat = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      setIsLoading(true);
  
      if (!validImageFormat.includes(file.type)) {
        toastMessage("error", "Invalid file type");
        setIsLoading(false);
        return;
      }
  
      setMessage((prev) => ({
        ...prev,
        imageUrl: "",
        videoUrl: "",
      }));
      inputUploadedVideoRef.current.value = "";
  
      try {
        const uploadImage = await uploadFile(file);
  
        setMessage((prev) => {
          return {
            ...prev,
            imageUrl: uploadImage?.url,
          };
        });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
  
    const handleUploadVideo = async (event) => {
      const file = event.target.files[0];
      const validVideoFormat = ["video/mp4", "video/quicktime", "video/webm"];
      setIsLoading(true);
  
      if (!validVideoFormat.includes(file.type)) {
        toastMessage("error", "Invalid file type");
        setIsLoading(false);
        return;
      }
  
      setMessage((prev) => ({
        ...prev,
        imageUrl: "",
        videoUrl: "",
      }));
      inputUploadedImageRef.current.value = "";
  
      try {
        const uploadVideo = await uploadFile(file);
  
        setMessage((prev) => {
          return {
            ...prev,
            videoUrl: uploadVideo?.url,
          };
        });
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    const handleMessageText = (event) => {
      const { name, value } = event.target;
  
      setMessage((prev) => {
        return {
          ...prev,
          text: value,
        };
      });
    };
  
    const handleSendMessage = (event) => {
      event.preventDefault();
  
      if (message?.text || message?.imageUrl || message?.videoUrl) {
        if (socketConnection) {
          socketConnection.emit("new message", {
            sender: user?._id,
            receiver: params?.userId,
            text: message?.text,
            imageUrl: message?.imageUrl,
            videoUrl: message?.videoUrl,
            msgByUserId: user?._id,
          });
          setMessage({
            text: "",
            imageUrl: "",
            videoUrl: "",
          });

          inputUploadedImageRef.current.value = '';
          inputUploadedVideoRef.current.value = '';
        }
      }
    };

  return (
    <section className="flex gap-4 bg-white h-16 border-t-2">
            <div className="flex justify-between items-center gap-4 w-full pr-4">
              <div className="flex relative w-full rounded">
                <button disabled={isLoading} className={`${isLoading ? "cursor-not-allowed" : "cursor-auto"} group px-4 py-4`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <PiLink className={`${isLoading ? "pointer-events-none fill-blue-400" : "pointer-events-auto"} fill-blue-custome w-8 h-8 duration-200 group-hover:fill-blue-400`} />
                </button>
                {/* uploaded image || video */}
                <form className={`${openUploadFile ? "opacity-100 scale-1 -top-20 pointer-events-auto" : "opacity-0 scale-90 -top-16 pointer-events-none"} ${isLoading ? "z-10" : "z-30"} absolute left-4 rounded duration-200 bg-white shadow overflow-hidden p-1.5`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <label htmlFor="uploadImage" className="group flex gap-2.5 cursor-pointer p-1 px-2 hover:bg-blue-100 rounded duration-200">
                    <IoImage className="text-blue-custome w-6 h-6" />
                    <input id="uploadImage" type="file" ref={inputUploadedImageRef} onChange={handleUploadImage} accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" className="hidden" />
                    <span className="block">Image</span>
                  </label>
                  <label
                    htmlFor="uploadVideo"
                    className="group flex gap-2.5 cursor-pointer p-1 px-2 hover:bg-blue-100 rounded duration-200"
                  >
                    <IoVideocam className="text-blue-custome w-6 h-6" />
                    <input
                      id="uploadVideo"
                      type="file"
                      ref={inputUploadedVideoRef}
                      onChange={handleUploadVideo}
                      accept="video/mp4,video/quicktime,video/webm"
                      className="hidden"
                    />
                    <span className="block">Video</span>
                  </label>
                </form>
                <span className="block border my-4"></span>
                {/* message text */}
                <form
                  className="flex justify-between items-center gap-4 w-full"
                  onSubmit={handleSendMessage}
                >
                  <input
                    type="text"
                    placeholder="Write a message..."
                    className="block w-full h-full p-4"
                    style={{ background: "none" }}
                    value={message?.text}
                    onChange={handleMessageText}
                  />
                  <button className="flex items-center justify-center w-12 h-12 p-2.5 bg-blue-custome rounded cursor-pointer hover:bg-blue-600 duration-200">
                    <PiTelegramLogo className="fill-white w-6 h-6" />
                  </button>
                </form>
              </div>
            </div>
          </section>
  )
}
