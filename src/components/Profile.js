import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App'; // Adjust the path as per your project structure
import axios from 'axios';
import '../assets/css/Pin.css';

const Profile = () => {
    const [pins, setPins] = useState([]);
    const { user, isAuthenticated } = useContext(AuthContext);

    console.log('User from context:', user);
    console.log('IsAuthenticated from context:', isAuthenticated);

    useEffect(() => {
        axios.get(`http://localhost:5001/user-pins/${user._id}`)
            .then(res => setPins(res.data))
            .catch(err => console.error(err));
    }, [user._id]);

    const deletePin = (pinId) => {
        axios.delete(`http://localhost:5001/delete-pin/${pinId}`)
            .then(() => setPins(pins.filter(pin => pin._id !== pinId)))
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h1>{user.username}'s Pins</h1>
            <div className="pins-container">
                {pins.map(pin => (
                    <div key={pin._id} className="pin">
                        <img src={`http://localhost:5001/${pin.image}`} alt={pin.title} />
                        <button onClick={() => deletePin(pin._id)}>🗑️</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
