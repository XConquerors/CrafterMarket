import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Event.css';
import { useAuth } from '../AuthContext';

function EventForm({ onSubmit }) {
    const { user, logout } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    const postEvent = async (eventData) => {
        try {
            const response = await fetch('http://localhost:3001/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                credentials: 'include',
                body: JSON.stringify(eventData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Event Created:', result);
                navigate('/events'); // Navigate after the event is posted and a successful response is received
            } else {
                console.error('Failed to create event');
            }
        } catch (error) {
            console.error('Error posting event:', error);
        }
};

const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = { title, description, date, location };
    postEvent(eventData);
};

return (
    <div className="form-container"> {/* Added container div with class */}
    <form onSubmit={handleSubmit}>
        <h2>Post a New Event</h2>
        <div className="form-group"> {/* Grouping inputs for better control */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="form-control" // Added class for styling
            />
        </div>
        <div className="form-group">
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="form-control" // Added class for styling
            />
        </div>
        <div className="form-group">
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-control" // Added class for styling
            />
        </div>
        <div className="form-group">
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="form-control" // Added class for styling
            />
        </div>
        <button type="submit" className="btn btn-primary">Post Event</button> {/* Added classes for styling */}
    </form>
</div>
);
}

export default EventForm;
