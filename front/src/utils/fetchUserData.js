import axios from "axios";
import { checkToken } from "./chechToken";
import { logout, setUser } from "../redux/userSlice";
import { toastMessage } from "../helpers/toastMessage";

export const fetchUserData = async (dispatch) => {
  if (!checkToken(dispatch)) return;

  try {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/user-data`;
    const response = await axios({
      method: "get",
      url: url,
      withCredentials: true,
    });

    dispatch(setUser(response?.data?.data));

    if (response?.data?.logout) {
      dispatch(logout());
    }
  } catch (error) {
    toastMessage("error", error?.message);
  }
};