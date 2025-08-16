import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { searchUsers, renameGroup, addUserToGroup, removeUserFromGroup } from '../services/api';
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItem';
import { toast } from 'react-toastify';
import '../styles/GroupChatModal.css'; // Reusing some styles

const UpdateGroupChatModal = ({ isOpen, onClose, fetchMessages }) => {
    const { selectedChat, setSelectedChat, chats, setChats } = useChat();
    const { user } = useAuth();

    const [chatName, setChatName] = useState(selectedChat.chatName);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const handleRemove = async (userToRemove) => {
        if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
            return toast.error("Only admins can remove someone!");
        }

        try {
            const { data } = await removeUserFromGroup(selectedChat._id, userToRemove._id);
            userToRemove._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
            // fetchMessages(); // You'll need to pass this function down
            setChats(chats.filter(c => c._id !== data._id));
        } catch (error) {
            toast.error("Failed to remove user");
        }
    };

    const handleAddUser = async (userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            return toast.error("User is already in the group!");
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            return toast.error("Only admins can add someone!");
        }

        try {
            const { data } = await addUserToGroup(selectedChat._id, userToAdd._id);
            setSelectedChat(data);
        } catch (error) {
            toast.error("Failed to add user");
        }
    };

    const handleRename = async () => {
        if (!chatName) return;
        try {
            setRenameLoading(true);
            const { data } = await renameGroup(selectedChat._id, chatName);
            setSelectedChat(data);
            // Also update the list of chats
            setChats(chats.map(c => (c._id === data._id ? data : c)));
            setRenameLoading(false);
            toast.success("Group name updated!");
        } catch (error) {
            toast.error("Failed to rename group");
            setRenameLoading(false);
        }
    };

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

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">{selectedChat.chatName}</h2>
                <div className="selected-users-container">
                    {selectedChat.users.map(u => (
                        <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                    ))}
                </div>

                <div className="rename-form">
                    <input
                        type="text"
                        placeholder="New Chat Name"
                        className="modal-input"
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                    />
                    <button className="modal-button rename-button" onClick={handleRename} disabled={renameLoading}>
                        {renameLoading ? 'Updating...' : 'Update Name'}
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Add user to group"
                    className="modal-input"
                    onChange={(e) => handleSearch(e.target.value)}
                />

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

                <button className="modal-button leave-button" onClick={() => handleRemove(user)}>
                    Leave Group
                </button>
            </div>
        </div>
    );
};

export default UpdateGroupChatModal;