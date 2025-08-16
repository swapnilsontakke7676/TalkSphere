import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoHome, IoPeople, IoChatbubbles, IoMegaphone, IoArrowBack } from 'react-icons/io5';
import '../../styles/AdminPage.css';

// onLinkClick prop is passed from AdminLayout
const AdminSidebar = ({ onLinkClick }) => {
    return (
        <div className="admin-sidebar">
            <div className="admin-sidebar-header">
                <h2 className="admin-sidebar-title">Admin Panel</h2>
            </div>
            <nav className="admin-nav" onClick={onLinkClick}>
                <NavLink to="/admin/dashboard" className="admin-nav-link">
                    <IoHome />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/users" className="admin-nav-link">
                    <IoPeople />
                    <span>Users</span>
                </NavLink>
                <NavLink to="/admin/chats" className="admin-nav-link">
                    <IoChatbubbles />
                    <span>Chats</span>
                </NavLink>
                <NavLink to="/admin/announcements" className="admin-nav-link">
                    <IoMegaphone />
                    <span>Announcements</span>
                </NavLink>
            </nav>
            <div className="admin-back-button-wrapper">
                <NavLink to="/chats" className="admin-back-button">
                    <IoArrowBack />
                    <span>Back to Chats</span>
                </NavLink>
            </div>
        </div>
    );
};

export default AdminSidebar;