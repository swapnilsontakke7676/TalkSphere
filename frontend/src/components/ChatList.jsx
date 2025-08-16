import React, { useState } from "react";

const ChatList = ({ chats, selectedChat, selectChat, startNewChat }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredChats = Object.entries(chats).filter(([chatId, chat]) =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.preview.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="chat-list">
            <div className="chat-list-header">
                <h2 className="chat-list-title">Chats</h2>
            </div>

            {/* Search bar */}
            <div className="chat-search">
                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="chat-items">
                {filteredChats.length > 0 ? (
                    filteredChats.map(([chatId, chat]) => (
                        <div
                            key={chatId}
                            className={`chat-item ${selectedChat === chatId ? "selected" : ""}`}
                            onClick={() => selectChat(chatId)}
                        >
                            <div className="chat-avatar">{chat.avatar}</div>
                            <div className="chat-info">
                                <div className="chat-name-time">
                                    <div className="chat-name">{chat.name}</div>
                                    <div className="chat-time">{chat.time}</div>
                                </div>
                                <div className="chat-preview">{chat.preview}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-chats">No chats found</div>
                )}
            </div>

            <button className="new-chat-fab" onClick={startNewChat}>+</button>
        </div>
    );
};

export default ChatList;
