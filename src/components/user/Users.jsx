import React, { useState, useEffect } from "react";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import "./Users.css";
import EditButton from "../buttons/EditButton";
import { useDataFetcher } from "../../hooks/useDataFetcher";
import DeleteData from "../DeleteData";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom"; // Import Link for navigation
import UserIcon from "@mui/icons-material/AccountCircle";
import LinearProgress from '@mui/material/LinearProgress';

const Users = ({ refreshKey, onUpdateUser }) => {
  const apiURL = import.meta.env.VITE_API_URL;
  const { data, loading, error, setData, fetchData } = useDataFetcher(
    `${apiURL}/users`
  ); // Adjust endpoint for users
  const [expandedUserId, setExpandedUserId] = useState(null);

  const handleToggleDetails = (id) => {
    setExpandedUserId(expandedUserId === id ? null : id);
  };

  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((user) => user._id !== id)); // Adjust for user deletion
  };

  function avgRating(user) {
    return (user.rating =
      user.reviews.reduce((acc, review) => acc + review.rating, 0) /
      user.reviews.length);
  }

  // Use useEffect to fetch data whenever refreshKey changes
  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  return (
    <div className="users-container">
      {loading && <LinearProgress />}
      {error && <p className="error-message">Error fetching data: {error}</p>}
      {data && data.length > 0 ? (
        <ol className="user-list">
          {data.map((user) => (
            <li key={user._id} className="user-item">
              <div className="user-header">
                <div className="user-main-info">

                  {
                  (user.image === undefined || user.image === ""
                  ) ? (<UserIcon className="user-avatar" sx={{ fontSize: 50 }}  />) : (
                  <img
                    src={user.image}
                    className="user-avatar"
                  />)}
                  {/* Avatar image */}
                  <Link to={`/users/${user._id}`} className="user-name">
                    {user.name}
                  </Link>
                  {/* Display user name */}
                  <EditButton onClick={() => onUpdateUser(user._id)} />
                  <DeleteData
                    route="users"
                    Id={user._id}
                    onDelete={handleDelete}
                  />
                  <button
                    className="toggle-details-button"
                    onClick={() => handleToggleDetails(user._id)}
                  >
                    {expandedUserId === user._id ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </button>
                </div>
                {user.profile &&
                  user.profile.bio && ( // Check if bio exists
                    <p>{user.profile.bio}</p>
                  )}
                {/* Display user bio */}
              </div>
              {expandedUserId === user._id && (
                <div className="user-details">
                  <p>
                    <strong>ID:</strong> {user._id}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <Rating
                      name="half-rating-read"
                      value={avgRating(user)}
                      defaultValue={5}
                      precision={0.5}
                      readOnly
                    />
                  </p>
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default Users;
