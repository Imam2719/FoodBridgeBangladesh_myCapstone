import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/admindashboard.css';
import { useTheme } from '../contexts/ThemeContext';
import {
  Users, Package, AlertTriangle, Activity, BarChart3,
  Search, Filter, ShieldCheck, ChevronDown,
  Menu, X, Bell, LogOut, Edit, Trash2, Mail, Plus, ChevronRight,
  Calendar, Clock, MapPin, Eye, Save, Upload, RefreshCw,
  Store, ShoppingBag, UserPlus, FileText, User,
  Award, Trophy, Zap, Heart, Download, PieChart,
  PlusCircle, Phone, Lock, Shield, Laptop, DollarSign,
  LifeBuoy, Camera, Check, Pause, PackageCheck, TrendingUp, ChevronLeft, Paperclip, Send
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
  const [showViewUserModal, setShowViewUserModal] = useState(false);
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

  // Add these state variables to your existing useState declarations
  const [showMerchantFeeModal, setShowMerchantFeeModal] = useState(false);
  const [selectedMerchantForFees, setSelectedMerchantForFees] = useState(null);
  const [merchantFeeData, setMerchantFeeData] = useState(null);
  const [merchantPaymentHistory, setMerchantPaymentHistory] = useState([]);
  const [merchantPaymentStats, setMerchantPaymentStats] = useState({});
  const [feeDataLoading, setFeeDataLoading] = useState(false);
  const [currentFeeMonth, setCurrentFeeMonth] = useState(new Date().toISOString().slice(0, 7));

  const [showUserEmailModal, setShowUserEmailModal] = useState(false);
  const [selectedUserForEmail, setSelectedUserForEmail] = useState(null);
  const [emailTemplates, setEmailTemplates] = useState({});
  const [emailFormData, setEmailFormData] = useState({
    subject: '',
    content: '',
    template: 'custom',
    attachments: []
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUserForView, setSelectedUserForView] = useState(null);
  const [showMerchantEmailModal, setShowMerchantEmailModal] = useState(false);
const [selectedMerchantForEmail, setSelectedMerchantForEmail] = useState(null);
const [merchantEmailTemplates, setMerchantEmailTemplates] = useState({});
const [merchantEmailFormData, setMerchantEmailFormData] = useState({
  subject: '',
  content: '',
  template: 'custom',
  attachments: []
});
const [sendingMerchantEmail, setSendingMerchantEmail] = useState(false);

// Add this useEffect to fetch merchant email templates (around line 100 where other useEffects are)

useEffect(() => {
  fetchMerchantEmailTemplates();
}, []);

// Add these functions to handle merchant email functionality (around line 150 where other functions are defined)

const fetchMerchantEmailTemplates = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/admin/merchant-email-templates');
    if (response.ok) {
      const templates = await response.json();
      setMerchantEmailTemplates(templates);
    }
  } catch (error) {
    console.error('Error fetching merchant email templates:', error);
  }
};

const handleMerchantEmailClick = (merchant) => {
  setSelectedMerchantForEmail(merchant);
  setMerchantEmailFormData({
    subject: '',
    content: '',
    template: 'custom',
    attachments: []
  });
  setShowMerchantEmailModal(true);
};

const handleMerchantEmailTemplateChange = (templateValue) => {
  setMerchantEmailFormData(prev => ({
    ...prev,
    template: templateValue
  }));

  if (templateValue !== 'custom' && merchantEmailTemplates[templateValue]) {
    const template = merchantEmailTemplates[templateValue];
    setMerchantEmailFormData(prev => ({
      ...prev,
      subject: template.defaultSubject,
      content: template.defaultContent
    }));
  }
};

const handleMerchantEmailInputChange = (e) => {
  const { name, value } = e.target;
  setMerchantEmailFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleMerchantEmailAttachmentChange = (e) => {
  const files = Array.from(e.target.files);
  setMerchantEmailFormData(prev => ({
    ...prev,
    attachments: files
  }));
};

const handleSendMerchantEmail = async () => {
  if (!merchantEmailFormData.subject.trim() || !merchantEmailFormData.content.trim()) {
    alert('Please fill in both subject and content fields');
    return;
  }

  setSendingMerchantEmail(true);

  try {
    const authData = JSON.parse(localStorage.getItem('authUser') || sessionStorage.getItem('authUser'));
    const adminName = `${authData?.firstName || 'Admin'} ${authData?.lastName || 'User'}`;
    const adminEmail = authData?.email || 'admin@foodbridge.com';

    const formData = new FormData();
    formData.append('subject', merchantEmailFormData.subject);
    formData.append('content', merchantEmailFormData.content);
    formData.append('template', merchantEmailFormData.template);
    formData.append('adminName', adminName);
    formData.append('adminEmail', adminEmail);

    // Add attachments
    merchantEmailFormData.attachments.forEach((file, index) => {
      formData.append('attachments', file);
    });

    const response = await fetch(`http://localhost:8080/api/admin/merchants/${selectedMerchantForEmail.merchantId}/send-email`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      alert('Email sent successfully to merchant!');
      setShowMerchantEmailModal(false);
      setMerchantEmailFormData({
        subject: '',
        content: '',
        template: 'custom',
        attachments: []
      });
    } else {
      alert('Failed to send email: ' + result.message);
    }

  } catch (error) {
    console.error('Error sending email:', error);
    alert('Error sending email. Please try again.');
  } finally {
    setSendingMerchantEmail(false);
  }
};


  useEffect(() => {
    fetchEmailTemplates();
  }, []);

  // Add these functions to the existing AdminDashboard component

  const fetchEmailTemplates = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/email-templates');
      if (response.ok) {
        const templates = await response.json();
        setEmailTemplates(templates);
      }
    } catch (error) {
      console.error('Error fetching email templates:', error);
    }
  };

  const handleUserEmailClick = (user) => {
    setSelectedUserForEmail(user);
    setEmailFormData({
      subject: '',
      content: '',
      template: 'custom',
      attachments: []
    });
    setShowUserEmailModal(true);
  };

  const handleEmailTemplateChange = (templateValue) => {
    setEmailFormData(prev => ({
      ...prev,
      template: templateValue
    }));

    if (templateValue !== 'custom' && emailTemplates[templateValue]) {
      const template = emailTemplates[templateValue];
      setEmailFormData(prev => ({
        ...prev,
        subject: template.defaultSubject,
        content: template.defaultContent
      }));
    }
  };

  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setEmailFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setEmailFormData(prev => ({
      ...prev,
      attachments: files
    }));
  };

  const handleSendUserEmail = async () => {
    if (!emailFormData.subject.trim() || !emailFormData.content.trim()) {
      alert('Please fill in both subject and content fields');
      return;
    }

    setSendingEmail(true);

    try {
      const authData = JSON.parse(localStorage.getItem('authUser') || sessionStorage.getItem('authUser'));
      const adminName = `${authData?.firstName || 'Admin'} ${authData?.lastName || 'User'}`;
      const adminEmail = authData?.email || 'admin@foodbridge.com';

      const formData = new FormData();
      formData.append('subject', emailFormData.subject);
      formData.append('content', emailFormData.content);
      formData.append('template', emailFormData.template);
      formData.append('adminName', adminName);
      formData.append('adminEmail', adminEmail);

      // Add attachments
      emailFormData.attachments.forEach((file, index) => {
        formData.append('attachments', file);
      });

      const response = await fetch(`http://localhost:8080/api/admin/users/${selectedUserForEmail.id}/send-email`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        alert('Email sent successfully!');
        setShowUserEmailModal(false);
        setEmailFormData({
          subject: '',
          content: '',
          template: 'custom',
          attachments: []
        });
      } else {
        alert('Failed to send email: ' + result.message);
      }

    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };


  const fetchMerchantFeeData = async (merchantId, selectedMonth = null) => {
    setFeeDataLoading(true);
    console.log(`🔍 Fetching fee data for merchant ${merchantId}, month: ${selectedMonth || currentFeeMonth}`);

    try {
      const month = selectedMonth || currentFeeMonth;

      // ✅ ENHANCED: Fee calculation with better error handling
      const feeResponse = await fetch(
        `http://localhost:8080/api/merchant/fees/calculate?merchantId=${merchantId}&selectedMonth=${month}`
      );

      if (!feeResponse.ok) {
        throw new Error(`Fee calculation failed: ${feeResponse.status} ${feeResponse.statusText}`);
      }

      const feeData = await feeResponse.json();
      console.log('📊 Fee calculation response:', feeData);
      setMerchantFeeData(feeData);

      // ✅ MAIN FIX: Enhanced payment history fetch with detailed logging
      console.log(`📋 Fetching payment history for merchant ${merchantId}...`);
      const historyResponse = await fetch(
        `http://localhost:8080/api/merchant/fees/payment-history?merchantId=${merchantId}`
      );

      if (!historyResponse.ok) {
        console.error(`❌ Payment history fetch failed: ${historyResponse.status} ${historyResponse.statusText}`);
        throw new Error(`Payment history fetch failed: ${historyResponse.status}`);
      }

      const historyResult = await historyResponse.json();
      console.log('📋 Payment history response:', historyResult);

      // ✅ ENHANCED: Handle different response formats
      let historyData = [];
      if (historyResult.success && historyResult.paymentHistory) {
        // New format with success wrapper
        historyData = historyResult.paymentHistory;
        console.log(`✅ Found ${historyData.length} payment records (new format)`);
      } else if (Array.isArray(historyResult)) {
        // Direct array format
        historyData = historyResult;
        console.log(`✅ Found ${historyData.length} payment records (direct array)`);
      } else {
        console.warn('⚠️ Unexpected payment history response format:', historyResult);
        historyData = [];
      }

      // ✅ ENHANCED: Validate and set payment history
      const validHistoryData = Array.isArray(historyData) ? historyData : [];
      setMerchantPaymentHistory(validHistoryData);
      console.log(`💾 Set ${validHistoryData.length} payment history records in state`);

      // ✅ ENHANCED: Payment statistics with better error handling
      console.log(`📈 Fetching payment statistics for merchant ${merchantId}...`);
      const statsResponse = await fetch(
        `http://localhost:8080/api/merchant/fees/payment-stats?merchantId=${merchantId}`
      );

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('📈 Payment statistics response:', statsData);
        setMerchantPaymentStats(statsData);
      } else {
        console.warn(`⚠️ Payment stats fetch failed: ${statsResponse.status}`);
        setMerchantPaymentStats({});
      }

    } catch (error) {
      console.error('❌ Error fetching merchant fee data:', error);

      // ✅ ENHANCED: Better error handling with user-friendly messages
      setMerchantFeeData({
        success: false,
        message: `Failed to load fee data: ${error.message}`
      });
      setMerchantPaymentHistory([]);
      setMerchantPaymentStats({});

      // ✅ ENHANCED: Show user-friendly error
      alert(`Error loading fee data for merchant ${merchantId}: ${error.message}`);

    } finally {
      setFeeDataLoading(false);
    }
  };


  const handleMerchantFeeClick = (merchant) => {
    console.log(` Opening fee modal for merchant:`, merchant);

    const actualMerchantId = merchant.id || merchant.merchantId;
    console.log(`📋 Using Merchant ID: ${actualMerchantId}, Name: ${merchant.businessName}`);

    setSelectedMerchantForFees({
      ...merchant,
      merchantId: actualMerchantId // Ensure we use the numeric ID
    });
    setShowMerchantFeeModal(true);

    // Clear previous data
    setMerchantFeeData(null);
    setMerchantPaymentHistory([]);
    setMerchantPaymentStats({});

    // ✅ FIX: Pass the numeric ID to API
    fetchMerchantFeeData(actualMerchantId);
  };

  const handleFeeMonthChange = (newMonth) => {
    console.log(`📅 Changing fee month from ${currentFeeMonth} to ${newMonth}`);
    setCurrentFeeMonth(newMonth);

    if (selectedMerchantForFees) {
      console.log(`🔄 Refetching data for merchant ${selectedMerchantForFees.merchantId} for month ${newMonth}`);
      fetchMerchantFeeData(selectedMerchantForFees.merchantId, newMonth);
    }
  };

  // ✅ ENHANCED: Format currency with better null handling
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '৳0.00';
    }

    try {
      return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 2
      }).format(Number(amount)).replace('BDT', '৳');
    } catch (error) {
      console.warn('Currency formatting error:', error);
      return `৳${Number(amount || 0).toFixed(2)}`;
    }
  };

  // ✅ ENHANCED: Format date with better error handling
  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Unknown Date';
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      return date.toLocaleDateString('en-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn('Date formatting error:', error);
      return String(dateString);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'bkash': return '📱';
      case 'nagad': return '💳';
      case 'rocket': return '🚀';
      default: return '💰';
    }
  };

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

  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers();
    }
  }, [activeSection]);

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

  const handleUpdateVerificationStatus = async (userId, verificationStatus) => {
    try {
      console.log("Sending verification status:", verificationStatus); // Add this debug log

      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/verify?verified=${verificationStatus}`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error(`Error updating verification status: ${response.status}`);
      }

      console.log("API call successful, refreshing users..."); // Add this debug log

      // Refresh user list after successful update
      fetchUsers();
      alert(verificationStatus ? 'User verified successfully' : 'User unverified successfully');
    } catch (error) {
      console.error('Error updating verification status:', error);
      alert('Failed to update verification status. Please try again.');
    }
  };

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

  useEffect(() => {
    if (activeSection === 'profile') {
      fetchAdminProfile();
    }
  }, [activeSection]);


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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden m-4">
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

          <div className="flex-1 overflow-y-auto p-6">
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden m-4">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Edit className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Edit Merchant: {merchant.businessName}
            </h3>
            <button onClick={onClose} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
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

  const handleViewUser = (user) => {
    setSelectedUserForView(user);
    setShowUserDetailsModal(true);
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/50 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all ease-in-out duration-300 scale-100">
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

          <form onSubmit={handleAddAdmin} className="flex-1 overflow-y-auto p-8 space-y-6">
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
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/50 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all ease-in-out duration-300 scale-100`}>
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

          <form onSubmit={handleAddUser} className="flex-1 overflow-y-auto p-8 space-y-6" encType="multipart/form-data">
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

          <form onSubmit={handleAddMerchant} className="flex-1 overflow-y-auto p-6 space-y-6">
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

  const MerchantFeeModal = () => {

    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
      if (!showMerchantFeeModal || !selectedMerchantForFees) {
        return;
      }

      console.log('🔍 MerchantFeeModal State Debug:');
      console.log('- Selected Merchant:', selectedMerchantForFees);
      console.log('- Fee Data:', merchantFeeData);
      console.log('- Payment History Count:', merchantPaymentHistory?.length || 0);
    }, [merchantFeeData, merchantPaymentHistory, merchantPaymentStats, feeDataLoading, showMerchantFeeModal, selectedMerchantForFees]);

    if (!showMerchantFeeModal || !selectedMerchantForFees) {
      return null;
    }
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">

          {/* Modal Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 dark:from-indigo-800 dark:via-purple-800 dark:to-blue-900 p-6 text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="hero-floating-elements">
              <div className="floating-circle circle-1"></div>
              <div className="floating-circle circle-2"></div>
              <div className="floating-circle circle-3"></div>
            </div>

            <div className="relative z-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-3 bg-white/15 backdrop-blur-sm rounded-xl">
                    <PieChart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Fee Management</h3>
                    <p className="text-indigo-100 mt-1">{selectedMerchantForFees.businessName}</p>
                    <p className="text-indigo-100 mt-1">{selectedMerchantForFees.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    console.log('🔄 Closing fee modal');
                    setShowMerchantFeeModal(false);
                    setSelectedMerchantForFees(null);
                    setMerchantFeeData(null);
                    setMerchantPaymentHistory([]);
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {feeDataLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <p className="ml-4 text-xl font-medium text-gray-700 dark:text-gray-300">Loading fee data...</p>
              </div>
            ) : (
              <div className="space-y-8">

                {/* Fee Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Current Fee Status */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-600 dark:bg-blue-700 rounded-xl">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${merchantFeeData?.alreadyPaid
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : merchantFeeData?.canPay
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}>
                        {merchantFeeData?.alreadyPaid ? 'Paid' : merchantFeeData?.canPay ? 'Due' : 'No Fee'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Current Month Fee</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                        {formatCurrency(merchantFeeData?.currentBalance || 0)}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-2 capitalize">
                        {merchantFeeData?.feeType || 'Unknown'} Fee
                      </p>
                    </div>
                  </div>

                  {/* Total Paid */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-600 dark:bg-green-700 rounded-xl">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Paid</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                        {formatCurrency(merchantPaymentStats?.totalAmountPaid || 0)}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                        {merchantPaymentStats?.completedPayments || 0} payments
                      </p>
                    </div>
                  </div>

                  {/* Monthly Revenue */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-600 dark:bg-purple-700 rounded-xl">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                        {formatCurrency(merchantFeeData?.monthlyRevenue || 0)}
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
                        For {new Date(currentFeeMonth + '-01').toLocaleDateString('en-BD', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Month Selector */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Select Month</h4>
                    <input
                      type="month"
                      value={currentFeeMonth}
                      onChange={(e) => handleFeeMonthChange(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  {merchantFeeData?.message && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 p-3 rounded-lg">
                      {merchantFeeData.message}
                    </p>
                  )}
                </div>

                {/* ✅ ENHANCED: Payment History Table with Better Data Display */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                        Payment History
                      </h4>
                      <div className="flex items-center space-x-4">
                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium">
                          {merchantPaymentHistory?.length || 0} payments
                        </span>
                        <button
                          onClick={() => fetchMerchantFeeData(selectedMerchantForFees.merchantId)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex items-center"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {merchantPaymentHistory && merchantPaymentHistory.length > 0 ? (
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Month</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction ID</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {merchantPaymentHistory.map((payment, index) => (
                            <tr key={payment.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {formatDate(payment.paymentDate)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {payment.paymentMonthName || payment.paymentMonth || 'Unknown'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {payment.formattedAmount || formatCurrency(payment.amount)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="mr-2">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                                  <span className="text-sm text-gray-900 dark:text-white capitalize">
                                    {payment.paymentMethod || 'Unknown'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                  {payment.status || 'Unknown'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white font-mono">
                                  {payment.transactionId || 'N/A'}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-12">
                        <PieChart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Payment History</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          {feeDataLoading
                            ? "Loading payment history..."
                            : "This merchant hasn't made any payments yet."
                          }
                        </p>
                        {!feeDataLoading && (
                          <button
                            onClick={() => {
                              console.log('🔄 Manual refresh clicked');
                              fetchMerchantFeeData(selectedMerchantForFees.merchantId);
                            }}
                            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm flex items-center mx-auto"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh Data
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update Your Profile</h3>
            <button onClick={() => setShowProfileModal(false)} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full">
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleProfileUpdate} className="flex-1 overflow-y-auto p-6 space-y-4">
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

  const UserEmailModal = () => {
    if (!showUserEmailModal || !selectedUserForEmail) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700">

          {/* Premium Modal Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-700 dark:via-purple-700 dark:to-indigo-800 p-6 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Send Email to User</h3>
                  <p className="text-blue-100 mt-1">
                    Sending to: <span className="font-semibold">{selectedUserForEmail.firstName} {selectedUserForEmail.lastName}</span>
                  </p>
                  <p className="text-blue-200 text-sm">{selectedUserForEmail.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowUserEmailModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                disabled={sendingEmail}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-6">

              {/* Email Template Selection */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-700">
                <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Email Templates
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleEmailTemplateChange('custom')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${emailFormData.template === 'custom'
                        ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-gray-700'
                      }`}
                  >
                    <div className="font-medium text-sm">Custom Message</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Create your own email</div>
                  </button>

                  {Object.entries(emailTemplates).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => handleEmailTemplateChange(key)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${emailFormData.template === key
                          ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-gray-700'
                        }`}
                    >
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{template.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Form */}
              <div className="grid grid-cols-1 gap-6">

                {/* Subject Field */}
                <div className="bg-white dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={emailFormData.subject}
                    onChange={handleEmailInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="Enter email subject..."
                    disabled={sendingEmail}
                  />
                </div>

                {/* Content Field */}
                <div className="bg-white dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <Edit className="h-4 w-4 inline mr-2" />
                    Email Content *
                  </label>
                  <textarea
                    name="content"
                    value={emailFormData.content}
                    onChange={handleEmailInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-colors duration-200"
                    placeholder="Write your email content here..."
                    disabled={sendingEmail}
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Character count: {emailFormData.content.length}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Supports line breaks and basic formatting
                    </p>
                  </div>
                </div>

                {/* File Attachments */}
                <div className="bg-white dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <Paperclip className="h-4 w-4 inline mr-2" />
                    File Attachments (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200">
                    <input
                      type="file"
                      id="email-attachments"
                      multiple
                      onChange={handleEmailAttachmentChange}
                      className="hidden"
                      disabled={sendingEmail}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.csv,.xlsx,.xls"
                    />
                    <label
                      htmlFor="email-attachments"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Click to upload files or drag and drop
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PDF, DOC, Images, Text files (Max 10MB each)
                      </span>
                    </label>
                  </div>

                  {/* Selected Files Display */}
                  {emailFormData.attachments.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selected Files ({emailFormData.attachments.length}):
                      </p>
                      <div className="space-y-2">
                        {emailFormData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-600 p-3 rounded-lg">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                const newAttachments = emailFormData.attachments.filter((_, i) => i !== index);
                                setEmailFormData(prev => ({ ...prev, attachments: newAttachments }));
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                              disabled={sendingEmail}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Preview */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Email Preview
                  </h4>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">To:</span> {selectedUserForEmail.email}</div>
                      <div><span className="font-medium">Subject:</span> {emailFormData.subject || 'No subject'}</div>
                      <div><span className="font-medium">Template:</span> {emailTemplates[emailFormData.template]?.name || 'Custom'}</div>
                      {emailFormData.attachments.length > 0 && (
                        <div><span className="font-medium">Attachments:</span> {emailFormData.attachments.length} file(s)</div>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="max-h-32 overflow-y-auto text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {emailFormData.content || 'Email content will appear here...'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Shield className="h-4 w-4 mr-1" />
                Email will be sent from FoodBridge Bangladesh Admin
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUserEmailModal(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  disabled={sendingEmail}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendUserEmail}
                  disabled={!emailFormData.subject.trim() || !emailFormData.content.trim() || sendingEmail}
                  className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-800 dark:hover:to-purple-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center text-sm font-medium shadow-lg"
                >
                  {sendingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
            <div className="premium-overview-container space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
              {/* Premium Welcome Hero Section */}
              <div className="premium-hero-banner relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="hero-bg-pattern"></div>
                <div className="hero-floating-elements">
                  <div className="floating-circle circle-1"></div>
                  <div className="floating-circle circle-2"></div>
                  <div className="floating-circle circle-3"></div>
                </div>

                <div className="relative z-10 hero-content">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                    <div className="hero-text-section">
                      <div className="flex items-center mb-4">
                        <div className="hero-icon-container">
                          <BarChart3 className="h-10 w-10 text-white" />
                        </div>
                        <div className="ml-4">
                          <h1 className="hero-title">
                            Welcome to FoodBridge
                            <span className="hero-subtitle-accent">Admin Control Center</span>
                          </h1>
                        </div>
                      </div>
                    </div>

                    <div className="hero-action-section">
                      <button
                        onClick={() => window.location.reload()}
                        className="hero-action-btn"
                      >
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Refresh Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Stats Grid - Square Frame Design */}
              <div className="premium-stats-section">
                <div className="section-header-premium">
                  <h2 className="section-title-premium">Platform Analytics</h2>
                  <p className="section-subtitle-premium">Real-time platform statistics and performance metrics</p>
                </div>

                <div className="premium-stats-grid">
                  {/* Total Users - Premium Square Card */}
                  <div className="premium-stat-card stat-card-primary">
                    <div className="stat-card-glow glow-blue"></div>
                    <div className="stat-card-inner">
                      <div className="stat-header">
                        <div className="stat-icon-premium stat-icon-blue">
                          <Users className="h-8 w-8" />
                        </div>
                        <div className="stat-trend-indicator positive">
                          <TrendingUp className="h-4 w-4" />
                          <span>+12%</span>
                        </div>
                      </div>
                      <div className="stat-content">
                        <div className="stat-value-premium">
                          {usersLoading ? (
                            <div className="stat-loading-skeleton"></div>
                          ) : (
                            <div className="stat-number-animated" data-value={usersData?.length || 0}>
                              {usersData?.length || 0}
                            </div>
                          )}
                        </div>
                        <div className="stat-label-premium">Total Users</div>
                        <div className="stat-description">Registered platform members</div>
                      </div>
                      <div className="stat-footer">
                        <div className="stat-breakdown">
                          <span className="breakdown-item">
                            <div className="breakdown-dot dot-green"></div>
                            {usersData?.filter(user => user.userType?.toLowerCase() === 'donor').length || 0} Donors
                          </span>
                          <span className="breakdown-item">
                            <div className="breakdown-dot dot-purple"></div>
                            {usersData?.filter(user => user.userType?.toLowerCase() === 'receiver').length || 0} Receivers
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Merchants - Premium Square Card */}
                  <div className="premium-stat-card stat-card-secondary">
                    <div className="stat-card-glow glow-orange"></div>
                    <div className="stat-card-inner">
                      <div className="stat-header">
                        <div className="stat-icon-premium stat-icon-orange">
                          <Store className="h-8 w-8" />
                        </div>
                        <div className="stat-trend-indicator positive">
                          <TrendingUp className="h-4 w-4" />
                          <span>+8%</span>
                        </div>
                      </div>
                      <div className="stat-content">
                        <div className="stat-value-premium">
                          {merchantsLoading ? (
                            <div className="stat-loading-skeleton"></div>
                          ) : (
                            <div className="stat-number-animated" data-value={merchantsData?.length || 0}>
                              {merchantsData?.length || 0}
                            </div>
                          )}
                        </div>
                        <div className="stat-label-premium">Total Merchants</div>
                        <div className="stat-description">Business partners</div>
                      </div>
                      <div className="stat-footer">
                        <div className="stat-breakdown">
                          <span className="breakdown-item">
                            <div className="breakdown-dot dot-green"></div>
                            {merchantsData?.filter(m => m.status === 'Active').length || 0} Active
                          </span>
                          <span className="breakdown-item">
                            <div className="breakdown-dot dot-yellow"></div>
                            {merchantsData?.filter(m => m.status === 'Pending').length || 0} Pending
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Donations - Premium Square Card */}
                  <div className="premium-stat-card stat-card-tertiary">
                    <div className="stat-card-glow glow-green"></div>
                    <div className="stat-card-inner">
                      <div className="stat-header">
                        <div className="stat-icon-premium stat-icon-green">
                          <Package className="h-8 w-8" />
                        </div>
                        <div className="stat-trend-indicator positive">
                          <TrendingUp className="h-4 w-4" />
                          <span>+15%</span>
                        </div>
                      </div>
                      <div className="stat-content">
                        <div className="stat-value-premium">
                          {donationsLoading ? (
                            <div className="stat-loading-skeleton"></div>
                          ) : (
                            <div className="stat-number-animated" data-value={donationsStats?.active || 0}>
                              {donationsStats?.active || 0}
                            </div>
                          )}
                        </div>
                        <div className="stat-label-premium">Active Donations</div>
                        <div className="stat-description">Available for pickup</div>
                      </div>
                      <div className="stat-footer">
                        <div className="stat-breakdown">
                          <span className="breakdown-item">
                            <div className="breakdown-dot dot-blue"></div>
                            {donationsStats?.completed || 0} Completed
                          </span>
                          <span className="breakdown-item">
                            <div className="breakdown-dot dot-red"></div>
                            {donationsStats?.expired || 0} Expired
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Messages - Premium Square Card */}
                  <div className="premium-stat-card stat-card-quaternary">
                    <div className="stat-card-glow glow-purple"></div>
                    <div className="stat-card-inner">
                      <div className="stat-header">
                        <div className="stat-icon-premium stat-icon-purple">
                          <Mail className="h-8 w-8" />
                        </div>
                        <div className="stat-trend-indicator neutral">
                          <Activity className="h-4 w-4" />
                          <span>0%</span>
                        </div>
                      </div>
                      <div className="stat-content">
                        <div className="stat-value-premium">
                          {messagesLoading ? (
                            <div className="stat-loading-skeleton"></div>
                          ) : (
                            <div className="stat-number-animated" data-value={messageStats?.totalMessages || 0}>
                              {messageStats?.totalMessages || 0}
                            </div>
                          )}
                        </div>
                        <div className="stat-label-premium">Total Messages</div>
                        <div className="stat-description">Platform communications</div>
                      </div>
                      <div className="stat-footer">
                        <div className="stat-breakdown">
                          <span className="breakdown-item">
                            <div className="breakdown-dot dot-red"></div>
                            {messageStats?.unreadMessages || 0} Unread
                          </span>
                          <span className="breakdown-item">
                            <div className="breakdown-dot dot-green"></div>
                            {messageStats?.readMessages || 0} Read
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Admins - Premium Square Card */}
                  <div className="premium-stat-card stat-card-accent">
                    <div className="stat-card-glow glow-indigo"></div>
                    <div className="stat-card-inner">
                      <div className="stat-header">
                        <div className="stat-icon-premium stat-icon-indigo">
                          <Shield className="h-8 w-8" />
                        </div>
                        <div className="stat-trend-indicator positive">
                          <Users className="h-4 w-4" />
                          <span>+2</span>
                        </div>
                      </div>
                      <div className="stat-content">
                        <div className="stat-value-premium">
                          {adminsLoading ? (
                            <div className="stat-loading-skeleton"></div>
                          ) : (
                            <div className="stat-number-animated" data-value={adminsData?.length || 0}>
                              {adminsData?.length || 0}
                            </div>
                          )}
                        </div>
                        <div className="stat-label-premium">System Admins</div>
                        <div className="stat-description">Platform administrators</div>
                      </div>
                      <div className="stat-footer">
                        <div className="stat-breakdown">
                          <span className="breakdown-item">
                            <div className="breakdown-dot dot-green"></div>
                            {adminsData?.filter(admin => admin.status === 'Active').length || 0} Active
                          </span>
                          <span className="breakdown-item">
                            <div className="breakdown-dot dot-gray"></div>
                            {adminsData?.filter(admin => admin.status !== 'Active').length || 0} Inactive
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Food Reports - Premium Square Card */}
                  <div className="premium-stat-card stat-card-warning">
                    <div className="stat-card-glow glow-red"></div>
                    <div className="stat-card-inner">
                      <div className="stat-header">
                        <div className="stat-icon-premium stat-icon-red">
                          <AlertTriangle className="h-8 w-8" />
                        </div>
                        <div className="stat-trend-indicator attention">
                          <Bell className="h-4 w-4" />
                          <span>Alert</span>
                        </div>
                      </div>
                      <div className="stat-content">
                        <div className="stat-value-premium">
                          {foodReportsLoading ? (
                            <div className="stat-loading-skeleton"></div>
                          ) : (
                            <div className="stat-number-animated" data-value={foodReportsStats?.totalReports || 0}>
                              {foodReportsStats?.totalReports || 0}
                            </div>
                          )}
                        </div>
                        <div className="stat-label-premium">Food Reports</div>
                        <div className="stat-description">Safety & quality reports</div>
                      </div>
                      <div className="stat-footer">
                        <div className="stat-breakdown">
                          <span className="breakdown-item">
                            <div className="breakdown-dot dot-yellow"></div>
                            {foodReportsStats?.pendingReports || 0} Pending
                          </span>
                          <span className="breakdown-item">
                            <div className="breakdown-dot dot-green"></div>
                            {foodReportsStats?.resolvedReports || 0} Resolved
                          </span>
                        </div>
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
              {/* Premium Header Section */}
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 rounded-2xl shadow-2xl dark:shadow-gray-900/50 p-8 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                    <div className="mb-6 lg:mb-0">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-4 shadow-lg">
                          <Users className="h-10 w-10 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold mb-2">User Management</h2>
                          <p className="text-indigo-100 text-lg">Manage and oversee all platform users</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6 mt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{usersData?.length || 0}</div>
                          <div className="text-indigo-200 text-sm">Total Users</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{usersData?.filter(user => user.userType?.toLowerCase() === 'donor').length || 0}</div>
                          <div className="text-indigo-200 text-sm">Donors</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{usersData?.filter(user => user.userType?.toLowerCase() === 'receiver').length || 0}</div>
                          <div className="text-indigo-200 text-sm">Receivers</div>
                        </div>
                      </div>
                    </div>

                    <button
                      className="px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center border border-white/20 hover:scale-105"
                      onClick={() => setShowAddUserModal(true)}
                    >
                      <Plus className="h-5 w-5 mr-3" />
                      Add New User
                    </button>
                  </div>
                </div>
              </div>

              {/* Premium Filter Controls */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setUserTypeFilter('all')}
                      className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${userTypeFilter === 'all'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white shadow-indigo-500/25'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                    >
                      <Users className="h-4 w-4 inline mr-2" />
                      All Users
                    </button>
                    <button
                      onClick={() => setUserTypeFilter('donor')}
                      className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${userTypeFilter === 'donor'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 text-white shadow-emerald-500/25'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                    >
                      <Heart className="h-4 w-4 inline mr-2" />
                      Donors
                    </button>
                    <button
                      onClick={() => setUserTypeFilter('receiver')}
                      className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${userTypeFilter === 'receiver'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700 text-white shadow-blue-500/25'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                    >
                      <UserPlus className="h-4 w-4 inline mr-2" />
                      Receivers
                    </button>
                  </div>
                </div>
              </div>

              {usersLoading ? (
                <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-xl dark:shadow-gray-900/50 text-center border border-gray-100 dark:border-gray-700">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 dark:border-indigo-400 border-t-transparent mx-auto mb-6"></div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Loading users...</p>
                </div>
              ) : usersError ? (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-8 rounded-2xl shadow-xl border border-red-200 dark:border-red-800">
                  <div className="text-center">
                    <AlertTriangle className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Error Loading Users</h3>
                    <p className="text-red-600 dark:text-red-400 mb-6">{usersError}</p>
                    <button
                      onClick={fetchUsers}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <RefreshCw className="h-4 w-4 inline mr-2" />
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Premium User Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {usersData
                      .filter(user => userTypeFilter === 'all' || user.userType.toLowerCase() === userTypeFilter.toLowerCase())
                      .map((user) => (
                        <div
                          key={user.id}
                          className="premium-user-card group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 transform hover:scale-105 hover:-translate-y-2"
                        >
                          {/* Premium Status Bar */}
                          <div className={`absolute top-0 left-0 right-0 h-1 ${user.isVerified
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500'
                            }`}></div>

                          {/* Floating Verification Badge */}
                          <div className="absolute top-4 right-4 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${user.isVerified
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                              }`}>
                              {user.isVerified ? (
                                <ShieldCheck className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                          </div>

                          {/* Card Content with Flex Layout */}
                          <div className="p-6 h-full flex flex-col">
                            {/* User Avatar Section */}
                            <div className="flex flex-col items-center mb-4 flex-shrink-0">
                              <div className="relative mb-3">
                                <img
                                  src={user.photoBase64 ? `data:${user.photoContentType};base64,${user.photoBase64}` : '/api/placeholder/80/80'}
                                  alt={`${user.firstName} ${user.lastName}`}
                                  className="w-16 h-16 rounded-2xl shadow-lg border-4 border-white dark:border-gray-700 object-cover group-hover:shadow-xl transition-all duration-300 group-hover:scale-110"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/api/placeholder/80/80';
                                  }}
                                />
                                {/* Floating Online Indicator */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg"></div>
                              </div>

                              <div className="text-center">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                                  {user.firstName} {user.lastName}
                                </h3>
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-md ${user.userType === 'donor'
                                  ? 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-800 dark:text-blue-300'
                                  }`}>
                                  {user.userType === 'donor' ? (
                                    <Heart className="h-3 w-3 mr-1" />
                                  ) : (
                                    <UserPlus className="h-3 w-3 mr-1" />
                                  )}
                                  {user.userType === 'donor' ? 'Donor' : 'Receiver'}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">{user.email}</p>
                              </div>
                            </div>

                            {/* User Stats Grid - Flexible */}
                            <div className="space-y-2 mb-4 flex-grow">
                              <div className="flex items-center justify-between text-xs">
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 dark:text-gray-400 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                                  Joined:
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-gray-200">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 dark:text-gray-400 flex items-center">
                                  <Phone className="h-3 w-3 mr-1 text-gray-400" />
                                  Phone:
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-gray-200 truncate text-right max-w-[100px]">
                                  {user.phone}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 dark:text-gray-400 flex items-center">
                                  <Activity className="h-3 w-3 mr-1 text-gray-400" />
                                  Blood:
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-gray-200">
                                  {user.bloodGroup}
                                </span>
                              </div>
                            </div>

                            {/* Premium Action Buttons - Fixed at Bottom */}
                            <div className="grid grid-cols-4 gap-2 mt-auto flex-shrink-0">
                              <button
                                onClick={() => {
                                  setSelectedUserForView(user);
                                  setShowViewUserModal(true);
                                }}
                                className="premium-action-btn view-btn group/btn relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center"
                                title="View Details"
                              >
                                <Eye className="h-3.5 w-3.5 mb-1 relative z-10 group-hover/btn:scale-110 transition-transform duration-300" />
                                <span className="text-[10px] font-medium relative z-10">View</span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                              </button>
                              <button
                                onClick={() => handleUserEmailClick(user)}
                                className="premium-action-btn email-btn group/btn relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center"
                                title="Send Email"
                              >
                                <Mail className="h-3.5 w-3.5 mb-1 relative z-10 group-hover/btn:scale-110 transition-transform duration-300" />
                                <span className="text-[10px] font-medium relative z-10">Email</span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                              </button>

                              <button
                                className="premium-action-btn verify-btn group/btn relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center"
                                title={user.isVerified ? "Unverify User" : "Verify User"}
                                onClick={() => handleUpdateVerificationStatus(user.id, !user.isVerified)}
                              >
                                {user.isVerified ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mb-1 relative z-10 group-hover/btn:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                                  </svg>
                                ) : (
                                  <Check className="h-3.5 w-3.5 mb-1 relative z-10 group-hover/btn:scale-110 transition-transform duration-300" />
                                )}
                                <span className="text-[10px] font-medium relative z-10">
                                  {user.isVerified ? 'Unverify' : 'Verify'}
                                </span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                              </button>

                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="premium-action-btn delete-btn group/btn relative overflow-hidden bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center"
                                title="Delete User"
                              >
                                <Trash2 className="h-3.5 w-3.5 mb-1 relative z-10 group-hover/btn:scale-110 transition-transform duration-300" />
                                <span className="text-[10px] font-medium relative z-10">Delete</span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                              </button>
                            </div>
                          </div>

                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none"></div>
                        </div>
                      ))}
                  </div>
                  {/* Premium Empty State */}
                  {usersData.filter(user => userTypeFilter === 'all' || user.userType.toLowerCase() === userTypeFilter.toLowerCase()).length === 0 && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-12 rounded-2xl shadow-xl dark:shadow-gray-900/50 text-center border border-gray-200 dark:border-gray-700">
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <User className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Users Found</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-md mx-auto">
                        {userTypeFilter !== 'all'
                          ? `No ${userTypeFilter}s found in the system.`
                          : "There are no users registered in the system yet."}
                      </p>
                      {userTypeFilter !== 'all' ? (
                        <button
                          onClick={() => setUserTypeFilter('all')}
                          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <RefreshCw className="h-5 w-5 inline mr-2" />
                          Show All Users
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowAddUserModal(true)}
                          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <Plus className="h-5 w-5 inline mr-2" />
                          Add Your First User
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}



          {/* ============== PREMIUM MERCHANT MANAGEMENT SECTION ============== */}
          {activeSection === 'merchants' && (
            <div className="space-y-8">
              {/* Premium Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-8 border-l-4 border-indigo-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl dark:hover:shadow-gray-900/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/20"></div>
                  <div className="relative flex items-center">
                    <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-2xl shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300 group-hover:scale-110">
                      <Store className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-6">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Merchants</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{merchantsData.length}</p>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        All registered partners
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-8 border-l-4 border-emerald-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl dark:hover:shadow-gray-900/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/20"></div>
                  <div className="relative flex items-center">
                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-2xl shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-110">
                      <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-6">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Active Merchants</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {merchantsData.filter(m => m.status === 'Active').length}
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                        <Activity className="h-4 w-4 mr-1" />
                        {merchantsData.length > 0 ?
                          `${Math.round((merchantsData.filter(m => m.status === 'Active').length / merchantsData.length) * 100)}% active rate` :
                          '0% active rate'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-8 border-l-4 border-amber-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl dark:hover:shadow-gray-900/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-900/20"></div>
                  <div className="relative flex items-center">
                    <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-2xl shadow-lg group-hover:shadow-amber-500/25 transition-all duration-300 group-hover:scale-110">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-6">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Pending Approval</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {merchantsData.filter(m => m.status === 'Pending').length}
                      </p>
                      <p className="text-sm text-amber-600 dark:text-amber-400 mt-1 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Waiting for verification
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Filter Controls */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                  <div className="flex flex-wrap gap-3">
                    <select className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium">
                      <option value="all">All Types</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="grocery">Grocery</option>
                      <option value="bakery">Bakery</option>
                      <option value="cafe">Café</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setShowAddMerchantModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 text-white rounded-xl hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 dark:hover:from-indigo-600 dark:hover:via-purple-600 dark:hover:to-pink-600 flex items-center justify-center shadow-lg transition-all duration-300 font-semibold group"
                  >
                    <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Add New Merchant
                  </button>
                </div>
              </div>

              {/* Premium Merchant Grid */}
              {merchantsLoading ? (
                <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-sm dark:shadow-gray-900/30 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 dark:border-indigo-400 mx-auto"></div>
                  <p className="mt-6 text-gray-600 dark:text-gray-400 text-lg font-medium">Loading merchants...</p>
                </div>
              ) : merchantsError ? (
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl shadow-sm border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400 flex items-center text-lg">
                    <AlertTriangle className="h-6 w-6 mr-3" />{merchantsError}
                  </p>
                  <button
                    onClick={fetchMerchants}
                    className="mt-4 px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors duration-200 font-medium"
                  >
                    <RefreshCw className="h-5 w-5 inline mr-2" />Try Again
                  </button>
                </div>
              ) : (
                <div className="premium-merchant-grid">
                  {merchantsData.map((merchant) => (
                    <div key={merchant.merchantId} className="merchant-card">
                      <div className="merchant-header">
                        <div className="merchant-logo">
                          {merchant.logoBase64 ? (
                            <img
                              src={`data:${merchant.logoType || 'image/jpeg'};base64,${merchant.logoBase64}`}
                              alt={merchant.businessName}
                              className="h-full w-full object-cover rounded-2xl"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/api/placeholder/64/64';
                              }}
                            />
                          ) : (
                            <Store className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                        <div className="merchant-info">
                          <div className="merchant-name">
                            {merchant.businessName}
                            <span className={`merchant-status-badge ${merchant.status.toLowerCase()}`}>
                              <div className={`w-2 h-2 rounded-full ${merchant.status === 'Active' ? 'bg-emerald-500' :
                                merchant.status === 'Pending' ? 'bg-amber-500' : 'bg-gray-500'}`}></div>
                              {merchant.status}
                            </span>
                          </div>
                          <p className="merchant-id">ID: {merchant.merchantId}</p>
                          <p className="merchant-email">{merchant.email}</p>
                        </div>
                      </div>

                      <div className="merchant-details">
                        <div className="merchant-detail-item">
                          <User className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                          <span>{merchant.ownerFirstName} {merchant.ownerLastName}</span>
                        </div>
                        <div className="merchant-detail-item">
                          <MapPin className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                          <span>{merchant.city}</span>
                        </div>
                        <div className="merchant-detail-item">
                          <Calendar className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                          <span>{new Date(merchant.joined).toLocaleDateString()}</span>
                        </div>
                        <div className="merchant-detail-item">
                          <ShoppingBag className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                          <span>{merchant.businessType}</span>
                        </div>
                      </div>

                      <div className="merchant-actions">
                        <div className="merchant-action-buttons">
                          <button
                            className="merchant-action-btn view"
                            title="View Details"
                            onClick={() => {
                              setSelectedMerchant(merchant);
                              setShowViewMerchantModal(true);
                            }}
                          >
                            <Eye className="h-5 w-5" />
                            <span>View</span>
                          </button>

                          <button
                            className="merchant-action-btn edit"
                            title="Edit Merchant"
                            onClick={() => {
                              setSelectedMerchant(merchant);
                              setShowEditMerchantModal(true);
                            }}
                          >
                            <Edit className="h-5 w-5" />
                            <span>Edit</span>
                          </button>

                          <button
                            className="merchant-action-btn email"
                            title="Send Email"
                            onClick={() => {
                              alert(`Send email to: ${merchant.email}`);
                            }}
                          >
                            <Mail className="h-5 w-5" />
                            <span>Email</span>
                          </button>

                          <button
                            className="merchant-action-btn fees"
                            title="View Fee Details"
                            onClick={() => handleMerchantFeeClick(merchant)}
                          >
                            <PieChart className="h-5 w-5" />
                            <span>Fees</span>
                          </button>

                          <button
                            className="merchant-action-btn delete"
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
                                      fetchMerchants();
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
                            <span>Delete</span>
                          </button>

                          <button
                            className={`merchant-action-btn ${merchant.status === 'Active' ? 'block' : 'activate'}`}
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
                                    fetchMerchants();
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
                            {merchant.status === 'Active' ? (
                              <>
                                <Lock className="h-5 w-5" />
                                <span>Block</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-5 w-5" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!merchantsLoading && !merchantsError && merchantsData.length === 0 && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-12 rounded-2xl shadow-sm dark:shadow-gray-900/30 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <Store className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Merchants Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">There are no merchants registered in the system yet. Start by adding your first merchant partner.</p>
                  <button
                    onClick={() => setShowAddMerchantModal(true)}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 inline-flex items-center transition-all duration-300 font-semibold shadow-lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Merchant
                  </button>
                </div>
              )}

              {/* Pagination Controls */}
              {!merchantsLoading && !merchantsError && merchantsData.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-3">
                    <button
                      className="px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-all duration-200 shadow-sm"
                      disabled={true}
                    >
                      Previous
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg">
                      1
                    </button>
                    <button
                      className="px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-all duration-200 shadow-sm"
                      disabled={true}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}

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
          )}

          {/* ============== ADMIN MANAGEMENT SECTION ============== */}
          {/* ============== PREMIUM ADMIN MANAGEMENT SECTION ============== */}
          {activeSection === 'NewAdmin' && (
            <div className="space-y-8">
              {/* Premium Admin Section Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 dark:from-indigo-800 dark:via-purple-800 dark:to-blue-900 rounded-3xl shadow-2xl dark:shadow-indigo-900/50 p-8">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                    <div className="mb-6 lg:mb-0">
                      <div className="flex items-center mb-4">
                        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl mr-4 shadow-lg">
                          <Shield className="h-10 w-10 text-white" />
                        </div>
                        <div>
                          <h2 className="text-4xl font-bold text-white mb-2">Admin Management</h2>
                          <p className="text-indigo-100 text-lg">Manage system administrators and their access permissions</p>
                        </div>
                      </div>
                    </div>

                    <button
                      className="group relative px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 border border-white/20"
                      onClick={() => setShowAddAdminModal(true)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl group-hover:from-white/30 transition-all duration-300"></div>
                      <div className="relative flex items-center">
                        <UserPlus className="h-5 w-5 mr-3" />
                        Add New Admin
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Premium Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  {
                    title: "Total Admins",
                    value: adminsData.length,
                    icon: Users,
                    gradient: "from-blue-500 to-cyan-500",
                    bgGradient: "from-blue-50 to-cyan-50",
                    darkBgGradient: "from-blue-950/50 to-cyan-950/50",
                    description: "System administrators"
                  },
                  {
                    title: "System Admins",
                    value: adminsData.filter(admin => admin.role === 'System Administrator').length,
                    icon: ShieldCheck,
                    gradient: "from-indigo-500 to-purple-500",
                    bgGradient: "from-indigo-50 to-purple-50",
                    darkBgGradient: "from-indigo-950/50 to-purple-950/50",
                    description: "Full access admins"
                  },
                  {
                    title: "Content Managers",
                    value: adminsData.filter(admin => admin.role === 'Content Manager').length,
                    icon: FileText,
                    gradient: "from-purple-500 to-pink-500",
                    bgGradient: "from-purple-50 to-pink-50",
                    darkBgGradient: "from-purple-950/50 to-pink-950/50",
                    description: "Content moderators"
                  },
                  {
                    title: "Active Admins",
                    value: adminsData.filter(admin => admin.status === 'Active').length,
                    icon: Activity,
                    gradient: "from-emerald-500 to-green-500",
                    bgGradient: "from-emerald-50 to-green-50",
                    darkBgGradient: "from-emerald-950/50 to-green-950/50",
                    description: "Currently online"
                  }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`group relative bg-gradient-to-br ${stat.bgGradient} dark:${stat.darkBgGradient} rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-xl dark:shadow-gray-900/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2`}
                  >
                    {/* Gradient Border Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                            {stat.value}
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{stat.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Premium Admin Cards Grid */}
              {adminsLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  </div>
                  <p className="ml-4 text-xl font-medium text-gray-700 dark:text-gray-300">Loading administrators...</p>
                </div>
              ) : adminsData.length === 0 ? (
                <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center">
                    <Users className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Administrators Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">There are no administrators registered in the system yet. Get started by adding your first admin.</p>
                  <button
                    onClick={() => setShowAddAdminModal(true)}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <UserPlus className="h-5 w-5 mr-3" />
                    Add Your First Admin
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                  {adminsData.map((admin, index) => (
                    <div
                      key={admin.id}
                      className={`group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-gray-900/50 overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl dark:hover:shadow-indigo-900/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 ${admin.status !== 'Active' ? 'opacity-75 dark:opacity-60' : ''}`}
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      {/* Status Gradient Bar */}
                      <div className={`h-1 w-full bg-gradient-to-r ${admin.status === 'Active' ? 'from-emerald-500 to-green-500' : 'from-gray-400 to-gray-500'}`}></div>

                      {/* Premium Glass Effect Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-indigo-50/30 dark:from-gray-800/50 dark:to-indigo-900/20"></div>

                      {/* Main Content */}
                      <div className="relative z-10 p-8">
                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center space-x-4">
                            {/* Premium Avatar with Multiple Rings */}
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1 shadow-lg">
                                <div className="bg-white dark:bg-gray-800 rounded-full p-1">
                                  {admin.profilePhotoBase64 ? (
                                    <img
                                      src={`data:image/jpeg;base64,${admin.profilePhotoBase64}`}
                                      alt="Admin"
                                      className="w-16 h-16 rounded-full object-cover shadow-inner"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center">
                                      <User className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* Online Status Indicator */}
                              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white dark:border-gray-800 ${admin.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'} shadow-lg`}>
                                <div className={`w-full h-full rounded-full ${admin.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-300'}`}></div>
                              </div>
                            </div>

                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                                {admin.firstName} {admin.lastName}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-800 dark:text-indigo-300 text-sm rounded-full font-medium border border-indigo-200 dark:border-indigo-700">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {admin.role}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${admin.status === 'Active'
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                              }`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${admin.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                              {admin.status}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: {admin.id}</span>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4 mb-6">
                          <div className="bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-700/50 dark:to-indigo-900/20 rounded-2xl p-4 border border-gray-100 dark:border-gray-600">
                            <div className="space-y-3">
                              <div className="flex items-center text-sm">
                                <Mail className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-3 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300 truncate">{admin.email}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Phone className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-3 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">{admin.phoneNumber}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-3 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">Added: {new Date(admin.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-3 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">Last active: {new Date(admin.lastActive).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                          <button
                            className="group/btn flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                            title="Send Message"
                          >
                            <Mail className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
                          </button>

                          <button
                            className="group/btn flex items-center justify-center p-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
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
                                      fetchAdmins();
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
                            <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
                          </button>
                        </div>
                      </div>

                      {/* Hover Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
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

                <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
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

          {showViewUserModal && selectedUserForView && (
            <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 p-6 text-white">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="h-16 w-16 rounded-2xl border-4 border-white/30 shadow-lg overflow-hidden bg-white/20">
                            {selectedUserForView.photoBase64 ? (
                              <img
                                src={`data:${selectedUserForView.photoContentType};base64,${selectedUserForView.photoBase64}`}
                                alt={`${selectedUserForView.firstName} ${selectedUserForView.lastName}`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-full w-full p-3 text-white/70" />
                            )}
                          </div>
                          {selectedUserForView.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                              <ShieldCheck className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{selectedUserForView.firstName} {selectedUserForView.lastName}</h3>
                          <p className="text-blue-100 opacity-90">{selectedUserForView.email}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${selectedUserForView.userType === 'donor'
                                ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30'
                                : 'bg-blue-500/20 text-blue-100 border border-blue-400/30'
                              }`}>
                              {selectedUserForView.userType === 'donor' ? '💝 Donor' : '🤝 Receiver'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowViewUserModal(false);
                          setSelectedUserForView(null);
                        }}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <X className="h-6 w-6 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200/50 dark:border-blue-700/50">
                      <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Personal Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Full Name:</span>
                          <span className="text-gray-900 dark:text-white font-semibold">{selectedUserForView.firstName} {selectedUserForView.lastName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Email:</span>
                          <span className="text-gray-900 dark:text-white">{selectedUserForView.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Phone:</span>
                          <span className="text-gray-900 dark:text-white">{selectedUserForView.phone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Birthdate:</span>
                          <span className="text-gray-900 dark:text-white">{new Date(selectedUserForView.birthdate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Blood Group:</span>
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-semibold">
                            🩸 {selectedUserForView.bloodGroup}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Identification */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-200/50 dark:border-green-700/50">
                      <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center">
                        <ShieldCheck className="h-5 w-5 mr-2" />
                        Identification
                      </h4>
                      <div className="space-y-3">
                        {selectedUserForView.nationalId && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">National ID:</span>
                            <span className="text-gray-900 dark:text-white font-mono">{selectedUserForView.nationalId}</span>
                          </div>
                        )}
                        {selectedUserForView.passportNumber && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Passport:</span>
                            <span className="text-gray-900 dark:text-white font-mono">{selectedUserForView.passportNumber}</span>
                          </div>
                        )}
                        {selectedUserForView.birthCertificateNumber && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Birth Certificate:</span>
                            <span className="text-gray-900 dark:text-white font-mono">{selectedUserForView.birthCertificateNumber}</span>
                          </div>
                        )}
                        {!selectedUserForView.nationalId && !selectedUserForView.passportNumber && !selectedUserForView.birthCertificateNumber && (
                          <div className="text-center py-4">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">No identification documents provided</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-200/50 dark:border-purple-700/50">
                      <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Address Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 font-medium block mb-1">Primary Address:</span>
                          <span className="text-gray-900 dark:text-white">{selectedUserForView.address}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 font-medium block mb-1">Address Details:</span>
                          <span className="text-gray-900 dark:text-white">{selectedUserForView.addressDescription}</span>
                        </div>
                      </div>
                    </div>

                    {/* Account Status */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-5 border border-yellow-200/50 dark:border-yellow-700/50">
                      <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-4 flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        Account Status
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">User Type:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedUserForView.userType === 'donor'
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                            }`}>
                            {selectedUserForView.userType === 'donor' ? '💝 Food Donor' : '🤝 Food Receiver'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Member Since:</span>
                          <span className="text-gray-900 dark:text-white">{new Date(selectedUserForView.createdAt).toLocaleDateString()}</span>
                        </div>
                        {selectedUserForView.updatedAt && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Last Updated:</span>
                            <span className="text-gray-900 dark:text-white">{new Date(selectedUserForView.updatedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  {selectedUserForView.bio && (
                    <div className="mt-6 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-3 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Bio
                      </h4>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedUserForView.bio}</p>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-indigo-200/50 dark:border-indigo-700/50">
                    <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Quick Actions
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setSelectedUser(selectedUserForView);
                          setShowEmailModal(true);
                          setShowViewUserModal(false);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateVerificationStatus(selectedUserForView.id, !selectedUserForView.isVerified);
                          setShowViewUserModal(false);
                        }}
                        className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors flex items-center ${selectedUserForView.isVerified
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                          }`}
                      >
                        {selectedUserForView.isVerified ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Unverify User
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Verify User
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this user?')) {
                            handleDeleteUser(selectedUserForView.id);
                            setShowViewUserModal(false);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      User ID: <span className="font-mono font-semibold">{selectedUserForView.id}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowViewUserModal(false);
                        setSelectedUserForView(null);
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* ============== MESSAGES SECTION ============== */}
          {activeSection === 'messages' && (
            <div className="space-y-8">
              {/* Premium Message Header */}
              <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-900 rounded-2xl shadow-2xl dark:shadow-gray-900/50 p-8 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-white/5 rounded-full"></div>

                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                    <div className="mb-6 lg:mb-0">
                      <div className="flex items-center mb-3">
                        <div className="p-3 bg-white/20 rounded-xl mr-4">
                          <Mail className="h-10 w-10 text-white" />
                        </div>
                        <div>
                          <h4 className="text-4xl font-bold">Message Center</h4>
                          <p className="text-purple-100 mt-1 text-lg">Manage communications and inquiries</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowComposeModal(true)}
                        className="px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center border border-white/20"
                      >
                        <Plus className="h-5 w-5 mr-3" />
                        Compose Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Message Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Total Messages */}
                <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                        <Mail className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Total Messages</p>
                        <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{messageStats.totalMessages}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-blue-700 dark:text-blue-300">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">All communications</span>
                    </div>
                  </div>
                </div>

                {/* Unread Messages */}
                <div className="group relative bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 rounded-2xl p-6 border border-red-200/50 dark:border-red-700/50 hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl shadow-lg group-hover:shadow-red-500/50 transition-all duration-300">
                        <AlertTriangle className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Unread</p>
                        <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-1">{messageStats.unreadMessages}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-red-700 dark:text-red-300">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Need attention</span>
                    </div>
                  </div>
                </div>

                {/* Read Messages */}
                <div className="group relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50 hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-xl shadow-lg group-hover:shadow-green-500/50 transition-all duration-300">
                        <Check className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Read</p>
                        <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">{messageStats.readMessages}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-700 dark:text-green-300">
                      <Check className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Processed</span>
                    </div>
                  </div>
                </div>

                {/* With Attachments */}
                <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                        <Package className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">With Files</p>
                        <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">{messageStats.messagesWithAttachments}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-purple-700 dark:text-purple-300">
                      <Package className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Has attachments</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Filter Controls */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => setMessageFilter('all')}
                    className={`premium-filter-btn ${messageFilter === 'all' ? 'active' : ''}`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    All Messages
                  </button>
                  <button
                    onClick={() => setMessageFilter('unread')}
                    className={`premium-filter-btn ${messageFilter === 'unread' ? 'active' : ''}`}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Unread ({messageStats.unreadMessages})
                  </button>
                  <button
                    onClick={() => setMessageFilter('read')}
                    className={`premium-filter-btn ${messageFilter === 'read' ? 'active' : ''}`}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Read
                  </button>
                  <button
                    onClick={() => setMessageFilter('with-attachments')}
                    className={`premium-filter-btn ${messageFilter === 'with-attachments' ? 'active' : ''}`}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    With Files
                  </button>
                </div>
              </div>

              {/* Premium Messages Grid */}
              {messagesLoading ? (
                <div className="bg-white dark:bg-gray-800 p-16 rounded-2xl shadow-xl dark:shadow-gray-900/50 text-center border border-gray-100 dark:border-gray-700">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                  <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">Loading messages...</p>
                </div>
              ) : messagesError ? (
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 p-8 rounded-2xl shadow-xl border border-red-200 dark:border-red-800 text-center">
                  <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">{messagesError}</p>
                  <button
                    onClick={fetchMessages}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center mx-auto"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {messagesData.length > 0 ? (
                    messagesData.map((message) => (
                      <div
                        key={message.id}
                        className={`premium-message-card ${!message.isRead ? 'unread' : 'read'}`}
                      >
                        {/* Premium Message Header */}
                        <div className={`premium-message-header ${!message.isRead ? 'unread' : 'read'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {!message.isRead && (
                                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                              )}
                              <span className={`premium-status-badge ${!message.isRead ? 'new' : 'read'}`}>
                                {!message.isRead ? 'New Message' : 'Read'}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Premium Message Content */}
                        <div className="p-6">
                          {/* Sender Info */}
                          <div className="flex items-start mb-4">
                            <div className="premium-message-avatar">
                              {message.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 ml-4">
                              <h4 className="premium-sender-name">{message.email}</h4>
                              <p className="premium-subject">
                                {message.subject || 'No Subject'}
                              </p>
                              {message.hasAttachment && (
                                <div className="premium-attachment-badge">
                                  <Package className="h-3 w-3 mr-1" />
                                  <span>{message.fileName}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Message Preview */}
                          <div className="premium-message-preview">
                            {message.message.length > 120
                              ? message.message.substring(0, 120) + '...'
                              : message.message}
                          </div>

                          {/* Premium Action Buttons */}
                          <div className="premium-action-grid">
                            <button
                              onClick={() => handleViewMessage(message.id)}
                              className="premium-action-btn view"
                              title="View Message"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedMessage(message);
                                setReplySubject(`Re: ${message.subject || 'Your message'}`);
                                setShowReplyModal(true);
                              }}
                              className="premium-action-btn reply"
                              title="Reply"
                            >
                              <Mail className="h-4 w-4" />
                              <span>Reply</span>
                            </button>

                            {message.hasAttachment && (
                              <>
                                <button
                                  onClick={() => handleViewAttachment(message.id, message.fileName)}
                                  className="premium-action-btn attachment"
                                  title="View Attachment"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>File</span>
                                </button>

                                <button
                                  onClick={() => handleDownloadAttachment(message.id, message.fileName)}
                                  className="premium-action-btn download"
                                  title="Download"
                                >
                                  <Download className="h-4 w-4" />
                                  <span>Save</span>
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="premium-action-btn delete"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>

                          {/* Read Status Footer */}
                          {message.isRead && (
                            <div className="premium-read-status">
                              <Check className="h-3 w-3 mr-1" />
                              <span>Read by {message.readBy} on {new Date(message.readAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-16 rounded-2xl shadow-xl text-center border border-gray-200 dark:border-gray-700">
                      <Mail className="h-20 w-20 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Messages Found</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                        {messageFilter === 'all'
                          ? "No messages have been received yet."
                          : `No ${messageFilter.replace('-', ' ')} messages found.`}
                      </p>
                      {messageFilter !== 'all' && (
                        <button
                          onClick={() => setMessageFilter('all')}
                          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
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

          {/* ============== ENHANCED REPORTS SECTION ============== */}
          {activeSection === 'reports' && (
            <div className="reports-container">
              {/* Enhanced Reports Header */}
              <div className="reports-header">
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Food Safety Reports</h2>
                      <p className="text-blue-100 text-lg">Monitor and manage food safety incidents across the platform</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                        <span className="text-white font-semibold">Total Active Reports</span>
                        <div className="text-2xl font-bold text-white">{foodReportsStats.totalReports}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Stats Grid */}
              <div className="reports-stats-grid">
                <div className="premium-stat-card total">
                  <div className="premium-stat-icon">
                    <FileText className="h-7 w-7" />
                  </div>
                  <div className="premium-stat-value">{foodReportsStats.totalReports}</div>
                  <div className="premium-stat-label">Total Reports</div>
                </div>

                <div className="premium-stat-card pending">
                  <div className="premium-stat-icon">
                    <Clock className="h-7 w-7" />
                  </div>
                  <div className="premium-stat-value">{foodReportsStats.pendingReports}</div>
                  <div className="premium-stat-label">Pending Review</div>
                </div>

                <div className="premium-stat-card under-review">
                  <div className="premium-stat-icon">
                    <Eye className="h-7 w-7" />
                  </div>
                  <div className="premium-stat-value">{foodReportsStats.underReviewReports}</div>
                  <div className="premium-stat-label">Under Review</div>
                </div>

                <div className="premium-stat-card resolved">
                  <div className="premium-stat-icon">
                    <Check className="h-7 w-7" />
                  </div>
                  <div className="premium-stat-value">{foodReportsStats.resolvedReports}</div>
                  <div className="premium-stat-label">Resolved</div>
                </div>

                <div className="premium-stat-card dismissed">
                  <div className="premium-stat-icon">
                    <X className="h-7 w-7" />
                  </div>
                  <div className="premium-stat-value">{foodReportsStats.dismissedReports}</div>
                  <div className="premium-stat-label">Dismissed</div>
                </div>

                <div className="premium-stat-card escalated">
                  <div className="premium-stat-icon">
                    <AlertTriangle className="h-7 w-7" />
                  </div>
                  <div className="premium-stat-value">{foodReportsStats.escalatedReports}</div>
                  <div className="premium-stat-label">Escalated</div>
                </div>
              </div>

              {/* Premium Filter Controls */}
              <div className="premium-filter-container">
                <div className="premium-filter-grid">
                  <button
                    onClick={() => setReportFilter('all')}
                    className={`premium-filter-btn ${reportFilter === 'all' ? 'active' : ''}`}
                  >
                    <FileText className="h-4 w-4" />
                    All Reports
                  </button>
                  <button
                    onClick={() => setReportFilter('pending')}
                    className={`premium-filter-btn ${reportFilter === 'pending' ? 'active' : ''}`}
                  >
                    <Clock className="h-4 w-4" />
                    Pending ({foodReportsStats.pendingReports})
                  </button>
                  <button
                    onClick={() => setReportFilter('under_review')}
                    className={`premium-filter-btn ${reportFilter === 'under_review' ? 'active' : ''}`}
                  >
                    <Eye className="h-4 w-4" />
                    Under Review ({foodReportsStats.underReviewReports})
                  </button>
                  <button
                    onClick={() => setReportFilter('resolved')}
                    className={`premium-filter-btn ${reportFilter === 'resolved' ? 'active' : ''}`}
                  >
                    <Check className="h-4 w-4" />
                    Resolved ({foodReportsStats.resolvedReports})
                  </button>
                  <button
                    onClick={() => setReportFilter('escalated')}
                    className={`premium-filter-btn ${reportFilter === 'escalated' ? 'active' : ''}`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Escalated ({foodReportsStats.escalatedReports})
                  </button>
                </div>
              </div>

              {/* Premium Reports Grid */}
              {foodReportsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="loading-spinner"></div>
                  <p className="ml-4 text-gray-600 dark:text-gray-400">Loading reports...</p>
                </div>
              ) : foodReportsError ? (
                <div className="error-container">
                  <AlertTriangle className="error-icon" />
                  <h3 className="error-title">Error Loading Reports</h3>
                  <p className="error-message">{foodReportsError}</p>
                  <button
                    onClick={() => fetchFoodReports(reportsPagination.currentPage, reportFilter)}
                    className="retry-button"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="premium-reports-grid">
                  {foodReports.length > 0 ? (
                    foodReports.map((report) => (
                      <div
                        key={report.id}
                        className={`premium-report-card ${report.status === 'PENDING' ? 'pending' :
                          report.status === 'ESCALATED' ? 'escalated' : ''}`}
                      >
                        <div className="premium-report-header">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                              {report.foodName}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Report #{report.id}
                            </p>
                          </div>
                          <span className={`premium-status-badge ${report.status}`}>
                            <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
                            {report.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="premium-report-content">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Category:</span>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {report.reportCategory}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Reporter:</span>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
                                {report.reporterEmail}
                              </span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                <span className="font-medium">Reason:</span> {report.reportReason}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(report.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(report.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="premium-report-actions">
                          <div className="premium-action-buttons">
                            <button
                              onClick={() => handleViewReport(report)}
                              className="premium-action-btn view"
                              title="View Details"
                            >
                              <Eye className="h-5 w-5" />
                            </button>

                            {report.status === 'PENDING' && (
                              <button
                                onClick={() => handleUpdateReportStatus(report.id, 'UNDER_REVIEW')}
                                className="premium-action-btn status"
                                title="Start Review"
                              >
                                <Clock className="h-5 w-5" />
                              </button>
                            )}

                            {(report.status === 'PENDING' || report.status === 'UNDER_REVIEW') && (
                              <button
                                onClick={() => handleUpdateReportStatus(report.id, 'RESOLVED')}
                                className="premium-action-btn status"
                                title="Mark Resolved"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              className="premium-action-btn delete"
                              title="Delete Report"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full empty-state">
                      <FileText className="empty-state-icon mx-auto mb-4" />
                      <h3 className="empty-state-title">No Reports Found</h3>
                      <p className="empty-state-description">
                        {reportFilter !== 'all'
                          ? `No ${reportFilter.replace('_', ' ')} reports found.`
                          : "No food reports have been submitted yet."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Premium Pagination */}
              {reportsPagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <button
                    onClick={() => fetchFoodReports(reportsPagination.currentPage - 1, reportFilter)}
                    disabled={reportsPagination.currentPage === 0}
                    className="premium-filter-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Page {reportsPagination.currentPage + 1} of {reportsPagination.totalPages}
                    </span>
                  </div>
                  <button
                    onClick={() => fetchFoodReports(reportsPagination.currentPage + 1, reportFilter)}
                    disabled={reportsPagination.currentPage >= reportsPagination.totalPages - 1}
                    className="premium-filter-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
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
      {MerchantFeeModal()}
      {MessageReplyModal()}
      {UserEmailModal()}

      <ViewMerchantDetailsModal
        isOpen={showViewMerchantModal}
        onClose={() => setShowViewMerchantModal(false)}
        merchant={selectedMerchant}
      />

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