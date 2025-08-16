import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import { ThemeProvider } from './context/ThemeContext'; // Import the provider
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import { SocketProvider } from "./context/SocketContext"; // Import SocketProvider

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
          path="/chats"
          element={
            user ? (
              <SocketProvider> {/* Wrap ChatPage */}
                <ThemeProvider>
                  <ChatPage />
                </ThemeProvider>
              </SocketProvider>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
