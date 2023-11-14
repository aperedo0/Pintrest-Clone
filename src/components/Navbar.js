import React, { useState } from 'react';
import '../assets/css/Navbar.css';
import logo from '../assets/img/logo.png';



const Navbar = ({ 
    isAuthenticated, 
    // onLoginClick, 
    // onSignupClick,
    toggleSignupModal, 
    toggleLoginModal, 
    // onHomeClick, 
    // onExploreClick, 
    // onCreateClick, 
    // onLogoutClick 
}) => {
    

    // console.log("Navbar's isAuthenticated:", isAuthenticated);

    if (isAuthenticated) {
        return (
            <nav>

                <div className="login-left">
                    <div className="navbar-logo">
                        <a href="/">
                            <img src={logo} alt="Pinterest Clone Logo"></img>
                        </a>
                    </div>
                    <a className="active-nav" href="/">Home</a>
                    <a href="/explore">Explore</a>
                    <a href="/create">Create</a>
                </div>

                <input type="text" placeholder="Search..." className="search-bar"></input>

                <div className="login-right">

                    <a href="/notifications">
                        <span className="icon-bell"></span> Notifications
                    </a>
                    <a href="/inbox">
                        <span className="icon-message"></span> Inbox
                    </a>
                    <a href="/profile" className="profile-icon">
                        <div className="circle">
                            <p>T</p>
                        </div>
                    </a>
                    <a href="/logout" className="logout-button">Logout</a>

                </div>

            </nav>
            
        );
    } else {
        return (
            <nav className="navbar">

                <div className="navbar-logo">
                    <a href="/">
                        <img src={logo} alt="Pinterest Clone Logo"></img>
                    </a>
                </div>

                <div className="button-group">
                    <button className="login-button navbar-buttons" id="loginBtn" onClick={toggleLoginModal}>Log In</button>
                    <button className="signup-button navbar-buttons" id="signupBtn" onClick={toggleSignupModal}>Sign Up</button>
                </div>
            </nav>
        );
    }
};

export default Navbar;
