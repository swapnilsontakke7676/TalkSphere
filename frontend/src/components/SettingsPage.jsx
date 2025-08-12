import React from 'react';
import '../styles/settings.css'; // We'll create this CSS file next

// Import icons (using a library like react-icons is recommended)
// For this example, I'll use text placeholders like [i]
import { FaUserCircle, FaLock, FaCommentDots, FaBell, FaKeyboard, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';


const SettingsPage = ({ onLogout }) => {
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
                    <li><FaUserCircle /> Account</li>
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
                <div className="settings-placeholder">
                    <h2>Settings</h2>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;