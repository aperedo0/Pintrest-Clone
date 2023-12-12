import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import axios from 'axios';
import '../assets/css/Pin.css';
import '../assets/css/Profile.css'
import BoardCreationModal from './BoardCreationModal';

const Profile = () => {
    const [pins, setPins] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { user, isAuthenticated } = useContext(AuthContext);
    const [boards, setBoards] = useState([]);

    const handleClose = () => {
        setShowModal(false);
      };

    useEffect(() => {
        axios.get(`http://localhost:5001/user-pins/${user._id}`)
            .then(res => setPins(res.data))
            .catch(err => console.error(err));

            // Fetch user boards
        axios.get(`http://localhost:5001/user-boards/${user._id}`)
        .then(res => setBoards(res.data))
        .catch(err => console.error(err));
    }, [user._id]);

    const deletePin = (pinId) => {  
        axios.delete(`http://localhost:5001/delete-pin/${pinId}`)
            .then(() => setPins(pins.filter(pin => pin._id !== pinId)))
            .catch(err => console.error(err));

    };

    return (
        <div>
            <h1>{user.username}'s Profile</h1>
            <div className="boards-container">
                <h2>Boards</h2>
                {boards.map(board => (
                    <Link to={`/board/${board._id}`} key={board._id} className="board-link">
                        <div className="board">
                            {board.lastPinImage !== '/path/to/default/gray/image.png' ? (
                                <img src={`http://localhost:5001/${board.lastPinImage}`} alt={board.name} className="board-image" />
                            ) : (
                                <div className="board-image-placeholder"></div>
                            )}
                            <p>{board.name}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <h2>Pins</h2>
            <div className="plus-button-container">
                <button className="plus-button" onClick={() => setShowModal(true)}>+</button>
            </div>
            <div className="pins-container">
                {pins.map(pin => (
                    <div key={pin._id} className="pin">
                        <Link to={`/pin/${pin._id}`}>
                            <img src={`http://localhost:5001/${pin.image}`} alt={pin.title} />
                        </Link>
                        <button onClick={() => deletePin(pin._id)}>🗑️</button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-backdrop">
                    <BoardCreationModal setShowModal={setShowModal} />
                </div>
            )}
        </div>
    );
};

export default Profile;
