import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../services/api';
import { toast } from 'react-toastify';
import { FaUserCircle, FaLock, FaBell, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import '../styles/settings.css';

const SettingsPage = ({ initialSection, onBack, onLogout }) => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [profileImage, setProfileImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('account');
    const [mobileView, setMobileView] = useState('menu'); // 'menu' or 'content'

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
            setProfileImage(user.profilePic);
        }
    }, [user]);

    useEffect(() => {
        // If navigated directly to a section (e.g., from Profile icon)
        if (initialSection) {
            setActiveSection(initialSection);
            setMobileView('content'); // Show the content view directly on mobile
        }
    }, [initialSection]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setProfileImage(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        if (formData.name === user.name && profileImage === user.profilePic) {
            return toast.info("No changes to save.");
        }
        setIsLoading(true);
        try {
            const { data } = await updateUser(user._id, {
                name: formData.name,
                profilePic: profileImage,
            });
            login(data); // This updates the user in context and local storage
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSectionClick = (section) => {
        setActiveSection(section);
        setMobileView('content'); // Switch to content view on mobile
    };

    // This new function handles the back navigation logic
    const handleMobileBack = () => {
        // If we came directly to a section, go all the way back to chats
        if (initialSection) {
            onBack();
        } else {
            // Otherwise, just go back to the settings menu
            setMobileView('menu');
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'account':
                return (
                    <div className="settings-content-main">
                        <button className="mobile-back-button" onClick={handleMobileBack}>
                            <FaArrowLeft /> Back
                        </button>
                        <h3>My Account</h3>
                        <div className="account-card">
                            <div className="account-header">
                                <div className="avatar-uploader">
                                    <img src={profileImage} alt="Avatar" className="large-avatar" />
                                    <label htmlFor="avatar-upload" className="avatar-edit-label">
                                        Change Avatar
                                    </label>
                                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleImageUpload} />
                                </div>
                                <div className="user-info-display">
                                    <span className="display-name">{user.name}</span>
                                    <span className="username">{user.username}</span>
                                </div>
                            </div>
                            <div className="account-form">
                                <div className="form-group">
                                    <label>USERNAME</label>
                                    <input type="text" value={user.username} disabled />
                                </div>
                                <div className="form-group">
                                    <label>FULL NAME</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>EMAIL</label>
                                    <input type="email" value={formData.email} disabled />
                                </div>
                                <button className="save-button" onClick={handleSaveChanges} disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="settings-content-main">
                        <button className="mobile-back-button" onClick={handleMobileBack}>
                            <FaArrowLeft /> Back
                        </button>
                        <h3>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h3>
                        <p>Settings for this section are not yet available.</p>
                    </div>
                );
        }
    };

    return (
        <div className={`settings-page ${mobileView === 'content' ? 'mobile-content-view' : ''}`}>
            <div className="settings-sidebar">
                <ul className="settings-nav">
                    <p className="nav-header">User Settings</p>
                    <li className={activeSection === 'account' ? 'active' : ''} onClick={() => handleSectionClick('account')}>
                        <FaUserCircle /> My Account
                    </li>
                    <li className={activeSection === 'privacy' ? 'active' : ''} onClick={() => handleSectionClick('privacy')}>
                        <FaLock /> Privacy & Safety
                    </li>
                    <li className={activeSection === 'notifications' ? 'active' : ''} onClick={() => handleSectionClick('notifications')}>
                        <FaBell /> Notifications
                    </li>
                    <div className="nav-divider"></div>
                    <li onClick={onLogout}>
                        <FaSignOutAlt /> Log Out
                    </li>
                </ul>
                <div className="back-button-wrapper">
                    <button onClick={onBack} className="back-button">
                        <FaArrowLeft />
                        <span>Back to Chats</span>
                    </button>
                </div>
            </div>
            <div className="settings-content">
                {renderSection()}
            </div>
        </div>
    );
};

export default SettingsPage;