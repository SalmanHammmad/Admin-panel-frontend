import { apiRequest } from '../utils/apiUtils';

const apiEndpoint = import.meta.env.VITE_API_URL;
// src/api/eventApi.js
export const fetchEventById = async (eventId) => {
    const response = await fetch(`${apiEndpoint}/events/${eventId}`); // Ensure the eventId is being used correctly
    if (!response.ok) {
        throw new Error('Failed to fetch event');
    }
    return await response.json();
};



export const deleteEventById = async (eventId) => {

const response = await fetch(`${apiEndpoint}/events/${eventId}`, {
    method: 'DELETE',
});
if (!response.ok) {
    throw new Error('Failed to delete event');
}
return await response.json();
};



export const updateEventById = async (eventId, data) => {
  return apiRequest(`${apiEndpoint}/events/${eventId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
