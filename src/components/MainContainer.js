import React, { useState } from 'react';
import '../assets/css/MainContainer.css'; 
import left2 from '../assets/img/left-2.jpg';
import image1 from '../assets/img/image1.jpg';
import image2 from '../assets/img/image2.jpg';
const baseURL = process.env.REACT_APP_API_BASE_URL;


const MainContainer = ({ isAuthenticated }) => {

    // const [showSignUpModal, setShowSignUpModal] = useState(false);
    // const [showLoginModal, setShowLoginModal] = useState(false);

    // const toggleSignUpModal = () => {
    //     setShowSignUpModal(prevState => !prevState);
    // }

    // const toggleLoginModal = () => {
    //     setShowLoginModal(prevState => !prevState);
    // }


    let content;

    if (isAuthenticated) {
        // content = <p>Here you can Login or Signup</p>;
        content = <p>Authenticated Content Here, Not Yet Filled</p>;
    } else {

        content = (
            <>

                <div className="container">
                    <div id="error-message" style={{color: 'red'}}></div>

                    <div className="left-section">

                        <div className="rectangle-container">
                            <div className="rectangle">
                                <img src={image1} alt="Easy Dinner Cooking"></img>
                            </div>
                            <div className="rectangle">
                                <img src={image2} alt="Easy Dinner Cooking"></img>
                            </div>
                        </div>  
                        <div className="search-container">          
                            <div className="search-bar-main-container">
                                <span className="magnifying-glass">🔍</span>
                                <p className="easy"> easy chicken dinner</p>
                            </div>
                        </div>
                    </div>

                    <div className="right-section text-section">

                        <h1>What's Your Next Discovery</h1>
                        <p>Dive into a world of ideas, from 'easy</p>
                        <p>chicken dinner' to your next</p>
                        <p>captivating project. What will you</p>
                        <p>discover today?</p>
                        <button>Explore</button>
                    </div>
                </div>



                <div className="container">

                    <div className="left-section-2 text-section">
                        <h1>What Will You Create?</h1>
                        <p>Discover a world of possibilities with</p>
                        <p>Pintrest. From a whimsical DIY projects to</p>
                        <p>adventurous travel plans, let your</p>
                        <p>imagination run wild</p>
                        <button>Explore</button>
                    </div>

                    <div className="right-section-2">
                        <img src={left2} alt="Description of Image 1"></img>
                    </div>


                </div>


                <div className="background-section">
                    <div className="empty-container"></div>
                    <div className="form-container">
                        <div className="actual-form">
                            <h1>Welcome to Pinterest</h1>
                            <p>Find new ideas to try.</p>
                            <form action="/signup" method="POST">
                                <p className="left">Username</p>
                                <input type="text" name="username" placeholder="Username" required></input>
                                <p className="left">Email</p>
                                <input type="email" name="email" placeholder="Email" required></input>
                                <p className="left">Password</p>
                                <input type="password" name="password" placeholder="Password" required></input>
                                <p className="left">Birthdate</p>
                                <input type="date" name="birthdate" placeholder="Birthday" required></input>
                                <br></br>
                                <button type="submit" value="Register">Sign Up</button>
                            </form>
                            <p>Already a member? <a href="#">Log in</a></p>
                        </div>
                    </div>
                </div>
            </>
                        );

                    }

    return (
        <div className="main-container">
            {content}
        </div>
    );
}

export default MainContainer;
