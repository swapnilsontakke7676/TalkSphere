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
            <div class="min-h-screen">
                <form class="register-form" onSubmit={handleSubmit}>
                    <h2 class="page-title">Register for TalkSphere</h2>

                    <div class="form-group">
                        <label class="form-label" for="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Your Name"
                            required
                            class="form-input"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            required
                            class="form-input"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            required
                            class="form-input"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>

                    <button type="submit" class="register-btn">Register</button>

                    <p class="login-link-container">
                        Already have an account?
                        <a href="/login" class="login-link">Login</a>
                    </p>
                </form>
            </div>

            <div id="toast" class="toast"></div>

        </>
    );
};

export default RegisterPage;