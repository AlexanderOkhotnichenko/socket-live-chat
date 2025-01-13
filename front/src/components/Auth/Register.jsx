import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {FaUserAlt, FaEnvelope, FaLock, FaUnlock } from "react-icons/fa";
import { MdAddAPhoto, MdRemoveRedEye } from "react-icons/md";
import { HiEyeSlash } from "react-icons/hi2";
import { TailSpin } from "react-loading-icons";
import { uploadFile } from "../../helpers/uploadFile";
import { schema } from "./schemaRegister";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Register() {
  const [data, setData] = useState({
    firstName: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [errors, setErrors] = useState({});
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const toastSuccess = (message) => {
    return toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;

    if (name === "confirmpassword") {
      setConfirmPassword(value);
    } else {
      setData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  const handleUploadPhoto = async (event) => {
    const file = event.target.files[0];

    if (file) {
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
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = { ...data, confirmPassword };
    try {
      setDisabled(true);

      await schema.validate(formData, { abortEarly: false });
      setErrors({});

      const url = `${import.meta.env.VITE_BACKEND_URL}/api/register`;
      const response = await axios.post(url, data);

      if (response.data.success) {
        setData({
          firstName: "",
          email: "",
          password: "",
          profile_pic: "",
        });
        setPreviewPhoto("");
        setConfirmPassword("");
        toastSuccess(response.data.message);
        setDisabled(false);
        console.log("response:", response);
      }
    } catch (error) {
      const validationErrors = {};

      if (
        error?.response &&
        error?.response?.status >= 400 &&
        error?.response?.status <= 500
      ) {
        setDisabled(false);
      }

      if (error.inner) {
        for (let err of error.inner) {
          if (!validationErrors[err.path]) {
            validationErrors[err.path] = err.message;
            setDisabled(false);
            break;
          }
        }
      } else if (error?.response && error?.response?.data?.message) {
        validationErrors.general = error?.response?.data?.message;
        setDisabled(false);
      }

      setErrors(validationErrors);
    }
  };

  return (
      <section className="flex w-full border border-solid border-container rounded-md bg-white p-5 shadow-md max-w-450 h-fit">
        <div className="w-full">
          <form className="flex flex-col w-full h-full" onSubmit={handleSubmit}>
            <h2 className="relative text-3xl text-center mb-8 font-semibold text-blue-custome before:content-[''] before:absolute before:-bottom-2.5 before:left-1/2 before:-translate-x-1/2 before:w-16 before:h-1 before:rounded before:bg-blue-custome">Create Account</h2>
            <div className="flex flex-col gap-4">
              <label
                htmlFor="profile_pic"
                className={`group relative w-36 h-36 mx-auto cursor-pointer mb-2 overflow-hidden rounded-md before:content-[''] before:absolute before:z-10 before:w-full before:h-full before:duration-200 before:opacity-0 before:bg-gray-400 before:bg-opacity-70 hover:before:opacity-100 ${isLoading ? "pointer-events-none" : ""}`}>
                {isLoading ? (
                  <div className="absolute w-full h-full flex items-center justify-center z-30" style={{ backgroundColor: "rgba(51, 65, 85, 0.45)" }}>
                    <TailSpin />
                  </div>
                ) : (
                  ""
                )}
                {previewPhoto ? (
                  <div className="w-full h-full">
                    <img src={previewPhoto} alt="Preview" className="block w-full h-full bg-center object-cover" />
                  </div>
                ) : (
                  <div className="relative w-full h-full bg-slate-200">
                    <FaUserAlt className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-slate-500 z-10" />
                  </div>
                )}
                <MdAddAPhoto className="group-hover:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl opacity-0 duration-200 z-20 text-slate-200" />
                <input
                  type="file"
                  id="profile_pic"
                  name="profile_pic"
                  placeholder="Upload profile photo"
                  className="hidden bg-slate-100 text-lg w-full p-2"
                  onChange={handleUploadPhoto}
                  disabled={disabled || isLoading}
                />
              </label>
              <div>
                <label
                  htmlFor="firstName"
                  className={`relative flex bg-slate-200 rounded overflow-hidden ${errors?.firstName ? "border-b-2 border-red-600" : ""}`}>
                  <div className="flex items-center justify-center min-w-11 bg-slate-300 p-3">
                    <FaUserAlt className="text-xl text-slate-500" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    className="block text-lg w-full h-full px-2 py-3 bg-transparent"
                    value={data.firstName}
                    onChange={handleOnChange}
                    disabled={disabled}
                  />
                </label>
                {errors?.firstName && (
                  <div className="text-white mt-2 px-1.5 py-1 text-base bg-red-500 rounded">
                    {errors?.firstName}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className={`relative flex bg-slate-200 rounded overflow-hidden ${
                    errors?.email ? "border-b-2 border-red-600" : ""
                  }`}
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
                    value={data.email}
                    onChange={handleOnChange}
                    disabled={disabled}
                  />
                </label>
                {errors?.email && (
                  <div className="text-white mt-2 px-1.5 py-1 text-base bg-red-500 rounded">{errors?.email}</div>
                )}
              </div>
              <div className="flex gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className={`relative flex bg-slate-200 rounded overflow-hidden ${
                      errors?.password ? "border-b-2 border-red-600" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center min-w-11 bg-slate-300 p-3">
                      <FaLock className="text-xl text-slate-500" />
                    </div>
                    <input
                      type={viewPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="block text-lg w-full h-full px-2 py-3 bg-transparent"
                      value={data.password}
                      onChange={handleOnChange}
                      disabled={disabled}
                    />
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 cursor-pointer text-slate-700 text-xl" onClick={() => (setViewPassword(!viewPassword))}>{viewPassword ? <HiEyeSlash />: <MdRemoveRedEye />}</span>
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="confirmpassword"
                    className={`relative flex bg-slate-200 rounded overflow-hidden ${
                      errors?.confirmPassword ? "border-b-2 border-red-600" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center min-w-11 bg-slate-300 p-3">
                      <FaUnlock className="text-xl text-slate-500" />
                    </div>
                    <input
                      type={viewPassword ? 'text' : 'password'}
                      id="confirmpassword"
                      name="confirmpassword"
                      placeholder="Confirm password"
                      className="block text-lg w-full h-full px-2 py-3 bg-transparent"
                      value={confirmPassword}
                      onChange={handleOnChange}
                      disabled={disabled}
                    />
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 cursor-pointer text-slate-700 text-xl" onClick={() => (setViewPassword(!viewPassword))}>{viewPassword ? <HiEyeSlash />: <MdRemoveRedEye />}</span>
                  </label>
                </div>
              </div>
            </div>
            {errors?.password && (
                  <div className="text-white mt-2 px-1.5 py-1 text-base bg-red-500 rounded">{errors?.password}</div>
                )}
              {errors?.confirmPassword && (
                <div className="text-white mt-2 px-1.5 py-1 text-base bg-red-500 rounded">
                  {errors?.confirmPassword}
                </div>
              )}
            <div className="flex gap-4 mt-6">
              <button
                className="flex justify-center items-center w-1/2 text-center p-2.5 rounded text-lg text-neutral-200 font-semibold cursor-pointer bg-blue-custome duration-200 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-auto disabled:hover:bg-blue-400"
                type="submit"
                disabled={disabled}
              >
                {disabled ? (
                  <TailSpin className="w-7 h-7" />
                ) : (
                  "Register"
                )}
              </button>
              <Link
                to={"/email"}
                className={`flex justify-center items-center w-1/2 text-center p-2.5 rounded text-lg bg-slate-200 text-blue-600 font-semibold duration-200 hover:bg-slate-300 ${
                  disabled ? "bg-slate-100 text-blue-400 cursor-auto pointer-events-none" : ""
                }`}
              >
                Login
              </Link>
            </div>
            {errors?.general && (
              <div className="text-white mt-2 px-1.5 py-1 text-base bg-red-500 rounded">{errors?.general}</div>
            )}
          </form>
        </div>
      </section>
  );
}
