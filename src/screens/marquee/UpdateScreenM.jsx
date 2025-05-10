import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateScreenM = () => {
  const { marqueeId } = useParams();
  const navigate = useNavigate();
  const [marqueeData, setMarqueeData] = useState({
    name: "",
    description: "",
    capacity: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch marquee data
  useEffect(() => {
    const fetchMarquee = async () => {
      try {
        const { data } = await axios.get(`/api/marquees/${marqueeId}`, {
          withCredentials: true,
        });
        setMarqueeData(data);
      } catch (err) {
        setError("Failed to fetch marquee data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarquee();
  }, [marqueeId]);

  // Handle input changes
  const handleChange = (e) => {
    setMarqueeData({ ...marqueeData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/marquees/${marqueeId}`, marqueeData, {
        withCredentials: true,
      });
      navigate("/marquees");
    } catch (err) {
      setError("Failed to update marquee");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Update Marquee</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={marqueeData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={marqueeData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Capacity:</label>
          <input
            type="number"
            name="capacity"
            value={marqueeData.capacity}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateScreenM;