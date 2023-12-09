import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EventsList() {
    const [events, setEvents] = useState([]);

    const navigate = useNavigate();

    const handleAddEventClick = () => {
        navigate('/add-event');
    };

    useEffect(() => {
        // Fetch events from the API
        const fetchEvents = async () => {
            const response = await fetch('http://localhost:3001/events');
            const data = await response.json();
            setEvents(data);
        };

        fetchEvents();
    }, []);

    const cardStyle = {
        background: '#fff',
        borderRadius: '8px',
        padding: '20px',
        margin: '10px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      };
    
      const buttonStyle = {
        width: '150px',
        padding: '10px 20px',
        background: '#008CBA',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        margin: '10px 0',
        float: 'right'
      };

    return (

        <div style={{ padding: '20px' }}>
            <div>
                <button onClick={handleAddEventClick} style={buttonStyle}>Add Event</button>
            </div>
            {events.map(event => (
                <div key={event._id} style={cardStyle}>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p>Location: {event.location}</p>
                </div>
            ))}
        </div>
    );
}

export default EventsList;
