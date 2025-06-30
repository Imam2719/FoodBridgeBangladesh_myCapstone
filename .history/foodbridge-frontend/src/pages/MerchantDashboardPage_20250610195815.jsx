import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ShoppingBag,
  Clock, X, PauseCircle, PlayCircle,
  MapPin, DollarSign, Store, Calendar, Tag, Coffee, User, AlertCircle, ArrowRight, Activity,
  Award, ChevronDown, Heart, MessageSquare, History, Settings, Phone, Mail, Send, Eye,
  CheckCircle, Camera, Upload, Save, CreditCard, Briefcase, Wallet, LogOut, Users, Package // Add Package here
} from 'lucide-react';

import '../style/MerchantDashboardPage.css';
const MerchantDashboard = () => {
  // ==========================================
  // STATE DECLARATIONS
  // ==========================================
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [avatarFile, setAvatarFile] = useState(null);
  const avatarInputRef = useRef(null);
  const [feesLoading, setFeesLoading] = useState(false);
  const [donationsOpen, setDonationsOpen] = useState(false);
  const [modalSource, setModalSource] = useState(null);
  const [selectedMainTab, setSelectedMainTab] = useState('listings');
  const [donationsSubTab, setDonationsSubTab] = useState('active');
  const [merchantDonations, setMerchantDonations] = useState([]);
  const [pendingDonations, setPendingDonations] = useState([]);
  const [rejectedDonations, setRejectedDonations] = useState([]);
  const [completedDonations, setCompletedDonations] = useState([]);
  const [donationLoading, setDonationLoading] = useState(false);
  const [donationError, setDonationError] = useState(null);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [selectedDonationForRequests, setSelectedDonationForRequests] = useState(null);
  const [donationRequests, setDonationRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [salesHistoryOpen, setSalesHistoryOpen] = useState(false);
  const [salesHistory, setSalesHistory] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [salesError, setSalesError] = useState('');

  const [currentItem, setCurrentItem] = useState({
    id: null,
    name: '',
    description: '',
    foodCategory: 'restaurant',
    foodType: '',
    price: '',
    quantity: 1,
    expiryDate: '',
    location: '',
    storeName: '',
    makingTime: '',
    deliveryTime: '',
    dietaryInfo: [],
    imageUrl: '',
    isPaused: false
  });
  // State for donation management
  const [viewDonationModalOpen, setViewDonationModalOpen] = useState(false);
  const [editDonationModalOpen, setEditDonationModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState(null);

  const [statsVisible, setStatsVisible] = useState(true);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donationItem, setDonationItem] = useState(null);
  const [donationData, setDonationData] = useState({
    organization: '',
    quantity: 1,
    notes: '',
    pickupDate: '',
    pickupTime: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: ''
  });
  //
  // Add these states to MerchantDashboard component
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageStats, setMessageStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    readMessages: 0
  });

  // Add state for new message composition
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessageData, setNewMessageData] = useState({
    toEmail: '',
    subject: '',
    message: ''
  });

  // Fetch messages for merchant
  const fetchMerchantMessages = async () => {
    if (!merchantId) return;

    setMessagesLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/merchant/messages/${merchantId}`);

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        console.log('Fetched merchant messages:', data);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Fetch message statistics
  const fetchMessageStats = async () => {
    if (!merchantId) return;

    try {
      const response = await fetch(`http://localhost:8080/api/merchant/messages/${merchantId}/stats`);

      if (response.ok) {
        const stats = await response.json();
        setMessageStats(stats);
      }
    } catch (error) {
      console.error('Error fetching message stats:', error);
    }
  };

  // Send new message
  const handleSendNewMessage = async (e) => {
    e.preventDefault();

    try {
      const authData = JSON.parse(localStorage.getItem('authUser') || sessionStorage.getItem('authUser'));
      const merchantEmail = authData?.email || '';

      const formData = new FormData();
      formData.append('merchantId', merchantId);
      formData.append('merchantEmail', merchantEmail);
      formData.append('toEmail', newMessageData.toEmail);
      formData.append('subject', newMessageData.subject);
      formData.append('message', newMessageData.message);

      const response = await fetch('http://localhost:8080/api/merchant/messages/send', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setShowNewMessageModal(false);
        setNewMessageData({ toEmail: '', subject: '', message: '' });
        fetchMerchantMessages(); // Refresh messages
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    }
  };

  const handleReplyMessage = async () => {
    if (!replyContent.trim() || !selectedMessage) return;

    try {
      const authData = JSON.parse(localStorage.getItem('authUser') || sessionStorage.getItem('authUser'));
      const merchantEmail = authData?.email || '';

      const formData = new FormData();
      formData.append('merchantId', merchantId);
      formData.append('merchantEmail', merchantEmail);
      formData.append('replyContent', replyContent);

      const response = await fetch(`http://localhost:8080/api/merchant/messages/reply/${selectedMessage.id}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        // Add reply to the thread
        const updatedMessages = messages.map(msg => {
          if (msg.id === selectedMessage.id) {
            const reply = {
              id: `REPLY-${Date.now()}`,
              sender: 'Me',
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              message: replyContent
            };
            return {
              ...msg,
              thread: [...msg.thread, reply]
            };
          }
          return msg;
        });

        setMessages(updatedMessages);
        setReplyContent('');

        const updatedSelectedMessage = updatedMessages.find(msg => msg.id === selectedMessage.id);
        setSelectedMessage(updatedSelectedMessage);

        alert('Reply sent successfully!');
      } else {
        alert('Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply');
    }
  };
  //End message 
  //
  const [merchantId, setMerchantId] = useState(() => {
    try {
      const authUserJSON = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');

      if (authUserJSON) {
        const authUser = JSON.parse(authUserJSON);
        if (authUser && authUser.userId) {
          localStorage.setItem('merchantId', authUser.userId);
          return authUser.userId;
        }
      }
      return null;
    } catch (error) {
      console.error('Error retrieving merchant ID:', error);
      return null;
    }
  });
  //
  const [overviewStats, setOverviewStats] = useState({
    totalItemsSold: 0,
    totalRevenue: 0,
    activeListings: 0,
    loading: true
  });

  useEffect(() => {
    if (merchantId && foodItems.length >= 0) {
      fetchOverviewStats();
    }
  }, [merchantId, foodItems]);

  // REPLACE getTotalItemsSaved function with:
  const getTotalItemsSold = () => {
    return overviewStats.totalItemsSold;
  };

  //


  const handleSalesHistory = () => {
    setSalesHistoryOpen(true);
    setMessagesOpen(false);
    setProfileOpen(false);
    setFeesOpen(false);

    // Fetch sales data when opening
    fetchSalesHistory();
  };

  const handleDeleteSale = async (saleId) => {
    if (!window.confirm('Are you sure you want to permanently delete this sale record? This action cannot be undone.')) {
      return;
    }

    try {
      console.log(`Deleting sale ID: ${saleId} for merchant ID: ${merchantId}`);

      const response = await fetch(
        `http://localhost:8080/api/merchant/sales/${saleId}?merchantId=${merchantId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove the deleted sale from the state
        setSalesHistory(prevSales =>
          prevSales.filter(sale => sale.id !== saleId)
        );

        alert('Sale record deleted successfully');
        console.log(`Successfully deleted sale ID: ${saleId}`);
      } else {
        throw new Error(data.message || 'Failed to delete sale');
      }

    } catch (error) {
      console.error('Error deleting sale:', error);
      alert(`Failed to delete sale record: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getSaleStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'status-completed';
      case 'PENDING':
        return 'status-pending';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return 'status-unknown';
    }
  };


  // 
  const fileInputRef = useRef(null);
  //
  const [imageFile, setImageFile] = useState(null);
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  useEffect(() => {
    const checkAuthenticationStatus = () => {
      const authUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
      const merchantId = localStorage.getItem('merchantId');
      console.log('Authentication Check:', {
        authUser: !!authUser,
        merchantId: merchantId
      });

      if (!authUser || !merchantId) {
        window.location.href = '/login';
        return false;
      }
      return true;
    };

    checkAuthenticationStatus();
  }, []);



  const fetchOverviewStats = async () => {
    if (!merchantId) {
      console.error('No merchant ID available for stats fetch');
      return;
    }

    try {
      console.log(`Fetching overview stats for merchant ID: ${merchantId}`);

      // Fetch sales data for revenue and items sold
      const salesResponse = await fetch(`http://localhost:8080/api/merchant/sales/merchant/${merchantId}`);
      let totalItemsSold = 0;
      let totalRevenue = 0;

      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        console.log('Sales data for stats:', salesData);

        // Calculate total items sold and revenue from actual sales
        totalItemsSold = salesData.reduce((total, sale) => {
          return total + (sale.quantitySold || 0);
        }, 0);

        totalRevenue = salesData.reduce((total, sale) => {
          return total + parseFloat(sale.totalAmount || 0);
        }, 0);
      } else {
        console.warn('Failed to fetch sales data for stats');
      }

      // Calculate active listings from current food items
      const activeListings = foodItems.filter(item => !item.isPaused).length;

      // Update stats state
      setOverviewStats({
        totalItemsSold,
        totalRevenue,
        activeListings,
        loading: false
      });

      console.log('Updated overview stats:', {
        totalItemsSold,
        totalRevenue: totalRevenue.toFixed(2),
        activeListings
      });

    } catch (error) {
      console.error('Error fetching overview stats:', error);
      setOverviewStats(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchSalesHistory = async () => {
    if (!merchantId) {
      console.error('No merchant ID available for sales fetch');
      setSalesError('Invalid merchant ID. Please login again.');
      return;
    }

    setSalesLoading(true);
    setSalesError('');

    try {
      console.log(`Fetching sales history for merchant ID: ${merchantId}`);
      const response = await fetch(`http://localhost:8080/api/merchant/sales/merchant/${merchantId}/detailed`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        setSalesError(`Error: ${errorData.message || 'Failed to load sales history'}`);
        return;
      }

      const data = await response.json();
      console.log('Sales data received:', data);

      if (data.success && data.sales) {
        setSalesHistory(data.sales);
        console.log(`Loaded ${data.sales.length} sales records`);
      } else {
        setSalesError('No sales data received from server');
      }

    } catch (error) {
      console.error('Error fetching sales history:', error);
      setSalesError('Failed to load sales history. Please check your connection.');
    } finally {
      setSalesLoading(false);
    }
  };


  useEffect(() => {
    const fetchMerchantProfile = async () => {
      if (!merchantId) {
        console.error('No merchant ID available for profile fetch');
        setProfileError('User authentication issue. Please log out and log in again.');
        return;
      }

      setProfileLoading(true);
      setProfileError('');

      try {
        console.log(`Attempting to fetch profile with merchantId: ${merchantId}`);
        const response = await fetch(`http://localhost:8080/api/merchant/profile?merchantId=${merchantId}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to fetch merchant profile:`, {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
            merchantId: merchantId
          });

          if (response.status === 404) {
            setProfileError('Your merchant profile was not found. Please contact support.');
          } else {
            setProfileError(`Failed to load profile data (${response.status}). Please try again later.`);
          }
          return;
        }

        const merchantData = await response.json();
        setUserProfile({
          name: `${merchantData.ownerFirstName} ${merchantData.ownerLastName}`,
          email: merchantData.email,
          phone: merchantData.phoneNumber || '',
          address: merchantData.businessAddress || '',
          storeName: merchantData.businessName || '',
          bio: merchantData.businessDescription || '',
          avatar: merchantData.logoBase64 ?
            `data:${merchantData.logoType || 'image/jpeg'};base64,${merchantData.logoBase64}` :
            'https://randomuser.me/api/portraits/men/41.jpg',
          businessType: merchantData.businessType || '',
          businessLicenseNumber: merchantData.businessLicenseNumber || '',
          city: merchantData.city || '',
          stateProvince: merchantData.stateProvince || '',
          postalCode: merchantData.postalCode || ''
        });

        console.log('Successfully loaded merchant profile data');

      } catch (error) {
        console.error('Error fetching merchant profile:', error);
        setProfileError('An unexpected error occurred while loading your profile. Please try again later.');
      } finally {
        setProfileLoading(false);
      }
    };

    if (profileOpen) {
      fetchMerchantProfile();
    }
  }, [merchantId, profileOpen]);

  useEffect(() => {
    if (!merchantId) {
      console.error('No merchant ID available - redirecting to login');
      window.location.replace('/login');
    }
  }, []);

  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    storeName: '',
    bio: '',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg', // Default avatar
    businessType: '',
    businessLicenseNumber: '',
    city: '',
    stateProvince: '',
    postalCode: ''
  });

  const [orders, setOrders] = useState([]);
  // ==========================================
  // NEW STATE FOR PAY FEES FEATURE
  // ==========================================
  const [feesOpen, setFeesOpen] = useState(false);
  const [feeData, setFeeData] = useState({
    currentBalance: 0,
    dueDate: '',
    platformFee: 0,
    transactionFees: 0,
    promotionalFees: 0,
    previousBalance: 0,
    paymentHistory: []
  });

  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        if (!merchantId) {
          console.error('No merchant ID available');
          return;
        }

        console.log(`Fetching food items with merchantId: ${merchantId}`);

        const response = await fetch(`http://localhost:8080/api/merchant/food-items?merchantId=${merchantId}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to fetch food items: ${response.status} - ${errorText}`);
          alert("Failed to load your food listings. Please try again later.");
          return;
        }

        const foodItemsData = await response.json();
        const processedFoodItems = foodItemsData.map(item => ({
          ...item,
          foodCategory: item.foodCategory?.toLowerCase() || 'other',
          imageUrl: item.imageBase64 && item.imageContentType
            ? `data:${item.imageContentType};base64,${item.imageBase64}`
            : null
        }));

        setFoodItems(processedFoodItems);

      } catch (error) {
        console.error('Error fetching food items:', error);
        alert("Error connecting to server. Please check your connection and try again.");
      }
    };
    if (merchantId) {
      fetchFoodItems();
    }
  }, [merchantId]);

  const fetchMerchantDonations = async () => {
    if (!merchantId) {
      console.error('No merchant ID available');
      return;
    }

    setDonationLoading(true);
    setDonationError(null);

    try {
      console.log(`Fetching ${donationsSubTab} donations for merchant ID: ${merchantId}`);

      let statusValue;
      switch (donationsSubTab) {
        case 'active':
          statusValue = 'Active';
          break;
        case 'pending':
          statusValue = 'Pending';
          break;
        case 'rejected':
          statusValue = 'Rejected';
          break;
        case 'completed':
          statusValue = 'Completed';
          break;
        default:
          statusValue = 'Active';
      }

      const url = `http://localhost:8080/api/merchant/donate/merchant/${merchantId}/status/${statusValue}`;

      console.log("Fetching from URL:", url); // Debug log to verify URL

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch donations: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Received ${data.length} ${donationsSubTab} donations:`, data);
      const formattedDonations = data.map(donation => ({
        id: donation.id,
        foodName: donation.foodName || 'Unnamed Donation',
        category: donation.category?.label || donation.category || 'Uncategorized',
        quantity: donation.quantity || 'Unknown',
        expiry: donation.expiryDate,
        location: donation.location || 'No location',
        donorType: donation.donorType || 'Merchant',
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
      switch (donationsSubTab) {
        case 'active':
          setMerchantDonations(formattedDonations);
          break;
        case 'pending':
          setPendingDonations(formattedDonations);
          break;
        case 'rejected':
          setRejectedDonations(formattedDonations);
          break;
        case 'completed':
          setCompletedDonations(formattedDonations);
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${donationsSubTab} donations:`, error);
      setDonationError(error.message);
    } finally {
      setDonationLoading(false);
    }
  };

  useEffect(() => {
    if ((donationsOpen || selectedMainTab === 'donations') && merchantId) {
      fetchMerchantDonations();
    }
  }, [donationsOpen, selectedMainTab, donationsSubTab, merchantId]);


  const handleCheckRequests = async (donation) => {
    try {
      setRequestsLoading(true);
      setSelectedDonationForRequests(donation);

      console.log(`Checking requests for donation ID: ${donation.id}, merchantId: ${merchantId}`);
      console.log("Stored merchantId in localStorage:", localStorage.getItem('merchantId'));
      console.log("Stored merchantId in sessionStorage:", sessionStorage.getItem('merchantId'));

      if (!merchantId) {
        throw new Error('Merchant ID is missing or invalid');
      }

      const url = `http://localhost:8080/api/merchant/donations/${donation.id}/requests?merchantId=${merchantId}`;
      console.log("Request URL:", url);

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText || response.statusText}`);
      }
      const data = await response.json();
      console.log('Complete response data:', data);

      if (!Array.isArray(data)) {
        console.error('Expected array response but received:', typeof data, data);
        throw new Error('Invalid response format: expected an array of requests');
      }

      const pendingRequests = data.filter(request => {
        if (!request.status) {
          console.warn('Request missing status field:', request);
          return false;
        }

        const status = request.status.toUpperCase();
        const isPending = status === "PENDING";

        console.log(`Request ID ${request.id}: status = "${request.status}" → isPending = ${isPending}`);
        return isPending;
      });

      console.log(`Found ${pendingRequests.length} pending requests out of ${data.length} total requests`);
      setDonationRequests(pendingRequests);

      setShowRequestsModal(true);
      if (donationsOpen) {
        setDonationsOpen(false);
      }
    } catch (error) {
      console.error('Error processing requests:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(`Failed to load requests: ${errorMessage}\n\nPlease check the console for details and try again.`);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleUpdateRequestStatus = async (requestId, status, note = '') => {
    try {
      setRequestsLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/merchant/requests/${requestId}/status?merchantId=${merchantId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: status,
            responseNote: note
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update request status: ${response.statusText}`);
      }
      if (selectedDonationForRequests) {
        const refreshResponse = await fetch(
          `http://localhost:8080/api/merchant/donations/${selectedDonationForRequests.id}/requests?merchantId=${merchantId}`,
          { credentials: 'include' }
        );

        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json();
          const pendingRequests = refreshedData.filter(request => request.status === "PENDING");
          setDonationRequests(pendingRequests);
        }
      }

      if (donationRequests.length === 0) {
        setShowRequestsModal(false);
      }

      fetchMerchantDonations();

    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status: ' + error.message);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setCurrentItem({ ...item });
    } else {
      setCurrentItem({
        id: null,
        name: '',
        description: '',
        foodCategory: 'restaurant',
        foodType: '',
        price: '',
        quantity: 1,
        expiryDate: '',
        location: '',
        storeName: '',
        makingTime: '',
        deliveryTime: '',
        dietaryInfo: [],
        imageUrl: '',
        isPaused: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value
    });
  };

  const handleDietaryChange = (option) => {

    let updatedDietaryInfo = [...(donationData.dietaryInfo || [])];

    const isSelected = updatedDietaryInfo.includes(option);

    if (isSelected) {

      updatedDietaryInfo = updatedDietaryInfo.filter(item => item !== option);
    } else {

      updatedDietaryInfo.push(option);
    }

    setDonationData({
      ...donationData,
      dietaryInfo: updatedDietaryInfo
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");

    const formData = new FormData();

    if (currentItem.id) {
      formData.append('id', currentItem.id);
      console.log(`Updating existing item with ID: ${currentItem.id}`);
    } else {
      console.log("Creating new food item");
    }

    formData.append('name', currentItem.name);
    formData.append('description', currentItem.description);
    formData.append('foodCategory', currentItem.foodCategory.toUpperCase());
    formData.append('foodType', currentItem.foodType);
    formData.append('price', currentItem.price);
    formData.append('quantity', currentItem.quantity);
    formData.append('expiryDate', currentItem.expiryDate);
    formData.append('location', currentItem.location);
    formData.append('storeName', currentItem.storeName);
    formData.append('makingTime', currentItem.makingTime);
    formData.append('deliveryTime', currentItem.deliveryTime);

    if (currentItem.dietaryInfo && currentItem.dietaryInfo.length > 0) {
      currentItem.dietaryInfo.forEach(item => {
        formData.append('dietaryInfo', item);
      });
    }

    formData.append('isPaused', currentItem.isPaused === true ? 'true' : 'false');

    if (!merchantId) {
      alert('You need to be logged in with a valid merchant account to create listings.');
      return;
    }
    formData.append('merchantId', merchantId.toString());
    if (imageFile) {
      console.log(`Appending image file: ${imageFile.name}, size: ${imageFile.size} bytes`);
      formData.append('image', imageFile);
    } else {
      console.log("No new image file to upload");
    }
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      let response;
      let url;

      if (currentItem.id) {

        url = `http://localhost:8080/api/merchant/food-items/${currentItem.id}?merchantId=${merchantId}`;
        console.log(`PUT request to: ${url}`);

        response = await fetch(url, {
          method: 'PUT',
          body: formData
        });
      } else {
        url = `http://localhost:8080/api/merchant/food-items?merchantId=${merchantId}`;
        console.log(`POST request to: ${url}`);

        response = await fetch(url, {
          method: 'POST',
          body: formData
        });
      }
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', errorText);
        console.error('Status:', response.status, response.statusText);
        alert(`Failed to save food item: ${errorText || response.statusText}`);
        return;
      }

      const updatedItem = await response.json();
      console.log('Item saved successfully:', updatedItem);
      const processedItem = {
        ...updatedItem,
        foodCategory: updatedItem.foodCategory?.toLowerCase() || 'other', // Add null check
        imageUrl: updatedItem.imageBase64 && updatedItem.imageContentType
          ? `data:${updatedItem.imageContentType};base64,${updatedItem.imageBase64}`
          : null
      };

      if (currentItem.id) {
        console.log(`Updating existing item in state with ID: ${processedItem.id}`);
        setFoodItems(prevItems =>
          prevItems.map(item => item.id === processedItem.id ? processedItem : item)
        );
      } else {

        console.log(`Adding new item to state with ID: ${processedItem.id}`);
        setFoodItems(prevItems => [processedItem, ...prevItems]);
      }
      setIsModalOpen(false);
      setImageFile(null);
      console.log("Refreshing full food items list");
      try {
        const refreshResponse = await fetch(`http://localhost:8080/api/merchant/food-items?merchantId=${merchantId}`);

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          console.log(`Fetched ${refreshData.length} food items in refresh`);

          const mappedData = refreshData.map(item => ({
            ...item,
            foodCategory: item.foodCategory?.toLowerCase() || 'other', // Add null check
            imageUrl: item.imageBase64 && item.imageContentType ? `data:${item.imageContentType};base64,${item.imageBase64}` : null
          }));

          setFoodItems(mappedData);
        } else {
          console.error(`Failed to refresh food items list: ${refreshResponse.status} ${refreshResponse.statusText}`);
        }
      } catch (refreshError) {
        console.error('Error during refresh operation:', refreshError);
      }

    } catch (error) {
      console.error('Network or other error:', error);
      alert(`Error saving food item: ${error.message}`);
    }
  };
  const handleMarkAsCompleted = async (donationId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/merchant/donate/${donationId}/status?merchantId=${merchantId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Completed'
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to mark donation as completed: ${response.statusText}`);
      }

      alert('Donation marked as completed successfully');
      fetchMerchantDonations();
    } catch (error) {
      console.error('Error marking donation as completed:', error);
      alert('Failed to mark donation as completed: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/merchant/food-items/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setFoodItems(foodItems.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error('Error deleting food item:', error);
      }
    }
  };

  const togglePause = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/merchant/food-items/${id}/toggle-pause`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to toggle pause status');
      }

      const updatedItem = await response.json();
      setFoodItems(prevItems =>
        prevItems.map(item =>
          item.id === id
            ? {
              ...item,
              isPaused: updatedItem.paused,
              foodCategory: updatedItem.foodCategory.toLowerCase()
            }
            : item
        )
      );
    } catch (error) {
      console.error('Error toggling pause status:', error);
      alert('Failed to pause/resume the item. Please try again.');
    }
  };

  const toggleStats = () => {
    setStatsVisible(!statsVisible);
  };

  const handleOpenDonateModal = (item) => {
    setDonationItem(item);

    const maxQuantity = item.remainingQuantity !== undefined
      ? item.remainingQuantity
      : item.quantity;

    setDonationData({
      foodName: item.name,
      description: item.description,
      donationCategory: mapFoodCategoryToDonationCategory(item.foodCategory),
      foodType: item.foodType,
      quantity: 1,
      expiryDate: item.expiryDate,
      preparationDate: new Date().toISOString().split('T')[0],
      location: item.location,
      donorType: item.foodCategory === 'restaurant' ? 'Restaurant' :
        item.foodCategory === 'grocery' ? 'Grocery Store' : 'Other',
      dietaryInfo: item.dietaryInfo || [],
      packaging: '',
      storageInstructions: '',
      notes: '',
      maxQuantity: maxQuantity,
      storeName: item.storeName
    });

    setIsDonateModalOpen(true);
  };

  const mapFoodCategoryToDonationCategory = (foodCategory) => {
    switch (foodCategory) {
      case 'restaurant':
        return 'RESTAURANT_SURPLUS';
      case 'grocery':
        return 'GROCERY_EXCESS';
      default:
        return 'OTHER';
    }
  };


  const handleCloseDonateModal = () => {
    setIsDonateModalOpen(false);
  };

  const handleDonationInputChange = (e) => {
    const { name, value } = e.target;
    setDonationData({
      ...donationData,
      [name]: value
    });
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create donation payload
      const donationPayload = {
        foodItemId: donationItem.id,
        merchantId: merchantId,
        foodName: donationData.foodName,
        description: donationData.description,
        category: donationData.donationCategory,
        quantity: parseInt(donationData.quantity, 10),
        expiryDate: donationData.expiryDate,
        preparationDate: donationData.preparationDate,
        location: donationData.location,
        foodType: donationData.foodType,
        donorType: donationData.donorType,
        dietaryInfo: donationData.dietaryInfo,
        packaging: donationData.packaging,
        storageInstructions: donationData.storageInstructions,
        notes: donationData.notes,
        storeName: donationData.storeName
      };

      console.log("Sending donation payload:", donationPayload);

      const response = await fetch('http://localhost:8080/api/merchant/donate/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donationPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || 'Failed to create donation');
      }

      const result = await response.json();

      const savedDonation = result.donation;

      console.log("Saved donation status:", savedDonation.status);

      setIsDonateModalOpen(false);

      alert(`Donation of ${donationData.quantity} ${donationData.foodName}(s) has been successfully created.`);

      // ADDED: Refresh food items with remaining quantities
      fetchFoodItemsWithRemaining();

      setDonationsSubTab('active');

      setTimeout(() => {
        if (selectedMainTab === 'donations' || donationsOpen) {
          fetchMerchantDonations();
        }
      }, 500);

      const formattedDonation = {
        id: savedDonation.id,
        foodName: savedDonation.foodName || 'Unnamed Donation',
        category: savedDonation.category?.label || savedDonation.category || 'Uncategorized',
        quantity: savedDonation.quantity || 'Unknown',
        expiry: savedDonation.expiryDate,
        location: savedDonation.location || 'No location',
        donorType: savedDonation.donorType || 'Merchant',
        status: savedDonation.status,
        preparation: savedDonation.preparationDate,
        packaging: savedDonation.packaging || 'Not specified',
        dietaryInfo: Array.isArray(savedDonation.dietaryInfo)
          ? savedDonation.dietaryInfo.join(', ')
          : 'Not specified',
        storageInstructions: savedDonation.storageInstructions || 'Not specified',
        imageUrl: savedDonation.imageData
          ? `data:${savedDonation.imageContentType || 'image/jpeg'};base64,${savedDonation.imageData}`
          : '/api/placeholder/400/200'
      };

      console.log("Saved donation:", savedDonation);
      console.log("Formatted donation for UI:", formattedDonation);
      console.log("Current merchantDonations state:", merchantDonations);

      if (savedDonation.status && savedDonation.status.toLowerCase().trim() === 'active') {
        setMerchantDonations(prevDonations => [formattedDonation, ...prevDonations]);

        if (selectedMainTab === 'donations' || donationsOpen) {
          setDonationsSubTab('active');
        }
      } else if (savedDonation.status.toLowerCase() === 'pending') {
        setPendingDonations(prevDonations => [formattedDonation, ...prevDonations]);
      }

    } catch (error) {
      console.error('Error creating donation:', error);
      alert(`Failed to create donation: ${error.message}`);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setCurrentItem({
        ...currentItem,
        imageUrl: imageUrl
      });
    }
  };

  const DonationRequestsModal = () => {
    const [responseNotes, setResponseNotes] = useState({});

    if (!showRequestsModal || !selectedDonationForRequests) return null;

    return (
      <div className="modal-overlay">
        <div className="donation-requests-modal">
          <div className="modal-header">
            <h2>{selectedDonationForRequests.foodName} Requests</h2>
            <button
              className="close-button"
              onClick={() => setShowRequestsModal(false)}
            >
              <X size={24} />
            </button>
          </div>

          <div className="modal-body">
            {requestsLoading ? (
              <div className="loading-indicator">
                <span className="loading-spinner"></span>
                <span>Loading requests...</span>
              </div>
            ) : donationRequests.length === 0 ? (
              <div className="no-requests-message">
                <Users className="h-16 w-16 text-gray-300" />
                <p>No requests received for this donation</p>
              </div>
            ) : (
              <div className="requests-grid">
                {donationRequests.map(request => (
                  <div className="request-card" key={request.id}>
                    <div className="request-header">
                      <div className="requester-info">
                        <div className="avatar">
                          <User className="h-5 w-5" />
                        </div>
                        <h3>{request.receiverName || 'Anonymous'}</h3>
                      </div>
                      <div className="request-date">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="request-details">
                      <div className="detail-row">
                        <span className="detail-label">Quantity:</span>
                        <span className="detail-value">{request.quantity}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Pickup Method:</span>
                        <span className="detail-value">{request.pickupMethod}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Contact:</span>
                        <span className="detail-value">{request.receiverPhone || 'Not provided'}</span>
                      </div>
                      {request.note && (
                        <div className="request-note">
                          <p>"{request.note}"</p>
                        </div>
                      )}
                    </div>

                    <div className="request-response">
                      <textarea
                        placeholder="Add a response note..."
                        value={responseNotes[request.id] || ''}
                        onChange={(e) => setResponseNotes({
                          ...responseNotes,
                          [request.id]: e.target.value
                        })}
                      ></textarea>

                      <div className="response-actions">
                        <button
                          className="btn-accept"
                          onClick={() => handleUpdateRequestStatus(
                            request.id, 'ACCEPTED', responseNotes[request.id]
                          )}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleUpdateRequestStatus(
                            request.id, 'REJECTED', responseNotes[request.id]
                          )}
                        >
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
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

  const handleViewDonation = (donation) => {
    setSelectedDonation(donation);
    setModalSource('donations');
    setDonationsOpen(false);
    setViewDonationModalOpen(true);
  };

  const handleEditDonation = (donation) => {
    setSelectedDonation({ ...donation });
    setModalSource('donations');
    setDonationsOpen(false);
    setEditDonationModalOpen(true);
  };

  const handleDeleteDonation = (donationId) => {
    setDonationToDelete(donationId);
    setModalSource('donations');
    setDonationsOpen(false);
    setDeleteConfirmationOpen(true);
  };

  // Function to confirm and execute deletion
  const confirmDeleteDonation = async () => {
    if (!donationToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/merchant/donate/${donationToDelete}?merchantId=${merchantId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete donation: ${response.statusText}`);
      }

      // Remove the deleted donation from the state
      setMerchantDonations(prevDonations =>
        prevDonations.filter(d => d.id !== donationToDelete)
      );

      // Close the confirmation dialog
      setDeleteConfirmationOpen(false);
      setDonationToDelete(null);

      // Show success notification
      alert('Donation deleted successfully');

      // Refresh donations
      fetchMerchantDonations();

    } catch (error) {
      console.error('Error deleting donation:', error);
      alert('Failed to delete donation: ' + error.message);
    }
  };

  const handleSaveDonationEdit = async (editedDonation) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/merchant/donate/${editedDonation.id}?merchantId=${merchantId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            foodName: editedDonation.foodName,
            category: editedDonation.category,
            quantity: editedDonation.quantity,
            expiryDate: editedDonation.expiry,
            location: editedDonation.location,
            // Include other fields as needed
            packaging: editedDonation.packaging,
            dietaryInfo: editedDonation.dietaryInfo,
            storageInstructions: editedDonation.storageInstructions
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update donation: ${response.statusText}`);
      }

      setMerchantDonations(prevDonations =>
        prevDonations.map(donation =>
          donation.id === editedDonation.id ? editedDonation : donation
        )
      );

      setEditDonationModalOpen(false);
      setSelectedDonation(null);
      if (modalSource === 'donations') {

        setTimeout(() => {
          setDonationsOpen(true);
          setModalSource(null); // Reset the source
        }, 10);
      }

      alert('Donation updated successfully');

      fetchMerchantDonations();

    } catch (error) {
      console.error('Error updating donation:', error);
      alert('Failed to update donation: ' + error.message);
    }
  };
  // ==========================================
  // NEW PAY FEES HANDLER FUNCTIONS
  // ==========================================
  const handleFees = async () => {
    setFeesOpen(true);
    setOrderHistoryOpen(false);
    setMessagesOpen(false);
    setProfileOpen(false);
    const authUserJSON = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    console.log('Raw authUser JSON:', authUserJSON);

    if (authUserJSON) {
      try {
        const authData = JSON.parse(authUserJSON);
        console.log('Parsed authUser:', authData);
        console.log('authData.userId:', authData.userId);
        console.log('authData.merchantId:', authData.merchantId);
        console.log('authData.id:', authData.id);
      } catch (e) {
        console.error('Error parsing authUser:', e);
      }
    }

    console.log('Current merchantId state:', merchantId);
    console.log('LocalStorage merchantId:', localStorage.getItem('merchantId'));

    if (!merchantId) {
      console.error('No merchant ID available for fee fetch');
      alert('Invalid merchant ID. Please login again.');
      return;
    }

    setFeesLoading(true);

    try {
      console.log(`Fetching fees with merchantId: ${merchantId}`);
      const response = await fetch(`http://localhost:8080/api/merchant/fees/calculate?merchantId=${merchantId}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        console.error('Full error response:', response);
        alert(`Error: ${errorData.message || 'Failed to load fee information'}`);
        return;
      }

      const feeData = await response.json();
      setFeeData(feeData);

    } catch (error) {
      console.error('Error fetching fee data:', error);
      alert('Failed to load fee information');
    } finally {
      setFeesLoading(false);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    alert(`Payment of $${paymentAmount.toFixed(2)} submitted successfully via ${paymentMethod === 'creditCard' ? 'Credit Card' : 'Bank Transfer'}`);
    const newPayment = {
      id: `PMT-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(paymentAmount),
      status: 'Processing'
    };

    setFeeData({
      ...feeData,
      currentBalance: Math.max(0, feeData.currentBalance - parseFloat(paymentAmount)),
      paymentHistory: [newPayment, ...feeData.paymentHistory]
    });
    setPaymentAmount(0);
    setFeesOpen(false);
  };

  const formatCurrency = (amount) => {
    return `৳${parseFloat(amount).toFixed(2)}`;
  };

  // ==========================================
  // POPUP HANDLERS
  // ==========================================
  const SalesHistoryModal = () => {
    if (!salesHistoryOpen) return null;

    return (
      <div className="popup-overlay">
        <div className="popup-content sales-history-popup">
          <div className="popup-header">
            <h2>Sales History</h2>
            <div className="header-actions">
              <button
                className="refresh-btn"
                onClick={fetchSalesHistory}
                disabled={salesLoading}
              >
                <Activity size={18} />
                <span>Refresh</span>
              </button>
              <button
                className="close-button"
                onClick={() => setSalesHistoryOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="popup-body">
            {salesLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <h3>Loading Sales History...</h3>
                <p>Please wait while we fetch your sales data</p>
              </div>
            ) : salesError ? (
              <div className="error-state">
                <AlertCircle size={48} className="error-icon" />
                <h3>Error Loading Sales</h3>
                <p>{salesError}</p>
                <button
                  className="retry-button"
                  onClick={fetchSalesHistory}
                >
                  <Activity size={16} />
                  <span>Retry</span>
                </button>
              </div>
            ) : salesHistory.length === 0 ? (
              <div className="empty-state">
                <History size={48} />
                <h3>No Sales History</h3>
                <p>You haven't made any sales yet. Your completed sales will appear here.</p>
              </div>
            ) : (
              <>
                <div className="sales-summary">
                  <div className="summary-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Sales</span>
                      <span className="stat-value">{salesHistory.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Revenue</span>
                      <span className="stat-value">
                        {formatCurrency(
                          salesHistory.reduce((total, sale) => total + parseFloat(sale.totalAmount || 0), 0)
                        )}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Items Sold</span>
                      <span className="stat-value">
                        {salesHistory.reduce((total, sale) => total + parseInt(sale.quantitySold || 0), 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sales-list">
                  {salesHistory.map(sale => (
                    <div key={sale.id} className="sale-card">
                      <div className="sale-header">
                        <div className="sale-info">
                          <h3 className="sale-id">Sale #{sale.id}</h3>
                          <p className="sale-date">{formatDate(sale.saleDate)}</p>
                        </div>
                        <div className={`sale-status ${getSaleStatusClass(sale.saleStatus)}`}>
                          {sale.saleStatus}
                        </div>
                      </div>

                      <div className="sale-content">
                        <div className="food-item-details">
                          <div className="food-item-header">
                            <h4 className="food-name">{sale.foodItemName || 'Unknown Item'}</h4>
                            <div className="food-category">
                              {getCategoryIcon(sale.foodCategory?.toLowerCase())}
                              <span>{getFoodCategoryLabel(sale.foodCategory?.toLowerCase())}</span>
                            </div>
                          </div>

                          {sale.foodItemDescription && (
                            <p className="food-description">{sale.foodItemDescription}</p>
                          )}

                          <div className="sale-details">
                            <div className="detail-row">
                              <div className="detail-item">
                                <Store size={14} />
                                <span>{sale.storeName || 'N/A'}</span>
                              </div>
                              <div className="detail-item">
                                <MapPin size={14} />
                                <span>{sale.location || 'N/A'}</span>
                              </div>
                            </div>

                            <div className="detail-row">
                              <div className="detail-item">
                                <Package size={14} />
                                <span>Qty: {sale.quantitySold}</span>
                              </div>
                              <div className="detail-item">
                                <DollarSign size={14} />
                                <span>Unit: {formatCurrency(sale.pricePerUnit)}</span>
                              </div>
                            </div>

                            <div className="detail-row">
                              <div className="detail-item">
                                <CreditCard size={14} />
                                <span>{sale.paymentMethod || 'N/A'}</span>
                              </div>
                              {sale.transactionId && (
                                <div className="detail-item">
                                  <span className="transaction-id">TX: {sale.transactionId}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="sale-amount">
                          <div className="amount-breakdown">
                            <div className="amount-line">
                              <span>{sale.quantitySold} × {formatCurrency(sale.pricePerUnit)}</span>
                            </div>
                            <div className="total-amount">
                              <strong>{formatCurrency(sale.totalAmount)}</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {sale.donationStatus && (
                        <div className="donation-info">
                          <div className="donation-status">
                            <Heart size={14} />
                            <span>Donation Status: {sale.donationStatus}</span>
                          </div>
                          {sale.donationLocation && (
                            <div className="donation-location">
                              <MapPin size={14} />
                              <span>Donation Location: {sale.donationLocation}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="sale-actions">
                        <div className="sale-timestamps">
                          <small>Created: {formatDate(sale.createdAt)}</small>
                        </div>

                        <div className="action-buttons">
                          <button
                            className="sale-action-btn view"
                            onClick={() => {
                              alert(`Sale Details:\n\nSale ID: ${sale.id}\nDate: ${formatDate(sale.saleDate)}\nFood Item: ${sale.foodItemName}\nQuantity: ${sale.quantitySold}\nTotal Amount: ${formatCurrency(sale.totalAmount)}\nPayment Method: ${sale.paymentMethod}\nStatus: ${sale.saleStatus}`);
                            }}
                          >
                            <Eye size={16} />
                            <span>View Details</span>
                          </button>

                          <button
                            className="sale-action-btn delete"
                            onClick={() => handleDeleteSale(sale.id)}
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const NewMessageModal = () => {
    if (!showNewMessageModal) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Send New Message</h2>
            <button className="close-button" onClick={() => setShowNewMessageModal(false)}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSendNewMessage}>
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="toEmail">To Email*</label>
                <input
                  type="email"
                  id="toEmail"
                  value={newMessageData.toEmail}
                  onChange={(e) => setNewMessageData({ ...newMessageData, toEmail: e.target.value })}
                  placeholder="recipient@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject*</label>
                <input
                  type="text"
                  id="subject"
                  value={newMessageData.subject}
                  onChange={(e) => setNewMessageData({ ...newMessageData, subject: e.target.value })}
                  placeholder="Message subject"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message*</label>
                <textarea
                  id="message"
                  value={newMessageData.message}
                  onChange={(e) => setNewMessageData({ ...newMessageData, message: e.target.value })}
                  placeholder="Type your message here..."
                  rows="6"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => setShowNewMessageModal(false)}>
                Cancel
              </button>
              <button type="submit" className="submit-button">
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order from history?')) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  const handleContactCustomer = (order) => {
    const newMessage = {
      id: `MSG-${Date.now()}`,
      sender: order.customer,
      senderAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg', // Placeholder
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: `Follow-up on order ${order.id}`,
      message: '',
      read: true,
      thread: []
    };

    setMessages([newMessage, ...messages]);
    setOrderHistoryOpen(false);
    setMessagesOpen(true);
    setSelectedMessage(newMessage);
    setReplyContent(`Hi ${order.customer}, I'm reaching out about your order ${order.id}. `);
  };

  const handleMessages = () => {
    setMessagesOpen(true);
    setOrderHistoryOpen(false);
    setProfileOpen(false);
    setFeesOpen(false);

    // Fetch real messages when opening
    fetchMerchantMessages();
    fetchMessageStats();
  };

  const handleViewMessage = (message) => {
    if (!message.read) {
      setMessages(messages.map(msg =>
        msg.id === message.id ? { ...msg, read: true } : msg
      ));
    }

    setSelectedMessage(message);
  };


  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(msg => msg.id !== messageId));
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(null);
      }
    }
  };

  const handleProfileUpdate = () => {
    setProfileOpen(true);
    setOrderHistoryOpen(false);
    setMessagesOpen(false);
    setFeesOpen(false);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      const nameParts = value.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      setUserProfile({
        ...userProfile,
        [name]: value,
        ownerFirstName: firstName,
        ownerLastName: lastName
      });
    } else {
      setUserProfile({
        ...userProfile,
        [name]: value
      });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const formData = new FormData();

      if (!userProfile.ownerFirstName || !userProfile.ownerLastName) {
        const nameParts = userProfile.name.split(' ');
        formData.append('ownerFirstName', nameParts[0] || '');
        formData.append('ownerLastName', nameParts.slice(1).join(' ') || '');
      } else {
        formData.append('ownerFirstName', userProfile.ownerFirstName);
        formData.append('ownerLastName', userProfile.ownerLastName);
      }
      formData.append('businessName', userProfile.storeName);
      formData.append('email', userProfile.email);
      formData.append('phoneNumber', userProfile.phone);
      formData.append('businessAddress', userProfile.address);
      formData.append('businessDescription', userProfile.bio);
      formData.append('businessType', userProfile.businessType);
      formData.append('businessLicenseNumber', userProfile.businessLicenseNumber);
      formData.append('city', userProfile.city);
      formData.append('stateProvince', userProfile.stateProvince);
      formData.append('postalCode', userProfile.postalCode);
      formData.append('merchantId', merchantId.toString());
      if (avatarFile) {
        formData.append('logo', avatarFile);
      }
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      const response = await fetch(`http://localhost:8080/api/merchant/profile/update?merchantId=${merchantId}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile update failed:', errorText);
        setProfileError(`Failed to update profile: ${errorText || response.statusText}`);
        return;
      }

      const updatedProfile = await response.json();
      console.log('Profile updated successfully:', updatedProfile);
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => {
        setProfileOpen(false);
      }, 2000);

    } catch (error) {
      console.error('Error updating merchant profile:', error);
      setProfileError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    avatarInputRef.current.click();
  };
  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const imageUrl = URL.createObjectURL(file);
      setUserProfile({
        ...userProfile,
        avatar: imageUrl
      });
    }
  };


  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'restaurant':
        return <Coffee size={16} />;
      case 'grocery':
        return <ShoppingBag size={16} />;
      case 'other':
        return <Tag size={16} />;
      default:
        return <ShoppingBag size={16} />;
    }
  };

  const getFoodCategoryLabel = (category) => {
    switch (category) {
      case 'restaurant':
        return 'Restaurant & Café';
      case 'grocery':
        return 'Grocery Store';
      case 'other':
        return 'Other';
      default:
        return category;
    }
  };

  const getTotalItemsSaved = () => {
    return foodItems.reduce((total, item) => total + (item.isPaused ? 0 : parseInt(item.quantity)), 0);
  };

  const getActiveListings = () => {
    return foodItems.filter(item => !item.isPaused).length;
  };

  const getTotalRevenue = () => {
    return overviewStats.totalRevenue.toFixed(2);
  };


  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'Processing':
        return 'status-processing';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const fetchFoodItemsWithRemaining = async () => {
    try {
      if (!merchantId) {
        console.error('No merchant ID available');
        return;
      }

      console.log(`Fetching food items with remaining quantity for merchantId: ${merchantId}`);

      // First get all food items
      const response = await fetch(`http://localhost:8080/api/merchant/food-items?merchantId=${merchantId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch food items: ${response.status}`);
      }

      const foodItemsData = await response.json();

      // Then get the remaining quantities for each item with the updated calculation
      const itemsWithRemaining = await Promise.all(
        foodItemsData.map(async (item) => {
          try {
            // This endpoint should now include both sold AND donated quantities
            const remainingResponse = await fetch(`http://localhost:8080/api/merchant/food-items/${item.id}/with-remaining`);

            if (remainingResponse.ok) {
              const remainingData = await remainingResponse.json();
              return {
                ...item,
                foodCategory: item.foodCategory?.toLowerCase() || 'other',
                imageUrl: item.imageBase64 && item.imageContentType
                  ? `data:${item.imageContentType};base64,${item.imageBase64}`
                  : null,
                remainingQuantity: remainingData.remainingQuantity
              };
            }
            return {
              ...item,
              foodCategory: item.foodCategory?.toLowerCase() || 'other',
              imageUrl: item.imageBase64 && item.imageContentType
                ? `data:${item.imageContentType};base64,${item.imageBase64}`
                : null
            };
          } catch (error) {
            console.error(`Error fetching remaining quantity for item ${item.id}:`, error);
            return {
              ...item,
              foodCategory: item.foodCategory?.toLowerCase() || 'other',
              imageUrl: item.imageBase64 && item.imageContentType
                ? `data:${item.imageContentType};base64,${item.imageBase64}`
                : null
            };
          }
        })
      );

      console.log("Fetched items with updated remaining quantities:", itemsWithRemaining);
      setFoodItems(itemsWithRemaining);

    } catch (error) {
      console.error('Error fetching food items with remaining quantities:', error);
      alert("Error connecting to server. Please check your connection and try again.");
    }
  };

  useEffect(() => {

    if (merchantId) {
      fetchFoodItemsWithRemaining();
    }
  }, [merchantId]);


  const DonationsPopup = ({
    isOpen,
    onClose,
    donationsSubTab,
    setDonationsSubTab,
    merchantDonations,
    pendingDonations,
    rejectedDonations,
    completedDonations,
    donationLoading,
    donationError,
    handleCheckRequests,
    handleMarkAsCompleted
  }) => {
    if (!isOpen) return null;

    return (
      <div className="popup-overlay">
        <div className="popup-content donations-popup">
          <div className="popup-header">
            <h2>My Donations</h2>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="popup-body">
            <div className="donations-tabs">
              <button
                className={`donation-tab ${donationsSubTab === 'active' ? 'active' : ''}`}
                onClick={() => setDonationsSubTab('active')}
              >
                Active
              </button>
              <button
                className={`donation-tab ${donationsSubTab === 'pending' ? 'active' : ''}`}
                onClick={() => setDonationsSubTab('pending')}
              >
                Pending
              </button>
              <button
                className={`donation-tab ${donationsSubTab === 'rejected' ? 'active' : ''}`}
                onClick={() => setDonationsSubTab('rejected')}
              >
                Rejected
              </button>
              <button
                className={`donation-tab ${donationsSubTab === 'completed' ? 'active' : ''}`}
                onClick={() => setDonationsSubTab('completed')}
              >
                Completed
              </button>
            </div>

            {donationLoading ? (
              <div className="loading-indicator">
                <span className="loading-spinner"></span>
                <span>Loading donations...</span>
              </div>
            ) : donationError ? (
              <div className="error-message">
                <AlertCircle className="h-5 w-5" />
                <span>{donationError}</span>
              </div>
            ) : (
              <div className="donations-grid">
                {(() => {
                  // Determine which donations to display based on current tab
                  let displayDonations = [];
                  switch (donationsSubTab) {
                    case 'active':
                      displayDonations = merchantDonations;
                      break;
                    case 'pending':
                      displayDonations = pendingDonations;
                      break;
                    case 'rejected':
                      displayDonations = rejectedDonations;
                      break;
                    case 'completed':
                      displayDonations = completedDonations;
                      break;
                    default:
                      displayDonations = merchantDonations;
                  }

                  if (displayDonations.length === 0) {
                    return (
                      <div className="no-donations-message">
                        <Heart className="h-12 w-12 text-gray-300" />
                        <h3>No {donationsSubTab} donations</h3>
                        <p>Donations you make will appear here</p>
                      </div>
                    );
                  }

                  return displayDonations.map(donation => (
                    <div key={donation.id} className="donation-card">
                      <div className="donation-image">
                        <img src={donation.imageUrl} alt={donation.foodName} />
                        <div className={`status-badge ${donation.status.toLowerCase()}`}>
                          {donation.status}
                        </div>
                      </div>

                      <div className="donation-content">
                        <h3 className="donation-title">{donation.foodName}</h3>

                        <div className="donation-meta">
                          <div className="meta-item">
                            <Tag className="h-4 w-4" />
                            <span>{donation.category}</span>
                          </div>
                          <div className="meta-item">
                            <Package className="h-4 w-4" />
                            <span>{donation.quantity}</span>
                          </div>
                        </div>

                        <div className="donation-details">
                          <div className="detail-item">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>Expires: {new Date(donation.expiry).toLocaleDateString()}</span>
                          </div>
                          <div className="detail-item">
                            <MapPin className="h-4 w-4 text-red-500" />
                            <span>{donation.location}</span>
                          </div>
                        </div>

                        <div className="donation-actions">
                          {donationsSubTab === 'active' && (
                            <>
                              <button
                                className="card-action-btn check-requests"
                                onClick={() => handleCheckRequests(donation)}
                              >
                                <Users className="h-4 w-4" />
                                <span>Requests</span>
                              </button>

                              {/* New View Button */}
                              <button
                                className="card-action-btn view"
                                onClick={() => handleViewDonation(donation)}
                              >
                                <Eye className="h-4 w-4" />
                                <span>View</span>
                              </button>

                              {/* New Edit Button */}
                              <button
                                className="card-action-btn edit"
                                onClick={() => handleEditDonation(donation)}
                              >
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                              </button>

                              {/* New Delete Button */}
                              <button
                                className="card-action-btn delete"
                                onClick={() => handleDeleteDonation(donation.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </button>
                            </>
                          )}

                          {/* Existing buttons for other tabs */}
                          {donationsSubTab === 'pending' && (
                            <button
                              className="action-btn mark-complete"
                              onClick={() => handleMarkAsCompleted(donation.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Mark Complete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const filteredItems = foodItems
    .filter(item => filterCategory === 'all' || item.foodCategory === filterCategory)
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const ViewDonationModal = ({ isOpen, onClose, donation }) => {
    if (!isOpen || !donation) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content view-donation-modal dark:bg-gray-900 dark:text-gray-100">
          <div className="modal-header dark:bg-gray-800">
            <h2>View Donation Details</h2>
            <button className="close-button dark:text-gray-300" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="modal-body dark:bg-gray-900">
            <div className="donation-image-container">
              <img
                src={donation.imageUrl || '/api/placeholder/400/200'}
                alt={donation.foodName}
                className="donation-detail-image"
              />
            </div>

            <div className="donation-detail-section dark:bg-gray-800 dark:border-gray-700">
              <h3 className="section-title dark:text-gray-200">Basic Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label dark:text-gray-400">Name:</span>
                  <span className="detail-value dark:text-gray-200">{donation.foodName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label dark:text-gray-400">Category:</span>
                  <span className="detail-value dark:text-gray-200">{donation.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label dark:text-gray-400">Quantity:</span>
                  <span className="detail-value dark:text-gray-200">{donation.quantity}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label dark:text-gray-400">Status:</span>
                  <span className={`status-badge ${donation.status.toLowerCase()} dark:opacity-90`}>
                    {donation.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="donation-detail-section dark:bg-gray-800 dark:border-gray-700">
              <h3 className="section-title dark:text-gray-200">Dates & Location</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label dark:text-gray-400">Expiry Date:</span>
                  <span className="detail-value dark:text-gray-200">
                    {new Date(donation.expiry).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label dark:text-gray-400">Preparation Date:</span>
                  <span className="detail-value dark:text-gray-200">
                    {donation.preparation ? new Date(donation.preparation).toLocaleDateString() : 'Not specified'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label dark:text-gray-400">Location:</span>
                  <span className="detail-value dark:text-gray-200">{donation.location}</span>
                </div>
              </div>
            </div>

            <div className="donation-detail-section dark:bg-gray-800 dark:border-gray-700">
              <h3 className="section-title dark:text-gray-200">Additional Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label dark:text-gray-400">Packaging:</span>
                  <span className="detail-value dark:text-gray-200">{donation.packaging || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label dark:text-gray-400">Storage Instructions:</span>
                  <span className="detail-value dark:text-gray-200">{donation.storageInstructions || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label dark:text-gray-400">Dietary Info:</span>
                  <span className="detail-value dark:text-gray-200">{donation.dietaryInfo || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditDonationModal = ({ isOpen, onClose, donation, onSave }) => {

    const [editedDonation, setEditedDonation] = useState({ ...donation });

    if (!isOpen || !donation) return null;

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedDonation(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleDietaryChange = (option) => {
      let updatedDietaryInfo = [...(editedDonation.dietaryInfo || [])];

      // If string, convert to array
      if (typeof updatedDietaryInfo === 'string') {
        updatedDietaryInfo = updatedDietaryInfo.split(', ');
      }

      const isSelected = updatedDietaryInfo.includes(option);

      if (isSelected) {
        updatedDietaryInfo = updatedDietaryInfo.filter(item => item !== option);
      } else {
        updatedDietaryInfo.push(option);
      }

      setEditedDonation(prev => ({
        ...prev,
        dietaryInfo: updatedDietaryInfo
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(editedDonation);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content edit-donation-modal dark:bg-gray-900 dark:text-gray-100">
          <div className="modal-header dark:bg-gray-800">
            <h2>Edit Donation</h2>
            <button className="close-button dark:text-gray-300" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="modal-body dark:bg-gray-900">
            <form onSubmit={handleSubmit}>
              <div className="form-section dark:bg-gray-800 dark:border-gray-700">
                <h3 className="section-title dark:text-gray-200">Basic Information</h3>

                <div className="form-group">
                  <label htmlFor="foodName" className="dark:text-gray-300">Food Name</label>
                  <input
                    type="text"
                    id="foodName"
                    name="foodName"
                    value={editedDonation.foodName}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category" className="dark:text-gray-300">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={editedDonation.category}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity" className="dark:text-gray-300">Quantity</label>
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    value={editedDonation.quantity}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="form-section dark:bg-gray-800 dark:border-gray-700">
                <h3 className="section-title dark:text-gray-200">Dates & Location</h3>

                <div className="form-group">
                  <label htmlFor="expiry" className="dark:text-gray-300">Expiry Date</label>
                  <input
                    type="date"
                    id="expiry"
                    name="expiry"
                    value={editedDonation.expiry ? editedDonation.expiry.split('T')[0] : ''}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="dark:text-gray-300">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={editedDonation.location}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="form-section dark:bg-gray-800 dark:border-gray-700">
                <h3 className="section-title dark:text-gray-200">Additional Details</h3>

                <div className="form-group">
                  <label htmlFor="packaging" className="dark:text-gray-300">Packaging</label>
                  <input
                    type="text"
                    id="packaging"
                    name="packaging"
                    value={editedDonation.packaging || ''}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="storageInstructions" className="dark:text-gray-300">Storage Instructions</label>
                  <input
                    type="text"
                    id="storageInstructions"
                    name="storageInstructions"
                    value={editedDonation.storageInstructions || ''}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  />
                </div>

                <div className="form-group">
                  <label className="dark:text-gray-300">Dietary Information</label>
                  <div className="dietary-options">
                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal'].map(option => {
                      // Handle both array and string types for dietary info
                      let dietaryArray = [];
                      if (typeof editedDonation.dietaryInfo === 'string') {
                        dietaryArray = editedDonation.dietaryInfo.split(', ');
                      } else if (Array.isArray(editedDonation.dietaryInfo)) {
                        dietaryArray = editedDonation.dietaryInfo;
                      }

                      return (
                        <label key={option} className="dietary-option dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={dietaryArray.includes(option)}
                            onChange={() => handleDietaryChange(option)}
                            className="dark:bg-gray-700"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="form-actions dark:border-t dark:border-gray-700">
                <button
                  type="button"
                  className="cancel-button dark:bg-gray-700 dark:text-gray-200"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button dark:bg-green-600 dark:hover:bg-green-700"
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="confirmation-dialog">
          <div className="dialog-header">
            <h3>Confirm Deletion</h3>
          </div>

          <div className="dialog-content">
            <AlertCircle className="warning-icon" size={48} />
            <p>
              Are you sure you want to delete this donation? This action cannot be undone,
              and the donation will be permanently removed from the database.
            </p>
          </div>

          <div className="dialog-actions">
            <button
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="delete-button"
              onClick={onConfirm}
            >
              <Trash2 size={16} />
              <span>Delete Permanently</span>
            </button>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="merchant-dashboard dark:bg-gray-900 dark:text-gray-100">
      {/* ========== MAIN CONTENT AREA ========== */}
      <main className="dashboard-main" style={{ paddingTop: '64px' }}>
        <div className="dashboard-content">

          <div className="content-header">
            <h2>Your Food Listings</h2>
            <div className="header-actions">

              <button className="action-btn" onClick={handleFees}>
                <Wallet size={18} />
                <span>Pay Fees</span>
              </button>
              <button className="action-btn" onClick={() => setDonationsOpen(true)}>
                <Heart size={18} />
                <span>My Donations</span>
              </button>
              <button className="action-btn" onClick={handleSalesHistory}>
                <History size={18} />
                <span>Sales History</span>
              </button>
              <button className="action-btn" onClick={handleMessages}>
                <MessageSquare size={18} />
                <span>Messages</span>
              </button>
              <button className="action-btn" onClick={handleProfileUpdate}>
                <Settings size={18} />
                <span>Profile</span>
              </button>
              <button className="action-btn logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
              <button className="add-item-btn" onClick={() => handleOpenModal()}>
                <Plus size={18} />
                <span>Create New Listing</span>
              </button>
            </div>
          </div>

          {/* ========== STATISTICS SUMMARY SECTION ========== */}
          <div className={`stats-summary ${statsVisible ? '' : 'collapsed'}`}>
            <div className="stats-header">
              <h3>Overview</h3>
              <button className="toggle-stats-btn" onClick={toggleStats}>
                {statsVisible ? <ChevronDown size={18} /> : <ArrowRight size={18} />}
              </button>
            </div>

            {statsVisible && (
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Package size={24} />
                  </div>
                  <div className="stat-content">
                    {overviewStats.loading ? (
                      <>
                        <div className="stat-loading">
                          <div className="loading-spinner-small"></div>
                        </div>
                        <p>Loading...</p>
                      </>
                    ) : (
                      <>
                        <h4>{getTotalItemsSold()} items</h4>
                        <p>Total Items Sold</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Tag size={24} />
                  </div>
                  <div className="stat-content">
                    {overviewStats.loading ? (
                      <>
                        <div className="stat-loading">
                          <div className="loading-spinner-small"></div>
                        </div>
                        <p>Loading...</p>
                      </>
                    ) : (
                      <>
                        <h4>{getActiveListings()}</h4>
                        <p>Active Listings</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <DollarSign size={24} />
                  </div>
                  <div className="stat-content">
                    {overviewStats.loading ? (
                      <>
                        <div className="stat-loading">
                          <div className="loading-spinner-small"></div>
                        </div>
                        <p>Loading...</p>
                      </>
                    ) : (
                      <>
                        <h4>৳{getTotalRevenue()}</h4>
                        <p>Total Revenue</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========== SEARCH AND FILTER SECTION ========== */}
          <div className="action-bar">
            <div className="search-filter">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search food items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="category-filter">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="all">All Categories</option>
                  <option value="restaurant">Restaurant & Café</option>
                  <option value="grocery">Grocery Store</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* ========== FOOD ITEMS CARDS GRID ========== */}
          <div className="food-cards">
            {filteredItems.length === 0 ? (
              <div className="no-items">
                <div className="no-items-content">
                  <AlertCircle size={48} />
                  <h3>No food listings available</h3>
                  <p>Create your first food listing to reduce waste and help your community</p>
                </div>
              </div>
            ) : (
              filteredItems.map((item) => {

                const remainingQuantity = item.remainingQuantity !== undefined
                  ? item.remainingQuantity
                  : item.quantity;
                const remainingPercentage = item.quantity > 0
                  ? (remainingQuantity / item.quantity) * 100
                  : 0;
                return (
                  <div className={`food-card ${item.isPaused ? 'paused' : ''}`} key={item.id}>

                    <div className="food-card-image">
                      <img
                        src={item.imageUrl || (item.imageBase64 && item.imageContentType ? `data:${item.imageContentType};base64,${item.imageBase64}` : 'https://via.placeholder.com/300x200')}
                        alt={item.name}
                      />
                      <div className="food-card-category">
                        {getCategoryIcon(item.foodCategory)}
                        <span>{getFoodCategoryLabel(item.foodCategory)}</span>
                      </div>
                      {/* Paused Status Badge */}
                      {item.isPaused && (
                        <div className="paused-badge">
                          Paused
                        </div>
                      )}

                      {/* Price Badge */}
                      <div className="food-card-price">
                        <DollarSign size={14} />
                        <span>{item.price}</span>
                      </div>
                    </div>

                    {/* Food Card Content Section */}
                    <div className="food-card-content">
                      <h3 className="food-card-title">{item.name}</h3>

                      {/* Store Details */}
                      <div className="food-card-details">
                        <div className="detail-item">
                          <Store size={14} />
                          <span>{item.storeName}</span>
                        </div>
                        <div className="detail-item">
                          <MapPin size={14} />
                          <span>{item.location}</span>
                        </div>
                      </div>

                      {/* Timing and Quantity Details */}
                      <div className="food-card-details">
                        <div className="detail-item">
                          <Clock size={14} />
                          <span>Ready: {item.makingTime}</span>
                        </div>
                        <div className="detail-item">
                          <Tag size={14} />
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>

                      {/* Dietary Information Tags */}
                      <div className="food-dietary-tags">
                        {item.dietaryInfo.map(tag => (
                          <span key={tag} className="dietary-tag">{tag}</span>
                        ))}
                      </div>

                      {/* Remaining Quantity Section */}
                      <div className="food-card-quantity">
                        <div className="quantity-label">Remaining Quantity:</div>
                        <div className="quantity-bar-container">
                          <div className="quantity-values">
                            <span className="remaining-value">{remainingQuantity}</span>
                            <span className="total-value">/ {item.quantity}</span>
                          </div>
                          <div className="quantity-bar-background">
                            <div
                              className="quantity-bar-fill"
                              style={{ width: `${remainingPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Food Card Action Buttons */}
                    <div className="food-card-actions">
                      <button
                        className="card-action-btn edit"
                        onClick={() => handleOpenModal(item)}
                        aria-label="Edit"
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="card-action-btn delete"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                      <button
                        className="card-action-btn pause"
                        onClick={() => togglePause(item.id)}
                        aria-label={item.isPaused ? "Resume" : "Pause"}
                      >
                        {item.isPaused ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
                        <span>{item.isPaused ? "Resume" : "Pause"}</span>
                      </button>
                      <button
                        className="card-action-btn donate"
                        onClick={() => handleOpenDonateModal(item)}
                        aria-label="Donate"
                      >
                        <Heart size={16} />
                        <span>Donate</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>


      {/* ========== MODAL FORM FOR CREATING/EDITING ITEMS ========== */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h2>{currentItem.id ? 'Edit Food Listing' : 'Create New Food Listing'}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            {/* Food Item Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3 className="form-section-title">Basic Information</h3>

                <div className="form-group">
                  <label htmlFor="foodCategory">Food Source Category*</label>
                  <select
                    id="foodCategory"
                    name="foodCategory"
                    value={currentItem.foodCategory}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="restaurant">Restaurant & Café Surplus</option>
                    <option value="grocery">Grocery Store Excess</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="name">Food Item Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentItem.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="foodType">Food Type*</label>
                  <input
                    type="text"
                    id="foodType"
                    name="foodType"
                    placeholder="e.g., Bakery, Italian, Dessert"
                    value={currentItem.foodType}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price (in BD)*</label>
                    <div className="price-input">
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={currentItem.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="quantity">Quantity Available*</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      value={currentItem.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description*</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe your food item in detail..."
                    value={currentItem.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-section">
                <h3 className="form-section-title">Store & Location Details</h3>
                <div className="form-group">
                  <label htmlFor="storeName">Store/Restaurant Name*</label>
                  <input
                    type="text"
                    id="storeName"
                    name="storeName"
                    value={currentItem.storeName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location*</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Address or area"
                    value={currentItem.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-section">
                <h3 className="form-section-title">Timing & Dietary Information</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="makingTime">Ready By Time*</label>
                    <input
                      type="time"
                      id="makingTime"
                      name="makingTime"
                      value={currentItem.makingTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="deliveryTime">Preparing Time*</label>
                    <input
                      type="text"
                      id="deliveryTime"
                      name="deliveryTime"
                      placeholder="e.g., 14:00-16:00"
                      value={currentItem.deliveryTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date*</label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={currentItem.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Dietary Information (Optional)</label>
                  <div className="dietary-options">
                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal'].map(option => (
                      <label key={option} className="dietary-option">
                        <input
                          type="checkbox"
                          checked={currentItem.dietaryInfo.includes(option)}
                          onChange={() => handleDietaryChange(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-section">
                <h3 className="form-section-title">Food Image</h3>

                <div className="form-group">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                  />
                  <button
                    type="button"
                    className="upload-button"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Upload size={16} />
                    Upload Image
                  </button>

                  <div className="image-preview">
                    {currentItem.imageUrl && (
                      <img src={currentItem.imageUrl} alt="Preview" />
                    )}
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {currentItem.id ? 'Update Listing' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== NEW FEES POPUP ========== */}
      {feesOpen && (
        <div className="popup-overlay">
          <div className="popup-content fees-popup dark:bg-gray-900 dark:border dark:border-gray-700">
            <div className="popup-header dark:bg-green-700 bg-gradient-to-r from-green-600 to-green-400">
              <h2 className="text-white">Platform Fees</h2>
              <button className="close-button text-white hover:text-neutral-100" onClick={() => setFeesOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="popup-body dark:bg-gray-900">
              {feesLoading ? (
                <div className="loading-spinner-container">
                  <div className="loading-spinner"></div>
                  <p className="dark:text-gray-300">Loading fee information...</p>
                </div>
              ) : (
                <>
                  <div className="fees-summary">
                    <div className="fee-balance-card bg-gradient-to-br from-green-500 to-green-600 dark:from-green-500 dark:to-green-600">
                      <h3 className="text-white opacity-90">Current Balance</h3>
                      <div className="balance-amount text-white">{formatCurrency(feeData.currentBalance)}</div>
                      <div className="due-date text-white opacity-80">Due by: {feeData.dueDate || 'N/A'}</div>
                    </div>

                    <div className="fee-breakdown dark:bg-gray-800 dark:border dark:border-gray-700">
                      <h3 className="dark:text-gray-100">Fee Breakdown</h3>
                      <div className="fee-item dark:text-gray-300 dark:border-gray-700">
                        <span>Platform Subscription</span>
                        <span>{formatCurrency(feeData.platformFee)}</span>
                      </div>
                      <div className="fee-item dark:text-gray-300 dark:border-gray-700">
                        <span>Transaction Fees</span>
                        <span>{formatCurrency(feeData.transactionFees)}</span>
                      </div>
                      <div className="fee-item dark:text-gray-300 dark:border-gray-700">
                        <span>Promotional Services</span>
                        <span>{formatCurrency(feeData.promotionalFees)}</span>
                      </div>
                      <div className="fee-item previous-balance dark:text-gray-300 dark:border-gray-700">
                        <span>Previous Balance</span>
                        <span>{formatCurrency(feeData.previousBalance)}</span>
                      </div>
                      <div className="fee-item total dark:text-white dark:border-gray-700">
                        <span className="font-bold dark:text-white">Total Due</span>
                        <span className="font-bold dark:text-white">{formatCurrency(feeData.currentBalance)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="payment-section dark:bg-gray-800 dark:border dark:border-gray-700">
                    <h3 className="dark:text-white">Make a Payment</h3>
                    <form onSubmit={handlePaymentSubmit} className="payment-form">
                      <div className="form-group">
                        <label htmlFor="paymentAmount" className="dark:text-gray-300">Payment Amount</label>
                        <div className="amount-input dark:bg-gray-900 dark:border-gray-700">

                          <input
                            type="number"
                            id="paymentAmount"
                            min="1"
                            step="0.01"
                            max={feeData.currentBalance || 0}
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                            required
                            className="dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="dark:text-gray-300">Payment Method</label>
                        <div className="payment-methods">
                          <label className={`payment-method dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 ${paymentMethod === 'creditCard' ? 'selected dark:bg-gray-800 dark:border-green-600' : ''}`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="creditCard"
                              checked={paymentMethod === 'creditCard'}
                              onChange={() => setPaymentMethod('creditCard')}
                            />
                            <CreditCard size={18} className={`${paymentMethod === 'creditCard' ? 'dark:text-green-500' : 'dark:text-gray-400'}`} />
                            <span>Credit Card</span>
                          </label>
                          <label className={`payment-method dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 ${paymentMethod === 'bankTransfer' ? 'selected dark:bg-gray-800 dark:border-green-600' : ''}`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="bankTransfer"
                              checked={paymentMethod === 'bankTransfer'}
                              onChange={() => setPaymentMethod('bankTransfer')}
                            />
                            <Briefcase size={18} className={`${paymentMethod === 'bankTransfer' ? 'dark:text-green-500' : 'dark:text-gray-400'}`} />
                            <span>Bank Transfer</span>
                          </label>
                        </div>
                      </div>

                      {paymentMethod === 'creditCard' && (
                        <div className="credit-card-details dark:bg-gray-900 dark:border dark:border-gray-700 dark:rounded-lg dark:p-4">
                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor="cardNumber" className="dark:text-gray-300">Card Number</label>
                              <input
                                type="text"
                                id="cardNumber"
                                placeholder="XXXX XXXX XXXX XXXX"
                                required
                                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor="expiryDate" className="dark:text-gray-300">Expiry Date</label>
                              <input
                                type="text"
                                id="expiryDate"
                                placeholder="MM/YY"
                                required
                                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="cvv" className="dark:text-gray-300">CVV</label>
                              <input
                                type="text"
                                id="cvv"
                                placeholder="XXX"
                                required
                                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'bankTransfer' && (
                        <div className="bank-details dark:bg-gray-900 dark:border dark:border-gray-700 dark:rounded-lg dark:p-4">
                          <div className="form-group">
                            <label htmlFor="accountName" className="dark:text-gray-300">Account Name</label>
                            <input
                              type="text"
                              id="accountName"
                              placeholder="Enter account name"
                              required
                              className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                            />
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor="accountNumber" className="dark:text-gray-300">Account Number</label>
                              <input
                                type="text"
                                id="accountNumber"
                                placeholder="Enter account number"
                                required
                                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="routingNumber" className="dark:text-gray-300">Routing Number</label>
                              <input
                                type="text"
                                id="routingNumber"
                                placeholder="Enter routing number"
                                required
                                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <button type="submit" className="pay-now-btn dark:bg-green-600 dark:hover:bg-green-700" disabled={!feeData.currentBalance}>
                        <CreditCard size={16} />
                        <span>Pay Now</span>
                      </button>
                    </form>
                  </div>

                  <div className="payment-history dark:bg-gray-800 dark:border dark:border-gray-700">
                    <h3 className="dark:text-gray-100">Payment History</h3>
                    {feeData.paymentHistory.length === 0 ? (
                      <div className="empty-history dark:text-gray-400">No previous payments</div>
                    ) : (
                      <table className="payment-history-table dark:text-gray-200">
                        <thead>
                          <tr className="dark:bg-gray-900">
                            <th className="dark:text-gray-300 dark:border-gray-700">Payment ID</th>
                            <th className="dark:text-gray-300 dark:border-gray-700">Date</th>
                            <th className="dark:text-gray-300 dark:border-gray-700">Amount</th>
                            <th className="dark:text-gray-300 dark:border-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feeData.paymentHistory.map(payment => (
                            <tr key={payment.id} className="dark:hover:bg-gray-900 dark:border-gray-700">
                              <td className="dark:border-gray-700">{payment.id}</td>
                              <td className="dark:border-gray-700">{payment.date}</td>
                              <td className="dark:border-gray-700">{formatCurrency(payment.amount)}</td>
                              <td className="dark:border-gray-700">
                                <span className={`payment-status ${payment.status.toLowerCase()} dark:opacity-90`}>
                                  {payment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedMainTab === 'donations' && (
        <div className="merchant-donations-container">
          <div className="donations-header">
            <h2>My Donations</h2>
            <div className="donations-tabs">
              <button
                className={`donation-tab ${donationsSubTab === 'active' ? 'active' : ''}`}
                onClick={() => setDonationsSubTab('active')}
              >
                Active
              </button>
              <button
                className={`donation-tab ${donationsSubTab === 'pending' ? 'active' : ''}`}
                onClick={() => setDonationsSubTab('pending')}
              >
                Pending
              </button>
              <button
                className={`donation-tab ${donationsSubTab === 'rejected' ? 'active' : ''}`}
                onClick={() => setDonationsSubTab('rejected')}
              >
                Rejected
              </button>
              <button
                className={`donation-tab ${donationsSubTab === 'completed' ? 'active' : ''}`}
                onClick={() => setDonationsSubTab('completed')}
              >
                Completed
              </button>
            </div>
          </div>
          {donationLoading ? (
            <div className="loading-indicator">
              <span className="loading-spinner"></span>
              <span>Loading donations...</span>
            </div>
          ) : donationError ? (
            <div className="error-message">
              <AlertCircle className="h-5 w-5" />
              <span>{donationError}</span>
            </div>
          ) : (
            <div className="donations-grid">
              {(() => {
                let displayDonations = [];
                switch (donationsSubTab) {
                  case 'active':
                    displayDonations = merchantDonations;
                    break;
                  case 'pending':
                    displayDonations = pendingDonations;
                    break;
                  case 'rejected':
                    displayDonations = rejectedDonations;
                    break;
                  case 'completed':
                    displayDonations = completedDonations;
                    break;
                  default:
                    displayDonations = merchantDonations;
                }
                if (displayDonations.length === 0) {
                  return (
                    <div className="no-donations-message">
                      <Heart className="h-12 w-12 text-gray-300" />
                      <h3>No {donationsSubTab} donations</h3>
                      <p>Donations you make will appear here</p>
                    </div>
                  );
                }
                return displayDonations.map(donation => (
                  <div key={donation.id} className="donation-card">
                    <div className="donation-image">
                      <img src={donation.imageUrl} alt={donation.foodName} />
                      <div className={`status-badge ${donation.status.toLowerCase()}`}>
                        {donation.status}
                      </div>
                    </div>
                    <div className="donation-content">
                      <h3 className="donation-title">{donation.foodName}</h3>
                      <div className="donation-meta">
                        <div className="meta-item">
                          <Tag className="h-4 w-4" />
                          <span>{donation.category}</span>
                        </div>
                        <div className="meta-item">
                          <Package className="h-4 w-4" />
                          <span>{donation.quantity}</span>
                        </div>
                      </div>
                      <div className="donation-details">
                        <div className="detail-item">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>Expires: {new Date(donation.expiry).toLocaleDateString()}</span>
                        </div>
                        <div className="detail-item">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span>{donation.location}</span>
                        </div>
                      </div>

                      <div className="donation-actions">
                        {donationsSubTab === 'active' && (
                          <>
                            <button
                              className="card-action-btn check-requests"
                              onClick={() => handleCheckRequests(donation)}
                            >
                              <Users className="h-4 w-4" />
                              <span>Requests</span>
                            </button>

                            {/* New View Button */}
                            <button
                              className="card-action-btn view"
                              onClick={() => handleViewDonation(donation)}
                            >
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </button>

                            {/* New Edit Button */}
                            <button
                              className="card-action-btn edit"
                              onClick={() => handleEditDonation(donation)}
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </button>

                            {/* New Delete Button */}
                            <button
                              className="card-action-btn delete"
                              onClick={() => handleDeleteDonation(donation.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </>
                        )}

                        {/* Existing buttons for other tabs */}
                        {donationsSubTab === 'pending' && (
                          <button
                            className="action-btn mark-complete"
                            onClick={() => handleMarkAsCompleted(donation.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Mark Complete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      )}

      {salesHistoryOpen && <SalesHistoryModal />}

      {/* ========== MESSAGES POPUP ========== */}
      {messagesOpen && (
        <div className="popup-overlay">
          <div className="popup-content messages-popup">

            <div className="popup-header">
              <h2>Messages ({messageStats.unreadMessages} unread)</h2>
              <div className="header-actions">
                <button
                  className="action-btn compose-btn"
                  onClick={() => setShowNewMessageModal(true)}
                >
                  <Plus size={18} />
                  <span>New Message</span>
                </button>
                <button className="close-button" onClick={() => setMessagesOpen(false)}>
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="popup-body messages-container">
              {messagesLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <h3>Loading Messages...</h3>
                  <p>Please wait while we fetch your messages</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="empty-state">
                  <MessageSquare size={48} />
                  <h3>No Messages</h3>
                  <p>Your conversations will appear here</p>
                  <button
                    className="action-btn"
                    onClick={() => setShowNewMessageModal(true)}
                  >
                    <Plus size={18} />
                    <span>Send First Message</span>
                  </button>
                </div>
              ) : (
                <div className="messages-layout">
                  <div className="messages-list">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`message-item ${!message.read ? 'unread' : ''} ${selectedMessage && selectedMessage.id === message.id ? 'active' : ''}`}
                        onClick={() => handleViewMessage(message)}
                      >
                        <div className="message-avatar">
                          <img src={message.senderAvatar} alt={message.sender} />
                        </div>
                        <div className="message-preview">
                          <div className="message-header">
                            <h4>{message.sender}</h4>
                            <span className="message-date">{message.date}</span>
                          </div>
                          <div className="message-subject">
                            {message.subject}
                          </div>
                          <p className="message-excerpt">
                            {message.message.length > 60
                              ? `${message.message.substring(0, 60)}...`
                              : message.message}
                          </p>
                        </div>
                        {!message.read && <div className="unread-indicator"></div>}
                      </div>
                    ))}
                  </div>

                  <div className="message-detail">
                    {selectedMessage ? (
                      <>
                        <div className="message-detail-header">
                          <div className="message-detail-subject">
                            <h3>{selectedMessage.subject}</h3>
                            <div className="message-detail-meta">
                              <span>From: {selectedMessage.sender}</span>
                              <span>•</span>
                              <span>{selectedMessage.date} at {selectedMessage.time}</span>
                            </div>
                          </div>
                          <button
                            className="delete-message-btn"
                            onClick={() => handleDeleteMessage(selectedMessage.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="message-thread">
                          <div className="message-bubble sender">
                            <div className="message-avatar">
                              <img src={selectedMessage.senderAvatar} alt={selectedMessage.sender} />
                            </div>
                            <div className="message-content">
                              <div className="message-sender-name">{selectedMessage.sender}</div>
                              <div className="message-text">{selectedMessage.message}</div>
                              <div className="message-time">{selectedMessage.time}</div>
                            </div>
                          </div>
                          {selectedMessage.thread.map(reply => (
                            <div key={reply.id} className={`message-bubble ${reply.sender === 'Me' ? 'me' : 'sender'}`}>
                              <div className="message-avatar">
                                {reply.sender === 'Me'
                                  ? <img src={userProfile.avatar} alt="Me" />
                                  : <img src={selectedMessage.senderAvatar} alt={selectedMessage.sender} />
                                }
                              </div>
                              <div className="message-content">
                                <div className="message-sender-name">{reply.sender}</div>
                                <div className="message-text">{reply.message}</div>
                                <div className="message-time">{reply.time}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="reply-form">
                          <textarea
                            placeholder="Type your reply here..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                          ></textarea>
                          <button
                            className="reply-btn"
                            onClick={handleReplyMessage}
                            disabled={!replyContent.trim()}
                          >
                            <Send size={18} />
                            <span>Send Reply</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="empty-detail">
                        <MessageSquare size={48} />
                        <h3>Select a message</h3>
                        <p>Choose a message from the list to view its details</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ========== PROFILE MANAGEMENT POPUP ========== */}
      {profileOpen && (
        <div className="popup-overlay">
          <div className="popup-content profile-popup">
            <div className="popup-header">
              <h2>Profile Management</h2>
              <button className="close-button" onClick={() => setProfileOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="popup-body">
              {profileLoading && !profileError ? (
                <div className="loading-spinner-container">
                  <div className="loading-spinner"></div>
                  <p>Loading profile data...</p>
                </div>
              ) : profileError ? (
                <div className="error-message">
                  <AlertCircle size={24} />
                  <p>{profileError}</p>
                  <button
                    className="retry-button"
                    onClick={() => {
                      setProfileError('');
                      setProfileOpen(false);
                      setTimeout(() => setProfileOpen(true), 100);
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="profile-form">
                  {profileSuccess && (
                    <div className="success-message">
                      <CheckCircle size={24} />
                      <p>{profileSuccess}</p>
                    </div>
                  )}
                  <div className="profile-avatar-section">
                    <div className="avatar-container">
                      <img src={userProfile.avatar} alt="Profile" className="profile-avatar" />
                      <button
                        type="button"
                        className="avatar-edit-btn"
                        onClick={handleAvatarUpload}
                      >
                        <Camera size={18} />
                      </button>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleAvatarFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                  <div className="form-section">
                    <h3 className="form-section-title">Personal Information</h3>
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={userProfile.name}
                        onChange={handleProfileChange}
                        required
                        className="profile-input"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={userProfile.email}
                          onChange={handleProfileChange}
                          required
                          className="profile-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={userProfile.phone}
                          onChange={handleProfileChange}
                          required
                          className="profile-input"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-section">
                    <h3 className="form-section-title">Business Information</h3>
                    <div className="form-group">
                      <label htmlFor="storeName">Store/Restaurant Name</label>
                      <input
                        type="text"
                        id="storeName"
                        name="storeName"
                        value={userProfile.storeName}
                        onChange={handleProfileChange}
                        required
                        className="profile-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="businessType">Business Type</label>
                      <input
                        type="text"
                        id="businessType"
                        name="businessType"
                        value={userProfile.businessType}
                        onChange={handleProfileChange}
                        required
                        className="profile-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="businessLicenseNumber">Business License Number</label>
                      <input
                        type="text"
                        id="businessLicenseNumber"
                        name="businessLicenseNumber"
                        value={userProfile.businessLicenseNumber}
                        onChange={handleProfileChange}
                        required
                        className="profile-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">Business Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={userProfile.address}
                        onChange={handleProfileChange}
                        required
                        className="profile-input"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={userProfile.city}
                          onChange={handleProfileChange}
                          required
                          className="profile-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="stateProvince">State/Province</label>
                        <input
                          type="text"
                          id="stateProvince"
                          name="stateProvince"
                          value={userProfile.stateProvince}
                          onChange={handleProfileChange}
                          required
                          className="profile-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="postalCode">Postal Code</label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={userProfile.postalCode}
                          onChange={handleProfileChange}
                          required
                          className="profile-input"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="bio">Business Description</label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={userProfile.bio}
                        onChange={handleProfileChange}
                        placeholder="Describe your business in a few sentences..."
                        rows={4}
                        className="profile-textarea"
                      ></textarea>
                    </div>
                  </div>
                  <div className="form-section">
                    <h3 className="form-section-title">Account Settings</h3>
                    <div className="settings-actions">
                      <button type="button" className="setting-action-btn">
                        Change Password
                      </button>
                      <button type="button" className="setting-action-btn">
                        Privacy Settings
                      </button>
                      <button type="button" className="setting-action-btn">
                        Notification Preferences
                      </button>
                    </div>
                  </div>

                  <div className="form-actions profile-actions">
                    <button type="button" className="cancel-button" onClick={() => setProfileOpen(false)}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="submit-button"
                      disabled={profileLoading}
                    >
                      {profileLoading ? (
                        <>
                          <span className="button-spinner"></span>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ========== DONATION MODAL ========== */}
      {isDonateModalOpen && donationItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Donate {donationItem.name}</h2>
              <button className="close-button" onClick={handleCloseDonateModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleDonationSubmit}>
              <div className="form-section">
                <h3 className="form-section-title">Basic Food Information</h3>

                <div className="form-group">
                  <label htmlFor="donationCategory">Donation Category*</label>
                  <select
                    id="donationCategory"
                    name="donationCategory"
                    value={donationData.donationCategory || mapFoodCategoryToDonationCategory(donationItem.foodCategory)}
                    onChange={handleDonationInputChange}
                    required
                  >
                    <option value="RESTAURANT_SURPLUS">Restaurant & Café Surplus</option>
                    <option value="GROCERY_EXCESS">Grocery Store Excess</option>
                    <option value="EVENT_LEFTOVER">Event & Wedding Leftovers</option>
                    <option value="CORPORATE_DONATION">Corporate & Office Donations</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="foodName">Food Name*</label>
                  <input
                    type="text"
                    id="foodName"
                    name="foodName"
                    value={donationData.foodName || donationItem.name}
                    onChange={handleDonationInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity*</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max={donationData.maxQuantity}
                    value={donationData.quantity}
                    onChange={handleDonationInputChange}
                    required
                  />
                  <small>Available: {donationData.maxQuantity}</small>
                </div>

                <div className="form-group">
                  <label htmlFor="foodType">Food Type*</label>
                  <input
                    type="text"
                    id="foodType"
                    name="foodType"
                    placeholder="Restaurant, takeout, etc."
                    value={donationData.foodType || donationItem.foodType}
                    onChange={handleDonationInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Add any additional details about the food"
                    value={donationData.description || donationItem.description}
                    onChange={handleDonationInputChange}
                  />
                </div>
              </div>
              <div className="form-section">
                <h3 className="form-section-title">Dates & Storage</h3>
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date & Time*</label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={donationData.expiryDate || donationItem.expiryDate}
                    onChange={handleDonationInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="preparationDate">Preparation Date*</label>
                  <input
                    type="date"
                    id="preparationDate"
                    name="preparationDate"
                    value={donationData.preparationDate || new Date().toISOString().split('T')[0]}
                    onChange={handleDonationInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="packaging">Packaging</label>
                  <input
                    type="text"
                    id="packaging"
                    name="packaging"
                    placeholder="Plastic container, paper bag, etc."
                    value={donationData.packaging || ''}
                    onChange={handleDonationInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="storageInstructions">Storage Instructions</label>
                  <input
                    type="text"
                    id="storageInstructions"
                    name="storageInstructions"
                    placeholder="Refrigerate, keep at room temperature, etc."
                    value={donationData.storageInstructions || ''}
                    onChange={handleDonationInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Dietary Information</label>
                  <div className="dietary-options">
                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal'].map(option => (
                      <label key={option} className="dietary-option">
                        <input
                          type="checkbox"
                          name="dietaryInfo"
                          value={option}
                          checked={donationData.dietaryInfo?.includes(option) || donationItem.dietaryInfo?.includes(option) || false}
                          onChange={handleDietaryChange}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-section">
                <h3 className="form-section-title">Location</h3>

                <div className="form-group">
                  <label htmlFor="location">Location*</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Your pickup location"
                    value={donationData.location || donationItem.location}
                    onChange={handleDonationInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-section">
                <h3 className="form-section-title">Additional Notes</h3>

                <div className="form-group">
                  <label htmlFor="notes">Special Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder="Any special handling or preparation notes..."
                    value={donationData.notes || ''}
                    onChange={handleDonationInputChange}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCloseDonateModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={donationData.quantity < 1 || donationData.quantity > donationData.maxQuantity}
                >
                  <Heart size={16} />
                  <span>Create Donation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showRequestsModal && <DonationRequestsModal />}

      {/* Adding the View Donation Modal */}
      {viewDonationModalOpen && (
        <ViewDonationModal
          isOpen={viewDonationModalOpen}
          onClose={() => {
            setViewDonationModalOpen(false);
            // Only reopen donations if that's where we came from
            if (modalSource === 'donations') {
              // Use setTimeout to ensure proper state update sequencing
              setTimeout(() => {
                setDonationsOpen(true);
                setModalSource(null); // Reset the source
              }, 10);
            }
          }}
          donation={selectedDonation}
        />

      )}

      {/* Adding the Edit Donation Modal */}
      {editDonationModalOpen && (
        <EditDonationModal
          isOpen={editDonationModalOpen}
          onClose={() => {
            setEditDonationModalOpen(false);
            if (modalSource === 'donations') {
              setTimeout(() => {
                setDonationsOpen(true);
                setModalSource(null); // Reset the source
              }, 10);
            }
          }}
          donation={selectedDonation}
          onSave={handleSaveDonationEdit}
        />
      )}

      {/* Adding the Delete Confirmation Dialog */}
      {deleteConfirmationOpen && (
        <DeleteConfirmationDialog
          isOpen={deleteConfirmationOpen}
          onClose={() => {
            setDeleteConfirmationOpen(false);
            setDonationToDelete(null);

            if (modalSource === 'donations') {
              setTimeout(() => {
                setDonationsOpen(true);
                setModalSource(null);
              }, 10);
            }
          }}
          onConfirm={confirmDeleteDonation}
        />
      )}

      {donationsOpen && (
        <DonationsPopup
          isOpen={donationsOpen}
          onClose={() => setDonationsOpen(false)}
          donationsSubTab={donationsSubTab}
          setDonationsSubTab={setDonationsSubTab}
          merchantDonations={merchantDonations}
          pendingDonations={pendingDonations}
          rejectedDonations={rejectedDonations}
          completedDonations={completedDonations}
          donationLoading={donationLoading}
          donationError={donationError}
          handleCheckRequests={handleCheckRequests}
          handleMarkAsCompleted={handleMarkAsCompleted}
        />
      )}
    </div>
  );
};

export default MerchantDashboard;