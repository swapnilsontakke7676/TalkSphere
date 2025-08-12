import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import "../styles/chat.css";

import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';
import NavBar from '../components/NavBar';

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');

    const [chats] = useState({
        user1: { name: 'John Doe', avatar: 'JD', status: 'Online', preview: 'Hey, how are you doing?', time: '2m' },
        user2: { name: 'Sarah Miller', avatar: 'SM', status: 'last seen today at 1:25 PM', preview: 'Thanks for your help!', time: '5m' },
        user3: { name: 'Mike Johnson', avatar: 'MJ', status: 'Offline', preview: 'See you tomorrow', time: '1h' }
    });

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

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) logout();
    };

    // --- Handlers ---
    const selectChat = (chatId) => setSelectedChat(chatId);
    const handleBack = () => setSelectedChat(null);
    const startNewChat = () => alert('New chat!');

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

    const currentChat = selectedChat ? chats[selectedChat] : null;
    const currentMessages = selectedChat ? messages[selectedChat] || [] : [];

    return (
        <div className="chat-container">
            <NavBar />

            <div className={`chat-layout ${selectedChat ? 'view-chat' : ''}`}>
                <ChatList
                    chats={chats}
                    selectedChat={selectedChat}
                    selectChat={selectChat}
                    startNewChat={startNewChat}
                />
                <ChatBox
                    currentChat={currentChat}
                    currentMessages={currentMessages}
                    messageInput={messageInput}
                    setMessageInput={setMessageInput}
                    sendMessage={sendMessage}
                    handleBack={handleBack}
                />
            </div>
            <footer>
                <button onClick={handleLogout}>Logout</button>
            </footer>
        </div>
    );
};

export default ChatPage;