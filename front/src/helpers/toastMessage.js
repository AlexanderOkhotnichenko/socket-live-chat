import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function toastMessage(type = 'default', message) {
  const options = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  };

  switch (type) {
    case 'info':
      toast.info(message, options);
      break;
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warn':
      toast.warn(message, options);
      break;
    default:
      toast(message, options);
  }
}
