import React from 'react';
import { useAuth } from '../context/AuthContext';

const ScrollableChat = ({ messages }) => {
    const { user } = useAuth();

    return (
        <>
            {messages && messages.map((m) => {
                const isSentByMe = m.sender._id === user._id;
                return (
                    <div className={`message ${isSentByMe ? 'sent' : 'received'}`} key={m._id}>
                        <div className="message-content">
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
        </>
    );
};

export default ScrollableChat;