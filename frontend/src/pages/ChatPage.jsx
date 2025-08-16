import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { fetchChats, fetchMessages, sendMessage as sendMessageAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import "../styles/chat.css";

import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';
import SideDrawer from '../components/SideDrawer';
import NavBar from '../components/NavBar';
import SettingsPage from './SettingsPage'; // Assuming these are used
import ProfilePage from './ProfilePage'; // Assuming these are used

const ChatPage = () => {
    const { user, logout } = useAuth();
    const { selectedChat, setSelectedChat, chats, setChats } = useChat(); // Use context state

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [currentView, setCurrentView] = useState('chats');

    const socket = useSocket();

    // 1. Fetch all chats for the logged-in user
    useEffect(() => {
        const getChats = async () => {
            try {
                const { data } = await fetchChats();
                setChats(data);
            } catch (error) {
                toast.error("Failed to load chats");
            }
        };
        getChats();
    }, [setChats]);

    // 2. Fetch messages when a chat is selected
    useEffect(() => {
        if (!selectedChat) return;

        const getMessages = async () => {
            setLoading(true);
            try {
                const { data } = await fetchMessages(selectedChat._id);
                setMessages(data);
                setLoading(false);
                socket.emit("join chat", selectedChat._id);
            } catch (error) {
                toast.error("Failed to load messages");
                setLoading(false);
            }
        };
        getMessages();
    }, [selectedChat, socket]);

    // 3. Listen for incoming messages
    useEffect(() => {
        if (!socket) return;

        const messageReceivedHandler = (newMessage) => {
            if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
                // Handle notification for other chats
            } else {
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        socket.on("message received", messageReceivedHandler);

        return () => {
            socket.off("message received", messageReceivedHandler);
        };
    }, [socket, selectedChat]);

    // 4. Send a message
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        try {
            const { data } = await sendMessageAPI({
                content: messageInput,
                chatId: selectedChat._id,
            });
            socket.emit("new message", data);
            setMessages([...messages, data]);
            setMessageInput('');
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    // Helper functions
    const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
    const handleBack = () => setSelectedChat(null);
    const handleNavigate = (view) => setCurrentView(view);

    // Logout confirmation popup state
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = () => setShowLogoutConfirm(true);
    const handleLogoutConfirm = () => {
        setShowLogoutConfirm(false);
        logout();
    };
    const handleLogoutCancel = () => setShowLogoutConfirm(false);

    return (
        <div className="chat-container">
            <NavBar currentView={currentView} onNavigate={handleNavigate} />
            <SideDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />

            {currentView === 'chats' && (
                <div className={`chat-layout ${selectedChat ? 'view-chat' : ''}`}>
                    <ChatList startNewChat={toggleDrawer} />
                    <ChatBox
                        currentChat={selectedChat}
                        currentMessages={messages}
                        messageInput={messageInput}
                        setMessageInput={setMessageInput}
                        sendMessage={sendMessage}
                        handleBack={handleBack}
                        loading={loading}
                    />
                </div>
            )}

            {currentView === 'settings' && (
                <SettingsPage
                    onLogout={handleLogoutClick}
                />
            )}
            {currentView === 'profile' && <ProfilePage user={user} onBack={() => handleNavigate('chats')} />}

            {showLogoutConfirm && (
                <div className="logout-confirm-overlay">
                    <div className="logout-confirm-modal">
                        <p>Are you sure you want to logout?</p>
                        <button onClick={handleLogoutConfirm}>Yes</button>
                        <button onClick={handleLogoutCancel}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;