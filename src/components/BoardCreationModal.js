import React, { useState, useContext } from 'react';
import '../assets/css/BoardCreationModal.css';
import { AuthContext } from '../App';
const baseURL = process.env.REACT_APP_API_BASE_URL;

const BoardCreationModal = ({ setShowModal, onBoardCreation }) => {
  const [boardName, setBoardName] = useState('');
  const [error, setError] = useState(''); // State for storing potential errors
  const { user } = useContext(AuthContext);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      // Replace 'USER_ID' with the actual logged-in user's ID
      const response = await fetch(`${baseURL}/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers like authorization if needed
        },
        body: JSON.stringify({
          name: boardName,
          description: "", // Add a description if you have that field in your modal
          userId: user._id, // This should be the actual ID of the user creating the board
        }),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'Failed to create board');
      } else {
        // ... success case
        setShowModal(false);
        setBoardName('');
        onBoardCreation(); // Invoke the callback to update the boards in Profile
    }
  
      // Handle the success case
      const data = await response.json();
      console.log('Board created:', data);
      setShowModal(false);
      setBoardName('');
      // Optionally, trigger some state update to reflect the new board in the UI
    } catch (error) {
      console.error('Error creating board:', error);
      setError(error.message);
    }
  };
  

  const handleBackgroundClick = (e) => {
    // Check if the clicked element is the modal-background itself, not a child
    if (e.target.className.includes('modal-background')) {
      setShowModal(false);
    }
  };

  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <div className="modal-container">
        <button aria-label="Close" onClick={() => setShowModal(false)}>Close</button>
        <h1>Create Board</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleCreateBoard}>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="Like 'Places to Go' or 'Recipes to Make'"
            required
          />
          <button type="submit">Create Board</button>
        </form>
      </div>
    </div>
  );
};

export default BoardCreationModal;
