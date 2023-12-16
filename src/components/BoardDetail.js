import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App'; // Import AuthContext
import { useNavigate } from 'react-router-dom';
import '../assets/css/BoardDetail.css';

const BoardDetail = () => {
    const { boardId } = useParams();
    // console.log("here is the ");
    // console.log(boardId);
    const [board, setBoard] = useState(null);
    const [pins, setPins] = useState([]);
    const [userPins, setUserPins] = useState([]); // State for storing the user's pins
    const [selectedPin, setSelectedPin] = useState(''); // State for selected pin ID
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext); // Use AuthContext
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const [selectedPinToDelete, setSelectedPinToDelete] = useState('');
  
    // const navigateToUserPins = () => {
    //     navigate('/user-pins');
    // };
    const navigateToUserPins = () => {
        navigate(`/board/${boardId}/user-pins`);
    };
    
    const fetchBoardDetails = async () => {
        try {
            const boardResponse = await axios.get(`http://localhost:5001/board/${boardId}`);
            setBoard(boardResponse.data.board);
            setPins(boardResponse.data.pins);
            
            // Add this line to fetch user pins and log the result
            const userPinsResponse = await axios.get(`http://localhost:5001/user-pins/${user._id}`);
            setUserPins(userPinsResponse.data);
            console.log("User Pins:", userPinsResponse.data); // This line will log the user pins to the console
    
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };
    
    // useEffect(() => {
    //     fetchBoardDetails();
    // }, [boardId, user._id]);
    useEffect(() => {
        const fetchBoardDetails = async () => {
            try {
                // Fetching the details of the board, including the pins already on it
                const boardResponse = await axios.get(`http://localhost:5001/board/${boardId}`);
                setBoard(boardResponse.data.board);
                setPins(boardResponse.data.pins);

                // Fetching all pins of the user
                const userPinsResponse = await axios.get(`http://localhost:5001/user-pins/${user._id}`);
                setUserPins(userPinsResponse.data);

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchBoardDetails();
    }, [boardId, user._id]);

    const availablePins = userPins.filter(userPin => !pins.some(boardPin => boardPin._id === userPin._id));

    const handleImageClick = (pinId) => {
        navigate(`/pin/${pinId}`);
    };
    
    

    const addPinToBoard = async () => {
        try {
            const response = await axios.patch(`http://localhost:5001/boards/${boardId}/add-pin`, { pinId: selectedPin });
    
            if (response.status === 200) {
                // Re-fetch board details to update UI
                fetchBoardDetails();
            } else {
                console.error('Error adding pin to board:', response.data);
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    // const handleDeletePin = async () => {
    //     try {
    //         // Replace the URL with your API endpoint to delete the pin from the board
    //         const response = await axios.delete(`http://localhost:5001/board/${boardId}/delete-pin/${selectedPinToDelete}`);

    //         if (response.status === 200) {
    //             // Remove the deleted pin from the pins state
    //             setPins(pins.filter(pin => pin._id !== selectedPinToDelete));
    //             setSelectedPinToDelete(''); // Reset the selection
    //         } else {
    //             console.error('Error deleting pin from board:', response.data);
    //         }
    //     } catch (error) {
    //         console.error('Error:', error.response ? error.response.data : error.message);
    //     }
    // };

    const handleDeletePin = async () => {
        try {
            const response = await axios.patch(`http://localhost:5001/boards/${boardId}/remove-pin`, { pinId: selectedPinToDelete });
    
            if (response.status === 200) {
                // Update local state to reflect the removal
                setPins(pins.filter(pin => pin._id !== selectedPinToDelete));
                setSelectedPinToDelete(''); // Reset the selection
            } else {
                console.error('Error removing pin from board:', response.data);
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>{board?.name}</h1>
            <div>
                <select onChange={(e) => setSelectedPin(e.target.value)} value={selectedPin}>
                    <option value="">Select a Pin</option>
                    {availablePins.map(pin => (
                        <option key={pin._id} value={pin._id}>{pin.title}</option>
                    ))}
                </select>
                <button onClick={addPinToBoard}>Add Selected Pin to Board</button>
                <br></br>
            </div>
            <div>
                {pins.map(pin => (
                    <div className="pin-details" key={pin._id} onClick={() => handleImageClick(pin._id)}>
                        <img src={`http://localhost:5001/${pin.image}`} alt={pin.title} />
                        <p>Pin Title: {pin.title}</p>
                    </div>
                ))}
            </div>
            {/* Dropdown to select a pin to delete */}
            <select onChange={(e) => setSelectedPinToDelete(e.target.value)} value={selectedPinToDelete}>
                <option value="">Select a Pin to Delete</option>
                {pins.map(pin => (
                    <option key={pin._id} value={pin._id}>{pin.title}</option>
                ))}
            </select>
            <button onClick={handleDeletePin}>Delete Selected Pin</button>
        </div>
    );
};

export default BoardDetail;
