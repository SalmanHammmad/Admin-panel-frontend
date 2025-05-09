import React, { useState, useEffect } from "react";
import { ExpandMore, ExpandLess, Delete } from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedServiceId, setExpandedServiceId] = useState(null);

  const apiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiURL}/services`);
        if (!response.ok) throw new Error("Failed to fetch services");
        const result = await response.json();
        setServices(result);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this service?");
    if (!confirm) return;

    try {
      const res = await fetch(`${apiURL}/services/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("Error deleting service: " + err.message);
    }
  };

  const handleExpandToggle = (id) => {
    setExpandedServiceId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI, sans-serif", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Manage Services</h2>
      {loading && <LinearProgress />}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {services.length === 0 && !loading && <p>No services to display.</p>}

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {services.map((service) => (
          <div
            key={service._id}
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              overflow: "hidden",
              transition: "0.3s",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", padding: "1rem", borderBottom: "1px solid #eee" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#333" }}>{service.title}</h3>
                <p style={{ margin: "0.3rem 0", color: "#777", fontSize: "0.95rem" }}>
                  Status:{" "}
                  <span
                    style={{
                      color:
                        service.status === "active"
                          ? "green"
                          : service.status === "inactive"
                          ? "gray"
                          : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {service.status?.toUpperCase() || "N/A"}
                  </span>
                </p>
              </div>

              <div>
                <IconButton onClick={() => handleDelete(service._id)} title="Delete">
                  <Delete style={{ color: "#d11a2a" }} />
                </IconButton>
                <IconButton onClick={() => handleExpandToggle(service._id)} title="Show Details">
                  {expandedServiceId === service._id ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </div>
            </div>

            {/* Basic Description */}
            <div style={{ padding: "1rem", fontSize: "0.95rem", color: "#444" }}>
              {service.description || "No description available"}
            </div>

            {/* Expandable Details */}
            {expandedServiceId === service._id && (
              <div style={{ padding: "1rem", backgroundColor: "#fafafa", borderTop: "1px solid #eee" }}>
                {service.image && (
                  <div style={{ marginBottom: "1rem" }}>
                    <strong>Image:</strong>
                    <div style={{ marginTop: "0.5rem" }}>
                      <img
                        src={service.image}
                        alt={service.title}
                        style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
                      />
                    </div>
                  </div>
                )}

                <p><strong>Category:</strong> {service.category || "N/A"}</p>
                <p><strong>Subcategory:</strong> {service.subcategory || "N/A"}</p>
                <p><strong>Price:</strong> Rs. {service.price || "0"}</p>
                <p><strong>Min Hours:</strong> {service.minHours || "N/A"}</p>
                <p><strong>Provider Name:</strong> {service.providerName || "N/A"}</p>
                <p><strong>Provider Email:</strong> {service.providerEmail || "N/A"}</p>
                <p><strong>Created At:</strong> {new Date(service.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(service.updatedAt).toLocaleString()}</p>
                <p><strong>Service ID:</strong> {service._id}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceManager;
