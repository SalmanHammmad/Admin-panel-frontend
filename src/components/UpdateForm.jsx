// components/UpdateForm.jsx
import { useState } from "react";
import { apiRequest } from "../utils/apiUtils"; // Use the updated apiRequest
import { toast } from "react-toastify";

const UpdateForm = ({ apiEndpoint, entityId, entityType, fields, onUpdateSuccess }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {})
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await apiRequest(
        `${apiEndpoint}/${entityType}/${entityId}`,
        "PATCH",
        formData
      );
      toast.success(`${entityType} updated successfully`);
      onUpdateSuccess();
    } catch (error) {
      console.error(`Error updating ${entityType}:`, error);
      if (error.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (error.message.includes("Forbidden")) {
        setErrors({ general: "You do not have permission to update this resource" });
      } else {
        setErrors({ general: error.response?.data?.message || "Failed to update" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} className="mb-3">
          <label htmlFor={field.name} className="form-label">
            {field.label}
          </label>
          <input
            type={field.name.includes("Date") ? "datetime-local" : "text"}
            name={field.name}
            id={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
            required={field.required}
            disabled={isSubmitting}
          />
          {errors[field.name] && (
            <div className="invalid-feedback">{errors[field.name]}</div>
          )}
        </div>
      ))}
      {errors.general && <div className="alert alert-danger">{errors.general}</div>}
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default UpdateForm;