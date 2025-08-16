import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getAllUsers, deleteUserByAdmin, updateUserRoleByAdmin } from '../../services/api';
import { IoArrowBack } from 'react-icons/io5';
import '../../styles/AdminPage.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { handleMobileBack } = useOutletContext(); // Get the back handler

    useEffect(() => {
        fetchUsers();
    }, []);

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
                fetchUsers();
            } catch (error) {
                console.error('Failed to delete user', error);
            }
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRoleByAdmin(userId, { role: newRole });
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user role', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <button className="mobile-back-button" onClick={handleMobileBack}>
                    <IoArrowBack />
                </button>
                <h1>User Management</h1>
            </div>
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

export default UserManagement;