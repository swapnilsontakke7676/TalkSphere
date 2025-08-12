import React from 'react';

const ChatBox = ({ currentChat, currentMessages, messageInput, setMessageInput, sendMessage, handleBack }) => {

    if (!currentChat) {
        return (
            <div className="chat-box">
                <div className="welcome-state">
                    <h2>TalkSphere Web</h2>
                    <p>Send and receive messages with your friends.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-box">
            <div className="chat-header">
                <button className="back-btn" onClick={handleBack}>&#8592;</button> {}
                <div className="chat-avatar">{currentChat.avatar}</div>
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
                        placeholder="Type a message..."
                        required
                    />
                    <button type="submit" className="send-btn" title="Send">
                        &#10148; {}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;