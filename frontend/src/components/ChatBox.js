import React from 'react';

const ChatBox = () => {
    return (
        <div className="w-2/3">
            <h2 className="p-4 font-bold text-xl border-b">Chat Window</h2>
            {/* Chat messages will go here */}
            <p className="p-4 text-gray-500">Select a chat to start messaging.</p>
        </div>
    );
};

export default ChatBox;