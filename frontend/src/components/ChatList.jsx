// frontend/src/components/ChatList.jsx
import React, { useState, useEffect } from 'react';
import { IoSearch } from "react-icons/io5";
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import GroupChatModal from './GroupChatModal';
import UserListItem from './UserListItem';
import { searchUsers, accessChat } from '../services/api';
import { toast } from 'react-toastify';
import useDebounce from '../hooks/useDebounce'; // Import the new hook

const ChatList = () => {
    const { user } = useAuth();
    const { chats, setChats, selectedChat, setSelectedChat } = useChat();
    const [isGroupModalOpen, setGroupModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    // Use the debounced search term
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setSearchResult([]);
            return;
        }

        const handleSearch = async () => {
            try {
                setLoading(true);
                const { data } = await searchUsers(debouncedSearch);
                setSearchResult(data);
            } catch (error) {
                toast.error("Failed to load search results");
            } finally {
                setLoading(false);
            }
        };

        handleSearch();
    }, [debouncedSearch]); // Effect now runs on the debounced value

    const handleAccessChat = async (userId) => {
        try {
            const { data } = await accessChat(userId);
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }
            setSelectedChat(data);
            setSearch(""); // Clear search input
        } catch (error) {
            toast.error("Error fetching chat");
        }
    };

    const getSenderName = (loggedUser, users) => {
        return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
    };

    const getSenderAvatar = (loggedUser, users) => {
        const senderName = users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
        return senderName?.substring(0, 2).toUpperCase() || '??';
    }

    const showSearchResults = search.trim().length > 0;

    return (
        <>
            <div className="chat-list">
                <div className="chat-list-header with-button">
                    <h2 className="chat-list-title">Chats</h2>
                    <button className="new-group-button" onClick={() => setGroupModalOpen(true)}>
                        New Group +
                    </button>
                </div>

                <div className="chat-search-bar">
                    <IoSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input-placeholder"
                        placeholder="Search or start new chat"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="chat-items">
                    {showSearchResults ? (
                        loading ? <p>Loading...</p> :
                            searchResult.map((u) => (
                                <UserListItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleAccessChat(u._id)}
                                />
                            ))
                    ) : (
                        chats.map((chat) => (
                            <div
                                key={chat._id}
                                className={`chat-item ${selectedChat?._id === chat._id ? "selected" : ""}`}
                                onClick={() => setSelectedChat(chat)}
                            >
                                <div className="chat-avatar">{!chat.isGroupChat ? getSenderAvatar(user, chat.users) : chat.chatName.substring(0, 2).toUpperCase()}</div>
                                <div className="chat-info">
                                    <div className="chat-name-time">
                                        <div className="chat-name">
                                            {!chat.isGroupChat ? getSenderName(user, chat.users) : chat.chatName}
                                        </div>
                                        {chat.latestMessage && (
                                            <div className="chat-time">
                                                {new Date(chat.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        )}
                                    </div>
                                    <div className="chat-preview">
                                        {chat.latestMessage && (
                                            <>
                                                {chat.latestMessage.sender && `${chat.latestMessage.sender.name.split(' ')[0]}: `}
                                                {chat.latestMessage.content}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div >
            <GroupChatModal isOpen={isGroupModalOpen} onClose={() => setGroupModalOpen(false)} />
        </>
    );
};

export default ChatList;