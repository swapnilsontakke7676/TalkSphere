import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import ScrollableChat from './ScrollableChat';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';

const ChatBox = ({ currentChat, currentMessages, messageInput, setMessageInput, sendMessage, handleBack, loading, fetchMessages, isTyping, handleTyping }) => {
    const { user } = useAuth();
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isGroupModalOpen, setGroupModalOpen] = useState(false);
    const chatMessagesRef = useRef(null);

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [currentMessages, isTyping]);

    // This helper function gets the full user object of the other person in the chat
    const getSender = (loggedUser, users) => {
        return users[0]?._id === loggedUser?._id ? users[1] : users[0];
    };

    // This helper gets the initials for the avatar
    const getSenderAvatar = (senderObject) => {
        return senderObject?.name?.substring(0, 2).toUpperCase() || '??';
    }

    const sender = currentChat ? getSender(user, currentChat.users) : null;

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
        <>
            <div className="chat-box">
                <div className="chat-header">
                    <button className="back-btn" onClick={handleBack}>&#8592;</button>

                    {/* This is the new clickable area */}
                    <div
                        className="chat-header-clickable"
                        onClick={() => currentChat.isGroupChat ? setGroupModalOpen(true) : setProfileModalOpen(true)}
                    >
                        <div className="chat-avatar">
                            {!currentChat.isGroupChat
                                ? getSenderAvatar(sender)
                                : currentChat.chatName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="chat-header-info">
                            <h3>{!currentChat.isGroupChat ? sender?.name : currentChat.chatName}</h3>
                            <p>Click here for info</p>
                        </div>
                    </div>
                </div>

                <div className="chat-messages" ref={chatMessagesRef}>
                    {loading ? <p>Loading messages...</p> : <ScrollableChat messages={currentMessages} />}
                    {isTyping ? <div className="typing-indicator">Typing...</div> : <></>}
                </div>

                <div className="chat-input-container">
                    <form className="chat-input-form" onSubmit={sendMessage}>
                        <input
                            type="text"
                            className="chat-input"
                            value={messageInput}
                            onChange={(e) => {
                                setMessageInput(e.target.value);
                                handleTyping(e);
                            }}
                            placeholder="Type a message..."
                            required
                        />
                        <button type="submit" className="send-btn" title="Send">&#10148;</button>
                    </form>
                </div>
            </div>

            {/* Modals remain the same */}
            <ProfileModal user={sender} isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
            <UpdateGroupChatModal isOpen={isGroupModalOpen} onClose={() => setGroupModalOpen(false)} fetchMessages={fetchMessages} />
        </>
    );
};

export default ChatBox;