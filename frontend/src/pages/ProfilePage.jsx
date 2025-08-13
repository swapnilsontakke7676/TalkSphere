import React from 'react';
import { IoArrowBack, IoPencil } from 'react-icons/io5';
import '../styles/ProfilePage.css'; // We'll create this CSS file next

// A placeholder for the user's avatar
import userAvatar from '../assets/react.svg';

const ProfilePage = ({ user, onBack }) => {
    return (
        <div className="profile-page-container">
            <div className="profile-sidebar">
                <div className="profile-header">
                    <button onClick={onBack} className="back-button">
                        <IoArrowBack size={24} />
                    </button>
                    <h2>Profile</h2>
                </div>

                <div className="profile-picture-section">
                    <img src={userAvatar} alt="User Avatar" className="profile-avatar" />
                </div>

                <div className="profile-info-section">
                    <div className="info-item">
                        <label>Your name</label>
                        <div className="info-content">
                            <span>{user.name}</span>
                            <IoPencil className="edit-icon" />
                        </div>
                        <p className="info-helper">
                            This is not your username or PIN. This name will be visible to your TalkSphere contacts.
                        </p>
                    </div>

                    <div className="info-item">
                        <label>About</label>
                        <div className="info-content">
                            <span>{user.about}</span>
                            <IoPencil className="edit-icon" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-main-content">
                {/* This is the placeholder area on the right, like in your screenshot */}
                {/* You can add more settings or content here later */}
            </div>
        </div>
    );
};

export default ProfilePage;