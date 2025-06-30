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

// Food-themed elements for background animation
const foodIcons = [
  // Fruits
  'M36.8,45.8c1.6,1.2,2.9,0.9,4-0.7c0.5-0.7,0.9-1.5,1.3-2.3c1.8-4.2,2.2-8.5,0.5-12.9c-0.3-0.7-0.5-1.3-0.7-2c-0.3-0.9-0.1-1.5,0.7-2.2c0.7-0.8,1.6-1.1,2.5-0.4c1.6,0.9,3.2,1.9,5,2.6c3.3,1.4,6.7,1.4,10.1,0.5c2.4-0.6,3.1-0.3,4.3,1.7c0.6,1,0.8,2.1,0.9,3.3c0.1,2.1-0.1,4.1-0.7,6.1c-0.6,1.9-1.5,3.6-3.1,4.9c-0.8,0.7-1.7,0.8-2.7,0.3c-1.3-0.6-2.2-1.6-2.9-2.9c-0.8-1.5-0.7-2.4,0.5-3.5c0.6-0.5,1.3-0.9,2-1.2c1-0.5,1.3-1.5,0.9-2.5c-0.4-1-0.9-1.9-1.5-2.8c-0.8-1.1-1.9-1.4-3.2-0.9c-0.6,0.2-1.2,0.5-1.8,0.8c-3,1.6-5.4,3.8-7.2,6.8c-2.8,4.7-2.5,9.3,1.2,13.4c0.6,0.6,1.1,1.2,1.5,1.9c0.4,0.8,0.6,1.6,0.3,2.5c-0.4,1.3-1.4,1.7-2.6,1.8c-3.3,0.2-6.6,0.2-9.8-0.7c-1.7-0.5-3.4-1.1-4.9-2.1c-0.8-0.5-1.4-1.1-1.9-1.9c-0.9-1.3-0.5-2.6,1-3c1-0.3,2.1-0.5,3.1-0.5c1.3,0,2.2-0.5,2.5-1.9c0.2-0.9,0.3-1.8,0.3-2.7c-0.1-1.2-0.5-2.2-1.5-2.7c-1.1-0.6-2-0.4-2.8,0.5c-1.4,1.5-2.7,3.1-3.7,4.9c-1.4,2.7-2.5,5.5-3.2,8.4c-0.3,1.1-0.3,2.2,0.5,3.1c0.7,0.8,1.7,1.2,2.7,0.8c1.1-0.3,2.1-0.9,3-1.6c1.1-0.9,2.1-1.9,3.3-2.8c1.6-1.2,2.9-0.9,4,0.7c0.5,0.7,0.9,1.5,1.3,2.3c1.8,4.2,2.2,8.5,0.5,12.9c-0.3,0.7-0.5,1.3-0.7,2c-0.3,0.9-0.1,1.5,0.7,2.2c0.7,0.8,1.6,1.1,2.5,0.4c1.6-0.9,3.2-1.9,5-2.6c3.3-1.4,6.7-1.4,10.1-0.5c2.4,0.6,3.1,0.3,4.3,1.7c0.6,1,0.8,2.1,0.9,3.3c0.1,2.1-0.1,4.1-0.7,6.1c-0.6,1.9-1.5,3.6-3.1,4.9c-0.8,0.7-1.7,0.8-2.7,0.3c-1.3-0.6-2.2-1.6-2.9-2.9c-0.8-1.5-0.7-2.4,0.5-3.5c0.6-0.5,1.3-0.9,2-1.2c1-0.5,1.3-1.5,0.9-2.5c-0.4-1-0.9-1.9-1.5-2.8c-0.8-1.1-1.9-1.4-3.2-0.9c-0.6,0.2-1.2,0.5-1.8,0.8c-3,1.6-5.4,3.8-7.2,6.8c-2.8,4.7-2.5,9.3,1.2,13.4c0.6,0.6,1.1,1.2,1.5,1.9c0.4,0.8,0.6,1.6,0.3,2.5c-0.4,1.3-1.4,1.7-2.6,1.8c-3.3,0.2-6.6,0.2-9.8-0.7c-1.7-0.5-3.4-1.1-4.9-2.1c-0.8-0.5-1.4-1.1-1.9-1.9c-0.9-1.3-0.5-2.6,1-3c1-0.3,2.1-0.5,3.1-0.5c1.3,0,2.2-0.5,2.5-1.9c0.2-0.9,0.3-1.8,0.3-2.7c-0.1-1.2-0.5-2.2-1.5-2.7c-1.1-0.6-2-0.4-2.8,0.5c-1.4,1.5-2.7,3.1-3.7,4.9c-1.4,2.7-2.5,5.5-3.2,8.4c-0.3,1.1-0.3,2.2,0.5,3.1c0.7,0.8,1.7,1.2,2.7,0.8c1.1-0.3,2.1-0.9,3-1.6C34.6,47.7,35.6,46.7,36.8,45.8z', // Apple shape
  'M32,9.5c-5.2,0-9.7,2.3-12.7,6c-0.5,0.6-1,1.3-1.4,2c-1.7,0.3-3.5,0.5-5.3,0.8c-1.5,0.3-2.4,0.8-2.9,2.4c-0.9,2.6-0.8,5.2,0.4,7.7c1.3,2.9,3.1,5.4,5.2,7.7c2.5,2.7,5.1,5.3,7.6,7.9c0.7,0.7,1.4,1,2.4,0.7c1.4-0.4,2.9-0.8,4.3-1.2c1-0.3,1.6-0.2,2.3,0.6c2.4,2.5,5.2,4.4,8.4,5.5c2.6,0.9,5.3,1.1,8,0.2c2.3-0.8,4.2-2.2,5.6-4.2c2.2-3.2,2.7-6.8,2-10.6c-0.7-3.7-2.3-7-4.5-10c-1.7-2.3-3.6-4.5-5.7-6.4c-1.2-1.1-2.5-2.1-3.8-3c-0.9-0.6-1.9-1.2-2.9-1.6C37.2,10.1,34.6,9.5,32,9.5z', // Pear shape
  'M34,9c-6,0-13,0.8-19.4,4.2c-4.5,2.4-8.5,6-10.8,11.5c-1.8,4.3-2.1,8.7-1.4,13.1c0.7,4.1,2.8,7.4,5.8,10.3c3.5,3.2,7.5,5.4,12.1,6.7c2.8,0.8,5.7,1.1,8.7,1.1c3,0,5.8-1,8.6-2c5.7-2.1,10.3-5.5,13.4-10.8c2.5-4.3,3.4-8.9,2.8-13.9c-0.7-5.1-2.7-9.5-6.2-13.3C43.2,11,38.2,9,34,9z', // Orange shape
  
  // Vegetables
  'M13.7,32.8c-0.2-3.5,0.5-6.7,2.1-9.6c3.2-5.7,8.4-8.8,14.9-9c6.1-0.2,11,2.3,14.8,7c3.5,4.3,4.7,9.3,3.8,14.8c-0.8,5.4-3.8,9.3-8.4,12c-4.1,2.4-8.5,2.8-13.1,1.5c-4.8-1.4-8.2-4.5-10.3-9C16.1,37.6,15,34.4,13.7,32.8z', // Tomato shape
  'M20.7,11.9C8.3,15,0,26.3,0,40c0,19.9,16.1,36,36,36c19.9,0,36-16.1,36-36c0-13.7-8.3-25-20.7-28.1C42.7,14.8,34,25.2,34,38c0,4.7,3.8,8.5,8.5,8.5s8.5-3.8,8.5-8.5c0-4.7-3.8-8.5-8.5-8.5c-0.4,0-0.8,0-1.2,0.1c3.6-9.1,11.6-16.2,15.1-16.3c9.3,2.7,16.1,11.2,16.1,21.3c0,12.3-10,22.3-22.3,22.3c-12.3,0-22.3-10-22.3-22.3c0-10.1,6.8-18.6,16.1-21.3c3.5,0.1,11.5,7.1,15.1,16.3c-0.4-0.1-0.8-0.1-1.2-0.1c-4.7,0-8.5,3.8-8.5,8.5c0,4.7,3.8,8.5,8.5,8.5s8.5-3.8,8.5-8.5c0-12.8-8.7-23.2-17.3-26.1z', // Onion shape
  'M32,11.8C14.3,11.8,0,28.3,0,48.5C0,68.7,14.3,85.2,32,85.2c17.7,0,32-16.5,32-36.7C64,28.3,49.7,11.8,32,11.8z M28.3,38.8c-1.4,0-2.6-1.2-2.6-2.6c0-1.4,1.2-2.6,2.6-2.6c1.4,0,2.6,1.2,2.6,2.6C30.9,37.6,29.7,38.8,28.3,38.8z M32,61.8c-1.4,0-2.6-1.2-2.6-2.6c0-1.4,1.2-2.6,2.6-2.6c1.4,0,2.6,1.2,2.6,2.6C34.6,60.6,33.4,61.8,32,61.8z M41.7,52.7c-1.4,0-2.6-1.2-2.6-2.6c0-1.4,1.2-2.6,2.6-2.6c1.4,0,2.6,1.2,2.6,2.6C44.3,51.5,43.1,52.7,41.7,52.7z', // Broccoli shape
  
  // Bread and grains
  'M4,34h70c0,0,0-12-12-12c-4.5,0-7.1,1.3-9,3c-2.1-5-7-9-14-9c-7.7,0-14.2,5.2-16,11c-1.5-1-4.2-2-8-2C4,25,4,34,4,34z', // Bread shape
  'M50,12c-16.5,0-30,13.5-30,30c0,16.5,13.5,30,30,30c16.5,0,30-13.5,30-30C80,25.5,66.5,12,50,12z M50,62c-11,0-20-9-20-20c0-11,9-20,20-20c11,0,20,9,20,20C70,53,61,62,50,62z', // Donut shape
  'M10,20 L55,20 L55,60 L10,60 z', // Bread loaf simple
  
  // Desserts
  'M32,14c-9.9,0-18,8.1-18,18c0,7.9,5.1,14.6,12,17.1V66c0,3.3,2.7,6,6,6c3.3,0,6-2.7,6-6V49.1c6.9-2.5,12-9.2,12-17.1C50,22.1,41.9,14,32,14z M38,48.7V66c0,3.3-2.7,6-6,6c-3.3,0-6-2.7-6-6V48.7C19.7,45.6,16,39.2,16,32c0-8.8,7.2-16,16-16c8.8,0,16,7.2,16,16C48,39.2,44.3,45.6,38,48.7z', // Ice cream cone
  'M10,25 L54,25 C54,25 59,23 59,18 C59,13 54,11 54,11 L10,11 C10,11 5,13 5,18 C5,23 10,25 10,25 z', // Cake layer
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
  const [animateEntry, setAnimateEntry] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState(null);
  const [formShake, setFormShake] = useState(false);
  
  // Refs for canvas
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const animationFrameRef = useRef(null);
  const foodParticlesRef = useRef([]);
  const mouseTrailRef = useRef([]);
  
  // Create animated canvas background with food elements
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const context = canvas.getContext('2d');
    contextRef.current = context;
    
    // Create initial food particles
    const createFoodParticles = () => {
      const newParticles = [];
      const lightPalette = [
        '#10b981', // Green (veggies)
        '#f59e0b', // Yellow (bread)
        '#e11d48', // Red (fruits)
        '#fb923c', // Orange (citrus)
        '#a855f7', // Purple (berries)
        '#fcd34d', // Light yellow (grain)
        '#60a5fa'  // Blue (water)
      ];
      
      const darkPalette = [
        '#059669', // Dark green
        '#d97706', // Dark yellow
        '#be123c', // Dark red
        '#ea580c', // Dark orange
        '#7e22ce', // Dark purple
        '#eab308', // Dark gold
        '#2563eb'  // Dark blue
      ];
      
      const colors = darkMode ? darkPalette : lightPalette;
      
      for (let i = 0; i < 60; i++) {
        const iconIndex = Math.floor(Math.random() * foodIcons.length);
        const foodIcon = foodIcons[iconIndex];
        const scale = Math.random() * 0.05 + 0.02; // Random size between 0.02 and 0.07
        
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          icon: foodIcon,
          scale: scale,
          baseScale: scale,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.random() * 0.3 - 0.15,
          speedY: Math.random() * 0.3 - 0.15,
          opacity: Math.random() * 0.5 + 0.2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          pulseSpeed: Math.random() * 0.02,
          pulseAmount: 0.2 + Math.random() * 0.3,
          pulse: Math.random() * Math.PI * 2
        });
      }
      foodParticlesRef.current = newParticles;
    };

    createFoodParticles();
    
    // Initialize mouse trail
    for (let i = 0; i < 10; i++) {
      mouseTrailRef.current.push({
        x: 0,
        y: 0,
        size: 15 - i,
        alpha: 1 - (i / 10)
      });
    }
    
    // Draw SVG path
    const drawSVGPath = (ctx, path, x, y, scale, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);
      
      // Create a path from the SVG path string
      const svgPath = new Path2D(path);
      ctx.fill(svgPath);
      
      ctx.restore();
    };
    
    // Animation loop for canvas
    const animate = () => {
      const ctx = contextRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw food particles
      foodParticlesRef.current.forEach(p => {
        p.pulse = (p.pulse + p.pulseSpeed) % (2 * Math.PI);
        const pulseEffect = Math.sin(p.pulse) * p.pulseAmount;
        const currentScale = p.baseScale * (1 + pulseEffect * 0.2);
        
        // Calculate distance from mouse for interactive effect
        const dx = mousePosition.x - p.x;
        const dy = mousePosition.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;
        
        let particleOpacity = p.opacity;
        let particleScale = currentScale;
        p.rotation += p.rotationSpeed;
        
        // Apply interactive effects based on mouse proximity
        if (distance < maxDistance) {
          const effect = 1 - (distance / maxDistance);
          
          // Food particles grow and become more opaque near mouse
          particleScale += effect * 0.04;
          particleOpacity += effect * 0.4;
          
          // Food particles are gently pushed away from cursor
          const angle = Math.atan2(dy, dx);
          const pushFactor = 1 * effect;
          p.x -= Math.cos(angle) * pushFactor;
          p.y -= Math.sin(angle) * pushFactor;
          
          // Add slight rotation effect
          p.rotation += effect * 0.05;
        }
        
        // Update particle position
        p.x = (p.x + p.speedX + canvas.width) % canvas.width;
        p.y = (p.y + p.speedY + canvas.height) % canvas.height;
        
        // Draw the food icon
        ctx.globalAlpha = particleOpacity;
        ctx.fillStyle = p.color;
        drawSVGPath(ctx, p.icon, p.x, p.y, particleScale, p.rotation);
        ctx.globalAlpha = 1;
        
        // Connect food particles that are close to each other with delicate lines
        foodParticlesRef.current.forEach(p2 => {
          if (p.id !== p2.id) {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
              ctx.beginPath();
              ctx.strokeStyle = p.color + Math.floor((p.opacity * 0.3) * 255).toString(16).padStart(2, '0');
              ctx.lineWidth = 0.5;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
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
      : `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(253, 242, 248, 0.8) 0%, rgba(252, 231, 243, 0.9) 50%, rgba(249, 168, 212, 0.1) 100%)`
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