import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import "../styles/chat.css";

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState({
        user1: [
            { id: 1, sender: 'JD', content: 'Hey, how are you doing?', sent: false },
            { id: 2, sender: 'ME', content: "I'm doing great, thanks for asking!", sent: true }
        ],
        user2: [
            { id: 1, sender: 'SM', content: 'Thanks for your help!', sent: false },
            { id: 2, sender: 'ME', content: 'Anytime! Happy to help.', sent: true }
        ],
        user3: [
            { id: 1, sender: 'MJ', content: 'See you tomorrow', sent: false }
        ]
    });

    const { user, logout } = useAuth();

    // Sample chat data
    const chats = {
        user1: { name: 'John Doe', avatar: 'JD', status: 'Online', preview: 'Hey, how are you doing?', time: '2m' },
        user2: { name: 'Sarah Miller', avatar: 'SM', status: 'Away', preview: 'Thanks for your help!', time: '5m' },
        user3: { name: 'Mike Johnson', avatar: 'MJ', status: 'Offline', preview: 'See you tomorrow', time: '1h' }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const selectChat = (chatId) => {
        setSelectedChat(chatId);
        setIsMobileMenuOpen(false); // Close mobile menu when chat is selected
    };

    const startNewChat = () => {
        alert('New chat functionality would be implemented here');
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedChat) return;

        const newMessage = {
            id: Date.now(),
            sender: 'ME',
            content: messageInput,
            sent: true
        };

        setMessages(prev => ({
            ...prev,
            [selectedChat]: [...(prev[selectedChat] || []), newMessage]
        }));

        setMessageInput('');
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    const currentChat = selectedChat ? chats[selectedChat] : null;
    const currentMessages = selectedChat ? messages[selectedChat] || [] : [];

    return (
        <div className="chat-container">
            <div className="chat-layout">
                <button 
                    className="mobile-menu-btn" 
                    onClick={toggleMobileMenu}
                >
                    ☰
                </button>

                <div 
                    className={`chat-list ${isMobileMenuOpen ? 'mobile-open' : ''}`} 
                    id="chatList"
                >
                    <div className="chat-list-header">
                        <h2 className="chat-list-title">Messages</h2>
                        <button className="new-chat-btn" onClick={startNewChat}>
                            + New Chat
                        </button>
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
                                    <div className="chat-name">{chat.name}</div>
                                    <div className="chat-preview">{chat.preview}</div>
                                </div>
                                <div className="chat-time">{chat.time}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="chat-box" id="chatBox">
                    {!selectedChat ? (
                        <div className="welcome-state" id="welcomeState">
                            <div className="welcome-icon">💬</div>
                            <h2>Welcome to TalkSphere</h2>
                            <p>Select a conversation to start messaging</p>
                        </div>
                    ) : (
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
                    )}
                </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>

            <div 
                className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} 
                onClick={closeMobileMenu}
            ></div>
        </div>
    );
};

export default ChatPage;