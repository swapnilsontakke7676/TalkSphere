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
    const [currentView, setCurrentView] = useState({ view: 'chats', section: null });

    const socket = useSocket();

    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);

    useEffect(() => {
        if (!socket) return;
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, [socket]);

    const handleTyping = (e) => {
        setMessageInput(e.target.value);

        if (!socket) return;

        socket.emit('typing', selectedChat._id);

        if (typingTimeout) clearTimeout(typingTimeout);

        const timer = setTimeout(() => {
            socket.emit('stop typing', selectedChat._id);
        }, 3000); // 3 seconds

        setTypingTimeout(timer);
    };

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
            // Update the main chats list
            setChats((prevChats) =>
                prevChats.map((chat) => {
                    if (chat._id === newMessage.chat._id) {
                        return { ...chat, latestMessage: newMessage };
                    }
                    return chat;
                })
            );

            // Update messages if the chat is currently open
            if (selectedChat && selectedChat._id === newMessage.chat._id) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            } else {
                // Optional: You can add a notification here for messages in other chats
                toast.info(`New message in ${newMessage.chat.isGroupChat ? newMessage.chat.chatName : newMessage.sender.name}`);
            }
        };

        socket.on("message received", messageReceivedHandler);

        return () => {
            socket.off("message received", messageReceivedHandler);
        };
    }, [socket, selectedChat, setChats]);

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
            setChats(
                chats.map((chat) => {
                    if (chat._id === selectedChat._id) {
                        return { ...chat, latestMessage: data };
                    }
                    return chat;
                })
            );

            setMessageInput('');
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    // Helper functions
    const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
    const handleBack = () => setSelectedChat(null);
    const handleNavigate = (view, section = null) => {
        setCurrentView({ view, section });
    };

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

            {currentView.view === 'chats' ? (
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
                        isTyping={isTyping}
                        handleTyping={handleTyping}
                    />
                </div>
            ) : (
                // Render the new SettingsPage when view is 'settings'
                <SettingsPage
                    initialSection={currentView.section}
                    onBack={() => handleNavigate('chats')}
                    onLogout={handleLogoutClick}
                />
            )}

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