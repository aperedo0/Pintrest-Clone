import React, { useState } from 'react';
import Modal from './Modal';
import '../assets/css/SignupModal.css';
import logo from '../assets/img/logo.png';

const SignupModal = ({ isOpen, toggleModal, onConfirm, setIsAuthenticated }) => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Function to reset form fields to their initial state
    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setBirthdate('');
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setErrorMessage(''); // Clear out any previous error messages

    //     try {
    //         const response = await fetch('http://localhost:5001/signup', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ username, email, password, birthdate }),
    //             credentials: 'include'
    //         });

    //         // Check if the response's content type is JSON
    //         const contentType = response.headers.get("content-type");
    //         if (!contentType || !contentType.includes("application/json")) {
    //             throw new TypeError("Oops, we haven't got JSON!");
    //         }

    //         const data = await response.json();
    //         console.log(data);

    //         if (response.ok) {
    //             onConfirm();
    //             setIsAuthenticated(true);
    //             toggleModal();
    //             resetForm();
    //         } else {
    //             // Use the message from the server's response if available
    //             setErrorMessage(data.message || 'Error signing up. Please try again.');
    //         }

    //         console.log(data);

    //         if (data.success) {
    //             onConfirm();
    //             setIsAuthenticated(true); 
    //             toggleModal();
    //             resetForm();
    //         } else {
    //             alert(data.message || 'Error signing up.');
    //         }

    //     } catch (error) {
    //         console.error('There was a problem with the fetch operation:', error.message);
    //         setErrorMessage(error.message || 'An error occurred. Please try again later.');
    //         // Handle or display the error to the user as necessary
    //         // ...
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear out any previous error messages
    
        try {
            const response = await fetch('http://localhost:5001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, birthdate }),
                credentials: 'include'
            });
    
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
    
            const data = await response.json();
    
            if (data.success) {
                // Sign up successful
                onConfirm();
                setIsAuthenticated(true);
                toggleModal(); // Close the modal
                resetForm(); // Reset the form fields
            } else {
                // Sign up failed, display error message from server
                setErrorMessage(data.message || 'Error signing up. Please try again.');
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error.message);
            setErrorMessage(error.message || 'An error occurred. Please try again later.');
        }
    };
    

    // Function to call when the modal is closed, either by the user or programmatically
    const handleModalClose = () => {
        resetForm(); // Reset the form when the modal is closed
        toggleModal(); // Use the parent's toggleModal function to close the modal
    };

    return (
        <Modal isOpen={isOpen} toggleModal={toggleModal} id="signupModal">
            <div className="modal-content actual-form">
                <span className="close-btn" onClick={handleModalClose}>&times;</span>
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
                    <p className="left">Email</p>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
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
                    <p className="left">Birthdate</p>
                    <input 
                        type="date" 
                        name="birthdate" 
                        placeholder="Birthday" 
                        required
                        value={birthdate}
                        onChange={e => setBirthdate(e.target.value)}
                    />
                    <br></br>
                    <button type="submit">Sign Up</button>
                    {/* Display error message to the user */}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </div>
        </Modal>
    );
};

export default SignupModal;
