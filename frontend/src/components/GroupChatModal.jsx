import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useChat } from "../context/ChatContext";
import { searchUsers, createGroupChat } from "../services/api";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
import "../styles/GroupChatModal.css";
import { toast } from "react-toastify";

const GroupChatModal = ({ isOpen, onClose }) => {
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { chats, setChats } = useChat();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [isOpen]);

    useEffect(() => {
        const onEsc = (e) => e.key === "Escape" && onClose();
        if (isOpen) window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [isOpen, onClose]);

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return setSearchResult([]);
        try {
            setLoading(true);
            const { data } = await searchUsers(query);
            setSearchResult(data);
        } catch {
            toast.error("Failed to load search results");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = (u) => {
        if (selectedUsers.some((x) => x._id === u._id)) {
            toast.warn("User already added");
            return;
        }
        setSelectedUsers((s) => [...s, u]);
    };

    const handleDelete = (u) =>
        setSelectedUsers((s) => s.filter((x) => x._id !== u._id));

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers.length)
            return toast.warn("Please fill all the fields");
        if (selectedUsers.length < 2)
            return toast.warn("More than 2 users are required");

        try {
            const { data } = await createGroupChat({
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            });
            setChats([data, ...chats]);
            onClose();
            toast.success("New group chat created!");
        } catch {
            toast.error("Failed to create group chat");
        }
    };

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Create Group Chat</h2>

                <div className="modal-body">
                    <input
                        type="text"
                        placeholder="Chat Name"
                        className="modal-input"
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Add Users e.g. John, Jane"
                        className="modal-input"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                    <div className="selected-users-container">
                        {selectedUsers.map((u) => (
                            <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                        ))}
                    </div>

                    <div className="search-results-container">
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            searchResult?.slice(0, 6).map((user) => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                            ))
                        )}
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="modal-button create-button" onClick={handleSubmit}>
                        Create Chat
                    </button>
                    <button className="modal-button close-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default GroupChatModal;