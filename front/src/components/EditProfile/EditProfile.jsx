import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toastMessage } from "../../helpers/toastMessage";
import { MainContext } from "../../context/rootContext";
import { AnimatePresence, motion } from "framer-motion";
import { FaEnvelope, FaUserAlt, FaTimes } from "react-icons/fa";
import { LuImagePlus } from "react-icons/lu";
import { TailSpin } from "react-loading-icons";
import { uploadFile } from "../../helpers/uploadFile";
import { setUser } from "../../redux/userSlice";
import "react-toastify/dist/ReactToastify.css";

export const EditProfile = React.memo(function EditProfile({ user }) {
  const { profile, setProfile } = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    firstName: user?.user,
    profile_pic: user?.profile_pic,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      ...user,
    }));
  }, [user]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;

    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleUploadPhoto = async (event) => {
    const file = event.target.files[0];
    setIsLoading(true);

    try {
      const uploadPhoto = await uploadFile(file);

      setData((prev) => {
        return {
          ...prev,
          profile_pic: uploadPhoto?.url,
        };
      });
      setPreviewPhoto(uploadPhoto?.url);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/update-user`;
      const { socketConnection, onlineUser, token, ...sanitizedData } = data;
      const response = await axios({
        method: "post",
        url: url,
        data: sanitizedData,
        withCredentials: true,
      });

      if (response?.data?.success) {
        dispatch(setUser(response?.data?.data));
        toastMessage("success", response?.data?.message);
        setIsLoading(false);
        setProfile(false);
      }
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: "50px",
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: "0",
      transition: { delay: 0.3, duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: "0",
    },
  };

  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-6 xs:p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={() => setProfile(false)}
        >
          <motion.div
            className="flex w-full max-w-450 border rounded-md bg-white p-5 shadow-sm"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
          >
            <form
              className="relative flex flex-col w-full h-full"
              onSubmit={handleSubmit}
            >
              <span
                className={`${
                  isLoading ? "pointer-events-none" : ""
                } absolute -top-8 -right-8 flex items-center justify-center w-8 h-8 rounded-full bg-background-blue cursor-pointer`}
                onClick={() => setProfile(false)}
              >
                <FaTimes className="block text-white" />
              </span>
              <h2 className="relative text-3xl text-center mb-8 font-semibold text-blue-custome before:content-[''] before:absolute before:-bottom-2.5 before:left-1/2 before:-translate-x-1/2 before:w-16 before:h-1 before:rounded before:bg-background-blue">
                Edit profile
              </h2>
              <label htmlFor="profile_pic" className={`${
                  isLoading ? "pointer-events-none" : ""
                } group relative w-36 h-36 mx-auto cursor-pointer mb-6 overflow-hidden rounded-md hover:before:opacity-100 before:content-[''] before:absolute before:z-10 before:w-full before:h-full before:duration-200 before:opacity-0 before:bg-slate-700 before:bg-opacity-45`}
              >
                {isLoading ? (
                  <div className="absolute w-full h-full flex items-center justify-center z-30 bg-opacity-45">
                    <TailSpin />
                  </div>
                ) : (
                  ""
                )}
                {data?.profile_pic ? (
                  <div className="w-full h-full">
                    <img
                      src={data?.profile_pic}
                      alt="Preview"
                      className="block w-full h-full bg-center object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full bg-slate-200">
                    <FaUserAlt className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-slate-500 z-10" />
                  </div>
                )}
                <LuImagePlus className="group-hover:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl opacity-0 duration-300 z-20 text-slate-200" />
                <input
                  type="file"
                  id="profile_pic"
                  name="profile_pic"
                  placeholder="Update profile photo"
                  className="hidden bg-slate-100 text-lg w-full p-2"
                  onChange={handleUploadPhoto}
                  disabled={isLoading}
                />
              </label>
              <label
                htmlFor="firstName"
                className={`${
                  isLoading ? "pointer-events-none bg-slate-200 opacity-70" : ""
                } relative flex bg-slate-200 rounded overflow-hidden mb-4 last:mb-4`}
              >
                <div className="flex items-center justify-center min-w-11 bg-slate-300 p-3">
                  <FaUserAlt className="text-xl text-slate-500" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Edit name"
                  className="block text-lg w-full h-full px-2 py-3 bg-transparent"
                  value={data?.firstName}
                  onChange={handleOnChange}
                />
              </label>
              <label
                htmlFor="email"
                className="relative flex bg-slate-200 rounded overflow-hidden opacity-70 pointer-events-none mb-4 last:mb-4"
              >
                <div className="flex items-center justify-center min-w-11 bg-slate-300 p-3">
                  <FaEnvelope className="text-xl text-slate-500" />
                </div>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="block text-lg w-full h-full px-2 py-3 bg-transparent"
                  disabled={true}
                  value={data?.email}
                />
              </label>
              <button
                className="flex justify-center items-center w-full max-w-[200px] p-2.5 rounded text-lg text-neutral-200 font-semibold bg-blue-custome duration-300 mx-auto hover:bg-blue-700 disabled:hover:bg-blue-400 disabled:bg-blue-400 disabled:cursor-auto"
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <TailSpin className="w-7 h-7" />
                ) : (
                  "Update profile"
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
