import React from 'react';
import '../styles/ProfileModal.css';

const ProfileModal = ({ user, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="profile-modal-title">{user.name}</h2>
                <img src={user.profilePic} alt={user.name} className="profile-modal-avatar" />
                <p className="profile-modal-email">Email: {user.email}</p>
                <button className="modal-button close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ProfileModal;