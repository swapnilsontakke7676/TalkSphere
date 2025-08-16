// frontend/src/pages/AdminPage.jsx

import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUserByAdmin, updateUserRoleByAdmin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPage.css';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/chats');
        } else {
            fetchUsers();
        }
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            const { data } = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUserByAdmin(userId);
                fetchUsers(); // Refresh the user list
            } catch (error) {
                console.error('Failed to delete user', error);
            }
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRoleByAdmin(userId, newRole);
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error('Failed to update user role', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-page">
            <h1>All Users</h1>
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td data-label="ID">{u._id}</td>
                                <td data-label="Name">{u.name}</td>
                                <td data-label="Email">{u.email}</td>
                                <td data-label="Username">{u.username}</td>
                                <td data-label="Role">
                                    <select
                                        className="role-select"
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td data-label="Actions">
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteUser(u._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;