import { apiRequest } from '../utils/apiUtils';

const apiEndpoint = import.meta.env.VITE_API_URL;

export const fetchUserById = async (userId) => {
  const response = await fetch(`${apiEndpoint}/users/${userId}`); // Ensure the eventId is being used correctly
  if (!response.ok) {
      throw new Error('Failed to fetch user');
  }
  return await response.json();
};

export const deleteUserById = async (userId) => {

  const response = await fetch(`${apiEndpoint}/users/${userId}`, {
      method: 'DELETE',
  });
  if (!response.ok) {
      throw new Error('Failed to delete user');
  }
  return await response.json();
  };

export const updateUserById = async (userId, data) => {
  return apiRequest(`${apiEndpoint}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
