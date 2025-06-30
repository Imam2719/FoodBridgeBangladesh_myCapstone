import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2 as CheckCircle,
  RefreshCw
} from 'lucide-react';
import '../style/auth.css'; // Reusing the auth styling
import { useTheme } from '../contexts/ThemeContext';

// API base URL
const API_URL = 'http://localhost:8080/api';

const ResetPasswordPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  // State to track the current step of the password reset flow
  const [currentStep, setCurrentStep] = useState('email'); // 'email', 'otp', 'newPassword', 'success'
  
  // Form state
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [otpResent, setOtpResent] = useState(false);

  // Password strength calculation (reusing from SignupPage)
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;

    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 1;
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
  };

  // Get password strength label and color
  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return { text: 'Very Weak', color: 'red' };
    if (passwordStrength === 1) return { text: 'Weak', color: 'red' };
    if (passwordStrength === 2) return { text: 'Fair', color: 'orange' };
    if (passwordStrength === 3) return { text: 'Good', color: 'yellow' };
    if (passwordStrength === 4) return { text: 'Strong', color: 'green' };
    if (passwordStrength === 5) return { text: 'Very Strong', color: 'green' };
  };

  // Render password strength bar
  const renderProgressBar = () => {
    const strengthInfo = getPasswordStrengthLabel();

    return (
      <div className="password-strength">
        <div className="strength-text" style={{ color: strengthInfo.color }}>
          {strengthInfo.text}
        </div>
        <div className="strength-bar">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`strength-segment ${passwordStrength >= level ? 'active' : ''}`}
              style={{ backgroundColor: passwordStrength >= level ? strengthInfo.color : 'gray' }}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  // Timer for OTP expiry
  React.useEffect(() => {
    let timer;
    if (otpExpiry && timeLeft > 0) {
      timer = setInterval(() => {
        const secondsLeft = Math.floor((otpExpiry - Date.now()) / 1000);
        setTimeLeft(secondsLeft > 0 ? secondsLeft : 0);
        
        if (secondsLeft <= 0) {
          clearInterval(timer);
          setError('OTP has expired. Please request a new one.');
        }
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpExpiry, timeLeft]);

  // Format time left
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle email submission - Step 1
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/request-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('OTP has been sent to your email. Please check your inbox.');
        setCurrentStep('otp');
        
        // Set OTP expiry time (5 minutes from now)
        const expiryTime = Date.now() + 5 * 60 * 1000;
        setOtpExpiry(expiryTime);
        setTimeLeft(5 * 60); // 5 minutes in seconds
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error requesting password reset:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification - Step 2
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('OTP verified successfully. Please set your new password.');
        setCurrentStep('newPassword');
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset - Step 3
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password
    if (passwordStrength < 3) {
      setError('Please create a stronger password');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Password changed successfully! You will be redirected to login page.');
        setCurrentStep('success');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);
    setOtpResent(false);

    try {
      const response = await fetch(`${API_URL}/auth/request-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('A new OTP has been sent to your email.');
        
        // Reset OTP expiry time
        const expiryTime = Date.now() + 5 * 60 * 1000;
        setOtpExpiry(expiryTime);
        setTimeLeft(5 * 60);
        setOtpResent(true);
        
        // Clear resent message after 3 seconds
        setTimeout(() => {
          setOtpResent(false);
        }, 3000);
      } else {
        setError(data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
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
          <h1 className="login-title">Reset Password</h1>
          <p className="login-subtitle">
            {currentStep === 'email' && 'Enter your email to receive a verification code'}
            {currentStep === 'otp' && 'Enter the 6-digit code sent to your email'}
            {currentStep === 'newPassword' && 'Create a new secure password'}
            {currentStep === 'success' && 'Your password has been reset successfully'}
          </p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Step 1: Email Input */}
        {currentStep === 'email' && (
          <form onSubmit={handleEmailSubmit}>
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email address
              </label>
              <div className="input-field-container">
                <span className="input-icon"><Mail size={16} /></span>
                <input
                  id="email"
                  type="email"
                  className="input-field with-icon"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
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
                  Send Verification Code
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {currentStep === 'otp' && (
          <form onSubmit={handleOtpSubmit}>
            <div className="input-group">
              <label htmlFor="otp" className="input-label">
                Verification Code
              </label>
              <div className="input-field-container">
                <span className="input-icon"><Lock size={16} /></span>
                <input
                  id="otp"
                  type="text"
                  className="input-field with-icon"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                />
              </div>

              {otpExpiry && (
                <div className="otp-timer">
                  <span>Code expires in: </span>
                  <span className={timeLeft < 60 ? 'expiring' : ''}>{formatTimeLeft()}</span>
                </div>
              )}

              <div className="resend-otp">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading || timeLeft > 4 * 60} // Disable resend for first minute
                  className="resend-button"
                >
                  {otpResent ? 'Code resent!' : 'Resend code'}
                </button>
              </div>
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
                  Verify Code
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {currentStep === 'newPassword' && (
          <form onSubmit={handlePasswordReset}>
            <div className="input-group">
              <label htmlFor="newPassword" className="input-label">
                New Password
              </label>
              <div className="input-field-container">
                <span className="input-icon"><Lock size={16} /></span>
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field with-icon"
                  placeholder="Create a strong password"
                  value={newPassword}
                  onChange={handlePasswordChange}
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
              
              {newPassword && renderProgressBar()}
              
              <div className="password-requirements">
                <div className={`requirement ${newPassword.length >= 8 ? 'met' : ''}`}>
                  <span className="req-icon">✓</span>
                  <span>8+ characters</span>
                </div>
                <div className={`requirement ${/[A-Z]/.test(newPassword) ? 'met' : ''}`}>
                  <span className="req-icon">✓</span>
                  <span>Uppercase</span>
                </div>
                <div className={`requirement ${/[0-9]/.test(newPassword) ? 'met' : ''}`}>
                  <span className="req-icon">✓</span>
                  <span>Number</span>
                </div>
                <div className={`requirement ${/[^A-Za-z0-9]/.test(newPassword) ? 'met' : ''}`}>
                  <span className="req-icon">✓</span>
                  <span>Special character</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">
                Confirm Password
              </label>
              <div className="input-field-container">
                <span className="input-icon"><Lock size={16} /></span>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field with-icon"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              {confirmPassword && newPassword !== confirmPassword && (
                <div className="password-mismatch">
                  <AlertCircle size={14} />
                  <span>Passwords do not match</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || newPassword !== confirmPassword}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  Reset Password
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 4: Success */}
        {currentStep === 'success' && (
          <div className="success-container">
            <div className="success-icon">
              <CheckCircle size={60} />
            </div>
            <p className="success-text">Your password has been changed successfully!</p>
            <p className="redirect-text">Redirecting to login page...</p>
          </div>
        )}

        <div className="back-to-login">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;