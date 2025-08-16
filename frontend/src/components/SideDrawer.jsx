// frontend/src/components/SideDrawer.jsx

import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { searchUsers, accessChat } from '../services/api';
import UserListItem from './UserListItem';
import '../styles/SideDrawer.css'; // We will create this CSS file next

const SideDrawer = ({ isOpen, onClose }) => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { setSelectedChat, chats, setChats } = useChat();

    const handleSearch = async () => {
        if (!search) {
            // You can add a toast notification here
            return;
        }
        try {
            setLoading(true);
            const { data } = await searchUsers(search);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            // Handle error with a toast
            setLoading(false);
        }
    };

    const handleAccessChat = async (userId) => {
        try {
            const { data } = await accessChat(userId);
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }
            setSelectedChat(data);
            onClose(); // Close the drawer
        } catch (error) {
            // Handle error
        }
    };

    return (
        <div className={`side-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="side-drawer" onClick={(e) => e.stopPropagation()}>
                <h2 className="drawer-title">Search Users</h2>
                <div className="drawer-search-form">
                    <input
                        placeholder="Search by name or email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button onClick={handleSearch}>Go</button>
                </div>
                <div className="drawer-results">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        searchResult?.map((user) => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAccessChat(user._id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SideDrawer;