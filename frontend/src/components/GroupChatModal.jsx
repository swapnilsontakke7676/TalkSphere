import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { searchUsers, createGroupChat } from '../services/api';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';
import '../styles/GroupChatModal.css';
import { toast } from 'react-toastify';

const GroupChatModal = ({ isOpen, onClose }) => {
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { chats, setChats } = useChat();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return setSearchResult([]);

        try {
            setLoading(true);
            const { data } = await searchUsers(query);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast.error("Failed to load search results");
            setLoading(false);
        }
    };

    const handleAddUser = (userToAdd) => {
        if (selectedUsers.some(u => u._id === userToAdd._id)) {
            toast.warn("User already added");
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(u => u._id !== userToDelete._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers.length) {
            return toast.warn("Please fill all the fields");
        }
        if (selectedUsers.length < 2) {
            return toast.warn("More than 2 users are required");
        }

        try {
            const { data } = await createGroupChat({
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(u => u._id)),
            });
            setChats([data, ...chats]);
            onClose();
            toast.success("New group chat created!");
        } catch (error) {
            toast.error("Failed to create group chat");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Create Group Chat</h2>
                <input
                    type="text"
                    placeholder="Chat Name"
                    className="modal-input"
                    onChange={(e) => setGroupChatName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Add Users e.g. John, Jane"
                    className="modal-input"
                    onChange={(e) => handleSearch(e.target.value)}
                />

                <div className="selected-users-container">
                    {selectedUsers.map(u => (
                        <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                    ))}
                </div>

                <div className="search-results-container">
                    {loading ? <div>Loading...</div> : (
                        searchResult?.slice(0, 4).map(user => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                            />
                        ))
                    )}
                </div>

                <button className="modal-button create-button" onClick={handleSubmit}>Create Chat</button>
                <button className="modal-button close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default GroupChatModal;