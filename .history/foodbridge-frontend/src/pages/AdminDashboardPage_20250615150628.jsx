import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/admindashboard.css';
import { useTheme } from '../contexts/ThemeContext';
import {
  Users, Package, AlertTriangle, Activity, BarChart3,
  Search, Filter, ShieldCheck, ChevronDown,
  Menu, X, Bell,  LogOut, Edit, Trash2, Mail, Plus, ChevronRight,
  Calendar, Clock, MapPin, Eye, Save, Upload, RefreshCw,
  Store,  ShoppingBag,  UserPlus,  FileText,  User,
  Award, Trophy, Zap, Heart,  Download,  PieChart,
  PlusCircle,  Phone,  Lock,  Shield,  Laptop,
  LifeBuoy,  Camera,  Check,  Pause,  PackageCheck, TrendingUp 
} from 'lucide-react';

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showAddMerchantModal, setShowAddMerchantModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  // Add state for storing uploaded files
  const [logoFile, setLogoFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);

  // Add state for merchants from API
  const [merchantsData, setMerchantsData] = useState([]);
  const [merchantsLoading, setMerchantsLoading] = useState(false);
  const [merchantsError, setMerchantsError] = useState(null);

  // Add these state variables inside your AdminDashboard component
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [showViewMerchantModal, setShowViewMerchantModal] = useState(false);
  const [showEditMerchantModal, setShowEditMerchantModal] = useState(false);

  // Add new state for admin data
  const [adminsData, setAdminsData] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  //
  const [adminProfile, setAdminProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  //
  const [usersData, setUsersData] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  //
  const [feeType, setFeeType] = useState('contractual');
  //
  const [messagesData, setMessagesData] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [messageFilter, setMessageFilter] = useState('all'); // all, unread, read, with-attachments
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [messageStats, setMessageStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    readMessages: 0,
    messagesWithAttachments: 0
  });

  // Food Reports State
  const [foodReports, setFoodReports] = useState([]);
  const [foodReportsLoading, setFoodReportsLoading] = useState(false);
  const [foodReportsError, setFoodReportsError] = useState(null);
  const [foodReportsStats, setFoodReportsStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    underReviewReports: 0,
    resolvedReports: 0,
    dismissedReports: 0,
    escalatedReports: 0
  });
  const [reportFilter, setReportFilter] = useState('all');
  const [reportsPagination, setReportsPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeData, setComposeData] = useState({
    recipientType: 'all',
    subject: '',
    message: ''
  });
  const [sendingMessage, setSendingMessage] = useState(false);

  const [reportDetails, setReportDetails] = useState(null);
  const [reportDetailsLoading, setReportDetailsLoading] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({
    reportId: null,
    newStatus: '',
    adminNotes: ''
  });

  // Fetch food reports
  const fetchFoodReports = async (page = 0, status = 'all') => {
    setFoodReportsLoading(true);
    setFoodReportsError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/admin/food-reports/all?page=${page}&size=10&status=${status}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setFoodReports(data.reports);
        setReportsPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalElements: data.totalElements
        });
      } else {
        throw new Error(data.message || 'Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching food reports:', error);
      setFoodReportsError(error.message);
    } finally {
      setFoodReportsLoading(false);
    }
  };

  useEffect(() => {
  if (activeSection === 'overview') {
    // Fetch all required data for overview
    const fetchOverviewData = async () => {
      try {
        // Fetch users data if not already loaded
        if (!usersData || usersData.length === 0) {
          fetchUsers();
        }
        
        // Fetch merchants data if not already loaded
        if (!merchantsData || merchantsData.length === 0) {
          fetchMerchants();
        }
        
        // Fetch admins data if not already loaded
        if (!adminsData || adminsData.length === 0) {
          fetchAdmins();
        }
        
        // Fetch donations data if not already loaded
        if (!donations || donations.length === 0) {
          fetchDonations();
        }
        
        // Fetch message stats if not already loaded
        if (!messageStats || messageStats.totalMessages === 0) {
          fetchMessageStats();
        }
        
        // Fetch food reports stats if not already loaded
        if (!foodReportsStats || foodReportsStats.totalReports === 0) {
          fetchFoodReportsStats();
        }
      } catch (error) {
        console.error('Error fetching overview data:', error);
      }
    };

    fetchOverviewData();
  }
}, [activeSection]);

  const fetchFoodReportsStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/food-reports/stats');

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFoodReportsStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching food reports stats:', error);
    }
  };

  // Update report status
  const handleUpdateReportStatus = async (reportId, newStatus, adminNotes = '') => {
    try {
      const authData = JSON.parse(localStorage.getItem('authUser') || sessionStorage.getItem('authUser'));
      const adminId = authData?.id || 1;

      const response = await fetch(`http://localhost:8080/api/admin/food-reports/${reportId}/status?status=${newStatus}&adminNotes=${encodeURIComponent(adminNotes)}&adminId=${adminId}`, {
        method: 'PUT'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Report status updated successfully');
          fetchFoodReports(reportsPagination.currentPage, reportFilter);
          fetchFoodReportsStats();
        } else {
          alert('Error: ' + data.message);
        }
      } else {
        alert('Failed to update report status');
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      alert('Error updating report status');
    }
  };

  // Delete report
  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:8080/api/admin/food-reports/${reportId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            alert('Report deleted successfully');
            fetchFoodReports(reportsPagination.currentPage, reportFilter);
            fetchFoodReportsStats();
          } else {
            alert('Error: ' + data.message);
          }
        } else {
          alert('Failed to delete report');
        }
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Error deleting report');
      }
    }
  };

  const fetchReportDetails = async (reportId) => {
    setReportDetailsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/admin/food-reports/${reportId}`);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReportDetails(data.report);
        } else {
          alert('Error: ' + data.message);
        }
      } else {
        alert('Failed to fetch report details');
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
      alert('Error fetching report details');
    } finally {
      setReportDetailsLoading(false);
    }
  };

  // Handle view report
  const handleViewReport = (report) => {
    setSelectedReport(report);
    fetchReportDetails(report.id);
    setShowReportModal(true);
  };

  // Download evidence file
  const handleDownloadEvidence = (reportId, fileNumber, fileName) => {
    const link = document.createElement('a');
    link.href = `http://localhost:8080/api/admin/food-reports/${reportId}/evidence/${fileNumber}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // View evidence file
  const handleViewEvidence = (reportId, fileNumber) => {
    window.open(`http://localhost:8080/api/admin/food-reports/${reportId}/evidence/${fileNumber}/view`, '_blank');
  };

  // Show status update modal
  const handleShowStatusUpdate = (reportId, currentStatus) => {
    setStatusUpdateData({
      reportId: reportId,
      newStatus: currentStatus,
      adminNotes: ''
    });
    setShowStatusUpdateModal(true);
  };


  useEffect(() => {
    if (activeSection === 'reports') {
      fetchFoodReports(0, reportFilter);
      fetchFoodReportsStats();
    }
  }, [activeSection, reportFilter]);

  const handleUpdateReportStatusWithNotes = async () => {
    if (!statusUpdateData.newStatus) {
      alert('Please select a status');
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem('authUser') || sessionStorage.getItem('authUser'));
      const adminId = authData?.id || 1;

      const response = await fetch(`http://localhost:8080/api/admin/food-reports/${statusUpdateData.reportId}/status?status=${statusUpdateData.newStatus}&adminNotes=${encodeURIComponent(statusUpdateData.adminNotes)}&adminId=${adminId}`, {
        method: 'PUT'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Report status updated successfully');
          setShowStatusUpdateModal(false);
          setShowReportModal(false);
          fetchFoodReports(reportsPagination.currentPage, reportFilter);
          fetchFoodReportsStats();
        } else {
          alert('Error: ' + data.message);
        }
      } else {
        alert('Failed to update report status');
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      alert('Error updating report status');
    }
  };


  // Add useEffect to fetch messages when section changes
  useEffect(() => {
    if (activeSection === 'messages') {
      fetchMessages();
      fetchMessageStats();
    }
  }, [activeSection, messageFilter]);

  // Function to fetch messages
  const fetchMessages = async () => {
    setMessagesLoading(true);
    setMessagesError(null);

    try {
      let endpoint = '/api/messages/admin/all';

      if (messageFilter !== 'all') {
        endpoint = `/api/messages/admin/filter?filter=${messageFilter}`;
      }

      const response = await fetch(`http://localhost:8080${endpoint}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      setMessagesData(data);
      console.log('Messages fetched:', data.length);

    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessagesError(error.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Function to fetch message statistics
  const fetchMessageStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/messages/admin/stats');

      if (response.ok) {
        const stats = await response.json();
        setMessageStats(stats);
      }
    } catch (error) {
      console.error('Error fetching message stats:', error);
    }
  };

  // Function to view message (auto marks as read)
  const handleViewMessage = async (messageId) => {
    try {
      const authData = JSON.parse(localStorage.getItem('authUser') || sessionStorage.getItem('authUser'));
      const adminEmail = authData?.email || 'admin@foodbridge.com';

      const response = await fetch(`http://localhost:8080/api/messages/admin/${messageId}?adminEmail=${encodeURIComponent(adminEmail)}`);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSelectedMessage(result.data);
          setShowMessageModal(true);

          // Refresh messages list to update read status
          fetchMessages();
          fetchMessageStats();
        }
      } else {
        alert('Failed to load message');
      }
    } catch (error) {
      console.error('Error viewing message:', error);
      alert('Error loading message');
    }
  };

  // Function to delete message
  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to permanently delete this message? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:8080/api/messages/admin/${messageId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            alert('Message deleted successfully');
            fetchMessages();
            fetchMessageStats();

            // Close modal if the deleted message was being viewed
            if (selectedMessage && selectedMessage.id === messageId) {
              setShowMessageModal(false);
              setSelectedMessage(null);
            }
          } else {
            alert('Failed to delete message: ' + result.message);
          }
        } else {
          alert('Failed to delete message');
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Error deleting message');
      }
    }
  };

  // Function to send reply
  const handleSendReply = async () => {
    if (!selectedMessage || !replyContent.trim()) {
      alert('Please enter a reply message');
      return;
    }

    setSendingReply(true);

    try {
      const authData = JSON.parse(localStorage.getItem('authUser') || sessionStorage.getItem('authUser'));
      const adminEmail = authData?.email || 'admin@foodbridge.com';
      const adminName = `${authData?.firstName || 'Admin'} ${authData?.lastName || 'User'}`;

      const formData = new FormData();
      formData.append('replyContent', replyContent);
      formData.append('adminEmail', adminEmail);
      formData.append('adminName', adminName);

      const response = await fetch(`http://localhost:8080/api/messages/admin/${selectedMessage.id}/reply`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('Reply sent successfully!');
          setShowReplyModal(false);
          setReplyContent('');
          setReplySubject('');
        } else {
          alert('Failed to send reply: ' + result.message);
        }
      } else {
        alert('Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply');
    } finally {
      setSendingReply(false);
    }
  };

  // Function to download attachment
  const handleDownloadAttachment = (messageId, fileName) => {
    const link = document.createElement('a');
    link.href = `http://localhost:8080/api/messages/admin/${messageId}/download`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to view attachment inline
  const handleViewAttachment = (messageId, fileName) => {
    window.open(`http://localhost:8080/api/messages/admin/${messageId}/view`, '_blank');
  };


  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User', icon: Users },
    { id: 'merchants', label: 'Merchant', icon: Store },
    { id: 'NewAdmin', label: 'Admin Section', icon: User },
    { id: 'donations', label: 'Donations', icon: Package },
    { id: 'messages', label: 'Messages', icon: Mail }, // Add this line
    { id: 'reports', label: 'Reports', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
  ];
  //
  // First, add these state variables at the top of your AdminDashboard component
  const [donationsStats, setDonationsStats] = useState({
    active: 0,
    completed: 0,
    expired: 0,
    totalMonthly: 0,
    successRate: 0
  });
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [donationsError, setDonationsError] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showDonationModal, setShowDonationModal] = useState(false);

  // Then add this useEffect to fetch donation data
  useEffect(() => {
    if (activeSection === 'donations') {
      fetchDonations();
    }
  }, [activeSection]);

  //
  const fetchDonations = async () => {
    setDonationsLoading(true);
    setDonationsError(null);

    try {
      // Fetch all donations
      const response = await fetch('http://localhost:8080/api/admin/donations/all');

      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }

      const allDonations = await response.json();

      // Process donations with categorization
      const processedDonations = allDonations.map(donation => {
        // Determine status and apply default if not present
        const status = donation.status || 'Unknown';

        // Create a donation object with consistent structure
        return {
          ...donation,
          status: status,
          createdAt: donation.createdAt ? new Date(donation.createdAt) : new Date(),
          expiryDate: donation.expiryDate ? new Date(donation.expiryDate) : null,
          category: donation.category?.label || donation.category || 'Uncategorized'
        };
      });

      // Sort donations by creation date (newest first)
      processedDonations.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB - dateA;
      });

      // Set donations and calculate basic stats
      setDonations(processedDonations);

      // Compute basic statistics
      const stats = {
        total: processedDonations.length,
        active: processedDonations.filter(d => d.status === 'Active').length,
        completed: processedDonations.filter(d => d.status === 'Completed').length,
        expired: processedDonations.filter(d => d.status === 'Expired').length
      };

      // Update donations stats
      setDonationsStats({
        active: stats.active,
        completed: stats.completed,
        expired: stats.expired,
        totalMonthly: stats.total,
        successRate: stats.total > 0
          ? Math.round((stats.completed / stats.total) * 100)
          : 0
      });

      console.log('Fetched Donations:', {
        total: stats.total,
        active: stats.active,
        completed: stats.completed,
        expired: stats.expired
      });

    } catch (error) {
      console.error('Error fetching donations:', error);
      setDonationsError(error.message || 'An unexpected error occurred');
      setDonations([]);
    } finally {
      setDonationsLoading(false);
    }
  };

  // Handler for viewing donation details
  const handleViewDonation = (donation) => {
    setSelectedDonation(donation);
    setShowDonationModal(true);
  };

  // Handler for sending email to donor
  const handleEmailDonor = (donorId, donationId) => {
    // Implement email sending logic
    // This could open an email modal or trigger an email send API call
    alert(`Sending email for donation ${donationId} to donor ${donorId}`);
  };

  // Handler for pausing a donation
  const handlePauseDonation = (donationId) => {
    // Implement donation pause logic
    // This might involve an API call to update donation status
    try {
      fetch(`http://localhost:8080/api/admin/donations/${donationId}/pause`, {
        method: 'PUT'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to pause donation');
          }
          return response.json();
        })
        .then(data => {
          toast.success('Donation paused successfully');
          fetchDonations(); // Refresh donations list
        })
        .catch(error => {
          console.error('Error pausing donation:', error);
          toast.error('Failed to pause donation');
        });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleDeleteDonation = async (donationId) => {
    if (window.confirm('Are you sure you want to delete this donation? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:8080/api/admin/donations/${donationId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`Error deleting donation: ${response.status}`);
        }

        // Refresh donations after deletion
        fetchDonations();
        toast.success('Donation deleted successfully');
      } catch (error) {
        console.error('Error deleting donation:', error);
        toast.error('Failed to delete donation. Please try again.');
      }
    }
  };

  // Function to fetch users from API
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/admin/users');

      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.status}`);
      }

      const data = await response.json();
      setUsersData(data);
      setUsersError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsersError(error.message);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch users when section changes to 'users'
  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers();
    }
  }, [activeSection]);
  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`Error deleting user: ${response.status}`);
        }

        // Refresh user list after successful deletion
        fetchUsers();
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  // Handle verification status update
  const handleUpdateVerificationStatus = async (userId, verificationStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/verify?verified=${verificationStatus}`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error(`Error updating verification status: ${response.status}`);
      }

      // Refresh user list after successful update
      fetchUsers();
      alert(verificationStatus ? 'User verified successfully' : 'User unverified successfully');
    } catch (error) {
      console.error('Error updating verification status:', error);
      alert('Failed to update verification status. Please try again.');
    }
  };

  // Filter users based on selected type
  const filteredUsers = userTypeFilter === 'all'
    ? usersData
    : usersData.filter(user => user.userType.toLowerCase() === userTypeFilter.toLowerCase());

  // Function to handle sending email
  const handleSendEmail = (e) => {
    e.preventDefault();
    // Email sending logic would go here
    setShowEmailModal(false);
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authUser');

    // Redirect to login page
    window.location.href = '/login';
  };

  // Add this at the beginning of your AdminDashboard component
  useEffect(() => {
    // Check if user is logged in
    const authData = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');

    // If not logged in, redirect to login page
    if (!authData) {
      window.location.href = '/login';
    }
  }, []);

  const fetchAdminProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);

    try {
      // Get the logged-in admin's data from storage
      const authData = JSON.parse(localStorage.getItem('authUser') || sessionStorage.getItem('authUser'));

      if (!authData || !authData.email) {
        throw new Error('No authenticated user found');
      }

      console.log("Fetching profile with email:", authData.email); // Add logging

      // Fetch admin profile data from the backend by email
      const response = await fetch(`http://localhost:8080/api/admin/management/profile?email=${encodeURIComponent(authData.email)}`);

      console.log("Profile fetch response status:", response.status); // Add logging

      if (!response.ok) {
        throw new Error(`Error fetching profile: ${response.status}`);
      }

      const data = await response.json();
      console.log("Profile data received:", data); // Add logging
      setAdminProfile(data);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      setProfileError(error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch profile data when the "Profile" section is activated
  useEffect(() => {
    if (activeSection === 'profile') {
      fetchAdminProfile();
    }
  }, [activeSection]);


  // Function to fetch merchants from API
  const fetchMerchants = async () => {
    setMerchantsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/admin/merchants/all');

      console.log("Fetch merchants response status:", response.status);

      if (!response.ok) {
        throw new Error(`Error fetching merchants: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched merchants data:", data);
      setMerchantsData(data);
      setMerchantsError(null);
    } catch (error) {
      console.error("Error fetching merchants:", error);
      setMerchantsError(error.message);
    } finally {
      setMerchantsLoading(false);
    }
  };

  // Fetch merchants when section changes to merchants
  useEffect(() => {
    if (activeSection === 'merchants') {
      fetchMerchants();
    }
  }, [activeSection]);

  {/* View Merchant Details Modal */ }
  const ViewMerchantDetailsModal = ({ isOpen, onClose, merchant }) => {
    if (!isOpen || !merchant) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 overflow-y-auto backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Store className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Merchant Details: {merchant.businessName}
            </h3>
            <button
              onClick={onClose}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Header with Logo */}
            <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
              <div className="w-24 h-24 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/30 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                {merchant.logoBase64 ? (
                  <img
                    src={`data:${merchant.logoType || 'image/jpeg'};base64,${merchant.logoBase64}`}
                    alt={merchant.businessName}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/api/placeholder/96/96';
                    }}
                  />
                ) : (
                  <Store className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <div className="text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{merchant.businessName}</h2>
                  <span className={`mt-2 md:mt-0 md:ml-3 px-3 py-1 text-xs rounded-full inline-flex items-center
                          ${merchant.status === 'Active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : merchant.status === 'Pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`
                  }>
                    <span className={`w-2 h-2 rounded-full mr-1
                            ${merchant.status === 'Active'
                        ? 'bg-green-500'
                        : merchant.status === 'Pending'
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'}`
                    }></span>
                    {merchant.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {merchant.merchantId}</p>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{merchant.businessType}</div>
              </div>
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Information */}
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                  <Store className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Business Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Business Type:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{merchant.businessType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">License Number:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{merchant.businessLicenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">License Verified:</span>
                    <span className={`text-sm font-medium ${merchant.licenseVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {merchant.licenseVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Public Listing:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {merchant.displayInPublicSearch ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Business Hours:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{merchant.businessHours || 'Not specified'}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Description:</span>
                    <p className="text-sm text-gray-900 dark:text-white mt-1 bg-white dark:bg-gray-700 p-2 rounded">
                      {merchant.businessDescription || 'No description provided.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fee Information */}
              <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg">
                <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-3 flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
                  Fee Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fee Type:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {merchant.feeType === 'contractual' ? 'Contractual (Fixed Amount)' :
                        merchant.feeType === 'percentage' ? 'Percentage' : 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fee Amount:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {merchant.feeType === 'contractual'
                        ? `$${merchant.feeAmount || '0.00'}`
                        : merchant.feeType === 'percentage'
                          ? `${merchant.feeAmount || '0.00'}%`
                          : 'Not specified'}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fee Description:</span>
                    <p className="text-sm text-gray-900 dark:text-white mt-1 bg-white dark:bg-gray-700 p-2 rounded">
                      {merchant.feeType === 'contractual'
                        ? 'Fixed amount charged per transaction'
                        : merchant.feeType === 'percentage'
                          ? 'Percentage of transaction value'
                          : 'No fee description available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                  Owner Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Full Name:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{merchant.ownerFirstName} {merchant.ownerLastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{merchant.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{merchant.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Email Verified:</span>
                    <span className={`text-sm font-medium ${merchant.emailVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {merchant.emailVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Identity Verified:</span>
                    <span className={`text-sm font-medium ${merchant.identityVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {merchant.identityVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Joined:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(merchant.joined).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-300 mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                  Location Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">Address:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white flex-1">{merchant.businessAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">City:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{merchant.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">State/Province:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{merchant.stateProvince}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Postal Code:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{merchant.postalCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Direct Messages:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {merchant.allowDirectMessages ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Donation Information */}
              <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg">
                <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-3 flex items-center">
                  <Package className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
                  Donation Information
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Donation Types:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {merchant.donatesPreparedMeals && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">Prepared Meals</span>
                    )}
                    {merchant.donatesFreshProduce && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">Fresh Produce</span>
                    )}
                    {merchant.donatesBakedGoods && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">Baked Goods</span>
                    )}
                    {merchant.donatesPackagedFoods && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">Packaged Foods</span>
                    )}
                    {merchant.donatesDairyProducts && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">Dairy Products</span>
                    )}
                    {merchant.cannedFoods && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">Canned Foods</span>
                    )}
                    {!merchant.donatesPreparedMeals && !merchant.donatesFreshProduce &&
                      !merchant.donatesBakedGoods && !merchant.donatesPackagedFoods &&
                      !merchant.donatesDairyProducts && !merchant.cannedFoods && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs rounded-full">None specified</span>
                      )}
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Donation Frequency:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{merchant.donationFrequency || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Donation Size:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{merchant.donationSize || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Notifications:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {merchant.receiveNotifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* License Document Preview */}
            {merchant.licenseDocumentBase64 && (
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">License Document</h4>
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-3">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{merchant.licenseDocumentName || "Trade License"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{merchant.licenseDocumentType}</p>
                  </div>
                  <a
                    href={`http://localhost:8080/api/admin/merchants/${merchant.merchantId}/license`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                  >
                    <Download className="h-4 w-4 inline mr-1" />View
                  </a>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditMerchantModal = ({ isOpen, onClose, merchant, fetchMerchants }) => {
    // Initialize form data with merchant's current values
    const [formData, setFormData] = useState(
      merchant ? {
        businessName: merchant?.businessName || '',
        businessType: merchant?.businessType || '',
        businessDescription: merchant?.businessDescription || '',
        businessHours: merchant?.businessHours || '',

        // Owner information
        ownerFirstName: merchant?.ownerFirstName || '',
        ownerLastName: merchant?.ownerLastName || '',
        email: merchant?.email || '',
        phoneNumber: merchant?.phoneNumber || '',

        // Business details
        businessLicenseNumber: merchant?.businessLicenseNumber || '',
        licenseVerified: merchant?.licenseVerified || false,
        displayInPublicSearch: merchant?.displayInPublicSearch || false,

        // Location information
        businessAddress: merchant?.businessAddress || '',
        city: merchant?.city || '',
        stateProvince: merchant?.stateProvince || '',
        postalCode: merchant?.postalCode || '',

        // Donation information
        donatesPreparedMeals: merchant?.donatesPreparedMeals || false,
        donatesFreshProduce: merchant?.donatesFreshProduce || false,
        donatesBakedGoods: merchant?.donatesBakedGoods || false,
        donatesPackagedFoods: merchant?.donatesPackagedFoods || false,
        donatesDairyProducts: merchant?.donatesDairyProducts || false,
        cannedFoods: merchant?.cannedFoods || false,
        donationFrequency: merchant?.donationFrequency || '',
        donationSize: merchant?.donationSize || '',

        // Communication preferences
        receiveNotifications: merchant?.receiveNotifications || false,
        allowDirectMessages: merchant?.allowDirectMessages || false,

        // Account status
        status: merchant?.status || 'Pending',
        emailVerified: merchant?.emailVerified || false,
        identityVerified: merchant?.identityVerified || false,

        // NEW: Fee information
        feeType: merchant?.feeType || 'contractual',
        feeAmount: merchant?.feeAmount || '0.00'
      } : {}
    );

    const [logoPreview, setLogoPreview] = useState(
      merchant?.logoBase64 ? `data:${merchant.logoType || 'image/jpeg'};base64,${merchant.logoBase64}` : null
    );

    const [newLogoFile, setNewLogoFile] = useState(null);
    const [newLicenseFile, setNewLicenseFile] = useState(null);

    if (!isOpen || !merchant) return null;

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    };

    // Handle logo file selection
    const handleLogoSelect = (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setNewLogoFile(file);

        // Display preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    // Handle license file selection
    const handleLicenseSelect = (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setNewLicenseFile(file);
      }
    };

    const handleVerificationToggle = (field) => {
      setFormData({
        ...formData,
        [field]: !formData[field]
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      // Create FormData for file upload
      const submitData = new FormData();

      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'boolean') {
          submitData.append(key, formData[key].toString());
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      // Add new files if selected
      if (newLogoFile) {
        submitData.append('logo', newLogoFile);
      }

      if (newLicenseFile) {
        submitData.append('licenseDocument', newLicenseFile);
      }

      // Show loading state on button
      const submitButton = e.target.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">...</svg> Updating...';

      try {
        const response = await fetch(`http://localhost:8080/api/admin/merchants/${merchant.merchantId}`, {
          method: 'PUT',
          body: submitData
        });

        const data = await response.json();

        if (data.success) {
          alert('Merchant updated successfully');
          onClose();
          // Refresh the merchants list
          if (fetchMerchants) fetchMerchants();
        } else {
          alert('Error updating merchant: ' + data.message);
        }
      } catch (error) {
        console.error('Error updating merchant:', error);
        alert('Failed to update merchant. Please try again.');
      } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 overflow-y-auto backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Edit className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Edit Merchant: {merchant.businessName}
            </h3>
            <button onClick={onClose} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Logo Upload Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="relative">
                <div className="h-24 w-24 rounded-xl object-cover border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900/30 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt={formData.businessName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Store className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <label htmlFor="logo-upload" className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors">
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoSelect}
                  />
                </label>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-medium text-gray-900 dark:text-white">Business Logo</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload a logo for the merchant's business profile.</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Recommended size: 400x400px. PNG, JPG or GIF.</p>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview(null);
                      setNewLogoFile(null);
                    }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    Remove logo
                  </button>
                )}
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-lg">
              <h4 className="font-medium text-indigo-800 dark:text-indigo-300 mb-3 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                Account Status
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Merchant Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emailVerified"
                    name="emailVerified"
                    checked={formData.emailVerified}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 dark:text-indigo-500 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  />
                  <label htmlFor="emailVerified" className="text-sm text-gray-700 dark:text-gray-300">Email Verified</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="identityVerified"
                    name="identityVerified"
                    checked={formData.identityVerified}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 dark:text-indigo-500 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  />
                  <label htmlFor="identityVerified" className="text-sm text-gray-700 dark:text-gray-300">Identity Verified</label>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                <Store className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Business Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Type</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="grocery">Grocery Store</option>
                    <option value="bakery">Bakery</option>
                    <option value="cafe">Café</option>
                    <option value="hotel">Hotel</option>
                    <option value="catering">Catering Service</option>
                    <option value="food_manufacturer">Food Manufacturer</option>
                    <option value="farm">Farm/Agriculture</option>
                    <option value="other">Other Food Business</option>
                  </select>
                </div>
                {/* NEW: Fee Information Section */}
                <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg md:col-span-2">
                  <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-3 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
                    Fee Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Merchant Fee Type*</label>
                      <select
                        name="feeType"
                        value={formData.feeType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="contractual">Contractual (Fixed Amount)</option>
                        <option value="percentage">Percentage</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {formData.feeType === 'contractual' ? 'Fixed Fee Amount*' : 'Fee Percentage*'}
                      </label>
                      <div className="relative">
                        {formData.feeType === 'contractual' && (
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                          </div>
                        )}
                        <input
                          type="text"
                          name="feeAmount"
                          value={formData.feeAmount}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder={formData.feeType === 'contractual' ? '0.00' : '0.0'}
                          required
                          style={{ paddingLeft: formData.feeType === 'contractual' ? '2rem' : '0.75rem' }}
                        />
                        {formData.feeType === 'percentage' && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">%</span>
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {formData.feeType === 'contractual'
                          ? 'Fixed amount charged per transaction'
                          : 'Percentage of transaction value'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Description</label>
                  <textarea
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Brief description of the business and types of food they offer"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Hours</label>
                  <input
                    type="text"
                    name="businessHours"
                    value={formData.businessHours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="E.g., Mon-Fri: 9am-8pm, Sat: 10am-6pm, Sun: Closed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business License Number</label>
                  <input
                    type="text"
                    name="businessLicenseNumber"
                    value={formData.businessLicenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="licenseVerified"
                      name="licenseVerified"
                      checked={formData.licenseVerified}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <label htmlFor="licenseVerified" className="text-sm text-gray-700 dark:text-gray-300">License Verified</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="displayInPublicSearch"
                      name="displayInPublicSearch"
                      checked={formData.displayInPublicSearch}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <label htmlFor="displayInPublicSearch" className="text-sm text-gray-700 dark:text-gray-300">Display in Public Search</label>
                  </div>
                </div>

                {/* License Document Update */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Update License Document (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center">
                    <input
                      type="file"
                      id="license-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleLicenseSelect}
                    />
                    <label
                      htmlFor="license-upload"
                      className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Click to upload new license document
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
                    {newLicenseFile && (
                      <div className="mt-2 text-sm text-gray-900 dark:text-white">
                        New file selected: {newLicenseFile.name}
                      </div>
                    )}
                    {merchant.licenseDocumentBase64 && !newLicenseFile && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Current license document: {merchant.licenseDocumentName || "Trade License"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                Owner Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                  <input
                    type="text"
                    name="ownerFirstName"
                    value={formData.ownerFirstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="ownerLastName"
                    value={formData.ownerLastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                Location Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Address</label>
                  <input
                    type="text"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State/Province</label>
                  <input
                    type="text"
                    name="stateProvince"
                    value={formData.stateProvince}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowDirectMessages"
                    name="allowDirectMessages"
                    checked={formData.allowDirectMessages}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 dark:text-green-500 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 dark:focus:ring-green-400"
                  />
                  <label htmlFor="allowDirectMessages" className="text-sm text-gray-700 dark:text-gray-300">Allow Direct Messages</label>
                </div>
              </div>
            </div>
            {/* Donation Information */}
            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg">
              <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-3 flex items-center">
                <Package className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
                Donation Information
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Donation Types</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="donatesPreparedMeals"
                      name="donatesPreparedMeals"
                      checked={formData.donatesPreparedMeals}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-amber-600 dark:text-amber-500 border-gray-300 dark:border-gray-600 rounded focus:ring-amber-500 dark:focus:ring-amber-400"
                    />
                    <label htmlFor="donatesPreparedMeals" className="text-sm text-gray-700 dark:text-gray-300">Prepared Meals</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="donatesFreshProduce"
                      name="donatesFreshProduce"
                      checked={formData.donatesFreshProduce}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-amber-600 dark:text-amber-500 border-gray-300 dark:border-gray-600 rounded focus:ring-amber-500 dark:focus:ring-amber-400"
                    />
                    <label htmlFor="donatesFreshProduce" className="text-sm text-gray-700 dark:text-gray-300">Fresh Produce</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="donatesBakedGoods"
                      name="donatesBakedGoods"
                      checked={formData.donatesBakedGoods}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-amber-600 dark:text-amber-500 border-gray-300 dark:border-gray-600 rounded focus:ring-amber-500 dark:focus:ring-amber-400"
                    />
                    <label htmlFor="donatesBakedGoods" className="text-sm text-gray-700 dark:text-gray-300">Baked Goods</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="donatesPackagedFoods"
                      name="donatesPackagedFoods"
                      checked={formData.donatesPackagedFoods}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-amber-600 dark:text-amber-500 border-gray-300 dark:border-gray-600 rounded focus:ring-amber-500 dark:focus:ring-amber-400"
                    />
                    <label htmlFor="donatesPackagedFoods" className="text-sm text-gray-700 dark:text-gray-300">Packaged Foods</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="donatesDairyProducts"
                      name="donatesDairyProducts"
                      checked={formData.donatesDairyProducts}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-amber-600 dark:text-amber-500 border-gray-300 dark:border-gray-600 rounded focus:ring-amber-500 dark:focus:ring-amber-400"
                    />
                    <label htmlFor="donatesDairyProducts" className="text-sm text-gray-700 dark:text-gray-300">Dairy Products</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="cannedFoods"
                      name="cannedFoods"
                      checked={formData.cannedFoods}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-amber-600 dark:text-amber-500 border-gray-300 dark:border-gray-600 rounded focus:ring-amber-500 dark:focus:ring-amber-400"
                    />
                    <label htmlFor="cannedFoods" className="text-sm text-gray-700 dark:text-gray-300">Canned Foods</label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Donation Frequency</label>
                  <select
                    name="donationFrequency"
                    value={formData.donationFrequency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="few_times_week">Few times a week</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="irregular">Irregular/As available</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Donation Size</label>
                  <select
                    name="donationSize"
                    value={formData.donationSize}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select size</option>
                    <option value="small">Small (1-5 meals)</option>
                    <option value="medium">Medium (5-20 meals)</option>
                    <option value="large">Large (20-50 meals)</option>
                    <option value="xlarge">Very Large (50+ meals)</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="receiveNotifications"
                    name="receiveNotifications"
                    checked={formData.receiveNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-amber-600 dark:text-amber-500 border-gray-300 dark:border-gray-600 rounded focus:ring-amber-500 dark:focus:ring-amber-400"
                  />
                  <label htmlFor="receiveNotifications" className="text-sm text-gray-700 dark:text-gray-300">Receive Notifications</label>
                </div>
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };


  const handleAddMerchant = (e) => {
    e.preventDefault();

   
    const form = e.target;

    // Define required fields
    const requiredFields = [
      { name: 'businessName', selector: '[placeholder="Restaurant or store name"]' },
      { name: 'businessType', selector: '[name="businessType"]' },
      { name: 'ownerFirstName', selector: '[placeholder="First name"]' },
      { name: 'ownerLastName', selector: '[placeholder="Last name"]' },
      { name: 'email', selector: '[placeholder="business@example.com"]' },
      { name: 'password', selector: '[placeholder="Merchant123@#$"]' },
      { name: 'phoneNumber', selector: '[placeholder="(123) 456-7890"]' },
      { name: 'businessLicenseNumber', selector: '[placeholder="License number"]' },
      { name: 'businessAddress', selector: '[placeholder="Street address"]' },
      { name: 'city', selector: '[placeholder="City"]' },
      { name: 'stateProvince', selector: '[placeholder="State"]' },
      { name: 'postalCode', selector: '[placeholder="Zip code"]' }
    ];

    // Check for missing fields
    const missingFields = [];
    requiredFields.forEach(field => {
      const element = form.querySelector(field.selector);
      const value = element ? element.value : '';
      if (!value.trim()) {
        missingFields.push(field.name);
        // Highlight the missing field with a red border
        if (element) {
          element.classList.add('border-red-500');
        }
      }
    });

    // If there are missing fields, show an error and stop submission
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Check if license file is selected
    if (!licenseFile) {
      alert('Business license document is required');
      return;
    }

    // Create FormData properly
    const formData = new FormData();

    // Add all required fields explicitly
    formData.append('businessName', form.querySelector('[placeholder="Restaurant or store name"]').value);
    formData.append('businessType', form.querySelector('[name="businessType"]').value);
    formData.append('businessDescription', form.querySelector('[placeholder="Brief description of your business and the types of food you typically offer"]')?.value || '');
    formData.append('ownerFirstName', form.querySelector('[placeholder="First name"]').value);
    formData.append('ownerLastName', form.querySelector('[placeholder="Last name"]').value);
    formData.append('email', form.querySelector('[placeholder="business@example.com"]').value);
    formData.append('password', form.querySelector('[placeholder="Merchant123@#$"]').value);
    formData.append('phoneNumber', form.querySelector('[placeholder="(123) 456-7890"]').value);

    formData.append('nationalIdNumber', form.querySelector('[placeholder="National ID number"]')?.value || '');
    formData.append('passportNumber', form.querySelector('[placeholder="Passport number"]')?.value || '');
    formData.append('birthCertificateNumber', form.querySelector('[placeholder="Birth certificate number"]')?.value || '');
    formData.append('bloodGroup', form.querySelector('[name="bloodGroup"]')?.value || '');

    formData.append('businessLicenseNumber', form.querySelector('[placeholder="License number"]').value);
    formData.append('businessAddress', form.querySelector('[placeholder="Street address"]').value);
    formData.append('city', form.querySelector('[placeholder="City"]').value);
    formData.append('stateProvince', form.querySelector('[placeholder="State"]').value);
    formData.append('postalCode', form.querySelector('[placeholder="Zip code"]').value);
    formData.append('businessHours', form.querySelector('[placeholder="E.g., Mon-Fri: 9am-8pm, Sat: 10am-6pm, Sun: Closed"]')?.value || '');

    // Add fee information
    formData.append('feeType', feeType);

    // Get the correct fee amount based on fee type
    let feeAmountValue = '0.00';
    if (feeType === 'contractual') {
      const fixedFeeInput = form.querySelector('[name="fixedFeeAmount"]');
      feeAmountValue = fixedFeeInput?.value || '0.00';
    } else {
      const percentageInput = form.querySelector('[name="feePercentage"]');
      feeAmountValue = percentageInput?.value || '0.00';
    }

    formData.append('feeAmount', feeAmountValue);

    // UPDATED: Correctly handle checkboxes by directly targeting them by name or id
    // Find checkboxes directly by proper identifiers
    const preparedMealsCheckbox = form.querySelector('input#preparedMeals') || form.querySelector('input[name="preparedMeals"]');
    const freshProduceCheckbox = form.querySelector('input#freshProduce') || form.querySelector('input[name="freshProduce"]');
    const bakedGoodsCheckbox = form.querySelector('input#bakedGoods') || form.querySelector('input[name="bakedGoods"]');
    const packagedFoodsCheckbox = form.querySelector('input#packagedFoods') || form.querySelector('input[name="packagedFoods"]');
    const dairyProductsCheckbox = form.querySelector('input#dairyProducts') || form.querySelector('input[name="dairyProducts"]');

    // Log the checkbox elements for debugging
    console.log("Prepared Meals checkbox:", preparedMealsCheckbox);
    console.log("Fresh Produce checkbox:", freshProduceCheckbox);
    console.log("Baked Goods checkbox:", bakedGoodsCheckbox);
    console.log("Packaged Foods checkbox:", packagedFoodsCheckbox);
    console.log("Dairy Products checkbox:", dairyProductsCheckbox);

    // Add donation type values to form data
    formData.append('donatesPreparedMeals', preparedMealsCheckbox?.checked ? 'true' : 'false');
    formData.append('donatesFreshProduce', freshProduceCheckbox?.checked ? 'true' : 'false');
    formData.append('donatesBakedGoods', bakedGoodsCheckbox?.checked ? 'true' : 'false');
    formData.append('donatesPackagedFoods', packagedFoodsCheckbox?.checked ? 'true' : 'false');
    formData.append('donatesDairyProducts', dairyProductsCheckbox?.checked ? 'true' : 'false');

    // Donation details
    const donationFrequency = form.querySelector('[name="donationFrequency"]')?.value;
    formData.append('donationFrequency', donationFrequency || '');

    const donationSize = form.querySelector('[name="donationSize"]')?.value;
    formData.append('donationSize', donationSize || '');

    // Files - add additional validation for file types and sizes
    if (logoFile) {
      formData.append('logo', logoFile);
      console.log("Logo file added:", logoFile.name, logoFile.size, logoFile.type);
    }

    if (licenseFile) {
      formData.append('licenseDocument', licenseFile);
      console.log("License file added:", licenseFile.name, licenseFile.size, licenseFile.type);
    } else {
      console.error("License file is required but not available");
      alert('Business license document is required');
      return;
    }

    // Debug FormData contents
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Display loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">...</svg> Adding...';

    fetch('http://localhost:8080/api/admin/merchants/add', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        console.log("Server response status:", response.status);
        return response.json();
      })
      .then(data => {
        console.log("Server response data:", data);
        if (data.success) {
          alert('Merchant added successfully!');
          setShowAddMerchantModal(false);
          // Refresh merchant list
          fetchMerchants();
        } else {
          // Display the specific error message from the backend
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error adding merchant:', error);
        alert('Failed to add merchant. Please try again.');
      })
      .finally(() => {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      });
  };

  // Function to handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Profile update logic would go here
    setShowProfileModal(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // Show loading state on button
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">...</svg> Adding...';

    try {
      const response = await fetch('http://localhost:8080/api/admin/users', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert('User added successfully');
        setShowAddUserModal(false);
        fetchUsers(); // Refresh user list
      } else {
        // Specific error handling
        switch (data.error) {
          case 'email_exists':
            alert('An account with this email already exists');
            // Optionally highlight email input
            e.target.querySelector('[name="email"]').classList.add('border-red-500');
            break;

          case 'phone_exists':
            alert('An account with this Phone already exists');
            // Optionally highlight phone input
            e.target.querySelector('[name="phone"]').classList.add('border-red-500');
            break;

          case 'national_id_exists':
            alert('An account with this National ID already exists');
            // Optionally highlight national ID input
            e.target.querySelector('[name="nationalId"]').classList.add('border-red-500');
            break;

          default:
            alert(data.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred');
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  };

  // ============== MODALS ==============

  useEffect(() => {
    if (activeSection === 'NewAdmin') {
      fetchAdmins();
    }
  }, [activeSection]);

  const handleAddAdmin = (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData();

    // Add all required fields from your form
    formData.append('firstName', e.target.querySelector('[placeholder="Enter first name"]').value);
    formData.append('lastName', e.target.querySelector('[placeholder="Enter last name"]').value);
    formData.append('email', e.target.querySelector('[placeholder="admin@example.com"]').value);
    formData.append('phoneNumber', e.target.querySelector('[placeholder="(123) 456-7890"]').value);
    formData.append('password', e.target.querySelector('[placeholder="Set password"]').value);
    formData.append('role', e.target.querySelector('select').value);

    // Add profile photo if available
    const profilePhotoInput = e.target.querySelector('#admin-photo');
    if (profilePhotoInput && profilePhotoInput.files[0]) {
      formData.append('profilePhoto', profilePhotoInput.files[0]);
    }

    // Show loading state on button
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">...</svg> Adding...';

    // Send request to backend
    fetch('http://localhost:8080/api/admin/management/add', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Admin added successfully!');
          setShowAddAdminModal(false);
          fetchAdmins(); // Refresh admin list
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error adding admin:', error);
        alert('Failed to add admin. Please try again.');
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      });
  };
  // Add fetch function
  const fetchAdmins = async () => {
    setAdminsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/admin/management/all');
      if (!response.ok) {
        throw new Error(`Error fetching admins: ${response.status}`);
      }
      const data = await response.json();
      setAdminsData(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setAdminsLoading(false);
    }
  };

  const AddAdminModal = () => {
    // Always define hooks at the top level, not conditionally
    const [imagePreview, setImagePreview] = useState(null);
    const [showModal, setShowModal] = useState(true);

    if (!showAddAdminModal) return null;

    // Handle image upload
    const handleImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all ease-in-out duration-300 scale-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 p-5 flex justify-between items-center rounded-t-xl">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <UserPlus className="h-6 w-6 mr-3 text-blue-100" />
              Add New Admin User
            </h3>
            <button
              onClick={() => setShowAddAdminModal(false)}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <form onSubmit={handleAddAdmin} className="p-8 space-y-6">
            {/* Two Column Layout for Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Profile Picture */}
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="h-36 w-36 rounded-full border-4 border-blue-100 dark:border-blue-900/30 shadow-lg dark:shadow-gray-900/30 bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden group-hover:border-blue-300 dark:group-hover:border-blue-800 transition-all duration-300">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-gray-300 dark:text-gray-500" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 dark:bg-opacity-0 group-hover:bg-opacity-30 dark:group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300">
                        <Upload className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                    </div>
                    <label htmlFor="admin-photo" className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white p-3 rounded-full cursor-pointer shadow-lg hover:from-blue-600 hover:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 transition-all duration-300">
                      <Upload className="h-5 w-5" />
                      <input
                        type="file"
                        id="admin-photo"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">Upload admin profile photo<br />(Optional)</p>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="md:col-span-2 space-y-6">
                {/* Personal Info Section */}
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-5">
                  <h4 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-700 dark:text-blue-400" />
                    Personal Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact & Role Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Contact Details */}
                  <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-5">
                    <h4 className="text-md font-medium text-indigo-800 dark:text-indigo-300 mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-indigo-700 dark:text-indigo-400" />
                      Contact Details
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="admin@example.com"
                          />
                          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                        <div className="relative">
                          <input
                            type="tel"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="(123) 456-7890"
                          />
                          <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Role & Access */}
                  <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-5">
                    <h4 className="text-md font-medium text-purple-800 dark:text-purple-300 mb-4 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-purple-700 dark:text-purple-400" />
                      Role & Access
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Admin Role</label>
                        <div className="relative">
                          <select className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-500 appearance-none transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <option value="system_admin">System Administrator</option>
                            <option value="user_management">User Management</option>
                            <option value="content_control">Content Control</option>
                            <option value="merchant_admin">Merchant Admin</option>
                            <option value="reports_analytics">Reports & Analytics</option>
                          </select>
                          <Shield className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                          <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-5">
                  <h4 className="text-md font-medium text-green-800 dark:text-green-300 mb-4 flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-green-700 dark:text-green-400" />
                    Security
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 dark:focus:border-green-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="Set password"
                        />
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 dark:focus:border-green-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="Confirm password"
                        />
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowAddAdminModal(false)}
                className="mr-4 px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 shadow-md transition-all duration-200 flex items-center"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AddUserModal = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthdate: '',
      bloodGroup: '',
      nationalId: '',
      address: '',
      addressDescription: '',
      userType: '',
      password: '',
      confirmPassword: ''
    });

    const { darkMode } = useTheme(); // Use the theme context

    // Handle image upload preview
    const handleImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleAddUser = async (e) => {
      e.preventDefault();

      // Reset previous errors
      setErrors({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthdate: '',
        bloodGroup: '',
        nationalId: '',
        address: '',
        addressDescription: '',
        userType: '',
        password: '',
        confirmPassword: ''
      });

      const form = e.target;
      const formData = new FormData(form);

      // Show loading state on button
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">...</svg> Adding...';

      try {
        const response = await fetch('http://localhost:8080/api/admin/users', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          alert('User added successfully');
          setShowAddUserModal(false);
          fetchUsers(); // Refresh user list
        } else {
          // Detailed error handling
          switch (data.error) {
            case 'email_exists':
              setErrors(prev => ({
                ...prev,
                email: 'An account with this email already exists'
              }));
              break;

            case 'phone_exists':
              setErrors(prev => ({
                ...prev,
                phone: 'An account with this phone number already exists'
              }));
              break;

            case 'national_id_exists':
              setErrors(prev => ({
                ...prev,
                nationalId: 'An account with this National ID already exists'
              }));
              break;

            default:
              alert(data.message || 'Registration failed');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred');
      } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    };

    if (!showAddUserModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all ease-in-out duration-300 scale-100`}>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex justify-between items-center rounded-t-xl">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <UserPlus className="h-6 w-6 mr-3 text-blue-100" />
              Add New User
            </h3>
            <button
              onClick={() => setShowAddUserModal(false)}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <form onSubmit={handleAddUser} className="p-8 space-y-6" encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Profile Picture */}
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="h-36 w-36 rounded-full border-4 border-blue-100 dark:border-blue-900/50 shadow-lg dark:shadow-gray-900/30 bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden group-hover:border-blue-300 dark:group-hover:border-blue-800 transition-all duration-300">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-gray-300 dark:text-gray-500" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
                        <Upload className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                    </div>
                    <label htmlFor="user-photo" className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-full cursor-pointer shadow-lg hover:from-blue-600 hover:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 transition-all duration-300">
                      <Upload className="h-5 w-5" />
                      <input
                        type="file"
                        id="user-photo"
                        name="userPhoto"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                      />
                    </label>
                  </div>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">Upload user profile photo</p>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="md:col-span-2 space-y-6">
                {/* Personal Info Section */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-lg">
                  <h4 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-700 dark:text-blue-400" />
                    Personal Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name*</label>
                      <input
                        type="text"
                        name="firstName"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.firstName
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                          }`}
                        placeholder="Enter first name"
                        required
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name*</label>
                      <input
                        type="text"
                        name="lastName"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.lastName
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                          }`}
                        placeholder="Enter last name"
                        required
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact & Identification Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Contact Details */}
                  <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-lg">
                    <h4 className="text-md font-medium text-green-800 dark:text-green-300 mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-green-700 dark:text-green-400" />
                      Contact Details
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address*</label>
                        <input
                          type="email"
                          name="email"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white'
                            }`}
                          placeholder="email@example.com"
                          required
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number*</label>
                        <input
                          type="tel"
                          name="phone"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white'
                            }`}
                          placeholder="(123) 456-7890"
                          required
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Identification Details */}
                  <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-lg">
                    <h4 className="text-md font-medium text-purple-800 dark:text-purple-300 mb-4 flex items-center">
                      <ShieldCheck className="h-5 w-5 mr-2 text-purple-700 dark:text-purple-400" />
                      Identification
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Birthdate*</label>
                        <input
                          type="date"
                          name="birthdate"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.birthdate
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white'
                            }`}
                          required
                        />
                        {errors.birthdate && (
                          <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Blood Group*</label>
                        <select
                          name="bloodGroup"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.bloodGroup
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white'
                            }`}
                          required
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                        {errors.bloodGroup && (
                          <p className="text-red-500 text-xs mt-1">{errors.bloodGroup}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">National ID</label>
                        <input
                          type="text"
                          name="nationalId"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.nationalId
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white'
                            }`}
                          placeholder="Optional"
                        />
                        {errors.nationalId && (
                          <p className="text-red-500 text-xs mt-1">{errors.nationalId}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address & Role Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 p-5 rounded-lg">
                    <h4 className="text-md font-medium text-yellow-800 dark:text-yellow-300 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-yellow-700 dark:text-yellow-400" />
                      Address Details
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address*</label>
                        <input
                          type="text"
                          name="address"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.address
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white'
                            }`}
                          placeholder="Street address"
                          required
                        />
                        {errors.address && (
                          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address Description*</label>
                        <textarea
                          name="addressDescription"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.addressDescription
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white'
                            }`}
                          placeholder="Additional address details"
                          required
                        />
                        {errors.addressDescription && (
                          <p className="text-red-500 text-xs mt-1">{errors.addressDescription}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-lg">
                    <h4 className="text-md font-medium text-indigo-800 dark:text-indigo-300 mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-indigo-700 dark:text-indigo-400" />
                      User Role & Credentials
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">User Role*</label>
                        <select
                          name="userType"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.userType
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white'
                            }`}
                          required
                        >
                          <option value="">Select User Role</option>
                          <option value="donor">Donor</option>
                          <option value="receiver">Receiver</option>
                        </select>
                        {errors.userType && (
                          <p className="text-red-500 text-xs mt-1">{errors.userType}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password*</label>
                        <input
                          type="password"
                          name="password"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.password
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white'
                            }`}
                          placeholder="Enter password"
                          required
                        />
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password*</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white'
                            }`}
                          placeholder="Confirm password"
                          required
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional Bio Section */}
                <div className="bg-teal-50 dark:bg-teal-900/10 p-5 rounded-lg">
                  <h4 className="text-md font-medium text-teal-800 dark:text-teal-300 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-teal-700 dark:text-teal-400" />
                    Optional Information
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
                    <textarea
                      name="bio"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Optional: Tell us a bit about yourself"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="mr-4 px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 shadow-md transition-all duration-200 flex items-center"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  // Email modal component
  const EmailModal = () => {
    if (!showEmailModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
          <div className="border-b p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Send Email to {selectedUser?.name}</h3>
            <button onClick={() => setShowEmailModal(false)} className="hover:bg-gray-100 p-1 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSendEmail} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your message here..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attach Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <input type="file" accept="image/*" multiple className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-800">
                  Click to upload images
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Send Email
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AddMerchantModal = () => {
    // State for fee type and amount
    const [feeType, setFeeType] = useState('contractual');

    if (!showAddMerchantModal) return null;

    // Handle logo file selection
    const handleLogoSelect = (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setLogoFile(file);
      }
    };

    // Handle license file selection
    const handleLicenseSelect = (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        console.log("License file selected:", file.name, file.size, file.type);

        // Validate file type and size
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
          alert('Please select a PDF, JPG, or PNG file');
          return;
        }

        if (file.size > maxSize) {
          alert('File is too large. Maximum size is 5MB');
          return;
        }

        setLicenseFile(file);
      }
    };

    // Handle fee type change
    const handleFeeTypeChange = (e) => {
      setFeeType(e.target.value);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm overflow-hidden">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/40 w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 flex flex-col">
          <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Store className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Add New Merchant
            </h3>
            <button onClick={() => setShowAddMerchantModal(false)} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleAddMerchant} className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Form Sections */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg mb-2">
              <h4 className="font-medium text-indigo-800 dark:text-indigo-300 mb-3 flex items-center">
                <Store className="h-4 w-4 mr-2" />
                Business Information
              </h4>

              {/* Logo Upload Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Logo</label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-20 w-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                    {logoFile ? (
                      <img
                        src={URL.createObjectURL(logoFile)}
                        alt="Business Logo Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Store className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="file"
                        id="logo-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoSelect}
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-md transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {logoFile ? 'Change Logo' : 'Upload Logo'}
                      </label>
                      {logoFile && (
                        <button
                          type="button"
                          onClick={() => setLogoFile(null)}
                          className="ml-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">PNG, JPG, or GIF up to 2MB. Recommended size: 400x400px</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name*</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Restaurant or store name"
                    required
                    name="businessName"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Type*</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                    name="businessType">
                    <option value="">Select business type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="grocery">Grocery Store</option>
                    <option value="bakery">Bakery</option>
                    <option value="cafe">Café</option>
                    <option value="hotel">Hotel</option>
                    <option value="catering">Catering Service</option>
                    <option value="food_manufacturer">Food Manufacturer</option>
                    <option value="farm">Farm/Agriculture</option>
                    <option value="other">Other Food Business</option>
                  </select>
                </div>

                {/* New Merchant Fee Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Merchant Fee Type*</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                    name="feeType"
                    value={feeType}
                    onChange={handleFeeTypeChange}
                  >
                    <option value="contractual">Contractual (Fixed Amount)</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {feeType === 'contractual' ? 'Fixed Fee Amount*' : 'Fee Percentage*'}
                  </label>
                  <div className="relative">
                    {feeType === 'contractual' && (
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                      </div>
                    )}
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder={feeType === 'contractual' ? '0.00' : '0.0'}
                      required
                      name={feeType === 'contractual' ? 'fixedFeeAmount' : 'feePercentage'}
                      style={{ paddingLeft: feeType === 'contractual' ? '2rem' : '0.75rem' }}
                    />
                    {feeType === 'percentage' && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">%</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {feeType === 'contractual'
                      ? 'Fixed amount charged per transaction'
                      : 'Percentage of transaction value'}
                  </p>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Brief description of your business and the types of food you typically offer"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Owner/Manager Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner First Name*</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner Last Name*</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Last name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address*</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="business@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Merchant123@#$"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number*</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-2">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-3 flex items-center">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Identification Details
              </h4>
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 rounded">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Note:</strong> At least one form of identification is mandatory for verification.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">National ID Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="National ID number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Passport Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Passport number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Birth Certificate Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Birth certificate number"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group (Optional)</label>
                <select className="w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  name="bloodGroup">
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
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-2">
              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Business Licenses & Certifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business/Trade License Number*</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="License number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">License Document*</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4">
                    {/* Updated License Upload Section */}
                    <div className="flex flex-col items-center">
                      {licenseFile ? (
                        <div className="mb-3 flex flex-col items-center">
                          <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg">
                            <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="text-sm mt-1 text-gray-700 dark:text-gray-300 truncate max-w-xs">
                            {licenseFile.name}
                          </span>
                        </div>
                      ) : (
                        <Upload className="h-8 w-8 mb-2 text-gray-400 dark:text-gray-500" />
                      )}

                      <input
                        type="file"
                        id="license-upload"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleLicenseSelect}
                        required
                      />
                      <label
                        htmlFor="license-upload"
                        className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        {licenseFile ? 'Change File' : 'Click to upload business license'}
                      </label>

                      {licenseFile && (
                        <button
                          type="button"
                          onClick={() => setLicenseFile(null)}
                          className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Remove file
                        </button>
                      )}

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PDF, JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg mb-2">
              <h4 className="font-medium text-pink-800 dark:text-pink-300 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Business Location
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Address*</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Street address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City*</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State/Province*</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="State"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code*</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Zip code"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Hours</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="E.g., Mon-Fri: 9am-8pm, Sat: 10am-6pm, Sun: Closed"
                  rows="2"
                ></textarea>
              </div>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg mb-2">
              <h4 className="font-medium text-teal-800 dark:text-teal-300 mb-3 flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Food Donation Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Types of Food Available for Donation</label>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="h-4 w-4 text-teal-600 dark:text-teal-500 rounded mr-2 border-gray-300 dark:border-gray-600" id="preparedMeals" name="preparedMeals" />
                      <span className="text-gray-700 dark:text-gray-300">Prepared Meals</span>
                    </label>
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="h-4 w-4 text-teal-600 dark:text-teal-500 rounded mr-2 border-gray-300 dark:border-gray-600" id="freshProduce" name="freshProduce" />
                      <span className="text-gray-700 dark:text-gray-300">Fresh Produce</span>
                    </label>
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="h-4 w-4 text-teal-600 dark:text-teal-500 rounded mr-2 border-gray-300 dark:border-gray-600" id="bakedGoods" name="bakedGoods" />
                      <span className="text-gray-700 dark:text-gray-300">Baked Goods</span>
                    </label>
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="h-4 w-4 text-teal-600 dark:text-teal-500 rounded mr-2 border-gray-300 dark:border-gray-600" id="packagedFoods" name="packagedFoods" />
                      <span className="text-gray-700 dark:text-gray-300">Canned/Packaged Foods</span>
                    </label>
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="h-4 w-4 text-teal-600 dark:text-teal-500 rounded mr-2 border-gray-300 dark:border-gray-600" id="dairyProducts" name="dairyProducts" />
                      <span className="text-gray-700 dark:text-gray-300">Dairy Products</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Donation Capacity & Preferences</label>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Frequency</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      name="donationFrequency">
                      <option value="">Select frequency</option>
                      <option value="daily">Daily</option>
                      <option value="few_times_week">Few times a week</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="irregular">Irregular/As available</option>
                    </select>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Average Donation Size</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      name="donationSize">
                      <option value="">Select size</option>
                      <option value="small">Small (1-5 meals)</option>
                      <option value="medium">Medium (5-20 meals)</option>
                      <option value="large">Large (20-50 meals)</option>
                      <option value="xlarge">Very Large (50+ meals)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={() => setShowAddMerchantModal(false)}
                className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-md text-sm font-medium hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 shadow-md transition-all flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Register Merchant
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ProfileModal = () => {
    // Create state for form data using current profile as initial values
    const [formData, setFormData] = useState({
      firstName: adminProfile?.firstName || '',
      lastName: adminProfile?.lastName || '',
      email: adminProfile?.email || '',
      phoneNumber: adminProfile?.phoneNumber || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: adminProfile?.twoFactorAuthEnabled || false,
      receiveNotifications: true
    });

    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    };

    if (!showProfileModal) return null;

    // Function to handle profile update
    const handleProfileUpdate = async (e) => {
      e.preventDefault();

      // Validate form (passwords match, etc.)
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        alert('New passwords do not match');
        return;
      }

      // Show loading state on button
      const submitButton = e.target.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">...</svg> Updating...';

      // Create form data object for the API
      const updateData = new FormData();

      // Add all required fields from your form
      updateData.append('firstName', formData.firstName);
      updateData.append('lastName', formData.lastName);
      updateData.append('email', formData.email);
      updateData.append('phoneNumber', formData.phoneNumber);

      if (formData.currentPassword) {
        updateData.append('currentPassword', formData.currentPassword);
      }

      if (formData.newPassword) {
        updateData.append('password', formData.newPassword);
      }

      if (formData.twoFactorEnabled !== undefined) {
        updateData.append('twoFactorAuthEnabled', formData.twoFactorEnabled);
      }

      // Add profile photo if uploaded
      const photoInput = document.getElementById('profile-photo');
      if (photoInput && photoInput.files[0]) {
        updateData.append('profilePhoto', photoInput.files[0]);
      }

      try {
        // Get the admin ID from the current profile
        if (!adminProfile || !adminProfile.id) {
          throw new Error('Admin profile ID is missing');
        }

        const response = await fetch(`http://localhost:8080/api/admin/management/${adminProfile.id}`, {
          method: 'PUT',
          body: updateData
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        if (result.success) {
          // Update the auth data in storage if email was changed
          const updatedEmail = formData.email;
          const originalEmail = adminProfile.email;

          if (updatedEmail !== originalEmail) {
            // Get auth data from storage
            const storageKey = localStorage.getItem('authUser') ? 'localStorage' : 'sessionStorage';
            const authData = JSON.parse(localStorage.getItem('authUser') || sessionStorage.getItem('authUser'));

            if (authData) {
              // Update email in auth data
              authData.email = updatedEmail;

              // Save updated auth data back to storage
              if (storageKey === 'localStorage') {
                localStorage.setItem('authUser', JSON.stringify(authData));
              } else {
                sessionStorage.setItem('authUser', JSON.stringify(authData));
              }
            }
          }

          alert('Profile updated successfully');
          setShowProfileModal(false);

          // Wait a moment before fetching updated profile
          setTimeout(() => {
            fetchAdminProfile();
          }, 500);
        } else {
          alert('Error: ' + result.message);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile: ' + error.message);
      } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-xl max-h-[90vh] overflow-y-auto">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update Your Profile</h3>
            <button onClick={() => setShowProfileModal(false)} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full">
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {adminProfile?.profilePhotoBase64 ? (
                  <img
                    src={`data:image/jpeg;base64,${adminProfile.profilePhotoBase64}`}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900/50"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-blue-100 dark:border-blue-900/50">
                    <User className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                <label htmlFor="profile-photo" className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-700 text-white p-1.5 rounded-full cursor-pointer shadow-md hover:bg-blue-700 dark:hover:bg-blue-600">
                  <Upload className="h-4 w-4" />
                  <input type="file" id="profile-photo" className="hidden" accept="image/*" />
                </label>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-2">{adminProfile?.firstName} {adminProfile?.lastName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{adminProfile?.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter current password to confirm changes"
                value={formData.currentPassword}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password (Optional)</label>
                <input
                  type="password"
                  name="newPassword"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="New password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Message View Modal Component - Improved Responsive Version
  const MessageViewModal = () => {
    if (!showMessageModal || !selectedMessage) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 flex-shrink-0">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Mail className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Message Details
              {!selectedMessage.isRead && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs rounded-full">
                  New
                </span>
              )}
            </h3>
            <button
              onClick={() => {
                setShowMessageModal(false);
                setSelectedMessage(null);
              }}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition-colors"
            >
              <X className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5">
            {/* Message Header */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 md:p-4 rounded-lg mb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {selectedMessage.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">{selectedMessage.email}</h4>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{selectedMessage.subject || 'Message from Anonymous'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                    {selectedMessage.isRead && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        <Check className="h-3 w-3 inline mr-1" />
                        Read by {selectedMessage.readBy} on {new Date(selectedMessage.readAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 ml-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${selectedMessage.role === 'anonymous'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                    }`}>
                    {selectedMessage.role === 'anonymous' ? 'Anonymous' : selectedMessage.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 md:p-4 mb-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-sm md:text-base">Message Content:</h5>
              <div className="max-h-48 overflow-y-auto">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Attachment Section */}
            {selectedMessage.hasAttachment && (
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3 md:p-4 mb-4">
                <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center text-sm md:text-base">
                  <Package className="h-4 w-4 mr-2" />
                  Attachment
                </h5>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-700 p-3 rounded border gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded flex-shrink-0">
                      {selectedMessage.fileType?.startsWith('image/') ? (
                        <Camera className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
                      ) : selectedMessage.fileType === 'application/pdf' ? (
                        <FileText className="h-4 w-4 md:h-5 md:w-5 text-red-600 dark:text-red-400" />
                      ) : (
                        <Package className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{selectedMessage.fileName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedMessage.fileType} • {formatFileSize(selectedMessage.fileSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleViewAttachment(selectedMessage.id, selectedMessage.fileName)}
                      className="px-3 py-1.5 bg-blue-600 dark:bg-blue-700 text-white text-xs md:text-sm rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadAttachment(selectedMessage.id, selectedMessage.fileName)}
                      className="px-3 py-1.5 bg-gray-600 dark:bg-gray-700 text-white text-xs md:text-sm rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center"
                    >
                      <Download className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fixed Footer with Action Buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 md:px-6 md:py-4 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setReplySubject(`Re: ${selectedMessage.subject || 'Your message'}`);
                    setShowReplyModal(true);
                  }}
                  className="w-full sm:w-auto px-3 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center text-sm"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reply via Email
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this message?')) {
                      handleDeleteMessage(selectedMessage.id);
                      setShowMessageModal(false);
                      setSelectedMessage(null);
                    }
                  }}
                  className="w-full sm:w-auto px-3 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors flex items-center justify-center text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Message
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };

  // Message Reply Modal Component - Improved with Scrolling
  const MessageReplyModal = () => {
    if (!showReplyModal || !selectedMessage) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 flex-shrink-0">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Mail className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-600 dark:text-green-400" />
              Reply to Message
            </h3>
            <button
              onClick={() => {
                setShowReplyModal(false);
                setReplyContent('');
                setReplySubject('');
              }}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition-colors"
              disabled={sendingReply}
            >
              <X className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5">
            {/* Original Message Reference */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 md:p-4 rounded-lg mb-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center text-sm md:text-base">
                <Mail className="h-4 w-4 mr-2 text-blue-500" />
                Original Message from {selectedMessage.email}:
              </h5>
              <div className="max-h-32 overflow-y-auto">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 italic border-l-3 border-blue-300 dark:border-blue-600 pl-3">
                  "{selectedMessage.message.length > 200 ? selectedMessage.message.substring(0, 200) + '...' : selectedMessage.message}"
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Received: {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Reply Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email Subject:
                </label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                  placeholder="Email subject"
                  disabled={sendingReply}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Your Reply:
                </label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg h-32 md:h-40 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none text-sm md:text-base"
                  placeholder="Type your reply here..."
                  disabled={sendingReply}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Character count: {replyContent.length}
                </p>
              </div>

              {/* Email Preview - Collapsible on Mobile */}
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                <details className="group">
                  <summary className="cursor-pointer p-3 md:p-4 flex items-center justify-between hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-t-lg transition-colors">
                    <h6 className="font-medium text-blue-900 dark:text-blue-300 flex items-center text-sm md:text-base">
                      <Eye className="h-4 w-4 mr-2" />
                      Email Preview
                    </h6>
                    <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-3 pb-3 md:px-4 md:pb-4">
                    <div className="text-xs md:text-sm space-y-1">
                      <p className="text-gray-700 dark:text-gray-300"><strong>To:</strong> {selectedMessage.email}</p>
                      <p className="text-gray-700 dark:text-gray-300"><strong>Subject:</strong> {replySubject}</p>
                      <div className="mt-2 p-2 md:p-3 bg-white dark:bg-gray-700 rounded border max-h-32 overflow-y-auto">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-xs md:text-sm">
                          {replyContent || "Your reply will appear here..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </details>
              </div>

              {/* Quick Reply Templates - Optional */}
              <div className="pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick templates:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setReplyContent("Thank you for contacting FoodBridge Bangladesh. We have received your message and will respond shortly.\n\nBest regards,\nFoodBridge Team")}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    disabled={sendingReply}
                  >
                    Acknowledgment
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyContent("Thank you for your message. We need more information to assist you better. Could you please provide:\n\n1. \n2. \n\nBest regards,\nFoodBridge Team")}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    disabled={sendingReply}
                  >
                    Request Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyContent("Thank you for your feedback. We appreciate your input and will use it to improve our services.\n\nBest regards,\nFoodBridge Team")}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    disabled={sendingReply}
                  >
                    Thank You
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer with Action Buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 md:px-6 md:py-4 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyContent('');
                  setReplySubject('');
                }}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={sendingReply}
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyContent.trim() || sendingReply}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm"
              >
                {sendingReply ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';

    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };

  // Handle compose form input changes
  const handleComposeInputChange = (e) => {
    const { name, value } = e.target;
    setComposeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle sending new message
  const handleSendNewMessage = async () => {
    if (!composeData.subject.trim() || !composeData.message.trim()) {
      alert('Please fill in both subject and message fields');
      return;
    }

    setSendingMessage(true);

    try {
      const authData = JSON.parse(localStorage.getItem('authUser') || sessionStorage.getItem('authUser'));
      const adminEmail = authData?.email || 'admin@foodbridge.com';
      const adminName = `${authData?.firstName || 'Admin'} ${authData?.lastName || 'User'}`;

      const formData = new FormData();
      formData.append('recipientType', composeData.recipientType);
      formData.append('subject', composeData.subject);
      formData.append('message', composeData.message);
      formData.append('adminEmail', adminEmail);
      formData.append('adminName', adminName);

      const response = await fetch('http://localhost:8080/api/messages/admin/compose', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('Message sent successfully to all users!');
          setShowComposeModal(false);
          setComposeData({
            recipientType: 'all',
            subject: '',
            message: ''
          });
          // Refresh messages list
          fetchMessages();
          fetchMessageStats();
        } else {
          alert('Failed to send message: ' + result.message);
        }
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark:bg-gray-900 dark:text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* ============== SIDEBAR COMPONENT ============== */}
      <aside
        className={`fixed top-16 left-0 h-full w-64 transition-all duration-300 transform z-20
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${darkMode
            ? 'bg-gray-800 border-gray-700 shadow-xl'
            : 'bg-white border-gray-200 shadow-lg'
          } border-r`}
      >

        {/* Sidebar Navigation Menu */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${activeSection === item.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <item.icon className={`h-5 w-5 ${activeSection === item.id ? 'text-white' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {activeSection === item.id && <ChevronRight className="h-4 w-4 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
              ${darkMode
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* ============== MAIN CONTENT AREA ============== */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Header with toggle button */}
        <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm px-6 py-4`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>


        {/* ============== DASHBOARD CONTENT SECTIONS ============== */}
        <main className="pt-8 px-6 pb-6">

          {/* ============== OVERVIEW SECTION ============== */}

         {activeSection === 'overview' && (
  <div className="space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
    {/* Welcome Banner - Enhanced */}
    <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-white/20 rounded-lg mr-3">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Welcome back, Admin!</h2>
                <p className="text-blue-100 mt-1">Manage your FoodBridge platform efficiently</p>
              </div>
            </div>
            <p className="text-blue-100 text-lg max-w-2xl">
              Monitor your platform's performance, manage users, and oversee food donation activities all in one place.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center border border-white/20"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh Data
            </button>
            <button className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              System Health
            </button>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button 
            onClick={() => setActiveSection('users')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium transition-all duration-200 border border-white/20"
          >
            Manage Users
          </button>
          <button 
            onClick={() => setActiveSection('merchants')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium transition-all duration-200 border border-white/20"
          >
            Manage Merchants
          </button>
          <button 
            onClick={() => setActiveSection('donations')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium transition-all duration-200 border border-white/20"
          >
            View Donations
          </button>
          <button 
            onClick={() => setActiveSection('reports')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium transition-all duration-200 border border-white/20"
          >
            Check Reports
          </button>
        </div>
      </div>
    </div>

    {/* Real-time Stats Grid - Enhanced */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Total Users */}
      <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {usersLoading ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  usersData?.length || 0
                )}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                All registered users
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Donors */}
      <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-xl shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Donors</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {usersLoading ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  usersData?.filter(user => user.userType?.toLowerCase() === 'donor').length || 0
                )}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Food contributors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Receivers */}
      <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
              <UserPlus className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Receivers</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {usersLoading ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  usersData?.filter(user => user.userType?.toLowerCase() === 'receiver').length || 0
                )}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Food recipients
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Merchants */}
      <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-xl shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
              <Store className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Merchants</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {merchantsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  merchantsData?.length || 0
                )}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Business partners
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Admins */}
      <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-xl shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Admins</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {adminsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  adminsData?.length || 0
                )}
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                System administrators
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Donations */}
      <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-xl shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
              <Package className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Active Donations</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {donationsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  donationsStats?.active || 0
                )}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Available for pickup
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Donations */}
      <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 rounded-xl shadow-lg group-hover:shadow-teal-500/25 transition-all duration-300">
              <PackageCheck className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Completed Donations</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {donationsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  donationsStats?.completed || 0
                )}
              </p>
              <p className="text-xs text-teal-600 dark:text-teal-400 mt-1 flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Successfully delivered
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Messages */}
      <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 rounded-xl shadow-lg group-hover:shadow-pink-500/25 transition-all duration-300">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Messages</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {messagesLoading ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  messageStats?.totalMessages || 0
                )}
              </p>
              <p className="text-xs text-pink-600 dark:text-pink-400 mt-1 flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                {messageStats?.unreadMessages || 0} unread
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Reports */}
      <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
              <AlertTriangle className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {foodReportsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  foodReportsStats?.totalReports || 0
                )}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {foodReportsStats?.pendingReports || 0} pending
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

          {/* ============== USER MANAGEMENT SECTION ============== */}
          {activeSection === 'users' && (
            <div className="space-y-6">
              {/* User Filter Controls */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm dark:shadow-gray-900/30 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        onChange={(e) => {
                          // Here you could implement search functionality
                        }}
                      />
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setUserTypeFilter('all')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${userTypeFilter === 'all'
                          ? 'bg-blue-600 dark:bg-blue-700 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                      >
                        All Users
                      </button>
                      <button
                        onClick={() => setUserTypeFilter('donor')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${userTypeFilter === 'donor'
                          ? 'bg-green-600 dark:bg-green-700 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                      >
                        Donors
                      </button>
                      <button
                        onClick={() => setUserTypeFilter('receiver')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${userTypeFilter === 'receiver'
                          ? 'bg-indigo-600 dark:bg-indigo-700 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                      >
                        Receivers
                      </button>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                    onClick={() => setShowAddUserModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New User
                  </button>
                </div>
              </div>

              {usersLoading ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
                </div>
              ) : usersError ? (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl shadow-sm border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400"><AlertTriangle className="h-5 w-5 inline mr-2" />{usersError}</p>
                  <button
                    onClick={fetchUsers}
                    className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors duration-200"
                  >
                    <RefreshCw className="h-4 w-4 inline mr-1" />Try Again
                  </button>
                </div>
              ) : (
                <>
                  {/* User Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {usersData
                      .filter(user => userTypeFilter === 'all' || user.userType.toLowerCase() === userTypeFilter.toLowerCase())
                      .map((user) => (
                        <div
                          key={user.id}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 overflow-hidden transform transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/50 hover:scale-102 border border-gray-100 dark:border-gray-700"
                        >
                          {/* Card Header - Status Badge */}
                          <div className={`w-full h-2 ${user.isVerified ? 'bg-green-500' : 'bg-gray-500'}`}></div>

                          <div className="p-5">
                            {/* User Identity Section */}
                            <div className="flex flex-col items-center">
                              <img
                                src={user.photoBase64 ? `data:${user.photoContentType};base64,${user.photoBase64}` : '/api/placeholder/64/64'}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="h-16 w-16 rounded-full shadow-sm border-2 border-indigo-100 dark:border-indigo-900 object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/api/placeholder/64/64';
                                }}
                              />
                              <div className="mt-3 text-center">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</h3>
                                <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${user.userType === 'donor'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                  : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'
                                  }`}>
                                  {user.userType === 'donor' ? 'Donor' : 'Receiver'}
                                </span>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                              </div>
                            </div>

                            {/* User Details */}
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Status:</span>
                                <span className={`font-medium ${user.isVerified
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-gray-600 dark:text-gray-400'
                                  }`}>
                                  {user.isVerified ? 'Verified' : 'Unverified'}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Joined:</span>
                                <span className="font-medium text-gray-900 dark:text-gray-200">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                                <span className="font-medium text-gray-900 dark:text-gray-200">{user.phone}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Blood Group:</span>
                                <span className="font-medium text-gray-900 dark:text-gray-200">{user.bloodGroup}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-5 grid grid-cols-4 gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">

                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowEmailModal(true);
                                }}
                                className="flex flex-col items-center justify-center p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors duration-200"
                                title="Send Email"
                              >
                                <Mail className="h-4 w-4" />
                                <span className="text-xs mt-1">Email</span>
                              </button>
                              <button
                                className="flex flex-col items-center justify-center p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-800/30 transition-colors duration-200"
                                title={user.isVerified ? "Unverify User" : "Verify User"}
                                onClick={() => handleUpdateVerificationStatus(user.id, !user.isVerified)}
                              >
                                {user.isVerified ? (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                                    </svg>
                                    <span className="text-xs mt-1">Unverify</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4" />
                                    <span className="text-xs mt-1">Verify</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="flex flex-col items-center justify-center p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors duration-200"
                                title="Delete User"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="text-xs mt-1">Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Display empty state if no users match the filter */}
                  {usersData.filter(user => userTypeFilter === 'all' || user.userType.toLowerCase() === userTypeFilter.toLowerCase()).length === 0 && (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 text-center">
                      <User className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Users Found</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {userTypeFilter !== 'all'
                          ? `No ${userTypeFilter}s found in the system.`
                          : "There are no users registered in the system yet."}
                      </p>
                      {userTypeFilter !== 'all' && (
                        <button
                          onClick={() => setUserTypeFilter('all')}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors duration-200"
                        >
                          <RefreshCw className="h-4 w-4 inline mr-1" />
                          Show All Users
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ============== MERCHANT MANAGEMENT SECTION ============== */}
          {activeSection === 'merchants' && (
            <div className="space-y-6">
              {/* Merchant Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6 border-l-4 border-indigo-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Store className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Merchants</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{merchantsData.length}</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">All registered merchants</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6 border-l-4 border-green-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Merchants</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {merchantsData.filter(m => m.status === 'Active').length}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {merchantsData.length > 0 ?
                          `${Math.round((merchantsData.filter(m => m.status === 'Active').length / merchantsData.length) * 100)}% active rate` :
                          '0% active rate'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6 border-l-4 border-yellow-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Package className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approval</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {merchantsData.filter(m => m.status === 'Pending').length}
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Waiting for verification</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm dark:shadow-gray-900/30 mb-2">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="relative w-full md:w-64">
                      <input
                        type="text"
                        placeholder="Search merchants..."
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                      <option value="all">All Types</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="grocery">Grocery</option>
                      <option value="bakery">Bakery</option>
                      <option value="cafe">Café</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setShowAddMerchantModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 flex items-center justify-center shadow-md transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Merchant
                  </button>
                </div>
              </div>

              {/* Merchant Card Grid */}
              {merchantsLoading ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading merchants...</p>
                </div>
              ) : merchantsError ? (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl shadow-sm border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400"><AlertTriangle className="h-5 w-5 inline mr-2" />{merchantsError}</p>
                  <button
                    onClick={fetchMerchants}
                    className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors duration-200"
                  >
                    <RefreshCw className="h-4 w-4 inline mr-1" />Try Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {merchantsData.map((merchant) => (
                    <div
                      key={merchant.merchantId}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 overflow-hidden transform transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/50 hover:scale-102 border border-gray-100 dark:border-gray-700"
                    >
                      {/* Card Header - Status Badge */}
                      <div className={`w-full h-2 ${merchant.status === 'Active' ? 'bg-green-500' :
                        merchant.status === 'Pending' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></div>

                      <div className="p-5">
                        {/* Merchant Identity Section */}
                        <div className="flex items-start">
                          <div className="h-16 w-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/30 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            {merchant.logoBase64 ? (
                              <img
                                src={`data:${merchant.logoType || 'image/jpeg'};base64,${merchant.logoBase64}`}
                                alt={merchant.businessName}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/api/placeholder/40/40';
                                }}
                              />
                            ) : (
                              <Store className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{merchant.businessName}</h3>
                              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${merchant.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                merchant.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                                  'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                }`}>
                                {merchant.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {merchant.merchantId}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{merchant.email}</p>
                          </div>
                        </div>

                        {/* Merchant Details */}
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <User className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                            <span>{merchant.ownerFirstName} {merchant.ownerLastName}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                            <span>{merchant.city}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                            <span>{new Date(merchant.joined).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <ShoppingBag className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                            <span>{merchant.businessType}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 grid grid-cols-5 gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                          <button
                            className="flex flex-col items-center justify-center p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-200 hover:scale-105"
                            title="View Details"
                            onClick={() => {
                              setSelectedMerchant(merchant);
                              setShowViewMerchantModal(true);
                            }}
                          >
                            <Eye className="h-5 w-5" />
                            <span className="text-xs mt-1">View</span>
                          </button>
                          <button
                            className="flex flex-col items-center justify-center p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors duration-200 hover:scale-105"
                            title="Edit Merchant"
                            onClick={() => {
                              setSelectedMerchant(merchant);
                              setShowEditMerchantModal(true);
                            }}
                          >
                            <Edit className="h-5 w-5" />
                            <span className="text-xs mt-1">Edit</span>
                          </button>
                          <button
                            className="flex flex-col items-center justify-center p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors duration-200 hover:scale-105"
                            title="Send Email"
                            onClick={() => {
                              // Email sending logic would go here
                              alert(`Send email to: ${merchant.email}`);
                            }}
                          >
                            <Mail className="h-5 w-5" />
                            <span className="text-xs mt-1">Email</span>
                          </button>
                          <button
                            className="flex flex-col items-center justify-center p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors duration-200 hover:scale-105"
                            title="Delete Merchant"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${merchant.businessName}?`)) {
                                fetch(`http://localhost:8080/api/admin/merchants/${merchant.merchantId}`, {
                                  method: 'DELETE'
                                })
                                  .then(response => response.json())
                                  .then(data => {
                                    if (data.success) {
                                      alert('Merchant deleted successfully');
                                      fetchMerchants(); // Refresh the list
                                    } else {
                                      alert('Error: ' + data.message);
                                    }
                                  })
                                  .catch(error => {
                                    console.error('Error deleting merchant:', error);
                                    alert('Error deleting merchant. Please try again.');
                                  });
                              }
                            }}
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="text-xs mt-1">Delete</span>
                          </button>
                          <button
                            className="flex flex-col items-center justify-center p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-800/30 transition-colors duration-200 hover:scale-105"
                            title={merchant.status === 'Active' ? "Block Merchant" : "Activate Merchant"}
                            onClick={() => {
                              const newStatus = merchant.status === 'Active' ? 'Inactive' : 'Active';
                              fetch(`http://localhost:8080/api/admin/merchants/${merchant.merchantId}/status?status=${newStatus}`, {
                                method: 'PUT'
                              })
                                .then(response => response.json())
                                .then(data => {
                                  if (data.success) {
                                    alert(`Merchant ${newStatus === 'Active' ? 'activated' : 'blocked'} successfully`);
                                    fetchMerchants(); // Refresh the list
                                  } else {
                                    alert('Error: ' + data.message);
                                  }
                                })
                                .catch(error => {
                                  console.error('Error updating merchant status:', error);
                                  alert('Error updating merchant status. Please try again.');
                                });
                            }}
                          >
                            {merchant.status === 'Active' ?
                              <>
                                <Lock className="h-5 w-5" />
                                <span className="text-xs mt-1">Block</span>
                              </> :
                              <>
                                <ShieldCheck className="h-5 w-5" />
                                <span className="text-xs mt-1">Activate</span>
                              </>
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!merchantsLoading && !merchantsError && merchantsData.length === 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 text-center">
                  <Store className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Merchants Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">There are no merchants registered in the system yet.</p>
                  <button
                    onClick={() => setShowAddMerchantModal(true)}
                    className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 inline-flex items-center transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Merchant
                  </button>
                </div>
              )}

              {/* Pagination Controls */}
              {!merchantsLoading && !merchantsError && merchantsData.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
                      disabled={true} // Replace with actual pagination logic
                    >
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200">
                      1
                    </button>
                    <button
                      className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
                      disabled={true} // Replace with actual pagination logic
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}

              <div className="hidden fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="border-b dark:border-gray-700 p-4 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Store className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      Merchant Details
                    </h3>
                    <button className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full transition-colors duration-200">
                      <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  <div className="p-6">
                    {/* Merchant details content would go here */}
                  </div>
                </div>
              </div>
              {/* Placeholder for the Edit Merchant Modal */}
              <div className="hidden fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="border-b dark:border-gray-700 p-4 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Edit className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      Edit Merchant
                    </h3>
                    <button className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full transition-colors duration-200">
                      <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  <div className="p-6">
                    {/* Edit merchant form would go here */}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============== ADMIN MANAGEMENT SECTION ============== */}
          {activeSection === 'NewAdmin' && (
            <div className="space-y-6">
              {/* Admin Section Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-xl shadow-md dark:shadow-gray-900/30 p-6 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Admin Management</h2>
                    <p className="mt-2 text-blue-100">Manage system administrators and their access permissions</p>
                  </div>
                  <button
                    className="mt-4 md:mt-0 px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 font-medium shadow-sm transition-colors duration-200 flex items-center"
                    onClick={() => setShowAddAdminModal(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Admin
                  </button>
                </div>
              </div>

              {/* Admin Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-blue-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Admins</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{adminsData.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-indigo-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Admins</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {adminsData.filter(admin => admin.role === 'System Administrator').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-purple-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Content Managers</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {adminsData.filter(admin => admin.role === 'Content Manager').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-green-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Admins</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {adminsData.filter(admin => admin.status === 'Active').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Cards Grid */}
              {adminsLoading ? (
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30">
                  <div className="animate-spin h-10 w-10 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">Loading admins...</p>
                </div>
              ) : adminsData.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 text-center">
                  <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Admins Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">There are no administrators registered in the system yet.</p>
                  <button
                    onClick={() => setShowAddAdminModal(true)}
                    className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 inline-flex items-center transition-colors duration-200"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Your First Admin
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {adminsData.map((admin) => (
                    <div
                      key={admin.id}
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow ${admin.status !== 'Active' ? 'opacity-75 dark:opacity-60' : ''}`}
                    >
                      <div className="h-2 bg-indigo-600 dark:bg-indigo-500 w-full"></div>
                      <div className="p-5">
                        <div className="flex justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={admin.profilePhotoBase64 ? `data:image/jpeg;base64,${admin.profilePhotoBase64}` : "/api/placeholder/64/64"}
                              alt="Admin"
                              className="h-16 w-16 rounded-full shadow-sm border-2 border-indigo-100 dark:border-indigo-900/50 object-cover"
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{admin.firstName} {admin.lastName}</h3>
                              <div className="flex items-center">
                                <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs rounded-full font-medium">
                                  {admin.role}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{admin.email}</p>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className={`px-2 py-1 ${admin.status === 'Active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                              } text-xs rounded-full font-medium text-center`}>
                              {admin.status}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 text-center">ID: {admin.id}</span>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-2" />
                            <span className="text-gray-600 dark:text-gray-400">{admin.phoneNumber}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-2" />
                            <span className="text-gray-600 dark:text-gray-400">Added: {new Date(admin.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-2" />
                            <span className="text-gray-600 dark:text-gray-400">Last active: {new Date(admin.lastActive).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                          <div className="flex space-x-1">
                            <button
                              className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors duration-200"
                              title="Send Message"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors duration-200"
                            title="Delete Admin"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${admin.firstName} ${admin.lastName}?`)) {
                                fetch(`http://localhost:8080/api/admin/management/${admin.id}`, {
                                  method: 'DELETE'
                                })
                                  .then(response => response.json())
                                  .then(data => {
                                    if (data.success) {
                                      alert('Admin deleted successfully');
                                      fetchAdmins(); // Refresh the list
                                    } else {
                                      alert('Error: ' + data.message);
                                    }
                                  })
                                  .catch(error => {
                                    console.error('Error deleting admin:', error);
                                    alert('Error deleting admin. Please try again.');
                                  });
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/*============== Message compose SECTION ==============*/}
        
          {showComposeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 flex-shrink-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Compose New Message
                  </h3>
                  <button
                    onClick={() => {
                      setShowComposeModal(false);
                      setComposeData({
                        recipientType: 'all',
                        subject: '',
                        message: ''
                      });
                    }}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition-colors"
                    disabled={sendingMessage}
                  >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <div className="space-y-5">
                    {/* Recipient Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Send To:
                      </label>
                      <select
                        name="recipientType"
                        value={composeData.recipientType}
                        onChange={handleComposeInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={sendingMessage}
                      >
                        <option value="all">All Users (Donors, Merchants & Receivers)</option>
                        <option value="donors">All Donors</option>
                        <option value="merchants">All Merchants</option>
                        <option value="receivers">All Receivers</option>
                      </select>
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject: *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={composeData.subject}
                        onChange={handleComposeInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter message subject"
                        disabled={sendingMessage}
                        required
                      />
                    </div>

                    {/* Message Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message: *
                      </label>
                      <textarea
                        name="message"
                        value={composeData.message}
                        onChange={handleComposeInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                        placeholder="Type your message here..."
                        disabled={sendingMessage}
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Character count: {composeData.message.length}
                      </p>
                    </div>

                    {/* Message Preview */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h6 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Message Preview
                      </h6>
                      <div className="text-sm space-y-2">
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>To:</strong> {
                            composeData.recipientType === 'all' ? 'All Users (Donors, Merchants & Receivers)' :
                              composeData.recipientType === 'donors' ? 'All Donors' :
                                composeData.recipientType === 'merchants' ? 'All Merchants' :
                                  'All Receivers'
                          }
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>Subject:</strong> {composeData.subject || 'No subject'}
                        </p>
                        <div className="mt-2 p-3 bg-white dark:bg-gray-700 rounded border max-h-32 overflow-y-auto">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                            {composeData.message || "Your message will appear here..."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Templates */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Templates:</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setComposeData(prev => ({
                            ...prev,
                            subject: 'Important Platform Update',
                            message: 'Dear FoodBridge Community,\n\nWe have an important update to share with you regarding our platform.\n\nBest regards,\nFoodBridge Team'
                          }))}
                          className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          disabled={sendingMessage}
                        >
                          Platform Update
                        </button>
                        <button
                          type="button"
                          onClick={() => setComposeData(prev => ({
                            ...prev,
                            subject: 'Thank You Message',
                            message: 'Dear FoodBridge Community,\n\nThank you for being part of our mission to reduce food waste and help those in need.\n\nWith gratitude,\nFoodBridge Team'
                          }))}
                          className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          disabled={sendingMessage}
                        >
                          Thank You
                        </button>
                        <button
                          type="button"
                          onClick={() => setComposeData(prev => ({
                            ...prev,
                            subject: 'System Maintenance Notice',
                            message: 'Dear Users,\n\nWe will be performing scheduled maintenance on our platform. Please expect brief service interruptions.\n\nWe apologize for any inconvenience.\n\nFoodBridge Team'
                          }))}
                          className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          disabled={sendingMessage}
                        >
                          Maintenance
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowComposeModal(false);
                        setComposeData({
                          recipientType: 'all',
                          subject: '',
                          message: ''
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      disabled={sendingMessage}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendNewMessage}
                      disabled={!composeData.subject.trim() || !composeData.message.trim() || sendingMessage}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-800 dark:hover:to-purple-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center text-sm font-medium"
                    >
                      {sendingMessage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============== DONATIONS SECTION ============== */}
          {activeSection === 'donations' && (
            <div className="space-y-6">
              {/* Donation Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6 border-l-4 border-blue-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Donations</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{donationsStats.active}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Available for pickup</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6 border-l-4 border-green-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Donations</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{donationsStats.completed}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">Successfully delivered</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6 border-l-4 border-red-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired Donations</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{donationsStats.expired}</p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">No longer available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Donations Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Donations</h2>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                        <Filter className="h-4 w-4 inline mr-1" />
                        Filter
                      </button>
                      <button className="px-3 py-1.5 text-sm bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200">
                        <Plus className="h-4 w-4 inline mr-1" />
                        Add New
                      </button>
                    </div>
                  </div>
                </div>

                {donationsLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading donations...</p>
                  </div>
                ) : donationsError ? (
                  <div className="p-8 text-center">
                    <AlertTriangle className="h-10 w-10 text-red-500 dark:text-red-400 mx-auto" />
                    <p className="mt-4 text-red-600 dark:text-red-400">{donationsError}</p>
                    <button
                      className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                      onClick={fetchDonations}
                    >
                      <RefreshCw className="h-4 w-4 inline mr-1" /> Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Donation Card Grid */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {donations.length > 0 ? (
                        donations.map((donation) => (
                          <div key={donation.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/30 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-blue-600 dark:text-blue-400">#{donation.id}</span>
                                <span className={`px-2 py-1 text-xs rounded-full flex items-center
                                  ${donation.status === 'Active'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                    : donation.status === 'Completed'
                                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                      : donation.status === 'Expired'
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'}`}
                                >
                                  <div className={`w-2 h-2 rounded-full mr-1
                                    ${donation.status === 'Active'
                                      ? 'bg-green-500'
                                      : donation.status === 'Completed'
                                        ? 'bg-blue-500'
                                        : donation.status === 'Expired'
                                          ? 'bg-gray-500'
                                          : 'bg-yellow-500'}`}
                                  ></div>
                                  {donation.status}
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-start space-x-3">
                                <div className="h-14 w-14 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                  {donation.imageData ? (
                                    <img
                                      src={`data:${donation.imageContentType || 'image/jpeg'};base64,${donation.imageData}`}
                                      alt={donation.foodName}
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/api/placeholder/80/80';
                                      }}
                                    />
                                  ) : (
                                    <Package className="h-8 w-8 m-3 text-gray-400 dark:text-gray-500" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-white">{donation.foodName}</h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {donation.description || "No description available"}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                  <User className="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-500" />
                                  {donation.donorType || "Unknown"}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                  <PackageCheck className="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-500" />
                                  {donation.category ? donation.category : "Uncategorized"}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                  <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-500" />
                                  Expires: {donation.expiryDate ? new Date(donation.expiryDate).toLocaleDateString() : "Unknown"}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                  <Clock className="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-500" />
                                  {new Date(donation.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="mt-4 flex space-x-2 justify-end">
                                <button
                                  className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-200"
                                  onClick={() => handleViewDonation(donation)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors duration-200"
                                  onClick={() => handleEmailDonor(donation.donorId, donation.id)}
                                >
                                  <Mail className="h-4 w-4" />
                                </button>
                                {donation.status === 'Active' && (
                                  <button
                                    className="p-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded hover:bg-yellow-100 dark:hover:bg-yellow-800/30 transition-colors duration-200"
                                    onClick={() => handlePauseDonation(donation.id)}
                                  >
                                    <Pause className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors duration-200"
                                  onClick={() => handleDeleteDonation(donation.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 p-8 text-center">
                          <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No donations found</h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">There are no donations in the system yet.</p>
                          <button className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200">
                            <Plus className="h-4 w-4 inline mr-1" /> Add New Donation
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Donation View Modal */}
              {showDonationModal && selectedDonation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="border-b dark:border-gray-700 p-4 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Package className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                        Donation Details #{selectedDonation.id}
                      </h3>
                      <button
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full transition-colors duration-200"
                        onClick={() => setShowDonationModal(false)}
                      >
                        <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/3">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center overflow-hidden">
                            {selectedDonation.imageData ? (
                              <img
                                src={`data:${selectedDonation.imageContentType || 'image/jpeg'};base64,${selectedDonation.imageData}`}
                                alt={selectedDonation.foodName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/api/placeholder/300/300';
                                }}
                              />
                            ) : (
                              <Package className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                            )}
                          </div>
                        </div>
                        <div className="w-full md:w-2/3">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedDonation.foodName}</h2>
                          <div className="flex items-center mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full mr-2
                              ${selectedDonation.status === 'Active'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : selectedDonation.status === 'Completed'
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                  : selectedDonation.status === 'Expired'
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'}`}
                            >
                              {selectedDonation.status}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Created: {new Date(selectedDonation.createdAt).toLocaleDateString()} •
                              {new Date(selectedDonation.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Category:</span>
                              <span className="text-sm text-gray-900 dark:text-gray-200">{selectedDonation.category || "Uncategorized"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Donor Type:</span>
                              <span className="text-sm text-gray-900 dark:text-gray-200">{selectedDonation.donorType || "Unknown"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Quantity:</span>
                              <span className="text-sm text-gray-900 dark:text-gray-200">{selectedDonation.quantity || "Unknown"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Expires:</span>
                              <span className="text-sm text-gray-900 dark:text-gray-200">
                                {selectedDonation.expiryDate ? new Date(selectedDonation.expiryDate).toLocaleDateString() : "Not specified"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Location:</span>
                              <span className="text-sm text-gray-900 dark:text-gray-200">{selectedDonation.location || "Not specified"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 border-t dark:border-gray-700 pt-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Description</h4>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {selectedDonation.description || "No description available"}
                        </p>
                      </div>

                      {selectedDonation.dietaryInfo && selectedDonation.dietaryInfo.length > 0 && (
                        <div className="mt-6 border-t dark:border-gray-700 pt-4">
                          <h4 className="font-medium text-gray-900 dark:text-white">Dietary Information</h4>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {selectedDonation.dietaryInfo.map((info, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                                {info}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedDonation.storageInstructions && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage Instructions</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDonation.storageInstructions}</p>
                        </div>
                      )}

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
                          onClick={() => handleEmailDonor(selectedDonation.donorId, selectedDonation.id)}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Donor
                        </button>
                        {selectedDonation.status === 'Active' && (
                          <button
                            className="px-4 py-2 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm font-medium hover:bg-yellow-100 dark:hover:bg-yellow-800/30 transition-colors duration-200 flex items-center"
                            onClick={() => {
                              handlePauseDonation(selectedDonation.id);
                              setShowDonationModal(false);
                            }}
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Listing
                          </button>
                        )}
                        <button
                          className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors duration-200 flex items-center"
                          onClick={() => {
                            handleDeleteDonation(selectedDonation.id);
                            setShowDonationModal(false);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Donation
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============== MESSAGES SECTION ============== */}
          {activeSection === 'messages' && (
            <div className="space-y-6">
              {/* Message Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-blue-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">All Messages</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{messageStats.totalMessages}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Total received</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-red-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{messageStats.unreadMessages}</p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">Need attention</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-green-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Read</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{messageStats.readMessages}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">Processed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-purple-500 transition-transform hover:scale-105 duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">With Files</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{messageStats.messagesWithAttachments}</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Has attachments</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Controls */}
              {/* Filter Controls - Updated with Compose Button */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm dark:shadow-gray-900/30">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setMessageFilter('all')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${messageFilter === 'all'
                        ? 'bg-blue-600 dark:bg-blue-700 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      All Messages
                    </button>
                    <button
                      onClick={() => setMessageFilter('unread')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${messageFilter === 'unread'
                        ? 'bg-red-600 dark:bg-red-700 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      Unread ({messageStats.unreadMessages})
                    </button>
                    <button
                      onClick={() => setMessageFilter('read')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${messageFilter === 'read'
                        ? 'bg-green-600 dark:bg-green-700 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      Read
                    </button>
                    <button
                      onClick={() => setMessageFilter('with-attachments')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${messageFilter === 'with-attachments'
                        ? 'bg-purple-600 dark:bg-purple-700 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      With Files
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    {/* NEW: Compose Message Button */}
                    <button
                      onClick={() => setShowComposeModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-800 dark:hover:to-purple-800 transition-all duration-200 flex items-center text-sm font-medium"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Compose New Message
                    </button>

                    <button
                      onClick={fetchMessages}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <RefreshCw className="h-4 w-4 inline mr-1" />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages List */}
              {messagesLoading ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading messages...</p>
                </div>
              ) : messagesError ? (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl shadow-sm border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5 inline mr-2" />
                    {messagesError}
                  </p>
                  <button
                    onClick={fetchMessages}
                    className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors duration-200"
                  >
                    <RefreshCw className="h-4 w-4 inline mr-1" />Try Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {messagesData.length > 0 ? (
                    messagesData.map((message) => (
                      <div
                        key={message.id}
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 overflow-hidden border transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/50 hover:scale-102 ${!message.isRead
                          ? 'border-l-4 border-l-red-500 border-red-100 dark:border-red-800'
                          : 'border-gray-100 dark:border-gray-700'
                          }`}
                      >
                        {/* Message Header */}
                        <div className={`px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center ${!message.isRead ? 'bg-red-50 dark:bg-red-900/10' : 'bg-gray-50 dark:bg-gray-700/50'
                          }`}>
                          <div className="flex items-center">
                            {!message.isRead && (
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            )}
                            <span className={`text-sm font-medium ${!message.isRead
                              ? 'text-red-800 dark:text-red-300'
                              : 'text-gray-800 dark:text-gray-300'
                              }`}>
                              {!message.isRead ? 'New Message' : 'Read'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="p-4">
                          {/* Sender Info */}
                          <div className="flex items-start mb-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold mr-3">
                              {message.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm">{message.email}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {message.subject || 'No Subject'}
                              </p>
                              {message.hasAttachment && (
                                <div className="flex items-center mt-1">
                                  <Package className="h-3 w-3 text-blue-500 mr-1" />
                                  <span className="text-xs text-blue-600 dark:text-blue-400">
                                    Has attachment ({message.fileName})
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Message Preview */}
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                            {message.message.length > 100
                              ? message.message.substring(0, 100) + '...'
                              : message.message}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex justify-between items-center space-x-2">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleViewMessage(message.id)}
                                className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-200"
                                title="View Message"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedMessage(message);
                                  setReplySubject(`Re: ${message.subject || 'Your message'}`);
                                  setShowReplyModal(true);
                                }}
                                className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors duration-200"
                                title="Reply via Email"
                              >
                                <Mail className="h-4 w-4" />
                              </button>

                              {message.hasAttachment && (
                                <>
                                  <button
                                    onClick={() => handleViewAttachment(message.id, message.fileName)}
                                    className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors duration-200"
                                    title="View Attachment"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>

                                  <button
                                    onClick={() => handleDownloadAttachment(message.id, message.fileName)}
                                    className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors duration-200"
                                    title="Download Attachment"
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors duration-200"
                              title="Delete Message"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Read Status Footer */}
                          {message.isRead && (
                            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Read by {message.readBy} on {new Date(message.readAt).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 text-center">
                      <Mail className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Messages Found</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {messageFilter === 'all'
                          ? "No messages have been received yet."
                          : `No ${messageFilter.replace('-', ' ')} messages found.`}
                      </p>
                      {messageFilter !== 'all' && (
                        <button
                          onClick={() => setMessageFilter('all')}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors duration-200"
                        >
                          Show All Messages
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============== REPLACE ENTIRE REPORTS SECTION CONTENT ============== */}
          {activeSection === 'reports' && (
            <div className="space-y-6">
              {/* Reports Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-blue-500">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{foodReportsStats.totalReports}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-yellow-500">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{foodReportsStats.pendingReports}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-orange-500">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Eye className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Under Review</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{foodReportsStats.underReviewReports}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-green-500">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{foodReportsStats.resolvedReports}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-gray-500">
                  <div className="flex items-center">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dismissed</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{foodReportsStats.dismissedReports}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5 border-l-4 border-red-500">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Escalated</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{foodReportsStats.escalatedReports}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm dark:shadow-gray-900/30">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setReportFilter('all')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${reportFilter === 'all'
                      ? 'bg-blue-600 dark:bg-blue-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    All Reports
                  </button>
                  <button
                    onClick={() => setReportFilter('pending')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${reportFilter === 'pending'
                      ? 'bg-yellow-600 dark:bg-yellow-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setReportFilter('under_review')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${reportFilter === 'under_review'
                      ? 'bg-orange-600 dark:bg-orange-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    Under Review
                  </button>
                  <button
                    onClick={() => setReportFilter('resolved')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${reportFilter === 'resolved'
                      ? 'bg-green-600 dark:bg-green-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              {/* Reports List */}
              {foodReportsLoading ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reports...</p>
                </div>
              ) : foodReportsError ? (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl shadow-sm border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5 inline mr-2" />
                    {foodReportsError}
                  </p>
                  <button
                    onClick={() => fetchFoodReports(reportsPagination.currentPage, reportFilter)}
                    className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors duration-200"
                  >
                    <RefreshCw className="h-4 w-4 inline mr-1" />Try Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {foodReports.length > 0 ? (
                    foodReports.map((report) => (
                      <div
                        key={report.id}
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 overflow-hidden border transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/50 hover:scale-102 ${report.status === 'PENDING'
                            ? 'border-l-4 border-l-yellow-500 border-yellow-100 dark:border-yellow-800'
                            : report.status === 'ESCALATED'
                              ? 'border-l-4 border-l-red-500 border-red-100 dark:border-red-800'
                              : 'border-gray-100 dark:border-gray-700'
                          }`}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{report.foodName}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Report #{report.id}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${report.status === 'PENDING'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                : report.status === 'UNDER_REVIEW'
                                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
                                  : report.status === 'RESOLVED'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                    : report.status === 'ESCALATED'
                                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                              }`}>
                              {report.status}
                            </span>
                          </div>

                          <div className="space-y-2 mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Category:</strong> {report.reportCategory}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Reporter:</strong> {report.reporterEmail}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              <strong>Reason:</strong> {report.reportReason}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              {new Date(report.createdAt).toLocaleDateString()} • {new Date(report.createdAt).toLocaleTimeString()}
                            </p>
                          </div>

                          <div className="flex justify-between items-center space-x-2">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleViewReport(report)}
                                className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-200"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              {report.status === 'PENDING' && (
                                <button
                                  onClick={() => handleUpdateReportStatus(report.id, 'UNDER_REVIEW')}
                                  className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-800/30 transition-colors duration-200"
                                  title="Start Review"
                                >
                                  <Clock className="h-4 w-4" />
                                </button>
                              )}

                              {(report.status === 'PENDING' || report.status === 'UNDER_REVIEW') && (
                                <button
                                  onClick={() => handleUpdateReportStatus(report.id, 'RESOLVED')}
                                  className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors duration-200"
                                  title="Mark Resolved"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors duration-200"
                              title="Delete Report"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 text-center">
                      <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Reports Found</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {reportFilter !== 'all'
                          ? `No ${reportFilter.replace('_', ' ')} reports found.`
                          : "No food reports have been submitted yet."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {reportsPagination.totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => fetchFoodReports(reportsPagination.currentPage - 1, reportFilter)}
                    disabled={reportsPagination.currentPage === 0}
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    Page {reportsPagination.currentPage + 1} of {reportsPagination.totalPages}
                  </span>
                  <button
                    onClick={() => fetchFoodReports(reportsPagination.currentPage + 1, reportFilter)}
                    disabled={reportsPagination.currentPage >= reportsPagination.totalPages - 1}
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==============  REPORT VIEW MODAL ============== */}
      
          {showReportModal && selectedReport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 flex-shrink-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Food Report Details - #{selectedReport.id}
                    <span className={`ml-3 px-2 py-1 text-xs rounded-full ${selectedReport.status === 'PENDING'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        : selectedReport.status === 'UNDER_REVIEW'
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
                          : selectedReport.status === 'RESOLVED'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : selectedReport.status === 'ESCALATED'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                      {selectedReport.status}
                    </span>
                  </h3>
                  <button
                    onClick={() => {
                      setShowReportModal(false);
                      setSelectedReport(null);
                      setReportDetails(null);
                    }}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  {reportDetailsLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
                    </div>
                  ) : reportDetails ? (
                    <div className="space-y-6">
                      {/* Report Summary */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Report Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Report Category</p>
                            <p className="font-medium text-gray-900 dark:text-white">{reportDetails.reportCategory}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Priority Level</p>
                            <div className="flex items-center">
                              <span className={`px-2 py-1 text-xs rounded-full ${reportDetails.priority >= 4
                                  ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                  : reportDetails.priority >= 3
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                    : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                }`}>
                                Priority {reportDetails.priority}/5
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Reported Date</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(reportDetails.createdAt).toLocaleDateString()} • {new Date(reportDetails.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {reportDetails.updatedAt ? new Date(reportDetails.updatedAt).toLocaleDateString() : 'Not updated'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Food Information */}
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                          <Package className="h-4 w-4 mr-2" />
                          Reported Food Item
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-1">
                            {reportDetails.foodImageBase64 ? (
                              <img
                                src={`data:${reportDetails.foodImageContentType || 'image/jpeg'};base64,${reportDetails.foodImageBase64}`}
                                alt={reportDetails.foodName}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                              />
                            ) : (
                              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Food Name</p>
                              <p className="font-medium text-gray-900 dark:text-white">{reportDetails.foodName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                              <p className="font-medium text-gray-900 dark:text-white">{reportDetails.foodCategory || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Quantity</p>
                              <p className="font-medium text-gray-900 dark:text-white">{reportDetails.foodQuantity || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                              <p className="font-medium text-gray-900 dark:text-white">{reportDetails.foodLocation || 'Not specified'}</p>
                            </div>
                          </div>
                        </div>
                        {reportDetails.foodDescription && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                            <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-2 rounded mt-1">
                              {reportDetails.foodDescription}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Report Details */}
                      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Report Details
                        </h4>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Report Reason</p>
                          <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-3 rounded border">
                            {reportDetails.reportReason}
                          </p>
                        </div>
                      </div>

                      {/* Reporter & Donor Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Reporter Info */}
                        <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Reporter Information
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                              <p className="font-medium text-gray-900 dark:text-white">{reportDetails.reporterName || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                              <p className="font-medium text-gray-900 dark:text-white">{reportDetails.reporterEmail}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                              <p className="font-medium text-gray-900 dark:text-white">{reportDetails.reporterPhone || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Donor Info */}
                        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Donor Information
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                              <p className="font-medium text-gray-900 dark:text-white">{reportDetails.donorName || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                              <p className="font-medium text-gray-900 dark:text-white">{reportDetails.donorEmail || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                              <p className="font-medium text-gray-900 dark:text-white">{reportDetails.donorPhone || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Evidence Files */}
                      {(reportDetails.evidenceFile1Base64 || reportDetails.evidenceFile2Base64) && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg">
                          <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center">
                            <Package className="h-4 w-4 mr-2" />
                            Evidence Files
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Evidence File 1 */}
                            {reportDetails.evidenceFile1Base64 && (
                              <div className="bg-white dark:bg-gray-700 p-3 rounded border">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">{reportDetails.evidenceFile1Name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{reportDetails.evidenceFile1Type}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewEvidence(reportDetails.id, 1)}
                                    className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleDownloadEvidence(reportDetails.id, 1, reportDetails.evidenceFile1Name)}
                                    className="px-3 py-1.5 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors flex items-center"
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Evidence File 2 */}
                            {reportDetails.evidenceFile2Base64 && (
                              <div className="bg-white dark:bg-gray-700 p-3 rounded border">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">{reportDetails.evidenceFile2Name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{reportDetails.evidenceFile2Type}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewEvidence(reportDetails.id, 2)}
                                    className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleDownloadEvidence(reportDetails.id, 2, reportDetails.evidenceFile2Name)}
                                    className="px-3 py-1.5 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors flex items-center"
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Admin Notes */}
                      {reportDetails.adminNotes && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-lg">
                          <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3 flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Admin Notes
                          </h4>
                          <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-3 rounded border">
                            {reportDetails.adminNotes}
                          </p>
                        </div>
                      )}

                      {/* Resolution Details */}
                      {reportDetails.resolvedAt && (
                        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                            <Check className="h-4 w-4 mr-2" />
                            Resolution Details
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Resolved Date</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {new Date(reportDetails.resolvedAt).toLocaleDateString()} • {new Date(reportDetails.resolvedAt).toLocaleTimeString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Resolved By</p>
                              <p className="font-medium text-gray-900 dark:text-white">Admin ID: {reportDetails.resolvedBy}</p>
                            </div>
                            {reportDetails.resolutionNotes && (
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Resolution Notes</p>
                                <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-3 rounded border mt-1">
                                  {reportDetails.resolutionNotes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">Failed to load report details</p>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setShowReportModal(false);
                          setSelectedReport(null);
                          setReportDetails(null);
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleShowStatusUpdate(selectedReport.id, selectedReport.status)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm font-medium"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Update Status
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this report?')) {
                            handleDeleteReport(selectedReport.id);
                            setShowReportModal(false);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm font-medium"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Update Modal */}
          {showStatusUpdateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-md">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update Report Status</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Status</label>
                    <select
                      value={statusUpdateData.newStatus}
                      onChange={(e) => setStatusUpdateData({ ...statusUpdateData, newStatus: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="DISMISSED">Dismissed</option>
                      <option value="ESCALATED">Escalated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admin Notes</label>
                    <textarea
                      value={statusUpdateData.adminNotes}
                      onChange={(e) => setStatusUpdateData({ ...statusUpdateData, adminNotes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows="3"
                      placeholder="Add notes about the status change..."
                    />
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowStatusUpdateModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateReportStatusWithNotes}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          )}
          

          {/* ============== PROFILE MANAGEMENT SECTION ============== */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-xl shadow-md dark:shadow-gray-900/30 p-6 text-white">
                <h2 className="text-2xl font-bold">Your Profile</h2>
                <p className="mt-2 text-blue-100">Manage your account and personal information</p>
              </div>

              {profileLoading ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your profile...</p>
                </div>
              ) : profileError ? (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400"><AlertTriangle className="h-5 w-5 inline mr-2" />{profileError}</p>
                  <button
                    onClick={fetchAdminProfile}
                    className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors duration-200"
                  >
                    <RefreshCw className="h-4 w-4 inline mr-1" />Try Again
                  </button>
                </div>
              ) : adminProfile ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center">
                    <div className="relative">
                      {adminProfile.profilePhotoBase64 ? (
                        <img
                          src={`data:image/jpeg;base64,${adminProfile.profilePhotoBase64}`}
                          alt="Profile"
                          className="h-24 w-24 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900/50"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border-4 border-indigo-100 dark:border-indigo-900/50">
                          <User className="h-12 w-12 text-indigo-400 dark:text-indigo-300" />
                        </div>
                      )}
                      <button
                        onClick={() => setShowProfileModal(true)}
                        className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-700 text-white p-2 rounded-full shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{adminProfile.firstName} {adminProfile.lastName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{adminProfile.email}</p>
                      <div className="flex items-center mt-1">
                        <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs rounded-full">
                          {adminProfile.role}
                        </span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${adminProfile.status === 'Active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}>
                          {adminProfile.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                          <User className="h-5 w-5 mr-2 text-blue-700 dark:text-blue-400" />
                          Personal Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Full Name:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {adminProfile.firstName} {adminProfile.lastName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{adminProfile.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{adminProfile.phoneNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Role:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{adminProfile.role}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-purple-700 dark:text-purple-400" />
                          Account Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Account Status:</span>
                            <span className={`text-sm font-medium ${adminProfile.status === 'Active'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                              }`}>
                              {adminProfile.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Account Created:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(adminProfile.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Last Active:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(adminProfile.lastActive).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Two-Factor Auth:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {adminProfile.twoFactorAuthEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowProfileModal(true)}
                        className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Update Profile
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 text-center">
                  <User className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Profile Not Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Unable to retrieve your profile information</p>
                </div>
              )}
            </div>
          )}
          
        </main>
      </div>

      {/* ============== MODALS ============== */}
      {EmailModal()}
      {AddMerchantModal()}
      {ProfileModal()}
      {AddUserModal()}
      {AddAdminModal()}
      {MessageViewModal()}
      {MessageReplyModal()}
      {/* Render the view merchant modal */}
      <ViewMerchantDetailsModal
        isOpen={showViewMerchantModal}
        onClose={() => setShowViewMerchantModal(false)}
        merchant={selectedMerchant}
      />
      {/* Render the edit merchant modal */}
      <EditMerchantModal
        isOpen={showEditMerchantModal}
        onClose={() => setShowEditMerchantModal(false)}
        merchant={selectedMerchant}
        fetchMerchants={fetchMerchants}
      />
    </div>
  );
};

export default AdminDashboard;