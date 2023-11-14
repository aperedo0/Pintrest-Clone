import React, { useState } from 'react';
import Modal from './Modal';
import '../assets/css/LoginModal.css';
import logo from '../assets/img/logo.png';


const LoginModal = ({ isOpen, toggleModal, setIsAuthenticated }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
        
            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            const data = await response.json();
        
            // Handle response from server
            if (data.success) {
                setIsAuthenticated(true);  
                toggleModal();  // Close the modal
            } else {
                alert(data.message || 'Error logging in.');
            }
        
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error.message);
            // Handle or display the error to the user as necessary
            // ...
        }
        
    };

     return (
        <Modal isOpen={isOpen} toggleModal={toggleModal} id="loginModal">
            <div className="modal-content actual-form">
                <span className="close-btn" onClick={toggleModal}>&times;</span>
                <img src={logo} alt="Logo"></img>
                <h1>Welcome to Pinterest</h1>
                <p>Find new ideas to try.</p>
                <form onSubmit={handleSubmit}>
                    <p className="left">Username</p>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <p className="left">Password</p>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <br></br>
                    <button type="submit">Log In</button>
                </form>
            </div>
        </Modal>
    
    );
};

export default LoginModal;
