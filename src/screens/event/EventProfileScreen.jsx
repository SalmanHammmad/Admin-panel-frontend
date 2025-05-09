import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EventProfile = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch the event data when the component mounts
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${apiURL}/events/${id}`);
        if (!response.ok) throw new Error('Failed to fetch event data');
        const data = await response.json();
        setEventData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, apiURL]);

  if (loading) return <p>Loading event...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!eventData) return <p>No event data found.</p>;

  return (
    <div className="container event-profile">
      <h1>{eventData.title}</h1>
      <p><strong>Description:</strong> {eventData.description}</p>
      <p><strong>Date:</strong> {new Date(eventData.date).toLocaleString()}</p>
      <p><strong>Location:</strong> {eventData.location}</p>
      {/* Add more event details as needed */}
    </div>
  );
};

export default EventProfile;
