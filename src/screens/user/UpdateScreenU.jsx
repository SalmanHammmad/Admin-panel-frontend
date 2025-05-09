import {useState,useEffect } from "react";
import UpdateForm from "../../components/UpdateForm";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";


const UpdateScreenU = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handleSubmit = async () => {
    navigate("/users");
  };

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Fetching user with ID:", userId);
      const url = `${apiURL}/users/${userId}`;
      console.log("Fetching from URL:", url); // Debug URL

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch user. Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setUser(data);
        } else {
          const text = await response.text();
          throw new Error(`Unexpected response format: ${text}`);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(`Failed to load user data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, apiURL]); // Added apiURL to dependencies

  if (loading)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  if (error) return <p>{error}</p>;

  // Ensure that the user is defined before rendering the UpdateForm
  if (!user) return <p>No user found.</p>;

  return (
    <div>
      <h2>Update User</h2>
      <UpdateForm
        entityId={user._id}
        entityType="users"
        fields={[
          { name: "name", label: "Name", required: true },
          { name: "email", label: "Email", required: true },
          { name: "role", label: "Role", required: false }, // Optional field for user role
        ]}
        apiEndpoint={`${apiURL}`}
        onUpdateSuccess={handleSubmit}
      />
    </div>
  );
};

export default UpdateScreenU;
