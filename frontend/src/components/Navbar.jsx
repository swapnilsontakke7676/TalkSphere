import React from 'react';
import { IoChatbubblesSharp, IoSparklesSharp, IoPersonCircleSharp, IoSettingsSharp, IoLogoReact, IoSunny, IoMoon } from "react-icons/io5";
import { useTheme } from '../context/ThemeContext';

const NavBar = ({ currentView, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="main-nav">
      <div className="nav-logo" onClick={() => onNavigate('chats')}>
        <IoLogoReact size={32} />
      </div>
      <ul className="nav-list">
        <li>
          <div
            className={`nav-item ${currentView === 'chats' ? 'active' : ''}`}
            onClick={() => onNavigate('chats')}
          >
            <IoChatbubblesSharp size={24} />
            <span>Chats</span>
          </div>
        </li>
        {/* <li>
          <div
            className={`nav-item ${currentView === 'ai' ? 'active' : ''}`}
            onClick={() => alert('AI page not implemented yet!')}
          >
            <IoSparklesSharp size={24} />
            <span>AI</span>
          </div>
        </li> */}
        <li>
          {/* --- THIS IS THE CHANGE --- */}
          <div
            className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
            onClick={() => onNavigate('profile')} /* Changed from alert to navigate */
          >
            <IoPersonCircleSharp size={24} />
            <span>Profile</span>
          </div>
        </li>
      </ul>
      <div className="nav-footer">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? <IoMoon size={22} /> : <IoSunny size={22} />}
        </button>
        <div
          className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          <IoSettingsSharp size={24} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;