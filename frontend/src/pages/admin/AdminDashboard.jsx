import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getAdminStats } from '../../services/api';
import { IoPeople, IoChatbubbles, IoArrowBack } from 'react-icons/io5';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, chats: 0 });
    const [loading, setLoading] = useState(true);
    const { handleMobileBack } = useOutletContext(); // Get the back handler

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await getAdminStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch admin stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div>Loading stats...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-page-header">
                <button className="mobile-back-button" onClick={handleMobileBack}>
                    <IoArrowBack />
                </button>
                <h1>Dashboard</h1>
            </div>
            <div className="stats-container">
                <div className="stat-card">
                    <IoPeople className="stat-icon" />
                    <div className="stat-info">
                        <p>Total Users</p>
                        <span>{stats.users}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <IoChatbubbles className="stat-icon" />
                    <div className="stat-info">
                        <p>Total Chats</p>
                        <span>{stats.chats}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;