import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchEvent.css';
import DeleteButton2 from '../buttons/DeleteButton2';
import EditButton2 from '../buttons/EditButton2';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const SearchEvent = ({ onUpdateEvent, onDeleteEvent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate(); // To navigate between pages

  const handleSearch = useCallback(
    async (query) => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiURL}/events?search=${query}`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [apiURL]
  );

  const debouncedSearch = useCallback(debounce(handleSearch, 300), [handleSearch]);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleDelete = async (eventId) => {
    try {
      setLoading(true);
      await onDeleteEvent(eventId);
      setSearchResults((prevResults) => prevResults.filter((event) => event._id !== eventId));
    } catch (err) {
      setError('Error deleting event');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(searchQuery); // Trigger search when Enter is pressed
    }
  };

  const highlightMatch = (text, query) => {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
  };

  const handleNavigateToEvent = (eventId) => {
    navigate(`/events/${eventId}`); // Navigate to the event profile page
  };

  return (
    <div>
      <TextField
        placeholder="Search by name or ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown} // Listen for Enter key
        className="search-input"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <SearchIcon />
              )}
            </InputAdornment>
          ),
        }}
      />

      {error && <p className="error-message">{error}</p>}

      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((event) => (
            <li key={event._id} className="search-result-item">
              <p>
                <strong>Title:</strong>{' '}
                {/* The title is now clickable, and navigating to the event profile */}
                <span
                  className="event-title-link"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNavigateToEvent(event._id)}
                  dangerouslySetInnerHTML={{ __html: highlightMatch(event.title, searchQuery) }}
                />
              </p>
              <p>
                <strong>ID:</strong>{' '}
                <span dangerouslySetInnerHTML={{ __html: highlightMatch(event._id, searchQuery) }} />
              </p>
              <EditButton2 onClick={() => onUpdateEvent(event._id)} />
              <DeleteButton2 onClick={() => handleDelete(event._id)} />
            </li>
          ))}
        </ul>
      )}

      {searchResults.length === 0 && !loading && !error && searchQuery && (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default SearchEvent;
