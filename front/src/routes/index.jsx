import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { RegisterPage } from "../pages/RegisterPage";
import { EmailPage } from "../pages/EmailPage";
import { PasswordPage } from "../pages/PasswordPage";
import { Loading } from "../components/Loading";

export function routes() {
  const [tokenValid, setTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        // setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  if (isLoading) {
    return <Loading />
  }

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