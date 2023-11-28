import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignupModal from './components/SignupModal';
import LoginModal from './components/LoginModal';
import MainContainer from './components/MainContainer';
import CreatePins from './components/CreatePins';
import Profile from './components/Profile';
import PinDetail from './components/PinDetail';

export const AuthContext = createContext(null);

const App = () => {
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const ProtectedRoute = ({ children, isAuthenticated }) => {
        return isAuthenticated ? children : <Navigate to="/" />;
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const toggleSignupModal = () => setShowSignupModal(prev => !prev);
    const toggleLoginModal = () => setShowLoginModal(prev => !prev);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
            <Router>
                <Navbar
                    isAuthenticated={isAuthenticated}
                    toggleLoginModal={toggleLoginModal}
                    toggleSignupModal={toggleSignupModal}
                    setIsAuthenticated={setIsAuthenticated}
                />
                <SignupModal isOpen={showSignupModal} toggleModal={toggleSignupModal} onConfirm={() => setIsAuthenticated(true)} />
                <LoginModal isOpen={showLoginModal} toggleModal={toggleLoginModal} setIsAuthenticated={setIsAuthenticated}/>   

                <Routes>
                    <Route path="/" element={<MainContainer isAuthenticated={isAuthenticated} />} />
                    <Route path="/pin-creation-tool" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <CreatePins />
                        </ProtectedRoute>
                        
                    }/>
                    <Route path="/profile" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Profile />
                        </ProtectedRoute>
                        
                    }/>
                    <Route path="/pin/:pinId" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <PinDetail />
                        </ProtectedRoute>
                    }/>
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
