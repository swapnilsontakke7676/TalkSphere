import React from 'react';
import { IoChatbubblesSharp, IoSparklesSharp, IoPersonCircleSharp, IoSettingsSharp, IoLogoReact, IoSunny, IoMoon } from "react-icons/io5";
import { useTheme } from '../context/ThemeContext';

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="main-nav">
      <a href="#logo" className="nav-logo">
        <IoLogoReact size={32} />
      </a>
      <ul className="nav-list">
        <li>
          <a href="#chats" className="nav-item active">
            <IoChatbubblesSharp size={24} />
            <span>Chats</span>
          </a>
        </li>
        <li>
          <a href="#ai" className="nav-item">
            <IoSparklesSharp size={24} />
            <span>AI</span>
          </a>
        </li>
        <li>
          <a href="#profile" className="nav-item">
            <IoPersonCircleSharp size={24} />
            <span>Profile</span>
          </a>
        </li>
      </ul>
      <div className="nav-footer">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? <IoMoon size={22} /> : <IoSunny size={22} />}
        </button>
        <a href="#settings" className="nav-item">
          <IoSettingsSharp size={24} />
        </a>
      </div>
    </nav>
  );
};

export default NavBar;