import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const ScrollableChat = ({ messages }) => {
    const { user } = useAuth();
    const scrollRef = useRef();

    // This effect will run every time the messages array changes
    useEffect(() => {
        // If the ref is attached to an element, scroll to the bottom
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-2">
            {messages && messages.map((m, i) => (
                <div className={`flex ${m.sender._id === user._id ? 'justify-end' : 'justify-start'}`} key={m._id}>
                    <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 my-1 rounded-lg ${m.sender._id === user._id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                    >
                        {/* If it's a group chat and not your message, show sender name */}
                        {m.chat.isGroupChat && m.sender._id !== user._id && (
                            <p className="text-xs font-bold" style={{ color: m.sender._id === user._id ? 'white' : 'black' }}>{m.sender.name}</p>
                        )}
                        <p className="break-words">{m.content}</p>
                        <p className="text-xs text-right opacity-70 mt-1">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ScrollableChat;