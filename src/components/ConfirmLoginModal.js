import React from 'react';

const ConfirmLoginModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="modal">
            <p>Are you sure you want to log in?</p>
            <button onClick={onConfirm}>Yes</button>
            <button onClick={onCancel}>No</button>
        </div>
    );
}

export default ConfirmLoginModal;
