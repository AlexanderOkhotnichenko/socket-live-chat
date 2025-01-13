import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { toastMessage } from "../../helpers/toastMessage"
import { schemaEmail } from "./schemaLogin";
import TailSpin from "react-loading-icons/dist/esm/components/tail-spin";

export function Email() {
  const [data, setData] = useState({ email: "" });
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const toastSuccess = (message) => {
    return toast.success(message, {
      position: "top-right",
      autoClose: 3000,
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

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setDisabled(true);
      setErrors({});

      await schemaEmail.validate({ email: data.email }, { abortEarly: false });

      const url = `${import.meta.env.VITE_BACKEND_URL}/api/email`;
      const response = await axios.post(url, data);

      if (response?.data?.success) {
        setData({ email: "" });
        toastMessage("success", response?.data?.message);
        setDisabled(false);
        navigate("/password", {
          state: response?.data?.data,
        });
      }
    } catch (error) {
      console.log(errors);
      const validationErrors = {};

      if (error.inner) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
      } else if (error?.response?.data?.message) {
        validationErrors.general = error.response.data.message;
      }

      setErrors(validationErrors);
      setDisabled(false);
    }
  };

  return (

      <section className="flex w-full max-w-450 border border-solid border-container rounded-md bg-white p-5 shadow-md">
        <div className="w-full">
          <form className="flex flex-col w-full h-full" onSubmit={handleSubmit}>
            <h2 className="relative text-3xl text-center mb-8 font-semibold text-blue-custome before:content-[''] before:absolute before:-bottom-2.5 before:left-1/2 before:-translate-x-1/2 before:w-16 before:h-1 before:rounded before:bg-blue-custome">Email checked</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className={`relative flex bg-slate-200 rounded overflow-hidden ${errors?.email ? "border-b-2 border-red-600" : ""}`}>
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
            </div>
            <div className="flex gap-4 mt-6">
              <button
                className="flex justify-center items-center w-1/2 text-center p-2.5 rounded text-lg text-neutral-200 font-semibold cursor-pointer bg-blue-custome duration-200 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-auto disabled:hover:bg-blue-400"
                type="submit"
                disabled={disabled}
              >
                {disabled ? <TailSpin className="w-7 h-7" /> : "Next"}
              </button>
              <Link
                to={"/register"}
                className={`flex justify-center items-center w-1/2 text-center p-2.5 rounded text-lg font-semibold bg-slate-200 text-blue-600 duration-200 hover:bg-slate-300 ${disabled ? "bg-slate-100 text-blue-400 cursor-auto pointer-events-none" : ""}`}
              >
                Register
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
