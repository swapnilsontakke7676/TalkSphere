import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { toast } from 'react-toastify';
import "../styles/login.css"; // Assuming you have a CSS file for styles

// A simple component for the logo to keep the main component clean
// const TalkSphereLogo = () => (
//     <div className="flex items-center justify-center mb-8">
//         <div className="p-2 bg-indigo-600 rounded-full">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//             </svg>
//         </div>
//         <span className="ml-3 text-2xl font-bold text-gray-800">TalkSphere</span>
//     </div>
// );

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await loginUser({ email, password });
            login(data);
            toast.success('Logged in successfully!');
            navigate('/chats');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div className="min-h-screen">
            <div className="login-container">

                <div className="logo-container">
                    <div className="logo-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <span className="logo-text">TalkSphere</span>
                </div>

                <h2 className="page-title">Login</h2>

                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label for="email" className="form-label">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            className="form-input"
                            placeholder="you@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    <div className="form-group">
                        <label for="password" className="form-label">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            className="form-input"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>

                    <div className="checkbox-container">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="checkbox"
                        />
                        <label for="remember-me" className="checkbox-label">
                            Remember me
                        </label>
                    </div>

                    <div>
                        <button type="submit" className="btn">
                            Login
                        </button>
                    </div>

                    <div>
                        <a href="/forgot-password" className="btn">
                            Forgot Password?
                        </a>
                    </div>

                    <div className="signup-link-container">
                        Don't have an account?
                        <a href="/register" className="signup-link">
                            Sign up
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;