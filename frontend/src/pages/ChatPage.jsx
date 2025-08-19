// frontend/src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { fetchChats, fetchMessages, sendMessage as sendMessageAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import "../styles/chat.css";

import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {
    const { user, logout } = useAuth();
    const { selectedChat, setSelectedChat, chats, setChats } = useChat();
    const selectedChatRef = useRef(selectedChat);

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messageInput, setMessageInput] = useState('');

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
        }, 3000);
        setTypingTimeout(timer);
    };

    useEffect(() => {
        if (socket) {
            const getChats = async () => {
                try {
                    const { data } = await fetchChats();
                    setChats(data);
                    data.forEach(chat => socket.emit("join chat", chat._id));
                } catch (error) {
                    toast.error("Failed to load chats");
                }
            };
            getChats();
        }
    }, [setChats, socket]);

    useEffect(() => {
        if (!selectedChat) return;
        const getMessages = async () => {
            setLoading(true);
            try {
                const { data } = await fetchMessages(selectedChat._id);
                setMessages(data);
            } catch (error) {
                toast.error("Failed to load messages");
            } finally {
                setLoading(false);
            }
        };
        getMessages();
    }, [selectedChat]);

    useEffect(() => {
        if (!socket) return;
        const messageReceivedHandler = (newMessage) => {
            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat._id === newMessage.chat._id ? { ...chat, latestMessage: newMessage } : chat
                )
            );
            if (selectedChatRef.current && selectedChatRef.current._id === newMessage.chat._id) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            } else {
                if (newMessage.sender._id !== user._id) {
                    toast.info(`New message in ${newMessage.chat.isGroupChat ? newMessage.chat.chatName : newMessage.sender.name}`);
                }
            }
        };
        socket.on("message received", messageReceivedHandler);
        return () => socket.off("message received", messageReceivedHandler);
    }, [socket, setChats, user._id]);

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
                chats.map((chat) =>
                    chat._id === selectedChat._id ? { ...chat, latestMessage: data } : chat
                )
            );
            setMessageInput('');
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

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
            <div className={`chat-layout ${selectedChat ? 'view-chat' : ''}`}>
                <ChatList />
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