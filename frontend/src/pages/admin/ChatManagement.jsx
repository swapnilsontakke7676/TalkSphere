import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import '../../styles/AdminPage.css';

const ChatManagement = () => {
    const { handleMobileBack } = useOutletContext();

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <button className="mobile-back-button" onClick={handleMobileBack}>
                    <IoArrowBack />
                </button>
                <h1>Chat Management</h1>
            </div>
            <p style={{ padding: '0 2rem' }}>This feature is coming soon.</p>
        </div>
    );
};

export default ChatManagement;