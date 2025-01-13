import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaLock } from "react-icons/fa";
import { MdRemoveRedEye } from "react-icons/md";
import { HiEyeSlash } from "react-icons/hi2";
import { setToken, setUser } from "../../redux/userSlice";
import { schemaPassword } from "./schemaLogin";
import { UserAvatar } from "./UserAvatar";
import { toastMessage } from "../../helpers/toastMessage";
import TailSpin from "react-loading-icons/dist/esm/components/tail-spin";

export function Password() {
  const [data, setData] = useState({ password: "" });
  const [viewPassword, setViewPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const location = useLocation().state;
  const navigate = useNavigate();

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

      await schemaPassword.validate(
        { password: data.password },
        { abortEarly: false }
      );

      const url = `${import.meta.env.VITE_BACKEND_URL}/api/password`;
      const response = await axios({
        method: 'post',
        url: url,
        data: {
          userId: location?._id,
          password: data?.password,
        },
        withCredentials: true
      });

      if (response?.data?.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem(`token`, response?.data?.token)
        
        setData({ password: "" });
        toastMessage("success", response?.data?.message);
        setDisabled(false);
        window.location.reload();
        navigate("/");
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
            <h2 className="relative text-3xl text-center mb-8 font-semibold text-blue-custome before:content-[''] before:absolute before:-bottom-2.5 before:left-1/2 before:-translate-x-1/2 before:w-16 before:h-1 before:rounded before:bg-blue-custome">Password</h2>
            <UserAvatar imgUrl={location?.profile_pic} name={location?.firstName} />
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="password" className={`relative flex bg-slate-200 rounded overflow-hidden ${errors?.password ? "border-b-2 border-red-600" : ""}`}>
                  <div className="flex items-center justify-center min-w-11 bg-slate-300 p-3">
                    <FaLock className="text-xl text-slate-500" />
                  </div>
                  <input
                    type={viewPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="block text-lg w-full h-full px-2 py-3 bg-transparent"
                    value={data.password}
                    onChange={handleOnChange}
                    disabled={disabled}
                  />
                  <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 cursor-pointer text-slate-700 text-xl"
                    onClick={() => setViewPassword(!viewPassword)}
                  >
                    {viewPassword ? <HiEyeSlash /> : <MdRemoveRedEye />}
                  </span>
                </label>
                {errors?.password && (
                  <div className="text-white mt-2 px-1.5 py-1 text-base bg-red-500 rounded">{errors?.password}</div>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                className="flex justify-center items-center w-1/2 text-center p-2.5 rounded text-lg text-neutral-200 font-semibold bg-blue-custome cursor-pointer bg-blue-custome duration-200 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-auto disabled:hover:bg-blue-400"
                type="submit"
                disabled={disabled}
              >
                {disabled ? <TailSpin className="w-7 h-7" /> : "Login"}
              </button>
              <Link
                to={"/register"}
                className={`flex justify-center items-center w-1/2 text-center p-2.5 rounded text-lg font-semibold bg-slate-200 text-blue-600 duration-200 hover:bg-slate-300 ${disabled ? "bg-slate-100 text-blue-400 cursor-auto pointer-events-none" : ""}`}
              >
                Register
              </Link>
            </div>
            Forgotpassword?
            {errors?.general && (
              <div className="text-white mt-2 px-1.5 py-1 text-base bg-red-500 rounded">{errors?.general}</div>
            )}
          </form>
        </div>
      </section>
  );
}
