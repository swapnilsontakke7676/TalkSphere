import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUser, updateUserPassword } from '../services/api';
import { toast } from 'react-toastify';
import { FaUserCircle, FaLock, FaBell, FaSignOutAlt, FaArrowLeft, FaKey } from 'react-icons/fa';
import '../styles/settings.css';

const SettingsPage = ({ initialSection, onBack, onLogout }) => {
    const navigate = useNavigate();
    const { handleLogoutClick } = useOutletContext(); // Get logout function from layout
    const { user, login } = useAuth();
    // State for My Account
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [profileImage, setProfileImage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // State for Password Change
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [activeSection, setActiveSection] = useState('account');
    const [mobileView, setMobileView] = useState('menu');

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
            setProfileImage(user.profilePic);
        }
    }, [user]);

    useEffect(() => {
        if (initialSection) {
            setActiveSection(initialSection);
            setMobileView('content');
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
        setIsSaving(true);
        try {
            const { data } = await updateUser(user._id, { name: formData.name, profilePic: profileImage });
            login(data);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            return toast.error("Please fill all password fields.");
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("New passwords do not match.");
        }
        setIsChangingPassword(true);
        try {
            await updateUserPassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Password changed successfully!");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password.");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleSectionClick = (section) => {
        setActiveSection(section);
        setMobileView('content');
    };

    const handleMobileBack = () => {
        if (initialSection) {
            onBack();
        } else {
            setMobileView('menu');
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'account':
                return (
                    <div className="settings-content-main">
                        <button className="mobile-back-button" onClick={handleMobileBack}><FaArrowLeft /> Back</button>
                        <h3>My Account</h3>
                        <div className="account-card">
                            <div className="account-header">
                                <div className="avatar-uploader">
                                    <img src={profileImage} alt="Avatar" className="large-avatar" />
                                    <label htmlFor="avatar-upload" className="avatar-edit-label">Change Avatar</label>
                                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleImageUpload} />
                                </div>
                                <div className="user-info-display">
                                    <span className="display-name">{user.name}</span>
                                    <span className="username">{user.username}</span>
                                </div>
                            </div>
                            <div className="account-form">
                                <div className="form-group"><label>FULL NAME</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                                <div className="form-group"><label>EMAIL</label><input type="email" value={formData.email} disabled /></div>
                                <button className="save-button" onClick={handleSaveChanges} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</button>
                            </div>
                        </div>
                    </div>
                );
            case 'password':
                return (
                    <div className="settings-content-main">
                        <button className="mobile-back-button" onClick={handleMobileBack}><FaArrowLeft /> Back</button>
                        <h3>Password & Security</h3>
                        <div className="account-card">
                            <div className="account-form">
                                <div className="form-group">
                                    <label>CURRENT PASSWORD</label>
                                    <input type="password" placeholder="••••••••" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>NEW PASSWORD</label>
                                    <input type="password" placeholder="••••••••" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>CONFIRM NEW PASSWORD</label>
                                    <input type="password" placeholder="••••••••" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
                                </div>
                                <button className="save-button" onClick={handlePasswordChange} disabled={isChangingPassword}>{isChangingPassword ? "Saving..." : "Change Password"}</button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="settings-content-main">
                        <button className="mobile-back-button" onClick={handleMobileBack}><FaArrowLeft /> Back</button>
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
                    <li className={activeSection === 'account' ? 'active' : ''} onClick={() => handleSectionClick('account')}><FaUserCircle /> My Account</li>
                    <li className={activeSection === 'password' ? 'active' : ''} onClick={() => handleSectionClick('password')}><FaKey /> Password & Security</li>
                    <li className={activeSection === 'privacy' ? 'active' : ''} onClick={() => handleSectionClick('privacy')}><FaLock /> Privacy & Safety</li>
                    <li className={activeSection === 'notifications' ? 'active' : ''} onClick={() => handleSectionClick('notifications')}><FaBell /> Notifications</li>
                    < div className="nav-divider" > </div>
                    < li onClick={handleLogoutClick} > {/* Use the passed down function */}
                        < FaSignOutAlt /> Log Out
                    </li>
                </ul>
                < div className="back-button-wrapper" >
                    <button onClick={() => navigate('/chats')} className="back-button" > {/* Use navigate */}
                        <FaArrowLeft />
                        <span>Back to Chats </span>
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