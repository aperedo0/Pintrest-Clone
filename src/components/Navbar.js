import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Navbar.css';
import logo from '../assets/img/logo.png';

const Navbar = ({ isAuthenticated, toggleSignupModal, toggleLoginModal, setIsAuthenticated }) => {
    const navigate = useNavigate();

    const onLogout = () => {
        
        // Clear the authentication state
        setIsAuthenticated(false);

        // Clear any authentication tokens or user data as required
        localStorage.removeItem('authToken');

        // Navigate to the home page
        navigate('/');
    };

    return (
        <nav>
            <div className="navbar-logo">
                <Link to="/">
                    <img src={logo} alt="Pinterest Clone Logo" />
                </Link>
            </div>

            {isAuthenticated ? (
                <>
                    <div className="login-left">
                        <Link to="/" className="active-nav">Home</Link>
                        <Link to="/explore">Explore</Link>
                        <Link to="/pin-creation-tool">Create</Link>
                    </div>

                    <input type="text" placeholder="Search..." className="search-bar"></input>

                    <div className="login-right">
                        <Link to="/notifications">
                            <span className="icon-bell"></span> Notifications
                        </Link>
                        <Link to="/inbox">
                            <span className="icon-message"></span> Inbox
                        </Link>
                        <Link to="/profile" className="profile-icon">
                            <div className="circle">
                                <p>T</p>
                            </div>
                        </Link>
                        <button onClick={onLogout} className="logout-button">Logout</button>
                    </div>
                </>
            ) : (
                <div className="button-group">
                    <button className="login-button navbar-buttons" onClick={toggleLoginModal}>Log In</button>
                    <button className="signup-button navbar-buttons" onClick={toggleSignupModal}>Sign Up</button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
