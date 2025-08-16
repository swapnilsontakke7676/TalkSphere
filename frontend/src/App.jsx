import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import Layout from "./components/Layout";
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import { SocketProvider } from "./context/SocketContext";

// Import new admin components
import AdminPage from "./pages/AdminPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ChatManagement from "./pages/admin/ChatManagement";
import Announcements from "./pages/admin/Announcements";

function App() {
  const { user } = useAuth();

  return (
    <div className="App" >
      <Routes>
        {/* Public Routes */}
        < Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/chats" />} />
        < Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/chats" />} />
        < Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/chats" />} />

        {/* Protected Routes */}
        <Route
          element={
            user ? (
              <SocketProvider>
                <ThemeProvider>
                  <Layout />
                </ThemeProvider>
              </SocketProvider>
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="/chats" element={< ChatPage />} />
          < Route path="/settings" element={< SettingsPage />} />

          {/* New Nested Admin Routes */}
          {
            user?.role === 'admin' && (
              <Route path="/admin" element={< AdminLayout />}>
                <Route index element={< Navigate to="dashboard" />} />
                < Route path="dashboard" element={< AdminDashboard />} />
                < Route path="users" element={< UserManagement />} />
                < Route path="chats" element={< ChatManagement />} />
                < Route path="announcements" element={< Announcements />} />
              </Route>
            )}
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={< Navigate to="/login" />} />
      </Routes>
      < ToastContainer />
    </div>
  );
}

export default App;