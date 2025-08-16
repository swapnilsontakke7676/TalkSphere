import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const ScrollableChat = ({ messages }) => {
    const { user } = useAuth();
    const scrollRef = useRef(null);

    // Effect to scroll to the bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // We use the parent div with the 'chat-messages' class for scrolling,
    // so we pass the ref up to it via the ChatBox component.
    // For simplicity here, we'll apply styles to ensure it's scrollable.
    return (
        <div ref={scrollRef} style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {messages && messages.map((m) => {
                const isSentByMe = m.sender._id === user._id;
                return (
                    <div className={`message ${isSentByMe ? 'sent' : 'received'}`} key={m._id}>
                        <div className="message-content">
                            {/* Display sender's name in group chats for received messages */}
                            {!isSentByMe && m.chat.isGroupChat && (
                                <p className="sender-name">{m.sender.name}</p>
                            )}
                            <p>{m.content}</p>
                            <span className="timestamp">
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ScrollableChat;