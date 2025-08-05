import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// We need to create this api.js file next if it doesn't exist
// For now, we can comment out the lines that use it to avoid errors
// import { registerUser } from '../services/api'; 
import { toast } from 'react-toastify';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.info("Registration feature coming soon!");
        // try {
        //     const { data } = await registerUser({ name, email, password });
        //     login(data);
        //     toast.success('Registered successfully!');
        //     navigate('/chats');
        // } catch (error) {
        //     toast.error(error.response?.data?.message || 'Failed to register');
        // }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Register for TalkSphere</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700">Password</label>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Register</button>
                <p className="text-center mt-4">
                    Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;