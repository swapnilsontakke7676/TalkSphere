import React from 'react';
import { IoChatbubblesSharp, IoPersonCircleSharp, IoSettingsSharp, IoLogoReact, IoSunny, IoMoon } from "react-icons/io5";
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
            className={`nav-item ${currentView.view === 'chats' ? 'active' : ''}`}
            onClick={() => onNavigate('chats')}
          >
            <IoChatbubblesSharp size={24} />
            <span>Chats</span>
          </div>
        </li>
        <li>
          {/* This is now active ONLY when the section is 'account' */}
          <div
            className={`nav-item ${currentView.view === 'settings' && currentView.section === 'account' ? 'active' : ''}`}
            onClick={() => onNavigate('settings', 'account')}
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
        {/* This is now active when the section is NOT 'account' */}
        <div
          className={`nav-item ${currentView.view === 'settings' && currentView.section !== 'account' ? 'active' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          <IoSettingsSharp size={24} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;