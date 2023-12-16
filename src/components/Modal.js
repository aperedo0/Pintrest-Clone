import React from 'react';
const baseURL = process.env.REACT_APP_API_BASE_URL;

const Modal = ({ isOpen, toggleModal, id, children }) => {
    if (!isOpen) return null;

    return (
        <div id={id} className="modal form-container-modal">
            {children}
            {/* <button onClick={toggleModal}>Close</button> */}
        </div>
    );
};

export default Modal;
