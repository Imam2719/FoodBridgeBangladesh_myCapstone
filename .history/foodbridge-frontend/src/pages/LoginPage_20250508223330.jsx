import React, { useState, useEffect, useRef } from 'react';
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
  const [animateEntry, setAnimateEntry] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const [formShake, setFormShake] = useState(false);
  
  // Refs for canvas
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseTrailRef = useRef([]);
  
  // Create animated canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const context = canvas.getContext('2d');
    contextRef.current = context;
    
    // Create initial particles
    const createParticles = () => {
      const newParticles = [];
      const colors = darkMode ? 
        ['#1e293b', '#334155', '#475569', '#64748b', '#0f172a'] : 
        ['#e2e8f0', '#cbd5e1', '#94a3b8', '#f1f5f9', '#ffffff'];
      
      for (let i = 0; i < 80; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 6 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.2,
          pulseSpeed: Math.random() * 0.02,
          pulseSize: Math.random() * 0.5,
          initialSize: Math.random() * 6 + 1,
          pulse: 0
        });
      }
      particlesRef.current = newParticles;
    };

    createParticles();
    
    // Initialize mouse trail
    for (let i = 0; i < 10; i++) {
      mouseTrailRef.current.push({
        x: 0,
        y: 0,
        size: 15 - i,
        alpha: 1 - (i / 10)
      });
    }
    
    // Animation loop for canvas
    const animate = () => {
      const ctx = contextRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particlesRef.current.forEach(p => {
        p.pulse = (p.pulse + p.pulseSpeed) % (2 * Math.PI);
        const pulseEffect = Math.sin(p.pulse) * p.pulseSize;
        const currentSize = p.initialSize + pulseEffect;
        
        // Calculate distance from mouse for interactive effect
        const dx = mousePosition.x - p.x;
        const dy = mousePosition.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;
        
        let particleOpacity = p.opacity;
        let particleSize = currentSize;
        
        // Apply interactive effects based on mouse proximity
        if (distance < maxDistance) {
          const effect = 1 - (distance / maxDistance);
          
          // Particles grow and become more opaque near mouse
          particleSize += effect * 3;
          particleOpacity += effect * 0.4;
          
          // Particles are gently pushed away from cursor
          const angle = Math.atan2(dy, dx);
          const pushFactor = 0.2 * effect;
          p.x -= Math.cos(angle) * pushFactor;
          p.y -= Math.sin(angle) * pushFactor;
        }
        
        // Update particle position
        p.x = (p.x + p.speedX + canvas.width) % canvas.width;
        p.y = (p.y + p.speedY + canvas.height) % canvas.height;
        
        // Draw the particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(particleOpacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Connect particles that are close to each other
        particlesRef.current.forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = p.color + Math.floor((p.opacity * 0.5) * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      
      // Draw mouse trail
      if (mouseTrailRef.current.length > 0) {
        for (let i = mouseTrailRef.current.length - 1; i > 0; i--) {
          mouseTrailRef.current[i].x = mouseTrailRef.current[i-1].x;
          mouseTrailRef.current[i].y = mouseTrailRef.current[i-1].y;
        }
        
        mouseTrailRef.current[0].x = mousePosition.x;
        mouseTrailRef.current[0].y = mousePosition.y;
        
        mouseTrailRef.current.forEach((point, index) => {
          if (point.x && point.y) {
            ctx.beginPath();
            const color = darkMode ? '255, 255, 255' : '225, 29, 72';
            ctx.fillStyle = `rgba(${color}, ${point.alpha * 0.3})`;
            ctx.arc(point.x, point.y, point.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Track mouse movement for interactive background
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animate entry of login form
    setTimeout(() => {
      setAnimateEntry(true);
    }, 100);
    
    // Window resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
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
        triggerFormShake();
      }
    } catch (retryErr) {
      console.error('Retry login error:', retryErr);
      setError('Authentication failed. Please contact support if this issue persists.');
      setIsLoading(false);
      triggerFormShake();
    }
  };

  const triggerFormShake = () => {
    setFormShake(true);
    setTimeout(() => setFormShake(false), 600);
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
        triggerFormShake();
        setIsLoading(false);
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
        triggerFormShake();
      }
    }
  };

  // Calculate background gradient based on mouse position
  const backgroundGradient = {
    background: darkMode 
      ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 50%, rgba(2, 6, 23, 0.95) 100%)`
      : `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(226, 232, 240, 0.8) 0%, rgba(203, 213, 225, 0.9) 50%, rgba(148, 163, 184, 0.95) 100%)`
  };

  return (
    <div className={`auth-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="auth-background" style={backgroundGradient}>
        <canvas 
          ref={canvasRef} 
          className="background-canvas"
        />
        <div className="auth-overlay"></div>
      </div>

      <div className={`login-container ${animateEntry ? 'animate-entry' : ''} ${formShake ? 'shake-animation' : ''}`}>
        <div className="login-brand">
          <div className="brand-logo-container">
            <Heart 
              size={32} 
              color="#e11d48" 
              fill="#e11d48" 
              className="pulse-icon"
            />
          </div>
          <h2>FoodShare</h2>
        </div>

        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Continue your mission to fight hunger and reduce food waste</p>
        </div>

        {error && (
          <div className="error-message fade-in">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email address
            </label>
            <div 
              className={`input-field-container focus-effect ${focusedField === 'email' ? 'field-focused' : ''}`}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            >
              <span className="input-icon"><Mail size={16} /></span>
              <input
                id="email"
                type="email"
                className="input-field with-icon"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {email && (
                <span className="input-field-status">
                  <span className="status-dot valid-dot"></span>
                </span>
              )}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <div 
              className={`input-field-container focus-effect ${focusedField === 'password' ? 'field-focused' : ''}`}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            >
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
            <Link to="/forgot-password" className="forgot-link hover-effect">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className={`login-button button-effect ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <span className="btn-text">Sign in</span>
                <ArrowRight size={18} className="button-icon" />
              </>
            )}
            <span className="btn-liquid"></span>
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>
        
        <div className="social-auth-buttons">
          <button className="social-btn google-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M2 12h10" />
              <path d="M12 2v10" />
            </svg>
            <span>Google</span>
          </button>
          <button className="social-btn apple-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 6v12" />
              <path d="M6 12h12" />
            </svg>
            <span>Apple</span>
          </button>
        </div>
        
        <div className="signup-link">
          Don't have an account?{' '}
          <Link to="/signup" className="signup-button hover-effect">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;