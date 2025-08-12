import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/chats" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/chats" />} />
        <Route path="/chats" element={user ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;