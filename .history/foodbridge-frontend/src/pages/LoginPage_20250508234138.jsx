import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
  Lock,
  AlertCircle,
  Apple,
  Beef,
  Bread,
  Carrot,
  Cherry,
  Croissant,
  Egg,
  Fish,
  Grape,
  IceCream,
  Milk,
  Pizza,
  Salad,
  Bread
} from 'lucide-react';
import '../style/auth.css';
import { useTheme } from '../contexts/ThemeContext';

// API base URL
const API_URL = 'http://localhost:8080/api';

// Food icons for dynamic background
const foodIcons = [
  { icon: Apple, color: "#4ade80" },
  { icon: Beef, color: "#b91c1c" },
  { icon: Bread, color: "#d97706" },
  { icon: Carrot, color: "#f97316" },
  { icon: Cherry, color: "#e11d48" },
  { icon: Croissant, color: "#d4a76a" },
  { icon: Egg, color: "#f9fafb" },
  { icon: Fish, color: "#60a5fa" },
  { icon: Grape, color: "#8b5cf6" },
  { icon: IceCream, color: "#fca5a5" },
  { icon: Milk, color: "#f9fafb" },
  { icon: Pizza, color: "#f97316" },
  { icon: Salad, color: "#84cc16" }
];

const LoginPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [foodElements, setFoodElements] = useState([]);

  // Generate food elements for background
  useEffect(() => {
    const generateFoodElements = () => {
      const elements = [];
      // Generate 40 food elements
      for (let i = 0; i < 40; i++) {
        const randomIcon = foodIcons[Math.floor(Math.random() * foodIcons.length)];
        const Icon = randomIcon.icon;
        const size = Math.floor(Math.random() * 30) + 10; // Size between 10-40px
        const posX = Math.random() * 100; // Position X (0-100%)
        const posY = Math.random() * 100; // Position Y (0-100%)
        const rotation = Math.random() * 360; // Random rotation
        const opacity = Math.random() * 0.15 + 0.05; // Opacity between 0.05-0.2
        const animationDuration = Math.random() * 60 + 60; // Duration between 60-120s
        const animationDelay = Math.random() * 30; // Delay between 0-30s
        
        elements.push({
          id: `food-${i}`,
          icon: Icon,
          color: randomIcon.color,
          style: {
            position: 'absolute',
            left: `${posX}%`,
            top: `${posY}%`,
            transform: `rotate(${rotation}deg)`,
            opacity: darkMode ? opacity * 1.5 : opacity, // Slightly higher opacity in dark mode
            animation: `float ${animationDuration}s ${animationDelay}s infinite linear`,
            zIndex: 0
          },
          size
        });
      }
      setFoodElements(elements);
    };
    
    generateFoodElements();
    
    // Regenerate some elements every 30 seconds
    const interval = setInterval(() => {
      setFoodElements(prev => {
        const newElements = [...prev];
        // Replace 10 random elements
        for (let i = 0; i < 10; i++) {
          const indexToReplace = Math.floor(Math.random() * newElements.length);
          const randomIcon = foodIcons[Math.floor(Math.random() * foodIcons.length)];
          const Icon = randomIcon.icon;
          const size = Math.floor(Math.random() * 30) + 10;
          const posX = Math.random() * 100;
          const posY = Math.random() * 100;
          const rotation = Math.random() * 360;
          const opacity = Math.random() * 0.15 + 0.05;
          const animationDuration = Math.random() * 60 + 60;
          const animationDelay = Math.random() * 30;
          
          newElements[indexToReplace] = {
            id: `food-${indexToReplace}-${Date.now()}`,
            icon: Icon,
            color: randomIcon.color,
            style: {
              position: 'absolute',
              left: `${posX}%`,
              top: `${posY}%`,
              transform: `rotate(${rotation}deg)`,
              opacity: darkMode ? opacity * 1.5 : opacity,
              animation: `float ${animationDuration}s ${animationDelay}s infinite linear`,
              zIndex: 0
            },
            size
          };
        }
        return newElements;
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, [darkMode]);

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
    <div className={`auth-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Food Background */}
      <div className="food-background">
        {foodElements.map(item => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} style={item.style}>
              <IconComponent size={item.size} color={item.color} />
            </div>
          );
        })}
      </div>
      
      {/* Header/Branding */}
      <div className="auth-brand">
        <div className="brand-container">
          <div className="food-logo">
            <img src="/logo.png" alt="FoodBridge" className="logo-image" />
          </div>
          <div className="brand-text">
            <div className="brand-name">FoodBridge</div>
            <div className="brand-location">Bangladesh</div>
          </div>
        </div>
        <div className="theme-controls">
          <button className="globe-button">
            <span className="globe-icon">🌐</span>
          </button>
          <button className="theme-toggle-button">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="auth-content">
        <div className="login-container">
          <div className="foodshare-logo">
            <Heart size={28} color="#e11d48" fill="#e11d48" />
            <h2 className="foodshare-text">FoodShare</h2>
          </div>
          
          <div className="welcome-text">
            <h1>Welcome <span className="accent-text">Back</span></h1>
            <p className="welcome-subtitle">Continue your mission to fight hunger and reduce food waste</p>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <span className="input-icon">@</span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><Lock size={16} /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`signin-button ${isLoading ? 'loading' : ''}`}
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

          <div className="signup-option">
            <span>Don't have an account?</span>
            <Link to="/signup" className="create-account-link">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;