import React, { useState } from 'react';
import '../styles/settings.css';
import { FaUserCircle, FaLock, FaCommentDots, FaBell, FaKeyboard, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import UpdateProfile from '../components/UpdateProfile';

const SettingsPage = ({ onLogout }) => {

    const [activeView, setActiveView] = useState('default');

    const renderContent = () => {
        switch (activeView) {
            case 'updateProfile':

                return <UpdateProfile onBack={() => setActiveView('default')} />;

            default:
                return (
                    <div className="settings-placeholder">
                        <h2>Settings</h2>
                        <p>Select an option from the menu to view or edit your settings.</p>
                    </div>
                );
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-sidebar">
                <div className="settings-profile">
                    <FaUserCircle size={40} />
                    <div className="settings-profile-info">
                        <h4>Rushi Nimbhore</h4>
                        <p>Hey there! I am using TalkSphere.</p>
                    </div>
                </div>
                <div className="settings-search">
                    <input type="text" placeholder="Search settings" />
                </div>
                <ul className="settings-menu">
                    { }
                    <li onClick={() => setActiveView('updateProfile')} className="update-profile">
                        <FaUserCircle /> Update Profile
                    </li>
                    { }
                    <li><FaLock /> Privacy</li>
                    <li><FaCommentDots /> Chats</li>
                    <li><FaBell /> Notifications</li>
                    <li><FaKeyboard /> Keyboard shortcuts</li>
                    <li><FaQuestionCircle /> Help</li>
                    <li onClick={onLogout} className="logout-option">
                        <FaSignOutAlt /> Log out
                    </li>
                </ul>
            </div>
            <div className="settings-content">
                { }
                {renderContent()}
            </div>
        </div>
    );
};

export default SettingsPage;