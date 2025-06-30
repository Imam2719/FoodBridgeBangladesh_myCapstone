import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Mail,
  Heart,
  CheckCircle,
  Shield,
  ChevronRight,
  Lock,
  AlertCircle,
  Calendar,
  Phone,
  MapPin,
  Info,
  Camera,
  Image,
  Droplet,
  CreditCard,
  FileText,
  Check,
  X,
  Verified
} from 'lucide-react';

import '../style/Signup.css';

// API URL constant
const API_BASE_URL = 'http://localhost:8080/api';

const SignupPage = () => {
  const navigate = useNavigate();
  
  // Form UI state
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Camera/Photo state
  const [cameraStream, setCameraStream] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  
  // Identification state
  const [selectedIdentificationType, setSelectedIdentificationType] = useState('nid');
  
  // Field validation state
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    phone: '',
    nationalId: ''
  });

  // Refs for camera and canvas
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    birthdate: '',
    bloodGroup: '',
    // Identification documents
    nationalId: '',
    passportNumber: '',
    birthCertificateNumber: '',
    // Address information
    address: '',
    addressDescription: '',
    // Photo
    userPhoto: null,
    userType: 'donor',
    bio: ''
  });

  // ==========================================
  // CAMERA FUNCTIONALITY
  // ==========================================
  
  /**
   * Initialize camera when needed
   */
  const initializeCamera = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 480 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied. Please grant camera permission to continue.');
    }
  };

  /**
   * Stop camera stream
   */
  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  /**
   * Take a photo using the webcam
   */
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(blob => {
        // Create a URL for the blob
        const photoURL = URL.createObjectURL(blob);

        // Update form data with photo
        setFormData(prev => ({
          ...prev,
          userPhoto: {
            blob,
            url: photoURL
          }
        }));

        setPhotoTaken(true);
        // Stop camera stream after photo is taken
        stopCameraStream();
      }, 'image/jpeg', 0.8);
    }
  };

  /**
   * Retake a photo
   */
  const retakePhoto = () => {
    if (formData.userPhoto) {
      URL.revokeObjectURL(formData.userPhoto.url);
      setFormData(prev => ({ ...prev, userPhoto: null }));
    }
    setPhotoTaken(false);
    // Explicitly reinitialize camera
    initializeCamera(); // Restart the camera
  };

  // ==========================================
  // FORM VALIDATION
  // ==========================================
  
  /**
   * Validate identification documents
   */
  const validateIdentification = () => {
    const { nationalId, passportNumber, birthCertificateNumber } = formData;

    if (!nationalId && !passportNumber && !birthCertificateNumber) {
      setError('Please provide at least one form of identification (National ID, Passport, or Birth Certificate)');
      return false;
    }

    return true;
  };

  /**
   * Check if email is already registered
   */
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.exists) {
        setFieldErrors(prev => ({ ...prev, email: 'Email already registered' }));
        return true;
      } else {
        setFieldErrors(prev => ({ ...prev, email: '' }));
        return false;
      }
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  /**
   * Check if phone number is already registered
   */
  const checkPhoneExists = async (phone) => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-phone?phone=${encodeURIComponent(phone)}`);
      const data = await response.json();
      
      if (data.exists) {
        setFieldErrors(prev => ({ ...prev, phone: 'Phone number already registered' }));
        return true;
      } else {
        setFieldErrors(prev => ({ ...prev, phone: '' }));
        return false;
      }
    } catch (error) {
      console.error('Error checking phone:', error);
      return false;
    }
  };

  /**
   * Check if national ID is already registered
   */
  const checkNationalIdExists = async (nationalId) => {
    if (!nationalId) return false;
    
    try {
      const response = await fetch(`${API_BASE_URL}/check-national-id?nationalId=${encodeURIComponent(nationalId)}`);
      const data = await response.json();
      
      if (data.exists) {
        setFieldErrors(prev => ({ ...prev, nationalId: 'National ID already registered' }));
        return true;
      } else {
        setFieldErrors(prev => ({ ...prev, nationalId: '' }));
        return false;
      }
    } catch (error) {
      console.error('Error checking national ID:', error);
      return false;
    }
  };

  // ==========================================
  // FORM NAVIGATION
  // ==========================================
  
  /**
   * Handle next step with validation
   */
  const handleNextStep = async () => {
    let isValid = true;
    setError('');

    if (step === 1) {
      // Basic validation for step 1
      const { firstName, lastName, email, password } = formData;
      if (!firstName || !lastName || !email || !password) {
        setError('Please fill in all required fields');
        isValid = false;
      } else if (passwordStrength < 3) {
        setError('Please create a stronger password');
        isValid = false;
      }
      
      // Check if email already exists
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        isValid = false;
        setError('Email already registered');
      }
    } else if (step === 2) {
      // Validation for step 2
      const { phone, birthdate, bloodGroup, nationalId } = formData;
      if (!phone || !birthdate || !bloodGroup) {
        setError('Please fill in all required fields');
        isValid = false;
      } else if (!validateIdentification()) {
        isValid = false;
      }
      
      // Check if phone already exists
      const phoneExists = await checkPhoneExists(phone);
      if (phoneExists) {
        isValid = false;
        setError('Phone number already registered');
      }
      
      // Check if national ID already exists (if provided)
      if (nationalId) {
        const nationalIdExists = await checkNationalIdExists(nationalId);
        if (nationalIdExists) {
          isValid = false;
          setError('National ID already registered');
        }
      }
    } else if (step === 3) {
      // Validation for step 3
      const { address, addressDescription, userPhoto } = formData;
      if (!address || !addressDescription) {
        setError('Please provide your complete address information');
        isValid = false;
      } else if (!userPhoto) {
        setError('Please take a photo using your camera');
        isValid = false;
      }
    }

    if (isValid) {
      setStep(step + 1);
    }
  };

  /**
   * Go back to previous step
   */
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // ==========================================
  // FORM SUBMISSION
  // ==========================================
  // Update this part in your React SignupPage component
const handleSubmit = async (e) => {
  e.preventDefault();

  if (step < 4) {
    handleNextStep();
    return;
  }

  if (!isTermsAccepted) {
    setError('Please accept the terms and conditions to continue');
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    // Create FormData object for multipart form data
    const formDataToSend = new FormData();
    
    // Add all text fields to formData
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('birthdate', formData.birthdate);
    formDataToSend.append('bloodGroup', formData.bloodGroup);
    
    // Add identification fields if provided
    if (formData.nationalId) formDataToSend.append('nationalId', formData.nationalId);
    if (formData.passportNumber) formDataToSend.append('passportNumber', formData.passportNumber);
    if (formData.birthCertificateNumber) formDataToSend.append('birthCertificateNumber', formData.birthCertificateNumber);
    
    // Add address information
    formDataToSend.append('address', formData.address);
    formDataToSend.append('addressDescription', formData.addressDescription);
    
    // Add user type and bio
    formDataToSend.append('userType', formData.userType);
    if (formData.bio) formDataToSend.append('bio', formData.bio);
    
    // Add user photo - convert the blob to a file
    if (formData.userPhoto && formData.userPhoto.blob) {
      const photoFile = new File([formData.userPhoto.blob], 'profile-photo.jpg', { type: 'image/jpeg' });
      formDataToSend.append('userPhoto', photoFile);
    }
    
    console.log('Sending registration data to server...');
    
    // Send request to backend API
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      body: formDataToSend,
    });
    
    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        // Try to parse error message from JSON response
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // If JSON parsing fails, use response status text
        console.error('Error parsing error response:', parseError);
        errorMessage = `Registration failed: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    // If response is ok, safely parse the JSON
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing success response:', jsonError);
      throw new Error('Server response format error');
    }
    
    console.log('Registration successful:', data);
    
    // Navigate to login page regardless of the response
    navigate('/login');
    
  } catch (error) {
    console.error('Registration error:', error);
    setError(error.message || 'An error occurred during registration. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
  // ==========================================
  // FORM INPUT HANDLING
  // ==========================================
  
  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Password strength calculation
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
    
    // Real-time validation for specific fields
    if (name === 'email' && value) {
      checkEmailExists(value);
    }
    
    if (name === 'phone' && value) {
      checkPhoneExists(value);
    }
    
    if (name === 'nationalId' && value) {
      checkNationalIdExists(value);
    }
  };

  /**
   * Calculate password strength
   */
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

  /**
   * Get password strength label and color
   */
  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return { text: 'Very Weak', color: 'red' };
    if (passwordStrength === 1) return { text: 'Weak', color: 'red' };
    if (passwordStrength === 2) return { text: 'Fair', color: 'orange' };
    if (passwordStrength === 3) return { text: 'Good', color: 'yellow' };
    if (passwordStrength === 4) return { text: 'Strong', color: 'green' };
    if (passwordStrength === 5) return { text: 'Very Strong', color: 'green' };
  };

  /**
   * Render password strength bar
   */
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

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================
  
  /**
   * Effect to handle camera initialization
   */
  useEffect(() => {
    if (step === 3 && !photoTaken && !cameraStream) {
      initializeCamera();
    }

    return () => {
      // Clean up camera stream when component unmounts or step changes
      if (step !== 3) {
        stopCameraStream();
      }
    };
  }, [step, photoTaken, cameraStream]);

  // ==========================================
  // RENDER UI
  // ==========================================
  
  return (
    <div className="signup-page-container">
      <div className="signup-content">
        {/* Left Side - Form */}
        <div className="signup-form-container">
          <div className="signup-logo">
            <Heart size={32} color="#e11d48" fill="#e11d48" />
            <h2>FoodShare</h2>
          </div>

          <div className="signup-header">
            <h1>Join FoodBridge</h1>
            <p>Create an account and start making a difference in your community</p>
          </div>

          {/* Progress Indicator */}
          <div className="signup-progress">
            <div className="progress-steps">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`progress-step ${step >= i ? 'active' : ''}`}>
                  <div className="step-number">
                    {step > i ? <CheckCircle className="check-icon" /> : i}
                  </div>
                  <div className="step-label">
                    {i === 1 && 'Account'}
                    {i === 2 && 'Profile'}
                    {i === 3 && 'Preferences'}
                    {i === 4 && 'Review'}
                  </div>
                </div>
              ))}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Account Info */}
            {step === 1 && (
              <div className="form-step">
                <h2 className="step-title">Account Information</h2>
                <p className="step-description">Let's set up your basic account details</p>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      First Name *
                    </label>
                    <div className="input-with-icon">
                      <User className="field-icon" />
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">
                      Last Name *
                    </label>
                    <div className="input-with-icon">
                      <User className="field-icon" />
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address *
                  </label>
                  <div className="input-with-icon">
                    <Mail className="field-icon" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className={fieldErrors.email ? 'error-input' : ''}
                    />
                  </div>
                  {fieldErrors.email && (
                    <div className="input-error">{fieldErrors.email}</div>
                  )}
                  <div className="input-note">
                    We'll send a verification link to this email
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    Password *
                  </label>
                  <div className="password-field">
                    <Lock className="field-icon" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {formData.password && renderProgressBar()}

                  <div className="password-requirements">
                    <div className={`requirement ${/[A-Z]/.test(formData.password) ? 'met' : ''}`}>
                      <CheckCircle size={14} className="req-icon" />
                      <span>One uppercase letter</span>
                    </div>
                    <div className={`requirement ${/[a-z]/.test(formData.password) ? 'met' : ''}`}>
                      <CheckCircle size={14} className="req-icon" />
                      <span>One lowercase letter</span>
                    </div>
                    <div className={`requirement ${/[0-9]/.test(formData.password) ? 'met' : ''}`}>
                      <CheckCircle size={14} className="req-icon" />
                      <span>One number</span>
                    </div>
                    <div className={`requirement ${/[^A-Za-z0-9]/.test(formData.password) ? 'met' : ''}`}>
                      <CheckCircle size={14} className="req-icon" />
                      <span>One special character</span>
                    </div>
                    <div className={`requirement ${formData.password.length >= 8 ? 'met' : ''}`}>
                      <CheckCircle size={14} className="req-icon" />
                      <span>At least 8 characters</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information & Identification */}
            {step === 2 && (
              <div className="form-step">
                <h2 className="step-title">Personal Information & Identification</h2>
                <p className="step-description">Tell us a bit more about yourself and provide identification details</p>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number *
                  </label>
                  <div className="input-with-icon">
                    <Phone className="field-icon" />
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                      className={fieldErrors.phone ? 'error-input' : ''}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <div className="input-error">{fieldErrors.phone}</div>
                  )}
                  <div className="input-note">
                    For delivery coordination and emergency notifications
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="birthdate">
                      Date of Birth *
                    </label>
                    <div className="input-with-icon">
                      <Calendar className="field-icon" />
                      <input
                        id="birthdate"
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="bloodGroup">
                      Blood Group *
                    </label>
                    <div className="input-with-icon">
                      <Droplet className="field-icon" />
                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select blood group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="input-note">
                      Important for emergency situations
                    </div>
                  </div>
                </div>

                <div className="identification-section">
                  <h3 className="section-subtitle">Identification Details</h3>
                  <p className="section-note">Please provide at least one form of identification</p>

                  <div className="id-selection">
                    <button
                      type="button"
                      className={`id-option ${selectedIdentificationType === 'nid' ? 'active' : ''}`}
                      onClick={() => setSelectedIdentificationType('nid')}
                    >
                      <CreditCard className="id-icon" />
                      <span>National ID</span>
                    </button>
                    <button
                      type="button"
                      className={`id-option ${selectedIdentificationType === 'passport' ? 'active' : ''}`}
                      onClick={() => setSelectedIdentificationType('passport')}
                    >
                      <FileText className="id-icon" />
                      <span>Passport</span>
                    </button>
                    <button
                      type="button"
                      className={`id-option ${selectedIdentificationType === 'birth' ? 'active' : ''}`}
                      onClick={() => setSelectedIdentificationType('birth')}
                    >
                      <FileText className="id-icon" />
                      <span>Birth Certificate</span>
                    </button>
                  </div>

                  {selectedIdentificationType === 'nid' && (
                    <div className="form-group">
                      <label htmlFor="nationalId">
                        National ID Number *
                      </label>
                      <div className="input-with-icon">
                        <CreditCard className="field-icon" />
                        <input
                          id="nationalId"
                          type="text"
                          name="nationalId"
                          value={formData.nationalId}
                          onChange={handleChange}
                          placeholder="Enter your National ID number"
                          className={fieldErrors.nationalId ? 'error-input' : ''}
                          required
                        />
                      </div>
                      {fieldErrors.nationalId && (
                        <div className="input-error">{fieldErrors.nationalId}</div>
                      )}
                      <div className="input-note">
                        Format: 12-digit number without spaces
                      </div>
                    </div>
                  )}

                  {selectedIdentificationType === 'passport' && (
                    <div className="form-group">
                      <label htmlFor="passportNumber">
                        Passport Number *
                      </label>
                      <div className="input-with-icon">
                        <FileText className="field-icon" />
                        <input
                          id="passportNumber"
                          type="text"
                          name="passportNumber"
                          value={formData.passportNumber}
                          onChange={handleChange}
                          placeholder="Enter your passport number"
                          required
                        />
                      </div>
                      <div className="input-note">
                        Format: 9 characters (letters and numbers)
                      </div>
                    </div>
                  )}

                  {selectedIdentificationType === 'birth' && (
                    <div className="form-group">
                      <label htmlFor="birthCertificateNumber">
                        Birth Certificate Number *
                      </label>
                      <div className="input-with-icon">
                        <FileText className="field-icon" />
                        <input
                          id="birthCertificateNumber"
                          type="text"
                          name="birthCertificateNumber"
                          value={formData.birthCertificateNumber}
                          onChange={handleChange}
                          placeholder="Enter your birth certificate number"
                          required
                        />
                      </div>
                      <div className="input-note">
                        Format: Registration number as shown on your certificate
                      </div>
                    </div>
                  )}

                  <div className="identification-status">
                    {(formData.nationalId || formData.passportNumber || formData.birthCertificateNumber) ? (
                      <div className="id-provided">
                        <CheckCircle className="status-icon success" />
                        <span>Identification provided</span>
                      </div>
                    ) : (
                      <div className="id-missing">
                        <AlertCircle className="status-icon warning" />
                        <span>At least one form of identification is required</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address, Photo & Role */}
            {step === 3 && (
              <div className="form-step">
                <h2 className="step-title">Address, Photo & Role</h2>
                <p className="step-description">Provide your address, take a profile photo, and select your role</p>

                <div className="form-group">
                  <label htmlFor="address">
                    Address *
                  </label>
                  <div className="input-with-icon">
                    <MapPin className="field-icon" />
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your full address"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="addressDescription">
                    Address Description *
                  </label>
                  <div className="input-with-icon">
                    <Info className="field-icon" />
                    <textarea
                      id="addressDescription"
                      name="addressDescription"
                      value={formData.addressDescription}
                      onChange={handleChange}
                      placeholder="Provide additional details about your location (landmarks, building color, floor number, etc.)"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="input-note">
                    Details that help others find your location easily
                  </div>
                </div>

                <div className="camera-section">
                  <h3 className="section-subtitle">Take Your Photo</h3>
                  <p className="section-note">A clear photo helps build trust within our community</p>

                  <div className="camera-container">
                    {!photoTaken ? (
                      <>
                        <div className="video-container">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="camera-preview"
                          />
                          <div className="camera-overlay">
                            <div className="camera-frame"></div>
                          </div>
                        </div>

                        <div className="camera-controls">
                          <button
                            type="button"
                            className="take-photo-btn"
                            onClick={takePhoto}
                          >
                            <Camera className="btn-icon" />
                            <span>Take Photo</span>
                          </button>

                          <div className="camera-instructions">
                            <p>Please ensure:</p>
                            <ul>
                              <li>Your face is clearly visible</li>
                              <li>Good lighting conditions</li>
                              <li>A neutral background</li>
                            </ul>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="photo-preview-container">
                          <img
                            src={formData.userPhoto?.url}
                            alt="User photo"
                            className="photo-preview"
                          />

                          <div className="photo-verification">
                            <Verified className="verification-icon" />
                            <span>Photo captured successfully</span>
                          </div>
                        </div>

                        <div className="photo-controls">
                          <button
                            type="button"
                            className="retake-photo-btn"
                            onClick={retakePhoto}
                          >
                            <Camera className="btn-icon" />
                            <span>Retake Photo</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                </div>

                {/* Role Selection */}
                <div className="role-section">
                  <h3 className="section-subtitle">Your Role</h3>
                  <p className="section-note">How would you like to participate?</p>

                  <div className="role-selection">
                    <div
                      className={`role-option ${formData.userType === 'donor' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'donor' }))}
                    >
                      <div className="role-icon-container">
                        <Heart className="role-icon" />
                      </div>
                      <div className="role-content">
                        <h3>Food Donor</h3>
                        <p>Share surplus food with those in need. Reduce waste and help your community.</p>
                        <ul className="role-benefits">
                          <li>Reduce food waste</li>
                          <li>Support local community</li>
                          <li>Track your contributions</li>
                          <li>Get tax benefits</li>
                        </ul>
                      </div>
                      <div className="role-check">
                        {formData.userType === 'donor' && <CheckCircle />}
                      </div>
                    </div>

                    <div
                      className={`role-option ${formData.userType === 'receiver' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'receiver' }))}
                    >
                      <div className="role-icon-container receiver">
                        <User className="role-icon" />
                      </div>
                      <div className="role-content">
                        <h3>Food Receiver</h3>
                        <p>Access available food donations for yourself, your family, or your organization.</p>
                        <ul className="role-benefits">
                          <li>Find available food near you</li>
                          <li>Request food donations</li>
                          <li>Get emergency food assistance</li>
                          <li>Join a supportive community</li>
                        </ul>
                      </div>
                      <div className="role-check">
                        {formData.userType === 'receiver' && <CheckCircle />}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Brief Bio (Optional)</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us a bit more about yourself or your organization..."
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Agree */}
            {step === 4 && (
              <div className="form-step">
                <h2 className="step-title">Review Your Information</h2>
                <p className="step-description">Please review your information and accept our terms</p>

                <div className="review-info">
                  <div className="profile-summary">
                    {formData.userPhoto && (
                      <div className="profile-photo">
                        <img src={formData.userPhoto.url} alt="Profile" />
                      </div>
                    )}
                    <div className="profile-role-tag">
                      {formData.userType === 'donor' ? (
                        <div className="role-tag donor">
                          <Heart className="tag-icon" />
                          <span>Food Donor</span>
                        </div>
                      ) : (
                        <div className="role-tag receiver">
                          <User className="tag-icon" />
                          <span>Food Receiver</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Personal Information</h3>
                    <div className="review-grid">
                      <div className="review-item">
                        <span className="review-label">Full Name:</span>
                        <span className="review-value">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="review-item">
                        <span className="review-label">Email:</span>
                        <span className="review-value">{formData.email}</span>
                      </div>
                      <div className="review-item">
                        <span className="review-label">Phone:</span>
                        <span className="review-value">{formData.phone || '—'}</span>
                      </div>
                      <div className="review-item">
                        <span className="review-label">Date of Birth:</span>
                        <span className="review-value">{formData.birthdate || '—'}</span>
                      </div>
                      <div className="review-item">
                        <span className="review-label">Blood Group:</span>
                        <span className="review-value">{formData.bloodGroup || '—'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Identification</h3>
                    <div className="review-grid">
                      {formData.nationalId && (
                        <div className="review-item">
                          <span className="review-label">National ID:</span>
                          <span className="review-value">{formData.nationalId}</span>
                        </div>
                      )}
                      {formData.passportNumber && (
                        <div className="review-item">
                          <span className="review-label">Passport Number:</span>
                          <span className="review-value">{formData.passportNumber}</span>
                        </div>
                      )}
                      {formData.birthCertificateNumber && (
                        <div className="review-item">
                          <span className="review-label">Birth Certificate:</span>
                          <span className="review-value">{formData.birthCertificateNumber}</span>
                        </div>
                      )}
                      {!formData.nationalId && !formData.passportNumber && !formData.birthCertificateNumber && (
                        <div className="review-item">
                          <span className="review-label">Identification:</span>
                          <span className="review-value error">No identification provided</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Address</h3>
                    <div className="review-grid">
                      <div className="review-item full-width">
                        <span className="review-label">Address:</span>
                        <span className="review-value">{formData.address || '—'}</span>
                      </div>
                      <div className="review-item full-width">
                        <span className="review-label">Description:</span>
                        <span className="review-value">{formData.addressDescription || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {formData.bio && (
                    <div className="review-section">
                      <h3>About You</h3>
                      <div className="bio-preview">
                        <p>{formData.bio}</p>
                      </div>
                    </div>
                  )}

                  <div className="verification-summary">
                    <div className="verification-header">
                      <Shield className="verification-icon" />
                      <h3>Verification Status</h3>
                    </div>
                    <div className="verification-items">
                      <div className="verification-item">
                        <div className="verification-status">
                          {formData.nationalId || formData.passportNumber || formData.birthCertificateNumber ? (
                            <CheckCircle className="status-icon success" />
                          ) : (
                            <X className="status-icon error" />
                          )}
                        </div>
                        <span>Identity Verification</span>
                      </div>
                      <div className="verification-item">
                        <div className="verification-status">
                          {formData.address && formData.addressDescription ? (
                            <CheckCircle className="status-icon success" />
                          ) : (
                            <X className="status-icon error" />
                          )}
                        </div>
                        <span>Address Verification</span>
                      </div>
                      <div className="verification-item">
                        <div className="verification-status">
                          {formData.userPhoto ? (
                            <CheckCircle className="status-icon success" />
                          ) : (
                            <X className="status-icon error" />
                          )}
                        </div>
                        <span>Photo Verification</span>
                      </div>
                    </div>
                  </div>

                  <div className="review-note">
                    <Info size={16} />
                    <p>You can update your profile information anytime after registration. Your identity documents and photo will be securely stored and only used for verification purposes.</p>
                  </div>

                  <div className="terms-container">
                    <label className="terms-label">
                      <input
                        type="checkbox"
                        checked={isTermsAccepted}
                        onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                        required
                      />
                      <span>I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link>, <Link to="/privacy" className="terms-link">Privacy Policy</Link>, and confirm that all information provided is accurate and complete.</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-actions">
              {step > 1 && (
                <button type="button" className="back-button" onClick={goBack}>
                  Back
                </button>
              )}

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    {step < 4 ? 'Continue' : 'Create Account'}
                    <ArrowRight className="button-icon" />
                  </>
                )}
              </button>
            </div>

            <div className="signin-link">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;