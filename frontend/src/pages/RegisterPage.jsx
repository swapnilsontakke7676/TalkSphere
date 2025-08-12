import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api'; // This will now work
import { toast } from 'react-toastify';
import "../styles/register.css"; // Assuming you have a CSS file for styles

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!name || !email || !password) {
            return toast.error("Please fill out all fields.");
        }

        try {
            // Call the API function to register the user
            const { data } = await registerUser({ name, email, password });

            // Use the login function from AuthContext to set the user state globally
            login(data);

            toast.success('Registered successfully!');

            // Navigate to the main chat page on success
            navigate('/chats');

        } catch (error) {
            // Display a specific error message from the backend if it exists
            toast.error(error.response?.data?.message || 'Failed to register. Please try again.');
        }
    };

    return (
        <>
            <div className="min-h-screen">
                <form className="register-form form" onSubmit={handleSubmit}>
                    <div className="logo-container">
                        <div className="logo-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <span className="logo-text">TalkSphere</span>
                    </div>
                    <h2 className="page-title">Register for TalkSphere</h2>

                    <div className="form-group">
                        <label className="form-label" for="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Your Name"
                            required
                            className="form-input"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            required
                            className="form-input"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="form-input"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>

                    <button type="submit" className="register-btn">Register</button>

                    <p className="login-link-container">
                        Already have an account?
                        <a href="/login" className="login-link">Login</a>
                    </p>
                </form>
            </div>

            <div id="toast" className="toast"></div>

        </>
    );
};

export default RegisterPage;