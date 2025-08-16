import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const ChatList = ({ startNewChat }) => {
    const { user } = useAuth();
    const { chats, selectedChat, setSelectedChat } = useChat();

    // Helper to get the other user's name in a 1-on-1 chat
    const getSenderName = (loggedUser, users) => {
        return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
    };

    const getSenderAvatar = (loggedUser, users) => {
        const senderName = users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
        return senderName?.substring(0, 2).toUpperCase() || '??';
    }

    return (
        <div className="chat-list">
            <div className="chat-list-header">
                <h2 className="chat-list-title">Chats</h2>
            </div>
            <div className="chat-items">
                {chats.map((chat) => (
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
                            <div className="chat-preview">{chat.latestMessage?.content}</div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="new-chat-fab" onClick={startNewChat}>+</button>
        </div>
    );
};

export default ChatList;