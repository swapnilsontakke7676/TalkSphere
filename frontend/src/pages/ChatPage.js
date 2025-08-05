import React, { useState } from 'react';
import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen antialiased text-gray-800">
            <div className="flex flex-row h-full w-full overflow-x-hidden">
                {user && <ChatList onSelectChat={setSelectedChat} />}
                {user && <ChatBox selectedChat={selectedChat} />}
            </div>
            {/* Optional: Add a logout button to the chat page */}
            <button onClick={logout} className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </div>
    );
};

export default ChatPage;