// utils/toastNotifications.js
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Default configuration for toast notifications
const defaultConfig = {
  position: 'bottom-left',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: 'light',
};

// Success message function
export const successMsg = (msg, config = {}) => {
  toast.success(msg, { ...defaultConfig, ...config });
};

// Error message function
export const errorMsg = (msg, config = {}) => {
  toast.error(msg, { ...defaultConfig, ...config });
};

// Other types of notifications can be added similarly

export const warnMsg = (msg, config = {}) => {
  toast.warn(msg, { ...defaultConfig, ...config });
};
