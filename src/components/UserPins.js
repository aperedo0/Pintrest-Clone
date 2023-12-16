import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PinIcon from '../assets/img/PinIcon.png'; // This is a hypothetical component for the pin icon
import CheckmarkIcon from '../assets/img/CheckmarkIcon.png'; // This is a hypothetical component for the checkmark icon
const baseURL = process.env.REACT_APP_API_BASE_URL;

const BoardDetail = () => {
  const { boardId } = useParams();
  const [pins, setPins] = useState([]);
  const [boardPins, setBoardPins] = useState(new Set()); // A set to track pins added to the board

  useEffect(() => {
    // Fetch the pins for the board
    // axios.get(`/boards/${boardId}/pins`)
    //   .then(response => {
    //     setPins(response.data);
    //     // Populate the initial set of pins added to the board
    //     const addedPins = new Set(response.data.map(pin => pin._id));
    //     setBoardPins(addedPins);
    //   })
    //   .catch(
    //     error => console.error(error)
    //   );
    axios.get(`/boards/${boardId}/pins`)
      .then(response => {
        setPins(response.data);
        const addedPins = new Set(response.data.map(pin => pin._id));
        setBoardPins(addedPins);
      })
      .catch(error => {
        console.error('Axios request failed: ', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response Data:', error.response.data);
          console.error('Response Status:', error.response.status);
          console.error('Response Headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error Message:', error.message);
        }
        console.error('Config:', error.config);
      });

  }, [boardId]);

  const handleAddPin = (pinId) => {
    axios.post(`/boards/${boardId}/add-pin`, { pinId })
      .then(() => {
        // On success, update the boardPins state to include the new pin
        setBoardPins(new Set([...boardPins, pinId]));
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="userpins-board-detail">
      {pins.map(pin => (
        <div key={pin._id} className="userpins-pin">
          <img src={pin.image} alt={pin.title} />
          <div className="userpins-pin-icon-container">
            {boardPins.has(pin._id) ? (
              <CheckmarkIcon />
            ) : (
              <PinIcon onClick={() => handleAddPin(pin._id)} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardDetail;

