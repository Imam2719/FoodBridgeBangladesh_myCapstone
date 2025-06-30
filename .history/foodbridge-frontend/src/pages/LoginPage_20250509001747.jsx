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
        <div className="signup-link">
          Don't have an account?{' '}
          <Link to="/signup" className="signup-button">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 