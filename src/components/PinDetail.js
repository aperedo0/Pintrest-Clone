import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/css/PinDetail.css'; 

const PinDetail = () => {
    const { pinId } = useParams();
    const [pin, setPin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Replace this URL with your actual API endpoint
        fetch(`http://localhost:5001/pin/${pinId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // console.log(response);
                return response.json();
            })
            .then(data => {
                setPin(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching pin:', error);
                setError(error.message);
                setLoading(false);
            });
    }, [pinId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="pin-detail-container">
            <img src={`http://localhost:5001/${pin.image}`} alt={pin.title} className="pin-detail-image" />
            <div className="pin-detail-info">
                <h1>{pin.title}</h1>
                <p>{pin.description}</p>
                {/* Add more details as needed */}
            </div>
        </div>
    );
};

export default PinDetail;
