import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Users, Clock, Calendar, Package,
  User, ChefHat, Building2, Store, Gift,
  MapIcon, X, Upload, AlertCircle, History, Plus,
  CheckCircle, Clock3, Award, Heart, Map, ArrowLeft, Search,
  Share2, UserCog, Facebook, Instagram, Twitter, Image, Trash2, Trash,
  Receipt, SwitchCamera, Lock, LogOut, Eye, EyeOff, Check, ArrowRight, ArrowUpRight,
  ArrowDown, ArrowLeftCircle, ArrowRightCircle, ArrowUpCircle, ArrowDownCircle,
  Truck, Phone, ArrowUp, MessageSquare
} from 'lucide-react';

import '../style/DonorDashboard.css';

const API_BASE_URL = 'http://localhost:8080';


const DonorDashboard = () => {
  // Main states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showAllFoodItems, setShowAllFoodItems] = useState(false);
  // New donation flow states
  const [donationStep, setDonationStep] = useState(0); // 0: not started, 1: category selection, 2: form
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);

  // API state
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  //
  const [activeDonations, setActiveDonations] = useState([]);
  const [availableRestaurantFoods, setAvailableRestaurantFoods] = useState([]);
  const [availableGroceryItems, setAvailableGroceryItems] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [shouldShowFoodItems, setShouldShowFoodItems] = useState(true);
  //
  const [allFoodItems, setAllFoodItems] = useState([]);
  const [foodItemsLoading, setFoodItemsLoading] = useState(false);
  //
  const [showDonationForm, setShowDonationForm] = useState(false);
  //
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedFoodDetails, setSelectedFoodDetails] = useState(null);
  //
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  //
  const [showNavigation, setShowNavigation] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  // State to hold the requests for a donation
  const [donationRequests, setDonationRequests] = useState([]);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [selectedDonationForRequests, setSelectedDonationForRequests] = useState(null);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const [selectedSubTab, setSelectedSubTab] = useState('active');
  const [pendingDonations, setPendingDonations] = useState([]);
  const [rejectedDonations, setRejectedDonations] = useState([]);
  const [completedDonations, setCompletedDonations] = useState([]);

  //
  const [foodRequests, setFoodRequests] = useState([]);
  const [foodRequestsLoading, setFoodRequestsLoading] = useState(false);
  const [foodRequestsError, setFoodRequestsError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  // Profile management states
  const [donorProfile, setDonorProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState('');
  const [profileUpdateError, setProfileUpdateError] = useState('');
  const [donorId, setDonorId] = useState(null);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Add these state variables
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedFoodForPurchase, setSelectedFoodForPurchase] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  //
  const [selectedMainTab, setSelectedMainTab] = useState('donations'); // Update this line if it exists
const [showMessagesModal, setShowMessagesModal] = useState(false);
const [selectedMessageTab, setSelectedMessageTab] = useState('received');
const [receivedMessages, setReceivedMessages] = useState([]);
const [sentMessages, setSentMessages] = useState([]);
const [messageStats, setMessageStats] = useState({});
const [messagesLoading, setMessagesLoading] = useState(false);
const [messagesError, setMessagesError] = useState(null);
const [showComposeModal, setShowComposeModal] = useState(false);
const [selectedMessage, setSelectedMessage] = useState(null);
const [showMessageDetails, setShowMessageDetails] = useState(false);

const fetchReceivedMessages = async () => {
  if (!donorId) return;
  
  setMessagesLoading(true);
  setMessagesError(null);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/donor/messages/${donorId}/received`);
    if (!response.ok) {
      throw new Error('Failed to fetch received messages');
    }
    const data = await response.json();
    setReceivedMessages(data);
    console.log('Received messages:', data);
  } catch (error) {
    console.error('Error fetching received messages:', error);
    setMessagesError('Failed to load received messages');
  } finally {
    setMessagesLoading(false);
  }
};

const fetchSentMessages = async () => {
  if (!donorId) return;
  
  setMessagesLoading(true);
  setMessagesError(null);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/donor/messages/${donorId}/sent`);
    if (!response.ok) {
      throw new Error('Failed to fetch sent messages');
    }
    const data = await response.json();
    setSentMessages(data);
    console.log('Sent messages:', data);
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    setMessagesError('Failed to load sent messages');
  } finally {
    setMessagesLoading(false);
  }
};

const fetchMessageStats = async () => {
  if (!donorId) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/donor/messages/${donorId}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch message stats');
    }
    const data = await response.json();
    setMessageStats(data);
    console.log('Message stats:', data);
  } catch (error) {
    console.error('Error fetching message stats:', error);
  }
};

const handleMarkAsRead = async (messageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/donor/messages/${donorId}/messages/${messageId}/mark-read`, {
      method: 'PUT'
    });
    
    if (response.ok) {
      // Update the message in the list
      setReceivedMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
      fetchMessageStats(); // Refresh stats
    }
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
};

const handleDeleteSentMessage = async (messageId) => {
  if (!window.confirm('Are you sure you want to delete this message?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/donor/messages/${donorId}/sent/${messageId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      setSentMessages(prev => prev.filter(msg => msg.id !== messageId));
      alert('Message deleted successfully');
    } else {
      throw new Error('Failed to delete message');
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    alert('Failed to delete message');
  }
};

const handleSendMessage = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/donor/messages/send`, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Message sent successfully!');
      setShowComposeModal(false);
      fetchSentMessages(); // Refresh sent messages
      fetchMessageStats(); // Refresh stats
    } else {
      throw new Error(result.message || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    alert('Failed to send message: ' + error.message);
  }
};

// Add useEffect to load messages when component mounts or tab changes
useEffect(() => {
  if (selectedMainTab === 'messages' && donorId) {
    fetchReceivedMessages();
    fetchSentMessages();
    fetchMessageStats();
  }
}, [selectedMainTab, donorId]);



 const handleDonate = (food) => {
  console.log('🟢 Opening purchase modal for:', food.name);

  // Close any other modals first
  setShowDonationForm(false);
  setDonationStep(0);
  setSelectedFood(null);
  setShowDetailsModal(false);

  // Reset error states
  setPurchaseError(null);
  setPurchaseSuccess(null);

  // Set the selected food and open modal
  setSelectedFoodForPurchase(food);
  setShowPurchaseModal(true);

  // Fetch fresh food details with image
  fetch(`${API_BASE_URL}/api/donor/food-items/${food.id}`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch food details');
      return response.json();
    })
    .then(data => {
      setSelectedFoodForPurchase(prevData => ({
        ...food, // Keep original food data
        imageBase64: data.imageBase64,
        imageContentType: data.imageContentType
      }));
    })
    .catch(error => {
      console.error('Error fetching food details:', error);
    });
};

const handlePurchaseSubmit = (formData) => {
  console.log('🚀 Starting purchase process with FormData');
  
  setPurchaseLoading(true);
  setPurchaseError(null);
  setPurchaseSuccess(null);

  // Log the FormData contents for debugging
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  // Make the API call
  fetch(`${API_BASE_URL}/api/merchant/sales/create`, {
    method: 'POST',
    body: formData, // Send FormData directly
  })
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        return response.text().then(text => {
          console.error('Server error response:', text);
          throw new Error(text || 'Failed to complete purchase');
        });
      }
      return response.json();
    })
    .then(result => {
      console.log('✅ Purchase completed successfully:', result);
      
      if (result.success !== false) {
        setPurchaseSuccess('Your purchase successfully done!');
        
        // Auto-close modal after 3 seconds
        setTimeout(() => {
          setShowPurchaseModal(false);
          setSelectedFoodForPurchase(null);
          
          // Refresh data
          fetchAllFoodItems();
          fetchActiveDonations();
        }, 3000);
      } else {
        throw new Error(result.message || 'Purchase failed');
      }
    })
    .catch(error => {
      console.error('❌ Purchase error:', error);
      setPurchaseError(error.message || 'Failed to complete the purchase. Please try again.');
    })
    .finally(() => {
      setPurchaseLoading(false);
    });
};

  // Add this function to fetch purchase history
  const fetchPurchaseHistory = () => {
    if (!donorId) return;

    fetch(`${API_BASE_URL}/api/merchant/sales/donor/${donorId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch purchase history');
        }
        return response.json();
      })
      .then(data => {
        setPurchaseHistory(data);
      })
      .catch(error => {
        console.error('Error fetching purchase history:', error);
      });
  };

  // Call this in useEffect to load purchase history when component mounts
  useEffect(() => {
    if (donorId) {
      fetchPurchaseHistory();
    }
  }, [donorId]);

  //
  const handleDeleteDonation = async (donationId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this donation?');

    if (confirmDelete) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/donor/donations/${donationId}?donorId=${donorId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to delete donation');
        }

        // Remove the deleted donation from the list
        setActiveDonations(prevDonations =>
          prevDonations.filter(donation => donation.id !== donationId)
        );

        alert('Donation marked as deleted successfully');
      } catch (error) {
        console.error('Error deleting donation:', error);
        alert(error.message || 'Failed to delete donation');
      }
    }
  };

  //
  // Add or modify this function in the component
  const fetchDonationsByStatus = async (status) => {
    setApiLoading(true);
    setApiError(null);

    try {
      console.log(`Fetching donations with status ${status} for donor ID: ${donorId}`);

      // Determine API endpoint based on status
      let apiUrl;
      if (status === 'active') {
        apiUrl = `${API_BASE_URL}/api/donor/donations/active?donorId=${donorId}`;
      } else if (status === 'pending') {
        apiUrl = `${API_BASE_URL}/api/donor/donations/pending?donorId=${donorId}`;
      } else if (status === 'rejected') {
        apiUrl = `${API_BASE_URL}/api/donor/donations/rejected?donorId=${donorId}`;
      } else if (status === 'completed') {
        apiUrl = `${API_BASE_URL}/api/donor/donations/completed?donorId=${donorId}`;
      } else {
        throw new Error(`Unknown status: ${status}`);
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching ${status} donations:`, errorText);
        throw new Error(`Failed to fetch ${status} donations`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.warn('Invalid data received:', data);
        return;
      }

      // Format donations consistently
      const formattedDonations = data.map(donation => ({
        id: donation.id,
        foodName: donation.foodName || 'Unnamed Donation',
        category: donation.category?.label || donation.category || 'Uncategorized',
        quantity: donation.quantity || 'Unknown',
        expiry: donation.expiryDate,
        location: donation.location || 'No location',
        donorType: donation.donorType || 'Unknown',
        status: donation.status,
        preparation: donation.preparationDate,
        packaging: donation.packaging || 'Not specified',
        dietaryInfo: Array.isArray(donation.dietaryInfo)
          ? donation.dietaryInfo.join(', ')
          : 'Not specified',
        storageInstructions: donation.storageInstructions || 'Not specified',
        imageUrl: donation.imageData
          ? `data:${donation.imageContentType || 'image/jpeg'};base64,${donation.imageData}`
          : '/api/placeholder/400/200'
      }));

      // Update the appropriate state based on status
      if (status === 'active') {
        setActiveDonations(formattedDonations);
      } else if (status === 'pending') {
        setPendingDonations(formattedDonations);
      } else if (status === 'rejected') {
        setRejectedDonations(formattedDonations);
      } else if (status === 'completed') {
        setCompletedDonations(formattedDonations);
      }

    } catch (error) {
      console.error(`Error in fetchDonationsByStatus(${status}):`, error);
      setApiError(error.message);

      // Set appropriate state to empty array on error
      if (status === 'active') {
        setActiveDonations([]);
      } else if (status === 'pending') {
        setPendingDonations([]);
      } else if (status === 'rejected') {
        setRejectedDonations([]);
      } else if (status === 'completed') {
        setCompletedDonations([]);
      }
    } finally {
      setApiLoading(false);
    }
  };

  // Add this effect to trigger when activeDonations or pendingDonations change
  useEffect(() => {
    console.log('Active donations state updated:', activeDonations);
    console.log('Pending donations state updated:', pendingDonations);
  }, [activeDonations, pendingDonations]);


  const handleCheckRequests = async (donation) => {
    try {
      setRequestsLoading(true);
      setSelectedDonationForRequests(donation);

      console.log(`Checking requests for donation ID: ${donation.id}`);

      const response = await fetch(`${API_BASE_URL}/api/donor/donations/${donation.id}/requests?donorId=${donorId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Failed to fetch requests: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Requests data:', data);

      // Filter to only show PENDING requests
      const pendingRequests = data.filter(request => request.status === 'PENDING');
      setDonationRequests(pendingRequests);

      // Open the requests modal
      setShowRequestsModal(true);
    } catch (error) {
      console.error('Error fetching requests:', error);
      alert('Failed to load requests. Please try again.');
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleUpdateRequestStatus = async (requestId, status, note = '') => {
    try {
      setRequestsLoading(true);

      // First update the request status
      const response = await fetch(`${API_BASE_URL}/api/donor/requests/${requestId}/status?donorId=${donorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status,
          responseNote: note
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update request status: ${errorText || response.statusText}`);
      }

      // Refresh the requests for the current donation
      if (selectedDonationForRequests) {
        const refreshResponse = await fetch(
          `${API_BASE_URL}/api/donor/donations/${selectedDonationForRequests.id}/requests?donorId=${donorId}`,
          { credentials: 'include' }
        );

        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json();
          const pendingRequests = refreshedData.filter(request => request.status === 'PENDING');
          setDonationRequests(pendingRequests);
        }
      }

      // Close modal if no pending requests remain
      if (donationRequests.length === 0) {
        setShowRequestsModal(false);
      }

      // Refresh donation lists
      await Promise.all([
        fetchActiveDonations(),
        fetchDonationsByStatus('pending'),
        fetchDonationsByStatus('rejected'),
        fetchDonationsByStatus('completed')
      ]);

    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status: ' + error.message);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Add this function to handle opening the edit modal
  const handleEditDonation = (donation) => {
    console.log("Opening edit modal for donation:", donation);

    // Check the current format of the category
    if (donation.category) {
      console.log(`Original category format: ${donation.category}`);
    }

    // Pre-fill the form with the donation's current data
    // We'll keep the original category format as-is to avoid conversion errors
    const formData = {
      foodName: donation.foodName || '',
      category: donation.category || '', // Keep original format
      quantity: donation.quantity || '',
      expiry: donation.expiry || '',
      location: donation.location || '',
      description: donation.description || '',
      donorType: donation.donorType || '',
      preparation: donation.preparation || '',
      dietaryInfo: donation.dietaryInfo || '',
      packaging: donation.packaging || '',
      storageInstructions: donation.storageInstructions || '',
      image: null,
      // Keep the original ID for updating
      donationId: donation.id
    };

    console.log("Form data initialized with:", formData);

    setDonationForm(formData);
    setEditingDonation(donation);
    setShowEditModal(true);
  };

  // Fixed handleEditSubmit function
  const handleEditSubmit = (e, localFormData) => {
    e.preventDefault();
    setApiLoading(true);
    setApiError(null);

    // Create a FormData object for multipart/form-data submission
    const formData = new FormData();

    // Use localFormData passed from EditDonationModal if available,
    // otherwise fallback to donationForm (for compatibility)
    const formToUse = localFormData || donationForm;

    // Log which form we're using
    console.log('Using form data:', formToUse);

    // Map frontend field names to backend expectations
    const fieldMapping = {
      'expiry': 'expiryDate',
      'preparation': 'preparationDate'
    };

    // Add all form fields to FormData (with improved logging)
    Object.keys(formToUse).forEach(key => {
      if (formToUse[key] !== null && formToUse[key] !== undefined && key !== 'image' && key !== 'donationId') {
        // Handle date fields that need special formatting
        if (key === 'expiry' || key === 'preparation') {
          // Check if this is a datetime-local value (contains 'T')
          if (formToUse[key] && formToUse[key].includes('T')) {
            // Extract just the date part for fields that expect YYYY-MM-DD
            const dateValue = formToUse[key].split('T')[0];
            formData.append(fieldMapping[key] || key, dateValue);
            console.log(`Converting ${key} from ${formToUse[key]} to ${dateValue}`);
          } else if (formToUse[key]) {
            // If it's already a date string, use it directly
            formData.append(fieldMapping[key] || key, formToUse[key]);
            console.log(`Using ${key} directly: ${formToUse[key]}`);
          }
        }
        // Handle dietaryInfo array
        else if (key === 'dietaryInfo') {
          if (Array.isArray(formToUse[key])) {
            formToUse[key].forEach(item => {
              formData.append('dietaryInfo', item);
              console.log(`Adding dietary info item: ${item}`);
            });
          } else if (typeof formToUse[key] === 'string' && formToUse[key].trim() !== '') {
            // Handle case where dietaryInfo is a comma-separated string
            const items = formToUse[key].split(',').map(item => item.trim());
            items.forEach(item => {
              if (item) {
                formData.append('dietaryInfo', item);
                console.log(`Adding dietary info from string: ${item}`);
              }
            });
          }
        }
        // Handle category (ensure it's included and properly formatted)
        else if (key === 'category') {
          // Make sure category is in the expected format for the backend (enum name)
          let categoryValue = formToUse[key];
          // If it's not already in uppercase with underscores format, try to convert it
          if (categoryValue && !categoryValue.includes('_')) {
            // Check if it's a human-readable format that needs conversion
            const categoryMap = {
              "Homemade Food": "HOMEMADE_FOOD",
              "Restaurant & Café Surplus": "RESTAURANT_SURPLUS",
              "Corporate & Office Donations": "CORPORATE_DONATION",
              "Grocery Store Excess": "GROCERY_EXCESS",
              "Event & Wedding Leftovers": "EVENT_LEFTOVER",
              "Purchased Food for Donation": "PURCHASED_FOOD"
            };

            if (categoryMap[categoryValue]) {
              categoryValue = categoryMap[categoryValue];
            }
          }

          if (categoryValue) {
            formData.append('category', categoryValue);
            console.log(`Adding category: ${categoryValue}`);
          }
        }
        else {
          // Use mapped field name if it exists, otherwise use the original key
          const backendKey = fieldMapping[key] || key;
          formData.append(backendKey, formToUse[key]);
          console.log(`Adding field ${backendKey}: ${formToUse[key]}`);
        }
      }
    });

    formData.append('donorId', donorId);
    console.log(`Adding donorId: ${donorId}`);

    // Handle image upload
    if (formToUse.image) {
      formData.append('image', formToUse.image);
      console.log('Adding image file:', formToUse.image.name);
    }

    // Debug: Log all data being sent
    console.log('Sending updated donation data:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    // Send the update request to the API
    const apiUrl = `${API_BASE_URL || 'http://localhost:8080'}/api/donor/donations/${formToUse.donationId}`;
    console.log('Updating donation at:', apiUrl);
    console.log('🚀 FINAL FORM DATA TO BE SENT:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    fetch(apiUrl, {
      method: 'PUT',
      body: formData,
      // Don't set Content-Type header manually for FormData
      // Let the browser set it with the correct boundary
    })
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          // Try to get more detailed error information
          return response.text().then(text => {
            console.error('Server response:', text);
            throw new Error('Failed to update donation: ' + (text || response.statusText));
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Donation updated successfully:', data);

        // Log the returned category specifically for debugging
        console.log('Updated category returned from server:',
          data.category ?
            (typeof data.category === 'object' ?
              `${data.category.name} (${data.category.label})` :
              data.category) :
            'No category returned');

        // Show success message to user
        alert('Donation updated successfully!');

        // Close the edit modal
        setShowEditModal(false);
        setEditingDonation(null);

        // Refresh the donations list
        fetchActiveDonations();
      })
      .catch(error => {
        console.error('Error updating donation:', error);
        setApiError(error.message);

        // Show error to user
        alert(error.message || 'Failed to update donation. Please try again.');
      })
      .finally(() => {
        setApiLoading(false);
      });
  };

  // Add this function to close the edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingDonation(null);
  };
  //
  // Function to handle checking requests for pending donations
  const handleCheckPendingRequests = async (donation) => {
    try {
      setRequestsLoading(true);
      setSelectedDonationForRequests(donation);

      console.log(`Checking requests for pending donation ID: ${donation.id}`);

      // Include credentials if you're using cookies for authentication
      const response = await fetch(`${API_BASE_URL}/api/donor/donations/${donation.id}/requests?donorId=${donorId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Failed to fetch requests: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Requests data for pending donation:', data);

      // Filter to only show ACCEPTED requests for pending donations
      const acceptedRequests = data.filter(request => request.status === 'ACCEPTED');
      setDonationRequests(acceptedRequests);
      setShowRequestsModal(true);
    } catch (error) {
      console.error('Error fetching requests for pending donation:', error);
      alert('Failed to load requests. Please try again.');
    } finally {
      setRequestsLoading(false);
    }
  };
  //
  // Function to fetch requests for a specific donation
  const fetchRequestsForDonation = async (donationId) => {
    try {
      setRequestsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/donor/donations/${donationId}/requests?donorId=${donorId}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      const pendingRequests = data.filter(request => request.status === 'PENDING');
      setDonationRequests(pendingRequests);
    } catch (error) {
      console.error('Error fetching donation requests:', error);
      alert('Failed to load requests');
    } finally {
      setRequestsLoading(false);
    }
  };
  //
  const DonationRequestsModal = () => {
    const [responseNotes, setResponseNotes] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    // Early return if modal should not be shown
    if (!showRequestsModal || !selectedDonationForRequests) return null;

    // Safely parse remaining quantity
    const remainingQuantity = selectedDonationForRequests?.quantity
      ? parseInt(selectedDonationForRequests.quantity.replace(/[^0-9]/g, ''))
      : 0;

    // Handler for updating request status with additional error handling
    const handleRequestStatusUpdate = async (requestId, status, note = '') => {
      try {
        setIsProcessing(true);

        // Validate inputs
        if (!requestId || !status) {
          throw new Error('Invalid request parameters');
        }

        const response = await fetch(`${API_BASE_URL}/api/donor/requests/${requestId}/status?donorId=${donorId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: status,
            responseNote: note || (status === 'ACCEPTED'
              ? 'Your request has been accepted.'
              : 'Sorry, we cannot fulfill your request.')
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Failed to update request status: ${response.statusText}`);
        }

        // Show success toast message
        const message = status === 'ACCEPTED' ? 'Request accepted successfully!' : 'Request declined';
        // Implement toast notification here if you have a toast system

        // Refresh request list or update UI
        await fetchRequestsForDonation(selectedDonationForRequests.id);

        // Close modal if no pending requests remain
        if (donationRequests.length === 0) {
          setShowRequestsModal(false);
        }

      } catch (error) {
        console.error('Error updating request status:', error);
        alert(error.message || 'Failed to update request status');
      } finally {
        setIsProcessing(false);
      }
    };

    // Fallback image URL
    const getFallbackImageUrl = (request) => {
      return request.imageUrl
        || selectedDonationForRequests.imageUrl
        || '/api/placeholder/300/200';
    };

    // Format date function
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return (
      <div className="donation-request-modal-overlay">
        <div className="donation-request-modal-container">
          {/* Enhanced Modal Header */}
          <div className="donation-request-modal-header">
            <div className="donation-request-header-content">
              <h2>{selectedDonationForRequests.foodName} Requests</h2>
              <div className="donation-request-header-meta">
                <Package className="h-4 w-4" />
                <span>Remaining: <strong>{remainingQuantity} servings</strong></span>
              </div>
            </div>
            <button
              className="donation-request-close-btn"
              onClick={() => setShowRequestsModal(false)}
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Enhanced Modal Body */}
          <div className="donation-request-modal-body">
            {/* Loading State */}
            {(requestsLoading || isProcessing) && (
              <div className="donation-request-loading">
                <span className="donation-request-spinner"></span>
                <span>{isProcessing ? 'Processing your request...' : 'Loading requests...'}</span>
              </div>
            )}

            {/* Empty State */}
            {!requestsLoading && donationRequests.length === 0 && (
              <div className="donation-request-empty">
                <Users className="h-16 w-16 text-gray-300" />
                <p>No requests received for this donation</p>
                <span className="text-gray-500 text-sm mt-2">When someone requests your donation, it will appear here</span>
              </div>
            )}

            {/* Requests Grid */}
            {!requestsLoading && donationRequests.length > 0 && (
              <div className="donation-requests-grid">
                {donationRequests.map(request => (
                  <div key={request.id} className="donation-request-card">
                    {/* Food Image */}
                    <div className="donation-request-image">
                      <img
                        src={getFallbackImageUrl(request)}
                        alt={request.foodName || "Requested Food"}
                        className="donation-request-food-image"
                      />
                    </div>

                    {/* Request Details */}
                    <div className="donation-request-details">
                      {/* Request Header with User Info */}
                      <div className="donation-request-card-header">
                        <div className="donation-request-user-info">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium">{request.receiverName || 'Anonymous'}</span>
                        </div>
                        <div className={`donation-request-status ${request.status.toLowerCase()}`}>
                          {request.status}
                        </div>
                      </div>

                      {/* Request Information with Icons */}
                      <div className="donation-request-info">
                        <div className="donation-request-info-item">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {formatDate(request.requestDate)}
                          </span>
                        </div>
                        <div className="donation-request-info-item">
                          <Package className="h-3.5 w-3.5" />
                          <span>Quantity: <strong>{request.quantity}</strong></span>
                        </div>
                        <div className="donation-request-info-item">
                          <Truck className="h-3.5 w-3.5" />
                          <span>
                            {request.pickupMethod === 'courier'
                              ? 'Courier Pickup'
                              : 'Self Pickup'
                            }
                          </span>
                        </div>
                        <div className="donation-request-info-item">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{request.location || 'No location specified'}</span>
                        </div>
                      </div>

                      {/* Request Note with Better Styling */}
                      {request.note && (
                        <div className="donation-request-note">
                          <p>"{request.note}"</p>
                        </div>
                      )}

                      {/* Actions for Pending Requests */}
                      {request.status === 'PENDING' && (
                        <div className="donation-request-actions">
                          <input
                            type="text"
                            placeholder="Add a response note..."
                            className="donation-request-note-input"
                            value={responseNotes[request.id] || ''}
                            onChange={(e) => setResponseNotes({
                              ...responseNotes,
                              [request.id]: e.target.value
                            })}
                            disabled={isProcessing}
                          />
                          <div className="donation-request-action-buttons">
                            <button
                              className="donation-request-accept-btn"
                              onClick={() => handleRequestStatusUpdate(
                                request.id,
                                'ACCEPTED',
                                responseNotes[request.id]
                              )}
                              disabled={isProcessing}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Accept</span>
                            </button>
                            <button
                              className="donation-request-decline-btn"
                              onClick={() => handleRequestStatusUpdate(
                                request.id,
                                'REJECTED',
                                responseNotes[request.id]
                              )}
                              disabled={isProcessing}
                            >
                              <X className="h-4 w-4" />
                              <span>Decline</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  //
  const EditDonationModal = ({ donation, onClose, onSubmit, loading, error }) => {
    // Create a local state for form data instead of using the parent state directly
    const [localForm, setLocalForm] = useState({
      foodName: donation?.foodName || '',
      category: donation?.category || '',
      quantity: donation?.quantity || '',
      expiry: donation?.expiry || '',
      location: donation?.location || '',
      description: donation?.description || '',
      donorType: donation?.donorType || '',
      preparation: donation?.preparation || '',
      dietaryInfo: donation?.dietaryInfo || '',
      packaging: donation?.packaging || '',
      storageInstructions: donation?.storageInstructions || '',
      image: null,
      donationId: donation?.id
    });

    // Debug the initial form state
    useEffect(() => {
      console.log('Initial edit form state:', localForm);
    }, []);

    // Only update local state without affecting parent state
    const handleLocalChange = (field, value) => {
      console.log(`Changing field ${field} from "${localForm[field]}" to "${value}"`);

      // Special handling for category to ensure proper formatting
      if (field === 'category') {
        console.log(`Category selected: ${value}`);
      }

      setLocalForm(prevForm => ({
        ...prevForm,
        [field]: value
      }));
    };

    // When form is submitted, pass the complete form data to parent
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Form being submitted with data:', localForm);

      // Ensure category is formatted properly before submission
      const formToSubmit = { ...localForm };

      if (formToSubmit.category) {
        // Convert visual category format (if needed) to the expected backend enum format
        const categoryMap = {
          "Homemade Food": "HOMEMADE_FOOD",
          "Restaurant & Café Surplus": "RESTAURANT_SURPLUS",
          "Corporate & Office Donations": "CORPORATE_DONATION",
          "Grocery Store Excess": "GROCERY_EXCESS",
          "Event & Wedding Leftovers": "EVENT_LEFTOVER",
          "Purchased Food for Donation": "PURCHASED_FOOD"
        };

        if (categoryMap[formToSubmit.category]) {
          formToSubmit.category = categoryMap[formToSubmit.category];
          console.log(`Converted category to enum format: ${formToSubmit.category}`);
        }
      }

      // Pass the sanitized form data to the parent component
      onSubmit(e, formToSubmit);
    };

    if (!donation) return null;

    // Helper function to check if the field has changed from original
    const hasFieldChanged = (field) => {
      return localForm[field] !== donation[field];
    };

    // Debug function to identify category format
    const identifyCategoryFormat = (category) => {
      if (!category) return 'Empty';
      if (category.includes('_')) return 'Enum format (with underscore)';
      if (category.includes('&')) return 'Human-readable format (contains &)';
      return `Unknown format: ${category}`;
    };

    return (
      <div className="edit-modal-overlay">
        <div className="edit-modal-container">
          <div className="edit-modal-header">
            <h2 className="edit-modal-title">
              Edit Donation - {donation.foodName}
            </h2>
            <button className="edit-modal-close" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="edit-error-message">
              <span>{error}</span>
            </div>
          )}

          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="edit-form-scroll">
              {/* Food Information Section */}
              <div className="edit-section">
                <h3 className="edit-section-title">
                  Food Information
                </h3>
                <div className="edit-grid">
                  <div className="edit-field">
                    <label htmlFor="category">Donation Category* {hasFieldChanged('category') && <span className="changed-field-indicator">(changed)</span>}</label>
                    <select
                      id="category"
                      value={localForm.category}
                      onChange={(e) => handleLocalChange('category', e.target.value)}
                      required
                      className={hasFieldChanged('category') ? 'field-changed' : ''}
                    >
                      <option value="">Select Category</option>
                      <option value="HOMEMADE_FOOD">Homemade Food</option>
                      <option value="RESTAURANT_SURPLUS">Restaurant & Café Surplus</option>
                      <option value="CORPORATE_DONATION">Corporate & Office Donations</option>
                      <option value="GROCERY_EXCESS">Grocery Store Excess</option>
                      <option value="EVENT_LEFTOVER">Event & Wedding Leftovers</option>
                      <option value="PURCHASED_FOOD">Purchased Food for Donation</option>
                       <option value="BAKERY">Bakery Item</option>
                    </select>
                    <small>Current format: {identifyCategoryFormat(localForm.category)}</small>
                  </div>

                  <div className="edit-field">
                    <label htmlFor="foodName">Food Name*</label>
                    <input
                      id="foodName"
                      type="text"
                      value={localForm.foodName}
                      onChange={(e) => handleLocalChange('foodName', e.target.value)}
                      placeholder="Enter food name"
                      required
                      className={hasFieldChanged('foodName') ? 'field-changed' : ''}
                    />
                  </div>

                  <div className="edit-field">
                    <label htmlFor="quantity">Quantity*</label>
                    <input
                      id="quantity"
                      type="text"
                      value={localForm.quantity}
                      onChange={(e) => handleLocalChange('quantity', e.target.value)}
                      placeholder="e.g., 5 servings, 2kg"
                      required
                      className={hasFieldChanged('quantity') ? 'field-changed' : ''}
                    />
                  </div>

                  <div className="edit-field">
                    <label htmlFor="donorType">Donor Type</label>
                    <input
                      id="donorType"
                      type="text"
                      value={localForm.donorType}
                      onChange={(e) => handleLocalChange('donorType', e.target.value)}
                      placeholder="Restaurant, Individual, etc."
                      className={hasFieldChanged('donorType') ? 'field-changed' : ''}
                    />
                  </div>

                  <div className="edit-field full-width">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      value={localForm.description || ''}
                      onChange={(e) => handleLocalChange('description', e.target.value)}
                      placeholder="Add any additional details about the food"
                      rows={3}
                      className={hasFieldChanged('description') ? 'field-changed' : ''}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Dates & Storage Section */}
              <div className="edit-section">
                <h3 className="edit-section-title">
                  Dates & Storage
                </h3>
                <div className="edit-grid">
                  <div className="edit-field">
                    <label htmlFor="expiry">Expiry Date & Time*</label>
                    <input
                      id="expiry"
                      type="date"
                      value={localForm.expiry ? (localForm.expiry.includes('T') ? localForm.expiry.split('T')[0] : localForm.expiry) : ''}
                      onChange={(e) => handleLocalChange('expiry', e.target.value)}
                      required
                      className={hasFieldChanged('expiry') ? 'field-changed' : ''}
                    />
                  </div>

                  <div className="edit-field">
                    <label htmlFor="preparation">Preparation Date*</label>
                    <input
                      id="preparation"
                      type="date"
                      value={localForm.preparation ? (localForm.preparation.includes('T') ? localForm.preparation.split('T')[0] : localForm.preparation) : ''}
                      onChange={(e) => handleLocalChange('preparation', e.target.value)}
                      required
                      className={hasFieldChanged('preparation') ? 'field-changed' : ''}
                    />
                  </div>

                  <div className="edit-field">
                    <label htmlFor="packaging">Packaging</label>
                    <input
                      id="packaging"
                      type="text"
                      value={localForm.packaging || ''}
                      onChange={(e) => handleLocalChange('packaging', e.target.value)}
                      placeholder="Not specified"
                      className={hasFieldChanged('packaging') ? 'field-changed' : ''}
                    />
                  </div>

                  <div className="edit-field">
                    <label htmlFor="storageInstructions">Storage Instructions</label>
                    <input
                      id="storageInstructions"
                      type="text"
                      value={localForm.storageInstructions || ''}
                      onChange={(e) => handleLocalChange('storageInstructions', e.target.value)}
                      placeholder="Not specified"
                      className={hasFieldChanged('storageInstructions') ? 'field-changed' : ''}
                    />
                  </div>

                  <div className="edit-field">
                    <label htmlFor="dietaryInfo">Dietary Information</label>
                    <input
                      id="dietaryInfo"
                      type="text"
                      value={typeof localForm.dietaryInfo === 'string' ? localForm.dietaryInfo : (Array.isArray(localForm.dietaryInfo) ? localForm.dietaryInfo.join(', ') : '')}
                      onChange={(e) => handleLocalChange('dietaryInfo', e.target.value)}
                      placeholder="Vegetarian, Vegan, Gluten-Free, etc. (comma separated)"
                      className={hasFieldChanged('dietaryInfo') ? 'field-changed' : ''}
                    />
                    <small className="edit-hint">Separate multiple items with commas</small>
                  </div>
                </div>
              </div>

              {/* Location & Image Section */}
              <div className="edit-section">
                <h3 className="edit-section-title">
                  Location & Image
                </h3>
                <div className="edit-grid">
                  <div className="edit-field full-width">
                    <label htmlFor="location">Location*</label>
                    <input
                      id="location"
                      type="text"
                      value={localForm.location || ''}
                      onChange={(e) => handleLocalChange('location', e.target.value)}
                      placeholder="Enter pickup location"
                      required
                      className={hasFieldChanged('location') ? 'field-changed' : ''}
                    />
                  </div>

                  <div className="edit-field full-width">
                    <label>Update Food Image</label>
                    <div className="edit-upload">
                      <input
                        type="file"
                        id="food-image-edit"
                        className="file-input"
                        accept="image/*"
                        onChange={(e) => handleLocalChange('image', e.target.files[0])}
                      />
                      <label htmlFor="food-image-edit" className="upload-box">
                        <Upload className="upload-icon" />
                        <span>Click to upload or drag and drop</span>
                        <span className="upload-hint">PNG, JPG up to 5MB</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="edit-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-update" disabled={loading}>
                {loading ? "Updating..." : "Update Donation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };


  const fetchActiveDonations = () => {
    setApiLoading(true);
    setApiError(null);

    console.log('Fetching active donations for donor ID:', donorId);

    fetch(`${API_BASE_URL}/api/donor/donations/active?donorId=${donorId}`)
      .then(response => {
        console.log(`Response status for active donations: ${response.status}`);
        if (!response.ok) {
          return response.text().then(text => {
            console.error('Error response body:', text);
            throw new Error(`Failed to fetch active donations: ${response.statusText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Active donations received:', data);

        if (!Array.isArray(data)) {
          console.warn('Received non-array data:', data);
          setActiveDonations([]);
          return;
        }

        // Filter out donations with quantity <= 0
        const filteredDonations = data.filter(donation => {
          if (!donation.quantity) return false;

          // Extract numeric part from quantity string
          const quantityMatch = donation.quantity.match(/\d+/);
          if (!quantityMatch) return false;

          const quantity = parseInt(quantityMatch[0], 10);
          return quantity > 0;
        });

        const formattedDonations = filteredDonations.map(donation => ({
          id: donation.id,
          foodName: donation.foodName,
          category: donation.category?.label || donation.category,
          quantity: donation.quantity,
          expiry: donation.expiryDate,
          location: donation.location,
          donorType: donation.donorType,
          status: donation.status,
          preparation: donation.preparationDate,
          packaging: donation.packaging || 'Not specified',
          dietaryInfo: Array.isArray(donation.dietaryInfo) ? donation.dietaryInfo.join(', ') : 'Not specified',
          storageInstructions: donation.storageInstructions || 'Not specified',
          imageUrl: donation.imageData ?
            `data:${donation.imageContentType || 'image/jpeg'};base64,${donation.imageData}`
            : '/api/placeholder/400/200'
        }));

        setActiveDonations(formattedDonations);
      })
      .catch(error => {
        console.error('Error fetching active donations:', error);
        setApiError(`Failed to fetch active donations: ${error.message}`);
      })
      .finally(() => {
        setApiLoading(false);
      });
  };

  // Add this new useEffect after line 119:
  useEffect(() => {
    if (selectedMainTab === 'activeDonations' && donorId) {
      fetchActiveDonations();
    }
  }, [selectedMainTab, donorId]);


  useEffect(() => {
    if (donorId) {
      fetchActiveDonations();
      fetchDonationsByStatus('pending');
      fetchDonationsByStatus('rejected');
      fetchDonationsByStatus('completed');
    }
  }, [donorId]);

  // 
  const fetchAllFoodItems = () => {
    setFoodItemsLoading(true);
    setApiError(null);

    console.log('Fetching all food items...');

    fetch(`${API_BASE_URL}/api/donor/food-items/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Total food items received:', data.length);
        console.log('Food items data:', data);

        const formattedItems = data.map(item => ({
          ...item,
          img: item.imageBase64
            ? `data:${item.imageContentType || 'image/jpeg'};base64,${item.imageBase64}`
            : '/api/placeholder/400/200',
          storeName: item.storeName || 'Unknown Source',
          foodType: item.foodType || 'Unspecified',
          // Use remainingQuantity if available, otherwise fall back to quantity
          quantity: item.remainingQuantity !== undefined
            ? `${item.remainingQuantity} units`
            : `${item.quantity || 0} units`,
          remainingQuantity: item.remainingQuantity || 0,
          totalQuantity: item.totalQuantity || item.quantity || 0,
          expiryDate: item.expiryDate || 'Not specified',
          location: item.location || 'Unknown location'
        }));

        setAllFoodItems(formattedItems);
        setShouldShowFoodItems(true);
      })
      .catch(error => {
        console.error('Error in fetchAllFoodItems:', error);
        setApiError(`Failed to fetch food items: ${error.message}`);
      })
      .finally(() => {
        setFoodItemsLoading(false);
      });
  };

  useEffect(() => {
    if (donorId) {
      // Only fetch if donorId is not null
      fetchAllFoodItems();
    }
  }, [donorId]);

  useEffect(() => {
    // Always keep food items visible unless explicitly in donation form
    setShouldShowFoodItems(!showDonationForm);
  }, [showDonationForm]);

  // Password validation functions
  const validatePassword = (password) => {
    // Base requirements
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar,
      requirements: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasDigit,
        hasSpecialChar
      }
    };
  };

  // Add these state variables to manage password validation UI
  const [passwordValidation, setPasswordValidation] = useState({
    requirements: {
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      hasSpecialChar: false
    },
    isValid: false
  });

  // Add this function to handle password input changes with validation
  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;

    // Update the password form state
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate new password when it changes
    if (name === 'newPassword') {
      const validation = validatePassword(value);
      setPasswordValidation(validation);

      // Also validate confirmation match if it exists
      if (passwordForm.confirmPassword) {
        setPasswordsMatch(value === passwordForm.confirmPassword);
      }
    }

    // Check if passwords match when confirmation changes
    if (name === 'confirmPassword') {
      setPasswordsMatch(passwordForm.newPassword === value);
    }
  };
  //these functions to handle logout
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authUser');

    // Hide the confirmation modal
    setShowLogoutModal(false);

    // Show success message
    setLogoutSuccess(true);

    // Redirect after a short delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    // Ensure navigation is visible when component mounts
    setShowNavigation(true);

    // Your existing code for auth user retrieval
    const authUserFromLocal = localStorage.getItem('authUser');
    const authUserFromSession = sessionStorage.getItem('authUser');
    const authUser = authUserFromLocal
      ? JSON.parse(authUserFromLocal)
      : (authUserFromSession ? JSON.parse(authUserFromSession) : null);

    console.log('Auth user data retrieved:', authUser);

    if (authUser && authUser.userId) {
      // Set the donor ID from the stored auth data
      setDonorId(authUser.userId);
      console.log('Setting donor ID:', authUser.userId);

      // Populate basic profile info immediately from auth data
      setDonorProfile({
        firstName: authUser.firstName || '',
        lastName: authUser.lastName || '',
        email: authUser.email || '',
        // Set other fields to empty/default values until the full profile is loaded
        phone: '',
        bloodGroup: '',
        birthdate: '',
        address: '',
        addressDescription: '',
        bio: '',
        userPhotoBase64: null,
        photoContentType: 'image/jpeg'
      });
    } else {
      console.error('No authenticated user found in storage');
      // Potentially redirect to login page if no auth data found
      // window.location.href = '/login';
    }
  }, []);

  // Add this useEffect after the first one
  useEffect(() => {
    if (donorId) {
      console.log('Donor ID changed, fetching profile data...');
      fetchDonorProfile();
    }
  }, [donorId]);


  useEffect(() => {
    console.log('Food Items Visibility State:', {
      showDonationForm,
      shouldShowFoodItems,
      donationStep
    });
  }, [showDonationForm, shouldShowFoodItems, donationStep]);


  const fetchDonorProfile = async () => {
    // Only proceed if we have a valid donorId
    if (!donorId) {
      console.error('Attempted to fetch profile without a donor ID');
      return;
    }

    console.log('Fetching profile for donor ID:', donorId);
    console.log('API URL:', `${API_BASE_URL}/api/donor/profile/${donorId}`);

    setProfileLoading(true);
    setProfileUpdateError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/donor/profile/${donorId}`);

      console.log('Response status:', response.status);

      if (!response.ok) {
        // Try to get more detailed error info
        const errorText = await response.text();
        console.error('Error response body:', errorText);

        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Profile data fetched (raw):', data);

      // Log each property to see what's being returned
      Object.keys(data).forEach(key => {
        console.log(`Profile property ${key}:`, key === 'userPhotoBase64' ? '[PHOTO DATA]' : data[key]);
      });

      if (data) {
        setDonorProfile(data);
      } else {
        setProfileUpdateError('No profile data returned from server');
      }
    } catch (error) {
      console.error('Error fetching donor profile:', error);
      setProfileUpdateError(error.message || 'Failed to load profile data');
    } finally {
      setProfileLoading(false);
    }
  };

  // Add this function to fetch profile without LOB data
  const fetchProfileWithoutLobData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donor/profile/${donorId}/basic`);

      if (!response.ok) {
        throw new Error(`Failed to fetch basic profile: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Basic profile data fetched:', data);

      if (data) {
        setDonorProfile(data);
      } else {
        setProfileUpdateError('No basic profile data returned from server');
      }
    } catch (error) {
      console.error('Error fetching basic donor profile:', error);
      setProfileUpdateError(error.message || 'Failed to load basic profile data');
    } finally {
      setProfileLoading(false);
    }
  };

  // Function to handle profile form submission
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileUpdateError('');
    setProfileUpdateSuccess('');

    // Get form data from the event
    const formData = new FormData(e.target);

    try {

      const response = await fetch(`${API_BASE_URL}/api/donor/profile/${donorId}`, {
        method: 'PUT',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setDonorProfile(data.donor);
        setProfileUpdateSuccess('Profile updated successfully');
        setShowProfileForm(false);
      } else {
        setProfileUpdateError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileUpdateError(error.message || 'An error occurred while updating profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchPendingDonations = () => {
    setApiLoading(true);
    setApiError(null);

    console.log(`Fetching pending donations for donor ID: ${donorId}`);

    fetch(`${API_BASE_URL}/api/donor/donations/pending?donorId=${donorId}`)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            console.error('Error response body:', text);
            throw new Error(`Failed to fetch pending donations: ${response.statusText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Pending donations received:', data);

        if (!Array.isArray(data)) {
          console.warn('Received non-array data:', data);
          return;
        }

        const formattedDonations = data.map(donation => ({
          id: donation.id,
          foodName: donation.foodName,
          category: donation.category?.label || donation.category,
          quantity: donation.quantity,
          expiry: donation.expiryDate,
          location: donation.location,
          donorType: donation.donorType,
          status: donation.status,
          preparation: donation.preparationDate,
          packaging: donation.packaging || 'Not specified',
          dietaryInfo: Array.isArray(donation.dietaryInfo) ? donation.dietaryInfo.join(', ') : 'Not specified',
          storageInstructions: donation.storageInstructions || 'Not specified',
          imageUrl: donation.imageData ?
            `data:${donation.imageContentType || 'image/jpeg'};base64,${donation.imageData}`
            : '/api/placeholder/400/200'
        }));

        setPendingDonations(formattedDonations);
      })
      .catch(error => {
        console.error('Error fetching pending donations:', error);
        setApiError(`Failed to fetch pending donations: ${error.message}`);
      })
      .finally(() => {
        setApiLoading(false);
      });
  };


  const handleMarkAsCompleted = async (donationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donor/donations/${donationId}/mark-completed?donorId=${donorId}`, {
        method: 'GET'
      });

      // Parse the response body
      const responseData = await response.json();

      // Check if the response is not okay
      if (!response.ok) {
        // Throw an error with the message from the server or a default message
        throw new Error(responseData.message || 'Failed to mark donation as completed');
      }

      // Show success message
      alert('Donation marked as completed successfully');

      // Refresh donation lists
      await fetchDonationsByStatus('pending');
      await fetchDonationsByStatus('completed');
    } catch (error) {
      console.error('Error marking donation as completed:', error);

      // Check if error has a response body
      if (error.response) {
        try {
          const errorBody = await error.response.json();
          alert(errorBody.message || 'Failed to mark donation as completed');
        } catch {
          alert('Failed to mark donation as completed');
        }
      } else {
        // If it's a network error or other type of error
        alert(error.message || 'Failed to mark donation as completed');
      }

      // Optional: Log the full error for debugging
      console.error('Full error details:', error);
    }
  };

  // Function to handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validate before submission
    if (!passwordValidation.isValid) {
      setProfileUpdateError('Password does not meet security requirements');
      return;
    }

    if (!passwordsMatch) {
      setProfileUpdateError('New passwords do not match');
      return;
    }

    setProfileLoading(true);
    setProfileUpdateError('');
    setProfileUpdateSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/donor/profile/${donorId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setProfileUpdateSuccess('Password updated successfully');
        setShowPasswordForm(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Reset validation state
        setPasswordValidation({
          requirements: {
            minLength: false,
            hasUpperCase: false,
            hasLowerCase: false,
            hasDigit: false,
            hasSpecialChar: false
          },
          isValid: false
        });
      } else {
        setProfileUpdateError(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setProfileUpdateError(error.message || 'An error occurred while changing password');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleViewDetails = async (food) => {
    try {
      const response = await fetch(`${API_BASE_URL || ''}/api/donor/food-items/${food.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch food item details');
      }

      const itemData = await response.json();
      setSelectedFoodDetails(itemData);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching food item details:', error);
      setApiError(error.message);
    }
  };


  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedFoodDetails(null);
  };

  const closeDonateModal = () => {
    setShowDonateModal(false);
  };

  const proceedToDonation = () => {
    setShowDonateModal(false);
    setDonationStep(3);
  };
  const renderFoodSelection = () => {
    const foods = selectedCategory === 'restaurant'
      ? availableRestaurantFoods
      : availableGroceryItems;

    const title = selectedCategory === 'restaurant'
      ? 'Select Restaurant Food'
      : 'Select Grocery Items';

    return (
      <div className="donation-flow-container food-selection">
        <div className="donation-flow-header">
          <button className="btn-back" onClick={goBack}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="donation-flow-title">{title}</h2>
          <button className="btn-close" onClick={cancelDonation}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="food-selection-search">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search available items..."
            className="food-search-input"
          />
        </div>

        {apiLoading && (
          <div className="loading-indicator">
            <span className="loading-spinner"></span>
            <span>Loading available items...</span>
          </div>
        )}

        {apiError && (
          <div className="error-message">
            <AlertCircle className="h-4 w-4" />
            <span>{apiError}</span>
          </div>
        )}

        {!apiLoading && foods.length === 0 && !apiError && (
          <div className="no-items-message">
            No items available in this category
          </div>
        )}

        <div className="food-selection-grid">
          {foods.map(food => (
            <FoodSelectionCard
              key={food.id}
              food={food}
              onSelect={selectFood}
              onViewDetails={handleViewDetails}
              onDonate={handleDonate}
            />
          ))}
        </div>

        {/* Enhanced Details Modal */}
        {/* Enhanced Details Modal - More Compact */}
        {showDetailsModal && selectedFoodDetails && (
          <div className="modal-overlay">
            <div className="details-modal">
              <div className="modal-header">
                <h3 className="modal-title">Food Item Details</h3>
              </div>

              <div className="modal-body">
                <div className="food-details-container">
                  <div className="food-details-header-compact">
                    <div className="food-details-image-container">
                      <img
                        className="food-details-image-compact"
                        src={selectedFoodDetails.imageBase64
                          ? `data:${selectedFoodDetails.imageContentType || 'image/jpeg'};base64,${selectedFoodDetails.imageBase64}`
                          : '/api/placeholder/300/200'}
                        alt={selectedFoodDetails.name}
                      />
                    </div>
                    <div className="food-details-title-section">
                      <h2 className="food-details-title-compact">{selectedFoodDetails.name}</h2>
                      <div className="food-details-key-info">
                        <span className="food-info-badge type">
                          {selectedFoodDetails.foodType || 'Not specified'}
                        </span>
                        <span className="food-info-badge price">
                          {selectedFoodDetails.price ? `৳${selectedFoodDetails.price}` : 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="food-details-grid-compact">
                    <div className="food-details-item-compact">
                      <div className="food-details-label">Available Quantity</div>
                      <div className="food-details-value">{selectedFoodDetails.quantity} units</div>
                    </div>

                    <div className="food-details-item-compact">
                      <div className="food-details-label">Expiry Date</div>
                      <div className="food-details-value">
                        {selectedFoodDetails.expiryDate}
                      </div>
                    </div>

                    <div className="food-details-item-compact">
                      <div className="food-details-label">Store/Restaurant</div>
                      <div className="food-details-value">{selectedFoodDetails.storeName || 'Not specified'}</div>
                    </div>

                    <div className="food-details-item-compact">
                      <div className="food-details-label">Location</div>
                      <div className="food-details-value">{selectedFoodDetails.location || 'Not specified'}</div>
                    </div>

                    <div className="food-details-item-compact">
                      <div className="food-details-label">Food Prepared Time</div>
                      <div className="food-details-value">{selectedFoodDetails.deliveryTime || 'Not specified'}</div>
                    </div>

                    <div className="food-details-item-compact">
                      <div className="food-details-label">Dietary Information</div>
                      <div className="food-details-value">
                        {selectedFoodDetails.dietaryInfo && selectedFoodDetails.dietaryInfo.length > 0
                          ? selectedFoodDetails.dietaryInfo.join(', ')
                          : 'Not specified'}
                      </div>
                    </div>
                  </div>

                  {selectedFoodDetails.description && (
                    <div className="food-details-description-compact">
                      <span className="food-details-description-label">Description</span>
                      <p className="food-details-description-text">
                        {selectedFoodDetails.description || 'No description available'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={closeDetailsModal}>
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Donate Gateway Modal */}
        {showDonateModal && selectedFood && (
          <div className="modal-overlay">
            <div className="donate-modal">
              <div className="modal-header">
                <h3 className="modal-title">Donate Food Item</h3>
                <button className="btn-close" onClick={closeDonateModal}>
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="modal-body">
                <div className="food-details-container">
                  <div className="food-details-header">
                    <img
                      className="food-details-image"
                      src={selectedFood.img || '/api/placeholder/800/400'}
                      alt={selectedFood.name}
                    />
                    <div className="food-details-title-container">
                      <h2 className="food-details-title">{selectedFood.name}</h2>
                    </div>
                  </div>

                  <div className="food-details-content">
                    <div className="donate-message">
                      You are about to donate this food item. You can modify details in the next step.
                    </div>

                    <div className="food-details-grid">
                      <div className="food-details-item">
                        <div className="food-details-label">Type</div>
                        <div className="food-details-value">{selectedFood.cuisine || selectedFood.type}</div>
                      </div>

                      <div className="food-details-item">
                        <div className="food-details-label">From</div>
                        <div className="food-details-value">{selectedFood.restaurant || selectedFood.store}</div>
                      </div>

                      <div className="food-details-item">
                        <div className="food-details-label">Quantity</div>
                        <div className="food-details-value">{selectedFood.quantity}</div>
                      </div>

                      <div className="food-details-item">
                        <div className="food-details-label">Price</div>
                        <div className="food-details-value">
                          {selectedFood.price ? `৳${selectedFood.price}` : 'Free'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={closeDonateModal}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={proceedToDonation}>
                  <CheckCircle className="h-4 w-4" />
                  Proceed to Donation Form
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  // Form state
  const [donationForm, setDonationForm] = useState({
    foodName: '',
    category: '',
    quantity: '',
    expiry: '',
    location: '',
    description: '',
    donorType: '',
    preparation: '',
    dietaryInfo: [],
    packaging: '',
    storageInstructions: '',
    image: null,
    // Restaurant specific fields
    cuisineType: '',
    servedTime: '',
    temperatureRequirements: '',
    // Homemade food specific fields
    ingredients: '',
    servingSize: '',
    // Corporate donation specific fields
    eventName: '',
    corporateName: '',
    contactPerson: '',
    // Grocery specific fields
    productType: '',
    brandName: '',
    bestBeforeDate: '',
    // Purchased food specific fields
    purchaseDate: '',
    purchaseSource: '',
    // Original food item ID if created from a food item
    originalFoodItemId: null
  });


  // Social media platforms
  const socialPlatforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      color: 'bg-blue-600 text-white'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      color: 'bg-pink-600 text-white'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      color: 'bg-sky-500 text-white'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <Image className="h-5 w-5" />, // Using Image as placeholder for WhatsApp
      color: 'bg-green-600 text-white'
    }
  ];


  // Form helpers
  const handleFormChange = (field, value) => {
    setDonationForm({
      ...donationForm,
      [field]: value
    });
  };
  //
  const handleSubmit = (e) => {
    e.preventDefault();
    setApiLoading(true);
    setApiError(null);

    // Create a FormData object for multipart/form-data submission
    const formData = new FormData();

    // Map frontend field names to backend expectations
    const fieldMapping = {
      'expiry': 'expiryDate',
      'preparation': 'preparationDate'
    };

    // Add all form fields to FormData
    Object.keys(donationForm).forEach(key => {
      if (donationForm[key] !== null && donationForm[key] !== undefined) {
        // Handle date fields that need special formatting
        if (key === 'expiry' || key === 'preparation') {
          // Check if this is a datetime-local value (contains 'T')
          if (donationForm[key] && donationForm[key].includes('T')) {
            // Extract just the date part for fields that expect YYYY-MM-DD
            const dateValue = donationForm[key].split('T')[0];
            formData.append(fieldMapping[key] || key, dateValue);
          } else if (donationForm[key]) {
            // If it's already a date string, use it directly
            formData.append(fieldMapping[key] || key, donationForm[key]);
          }
        }
        // Handle dietaryInfo array
        else if (key === 'dietaryInfo' && Array.isArray(donationForm[key])) {
          donationForm[key].forEach(item => {
            formData.append('dietaryInfo', item);
          });
        }
        // Skip image (handled separately below)
        else if (key !== 'image') {
          // Use mapped field name if it exists, otherwise use the original key
          const backendKey = fieldMapping[key] || key;
          formData.append(backendKey, donationForm[key]);
        }
      }
    });

    formData.append('donorId', donorId);

    // Handle image upload
    if (donationForm.image) {
      formData.append('image', donationForm.image);
    }

    // Debug the form data being sent
    console.log('Sending donation data:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    // Ensure API base URL is used for the request
    const apiUrl = `${API_BASE_URL || 'http://localhost:8080'}/api/donor/donations`;
    console.log('Submitting donation to:', apiUrl);

    // Send the data to the API
    fetch(apiUrl, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          // Try to get more detailed error information from the response
          return response.text().then(text => {
            console.error('Server response:', text);
            throw new Error('Failed to create donation: ' + (text || response.statusText));
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Donation created successfully:', data);

        // Show success message to user
        alert('Donation created successfully!');

        // Reset the donation flow
        setDonationStep(0);
        setSelectedCategory('');
        setSelectedFood(null);

        // Add a slight delay before refreshing to ensure the server has processed the new donation
        setTimeout(() => {
          console.log('Refreshing active donations after creation...');
          fetchActiveDonations();
        }, 1000);
      })
      .catch(error => {
        console.error('Error creating donation:', error);
        setApiError(error.message);

        // Show error to user
        alert(error.message || 'Failed to create donation. Please try again.');
      })
      .finally(() => {
        setApiLoading(false);
      });
  };
  //
  const startDonation = () => {
    setDonationStep(3); // Directly go to donation form
    setShowDonationForm(true);
    setShouldShowFoodItems(false);

    // Reset donation form to default state with a clean slate
    setDonationForm({
      foodName: '',
      category: '', // Dropdown for category selection
      quantity: '',
      expiry: '',
      location: '',
      description: '',
      donorType: '',
      preparation: '',
      dietaryInfo: '',
      packaging: '',
      storageInstructions: '',
      image: null,

      // Category-specific fields reset
      cuisineType: '',
      servedTime: '',
      temperatureRequirements: '',
      ingredients: '',
      servingSize: '',
      eventName: '',
      corporateName: '',
      contactPerson: '',
      productType: '',
      brandName: '',
      bestBeforeDate: '',
      purchaseDate: '',
      purchasedFoodType: '',
      purchaseSource: '',
      purchasePackaging: ''
    });

    // Reset any related state
    setSelectedCategory('');
    setSelectedFood(null);
  };

  const DashboardFoodItems = ({ items, onDonate, onViewDetails }) => (
    <div className="dashboard-food-items-container">
      <h2 className="section-title">
        <Package className="h-5 w-5 mr-2" />
        Available Food Items
      </h2>

      {foodItemsLoading && (
        <div className="loading-indicator">
          <span className="loading-spinner"></span>
          <span>Loading food items...</span>
        </div>
      )}

      {apiError && (
        <div className="error-message">
          <AlertCircle className="h-4 w-4" />
          <span>{apiError}</span>
        </div>
      )}

      <div className="dashboard-food-grid">
       // In the DashboardFoodItems component, enhance the food item card rendering
        {items.map(item => {
          // Extract quantity from string (e.g., "5 units" -> 5)
          const quantityMatch = item.quantity.match(/\d+/);
          const totalQuantity = quantityMatch ? parseInt(quantityMatch[0], 10) : 0;

          // Get remaining quantity (default to total if not specified)
          const remainingQuantity = item.remainingQuantity !== undefined ?
            item.remainingQuantity : totalQuantity;

          // Calculate percentage of remaining quantity
          const remainingPercentage = totalQuantity > 0 ?
            (remainingQuantity / totalQuantity) * 100 : 0;

          // Determine if item is available (has remaining quantity)
          const isAvailable = remainingQuantity > 0;

          return (
            <div
              key={item.id}
              className={`dashboard-food-card ${!isAvailable ? 'sold-out' : ''}`}
            >
              <div className="food-item-image">
                <img src={item.img} alt={item.name} />
                {!isAvailable && (
                  <div className="sold-out-overlay">
                    <span>Sold Out</span>
                  </div>
                )}
              </div>
              <div className="food-item-content">
                <h3 className="food-item-title">{item.name}</h3>
                <div className="food-item-details">
                  <span className="food-item-source">{item.storeName}</span>
                  <span className="food-item-type">{item.foodType}</span>
                </div>
                <div className="food-item-meta">
                  <div className="food-item-meta-row">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Expires: {item.expiryDate}</span>
                  </div>
                  <div className="food-item-meta-row">
                    <Package className="h-4 w-4 text-green-500" />
                    <span>Quantity: {remainingQuantity} / {totalQuantity}</span>
                  </div>
                  <div className="food-item-availability">
                    <div className="availability-bar-bg">
                      <div
                        className="availability-bar-fill"
                        style={{ width: `${remainingPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="food-item-actions">
                  <button
                    className="btn-view-details"
                    onClick={() => onViewDetails(item)}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Details</span>
                  </button>
                  <button
                    className="btn-donate flex-1 flex items-center justify-center gap-2 bg-primary dark:bg-primary-dark text-white py-2 px-3 rounded-md hover:bg-primary-hover dark:hover:bg-primary transition-colors"
                    onClick={() => handleDonate(item)}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Donate</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {items.length === 0 && !foodItemsLoading && !apiError && (
          <div className="no-items-message">
            <Package className="h-8 w-8 text-gray-300" />
            <span>No food items available</span>
          </div>
        )}
      </div>
    </div>
  );

  const PurchaseHistorySection = ({ purchases, loading, error }) => {
    if (loading) {
      return (
        <div className="purchase-history-loading">
          <span className="loading-spinner"></span>
          <span>Loading purchase history...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="purchase-history-error">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      );
    }

    if (!purchases || purchases.length === 0) {
      return (
        <div className="purchase-history-empty">
          <Package className="h-12 w-12 text-gray-300" />
          <h3>No Purchase History</h3>
          <p>You haven't made any purchases for donation yet</p>
        </div>
      );
    }

    return (
      <div className="purchase-history-container">
        <h2 className="purchase-history-title">
          <Receipt className="h-5 w-5 mr-2" />
          Your Purchase History
        </h2>

        <div className="purchase-history-grid">
          {purchases.map(purchase => (
            <div key={purchase.id} className="purchase-card">
              <div className="purchase-header">
                <div className="purchase-id">
                  Order #{purchase.id}
                </div>
                <div className={`purchase-status ${purchase.saleStatus.toLowerCase()}`}>
                  {purchase.saleStatus}
                </div>
              </div>

              <div className="purchase-details">
                <div className="purchase-detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {new Date(purchase.saleDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="purchase-detail-row">
                  <span className="detail-label">Quantity:</span>
                  <span className="detail-value">{purchase.quantitySold}</span>
                </div>
                <div className="purchase-detail-row">
                  <span className="detail-label">Total:</span>
                  <span className="detail-value">৳{purchase.totalAmount}</span>
                </div>
                <div className="purchase-detail-row">
                  <span className="detail-label">Payment:</span>
                  <span className="detail-value">{purchase.paymentMethod}</span>
                </div>
              </div>

              <div className="purchase-actions">
                <button className="btn-view-donation">
                  <Eye className="h-4 w-4" />
                  <span>View Donation</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleDirectDonate = (food) => {
    setSelectedFood(food);

    // Set donation step to form (step 3) and show the form
    setDonationStep(3);
    setShowDonationForm(true);

    // Pre-fill the donation form with food item details
    setDonationForm({
      foodName: food.name,
      quantity: food.quantity.toString(),
      // Set appropriate category based on food type if available
      category: food.foodType?.includes('Restaurant') ? 'RESTAURANT_SURPLUS' : 'GROCERY_EXCESS',
      donorType: food.foodType?.includes('Restaurant') ? 'Restaurant' : 'Grocery Store',
      cuisineType: food.foodType || '',
      description: food.description || '',
      expiry: food.expiryDate || '',
      location: food.location || '',
      corporateName: food.storeName || '',
      originalFoodItemId: food.id
    });
  };

  // 6. Create a component to display all food items in a card view
  const AllFoodItemsView = ({ items, onDonate, onViewDetails, onClose }) => (
    <div className="all-food-items-overlay">
      <div className="all-food-items-container">
        <div className="all-food-items-header">
          <h2 className="all-food-items-title">
            <Package className="h-5 w-5 mr-2" />
            Available Food Items
          </h2>
          <div className="all-food-items-actions">
            <button className="btn-close" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {foodItemsLoading && (
          <div className="loading-indicator">
            <span className="loading-spinner"></span>
            <span>Loading food items...</span>
          </div>
        )}

        {apiError && (
          <div className="error-message">
            <AlertCircle className="h-4 w-4" />
            <span>{apiError}</span>
          </div>
        )}

        <div className="food-items-search">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search available items..."
            className="food-search-input"
          />
        </div>

        <div className="food-items-grid">
          {items.map(item => (
            <div key={item.id} className="food-item-card">
              <div className="food-item-image">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="food-item-content">
                <h3 className="food-item-title">{item.name}</h3>
                <div className="food-item-details">
                  <span className="food-item-source">{item.storeName}</span>
                  <span className="food-item-type">{item.foodType}</span>
                </div>
                <div className="food-item-meta">
                  <div className="food-item-meta-row">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Expires: {item.expiryDate}</span>
                  </div>
                  <div className="food-item-meta-row">
                    <Package className="h-4 w-4 text-green-500" />
                    <span>Quantity: {item.quantity}</span>
                  </div>
                  <div className="food-item-meta-row">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span>{item.location}</span>
                  </div>
                </div>
                <div className="food-item-actions">
                  <button
                    className="btn-view-details"
                    onClick={() => onViewDetails(item)}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Details</span>
                  </button>
                  <button
                    className="btn-donate"
                    onClick={() => onDonate(item)}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Donate</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && !foodItemsLoading && !apiError && (
          <div className="no-items-message">
            <Package className="h-8 w-8 text-gray-300" />
            <span>No food items available</span>
          </div>
        )}
      </div>
    </div>
  );

  const selectFood = async (food) => {
    setSelectedFood(food);
    setDonationStep(3);

    try {
      const response = await fetch(`http://localhost:8080/api/donor/food-items/${food.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch food item details');
      }

      const itemData = await response.json();

      setDonationForm({
        ...donationForm,
        foodName: itemData.name,
        quantity: itemData.quantity.toString(),
        category: selectedCategory === 'restaurant'
          ? 'RESTAURANT_SURPLUS'  // Use enum name instead of display label
          : 'GROCERY_EXCESS',
        donorType: selectedCategory === 'restaurant' ? 'Restaurant' : 'Grocery Store',
        cuisineType: itemData.foodType || '',
        productType: itemData.foodType || '',
        description: itemData.description || '',
        expiryDate: itemData.expiryDate || '',
        location: itemData.location || '',
        corporateName: itemData.storeName || '',
        dietaryInfo: itemData.dietaryInfo || [],
        originalFoodItemId: itemData.id,
        imageBase64: itemData.imageBase64
      });
    } catch (error) {
      console.error('Error fetching food item details:', error);
      setApiError(error.message);
    }
  };

  const goBack = () => {
    if (donationStep === 3) {
      // If we're on the form step
      if (selectedCategory === 'restaurant' || selectedCategory === 'grocery') {
        // For restaurant/grocery, go back to food selection (step 2)
        setDonationStep(2);
      } else {
        // Exit the donation flow entirely
        setDonationStep(0);
      }
    } else {
      // Exit the donation flow entirely
      setDonationStep(0);
    }
  };


  const cancelDonation = () => {
    setDonationStep(0);
    setSelectedCategory('');
    setSelectedFood(null);
    setShowDonationForm(false);
    setTimeout(() => {
      setShouldShowFoodItems(true);
      fetchAllFoodItems();
    }, 100);
  };


  const toggleHistoryPanel = () => {
    setShowHistoryPanel(!showHistoryPanel);
  };

  const deleteHistoryItem = (id) => {

    console.log(`Delete history item with ID: ${id}`);
    // Implement actual deletion logic here
  };

  // Delete all history
  const deleteAllHistory = () => {
    // This would clear all history in a real application
    console.log('Delete all history');
    // Implement actual deletion logic here
  };

  const handleProfileManagement = () => {
    console.log('Profile Management clicked');
    setSelectedMainTab('profile');
    // Implementation for profile management
  };


  // Component for stats cards
  const StatsCard = ({ icon: Icon, value, label, color }) => (
    <div className="stats-card">
      <div className={`stats-icon ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="stats-content">
        <div className="stats-value">{value}</div>
        <div className="stats-label">{label}</div>
      </div>
    </div>
  );

  // Need to define these icons since they were used but not imported
  const Eye = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const Edit = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  // Component for donation cards
  const DonationCard = ({ donation }) => (
    <div className="donation-card">
      <div className="donation-header">
        <div className="donation-title-wrapper">
          <div className={`donor-type-icon ${donation.donorType === 'Restaurant' ? 'bg-orange-100' :
            donation.donorType === 'Individual' ? 'bg-blue-100' :
              'bg-purple-100'
            }`}>
            {donation.donorType === 'Restaurant' ? <ChefHat className="h-4 w-4 text-orange-600" /> :
              donation.donorType === 'Individual' ? <User className="h-4 w-4 text-blue-600" /> :
                <Building2 className="h-4 w-4 text-purple-600" />}
          </div>
          <div>
            <p className="donation-category">{donation.category}</p>
          </div>
        </div>
        <span className="donation-quantity">{donation.quantity}</span>
      </div>

      <div className="donation-image-container">
        <img
          src={donation.imageData
            ? `data:${donation.imageContentType || 'image/jpeg'};base64,${donation.imageData}`
            : (donation.imageUrl || '/api/placeholder/400/200')}
          alt={donation.foodName}
          className="donation-image"
        />
        <div className={`status-badge ${donation.status.toLowerCase()}`}>
          {donation.status}
        </div>
      </div>

      <div className="donation-info-grid">
        <div className="info-item">
          <Clock className="h-4 w-4 text-blue-500" />
          <span>Expires: {new Date(donation.expiry).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}</span>
        </div>
        <div className="info-item">
          <MapPin className="h-4 w-4 text-red-500" />
          <span>{donation.location}</span>
        </div>
      </div>

      <div className="donation-details-panel">
        <div className="details-row">
          <div className="detail-item">
            <span className="detail-label">Preparation:</span>
            <span className="detail-value">{donation.preparation}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Packaging:</span>
            <span className="detail-value">{donation.packaging}</span>
          </div>
        </div>
        <div className="details-row">
          <div className="detail-item">
            <span className="detail-label">Dietary:</span>
            <span className="detail-value">{donation.dietaryInfo}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Storage:</span>
            <span className="detail-value">{donation.storageInstructions}</span>
          </div>
        </div>
      </div>

      <div className="donation-actions">
        <button className="btn-view-details" onClick={() => viewRequestDetails(donation)}>
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </button>
        <button className="btn-edit">
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </button>
      </div>
    </div>
  );

  // Component for request cards
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donor/food-requests/${requestId}/accept?donorId=${donorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to accept request: ${errorText || response.statusText}`);
      }

      // Refresh the requests list after successful action
      alert('Request accepted successfully');
      fetchFoodRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
      alert(`Failed to accept request: ${error.message}`);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donor/food-requests/${requestId}/decline?donorId=${donorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to decline request: ${errorText || response.statusText}`);
      }

      // Refresh the requests list after successful action
      alert('Request declined successfully');
      fetchFoodRequests();
    } catch (error) {
      console.error('Error declining request:', error);
      alert(`Failed to decline request: ${error.message}`);
    }
  };

  const handleContactRequester = (request) => {
    // This function would handle contacting the requester
    // Could open a chat dialog, show contact info, etc.
    alert(`Contact ${request.requesterName} regarding their request`);
  };

  const fetchFoodRequests = async () => {
    setFoodRequestsLoading(true);
    setFoodRequestsError(null);

    try {
      // Call the backend API endpoint for food requests
      // This could be all requests or filtered by some criteria
      const response = await fetch(`${API_BASE_URL}/api/donor/food-requests`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch food requests: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log('Food requests data:', data);

      // Transform the backend data to match the format expected by the UI
      const formattedRequests = data.map(request => ({
        id: request.id,
        requesterName: request.receiverName || 'Anonymous',
        requestDate: new Date(request.requestedAt).toLocaleString(),
        status: request.requestStatus,
        distance: request.location || '', // If distance is available in the backend
        people: request.peopleCount,
        foodName: request.foodTypes.length > 0 ? request.foodTypes[0] : 'Food Request',
        donorName: 'John Doe', // This might come from the session or additional API call
        urgency: request.priority || 'Medium',
        notes: request.notes || 'No additional notes',
        location: request.location,
        deliveryPreference: request.deliveryPreference,
        recipients: request.recipients,
        specificDate: request.specificDate,
        specificTime: request.specificTime,
        userId: request.userId,
        imageUrl: request.imageData
          ? `data:${request.imageContentType || 'image/jpeg'};base64,${request.imageData}`
          : '/api/placeholder/400/200'
      }));

      setFoodRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching food requests:', error);
      setFoodRequestsError(error.message);
    } finally {
      setFoodRequestsLoading(false);
    }
  };

  // 3. Call this function when the component mounts or when the tab is selected
  useEffect(() => {
    if (selectedMainTab === 'requests' && donorId) {
      fetchFoodRequests();
    }
  }, [selectedMainTab, donorId]);

  const RequestCard = ({ request }) => (
    <div className="request-card">
      <div className="request-card-header">
        <div className="request-meta-info">
          <Clock3 className="h-4 w-4 text-gray-500" />
          <span className="request-date">{request.requestDate}</span>
        </div>
        <div className={`request-status ${request.status.toLowerCase()}`}>
          {request.status}
        </div>
      </div>

      <div className="request-card-body">
        <div className="request-details-grid">
          <div className="detail-group">
            <span className="detail-label">Food:</span>
            <span className="detail-value">{request.foodName}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Requested Time:</span>
            <span className="detail-value">{request.requestDate}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Requested By:</span>
            <span className="detail-value">{request.requesterName}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">People:</span>
            <span className="detail-value">{request.people}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{request.location}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Delivery:</span>
            <span className="detail-value">{request.deliveryPreference}</span>
          </div>
          {request.specificDate && (
            <div className="detail-group">
              <span className="detail-label">Date Needed:</span>
              <span className="detail-value">{request.specificDate}</span>
            </div>
          )}
          {request.specificTime && (
            <div className="detail-group">
              <span className="detail-label">Time Needed:</span>
              <span className="detail-value">{request.specificTime}</span>
            </div>
          )}
        </div>

        <div className="urgency-indicator">
          <span className={`urgency-badge ${request.urgency.toLowerCase()}`}>
            {request.urgency} Priority
          </span>
        </div>

        {request.imageUrl && (
          <div className="request-image-container">
            <img src={request.imageUrl} alt="Request" className="request-image" />
          </div>
        )}

        <div className="notes-container">
          <h4 className="notes-heading">Notes:</h4>
          <p className="notes-content">{request.notes}</p>
        </div>

        <div className="recipients-container">
          <h4 className="recipients-heading">Recipients:</h4>
          <div className="recipients-list">
            {request.recipients && request.recipients.map((recipient, index) => (
              <span key={index} className="recipient-tag">{recipient}</span>
            ))}
          </div>
        </div>

        <div className="request-actions-row">
          {request.status === 'PENDING' && (
            <>
              <button className="btn-accept-request" onClick={() => handleAcceptRequest(request.id)}>
                <CheckCircle className="h-4 w-4" />
                <span>Accept Request</span>
              </button>
              <button className="btn-decline-request" onClick={() => handleDeclineRequest(request.id)}>
                <X className="h-4 w-4" />
                <span>Decline</span>
              </button>
            </>
          )}
          {request.status === 'ACCEPTED' && (
            <button className="btn-contact-requester" onClick={() => handleContactRequester(request)}>
              <User className="h-4 w-4" />
              <span>Contact Requester</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const DonationRequestModal = ({ request, onClose, onAccept, onDecline }) => {
    if (!request) return null;

    return (
      <div className="modal-overlay">
        <div className="donation-request-modal">
          <div className="modal-header">
            <h2 className="modal-title">Donation Request</h2>
            <button className="btn-close" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="modal-body">
            <div className="request-time">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{request.requestDate}</span>
            </div>

            <div className="request-details-grid">
              <div className="request-detail-column">
                <div className="request-detail-item">
                  <h3 className="detail-header">FOOD:</h3>
                  <p className="detail-value">{request.foodName}</p>
                </div>

                <div className="request-detail-item">
                  <h3 className="detail-header">PEOPLE:</h3>
                  <p className="detail-value">{request.people}</p>
                </div>
              </div>

              <div className="request-detail-column">
                <div className="request-detail-item">
                  <h3 className="detail-header">FROM:</h3>
                  <p className="detail-value">{request.requesterName}</p>
                </div>

                <div className="request-detail-item">
                  <h3 className="detail-header">DISTANCE:</h3>
                  <p className="detail-value">{request.location}</p>
                </div>
              </div>
            </div>

            <div className="priority-badge">
              <span className={`priority-indicator ${request.urgency.toLowerCase()}`}>
                {request.urgency.toUpperCase()} PRIORITY
              </span>
            </div>

            <div className="request-notes">
              <h3 className="notes-header">Notes:</h3>
              <p className="notes-content">{request.notes}</p>
            </div>

            {request.imageUrl && (
              <div className="request-image">
                <img src={request.imageUrl} alt="Request" />
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-accept" onClick={() => onAccept(request.id)}>
                <CheckCircle className="h-5 w-5" />
                <span>Accept Request</span>
              </button>
              <button className="btn-decline" onClick={() => onDecline(request.id)}>
                <X className="h-5 w-5" />
                <span>Decline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  {
    showRequestModal && selectedRequest && (
      <DonationRequestModal
        request={selectedRequest}
        onClose={() => setShowRequestModal(false)}
        onAccept={handleAcceptRequest}
        onDecline={handleDeclineRequest}
      />
    )
  }

  const HistoryItem = ({ item, onDelete }) => (
    <div className="history-item">
      <div className="history-item-content">
        <div className="history-item-header">
          <h4 className="history-item-title">{item.foodName}</h4>
          <span className="history-item-date">{item.donationDate}</span>
        </div>
        <div className="history-item-details">
          <span className="history-item-category">{item.category}</span>
          <span className="history-item-divider">•</span>
          <span className="history-item-received-by">Received by: {item.receivedBy}</span>
          <span className="history-item-divider">•</span>
          <span className="history-item-impact">Helped: {item.people} people</span>
        </div>
      </div>
      <button className="btn-delete-history-item" onClick={() => onDelete(item.id)}>
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );

  const FoodSelectionCard = ({ food, onSelect, onViewDetails, onDonate }) => (
    <div className="food-selection-card">
      <div className="food-selection-image">
        <img src={food.img} alt={food.name} />
      </div>
      <div className="food-selection-content">
        <h3 className="food-selection-title">{food.name}</h3>
        <div className="food-selection-meta">
          <span className="food-selection-type">
            {food.cuisine || food.type}
          </span>
          <span className="food-selection-price">
            {food.price ? `৳${food.price}` : 'Free'}
          </span>
        </div>
        <div className="food-selection-actions">
          <button
            className="btn-view-details"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(food);
            }}
          >
            <Eye className="h-4 w-4" />
            <span>Details</span>
          </button>
          <button
            className="btn-donate"
            onClick={(e) => {
              e.stopPropagation();
              onDonate(food);
            }}
          >
            <Heart className="h-4 w-4" />
            <span>Donate</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderDonationForm = () => (
    <div className="donation-flow-container donation-form-container bg-white dark:bg-gray-900">
      <div className="donation-flow-header bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button className="btn-back text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="donation-flow-title text-gray-900 dark:text-white">
          Self Food Donation Form
          {selectedFood && ` - ${selectedFood.name}`}
        </h1>
      </div>

      <form className="donation-form" onSubmit={handleSubmit}>
        <div className="form-sections bg-white dark:bg-gray-900">
          {/* Basic Food Information Section */}
          <div className="form-section border-b border-gray-200 dark:border-gray-700">
            <h3 className="section-title text-gray-900 dark:text-gray-100 flex items-center">
              <Package className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
              <span>Basic Food Information</span>
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label text-gray-700 dark:text-gray-300">Donation Category*</label>
                <select
                  className="form-select w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                  value={donationForm.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="HOMEMADE_FOOD">Homemade Food</option>
                  <option value="RESTAURANT_SURPLUS">Restaurant & Café Surplus</option>
                  <option value="CORPORATE_DONATION">Corporate & Office Donations</option>
                  <option value="GROCERY_EXCESS">Grocery Store Excess</option>
                  <option value="EVENT_LEFTOVER">Event & Wedding Leftovers</option>
                  <option value="PURCHASED_FOOD">Purchased Food for Donation</option>
                  <option value="BAKERY">Bakery Item</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label text-gray-700 dark:text-gray-300">Food Name*</label>
                <input
                  type="text"
                  className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                  value={donationForm.foodName}
                  onChange={(e) => handleFormChange('foodName', e.target.value)}
                  placeholder="Enter food name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label text-gray-700 dark:text-gray-300">Quantity*</label>
                <input
                  type="text"
                  className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                  value={donationForm.quantity}
                  onChange={(e) => handleFormChange('quantity', e.target.value)}
                  placeholder="e.g., 5 meals, 2kg"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label text-gray-700 dark:text-gray-300">Donor Type*</label>
                <input
                  type="text"
                  className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                  value={donationForm.donorType}
                  onChange={(e) => handleFormChange('donorType', e.target.value)}
                  placeholder="Restaurant, Individual, etc."
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  className="form-textarea w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                  value={donationForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Add any additional details about the food"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Dates & Storage Section */}
          <div className="form-section border-b border-gray-200 dark:border-gray-700">
            <h3 className="section-title text-gray-900 dark:text-gray-100 flex items-center">
              <Calendar className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
              <span>Dates & Storage</span>
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label text-gray-700 dark:text-gray-300">Expiry Date & Time*</label>
                <input
                  type="datetime-local"
                  className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                  value={donationForm.expiry}
                  onChange={(e) => handleFormChange('expiry', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label text-gray-700 dark:text-gray-300">Preparation Date*</label>
                <input
                  type="date"
                  className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                  value={donationForm.preparation}
                  onChange={(e) => handleFormChange('preparation', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label text-gray-700 dark:text-gray-300">Packaging</label>
                <input
                  type="text"
                  className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                  value={donationForm.packaging}
                  onChange={(e) => handleFormChange('packaging', e.target.value)}
                  placeholder="Plastic container, paper bag, etc."
                />
              </div>

              <div className="form-group">
                <label className="form-label text-gray-700 dark:text-gray-300">Storage Instructions</label>
                <input
                  type="text"
                  className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                  value={donationForm.storageInstructions}
                  onChange={(e) => handleFormChange('storageInstructions', e.target.value)}
                  placeholder="Refrigerate, keep at room temperature, etc."
                />
              </div>

              <div className="form-group">
                <label className="form-label text-gray-700 dark:text-gray-300">Dietary Information</label>
                <select
                  className="form-select w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                  multiple
                  value={Array.isArray(donationForm.dietaryInfo) ? donationForm.dietaryInfo : []}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    handleFormChange('dietaryInfo', selected);
                  }}
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="Dairy-Free">Dairy-Free</option>
                  <option value="Nut-Free">Nut-Free</option>
                  <option value="Halal">Halal</option>
                  <option value="Kosher">Kosher</option>
                </select>
                <small className="form-hint text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple options</small>
              </div>
            </div>
          </div>

          {/* Location & Image Section */}
          <div className="form-section border-b border-gray-200 dark:border-gray-700">
            <h3 className="section-title text-gray-900 dark:text-gray-100 flex items-center">
              <MapPin className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
              <span>Location & Image</span>
            </h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label text-gray-700 dark:text-gray-300">Location*</label>
                <input
                  type="text"
                  className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                  value={donationForm.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  placeholder="Enter pickup location"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label text-gray-700 dark:text-gray-300">Food Image</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="food-image"
                    className="file-input"
                    accept="image/*"
                    onChange={(e) => setDonationForm({
                      ...donationForm,
                      image: e.target.files[0]
                    })}
                  />
                  <label htmlFor="food-image" className="upload-area bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Upload className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                    <span className="upload-text text-gray-700 dark:text-gray-300">Click to upload or drag and drop</span>
                    <span className="upload-hint text-gray-500 dark:text-gray-400">PNG, JPG up to 5MB</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Category-Specific Fields */}
          {donationForm.category && (
            <div className="form-section">
              <h3 className="section-title text-gray-900 dark:text-gray-100 flex items-center">
                <Package className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" />
                <span>{getCategoryLabel(donationForm.category)} Specific Details</span>
              </h3>
              <div className="form-grid">
                {/* Restaurant Surplus Fields */}
                {donationForm.category === 'RESTAURANT_SURPLUS' && (
                  <>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Cuisine Type</label>
                      <input
                        type="text"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.cuisineType}
                        onChange={(e) => handleFormChange('cuisineType', e.target.value)}
                        placeholder="Italian, Chinese, etc."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Served Time</label>
                      <input
                        type="time"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.servedTime}
                        onChange={(e) => handleFormChange('servedTime', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Temperature Requirements</label>
                      <input
                        type="text"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.temperatureRequirements}
                        onChange={(e) => handleFormChange('temperatureRequirements', e.target.value)}
                        placeholder="Hot, Cold, Room Temperature"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Restaurant Name</label>
                      <input
                        type="text"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.corporateName}
                        onChange={(e) => handleFormChange('corporateName', e.target.value)}
                        placeholder="Restaurant name"
                      />
                    </div>
                  </>
                )}

                {/* Homemade Food Fields */}
                {donationForm.category === 'HOMEMADE_FOOD' && (
                  <>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Ingredients</label>
                      <textarea
                        className="form-textarea w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.ingredients}
                        onChange={(e) => handleFormChange('ingredients', e.target.value)}
                        placeholder="List main ingredients"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Serving Size</label>
                      <input
                        type="text"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.servingSize}
                        onChange={(e) => handleFormChange('servingSize', e.target.value)}
                        placeholder="e.g., 200g per serving"
                      />
                    </div>
                  </>
                )}

                {/* Corporate/Event Fields */}
                {(donationForm.category === 'CORPORATE_DONATION' || donationForm.category === 'EVENT_LEFTOVER') && (
                  <>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Event Name</label>
                      <input
                        type="text"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.eventName}
                        onChange={(e) => handleFormChange('eventName', e.target.value)}
                        placeholder="Conference, Wedding, etc."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Corporate/Organization Name</label>
                      <input
                        type="text"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.corporateName}
                        onChange={(e) => handleFormChange('corporateName', e.target.value)}
                        placeholder="Company or organization name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Contact Person</label>
                      <input
                        type="text"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.contactPerson}
                        onChange={(e) => handleFormChange('contactPerson', e.target.value)}
                        placeholder="Name of contact person"
                      />
                    </div>
                  </>
                )}

                {/* Grocery Fields */}
                {donationForm.category === 'GROCERY_EXCESS' && (
                  <>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Product Type</label>
                      <input
                        type="text"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.productType}
                        onChange={(e) => handleFormChange('productType', e.target.value)}
                        placeholder="Bread, Fruits, Vegetables, etc."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Brand Name</label>
                      <input
                        type="text"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.brandName}
                        onChange={(e) => handleFormChange('brandName', e.target.value)}
                        placeholder="Product brand if applicable"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Best Before Date</label>
                      <input
                        type="date"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.bestBeforeDate}
                        onChange={(e) => handleFormChange('bestBeforeDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Store Name</label>
                      <input
                        type="text"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.corporateName}
                        onChange={(e) => handleFormChange('corporateName', e.target.value)}
                        placeholder="Grocery store name"
                      />
                    </div>
                  </>
                )}

                {/* Purchased Food Fields */}
                {donationForm.category === 'PURCHASED_FOOD' && (
                  <>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Purchase Source</label>
                      <input
                        type="text"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.purchaseSource}
                        onChange={(e) => handleFormChange('purchaseSource', e.target.value)}
                        placeholder="Where the food was purchased"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-gray-700 dark:text-gray-300">Purchase Date</label>
                      <input
                        type="date"
                        className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                        value={donationForm.purchaseDate}
                        onChange={(e) => handleFormChange('purchaseDate', e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="form-actions bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="btn-cancel bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={cancelDonation}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit bg-primary dark:bg-primary-dark text-white hover:bg-primary-dark dark:hover:bg-primary transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Create Donation
          </button>
        </div>
      </form>
    </div>
  );

  const getCategoryLabel = (category) => {
    const categoryLabels = {
      'HOMEMADE_FOOD': 'Homemade Food',
      'RESTAURANT_SURPLUS': 'Restaurant & Café',
      'CORPORATE_DONATION': 'Corporate',
      'GROCERY_EXCESS': 'Grocery',
      'EVENT_LEFTOVER': 'Event',
      'PURCHASED_FOOD': 'Purchased Food'
    };
    return categoryLabels[category] || category;
  };

  const renderHistoryPanel = () => (
    <div className="donation-history-overlay">
      <div className="donation-history-container">
        <div className="donation-history-header">
          <h2 className="donation-history-title">
            <History className="h-5 w-5" />
            Donation History
          </h2>
          <div className="donation-history-actions">
            <button
              className="btn-delete-history"
              onClick={deleteAllHistory}
              title="Delete all history"
            >
              <Trash className="h-4 w-4" />
            </button>
            <button
              className="btn-close-history"
              onClick={toggleHistoryPanel}
              title="Close history"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="donation-history-content">
          {donationHistory.length > 0 ? (
            <div className="history-items-grid">
              {donationHistory.map(item => (
                <div key={item.id} className="history-item-card">
                  <div className="history-item-header">
                    <h3 className="history-item-title">{item.foodName}</h3>
                    <span className="history-item-date">{item.donationDate}</span>
                  </div>
                  <div className="history-item-body">
                    <div className="history-item-details">
                      <div className="history-item-detail-group">
                        <span className="history-item-label">Category</span>
                        <span className="history-item-value">{item.category}</span>
                      </div>
                      <div className="history-item-detail-group">
                        <span className="history-item-label">Received By</span>
                        <span className="history-item-value">{item.receivedBy}</span>
                      </div>
                    </div>
                    <div className="history-item-impact">
                      <div className="history-item-impact-icon">
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="history-item-impact-text">
                        Helped {item.people} people
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="history-empty-state">
              <History className="history-empty-state-icon" />
              <h3 className="history-empty-state-title">No Donation History</h3>
              <p className="history-empty-state-description">
                Your past donations will appear here once you start donating
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

const PurchaseDonateModal = ({ food, onClose, onSubmit }) => {
  const [quantity, setQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [useStoreAddress, setUseStoreAddress] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Calculate total price
  const unitPrice = parseFloat(food.price) || 0;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  // Initialize form data
  useEffect(() => {
    if (!food || !food.id) return;

    setLoading(true);
    
    // Get remaining quantity
    fetch(`${API_BASE_URL}/api/merchant/food-items/${food.id}/with-remaining`)
      .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch'))
      .then(data => {
        console.log('Food item remaining quantity data:', data);
        const remaining = data.remainingQuantity || data.foodItem?.remainingQuantity || 1;
        setMaxQuantity(remaining);
        setQuantity(Math.min(1, remaining));
        setDeliveryAddress(food.location || '');
        
        // Get customer info from auth
        const authUser = JSON.parse(localStorage.getItem('authUser') || sessionStorage.getItem('authUser') || '{}');
        if (authUser.firstName) {
          setCustomerName(`${authUser.firstName} ${authUser.lastName || ''}`.trim());
        }
      })
      .catch(err => {
        console.error('Error loading food data:', err);
        setError('Failed to load food details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [food]);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎯 Form submitted');
    
    // Reset errors
    setError(null);
    
    // Validate form
    if (quantity < 1 || quantity > maxQuantity) {
      setError(`Please select between 1 and ${maxQuantity} units`);
      return;
    }
    
    if (!customerName.trim()) {
      setError('Please enter customer name');
      return;
    }
    
    if (!useStoreAddress && !deliveryAddress.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('foodItemId', food.id.toString());
    formData.append('donorId', donorId.toString());
    formData.append('quantity', quantity.toString());
    formData.append('paymentMethod', 'CASH');
    formData.append('deliveryAddress', useStoreAddress ? food.location : deliveryAddress);
    formData.append('notes', `Purchase for donation by ${customerName}. Phone: ${customerPhone || 'Not provided'}`);
    formData.append('customerName', customerName);
    formData.append('customerPhone', customerPhone || '');

    console.log('📋 FormData created, calling onSubmit');
    
    // Call the parent handler
    onSubmit(formData);
  };

  if (loading) {
    return (
      <div className="modal-overlay fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-96 p-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-11/12 max-w-md mx-4">
        {/* Header */}
        <div className="bg-emerald-500 dark:bg-emerald-600 p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-semibold text-lg">Purchase for Donation</h3>
            <button 
              type="button"
              onClick={onClose} 
              className="text-white/80 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {purchaseSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg mb-4 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <div className="font-semibold">{purchaseSuccess}</div>
              <div className="text-sm mt-1">Your donation has been added successfully!</div>
            </div>
          )}

          {/* Error Message */}
          {(error || purchaseError) && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
              {error || purchaseError}
            </div>
          )}

          {!purchaseSuccess && (
            <>
              {/* Food Info */}
              <div className="mb-6">
                <div className="flex space-x-4">
                  <img
                    src={food.img || '/api/placeholder/80/80'}
                    alt={food.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{food.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{food.storeName}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">৳{unitPrice} per unit</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Available: {maxQuantity} units</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                {/* Customer Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                      disabled={quantity <= 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-16 text-center border border-gray-300 dark:border-gray-600 rounded-md py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      min="1"
                      max={maxQuantity}
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                      disabled={quantity >= maxQuantity}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      Total: ৳{totalPrice}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Delivery Address
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="address"
                        checked={useStoreAddress}
                        onChange={() => setUseStoreAddress(true)}
                        className="text-emerald-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Pick up from store: {food.location}
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="address"
                        checked={!useStoreAddress}
                        onChange={() => setUseStoreAddress(false)}
                        className="text-emerald-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Use different address
                      </span>
                    </label>
                  </div>
                  {!useStoreAddress && (
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter delivery address"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    disabled={purchaseLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-lg hover:bg-emerald-600 dark:hover:bg-emerald-700 flex items-center justify-center space-x-2 disabled:opacity-50"
                    disabled={purchaseLoading}
                  >
                    {purchaseLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4" />
                        <span>Purchase ৳{totalPrice}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="dashboard-container">
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="logout-modal">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Logout</h3>
            </div>
            <div className="modal-body">
              <h4>Are you sure you want to log out from your account?</h4>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="btn-primary" onClick={confirmLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {logoutSuccess && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="modal-body">
              <CheckCircle className="h-12 w-12" />
              <h3 className="success-message">Successfully logged out!</h3>
              <p>Redirecting to home page...</p>
            </div>
          </div>
        </div>
      )}
      {purchaseSuccess && (
        <div className="success-notification fixed top-4 right-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800 shadow-md flex items-center gap-2 z-50 animate-slideIn">
          <CheckCircle className="h-5 w-5" />
          <span>{purchaseSuccess}</span>
        </div>
      )}
      <div className="dashboard-content dark:bg-gray-800 dark:border-gray-700">
        {/* History Panel Overlay */}
        {showHistoryPanel && renderHistoryPanel()}

        <div className="dashboard-header-section bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-gray-950/40">
          <div className="dashboard-header bg-white dark:bg-gray-900">
            <div className="header-content">
              <div className="logo-title-wrapper">
                <div>
                  <h1 className="dashboard-title text-primary-dark dark:text-emerald-400 font-bold">Donor Dashboard</h1>
                  <p className="dashboard-subtitle text-gray-600 dark:text-gray-300">
                    Manage your food donations and connect with those in need
                  </p>
                </div>
              </div>
            </div>
            <div className="header-actions flex items-center">
              {/* Toggle button to show/hide navigation */}
              <button
                className="toggle-nav-btn mr-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                onClick={() => setShowNavigation(!showNavigation)}
                title={showNavigation ? "Hide navigation" : "Show navigation"}
              >
                {showNavigation ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
                <div className={`header-navigation-buttons transition-all duration-300 ${showNavigation ? 'opacity-100 max-w-3xl' : 'opacity-0 max-w-0 overflow-hidden'}`}>
  <button
    className="header-nav-btn hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-300 transition-colors duration-200"
    onClick={() => {
      setSelectedMainTab('activeDonations');
    }}
  >
    <Package className="h-4 w-4" />
    <span>Active Donations</span>
  </button>
  
  <button
    className="header-nav-btn hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 dark:text-red-300 transition-colors duration-200"
    onClick={() => setSelectedMainTab('requests')}
  >
    <Users className="h-4 w-4" />
    <span>Requests</span>
  </button>

  {/* NEW: Messages Button */}
  <button
    className="header-nav-btn hover:bg-gray-100 dark:hover:bg-gray-800 text-purple-600 dark:text-purple-300 transition-colors duration-200 relative"
    onClick={() => setSelectedMainTab('messages')}
  >
    <MessageSquare className="h-4 w-4" />
    <span>Messages</span>
    {messageStats.unreadMessages > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {messageStats.unreadMessages}
      </span>
    )}
  </button>

  <button
    className="header-nav-btn hover:bg-gray-100 dark:hover:bg-gray-800 text-orange-600 dark:text-orange-300 transition-colors duration-200"
    onClick={() => setSelectedMainTab('profile')}
  >
    <UserCog className="h-4 w-4" />
    <span>Profile</span>
  </button>
  
  <button
    className="header-nav-btn hover:bg-gray-100 dark:hover:bg-gray-800 text-teal-600 dark:text-teal-300 transition-colors duration-200"
    onClick={toggleHistoryPanel}
  >
    <History className="h-4 w-4" />
    <span>History</span>
  </button>
</div>


              <button
                className="btn-refresh-dashboard bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-600 dark:to-blue-800 dark:hover:from-blue-500 dark:hover:to-blue-700 text-white shadow-md dark:shadow-blue-900/30 transition-all duration-300 transform hover:-translate-y-0.5"
                onClick={handleLogout}
                title="Log out"
              >
                <span>Log out</span>
              </button>
            </div>
          </div>

          <div className="stats-container">
            <div className="stats-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-l-4 border-blue-500 dark:border-blue-400 shadow-md dark:shadow-gray-950/30 rounded-r-lg transition-transform duration-300 hover:transform hover:-translate-y-1">
              <div className="stats-icon stats-blue bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 shadow-lg dark:shadow-blue-500/30">
                <Package className="h-5 w-5" />
              </div>
              <div className="stats-content">
                <div className="stats-value text-gray-900 dark:text-white font-bold text-2xl">12</div>
                <div className="stats-label text-gray-600 dark:text-gray-300 text-xs tracking-wider">ACTIVE DONATIONS</div>
              </div>
            </div>

            <div className="stats-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-l-4 border-green-500 dark:border-green-400 shadow-md dark:shadow-gray-950/30 rounded-r-lg transition-transform duration-300 hover:transform hover:-translate-y-1">
              <div className="stats-icon stats-green bg-green-500 dark:bg-green-400 text-white dark:text-gray-900 shadow-lg dark:shadow-green-500/30">
                <Users className="h-5 w-5" />
              </div>
              <div className="stats-content">
                <div className="stats-value text-gray-900 dark:text-white font-bold text-2xl">45</div>
                <div className="stats-label text-gray-600 dark:text-gray-300 text-xs tracking-wider">PEOPLE HELPED</div>
              </div>
            </div>

            <div className="stats-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-l-4 border-orange-500 dark:border-orange-400 shadow-md dark:shadow-gray-950/30 rounded-r-lg transition-transform duration-300 hover:transform hover:-translate-y-1">
              <div className="stats-icon stats-orange bg-orange-500 dark:bg-orange-400 text-white dark:text-gray-900 shadow-lg dark:shadow-orange-500/30">
                <Clock3 className="h-5 w-5" />
              </div>
              <div className="stats-content">
                <div className="stats-value text-gray-900 dark:text-white font-bold text-2xl">8</div>
                <div className="stats-label text-gray-600 dark:text-gray-300 text-xs tracking-wider">PENDING REQUESTS</div>
              </div>
            </div>

            <div className="stats-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-l-4 border-purple-500 dark:border-purple-400 shadow-md dark:shadow-gray-950/30 rounded-r-lg transition-transform duration-300 hover:transform hover:-translate-y-1">
              <div className="stats-icon stats-purple bg-purple-500 dark:bg-purple-400 text-white dark:text-gray-900 shadow-lg dark:shadow-purple-500/30">
                <Heart className="h-5 w-5" />
              </div>
              <div className="stats-content">
                <div className="stats-value text-gray-900 dark:text-white font-bold text-2xl">89</div>
                <div className="stats-label text-gray-600 dark:text-gray-300 text-xs tracking-wider">TOTAL IMPACT</div>
              </div>
            </div>
          </div>
        </div>

        {showDonationForm && donationStep > 0 && (
          <div className="donation-flow-overlay">
            {donationStep === 2 && renderFoodSelection()}
            {donationStep === 3 && renderDonationForm()}
          </div>
        )}

        <div className="main-tabs-container dark:bg-gray-800 dark:border-gray-700">
          <button
            className="btn-primary"
            onClick={startDonation}
          >
            <Plus className="h-6 w-6" />
            <span>Donate Own Food</span>
          </button>
        </div>

        {/* Display food items directly in the dashboard (new) */}
        {!showDonationForm && shouldShowFoodItems && (
          <div className="dashboard-food-items-container bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md dark:shadow-gray-900/30">
            <h2 className="section-title flex items-center text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
              <Package className="h-5 w-5 mr-2 text-primary dark:text-primary-light" />
              Available Food Items
            </h2>

            {foodItemsLoading && (
              <div className="loading-indicator flex items-center justify-center p-8 text-gray-600 dark:text-gray-400">
                <span className="loading-spinner border-t-2 border-primary dark:border-primary-light w-6 h-6 rounded-full animate-spin mr-3"></span>
                <span>Loading available items...</span>
              </div>
            )}

            {apiError && (
              <div className="error-message flex items-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md mb-4">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <div className="dashboard-food-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allFoodItems.map(item => (
                <div
                  key={item.id}
                  className="dashboard-food-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 shadow-md dark:shadow-gray-900/30"
                >
                  <div className="food-item-image h-48 relative overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  <div className="food-item-content p-5">
                    <h3 className="food-item-title text-lg font-bold text-gray-800 dark:text-white mb-2">{item.name}</h3>

                    <div className="food-item-details flex justify-between mb-3">
                      <span className="food-item-source text-gray-600 dark:text-gray-400 text-sm">{"Price: "}{item.price}{"Taka"}</span>
                      <span className="food-item-type bg-primary-transparent dark:bg-primary-dark/30 text-primary dark:text-primary-light px-2 py-1 rounded-full text-xs font-medium">
                        {item.foodType}
                      </span>
                    </div>

                    <div className="food-item-meta border-t border-gray-100 dark:border-gray-700 pt-3 mb-4">
                      <div className="food-item-meta-row flex items-center mb-2 text-sm text-gray-700 dark:text-gray-300">
                        <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" />
                        <span>Expires: {item.expiryDate}</span>
                      </div>

                      <div className="food-item-meta-row flex items-center mb-2 text-sm text-gray-700 dark:text-gray-300">
                        <Package className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                        <span>Quantity: {item.quantity}</span>
                      </div>

                      <div className="food-item-meta-row flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <MapPin className="h-4 w-4 text-red-500 dark:text-red-400 mr-2 flex-shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    <div className="food-item-actions flex gap-3">
                      <button
                        className="btn-view-details flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => handleViewDetails(item)}
                      >
                        <Eye className="h-4 w-4" />
                        <span>Details</span>
                      </button>
                      <button
                        className="btn-donate flex-1 flex items-center justify-center gap-2 bg-primary dark:bg-primary-dark text-white py-2 px-3 rounded-md hover:bg-primary-hover dark:hover:bg-primary transition-colors"
                        onClick={() => handleDonate(item)}
                      >
                        <Heart className="h-4 w-4" />
                        <span>Donate</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {allFoodItems.length === 0 && !foodItemsLoading && !apiError && (
                <div className="no-items-message col-span-full flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <span className="text-gray-500 dark:text-gray-400">No food items available</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Details modal */}
        {showDetailsModal && selectedFoodDetails && (
          <div className="modal-overlay fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="details-modal w-11/12 max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-black/30 overflow-hidden flex flex-col max-h-[85vh] animate-modal-appear">
              <div className="modal-header bg-gradient-to-r from-primary to-primary-light dark:from-primary-dark dark:to-primary p-4 flex justify-between items-center">
                <h3 className="modal-title text-white font-semibold text-lg">Food Item Details</h3>
                <button
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                  onClick={closeDetailsModal}
                  aria-label="Close details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="modal-body overflow-y-auto p-0">
                <div className="food-details-container">
                  <div className="food-details-header-compact flex flex-col md:flex-row bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 gap-4">
                    <div className="food-details-image-container w-full md:w-48 h-40 overflow-hidden rounded-lg shadow-md dark:shadow-black/20 flex-shrink-0">
                      <img
                        className="food-details-image-compact w-full h-full object-cover"
                        src={selectedFoodDetails.imageBase64
                          ? `data:${selectedFoodDetails.imageContentType || 'image/jpeg'};base64,${selectedFoodDetails.imageBase64}`
                          : '/api/placeholder/300/200'}
                        alt={selectedFoodDetails.name}
                      />
                    </div>
                    <div className="food-details-title-section flex-1">
                      <h2 className="food-details-title-compact text-gray-800 dark:text-white text-xl md:text-2xl font-bold mb-2">
                        {selectedFoodDetails.name}
                      </h2>
                      <div className="food-details-key-info flex flex-wrap gap-2 mt-2">
                        <span className="food-info-badge type bg-primary/10 dark:bg-primary-dark/30 text-primary dark:text-primary-light px-3 py-1 rounded-full text-sm font-medium">
                          {selectedFoodDetails.foodType || 'Not specified'}
                        </span>
                        <span className="food-info-badge price bg-primary dark:bg-primary-dark text-white px-3 py-1 rounded-full text-sm font-bold">
                          {selectedFoodDetails.price ? `৳${selectedFoodDetails.price}` : 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="food-details-grid-compact grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800">
                    <div className="food-details-item-compact bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border-l-2 border-blue-500 dark:border-blue-400">
                      <div className="food-details-label text-gray-500 dark:text-gray-400 text-xs uppercase font-medium mb-1">
                        Available Quantity
                      </div>
                      <div className="food-details-value text-gray-800 dark:text-gray-100 font-semibold">
                        {selectedFoodDetails.quantity}
                      </div>
                    </div>

                    <div className="food-details-item-compact bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border-l-2 border-amber-500 dark:border-amber-400">
                      <div className="food-details-label text-gray-500 dark:text-gray-400 text-xs uppercase font-medium mb-1">
                        Expiry Date
                      </div>
                      <div className="food-details-value text-gray-800 dark:text-gray-100 font-semibold">
                        {selectedFoodDetails.expiryDate}
                      </div>
                    </div>

                    <div className="food-details-item-compact bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border-l-2 border-green-500 dark:border-green-400">
                      <div className="food-details-label text-gray-500 dark:text-gray-400 text-xs uppercase font-medium mb-1">
                        Store/Restaurant
                      </div>
                      <div className="food-details-value text-gray-800 dark:text-gray-100 font-semibold">
                        {selectedFoodDetails.storeName || 'Not specified'}
                      </div>
                    </div>

                    <div className="food-details-item-compact bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border-l-2 border-red-500 dark:border-red-400">
                      <div className="food-details-label text-gray-500 dark:text-gray-400 text-xs uppercase font-medium mb-1">
                        Location
                      </div>
                      <div className="food-details-value text-gray-800 dark:text-gray-100 font-semibold">
                        {selectedFoodDetails.location || 'Not specified'}
                      </div>
                    </div>

                    <div className="food-details-item-compact bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border-l-2 border-purple-500 dark:border-purple-400">
                      <div className="food-details-label text-gray-500 dark:text-gray-400 text-xs uppercase font-medium mb-1">
                        Delivery Time
                      </div>
                      <div className="food-details-value text-gray-800 dark:text-gray-100 font-semibold">
                        {selectedFoodDetails.deliveryTime || 'Not specified'}
                      </div>
                    </div>

                    <div className="food-details-item-compact bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border-l-2 border-teal-500 dark:border-teal-400">
                      <div className="food-details-label text-gray-500 dark:text-gray-400 text-xs uppercase font-medium mb-1">
                        Dietary Information
                      </div>
                      <div className="food-details-value text-gray-800 dark:text-gray-100 font-semibold">
                        {selectedFoodDetails.dietaryInfo && selectedFoodDetails.dietaryInfo.length > 0
                          ? selectedFoodDetails.dietaryInfo.join(', ')
                          : 'Not specified'}
                      </div>
                    </div>
                  </div>

                  {selectedFoodDetails.description && (
                    <div className="food-details-description-compact mx-4 mb-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-2 border-primary dark:border-primary-light">
                      <span className="food-details-description-label block text-primary dark:text-primary-light text-sm font-semibold mb-2">
                        Description
                      </span>
                      <p className="food-details-description-text text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {selectedFoodDetails.description || 'No description available'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
                <button
                  className="btn-secondary bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-medium"
                  onClick={closeDetailsModal}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedMainTab === 'activeDonations' && (
          <div className="popup-overlay fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="popup-container active-donations-popup bg-white dark:bg-gray-900 rounded-xl shadow-xl dark:shadow-black/30 w-11/12 max-w-6xl max-h-[85vh] flex flex-col overflow-hidden">
              {/* Popup Header */}
              <div className="popup-header bg-gradient-to-r from-primary to-primary-light dark:from-primary-dark dark:to-primary flex justify-between items-center p-4 border-b border-primary-light/20 dark:border-primary-dark/30">
                <div className="popup-title-container flex items-center">
                  <Package className="h-5 w-5 mr-2 text-white" />
                  <h2 className="popup-title text-white text-lg font-semibold">Donation Management</h2>
                </div>

                <div className="popup-actions flex items-center">
                  <div className="popup-tabs flex mr-3 space-x-2">
                    <button
                      className={`popup-tab-btn px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedSubTab === 'active'
                        ? 'bg-white text-primary dark:bg-primary-dark/80 dark:text-white'
                        : 'bg-white/20 text-white hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50'
                        }`}
                      onClick={() => setSelectedSubTab('active')}
                    >
                      Active
                    </button>
                    <button
                      className={`popup-tab-btn px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedSubTab === 'pending'
                        ? 'bg-white text-primary dark:bg-primary-dark/80 dark:text-white'
                        : 'bg-white/20 text-white hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50'
                        }`}
                      onClick={() => setSelectedSubTab('pending')}
                    >
                      Pending
                    </button>
                    <button
                      className={`popup-tab-btn px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedSubTab === 'rejected'
                        ? 'bg-white text-primary dark:bg-primary-dark/80 dark:text-white'
                        : 'bg-white/20 text-white hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50'
                        }`}
                      onClick={() => setSelectedSubTab('rejected')}
                    >
                      Rejected
                    </button>
                    <button
                      className={`popup-tab-btn px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedSubTab === 'completed'
                        ? 'bg-white text-primary dark:bg-primary-dark/80 dark:text-white'
                        : 'bg-white/20 text-white hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50'
                        }`}
                      onClick={() => setSelectedSubTab('completed')}
                    >
                      Completed
                    </button>
                  </div>
                  <div className="popup-header-buttons">
                    <button
                      className="popup-close-btn w-8 h-8 rounded-full bg-white/20 dark:bg-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-700/50 flex items-center justify-center text-white transition-transform hover:rotate-90"
                      onClick={() => setSelectedMainTab('donations')}
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Popup Content */}
              <div className="popup-content flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
                {apiLoading && (
                  <div className="loading-indicator flex flex-col items-center justify-center p-12 text-gray-600 dark:text-gray-400">
                    <span className="loading-spinner w-10 h-10 border-4 border-primary/20 dark:border-primary-dark/20 border-t-primary dark:border-t-primary-light rounded-full animate-spin mb-4"></span>
                    <span>Loading donations...</span>
                  </div>
                )}

                {!apiLoading && !donorId && (
                  <div className="error-message flex items-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 m-4 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Error: User not properly authenticated. Please log in again.</span>
                  </div>
                )}

                {!apiLoading && donorId && (
                  <div className="donations-section flex h-full">
                    {/* Sidebar */}
                    <div className="donations-sidebar w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto flex-shrink-0 h-full">
                      <div className="sidebar-header p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-gray-800 dark:text-gray-200 font-medium text-sm">Your Donations</h3>
                      </div>
                      <div className="sidebar-content p-2">
                        {(() => {
                          let items = [];
                          switch (selectedSubTab) {
                            case 'active':
                              items = activeDonations;
                              break;
                            case 'pending':
                              items = pendingDonations;
                              break;
                            case 'rejected':
                              items = rejectedDonations;
                              break;
                            case 'completed':
                              items = completedDonations;
                              break;
                            default:
                              items = [];
                          }

                          return items.map(item => (
                            <div key={item.id} className="sidebar-item flex items-center p-2 mb-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                              <img
                                src={item.imageUrl}
                                alt={item.foodName}
                                className="sidebar-item-image w-10 h-10 rounded-md object-cover mr-3"
                              />
                              <div className="sidebar-item-info overflow-hidden">
                                <span className="sidebar-item-name text-gray-800 dark:text-gray-200 text-sm font-medium truncate block">{item.foodName}</span>
                              </div>
                            </div>
                          ));
                        })()}

                        {(() => {
                          let items = [];
                          switch (selectedSubTab) {
                            case 'active':
                              items = activeDonations;
                              break;
                            case 'pending':
                              items = pendingDonations;
                              break;
                            case 'rejected':
                              items = rejectedDonations;
                              break;
                            case 'completed':
                              items = completedDonations;
                              break;
                            default:
                              items = [];
                          }

                          if (items.length === 0) {
                            return (
                              <div className="empty-sidebar flex flex-col items-center justify-center py-8 px-4 text-center text-gray-500 dark:text-gray-400">
                                <Package className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
                                <p className="text-sm">No {selectedSubTab} donations</p>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="donations-main-content flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-900">
                      {selectedSubTab === 'active' && (
                        <div className="donations-compact-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {activeDonations.length > 0 ? (
                            activeDonations.map(donation => (
                              <div key={donation.id} className="donation-compact-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:shadow-gray-900/30 transition-all hover:-translate-y-1">
                                <div className="donation-card-image-container h-48 relative overflow-hidden">
                                  <img
                                    src={donation.imageUrl}
                                    alt={donation.foodName}
                                    className="donation-card-image w-full h-full object-cover"
                                  />
                                  <div className={`status-badge absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-semibold uppercase ${donation.status.toLowerCase() === 'active'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                                    : ''
                                    }`}>
                                    {donation.status}
                                  </div>
                                </div>

                                <div className="donation-card-content p-4">
                                  <h3 className="donation-card-title text-gray-900 dark:text-white font-semibold mb-2 line-clamp-1">{donation.foodName}</h3>
                                  <div className="donation-meta flex justify-between items-center mb-3">
                                    <span className="donation-category bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-300">
                                      {donation.category}
                                    </span>
                                    <div className={`donor-type-icon flex items-center ${donation.donorType === 'Restaurant'
                                      ? 'text-orange-500 dark:text-orange-400'
                                      : donation.donorType === 'Individual'
                                        ? 'text-blue-500 dark:text-blue-400'
                                        : 'text-purple-500 dark:text-purple-400'
                                      }`}>
                                      {donation.donorType === 'Restaurant' ? <ChefHat className="h-3 w-3" /> :
                                        donation.donorType === 'Individual' ? <User className="h-3 w-3" /> :
                                          <Building2 className="h-3 w-3" />}
                                      <span className="donor-type-text text-xs ml-1">{donation.donorType}</span>
                                    </div>
                                  </div>

                                  <div className="donation-compact-info border-t border-gray-100 dark:border-gray-700 pt-3 mb-3">
                                    <div className="info-row flex items-center mb-1.5 text-sm text-gray-600 dark:text-gray-300">
                                      <Clock className="info-icon h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
                                      <span className="info-text">
                                        {new Date(donation.expiry).toLocaleString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true
                                        })}
                                      </span>
                                    </div>
                                    <div className="info-row flex items-center mb-1.5 text-sm text-gray-600 dark:text-gray-300">
                                      <MapPin className="info-icon h-4 w-4 text-red-500 dark:text-red-400 mr-2" />
                                      <span className="info-text line-clamp-1">{donation.location}</span>
                                    </div>
                                    <div className="info-row flex items-center text-sm text-gray-600 dark:text-gray-300">
                                      <Package className="info-icon h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                                      <span className="info-text">Quantity: {donation.quantity}</span>
                                    </div>
                                  </div>

                                  <div className="donation-card-footer flex justify-between">
                                    <button
                                      className="btn-card-action check-requests bg-primary/10 dark:bg-primary-dark/30 hover:bg-primary/20 dark:hover:bg-primary-dark/40 text-primary dark:text-primary-light rounded-lg py-1.5 px-3 text-sm font-medium transition-colors"
                                      onClick={() => handleCheckRequests(donation)}
                                    >
                                      <Users className="h-3 w-3 mr-1" />
                                      Requests
                                    </button>
                                    <div className="card-action-buttons flex space-x-2">
                                      <button
                                        className="btn-card-action edit bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg w-8 h-8 flex items-center justify-center transition-colors"
                                        onClick={() => handleEditDonation(donation)}
                                        title="Edit"
                                      >
                                        <Edit className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        className="btn-card-action delete bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 rounded-lg w-8 h-8 flex items-center justify-center transition-colors"
                                        onClick={() => handleDeleteDonation(donation.id)}
                                        title="Delete"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="empty-state col-span-full flex flex-col items-center justify-center py-12 px-4 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                              <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                              <p className="text-gray-600 dark:text-gray-400 mb-6">No active donations available</p>
                              <button
                                className="btn-create-donation bg-primary dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                onClick={startDonation}
                              >
                                <Plus className="h-4 w-4" />
                                Create New Donation
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedSubTab === 'pending' && (
                        <div className="donations-compact-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {pendingDonations.length > 0 ? (
                            pendingDonations.map(donation => (
                              <div key={donation.id} className="donation-compact-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:shadow-gray-900/30 transition-all hover:-translate-y-1">
                                <div className="donation-card-image-container h-48 relative overflow-hidden">
                                  <img
                                    src={donation.imageUrl}
                                    alt={donation.foodName}
                                    className="donation-card-image w-full h-full object-cover"
                                  />
                                  <div className="status-badge absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-semibold uppercase bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                    Pending
                                  </div>
                                </div>

                                <div className="donation-card-content p-4">
                                  <h3 className="donation-card-title text-gray-900 dark:text-white font-semibold mb-2 line-clamp-1">{donation.foodName}</h3>
                                  <div className="donation-meta flex justify-between items-center mb-3">
                                    <span className="donation-category bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-300">
                                      {donation.category}
                                    </span>
                                    <div className={`donor-type-icon flex items-center ${donation.donorType === 'Restaurant'
                                      ? 'text-orange-500 dark:text-orange-400'
                                      : donation.donorType === 'Individual'
                                        ? 'text-blue-500 dark:text-blue-400'
                                        : 'text-purple-500 dark:text-purple-400'
                                      }`}>
                                      {donation.donorType === 'Restaurant' ? <ChefHat className="h-3 w-3" /> :
                                        donation.donorType === 'Individual' ? <User className="h-3 w-3" /> :
                                          <Building2 className="h-3 w-3" />}
                                      <span className="donor-type-text text-xs ml-1">{donation.donorType}</span>
                                    </div>
                                  </div>

                                  <div className="donation-compact-info border-t border-gray-100 dark:border-gray-700 pt-3 mb-3">
                                    <div className="info-row flex items-center mb-1.5 text-sm text-gray-600 dark:text-gray-300">
                                      <Clock className="info-icon h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
                                      <span className="info-text">
                                        {new Date(donation.expiry).toLocaleString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true
                                        })}
                                      </span>
                                    </div>
                                    <div className="info-row flex items-center mb-1.5 text-sm text-gray-600 dark:text-gray-300">
                                      <MapPin className="info-icon h-4 w-4 text-red-500 dark:text-red-400 mr-2" />
                                      <span className="info-text line-clamp-1">{donation.location}</span>
                                    </div>
                                    <div className="info-row flex items-center text-sm text-gray-600 dark:text-gray-300">
                                      <Package className="info-icon h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                                      <span className="info-text">Quantity: {donation.quantity}</span>
                                    </div>
                                  </div>

                                  <div className="donation-card-footer flex gap-2">
                                    <button
                                      className="btn-card-action mark-complete flex-1 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 rounded-lg py-1.5 px-3 text-sm font-medium transition-colors flex items-center justify-center"
                                      onClick={() => handleMarkAsCompleted(donation.id)}
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      <span>Complete</span>
                                    </button>
                                    <button
                                      className="btn-card-action view-details flex-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg py-1.5 px-3 text-sm font-medium transition-colors flex items-center justify-center"
                                      onClick={() => handleCheckPendingRequests(donation)}
                                    >
                                      <Users className="h-3 w-3 mr-1" />
                                      <span>Requests</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="empty-state col-span-full flex flex-col items-center justify-center py-12 px-4 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                              <Clock3 className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                              <p className="text-gray-600 dark:text-gray-400">No pending donations available</p>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedSubTab === 'rejected' && (
                        <div className="donations-compact-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {rejectedDonations.length > 0 ? (
                            rejectedDonations.map(donation => (
                              <div key={donation.id} className="donation-compact-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:shadow-gray-900/30 transition-all hover:-translate-y-1">
                                <div className="donation-card-image-container h-48 relative overflow-hidden">
                                  <img
                                    src={donation.imageUrl}
                                    alt={donation.foodName}
                                    className="donation-card-image w-full h-full object-cover"
                                  />
                                  <div className="status-badge absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-semibold uppercase bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                                    Rejected
                                  </div>
                                </div>

                                <div className="donation-card-content p-4">
                                  <h3 className="donation-card-title text-gray-900 dark:text-white font-semibold mb-2 line-clamp-1">{donation.foodName}</h3>
                                  <div className="donation-meta flex justify-between items-center mb-3">
                                    <span className="donation-category bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-300">
                                      {donation.category}
                                    </span>
                                    <div className={`donor-type-icon flex items-center ${donation.donorType === 'Restaurant'
                                      ? 'text-orange-500 dark:text-orange-400'
                                      : donation.donorType === 'Individual'
                                        ? 'text-blue-500 dark:text-blue-400'
                                        : 'text-purple-500 dark:text-purple-400'
                                      }`}>
                                      {donation.donorType === 'Restaurant' ? <ChefHat className="h-3 w-3" /> :
                                        donation.donorType === 'Individual' ? <User className="h-3 w-3" /> :
                                          <Building2 className="h-3 w-3" />}
                                      <span className="donor-type-text text-xs ml-1">{donation.donorType}</span>
                                    </div>
                                  </div>

                                  <div className="donation-compact-info border-t border-gray-100 dark:border-gray-700 pt-3 mb-3">
                                    <div className="info-row flex items-center mb-1.5 text-sm text-gray-600 dark:text-gray-300">
                                      <Clock className="info-icon h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
                                      <span className="info-text">
                                        {new Date(donation.expiry).toLocaleString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true
                                        })}
                                      </span>
                                    </div>
                                    <div className="info-row flex items-center mb-1.5 text-sm text-gray-600 dark:text-gray-300">
                                      <MapPin className="info-icon h-4 w-4 text-red-500 dark:text-red-400 mr-2" />
                                      <span className="info-text line-clamp-1">{donation.location}</span>
                                    </div>
                                    <div className="info-row flex items-center text-sm text-gray-600 dark:text-gray-300">
                                      <Package className="info-icon h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                                      <span className="info-text">Quantity: {donation.quantity}</span>
                                    </div>
                                  </div>

                                  <div className="donation-card-footer flex justify-center">
                                    <button
                                      className="btn-card-action delete bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg py-1.5 px-6 text-sm font-medium transition-colors flex items-center justify-center"
                                      onClick={() => handleDeleteDonation(donation.id)}
                                    >
                                      <Trash2 className="h-3 w-3 mr-2" />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="empty-state col-span-full flex flex-col items-center justify-center py-12 px-4 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                              <X className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                              <p className="text-gray-600 dark:text-gray-400">No rejected donations available</p>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedSubTab === 'completed' && (
                        <div className="donations-compact-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {completedDonations.length > 0 ? (
                            completedDonations.map(donation => (
                              <div key={donation.id} className="donation-compact-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:shadow-gray-900/30 transition-all hover:-translate-y-1">
                                <div className="donation-card-image-container h-48 relative overflow-hidden">
                                  <img
                                    src={donation.imageUrl}
                                    alt={donation.foodName}
                                    className="donation-card-image w-full h-full object-cover"
                                  />
                                  <div className="status-badge absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-semibold uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                    Completed
                                  </div>
                                </div>

                                <div className="donation-card-content p-4">
                                  <h3 className="donation-card-title text-gray-900 dark:text-white font-semibold mb-2 line-clamp-1">{donation.foodName}</h3>
                                  <div className="donation-meta flex justify-between items-center mb-3">
                                    <span className="donation-category bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-300">
                                      {donation.category}
                                    </span>
                                    <div className={`donor-type-icon flex items-center ${donation.donorType === 'Restaurant'
                                      ? 'text-orange-500 dark:text-orange-400'
                                      : donation.donorType === 'Individual'
                                        ? 'text-blue-500 dark:text-blue-400'
                                        : 'text-purple-500 dark:text-purple-400'
                                      }`}>
                                      {donation.donorType === 'Restaurant' ? <ChefHat className="h-3 w-3" /> :
                                        donation.donorType === 'Individual' ? <User className="h-3 w-3" /> :
                                          <Building2 className="h-3 w-3" />}
                                      <span className="donor-type-text text-xs ml-1">{donation.donorType}</span>
                                    </div>
                                  </div>

                                  <div className="donation-compact-info border-t border-gray-100 dark:border-gray-700 pt-3 mb-3">
                                    <div className="info-row flex items-center mb-1.5 text-sm text-gray-600 dark:text-gray-300">
                                      <Clock className="info-icon h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
                                      <span className="info-text">
                                        {new Date(donation.expiry).toLocaleString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          minute: '2-digit',
                                          hour12: true
                                        })}
                                      </span>
                                    </div>
                                    <div className="info-row flex items-center mb-1.5 text-sm text-gray-600 dark:text-gray-300">
                                      <MapPin className="info-icon h-4 w-4 text-red-500 dark:text-red-400 mr-2" />
                                      <span className="info-text line-clamp-1">{donation.location}</span>
                                    </div>
                                    <div className="info-row flex items-center text-sm text-gray-600 dark:text-gray-300">
                                      <Package className="info-icon h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                                      <span className="info-text">Quantity: {donation.quantity}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="empty-state col-span-full flex flex-col items-center justify-center py-12 px-4 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                              <CheckCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                              <p className="text-gray-600 dark:text-gray-400">No completed donations available</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Donation Modal - Conditionally rendered */}
            {showEditModal && editingDonation && (
              <EditDonationModal
                donation={editingDonation}
                onClose={closeEditModal}
                onSubmit={handleEditSubmit}
                loading={apiLoading}
                error={apiError}
              />
            )}
          </div>
        )}

        {selectedMainTab === 'requests' && (
          <div className="popup-overlay fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="popup-container requests-popup bg-white dark:bg-gray-900 rounded-xl shadow-xl dark:shadow-black/30 w-11/12 max-w-5xl max-h-[85vh] flex flex-col overflow-hidden">
              {/* Popup Header with Blue Theme */}
              <div className="popup-header bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 flex justify-between items-center p-4 border-b border-blue-400/20 dark:border-blue-800/30">
                <h2 className="popup-title flex items-center text-white text-lg font-semibold">
                  <Users className="h-5 w-5 mr-2" />
                  Food Requests
                </h2>
                <button
                  className="popup-close-btn w-8 h-8 rounded-full bg-white/20 dark:bg-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-700/50 flex items-center justify-center text-white transition-transform hover:rotate-90"
                  onClick={() => setSelectedMainTab('donations')}
                  aria-label="Close requests"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Popup Content */}
              <div className="popup-content requests-content p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                {foodRequestsLoading ? (
                  <div className="loading-indicator flex flex-col items-center justify-center p-12 text-gray-600 dark:text-gray-400">
                    <span className="loading-spinner w-10 h-10 border-4 border-blue-200 dark:border-blue-900/30 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mb-4"></span>
                    <span>Loading food requests...</span>
                  </div>
                ) : foodRequestsError ? (
                  <div className="error-message flex items-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{foodRequestsError}</span>
                  </div>
                ) : foodRequests.length > 0 ? (
                  <div className="requests-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {foodRequests.map(request => (
                      <div
                        key={request.id}
                        className="request-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:shadow-gray-900/30 transition-all hover:-translate-y-1"
                      >
                        <div className="request-card-header p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
                          <div className="requester-info flex items-center">
                            <div className="avatar-circle w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="requester-name text-gray-900 dark:text-white text-sm font-medium">
                                {request.requesterName || 'Anonymous'}
                              </h3>
                              <div className="request-meta-info flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{request.requestDate}</span>
                              </div>
                            </div>
                          </div>

                          <div className={`request-status px-2 py-1 rounded-full text-xs font-semibold ${request.status === 'PENDING'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                            : request.status === 'ACCEPTED'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            }`}>
                            {request.status}
                          </div>
                        </div>

                        <div className="request-card-body p-4">
                          <div className="request-details-grid grid grid-cols-2 gap-3 mb-4">
                            <div className="detail-group">
                              <span className="detail-label block text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
                                Food
                              </span>
                              <span className="detail-value text-sm text-gray-800 dark:text-gray-200 font-medium">
                                {request.foodName}
                              </span>
                            </div>

                            <div className="detail-group">
                              <span className="detail-label block text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
                                People
                              </span>
                              <span className="detail-value text-sm text-gray-800 dark:text-gray-200 font-medium">
                                {request.people || 'Not specified'}
                              </span>
                            </div>

                            <div className="detail-group">
                              <span className="detail-label block text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
                                Location
                              </span>
                              <span className="detail-value text-sm text-gray-800 dark:text-gray-200 font-medium line-clamp-1">
                                {request.location || 'Not specified'}
                              </span>
                            </div>

                            <div className="detail-group">
                              <span className="detail-label block text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
                                Delivery
                              </span>
                              <span className="detail-value text-sm text-gray-800 dark:text-gray-200 font-medium">
                                {request.deliveryPreference || 'Not specified'}
                              </span>
                            </div>
                          </div>

                          <div className="urgency-indicator mb-4">
                            <span className={`urgency-badge inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${request.urgency.toLowerCase() === 'high'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              : request.urgency.toLowerCase() === 'medium'
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              }`}>
                              {request.urgency} Priority
                            </span>
                          </div>

                          {request.imageUrl && (
                            <div className="request-image-container mb-4 rounded-lg overflow-hidden h-36 border border-gray-200 dark:border-gray-700">
                              <img
                                src={request.imageUrl}
                                alt="Requested food"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {request.notes && (
                            <div className="notes-container bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 mb-4 border-l-2 border-blue-500 dark:border-blue-400">
                              <h4 className="notes-heading text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
                                Notes:
                              </h4>
                              <p className="notes-content text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                                {request.notes}
                              </p>
                            </div>
                          )}

                          {request.recipients && request.recipients.length > 0 && (
                            <div className="recipients-container mb-4">
                              <h4 className="recipients-heading text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-2">
                                Recipients:
                              </h4>
                              <div className="recipients-list flex flex-wrap gap-1.5">
                                {request.recipients.map((recipient, index) => (
                                  <span
                                    key={index}
                                    className="recipient-tag bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-md"
                                  >
                                    {recipient}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="request-actions-row flex gap-2">
                            {request.status === 'PENDING' ? (
                              <>
                                <button
                                  className="btn-accept-request flex-1 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                                  onClick={() => handleAcceptRequest(request.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1.5" />
                                  <span>Accept</span>
                                </button>
                                <button
                                  className="btn-decline-request flex-1 bg-white dark:bg-gray-700 border border-red-500 dark:border-red-500/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                                  onClick={() => handleDeclineRequest(request.id)}
                                >
                                  <X className="h-4 w-4 mr-1.5" />
                                  <span>Decline</span>
                                </button>
                              </>
                            ) : request.status === 'ACCEPTED' && (
                              <button
                                className="btn-contact-requester w-full bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                                onClick={() => handleContactRequester(request)}
                              >
                                <Phone className="h-4 w-4 mr-1.5" />
                                <span>Contact Requester</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-container flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <Users className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-6" />
                    <p className="empty-state-message text-gray-600 dark:text-gray-400 text-lg">No food requests available</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2 max-w-md">
                      When someone requests your donated food, their requests will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedMainTab === 'profile' && (
          <div className="popup-overlay fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="popup-container profile-popup bg-white dark:bg-gray-900 rounded-xl shadow-xl dark:shadow-black/30 w-11/12 max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
              <div className="popup-header bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-800 dark:to-purple-600 flex justify-between items-center p-4 border-b border-purple-400/20 dark:border-purple-800/30 flex-shrink-0">
                <h2 className="popup-title flex items-center text-white text-lg font-semibold">
                  <UserCog className="h-5 w-5 mr-2 text-white" />
                  Profile Management
                </h2>
                <button
                  className="popup-close-btn w-8 h-8 rounded-full bg-white/20 dark:bg-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-700/50 flex items-center justify-center text-white transition-transform hover:rotate-90"
                  onClick={() => setSelectedMainTab('donations')}
                  aria-label="Close profile"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="popup-content profile-management-container p-6 overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-900 custom-scrollbar">
                {/* Loading indicator */}
                {profileLoading && (
                  <div className="loading-indicator flex flex-col items-center justify-center p-12 text-gray-600 dark:text-gray-400">
                    <span className="loading-spinner w-10 h-10 border-4 border-orange-200 dark:border-orange-900/30 border-t-orange-600 dark:border-t-orange-500 rounded-full animate-spin mb-4"></span>
                    <span>Loading profile data...</span>
                  </div>
                )}

                {/* Success message */}
                {profileUpdateSuccess && (
                  <div className="success-message flex items-center bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{profileUpdateSuccess}</span>
                  </div>
                )}

                {/* Error message */}
                {profileUpdateError && (
                  <div className="error-message flex items-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg border border-red-200 dark:border-red-800 mb-4">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{profileUpdateError}</span>
                  </div>
                )}

                {/* Profile View */}
                {!showProfileForm && !showPasswordForm && donorProfile && (
                  <>
                    <div className="profile-header flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 mb-6">
                      <div className="profile-image-container relative">
                        {donorProfile.userPhotoBase64 ? (
                          <img
                            src={`data:${donorProfile.photoContentType};base64,${donorProfile.userPhotoBase64}`}
                            alt="Profile"
                            className="profile-image w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md dark:shadow-black/20"
                          />
                        ) : (
                          <img
                            src="/api/placeholder/150/150"
                            alt="Profile"
                            className="profile-image w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md dark:shadow-black/20"
                          />
                        )}
                        <button
                          className="change-photo-btn absolute bottom-0 right-0 w-8 h-8 bg-orange-500 dark:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
                          onClick={() => setShowProfileForm(true)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="profile-info text-center md:text-left flex-1">
                        <h2 className="profile-name text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {donorProfile.firstName} {donorProfile.lastName}
                        </h2>
                        <p className="profile-bio text-gray-600 dark:text-gray-300 mb-4">
                          {donorProfile.bio || 'No bio added yet'}
                        </p>

                        <div className="profile-badges flex flex-wrap gap-2 justify-center md:justify-start">
                          <span className="profile-badge bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-medium">
                            {donorProfile.bloodGroup || 'Blood Group Not Set'}
                          </span>
                          <span className="profile-badge bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                            Donor
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="profile-sections">
                      <div className="profile-section bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 p-6 mb-6">
                        <h3 className="section-title text-gray-900 dark:text-white text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                          Personal Information
                        </h3>

                        <div className="profile-details grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="profile-detail-item bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                            <span className="detail-label block text-sm text-gray-500 dark:text-gray-400 mb-1">Email:</span>
                            <span className="detail-value text-gray-800 dark:text-gray-200 font-medium">
                              {donorProfile.email}
                            </span>
                          </div>

                          <div className="profile-detail-item bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                            <span className="detail-label block text-sm text-gray-500 dark:text-gray-400 mb-1">Phone:</span>
                            <span className="detail-value text-gray-800 dark:text-gray-200 font-medium">
                              {donorProfile.phone || 'Not provided'}
                            </span>
                          </div>

                          <div className="profile-detail-item bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                            <span className="detail-label block text-sm text-gray-500 dark:text-gray-400 mb-1">Blood Group:</span>
                            <span className="detail-value text-gray-800 dark:text-gray-200 font-medium">
                              {donorProfile.bloodGroup || 'Not provided'}
                            </span>
                          </div>

                          <div className="profile-detail-item bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                            <span className="detail-label block text-sm text-gray-500 dark:text-gray-400 mb-1">Birth Date:</span>
                            <span className="detail-value text-gray-800 dark:text-gray-200 font-medium">
                              {donorProfile.birthdate ? new Date(donorProfile.birthdate).toLocaleDateString() : 'Not provided'}
                            </span>
                          </div>

                          <div className="profile-detail-item bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                            <span className="detail-label block text-sm text-gray-500 dark:text-gray-400 mb-1">Address:</span>
                            <span className="detail-value text-gray-800 dark:text-gray-200 font-medium">
                              {donorProfile.address || 'Not provided'}
                            </span>
                          </div>

                          <div className="profile-detail-item bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                            <span className="detail-label block text-sm text-gray-500 dark:text-gray-400 mb-1">Address Details:</span>
                            <span className="detail-value text-gray-800 dark:text-gray-200 font-medium">
                              {donorProfile.addressDescription || 'Not provided'}
                            </span>
                          </div>
                        </div>

                        <div className="profile-actions flex flex-wrap gap-3">
                          <button
                            className="btn-edit-profile flex items-center gap-2 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors"
                            onClick={() => setShowProfileForm(true)}
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit Profile</span>
                          </button>

                          <button
                            className="btn-change-password flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg transition-colors"
                            onClick={() => setShowPasswordForm(true)}
                          >
                            <Lock className="h-4 w-4" />
                            <span>Change Password</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {shouldShowFoodItems && !showDonationForm && (
                  <>
                    <DashboardFoodItems
                      items={allFoodItems}
                      onDonate={handleDonate}
                      onViewDetails={handleViewDetails}
                    />

                    <PurchaseHistorySection
                      purchases={purchaseHistory}
                      loading={false}
                      error={null}
                    />
                  </>
                )}

                {/* Profile Update Form */}
                {showProfileForm && donorProfile && (
                  <div className="profile-form-container bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 p-6">
                    <div className="form-header flex justify-between items-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="form-title text-gray-900 dark:text-white text-lg font-semibold">
                        Edit Profile
                      </h3>
                      <button
                        className="btn-close w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors"
                        onClick={() => setShowProfileForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <form className="profile-edit-form" onSubmit={handleProfileUpdate}>
                      <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="form-group">
                          <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            defaultValue={donorProfile.firstName}
                            className="form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            defaultValue={donorProfile.lastName}
                            className="form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="form-group">
                          <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            defaultValue={donorProfile.phone}
                            className="form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="bloodGroup" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                            Blood Group
                          </label>
                          <select
                            id="bloodGroup"
                            name="bloodGroup"
                            defaultValue={donorProfile.bloodGroup}
                            className="form-select w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
                            required
                          >
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
                      </div>

                      <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="form-group">
                          <label htmlFor="address" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            defaultValue={donorProfile.address}
                            className="form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="addressDescription" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                            Address Details
                          </label>
                          <input
                            type="text"
                            id="addressDescription"
                            name="addressDescription"
                            defaultValue={donorProfile.addressDescription}
                            className="form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group full-width mb-4">
                        <label htmlFor="bio" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          defaultValue={donorProfile.bio}
                          className="form-textarea w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors resize-vertical"
                          rows={3}
                        ></textarea>
                      </div>

                      <div className="form-group full-width mb-6">
                        <label htmlFor="userPhoto" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                          Profile Photo
                        </label>
                        <div className="image-upload-container">
                          <input
                            type="file"
                            id="userPhoto"
                            name="userPhoto"
                            className="file-input hidden"
                            accept="image/*"
                          />
                          <label
                            htmlFor="userPhoto"
                            className="upload-area border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                          >
                            <Upload className="h-12 w-12 text-orange-500 dark:text-orange-400 mb-3" />
                            <span className="upload-text text-gray-600 dark:text-gray-300 text-center">
                              Click to upload or drag and drop
                            </span>
                            <span className="upload-hint text-gray-500 dark:text-gray-500 text-xs mt-2">
                              PNG, JPG up to 5MB
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Button container - needs dark mode styling */}
                      <div className="form-actions flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">

                        <button
                          type="submit"
                          className="btn-save px-6 py-2.5 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-2"
                          disabled={profileLoading}
                        >
                          {profileLoading ? (
                            <>
                              <span className="spinner-sm w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>Save Changes</span>
                            </>
                          )}
                        </button>
                      </div>

                    </form>
                  </div>
                )}

                {/* Password Change Form */}
                {showPasswordForm && (
                  <div className="password-form-container bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 p-6">
                    <div className="form-header flex justify-between items-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="form-title text-gray-900 dark:text-white text-lg font-semibold">
                        Change Password
                      </h3>
                      <button
                        className="btn-close w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors"
                        onClick={() => setShowPasswordForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <form className="password-change-form" onSubmit={handlePasswordChange}>
                      {/* Current Password Field with Visibility Toggle */}
                      <div className="form-group mb-4">
                        <label htmlFor="currentPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                          Current Password
                        </label>
                        <div className="password-input-wrapper relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordFormChange}
                            className="form-input password-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors pr-10"
                            required
                          />
                          <button
                            type="button"
                            className="password-visibility-toggle absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            tabIndex="-1"
                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                          >
                            {showCurrentPassword ?
                              <EyeOff className="h-5 w-5" /> :
                              <Eye className="h-5 w-5" />
                            }
                          </button>
                        </div>
                      </div>

                      {/* New Password Field with Visibility Toggle */}
                      <div className="form-group mb-4">
                        <label htmlFor="newPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                          New Password
                        </label>
                        <div className="password-input-wrapper relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordFormChange}
                            className={`form-input password-input w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors pr-10 ${passwordForm.newPassword && !passwordValidation.isValid
                              ? 'border-red-300 dark:border-red-700'
                              : 'border-gray-300 dark:border-gray-600'
                              }`}
                            required
                          />
                          <button
                            type="button"
                            className="password-visibility-toggle absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            tabIndex="-1"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword ?
                              <EyeOff className="h-5 w-5" /> :
                              <Eye className="h-5 w-5" />
                            }
                          </button>
                        </div>

                        {passwordForm.newPassword && (
                          <div className="password-strength-container mt-2">
                            <div className="password-strength-indicator">
                              <div className="strength-bar-container h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`strength-bar h-full rounded-full transition-all duration-300 ${!passwordForm.newPassword ? '' :
                                    passwordValidation.isValid ? 'bg-green-500 dark:bg-green-400 strength-high' :
                                      Object.values(passwordValidation.requirements).filter(Boolean).length >= 3 ? 'bg-yellow-500 dark:bg-yellow-400 strength-medium' :
                                        'bg-red-500 dark:bg-red-400 strength-low'
                                    }`}
                                  style={{
                                    width: `${passwordForm.newPassword ?
                                      Math.max(20, (Object.values(passwordValidation.requirements).filter(Boolean).length / 5) * 100)
                                      : 0}%`
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className={`strength-label text-xs font-medium ${!passwordForm.newPassword ? 'text-gray-500 dark:text-gray-400' :
                                  passwordValidation.isValid ? 'text-green-600 dark:text-green-400 strong' :
                                    Object.values(passwordValidation.requirements).filter(Boolean).length >= 3 ? 'text-yellow-600 dark:text-yellow-400 medium' :
                                      'text-red-600 dark:text-red-400 weak'
                                  }`}>
                                  {!passwordForm.newPassword ? 'Password strength' :
                                    passwordValidation.isValid ? 'Strong password' :
                                      Object.values(passwordValidation.requirements).filter(Boolean).length >= 3 ? 'Medium strength' :
                                        'Weak password'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {Object.values(passwordValidation.requirements).filter(Boolean).length}/5 requirements met
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Password requirements list */}
                      <div className="password-requirements-container bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="requirements-title text-gray-700 dark:text-gray-300 font-medium mb-3 text-sm">
                          Password must have:
                        </h4>
                        <ul className="requirements-list space-y-2">
                          <li className={`flex items-center gap-2 text-sm ${passwordValidation.requirements.minLength
                            ? 'text-green-600 dark:text-green-400 met'
                            : 'text-gray-600 dark:text-gray-400 unmet'
                            }`}>
                            <CheckCircle className={`h-4 w-4 ${passwordValidation.requirements.minLength
                              ? 'text-green-500 dark:text-green-400'
                              : 'text-gray-300 dark:text-gray-600'
                              }`} />
                            <span>At least 8 characters</span>
                          </li>
                          <li className={`flex items-center gap-2 text-sm ${passwordValidation.requirements.hasUpperCase
                            ? 'text-green-600 dark:text-green-400 met'
                            : 'text-gray-600 dark:text-gray-400 unmet'
                            }`}>
                            <CheckCircle className={`h-4 w-4 ${passwordValidation.requirements.hasUpperCase
                              ? 'text-green-500 dark:text-green-400'
                              : 'text-gray-300 dark:text-gray-600'
                              }`} />
                            <span>At least one uppercase letter (A-Z)</span>
                          </li>
                          <li className={`flex items-center gap-2 text-sm ${passwordValidation.requirements.hasLowerCase
                            ? 'text-green-600 dark:text-green-400 met'
                            : 'text-gray-600 dark:text-gray-400 unmet'
                            }`}>
                            <CheckCircle className={`h-4 w-4 ${passwordValidation.requirements.hasLowerCase
                              ? 'text-green-500 dark:text-green-400'
                              : 'text-gray-300 dark:text-gray-600'
                              }`} />
                            <span>At least one lowercase letter (a-z)</span>
                          </li>
                          <li className={`flex items-center gap-2 text-sm ${passwordValidation.requirements.hasDigit
                            ? 'text-green-600 dark:text-green-400 met'
                            : 'text-gray-600 dark:text-gray-400 unmet'
                            }`}>
                            <CheckCircle className={`h-4 w-4 ${passwordValidation.requirements.hasDigit
                              ? 'text-green-500 dark:text-green-400'
                              : 'text-gray-300 dark:text-gray-600'
                              }`} />
                            <span>At least one number (0-9)</span>
                          </li>
                          <li className={`flex items-center gap-2 text-sm ${passwordValidation.requirements.hasSpecialChar
                            ? 'text-green-600 dark:text-green-400 met'
                            : 'text-gray-600 dark:text-gray-400 unmet'
                            }`}>
                            <CheckCircle className={`h-4 w-4 ${passwordValidation.requirements.hasSpecialChar
                              ? 'text-green-500 dark:text-green-400'
                              : 'text-gray-300 dark:text-gray-600'
                              }`} />
                            <span>At least one special character (!@#$%^&*)</span>
                          </li>
                        </ul>
                      </div>

                      {/* Confirm Password Field with Visibility Toggle */}
                      <div className="form-group mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                          Confirm New Password
                        </label>
                        <div className="password-input-wrapper relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordFormChange}
                            className={`form-input password-input w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors pr-10 ${passwordForm.confirmPassword && !passwordsMatch
                              ? 'border-red-300 dark:border-red-700'
                              : 'border-gray-300 dark:border-gray-600'
                              }`}
                            required
                          />
                          <button
                            type="button"
                            className="password-visibility-toggle absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex="-1"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ?
                              <EyeOff className="h-5 w-5" /> :
                              <Eye className="h-5 w-5" />
                            }
                          </button>
                        </div>

                        {passwordForm.confirmPassword && !passwordsMatch && (
                          <div className="password-mismatch-warning flex items-center gap-2 mt-1 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>Passwords don't match</span>
                          </div>
                        )}

                        {passwordForm.confirmPassword && passwordsMatch && (
                          <div className="password-match-indicator flex items-center gap-2 mt-1 text-green-600 dark:text-green-400 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>Passwords match</span>
                          </div>
                        )}
                      </div>

                      <div className="form-actions flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                          type="button"
                          className="btn-cancel px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                          onClick={() => setShowPasswordForm(false)}
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className={`btn-save px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${(profileLoading || !passwordValidation.isValid || !passwordsMatch)
                            ? 'bg-orange-400/70 dark:bg-orange-700/70 cursor-not-allowed text-white/80 dark:text-white/80'
                            : 'bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white'
                            }`}
                          disabled={
                            profileLoading ||
                            !passwordValidation.isValid ||
                            !passwordsMatch
                          }
                        >
                          {profileLoading ? (
                            <>
                              <span className="spinner-sm w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>Update Password</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Custom scrollbar styling */}
                <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 10px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(234, 88, 12, 0.4);
            border-radius: 10px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(234, 88, 12, 0.6);
          }
          
          /* For dark mode */
          .dark .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
          }
          
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(234, 88, 12, 0.3);
          }
          
          .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(234, 88, 12, 0.5);
          }
        `}</style>
              </div>
            </div>
          </div>
        )}

        {showRequestsModal && <DonationRequestsModal />}

        {/* Purchase Modal - MUST be present */}
        {showPurchaseModal && selectedFoodForPurchase && (
          <PurchaseDonateModal
            food={selectedFoodForPurchase}
            onClose={() => setShowPurchaseModal(false)}
            onSubmit={handlePurchaseSubmit}
          />
        )}

        {showAllFoodItems && (
          <AllFoodItemsView
            items={allFoodItems}
            onDonate={handleDirectDonate}
            onViewDetails={handleViewDetails}
            onClose={() => setShowAllFoodItems(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;