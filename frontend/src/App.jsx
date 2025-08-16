import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import AdminPage from "./pages/AdminPage";
import SettingsPage from "./pages/SettingsPage"; // Import SettingsPage
import Layout from "./components/Layout"; // Import Layout
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import { SocketProvider } from "./context/SocketContext";

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/chats" />}
        />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/chats" />}
        />
        <Route
          path="/forgot-password"
          element={!user ? <ForgotPassword /> : <Navigate to="/chats" />}
        />

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
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/admin"
            element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/chats" />}
          />
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;