import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import LoginPage from './Components/Login';
import RegisterPage from './Components/Registeration';
import Home from './Components/Home';
import Profile from './Components/Profile';
import UserProfile from './Components/UserProfile';

import './App.css';

const App = () => {
  return (
    <>
    <ToastContainer />
    <BrowserRouter>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route
                path="/"
                element={<ProtectedRoute element={<Home />} />}
              />
              <Route
                path="/profile"
                element={<ProtectedRoute element={<Profile />} />}
              />
              <Route
                path="/user/:userId"
                element={<ProtectedRoute element={<UserProfile />} />}
              />
              <Route
                path="/profile"
                element={<ProtectedRoute element={<Home />} />}
              />
              <Route
                path="/login"
                element={<RedirectIfLoggedIn element={<LoginWrapper />} />}
              />
              <Route
                path="/register"
                element={<RedirectIfLoggedIn element={<RegisterWrapper />} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
    </>
  );
};

// Component to handle protected routes
const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" replace />;
};

// Component to redirect if logged in
const RedirectIfLoggedIn = ({ element }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/profile" replace /> : element;
};

// Wrapper for LoginPage to provide navigation props
const LoginWrapper = () => {
  const navigate = useNavigate();
  return <LoginPage onSwitchToRegister={() => navigate('/register')} />;
};

// Wrapper for RegisterPage to provide navigation props
const RegisterWrapper = () => {
  const navigate = useNavigate();
  return <RegisterPage onSwitchToLogin={() => navigate('/login')} />;
};

export default App;