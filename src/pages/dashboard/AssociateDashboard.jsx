import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  alpha,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Skeleton
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import axios from 'axios';
import axiosInstance from '../../axiosInstance';

const AssociateDashboard = () => {
  const theme = useTheme();
  const [showWelcome, setShowWelcome] = useState(false);

  // Data states
  const [associateProfile, setAssociateProfile] = useState(null);
  const [teamStructure, setTeamStructure] = useState({});
  const [downlineAssociates, setDownlineAssociates] = useState([]);
  const [downlineCustomers, setDownlineCustomers] = useState([]);
  const [upperlineAssociates, setUpperlineAssociates] = useState([]);
  const [plotBookings, setPlotBookings] = useState([]);
  const [customers, setCustomers] = useState([]);

  // UI states
  const [loadingStates, setLoadingStates] = useState({
    profile: true,
    teamStructure: true,
    downline: true,
    upline: true,
    bookings: true,
    customers: true
  });
  const [errorStates, setErrorStates] = useState({
    profile: null,
    teamStructure: null,
    downline: null,
    upline: null,
    bookings: null,
    customers: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Derived stats
  const [dashboardStats, setDashboardStats] = useState({
    totalPlots: 0,
    bookedPlots: 0,
    availablePlots: 0,
    onHoldPlots: 0,
    totalAssociates: 0,
    totalCustomers: 0,
    totalCommission: 0
  });

  // Animation effect
  useEffect(() => {
    setShowWelcome(true);
  }, []);

  // Get associate code from local storage
  const getAssociateCode = () => {
    return localStorage.getItem('associateCode') || sessionStorage.getItem('associateCode') || 'MAMO3316'; // Fallback for testing
  };

  // Fetch team structure
  const fetchTeamStructure = async () => {
    setLoadingState('teamStructure', true);
    try {
      const associateCode = getAssociateCode();
      const response = await axiosInstance.get(
        `/realEstate/associate/getAll-Tree-associate-byAssociateCode?associateCode=${associateCode}`
      );

      if (response.data && response.data.status === 200) {
        setTeamStructure(response.data.data);
        updateStats('totalAssociates', countTeamMembers(response.data.data));
      } else {
        // Handle different status codes
        if (response.data?.status === 404) {
          setTeamStructure({});  // Set empty data
          updateStats('totalAssociates', 0);
          showSnackbar('No team data found in database', 'info');
        } else {
          const message = response.data?.message || 'Failed to fetch team structure';
          throw new Error(message);
        }
      }
    } catch (error) {
      console.error('Error fetching team structure:', error);
      setErrorState('teamStructure', error.message || 'Failed to fetch team structure');
      showSnackbar(error.message || 'Failed to fetch team structure', 'error');
    } finally {
      setLoadingState('teamStructure', false);
    }
  };



  // Fetch downline associates and customers
  const fetchDownlineAssociates = async () => {
    setLoadingState('downline', true);
    try {
      const associateCode = getAssociateCode();
      const response = await axiosInstance.get(
        `/realEstate/associate/getAll-downLine-associate-byAssociateCode?associateCode=${associateCode}`
      );

      if (response.data && response.data.status === 200) {
        const { Associate = [], Customer = [] } = response.data.data;
        setDownlineAssociates(Associate);
        setDownlineCustomers(Customer);
        updateStats('totalCustomers', Customer.length);
      } else {
        // Handle different status codes
        if (response.data?.status === 404) {
          setDownlineAssociates([]);
          setDownlineCustomers([]);
          updateStats('totalCustomers', 0);
          showSnackbar('No downline data found in database', 'info');
        } else {
          const message = response.data?.message || 'Failed to fetch downline associates';
          throw new Error(message);
        }
      }
    } catch (error) {
      console.error('Error fetching downline associates:', error);
      setErrorState('downline', error.message || 'Failed to fetch downline associates');
      showSnackbar(error.message || 'Failed to fetch downline associates', 'error');
    } finally {
      setLoadingState('downline', false);
    }
  };

  // Fetch upline associates
  const fetchUpperlineAssociates = async () => {
    setLoadingState('upline', true);
    try {
      const associateCode = getAssociateCode();
      const response = await axiosInstance.get(
        `/realEstate/associate/getAll-UpparLine-associate-byAssociateCode?associateCode=${associateCode}`
      );

      if (response.data && response.data.status === 200) {
        setUpperlineAssociates(Object.values(response.data.data));
      } else {
        throw new Error('Failed to fetch upline associates');
      }
    } catch (error) {
      console.error('Error fetching upline associates:', error);
      setErrorState('upline', error.message || 'Failed to fetch upline associates');
    } finally {
      setLoadingState('upline', false);
    }
  };

  // Fetch plot bookings
  const fetchPlotBookings = async () => {
    setLoadingState('bookings', true);
    try {
      const response = await axiosInstance.get(
        '/realEstate/plot-booking/getAllSellingOfPlots'
      );

      if (response.data && Array.isArray(response.data.data)) {
        const bookings = response.data.data;
        setPlotBookings(bookings);

        // Calculate booking statistics
        updateStats('totalPlots', bookings.length);
        updateStats('bookedPlots', bookings.filter(b => b.dueAmount === 0).length);
        updateStats('onHoldPlots', bookings.filter(b => b.dueAmount > 0).length);
        updateStats('availablePlots', bookings.length - bookings.filter(b => b.dueAmount === 0).length - bookings.filter(b => b.dueAmount > 0).length);
      } else {
        throw new Error('Failed to fetch plot bookings');
      }
    } catch (error) {
      console.error('Error fetching plot bookings:', error);
      setErrorState('bookings', error.message || 'Failed to fetch plot bookings');
    } finally {
      setLoadingState('bookings', false);
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    setLoadingState('customers', true);
    try {
      const associateCode = getAssociateCode();
      const response = await axiosInstance.get(
        `/realEstate/addNew-customer/getAllCustomerbyAssociateCode?associateCode=${associateCode}`
      );

      if (response.data && response.data.status === 200) {
        setCustomers(response.data.data);
      } else {
        // Handle different status codes
        if (response.data?.status === 404) {
          setCustomers([]);
          // Show a user-friendly message
          setErrorState('customers', 'No customers found');
        } else {
          const message = response.data?.message || 'Failed to fetch customers';
          throw new Error(message);
        }
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setErrorState('customers', 'No customers found');
    } finally {
      setLoadingState('customers', false);
    }
  };

  // Helper functions
  const setLoadingState = (key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  const setErrorState = (key, value) => {
    setErrorStates(prev => ({ ...prev, [key]: value }));
  };

  const updateStats = (key, value) => {
    setDashboardStats(prev => ({ ...prev, [key]: value }));
  };

  const countTeamMembers = (team) => {
    if (!team) return 0;
    let count = 1; // Count the current associate
    if (team.children && Array.isArray(team.children)) {
      team.children.forEach(child => {
        count += countTeamMembers(child);
      });
    }
    return count;
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Fetch all required data on component mount
  useEffect(() => {
    fetchTeamStructure();
    fetchDownlineAssociates();
    fetchUpperlineAssociates();
    fetchPlotBookings();
    fetchCustomers();
  }, []);

  // Check if all data is loaded
  const isLoading = Object.values(loadingStates).some(state => state);

  // Check if any errors occurred
  const hasErrors = Object.values(errorStates).some(state => state !== null);

  // Prepare data for charts
  const pieChartData = [
    { name: 'Booked', value: dashboardStats.bookedPlots, color: '#4527A0' },
    { name: 'Available', value: dashboardStats.availablePlots, color: '#4CAF50' },
    { name: 'On Hold', value: dashboardStats.onHoldPlots, color: '#FF9800' }
  ];

  // Generate monthly bookings data from actual bookings
  const prepareMonthlyBookingsData = () => {
    if (!plotBookings.length) return { monthlyData: [], customerBookings: {} };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    // Initialize data for all months
    const monthlyData = monthNames.map(month => ({
      month,
      bookings: 0,
      amount: 0
    }));

    // Aggregate bookings by month and customer
    const customerBookings = {};
    plotBookings.forEach(booking => {
      const bookingDate = new Date(booking.bookingDate);
      if (bookingDate.getFullYear() === currentYear) {
        const monthIndex = bookingDate.getMonth();
        monthlyData[monthIndex].bookings += 1;
        monthlyData[monthIndex].amount += booking.finalPaybleAmount;

        // Track customer-wise bookings
        const customerId = booking.customerId;
        if (!customerBookings[customerId]) {
          customerBookings[customerId] = 0;
        }
        customerBookings[customerId]++;
      }
    });

    return { monthlyData, customerBookings };
  };

  const { monthlyData, customerBookings } = prepareMonthlyBookingsData();

  // Prepare data for team performance chart
  const prepareTeamPerformanceData = () => {
    if (!downlineAssociates.length) return [];

    return downlineAssociates.map(associate => {
      const associateBookings = plotBookings.filter(booking =>
        booking.associateCode === associate.associateCode
      );

      return {
        name: associate.name,
        plots: associateBookings.length
      };
    });
  };

  const teamPerformanceData = prepareTeamPerformanceData();

  const statsCategories = {
    overview: [
      {
        icon: <PeopleIcon />,
        title: "TOTAL ASSOCIATES",
        value: dashboardStats.totalAssociates || 0,
        color: "#4527A0",
        change: "+20%",
        isPositive: true
      },
      {
        icon: <HomeIcon />,
        title: "TOTAL PLOTS",
        value: dashboardStats.totalPlots || 0,
        color: "#FF9800",
        change: "+8%",
        isPositive: true
      },
      {
        icon: <SupervisorAccountIcon />,
        title: "TOTAL CUSTOMERS",
        value: dashboardStats.totalCustomers || 0,
        color: "#2196F3",
        change: "+15%",
        isPositive: true
      }
    ],

    plotStatus: [
      {
        icon: <CheckCircleIcon />,
        title: "BOOKED PLOTS",
        value: dashboardStats.bookedPlots || 0,
        color: "#4CAF50",
        change: "+15%",
        isPositive: true
      },
      {
        icon: <HourglassEmptyIcon />,
        title: "ON HOLD",
        value: dashboardStats.onHoldPlots || 0,
        color: "#FF9800",
        change: "-2",
        isPositive: false
      },
      {
        icon: <HomeIcon />,
        title: "AVAILABLE",
        value: dashboardStats.availablePlots || 0,
        color: "#2196F3",
        change: "-10",
        isPositive: false
      }
    ]
  };

  const quickActions = [
    {
      icon: <PersonAddIcon />,
      label: "Add New Customer",
      primary: true,
      change: "+15%",
      isPositive: true
    },
    {
      icon: <EventIcon />,
      label: "Schedule Meeting",
      primary: false,
      change: "+8%",
      isPositive: true
    },
    {
      icon: <PaymentIcon />,
      label: "View Commission",
      primary: false,
      change: "+12%",
      isPositive: true,
    },
    {
      icon: <AssessmentIcon />,
      label: "My Reports",
      primary: false,
      change: "+5%",
      isPositive: true
    }
  ];

  const recentActivities = [
    {
      icon: <PeopleIcon />,
      title: "New customer added",
      time: "10 minutes ago",
      change: "+1",
      isPositive: true
    },
    {
      icon: <CheckCircleIcon />,
      title: "Plot booking completed",
      time: "2 hours ago",
      change: "₹35K",
      isPositive: true
    },
    {
      icon: <CurrencyRupeeIcon />,
      title: "Commission received",
      time: "Yesterday",
      change: "₹15K",
      isPositive: true
    },
    {
      icon: <HomeIcon />,
      title: "New plot allocation",
      time: "2 days ago",
      change: "+4",
      isPositive: true
    }
  ];

  // Component for stat cards
  const StatCard = ({ icon, title, value, color, change, isPositive }) => (
    <Card sx={{
      height: '100%',
      boxShadow: 3,
      borderRadius: 3,
      transition: 'transform 0.3s',
      '&:hover': { transform: 'translateY(-5px)' }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 48, height: 48, boxShadow: 1 }}>
            {icon}
          </Avatar>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0.5 }}>
              {value}
            </Typography>
            {change && (
              <Typography
                variant="caption"
                sx={{
                  bgcolor: isPositive ? alpha('#4CAF50', 0.2) : alpha('#F44336', 0.2),
                  color: isPositive ? '#2E7D32' : '#C62828',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  display: 'inline-block',
                  mt: 1,
                  fontWeight: 'bold'
                }}
              >
                {isPositive && !change.startsWith('-') && !change.startsWith('0') ? '+' : ''}{change}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Loading indicator for charts
  const ChartSkeleton = () => (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );

  // Error indicator for charts
  const ChartError = ({ message }) => (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'error.main'
    }}>
      <ErrorOutlineIcon sx={{ fontSize: 40, mb: 2 }} />
      <Typography variant="body2">{message || 'Error loading chart data'}</Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8F9FD' }}>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #4527A0 0%, #19376D 100%)',
          borderRadius: '0 0 16px 16px',
          boxShadow: 3
        }}
      >
        <Toolbar sx={{ py: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 'bold',
                transform: showWelcome ? 'translateY(0)' : 'translateY(10px)',
                opacity: showWelcome ? 1 : 0,
                transition: 'transform 0.7s ease, opacity 0.7s ease'
              }}
            >
              Associate Dashboard
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                mt: 1,
                transform: showWelcome ? 'translateY(0)' : 'translateY(10px)',
                opacity: showWelcome ? 1 : 0,
                transition: 'transform 0.7s ease 0.3s, opacity 0.7s ease 0.3s'
              }}
            >
              Welcome, {teamStructure.fullName || 'Associate'} | Associate Code: {getAssociateCode()}
            </Typography>
          </Box>
          <IconButton
            sx={{
              bgcolor: 'white',
              color: '#4527A0',
              mr: 2,
              '&:hover': { bgcolor: '#F5F5F5' },
              boxShadow: 2
            }}
          >
            <AccountBalanceWalletIcon />
          </IconButton>
          {/* <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#1A1A1A',
              '&:hover': { bgcolor: '#2A2A2A' },
              px: 3,
              py: 1.2,
              borderRadius: 2
            }}
          >
            Add Customer
          </Button> */}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        {/* Show loading indicator if data is still loading */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Show error message if any API failed */}
        {hasErrors && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
            bgcolor: '#f5f5f5',
            borderRadius: 1,
            minHeight: 50
          }}>
            <Typography variant="h6" color="text.secondary" align="center">
              {errorStates.customers || 'No customers found'}
            </Typography>
          </Box>
        )}

        {/* Dashboard content */}
        {(!isLoading || Object.values(loadingStates).some(state => !state)) && (
          <>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
              Team Overview
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {statsCategories.overview.map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <StatCard {...stat} />
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
              Plot Status
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {statsCategories.plotStatus.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StatCard {...stat} />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Pie chart for plot status */}
              <Grid item xs={12} md={4}>
                <Paper sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)' },
                  height: '100%',
                  minHeight: 400
                }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Plot Status Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    {loadingStates.bookings ? (
                      <ChartSkeleton />
                    ) : errorStates.bookings ? (
                      <ChartError message={errorStates.bookings} />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} Plots`, 'Count']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Line chart for monthly bookings */}
              <Grid item xs={12} md={8}>
                <Paper sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)' },
                  height: '100%',
                  minHeight: 400
                }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Monthly Bookings & Revenue
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    {loadingStates.bookings ? (
                      <ChartSkeleton />
                    ) : errorStates.bookings ? (
                      <ChartError message={errorStates.bookings} />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" tick={{ fill: '#666' }} />
                          <YAxis yAxisId="left" orientation="left" tick={{ fill: '#666' }} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#666' }} />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="bookings" name="Bookings" fill="#4527A0" radius={[4, 4, 0, 0]} />
                          <Bar yAxisId="right" dataKey="amount" name="Amount (₹)" fill="#FF9800" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Team performance chart */}
              <Grid item xs={12} md={6}>
                <Paper sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)' },
                  height: '100%',
                  minHeight: 400
                }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Team Performance
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    {loadingStates.downline ? (
                      <ChartSkeleton />
                    ) : errorStates.downline ? (
                      <ChartError message={errorStates.downline} />
                    ) : teamPerformanceData.length === 0 ? (
                      <Box sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                      }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>No Team Members Yet</Typography>
                        <Button
                          variant="contained"
                          startIcon={<PersonAddIcon />}
                          sx={{ bgcolor: '#4527A0', '&:hover': { bgcolor: '#3A1C90' } }}
                        >
                          Add Team Member
                        </Button>
                      </Box>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={teamPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" tick={{ fill: '#666' }} />
                          <YAxis tick={{ fill: '#666' }} />
                          <Tooltip formatter={(value) => [`₹${value}K`, 'Commission']} />
                          <Legend />
                          <Bar
                            dataKey="plots"
                            name="Plots"
                            fill="#4527A0"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)' },
                  height: '100%'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    My Team Structure
                  </Typography>
                  {loadingStates.teamStructure ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : errorStates.teamStructure ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errorStates.teamStructure}
                    </Alert>
                  ) : !teamStructure || !teamStructure.children || teamStructure.children.length === 0 ? (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 4
                    }}>
                      <AccountTreeIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No team members yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Start building your team by adding associates under your referral code.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        sx={{ bgcolor: '#4527A0', '&:hover': { bgcolor: '#3A1C90' } }}
                      >
                        Add Team Member
                      </Button>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Associate Code</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Level</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Customers</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 500 }}>{teamStructure.fullName}</TableCell>
                            <TableCell>{teamStructure.associateCode}</TableCell>
                            <TableCell>
                              <Chip label="You" color="primary" size="small" />
                            </TableCell>
                            <TableCell>{dashboardStats.totalCustomers || '0'}</TableCell>
                          </TableRow>
                          {teamStructure.children && teamStructure.children.map((child, index) => (
                            <TableRow key={index} hover>
                              <TableCell sx={{ fontWeight: 500 }}>{child.fullName}</TableCell>
                              <TableCell>{child.associateCode}</TableCell>
                              <TableCell>
                                <Chip label="Level 1" color="secondary" size="small" />
                              </TableCell>
                              <TableCell>
                                {/* Mock data for customers - in a real app, you'd fetch this */}
                                {Math.floor(Math.random() * 5)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Paper>
              </Grid>

              {/* Quick actions */}
              
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Recent activities */}
              {/* <Grid item xs={12} md={5}>
      <Paper sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: 2,
        transition: 'transform 0.3s',
        '&:hover': { transform: 'translateY(-5px)' },
        height: '100%'
      }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Recent Activities
        </Typography>
        <List>
          {recentActivities.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ py: 1.5 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: alpha('#4527A0', 0.1), color: '#4527A0' }}>
                    {activity.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.title}
                  secondary={activity.time}
                  sx={{ '& .MuiListItemText-primary': { fontWeight: 500 } }}
                />
                <Typography
                  sx={{
                    bgcolor: activity.isPositive ? alpha('#4CAF50', 0.2) : alpha('#F44336', 0.2),
                    color: activity.isPositive ? '#2E7D32' : '#C62828',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    display: 'inline-block',
                    fontWeight: 'bold'
                  }}
                >
                  {activity.change}
                </Typography>
              </ListItem>
              {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Grid> */}

              {/* Team structure */}
              
            </Grid>

            {/* Customer section */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
              My Customers
            </Typography>
            <Paper sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 2,
              mb: 4
            }}>
              {loadingStates.customers ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : errorStates.customers ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorStates.customers}
                </Alert>
              ) : customers.length === 0 ? (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8
                }}>
                  <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No customers yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    Start adding customers to grow your business.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    sx={{ bgcolor: '#4527A0', '&:hover': { bgcolor: '#3A1C90' } }}
                  >
                    Add New Customer
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Plots Booked</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customers.slice(0, 5).map((customer, index) => (
                        <TableRow key={index} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{customer.customerName}</TableCell>
                          <TableCell>{customer.mobile}</TableCell>
                          <TableCell>{customer.emailId}</TableCell>
                          <TableCell>{customer.city}</TableCell>
                          <TableCell>
                            {/* In a real app, you'd compute this from plot bookings */}
                            {Math.floor(Math.random() * 3) + 1}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label="Active"
                              size="small"
                              color="success"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {customers.length > 5 && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Button color="primary">View All Customers</Button>
                    </Box>
                  )}
                </TableContainer>
              )}
            </Paper>
          </>
        )}
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssociateDashboard;