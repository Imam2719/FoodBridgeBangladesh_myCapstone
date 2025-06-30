import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
  Lock,
  AlertCircle
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
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>

      <div className="login-container">
        <div className="login-brand">
          <Heart size={32} color="#e11d48" fill="#e11d48" />
          <h2>FoodShare</h2>
        </div>

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

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email address
            </label>
            <div className="input-field-container">
              <span className="input-icon">@</span>
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
              <span className="input-icon"><Lock size={16} /></span>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
            Google
          </button>
          <button className="social-button facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div className="signup-link">
          Don't have an account?{' '}
          <Link to="/signup" className="signup-button">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;