import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { RegisterPage } from "../pages/RegisterPage";
import { EmailPage } from "../pages/EmailPage";
import { PasswordPage } from "../pages/PasswordPage";
import axios from "axios";

export function routes() {
  // const token = Cookies.get("token");
  // const token = localStorage.getItem("token");
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/check-cookie`, {
          withCredentials: true,
        });
        
        if (response?.data?.success) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      } catch (error) {
        setTokenValid(false);
      }
    };

    checkToken();
  }, []);

  return (
    <Routes>
      <Route path="/" element={tokenValid ? <HomePage /> : <Navigate to="/email" replace />} />
      <Route path="/*" element={tokenValid ? <HomePage /> : <Navigate to="/email" replace />} />
      <Route path="/:userId" element={tokenValid ? <HomePage /> : <Navigate to="/email" replace />} />
      <Route path="/email" element={!tokenValid ? <EmailPage /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!tokenValid ? <RegisterPage /> : <Navigate to="/" replace />} />
      <Route path="/password" element={!tokenValid ? <PasswordPage /> : <Navigate to="/" replace />} />
    </Routes>
  );
}