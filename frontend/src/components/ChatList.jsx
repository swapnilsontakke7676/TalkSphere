import React from "react";

const ChatList = ({ chats, selectedChat, selectChat, startNewChat }) => {
    return (
        <div className="chat-list">
            <div className="chat-list-header">
                <h2 className="chat-list-title">Chats</h2>

            </div>
            <div className="chat-items">
                {Object.entries(chats).map(([chatId, chat]) => (
                    <div
                        key={chatId}
                        className={`chat-item ${selectedChat === chatId ? 'selected' : ''}`}
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
                ))}
            </div>
            <button className="new-chat-fab">+</button>
        </div>
    );
};

export default ChatList;