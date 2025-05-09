// src/screens/EventManager.jsx
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CreateEvent from '../../components/event/CreateEvent';
import Events from '../../components/event/events';
import SearchEvent from '../../components/event/SearchEvent';
import DummyData from '../../components/DummyData';
import UpdateScreenE from './UpdateScreenE';
import { deleteEventById } from '../../api/eventApi';  
import './EventScreen.css';


const EventManager = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    const handleRefresh = () => setRefreshKey((prevKey) => prevKey + 1);

    const handleDeleteEvent = async (eventId) => {
        try {
            await deleteEventById(eventId);
            console.log('Event deleted successfully:', eventId);
            handleRefresh(); // Refresh the list
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    
    const handleUpdateEvent = (eventId) => {
        navigate(`/events/update/${eventId}`);  // Navigate to the update route using the event ID
    };
    

    return (
        <div className="event-manager-container">
           
           <DummyData onEventCreated={handleRefresh}/>
          

            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            {/* <section className="event-manager-section">
                                <h2>Create Event</h2>
                                <CreateEvent onEventCreated={handleRefresh} />
                            </section>

                            <hr className="divider" /> */}

                            <section className="event-manager-section">
                                <SearchEvent onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} />
                            </section>

                            <hr className="divider" />

                            <section className="event-manager-section">
                             
                                <Events refreshKey={refreshKey} onUpdateEvent={handleUpdateEvent} />
                            </section>
                        </>
                    }
                />
               <Route path="/events/update/:eventId" element={<UpdateScreenE onUpdateSuccess={handleRefresh} />} />

            </Routes>
        </div>
    );
};

export default EventManager;
