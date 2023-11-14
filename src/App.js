import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import MainContainer from './components/MainContainer';
import ConfirmLoginModal from './components/ConfirmLoginModal';

import SignupModal from './components/SignupModal';
import LoginModal from './components/LoginModal';

const App = () => {

    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);


    const [isModalOpen, setModalOpen] = useState(false);
    const [isConfirmLoginOpen, setConfirmLoginOpen] = useState(false);  // New state
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // New state
    const [activeTab, setActiveTab] = useState('home');  // New state
    const [modalType, setModalType] = useState('login');

    const handleHomeClick = () => {
      setActiveTab('home');
    };

    const handleExploreClick = () => {
        setActiveTab('explore');
    };
    
    const handleCreateClick = () => {
        setActiveTab('create');
    };

    const openModal = (type) => {
        // console.log('1');
        if (type === 'login') {
            setConfirmLoginOpen(true);
            // console.log('if');
        } else {
            setModalType(type);
            setModalOpen(true);
            // console.log('else');
        }
    };

    const handleConfirmLogin = () => {
        setIsAuthenticated(true);
        setConfirmLoginOpen(false);
    };

    const handleConfirmCancel = () => {
        setIsAuthenticated(false);
        setConfirmLoginOpen(false);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const toggleSignupModal = () => {
        setShowSignupModal(prev => !prev);
    }
    
    const toggleLoginModal = () => {
        // console.log("Toggling Login Modal from App.js");
        setShowLoginModal(prev => !prev);
    }

    return (
        <>
            <Navbar 
                isAuthenticated={isAuthenticated}
                toggleLoginModal={toggleLoginModal}
                toggleSignupModal={toggleSignupModal}
                onHomeClick={handleHomeClick}
                onExploreClick={handleExploreClick}
                onCreateClick={handleCreateClick}
                onLogoutClick={handleLogout}
            />
            
            <SignupModal isOpen={showSignupModal} toggleModal={toggleSignupModal} onConfirm={handleConfirmLogin} setIsAuthenticated={setIsAuthenticated}/>
            <LoginModal isOpen={showLoginModal} toggleModal={toggleLoginModal} setIsAuthenticated={setIsAuthenticated}/>   

            {isConfirmLoginOpen && (
                <ConfirmLoginModal 
                    onConfirm={handleConfirmLogin} 
                    onCancel={handleConfirmCancel}
                />
            )}
            
            {isModalOpen && (
                <Modal 
                    type={modalType} 
                    onClose={() => setModalOpen(false)}
                />
            )}

            <MainContainer 
                isAuthenticated={isAuthenticated} 
                activeTab={activeTab} 
                showSignupModal={showSignupModal} 
                showLoginModal={showLoginModal}
                toggleSignupModal={toggleSignupModal} 
                toggleLoginModal={toggleLoginModal} 
            />
        </>

    );
}

export default App;
