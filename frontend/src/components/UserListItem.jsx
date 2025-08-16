// frontend/src/components/UserListItem.jsx

import React from 'react';
import '../styles/UserListItem.css'; // We will create this file next

const UserListItem = ({ user, handleFunction }) => {
    return (
        <div onClick={handleFunction} className="user-list-item">
            <img src={user.profilePic} alt={user.name} className="user-avatar" />
            <div className="user-info">
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
            </div>
        </div>
    );
};

export default UserListItem;