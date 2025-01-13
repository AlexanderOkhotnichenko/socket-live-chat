import { jwtDecode } from "jwt-decode";
import { logout } from "../redux/userSlice";
import axios from "axios";

export const checkToken = async (dispatch) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/check-cookie`, {
      withCredentials: true,
    });
    
    const token = response?.data?.token;

    if (!token) {
      dispatch(logout());

      return false;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
        withCredentials: true,
      });
      dispatch(logout());

      return false;
    }

    const timeLeft = (decodedToken.exp - currentTime) * 1000;

    setTimeout(async () => {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
        withCredentials: true,
      });
      dispatch(logout());
      localStorage.removeItem("token");
      window.location.reload();
    }, timeLeft);

    return true;
  } catch (error) {
    console.error("Error during token validation:", error?.message);
    dispatch(logout());
    
    return false;
  }
};