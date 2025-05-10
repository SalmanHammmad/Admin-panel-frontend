// components/event/Events.jsx
import React, { useState, useEffect } from "react";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import "./events.css";
import EditButton from "../buttons/EditButton";
import { useDataFetcher } from "../../hooks/useDataFetcher";
import DeleteData from "../DeleteData";
import LinearProgress from "@mui/material/LinearProgress";
import { useNavigate } from "react-router-dom";

const Events = ({ refreshKey, onUpdateEvent }) => {
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const { data, loading, error, setData, fetchData } = useDataFetcher(`${apiURL}/events`);
  const [expandedEventId, setExpandedEventId] = useState(null);

  const handleToggleDetails = (id) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((event) => event._id !== id));
  };

  useEffect(() => {
    console.log("Events useEffect triggered with refreshKey:", refreshKey);
    fetchData();
  }, [refreshKey, fetchData]);

  useEffect(() => {
    if (error && error.includes("Unauthorized")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [error, navigate]);

  return (
    <div className="events-container">
      {loading && <LinearProgress />}
      {error && <p className="error-message">{error}</p>}
      {data && data.length > 0 ? (
        <ol className="event-list">
          {data.map((event) => (
            <li key={event._id} className="event-item">
              <div className="event-header">
                <div className="event-main-info">
                  <h3 className="event-title">
                    {event.title}
                    <br />
                    <span
                      style={{
                        color:
                          event.status === "ongoing"
                            ? "green"
                            : event.status === "completed"
                            ? "blue"
                            : event.status === "upcoming"
                            ? "purple"
                            : event.status === "rejected"
                            ? "red"
                            : event.status === "pending"
                            ? "goldenrod"
                            : "#555",
                        fontSize: "0.8rem",
                        fontWeight: "lighter",
                      }}
                      className="event-status"
                    >
                      <span style={{ color: "#555", marginRight: "0.2rem" }}>
                        Status:
                      </span>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </h3>
                  <EditButton onClick={() => onUpdateEvent(event._id)} />
                  <DeleteData route="events" Id={event._id} onDelete={handleDelete} />
                  <button
                    className="toggle-details-button"
                    onClick={() => handleToggleDetails(event._id)}
                  >
                    {expandedEventId === event._id ? <ExpandLess /> : <ExpandMore />}
                  </button>
                </div>
                <hr />
                <p className="event-description">{event.description}</p>
              </div>
              {expandedEventId === event._id && (
                <div className="event-details">
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p>
                    <strong>Start Date:</strong> {new Date(event.startDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>End Date:</strong> {new Date(event.endDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>ID:</strong> {event._id}
                  </p>
                  <p>
                    <strong>Created By:</strong> {event.createdBy?.name || "Unknown"}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p>No events to display at this time.</p>
      )}
    </div>
  );
};

export default Events;