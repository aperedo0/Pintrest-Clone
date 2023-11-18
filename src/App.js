import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignupModal from './components/SignupModal';
import LoginModal from './components/LoginModal';
import MainContainer from './components/MainContainer';
import CreatePins from './components/CreatePins';

export const AuthContext = createContext(null);

const App = () => {
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        window.location.href = '/';
    };

    const toggleSignupModal = () => setShowSignupModal(prev => !prev);
    const toggleLoginModal = () => setShowLoginModal(prev => !prev);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            <Router>
                <Navbar
                    isAuthenticated={isAuthenticated}
                    toggleLoginModal={toggleLoginModal}
                    toggleSignupModal={toggleSignupModal}
                    handleLogout={handleLogout}
                />
                
                <SignupModal isOpen={showSignupModal} toggleModal={toggleSignupModal} onConfirm={() => setIsAuthenticated(true)} />
                <LoginModal isOpen={showLoginModal} toggleModal={toggleLoginModal} setIsAuthenticated={setIsAuthenticated}/>   

                <Routes>
                    <Route path="/" element={<MainContainer isAuthenticated={isAuthenticated} />} />
                    {isAuthenticated && <Route path="/pin-creation-tool" element={<CreatePins />} />}
                    {/* Add more routes as needed */}
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
