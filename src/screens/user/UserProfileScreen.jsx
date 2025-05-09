import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, Card, Rating, Divider, Button, CircularProgress } from '@mui/material';
import './UserProfileScreen.css';

const UserProfileScreen = () => {
  const { id } = useParams(); // Get user ID from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function avgRating(user) {
    return user.reviews.reduce((acc, review) => acc + review.rating, 0) / user.reviews.length;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`);
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    user && (
      <Box className="user-profile-container">
        {/* Similar content as before but with fetched user data */}
        <Card className="user-profile-header">
          <Avatar
            alt={user.name}
            src={user.image}
            className="user-avatar"
            sx={{ width: 120, height: 120 }}
          />
          <Typography variant="h4">{user.name}</Typography>
          <Typography variant="body1">{user.category || 'No Category'}</Typography>
          <Typography variant="body2">{user.location}</Typography>
          <Rating name="read-only" value={avgRating(user)} precision={0.5} readOnly />
          <Typography variant="caption">({user.reviews.length} Reviews)</Typography>
        </Card>

        <Card className="user-profile-bio">
          <Typography variant="h6">About {user.name}</Typography>
          <Typography variant="body1">{user.profile?.bio || 'No bio available'}</Typography>
          <Typography variant="body2">{user.profile?.experience} years of experience</Typography>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="body2">
            <strong>Budget:</strong> ${user.budget}
          </Typography>
          <Typography variant="body2">
            <strong>Votes Received:</strong> {user.votesReceived}
          </Typography>
        </Card>

        {/* Reviews Section */}
        <Card className="user-reviews">
          <Typography variant="h6">Reviews</Typography>
          {user.reviews.length > 0 ? (
            user.reviews.map((review, index) => (
              <Box key={index} className="review-item">
                <Rating name="read-only" value={review.rating} precision={0.5} readOnly />
                <Typography variant="body2">{review.comment}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No reviews available.
            </Typography>
          )}
        </Card>

        <Box className="user-profile-actions">
          <Button variant="contained" color="primary">
            Edit Profile
          </Button>
        </Box>
      </Box>
    )
  );
};

export default UserProfileScreen;
