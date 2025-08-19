import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { fetchChats, fetchMessages, sendMessage as sendMessageAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import "../styles/chat.css";

import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';
import SideDrawer from '../components/SideDrawer';

const ChatPage = () => {
    const { user, logout } = useAuth();
    const { selectedChat, setSelectedChat, chats, setChats } = useChat();
    const selectedChatRef = useRef(selectedChat);

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const socket = useSocket();

    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

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

    // 1. Fetch all chats for the logged-in user and join rooms
    useEffect(() => {
        if (socket) {
            const getChats = async () => {
                try {
                    const { data } = await fetchChats();
                    setChats(data);
                    // Join a socket room for each chat
                    data.forEach(chat => {
                        socket.emit("join chat", chat._id);
                    });
                } catch (error) {
                    toast.error("Failed to load chats");
                }
            };
            getChats();
        }
    }, [setChats, socket]);

    // 2. Fetch messages when a chat is selected
    useEffect(() => {
        if (!selectedChat) return;

        const getMessages = async () => {
            setLoading(true);
            try {
                const { data } = await fetchMessages(selectedChat._id);
                setMessages(data);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to load messages");
                setLoading(false);
            }
        };
        getMessages();
    }, [selectedChat]);

    // 3. Listen for incoming messages
    useEffect(() => {
        if (!socket) return;

        const messageReceivedHandler = (newMessage) => {
            setChats((prevChats) =>
                prevChats.map((chat) => {
                    if (chat._id === newMessage.chat._id) {
                        return { ...chat, latestMessage: newMessage };
                    }
                    return chat;
                })
            );

            if (selectedChatRef.current && selectedChatRef.current._id === newMessage.chat._id) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            } else {
                toast.info(`New message in ${newMessage.chat.isGroupChat ? newMessage.chat.chatName : newMessage.sender.name}`);
            }
        };

        socket.on("message received", messageReceivedHandler);

        return () => {
            socket.off("message received", messageReceivedHandler);
        };
    }, [socket, setChats]);

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

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const handleLogoutClick = () => setShowLogoutConfirm(true);
    const handleLogoutConfirm = () => {
        setShowLogoutConfirm(false);
        logout();
    };
    const handleLogoutCancel = () => setShowLogoutConfirm(false);

    return (
        <>
            <SideDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />

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

            {showLogoutConfirm && (
                <div className="logout-confirm-overlay">
                    <div className="logout-confirm-modal">
                        <p>Are you sure you want to logout?</p>
                        <button onClick={handleLogoutConfirm}>Yes</button>
                        <button onClick={handleLogoutCancel}>No</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatPage;