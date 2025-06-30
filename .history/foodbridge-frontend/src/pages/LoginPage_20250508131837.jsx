import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
  Lock,
  AlertCircle,
  Mail
} from 'lucide-react';
import '../style/auth.css';
import { useTheme } from '../contexts/ThemeContext';

// API base URL
const API_URL = 'http://localhost:8080/api';

const LoginPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const retryAuthWithoutLobData = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        skipLobData: true
      });
      
      const { success, message, data } = response.data;
  
      if (success && data && data.authenticated) {
        // Store user data in storage based on remember me choice
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authUser', JSON.stringify(data));
  
        // Get userType and status from data
        const { userType, status } = data;
        
        console.log("Login successful (retry). User type:", userType, "Status:", status);
  
        // For merchants, check if account is active
        if (userType === 'merchant' && status !== 'Active') {
          setError('Your merchant account is pending approval. Please check back later.');
          setIsLoading(false);
          return;
        }
  
        // Navigate to appropriate dashboard based on userType
        switch (userType.toLowerCase()) {
          case 'donor':
            navigate('/donor-dashboard');
            break;
          case 'receiver':
            navigate('/receiver-dashboard');
            break;
          case 'merchant':
            navigate('/merchant-dashboard');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          default:
            console.error(`Unknown user type: ${userType}`);
            setError(`Unknown user type: ${userType}`);
        }
      } else {
        setError(message || 'Login failed. Please check your credentials.');
      }
    } catch (retryErr) {
      console.error('Retry login error:', retryErr);
      setError('Authentication failed. Please contact support if this issue persists.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      // Call authentication API
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
  
      const { success, message, data } = response.data;
  
      if (success && data && data.authenticated) {
        // Store user data in storage based on remember me choice
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authUser', JSON.stringify(data));
  
        // Get userType and status from data
        const { userType, status } = data;
        
        console.log("Login successful. User type:", userType, "Status:", status);
  
        // For merchants, check if account is active
        if (userType === 'merchant' && status !== 'Active') {
          setError('Your merchant account is pending approval. Please check back later.');
          setIsLoading(false);
          return;
        }
  
        // Navigate to appropriate dashboard based on userType
        switch (userType.toLowerCase()) {
          case 'donor':
            navigate('/donor-dashboard');
            break;
          case 'receiver':
            navigate('/receiver-dashboard');
            break;
          case 'merchant':
            navigate('/merchant-dashboard');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          default:
            console.error(`Unknown user type: ${userType}`);
            setError(`Unknown user type: ${userType}`);
        }
      } else {
        setError(message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Check for LOB stream error
      if (err.response?.data?.message?.includes('lob stream') || 
          err.message?.includes('lob stream') ||
          err.toString().includes('lob stream')) {
        console.log("Detected LOB stream error, retrying authentication...");
        retryAuthWithoutLobData(email, password);
      } else {
        setError(err.response?.data?.message || 'Network error. Please try again later.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`auth-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Left panel with decorative elements */}
      <div className="auth-left-panel">
        <div className="left-panel-content">
          <div className="login-brand">
            <Heart size={40} color="#e11d48" fill="#e11d48" />
            <h2>FoodShare</h2>
          </div>
          <div className="left-panel-text">
            <h1>Fighting Hunger Together</h1>
            <p>Join our community in reducing food waste and helping those in need.</p>
          </div>
          <div className="decorative-circles">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
        </div>
      </div>

      {/* Right panel with login form */}
      <div className="auth-right-panel">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Continue your mission to fight hunger and reduce food waste</p>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email address
              </label>
              <div className="input-field-container">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className="input-field with-icon"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="input-field-container">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field with-icon"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="remember-forgot">
              <label className="checkbox-wrapper">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                </div>
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>
          
          <div className="social-login">
            <button className="social-button google">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
                <path d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z" fill="#FF3D00"/>
                <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z" fill="#4CAF50"/>
                <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
              </svg>
              <span>Google</span>
            </button>
            <button className="social-button facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073C24 5.40365 18.629 0 12 0C5.37097 0 0 5.40365 0 12.073C0 18.0988 4.38823 23.0935 10.125 24V15.563H7.07661V12.073H10.125V9.41306C10.125 6.38751 11.9153 4.71627 14.6574 4.71627C15.9706 4.71627 17.3439 4.95189 17.3439 4.95189V7.92146H15.8303C14.34 7.92146 13.875 8.85225 13.875 9.8069V12.073H17.2031L16.6708 15.563H13.875V24C19.6118 23.0935 24 18.0988 24 12.073Z" fill="#1877F2"/>
              </svg>
              <span>Facebook</span>
            </button>
          </div>
          
          <div className="signup-link">
            Don't have an account?{' '}
            <Link to="/signup" className="signup-button">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;