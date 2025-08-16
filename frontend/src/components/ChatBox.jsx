import React from 'react';
import { useAuth } from '../context/AuthContext';
import ScrollableChat from './ScrollableChat'; // Import the scrollable chat component

const ChatBox = ({ currentChat, currentMessages, messageInput, setMessageInput, sendMessage, handleBack, loading }) => {
    const { user } = useAuth();

    const getSenderName = (loggedUser, users) => {
        return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
    };

    const getSenderAvatar = (loggedUser, users) => {
        const senderName = users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
        return senderName?.substring(0, 2).toUpperCase() || '??';
    };

    if (!currentChat) {
        return (
            <div className="chat-box">
                <div className="welcome-state">
                    <h2>TalkSphere Web</h2>
                    <p>Select a user to start chatting.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-box">
            <div className="chat-header">
                <button className="back-btn" onClick={handleBack}>&#8592;</button>
                <div className="chat-avatar">{!currentChat.isGroupChat ? getSenderAvatar(user, currentChat.users) : currentChat.chatName.substring(0, 2).toUpperCase()}</div>
                <div className="chat-header-info">
                    <h3>{!currentChat.isGroupChat ? getSenderName(user, currentChat.users) : currentChat.chatName}</h3>
                    <p>Online</p> {/* You can implement this later */}
                </div>
            </div>

            <div className="chat-messages">
                {loading ? <p>Loading messages...</p> : <ScrollableChat messages={currentMessages} />}
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
                    <button type="submit" className="send-btn" title="Send">&#10148;</button>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;