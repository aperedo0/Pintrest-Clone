import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { AuthContext } from '../App';
import axios from 'axios';
import '../assets/css/Pin.css';

const Profile = () => {
    const [pins, setPins] = useState([]);
    const { user, isAuthenticated } = useContext(AuthContext);

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
                    <div key={pin._id} className="pin"> {/* Parent div for each pin */}
                        <Link to={`/pin/${pin._id}`}> {/* Link to pin detail */}
                            <img src={`http://localhost:5001/${pin.image}`} alt={pin.title} />
                        </Link>
                        <button onClick={() => deletePin(pin._id)}>🗑️</button> {/* Delete button */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
