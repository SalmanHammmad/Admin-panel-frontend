// frontend/components/DeleteDataArray.jsx
import React, { useState } from "react";
import { apiRequest } from "../utils/apiUtils";
import DeleteButton from "./buttons/DeleteButton";
import { ErrorAlert, SuccessAlert } from "./alerts/Alerts";

const DeleteData = ({ route, Id, onDelete }) => {
  const [alert, setAlert] = useState({ type: "", message: "" });
  const apiURL = import.meta.env.VITE_API_URL;

  const handleDelete = async () => {
    if (!Id) {
      console.error("Delete Error: ID is undefined");
      setAlert({
        type: "error",
        message: "Cannot delete: Item ID is missing.",
      });
      return;
    }

    const isValidId = /^[0-9a-fA-F]{24}$/.test(Id);
    if (!isValidId) {
      console.error("Delete Error: Invalid ID format:", Id);
      setAlert({
        type: "error",
        message: "Cannot delete: Invalid item ID format.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Delete Error: No token found in localStorage");
        setAlert({
          type: "error",
          message: "Please log in to perform this action.",
        });
        window.location.href = "/login";
        return;
      }
      console.log(`Deleting ${route}/${Id} from ${apiURL}`);
      const response = await apiRequest(`${apiURL}/${route}/${Id}`, "DELETE");
      console.log("Delete Response:", response);
      onDelete(Id);
      setAlert({
        type: "success",
        message: `Item with ID ${Id} deleted successfully.`,
      });
    } catch (error) {
      console.error("Delete Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        fullResponse: error.response?.data,
      });
      setAlert({
        type: "error",
        message:
          error.response?.status === 400
            ? "Invalid marquee ID"
            : error.response?.status === 401
            ? "Unauthorized: Please log in again"
            : error.response?.status === 403
            ? "Unauthorized: You can only delete your own marquees"
            : error.response?.status === 404
            ? "Marquee not found"
            : error.response?.data?.message || `Failed to delete the item: ${error.message}`,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  return (
    <div>
      {alert.type === "error" && <ErrorAlert message={alert.message} />}
      {alert.type === "success" && <SuccessAlert message={alert.message} />}
      <DeleteButton onDelete={handleDelete} />
    </div>
  );
};

export default DeleteData;