import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext'; // Assuming you created this
import { fetchMessages, sendMessage } from '../services/api'; // Assuming these are in api.js
import { toast } from 'react-toastify';
import ScrollableChat from './ScrollableChat'; // We will create this next

const ChatBox = ({ selectedChat, setSelectedChat }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const { user } = useAuth();
    const socket = useSocket();

    // Function to get the name of the other user in a 1-on-1 chat
    const getSenderName = (loggedUser, users) => {
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    };

    const fetchAllMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);
            const { data } = await fetchMessages(selectedChat._id);
            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast.error('Failed to load messages');
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAllMessages();
    }, [selectedChat]);


    useEffect(() => {
        if (!socket) return;

        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
        socket.on('message received', (newMessageReceived) => {
            if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
                // Give a notification for a message in another chat
            } else {
                setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
            }
        });

        // Cleanup listeners on component unmount
        return () => {
            socket.off('typing');
            socket.off('stop typing');
            socket.off('message received');
        };
    }, [socket, selectedChat]);


    const handleSendMessage = async (e) => {
        if (e.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const { data } = await sendMessage({
                    content: newMessage,
                    chatId: selectedChat._id,
                });
                socket.emit('new message', data);
                setMessages([...messages, data]);
                setNewMessage('');
            } catch (error) {
                toast.error('Failed to send message');
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socket) return;

        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }

        // Debouncing to emit 'stop typing'
        let lastTypingTime = new Date().getTime();
        const timerLength = 3000;
        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    if (!selectedChat) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <div className="text-center text-gray-500">
                    <p className="text-xl">Select a user to start chatting</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-screen p-2">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold">
                    {selectedChat.isGroupChat 
                        ? selectedChat.chatName 
                        : getSenderName(user, selectedChat.users)
                    }
                </h2>
                {/* You can add group info/settings icon here */}
            </div>

            {/* Messages Area */}
            <div className="flex flex-col flex-grow p-4 overflow-y-auto bg-gray-50 rounded-md">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <p>Loading messages...</p>
                    </div>
                ) : (
                    <ScrollableChat messages={messages} />
                )}
                {isTyping ? <div className="text-sm text-gray-500">Typing...</div> : <></>}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newMessage}
                        onChange={typingHandler}
                        onKeyDown={handleSendMessage}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatBox;