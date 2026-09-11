import { toast } from "react-toastify";
export const showToaster = (message: string, type: "success" | "error" | "info" | "warning" = "success") => {
  toast(message, { type });
};
