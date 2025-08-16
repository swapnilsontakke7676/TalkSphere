import React from 'react';
import { IoClose } from 'react-icons/io5';
import '../styles/UserBadgeItem.css';

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <div className="user-badge">
            {user.name}
            <IoClose className="badge-close-icon" onClick={handleFunction} />
        </div>
    );
};

export default UserBadgeItem;