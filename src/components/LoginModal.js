import React, { useState, useContext } from 'react';
import { AuthContext } from '../App'; // Adjust the path to where AuthContext is defined
import Modal from './Modal';
import '../assets/css/LoginModal.css';
import logo from '../assets/img/logo.png';
const baseURL = process.env.REACT_APP_API_BASE_URL;

console.log('Base URL:', process.env.REACT_APP_API_BASE_URL);



const LoginModal = ({ isOpen, toggleModal}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsAuthenticated, setUser } = useContext(AuthContext);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const response = await fetch(`${baseURL}/login`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ username, password })
    //         });
        
    //         // Check if the response is successful
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }
        
    //         const data = await response.json();
        
    //         // Handle response from server
    //         if (data.success) {
    //             setIsAuthenticated(true);  
    //             setUser(data.user);  // Update the user in the global context
    //             toggleModal();  // Close the modal
    //         } else {
    //             alert(data.message || 'Error logging in.');
    //         }
        
    //     } catch (error) {
    //         console.error('There was a problem with the fetch operation:', error.message);
    //         // Handle or display the error to the user as necessary
    //         // ...
    //     }
        
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch(`${baseURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
    
            if (!response.ok) {
                // Check if the response is JSON
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorResponse = await response.json();
                    console.error('Login error:', errorResponse);
                    throw new Error(errorResponse.message || `HTTP error! Status: ${response.status}`);
                } else {
                    // Handle non-JSON response
                    const textResponse = await response.text();
                    console.error('Non-JSON response:', textResponse);
                    throw new Error('Server error: Non-JSON response received');
                }
            }
    
            const data = await response.json();
            if (data.success) {
                setIsAuthenticated(true);
                setUser(data.user);
                toggleModal();
            } else {
                alert(data.message || 'Error logging in.');
            }
    
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error.message);
            alert(error.message);
        }
    };
    

     return (
        <Modal isOpen={isOpen} toggleModal={toggleModal}>
            <div className="modal-content actual-form" id="login-modal">
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
