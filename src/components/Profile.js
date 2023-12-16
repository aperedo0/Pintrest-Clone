import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import axios from 'axios';
import '../assets/css/Pin.css';
import '../assets/css/Profile.css';
import BoardCreationModal from './BoardCreationModal';

const Profile = () => {
    const [pins, setPins] = useState([]);
    const [boards, setBoards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { user } = useContext(AuthContext);

    const fetchData = async () => {
        try {
            const pinsResponse = await axios.get(`http://localhost:5001/user-pins/${user._id}`);
            setPins(pinsResponse.data);

            const boardsResponse = await axios.get(`http://localhost:5001/user-boards/${user._id}`);
            setBoards(boardsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user._id]);

    const deletePin = async (pinId) => {
        try {
            await axios.delete(`http://localhost:5001/delete-pin/${pinId}`);
            setPins(pins.filter(pin => pin._id !== pinId));
        } catch (error) {
            console.error('Error deleting pin:', error);
        }
    };

    const deleteBoard = async (boardId) => {
        try {
            await axios.delete(`http://localhost:5001/boards/${boardId}`);
            setBoards(boards.filter(board => board._id !== boardId));
        } catch (error) {
            console.error('Error deleting board:', error);
        }
    };

    return (
        <div>
            <h1>{user.username}'s Profile</h1>
            <div className="boards-container">
                <h2>Boards</h2>
                <div className="plus-button-container">
                    <button className="plus-button" onClick={() => setShowModal(true)}>+</button>
                </div>
                {boards.map(board => (
                    <div key={board._id} className="board-item">
                        <Link to={`/board/${board._id}`} className="board-link">
                            <div className="board">
                                {board.lastPinImage !== '/path/to/default/gray/image.png' ? (
                                    <img src={`http://localhost:5001/${board.lastPinImage}`} alt={board.name} className="board-image" />
                                ) : (
                                    <div className="board-image-placeholder"></div>
                                )}
                                <p>{board.name}</p>
                            </div>
                        </Link>
                        <button onClick={() => deleteBoard(board._id)}>Delete Board</button>
                    </div>
                ))}
            </div>

            <h2>Pins</h2>
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
                <BoardCreationModal setShowModal={setShowModal} onBoardCreation={() => fetchData()} />
            )}
        </div>
    );
};

export default Profile;
