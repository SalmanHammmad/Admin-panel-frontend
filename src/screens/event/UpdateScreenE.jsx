// screens/UpdateScreenE.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UpdateForm from "../../components/UpdateForm";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const UpdateScreenE = ({ onUpdateSuccess }) => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEvent = async () => {
      console.log("Fetching event with ID:", eventId);
      const url = `${apiURL}/events/${eventId}`;
      console.log("Fetching from URL:", url);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            throw new Error("Unauthorized: Please log in again");
          }
          if (response.status === 403) {
            throw new Error("Forbidden: You cannot edit this event");
          }
          throw new Error(`Failed to fetch event. Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setEvent(data);
        } else {
          const text = await response.text();
          throw new Error(`Unexpected response format: ${text}`);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError(`Failed to load event data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, apiURL, navigate]);

  const handleSubmit = async () => {
    navigate("/events");
  };

  if (loading) return <Box sx={{ width: "100%" }}><LinearProgress /></Box>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>No event found.</p>;

  return (
    <div>
      <h2>Update Event</h2>
      <UpdateForm
        apiEndpoint={`${apiURL}/events`}
        entityId={event._id}
        entityType="events"
        fields={[
          { name: "title", label: "Title", required: true, value: event.title },
          { name: "location", label: "Location", required: true, value: event.location },
          { name: "description", label: "Description", required: true, value: event.description },
          { name: "startDate", label: "Start Date", required: false, value: event.startDate },
          { name: "endDate", label: "End Date", required: false, value: event.endDate },
        ]}
        onUpdateSuccess={handleSubmit}
      />
    </div>
  );
};

export default UpdateScreenE;