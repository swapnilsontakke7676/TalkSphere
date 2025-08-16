import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminPage.css';

const AdminLayout = () => {
    // State to manage mobile view ('menu' or 'content')
    const [mobileView, setMobileView] = useState('menu');

    // Handlers to switch between views
    const showContent = () => setMobileView('content');
    const showMenu = () => setMobileView('menu');

    return (
        <div className={`admin-layout ${mobileView === 'content' ? 'mobile-content-view' : ''}`}>
            <AdminSidebar onLinkClick={showContent} />
            <main className="admin-main-content">
                {/* Pass the 'showMenu' function to child routes via context */}
                <Outlet context={{ handleMobileBack: showMenu }} />
            </main>
        </div>
    );
};

export default AdminLayout;
