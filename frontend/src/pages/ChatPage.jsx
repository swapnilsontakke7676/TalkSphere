import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import "../styles/chat.css";

import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';

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

    const chats = {
        user1: { name: 'John Doe', avatar: 'JD', status: 'Online', preview: 'Hey, how are you doing?', time: '2m' },
        user2: { name: 'Sarah Miller', avatar: 'SM', status: 'Away', preview: 'Thanks for your help!', time: '5m' },
        user3: { name: 'Mike Johnson', avatar: 'MJ', status: 'Offline', preview: 'See you tomorrow', time: '1h' }
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    const selectChat = (chatId) => {
        setSelectedChat(chatId);
        closeMobileMenu();
    };

    const startNewChat = () => alert('New chat functionality would be implemented here');

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
        if (window.confirm('Are you sure you want to logout?')) logout();
    };

    const currentChat = selectedChat ? chats[selectedChat] : null;
    const currentMessages = selectedChat ? messages[selectedChat] || [] : [];

    return (
        <div className="chat-container">
            <div className="chat-layout">

                <div className={`${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <ChatList
                        chats={chats}
                        selectedChat={selectedChat}
                        selectChat={selectChat}
                        startNewChat={startNewChat}
                    />
                </div>

                <ChatBox
                    currentChat={currentChat}
                    currentMessages={currentMessages}
                    messageInput={messageInput}
                    setMessageInput={setMessageInput}
                    sendMessage={sendMessage}
                />
            </div>

            <button className="logout-btn" onClick={handleLogout}>Logout</button>

            <div className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>
        </div>
    );
};

export default ChatPage;
