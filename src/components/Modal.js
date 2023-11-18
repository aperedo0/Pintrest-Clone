import React from 'react';

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
