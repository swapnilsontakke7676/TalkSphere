import React from 'react';

const ChatBox = ({ currentChat, currentMessages, messageInput, setMessageInput, sendMessage }) => {
    if (!currentChat) {
        return (
            <div className="chat-box" id="chatBox">
                <div className="welcome-state" id="welcomeState">
                    <div className="welcome-icon">💬</div>
                    <h2>Welcome to TalkSphere</h2>
                    <p>Select a conversation to start messaging</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-box" id="chatBox">
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div className="chat-header">
                    <div className="chat-header-avatar">{currentChat.avatar}</div>
                    <div className="chat-header-info">
                        <h3>{currentChat.name}</h3>
                        <p>{currentChat.status}</p>
                    </div>
                </div>

                <div className="chat-messages">
                    {currentMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.sent ? 'sent' : ''}`}
                        >
                            <div className="message-avatar">{message.sender}</div>
                            <div className="message-content">{message.content}</div>
                        </div>
                    ))}
                </div>

                <div className="chat-input-container">
                    <form className="chat-input-form" onSubmit={sendMessage}>
                        <input
                            type="text"
                            className="chat-input"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type your message..."
                            required
                        />
                        <button type="submit" className="send-btn">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
