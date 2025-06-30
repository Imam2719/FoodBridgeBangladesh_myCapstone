import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ReceiverDashboardPage from './pages/ReciverDashboardPage';
import DonorDashboardPage from './pages/DonerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MerchantDashboardPage from './pages/MerchantDashboardPage';

/**
 * Main App component that sets up routing and theme context
 * The ThemeProvider wraps the entire application to provide dark/light mode functionality
 */
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
          <Navbar />
          <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/receiver-dashboard" element={<ReceiverDashboardPage />} />
              <Route path="/donor-dashboard" element={<DonorDashboardPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
              <Route path="/merchant-dashboard" element={<MerchantDashboardPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;