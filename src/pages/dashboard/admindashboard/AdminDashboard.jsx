// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   AppBar,
//   Toolbar,
//   Button,
//   Card,
//   CardContent,
//   IconButton,
//   Avatar,
//   Container,
//   Paper,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Divider,
//   useTheme,
//   alpha
// } from '@mui/material';
// import ApartmentIcon from '@mui/icons-material/Apartment';
// import HomeIcon from '@mui/icons-material/Home';
// import PeopleIcon from '@mui/icons-material/People';
// import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
// import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
// import BookmarkIcon from '@mui/icons-material/Bookmark';
// import ReceiptIcon from '@mui/icons-material/Receipt';
// import AddIcon from '@mui/icons-material/Add';
// import EventIcon from '@mui/icons-material/Event';
// import PaymentIcon from '@mui/icons-material/Payment';
// import AssessmentIcon from '@mui/icons-material/Assessment';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
// import {
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   ComposedChart
// } from 'recharts';
// import axiosInstance from '../../../axiosInstance';

// const RealEstateDashboard = () => {
//   const theme = useTheme();
//   const [showWelcome, setShowWelcome] = useState(false);

//   useEffect(() => {
//     setShowWelcome(true);
//   }, []);

//   const [Plot, setPlot] = useState([])
//   const getallPlot = async () => {
//     try {
//       const Plot = await axiosInstance.get(`/realEstate/plotDetail/getTotalPlots`)
//       setPlot(Plot.data.data)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const [Projects, setProjects] = useState([])

//   const getallProjects = async () => {
//     try {
//       const Project = await axiosInstance.get(`/realEstate/project/getTotalProjects`)
//       setProjects(Project.data.data)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const [Customer, setCustomer] = useState([])

//   const getallCustomer = async () => {
//     try {
//       const customer = await axiosInstance.get(`/realEstate/addNew-customer/getTotalCustomer`)
//       setCustomer(customer.data.data)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const [bookedPlot, setBookedPlot] = useState([])

//   const getallbooked = async () => {
//     try {
//       const booked = await axiosInstance.get(`/realEstate/plotDetail/totalBookedPlots`)
//       setBookedPlot(booked.data.data)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const [holdplot, setHoldPlot] = useState([])

//   const getallHoldPlot = async () => {
//     try {
//       const hold = await axiosInstance.get(`/realEstate/plotDetail/totalHoldPlots`)
//       setHoldPlot(hold.data.data)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const [AvailablePlot, setAvailablePlot] = useState([])

//   const getallavailableplot = async () => {
//     try {
//       const available = await axiosInstance.get(`/realEstate/plotDetail/totalAvilablePlots`)
//       setAvailablePlot(available.data.data)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const [registerPlot, setRegisterPlot] = useState([])

//   const getallregisterplot = async () => {
//     try {
//       const register = await axiosInstance.get(`/realEstate/plot-registry/totalRegisterPlot`)
//       setRegisterPlot(register.data.data)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const [associates, setAssociates] = useState([])

//   const getAllAssociates = async () => {
//     try {
//       const Associate = await axiosInstance.get(`/realEstate/associate/totalAssociate?param=${localStorage.getItem('associatecode')}`)
//       setAssociates(Associate.data.data)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const [recentActivitiess, setRecentActivities] = useState([]);


//   useEffect(() => {
//     axiosInstance.get('/realEstate/plot-booking/getPlotSellingsFromLastMonth')
//       .then(response => {
//         const apiData = response.data?.data || [];
//         setRecentActivities(response.data?.data);
//       })
//       .catch(error => {
//         console.error("Error fetching recent activities:", error);
//       });
//   }, []);

//   const [assignedData, setAssignedData] = useState([]);


//   useEffect(() => {
//     axiosInstance.get('/realEstate/assignEnquiry/getAllAssignEnquiry')
//       .then(response => {
//         const apiData = response.data?.data || [];
//         setAssignedData(response.data?.data);
//       })
//       .catch(error => {
//         console.error("Error fetching recent activities:", error);
//       });
//   }, [])

//   const [fullPayments, setFullPayments] = useState([]);

//   const getFullPayments = async () => {
//     try {
//       const response = await axiosInstance.get('/realEstate/fullPayment/all');
//       setFullPayments(response.data.data);
//     } catch (error) {
//       console.error("Error fetching full payments:", error);
//     }
//   };

//   const [emiPayments, setEmiPayments] = useState([]);

//   const getEmiPayments = async () => {
//     try {
//       const response = await axiosInstance.get('/realEstate/emiPayments/getAll');
//       setEmiPayments(response.data.data);
//     } catch (error) {
//       console.error("Error fetching EMI payments:", error);
//     }
//   };

//   // Add new state variables
//   const [salesData, setSalesData] = useState([]);
//   const [developmentCharges, setDevelopmentCharges] = useState([]);
//   const [currentMonthEmi, setCurrentMonthEmi] = useState([]);
//   const [pendingEmi, setPendingEmi] = useState([]);
//   const [enquiryData, setEnquiryData] = useState([]);
//   const [plotSalesData, setPlotSalesData] = useState([]);

//   // Add new API calls
//   const getSalesData = async () => {
//     try {
//       const response = await axiosInstance.get('/realEstate/plot-booking/getAllSellingOfPlots');
//       setSalesData(response.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getDevelopmentCharges = async () => {
//     try {
//       const response = await axiosInstance.get('/realEstate/developmentRate/getAll');
//       setDevelopmentCharges(response.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getCurrentMonthEmi = async () => {
//     try {
//       const response = await axiosInstance.get('/realEstate/emiPayments/getCurrentMonthEMI');
//       setCurrentMonthEmi(response.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getPendingEmi = async () => {
//     try {
//       const response = await axiosInstance.get('/realEstate/emi/currentMonthPendingEMI');
//       setPendingEmi(response.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getEnquiryData = async () => {
//     try {
//       const response = await axiosInstance.get('/realEstate/enquiry/getAllEnquiry');
//       setEnquiryData(response.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getPlotSalesData = async () => {
//     try {
//       const response = await axiosInstance.get('/realEstate/plot-booking/getPlotSellingsFromLastMonth');
//       setPlotSalesData(response.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     getallPlot()
//     getallProjects()
//     getallCustomer()
//     getallbooked()
//     getallHoldPlot()
//     getallavailableplot()
//     getallregisterplot()
//     getAllAssociates()
//     getFullPayments()
//     getEmiPayments()
//     getSalesData()
//     getDevelopmentCharges()
//     getCurrentMonthEmi()
//     getPendingEmi()
//     getEnquiryData()
//     getPlotSalesData()
//   }, [])

//   const allCards = {
//     topRowCards: [
//       {
//         icon: <HomeIcon />,
//         title: "TOTAL PROJECT",
//         value: Projects,
//         color: theme.palette.primary.dark,
//         change: "+12%",
//         isPositive: true,
//         subtext: "1,2,3"
//       },
//       {
//         icon: <PeopleIcon />,
//         title: "TOTAL PLOT",
//         value: Plot,
//         color: theme.palette.primary.dark,
//         change: "+5%",
//         isPositive: true,
//         subtext: "35,40,45"
//       },
//       {
//         icon: <EmojiEventsIcon />,
//         title: "TOTAL CUSTOMER",
//         value: Customer,
//         color: theme.palette.primary.dark,
//         change: "+3%",
//         isPositive: true,
//         subtext: "6,8,9"
//       },
//       {
//         icon: <AutoAwesomeIcon />,
//         title: "TOTAL ASSOCIATE",
//         value: associates,
//         color: theme.palette.primary.dark,
//         change: "0%",
//         isPositive: true,
//         subtext: "3,5,5"
//       },
//     ],

//     middleRowCards: [
//       {
//         icon: <CheckCircleIcon />,
//         title: "BOOKED PLOT",
//         value: bookedPlot,
//         color: theme.palette.success.dark,
//         change: "+3",
//         isPositive: true,
//         subtext: "6,7,9"
//       },
//       {
//         icon: <HourglassEmptyIcon />,
//         title: "HOLD PLOT",
//         value: holdplot,
//         color: theme.palette.warning.dark,
//         change: "-2",
//         isPositive: false,
//         subtext: "3,2,1"
//       },
//       {
//         icon: <HomeIcon />,
//         title: "AVAILABLE PLOT",
//         value: AvailablePlot,
//         color: theme.palette.info.dark,
//         change: "+5",
//         isPositive: true,
//         subtext: "30,32,35"
//       },
//       {
//         icon: <ReceiptIcon />,
//         title: "REGISTERED PLOT",
//         value: registerPlot,
//         color: theme.palette.secondary.dark,
//         change: "0",
//         isPositive: true,
//         subtext: "0,0,0"
//       },
//     ],

//     bottomRowCards: [
//       {
//         icon: <CurrencyRupeeIcon />,
//         title: "PAYMENT COLLECTION",
//         value: "6,852,335.00",
//         color: theme.palette.success.dark,
//         change: "+15.3%",
//         isPositive: true,
//         subtext: "4.2M,5.6M,6.8M"
//       },
//       {
//         icon: <CurrencyRupeeIcon />,
//         title: "PENDING PAYMENT",
//         value: "866,667.00",
//         color: theme.palette.warning.dark,
//         change: "-3.2%",
//         isPositive: false,
//         subtext: "900K,885K,866K"
//       },
//       {
//         icon: <CurrencyRupeeIcon />,
//         title: "CONFIRMED PAYMENT",
//         value: "5,985,668.00",
//         color: theme.palette.primary.dark,
//         change: "+18.7%",
//         isPositive: true,
//         subtext: "3.8M,5.0M,6.0M"
//       },
//     ]
//   };

//   const recentActivities = [
//     {
//       icon: <HomeIcon />,
//       title: "New property listing created",
//       time: "10 minutes ago",
//       change: "+5.1%",
//       isPositive: true,
//       subtext: "4,5,8,6,9,10"
//     },
//     {
//       icon: <PeopleIcon />,
//       title: "Client meeting scheduled",
//       time: "2 hours ago",
//       change: "+3.2%",
//       isPositive: true,
//       subtext: "2,3,7,4,5,9"
//     },
//     {
//       icon: <CurrencyRupeeIcon />,
//       title: "Payment received",
//       time: "Yesterday",
//       change: "-1.8%",
//       isPositive: false,
//       subtext: "1,2,4,5,3"
//     },
//     {
//       icon: <ReceiptIcon />,
//       title: "Lease agreement signed",
//       time: "2 days ago",
//       change: "+7.5%",
//       isPositive: true,
//       subtext: "3,6,7,9,10"
//     }
//   ];

//   const quickActions = [
//     {
//       icon: <AddIcon />,
//       label: "Add New Property",
//       primary: true,
//       change: "+0.5%",
//       isPositive: true
//     },
//     {
//       icon: <EventIcon />,
//       label: "Schedule Meeting",
//       primary: false,
//       change: "+2.3%",
//       isPositive: true
//     },
//     {
//       icon: <PaymentIcon />,
//       label: "Record Payment",
//       primary: false,
//       change: "-0.7%",
//       isPositive: false,
//     },
//     {
//       icon: <AssessmentIcon />,
//       label: "Generate Reports",
//       primary: false,
//       change: "+4.0%",
//       isPositive: true
//     }
//   ];

//   const pieChartData = [
//     { name: 'Booked', value: 9, color: '#4527A0' },
//     { name: 'Hold', value: 1, color: '#FF9800' },
//     { name: 'Available', value: 35, color: '#4CAF50' },
//     { name: 'Registered', value: 0, color: '#2196F3' }
//   ];

//   const lineChartData = [
//     { name: 'Jan', revenue: 4500000, transactions: 15 },
//     { name: 'Feb', revenue: 5200000, transactions: 18 },
//     { name: 'Mar', revenue: 4900000, transactions: 16 },
//     { name: 'Apr', revenue: 6100000, transactions: 22 },
//     { name: 'May', revenue: 5800000, transactions: 20 },
//     { name: 'Jun', revenue: 6400000, transactions: 24 },
//     { name: 'Jul', revenue: 6800000, transactions: 26 },
//     { name: 'Aug', revenue: 7200000, transactions: 28 },
//   ];

//   const StatCard = ({ icon, title, value, color, change, isPositive, subtext, showCurrency = false }) => (
//     <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//           <Avatar sx={{ bgcolor: color, width: 48, height: 48, boxShadow: 2 }}>
//             {icon}
//           </Avatar>
//           <Box sx={{ textAlign: 'right' }}>
//             <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
//               {title}
//             </Typography>
//             <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0.5 }}>
//               {showCurrency ? `₹${value}` : value}
//             </Typography>
//             {change && (
//               <Typography
//                 variant="caption"
//                 sx={{
//                   bgcolor: isPositive ? alpha('#4CAF50', 0.2) : alpha('#F44336', 0.2),
//                   color: isPositive ? '#2E7D32' : '#C62828',
//                   px: 1.5,
//                   py: 0.5,
//                   borderRadius: 2,
//                   display: 'inline-block',
//                   mt: 1,
//                   fontWeight: 'bold'
//                 }}
//               >
//                 {isPositive && !change.startsWith('-') && !change.startsWith('0') ? '+' : ''}{change}
//               </Typography>
//             )}
//             {subtext && (
//               <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
//                 Trend: {subtext}
//               </Typography>
//             )}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   // Process payment data for the chart
//   const processPaymentData = () => {
//     const paymentData = fullPayments.reduce((acc, payment) => {
//       const date = new Date(payment.date);
//       const month = date.toLocaleString('default', { month: 'short' });

//       if (!acc[month]) {
//         acc[month] = {
//           name: month,
//           totalAmount: 0,
//           cashAmount: 0,
//           chequeAmount: 0,
//           pendingChequeAmount: 0
//         };
//       }

//       acc[month].totalAmount += payment.paidAmount;

//       if (payment.payMode === 'Cash') {
//         acc[month].cashAmount += payment.paidAmount;
//       } else if (payment.payMode === 'Cheque') {
//         if (payment.chequeStatus) {
//           acc[month].chequeAmount += payment.paidAmount;
//         } else {
//           acc[month].pendingChequeAmount += payment.paidAmount;
//         }
//       }

//       return acc;
//     }, {});

//     return Object.values(paymentData);
//   };

//   // Process EMI payment data for the chart
//   const processEmiPaymentData = () => {
//     const emiData = emiPayments.reduce((acc, payment) => {
//       const date = new Date(payment.date);
//       const month = date.toLocaleString('default', { month: 'short' });

//       if (!acc[month]) {
//         acc[month] = {
//           name: month,
//           totalEmiAmount: 0,
//           cashEmiAmount: 0,
//           chequeEmiAmount: 0,
//           pendingChequeEmiAmount: 0,
//           pendingEmiCount: 0
//         };
//       }

//       acc[month].totalEmiAmount += payment.paidAmount;
//       acc[month].pendingEmiCount += payment.pendingEmi;

//       if (payment.payMode === 'Cash') {
//         acc[month].cashEmiAmount += payment.paidAmount;
//       } else if (payment.payMode === 'Cheque') {
//         if (payment.chequeStatus) {
//           acc[month].chequeEmiAmount += payment.paidAmount;
//         } else {
//           acc[month].pendingChequeEmiAmount += payment.paidAmount;
//         }
//       }

//       return acc;
//     }, {});

//     return Object.values(emiData);
//   };

//   // Process sales data for visualization
//   const processSalesData = () => {
//     return salesData.reduce((acc, sale) => {
//       const date = new Date(sale.bookingDate);
//       const month = date.toLocaleString('default', { month: 'short' });

//       if (!acc[month]) {
//         acc[month] = {
//           name: month,
//           totalSales: 0,
//           fullPaymentSales: 0,
//           emiSales: 0
//         };
//       }

//       acc[month].totalSales++;
//       if (sale.planType === 'Full Payment') {
//         acc[month].fullPaymentSales++;
//       } else if (sale.planType === 'EMI Plan') {
//         acc[month].emiSales++;
//       }

//       return acc;
//     }, {});
//   };

//   // Add new data processing function for development charges
//   const processDevelopmentCharges = () => {
//     return developmentCharges.reduce((acc, charge) => {
//       const date = new Date(charge.date);
//       const month = date.toLocaleString('default', { month: 'short' });

//       if (!acc[month]) {
//         acc[month] = {
//           name: month,
//           developmentCharges: 0,
//           plotCount: 0
//         };
//       }

//       acc[month].developmentCharges += charge.developmentRatePerSqft;
//       acc[month].plotCount++;

//       return acc;
//     }, {});
//   };

//   // Add new data processing function for project-wise plots
//   const processProjectPlots = () => {
//     const projectData = {};

//     recentActivitiess.forEach(activity => {
//       if (!projectData[activity.projectName]) {
//         projectData[activity.projectName] = {
//           name: activity.projectName,
//           booked: 0,
//           available: 0,
//           hold: 0
//         };
//       }

//       if (activity.status === 'Booked') {
//         projectData[activity.projectName].booked++;
//       } else if (activity.status === 'Hold') {
//         projectData[activity.projectName].hold++;
//       } else {
//         projectData[activity.projectName].available++;
//       }
//     });

//     return Object.values(projectData);
//   };

//   // Add new data processing function for enquiry data
//   const processEnquiryData = () => {
//     const monthlyData = enquiryData.reduce((acc, enquiry) => {
//       const date = new Date(enquiry.enquiryDate);
//       const month = date.toLocaleString('default', { month: 'short' });

//       if (!acc[month]) {
//         acc[month] = {
//           name: month,
//           totalEnquiries: 0,
//           convertedEnquiries: 0,
//           pendingEnquiries: 0
//         };
//       }

//       acc[month].totalEnquiries++;
//       if (enquiry.status === 'Converted') {
//         acc[month].convertedEnquiries++;
//       } else {
//         acc[month].pendingEnquiries++;
//       }

//       return acc;
//     }, {});

//     return Object.values(monthlyData);
//   };

//   // Add new data processing function for plot sales by project
//   const processPlotSalesByProject = () => {
//     const projectData = plotSalesData.reduce((acc, sale) => {
//       if (!acc[sale.projectName]) {
//         acc[sale.projectName] = {
//           name: sale.projectName,
//           totalValue: 0,
//           count: 0,
//           averageValue: 0
//         };
//       }

//       acc[sale.projectName].totalValue += sale.totalPlotCost;
//       acc[sale.projectName].count++;
//       acc[sale.projectName].averageValue = acc[sale.projectName].totalValue / acc[sale.projectName].count;

//       return acc;
//     }, {});

//     return Object.values(projectData);
//   };

//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: '#F8F9FD' }}>
//       {/* Header */}
//       <AppBar
//         position="static"
//         sx={{
//           bgcolor: '#4527A0',
//           borderRadius: '0 0 16px 16px',
//           boxShadow: 3
//         }}
//       >
//         <Toolbar sx={{ py: 2 }}>
//           <Box sx={{ flexGrow: 1 }}>
//             <Typography
//               variant="h4"
//               component="h1"
//               sx={{
//                 fontWeight: 'bold',
//                 transform: showWelcome ? 'translateY(0)' : 'translateY(10px)',
//                 opacity: showWelcome ? 1 : 0,
//                 transition: 'transform 0.7s ease, opacity 0.7s ease'
//               }}
//             >
//               Welcome, to the portal
//             </Typography>
//             <Typography
//               variant="subtitle1"
//               sx={{
//                 mt: 1,
//                 transform: showWelcome ? 'translateY(0)' : 'translateY(10px)',
//                 opacity: showWelcome ? 1 : 0,
//                 transition: 'transform 0.7s ease 0.3s, opacity 0.7s ease 0.3s'
//               }}
//             >
//               Good to see you again. Here's what's new since your last visit            </Typography>
//           </Box>

//         </Toolbar>
//       </AppBar>

//       {/* Main Content */}
//       <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
//         {/* Main Stats */}
//         {/* <Grid container spacing={3} sx={{ mb: 4 }}>
//           {mainStats.map((stat, index) => (
//             <Grid item xs={12} sm={6} md={3} key={index}>
//               <Card sx={{ 
//                 height: '100%', 
//                 boxShadow: 2, 
//                 borderRadius: 3,
//                 transition: 'transform 0.3s', 
//                 '&:hover': { transform: 'translateY(-5px)' } 
//               }}>
//                 <CardContent>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//                     <IconButton
//                       sx={{
//                         bgcolor: '#4527A0',
//                         color: 'white',
//                         '&:hover': { bgcolor: '#5E35B1' },
//                         boxShadow: 1
//                       }}
//                     >
//                       {stat.icon}
//                     </IconButton>
//                     <Typography
//                       variant="caption"
//                       sx={{
//                         bgcolor: stat.isPositive ? alpha('#4CAF50', 0.2) : alpha('#F44336', 0.2),
//                         color: stat.isPositive ? '#2E7D32' : '#C62828',
//                         px: 1.5,
//                         py: 0.5,
//                         borderRadius: 2,
//                         fontWeight: 'bold'
//                       }}
//                     >
//                       {stat.change}
//                     </Typography>
//                   </Box>
//                   <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
//                     {stat.value}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 'medium' }}>
//                     {stat.label}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     Trend: {stat.subtext}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid> */}

//         {/* First Row Cards */}
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
//           Project Overview
//         </Typography>
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           {allCards.topRowCards.map((card, index) => (
//             <Grid item xs={12} sm={6} md={3} key={index}>
//               <StatCard {...card} />
//             </Grid>
//           ))}
//         </Grid>

//         {/* Middle Row Cards */}
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
//           Plot Status
//         </Typography>
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           {allCards.middleRowCards.map((card, index) => (
//             <Grid item xs={12} sm={6} md={3} key={index}>
//               <StatCard {...card} />
//             </Grid>
//           ))}
//         </Grid>

//         {/* Bottom Row Cards */}
//         {/* <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
//           Financial Overview
//         </Typography>
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           {allCards.bottomRowCards.map((card, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <StatCard {...card} showCurrency={true} />
//             </Grid>
//           ))}
//         </Grid> */}

//         {/* Payment Trends Chart */}
//         {/* <Grid item xs={12}>
//           <Paper sx={{ 
//             p: 3, 
//             borderRadius: 3, 
//             boxShadow: 2,
//             transition: 'transform 0.3s', 
//             '&:hover': { transform: 'translateY(-5px)' } 
//           }}>
//             <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
//               One Time Payment Trends
//             </Typography>
//             <ResponsiveContainer width="100%" height={400}>
//               <LineChart data={processPaymentData()}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="name" tick={{ fill: '#666' }} />
//                 <YAxis
//                   tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
//                   tick={{ fill: '#666' }}
//                 />
//                 <Tooltip
//                   formatter={(value) => [`₹${(value / 100000).toFixed(2)}L`, 'Amount']}
//                   labelStyle={{ color: '#333' }}
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="totalAmount"
//                   name="Total Payments"
//                   stroke="#4527A0"
//                   strokeWidth={2}
//                   dot={{ r: 5 }}
//                   activeDot={{ r: 8 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="cashAmount"
//                   name="Cash Payments"
//                   stroke="#4CAF50"
//                   strokeWidth={2}
//                   dot={{ r: 5 }}
//                   activeDot={{ r: 8 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="chequeAmount"
//                   name="Cleared Cheques"
//                   stroke="#2196F3"
//                   strokeWidth={2}
//                   dot={{ r: 5 }}
//                   activeDot={{ r: 8 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="pendingChequeAmount"
//                   name="Pending Cheques"
//                   stroke="#FF9800"
//                   strokeWidth={2}
//                   dot={{ r: 5 }}
//                   activeDot={{ r: 8 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </Paper>
//         </Grid> */}

//         {/* EMI Payment Trends Charts */}
//         <Grid container spacing={3} sx={{ mb: 4 }}>

//           <Grid item xs={12} md={6}>
//             <Paper sx={{
//               p: 3,
//               borderRadius: 3,
//               boxShadow: 2,
//               transition: 'transform 0.3s',
//               '&:hover': { transform: 'translateY(-5px)' }
//             }}>
//               <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
//                 One Time Payment Trends
//               </Typography>
//               <ResponsiveContainer width="100%" height={400}>
//                 <LineChart data={processPaymentData()}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" tick={{ fill: '#666' }} />
//                   <YAxis
//                     tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
//                     tick={{ fill: '#666' }}
//                   />
//                   <Tooltip
//                     formatter={(value) => [`₹${(value / 100000).toFixed(2)}L`, 'Amount']}
//                     labelStyle={{ color: '#333' }}
//                   />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="totalAmount"
//                     name="Total Payments"
//                     stroke="#4527A0"
//                     strokeWidth={2}
//                     dot={{ r: 5 }}
//                     activeDot={{ r: 8 }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="cashAmount"
//                     name="Cash Payments"
//                     stroke="#4CAF50"
//                     strokeWidth={2}
//                     dot={{ r: 5 }}
//                     activeDot={{ r: 8 }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="chequeAmount"
//                     name="Cleared Cheques"
//                     stroke="#2196F3"
//                     strokeWidth={2}
//                     dot={{ r: 5 }}
//                     activeDot={{ r: 8 }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="pendingChequeAmount"
//                     name="Pending Cheques"
//                     stroke="#FF9800"
//                     strokeWidth={2}
//                     dot={{ r: 5 }}
//                     activeDot={{ r: 8 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </Paper>
//           </Grid>


//           {/* First Chart */}
//           <Grid item xs={12} md={6}>
//             <Paper sx={{
//               p: 3,
//               borderRadius: 3,
//               boxShadow: 2,
//               height: '100%',
//               transition: 'transform 0.3s',
//               '&:hover': { transform: 'translateY(-5px)' }
//             }}>
//               <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
//                 EMI Payment Trends
//               </Typography>
//               <ResponsiveContainer width="100%" height={400}>
//                 <LineChart data={processEmiPaymentData()}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" tick={{ fill: '#666' }} />
//                   <YAxis
//                     tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
//                     tick={{ fill: '#666' }}
//                   />
//                   <Tooltip
//                     formatter={(value) => [`₹${(value / 100000).toFixed(2)}L`, 'Amount']}
//                     labelStyle={{ color: '#333' }}
//                   />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="totalEmiAmount"
//                     name="Total EMI Payments"
//                     stroke="#4527A0"
//                     strokeWidth={2}
//                     dot={{ r: 5 }}
//                     activeDot={{ r: 8 }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="cashEmiAmount"
//                     name="Cash EMI Payments"
//                     stroke="#4CAF50"
//                     strokeWidth={2}
//                     dot={{ r: 5 }}
//                     activeDot={{ r: 8 }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="chequeEmiAmount"
//                     name="Cleared Cheque EMI"
//                     stroke="#2196F3"
//                     strokeWidth={2}
//                     dot={{ r: 5 }}
//                     activeDot={{ r: 8 }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="pendingChequeEmiAmount"
//                     name="Pending Cheque EMI"
//                     stroke="#FF9800"
//                     strokeWidth={2}
//                     dot={{ r: 5 }}
//                     activeDot={{ r: 8 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </Paper>
//           </Grid>

//           {/* Second Chart */}

//         </Grid>

//         {/* Charts Section - Pie and Line Charts */}

//         {/* Sales Analysis Chart */}
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           <Grid item xs={12} md={6}>
//             <Paper sx={{
//               p: 3,
//               borderRadius: 3,
//               boxShadow: 2,
//               height: '100%',
//               transition: 'transform 0.3s',
//               '&:hover': { transform: 'translateY(-5px)' }
//             }}>
//               <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
//                 Project-wise Plot Distribution
//               </Typography>
//               <ResponsiveContainer width="100%" height={400}>
//                 <BarChart data={processProjectPlots()} barSize={20}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" tick={{ fill: '#666' }} />
//                   <YAxis tick={{ fill: '#666' }} />
//                   <Tooltip labelStyle={{ color: '#333' }} />
//                   <Legend />
//                   <Bar dataKey="booked" name="Booked Plots" stackId="a" fill="#4527A0" />
//                   <Bar dataKey="hold" name="Hold Plots" stackId="a" fill="#FF9800" />
//                   <Bar dataKey="available" name="Available Plots" stackId="a" fill="#4CAF50" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Paper sx={{
//               p: 3,
//               borderRadius: 3,
//               boxShadow: 2,
//               transition: 'transform 0.3s',
//               '&:hover': { transform: 'translateY(-5px)' }
//             }}>
//               <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
//                 Sales Distribution
//               </Typography>
//               <ResponsiveContainer width="100%" height={400}>
//                 <LineChart data={Object.values(processSalesData())}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" tick={{ fill: '#666' }} />
//                   <YAxis tick={{ fill: '#666' }} />
//                   <Tooltip labelStyle={{ color: '#333' }} />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="totalSales"
//                     name="Total Sales"
//                     stroke="#4527A0"
//                     strokeWidth={2}
//                     dot={{ r: 5 }}
//                     activeDot={{ r: 8 }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="fullPaymentSales"
//                     name="Full Payment Sales"
//                     stroke="#4CAF50"
//                     strokeWidth={2}
//                     dot={{ r: 5 }}
//                     activeDot={{ r: 8 }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="emiSales"
//                     name="EMI Sales"
//                     stroke="#FF9800"
//                     strokeWidth={2}
//                     dot={{ r: 5 }}
//                     activeDot={{ r: 8 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </Paper>
//           </Grid>


//         </Grid>

//         {/* Replace the EMI Overview section with new visualizations */}

//         {/* Add new visualization section */}
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           <Grid item xs={12} md={6}>
//             <Paper sx={{
//               p: 3,
//               borderRadius: 3,
//               boxShadow: 2,
//               transition: 'transform 0.3s',
//               '&:hover': { transform: 'translateY(-5px)' }
//             }}>
//               <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
//                 Monthly Sales Performance
//               </Typography>
//               <ResponsiveContainer width="100%" height={400}>
//                 <ComposedChart data={processPaymentData()}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" tick={{ fill: '#666' }} />
//                   <YAxis
//                     yAxisId="left"
//                     tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
//                     tick={{ fill: '#666' }}
//                   />
//                   <YAxis
//                     yAxisId="right"
//                     orientation="right"
//                     tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
//                     tick={{ fill: '#666' }}
//                   />
//                   <Tooltip
//                     formatter={(value, name) => [
//                       name.includes('%') ? `${(value * 100).toFixed(1)}%` : `₹${(value / 100000).toFixed(2)}L`,
//                       name
//                     ]}
//                     labelStyle={{ color: '#333' }}
//                   />
//                   <Legend />
//                   <Bar yAxisId="left" dataKey="totalAmount" name="Total Revenue" fill="#4527A0" />
//                   <Bar yAxisId="left" dataKey="cashAmount" name="Cash Revenue" fill="#4CAF50" />
//                   <Line
//                     yAxisId="right"
//                     type="monotone"
//                     dataKey="cashPercentage"
//                     name="Cash Payment %"
//                     stroke="#FF9800"
//                     strokeWidth={2}
//                     dot={{ r: 5 }}
//                     activeDot={{ r: 8 }}
//                   />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Paper sx={{
//               p: 3,
//               borderRadius: 3,
//               boxShadow: 2,
//               height: '100%',
//               transition: 'transform 0.3s',
//               '&:hover': { transform: 'translateY(-5px)' }
//             }}>
//               <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
//                 Project Revenue Analysis
//               </Typography>
//               <ResponsiveContainer width="100%" height={400}>
//                 <ComposedChart data={processPlotSalesByProject()}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" tick={{ fill: '#666' }} />
//                   <YAxis
//                     yAxisId="left"
//                     tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
//                     tick={{ fill: '#666' }}
//                   />
//                   <YAxis
//                     yAxisId="right"
//                     orientation="right"
//                     tickFormatter={(value) => value}
//                     tick={{ fill: '#666' }}
//                   />
//                   <Tooltip
//                     formatter={(value, name) => [
//                       name === 'count' ? value : `₹${(value / 100000).toFixed(2)}L`,
//                       name === 'count' ? 'Plots Sold' : name
//                     ]}
//                     labelStyle={{ color: '#333' }}
//                   />
//                   <Legend />
//                   <Bar yAxisId="left" dataKey="totalValue" name="Total Revenue" fill="#4527A0" />
//                   <Line yAxisId="right" type="monotone" dataKey="count" name="Plots Sold" stroke="#FF9800" strokeWidth={2} />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             </Paper>
//           </Grid>
//         </Grid>
//         {/* Recent Activity and Quick Actions */}
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={8}>
//             <Paper
//               sx={{
//                 p: 3,
//                 borderRadius: 3,
//                 boxShadow: 2,
//                 transition: 'transform 0.3s',
//                 '&:hover': { transform: 'translateY(-5px)' },
//               }}
//             >
//               <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
//                 Recent Plot Sell
//               </Typography>

//               <Box sx={{ maxHeight: 350, overflowY: 'auto' }}>
//                 <List sx={{ width: '100%' }}>
//                   {recentActivitiess.map((activity, index) => (
//                     <React.Fragment key={index}>
//                       <ListItem
//                         sx={{
//                           borderRadius: 2,
//                           '&:hover': { bgcolor: alpha('#4527A0', 0.05) },
//                           transition: 'background-color 0.2s',
//                         }}
//                       >
//                         <ListItemAvatar>
//                           <ApartmentIcon sx={{ bgcolor: alpha('#4527A0', 0.1), color: '#4527A0' }}>
//                             {activity.icon}
//                           </ApartmentIcon>
//                         </ListItemAvatar>
//                         <ListItemText primary={activity.projectName} secondary={activity.blockName} />
//                         <ListItemText primary={activity.plotNo} secondary={activity.bookingDate} />
//                         <Typography
//                           variant="caption"
//                           sx={{
//                             color: activity.isPositive ? '#2E7D32' : '#C62828',
//                             px: 1.5,
//                             py: 0.5,
//                             borderRadius: 2,
//                             fontWeight: 'bold',
//                             ml: 2,
//                           }}
//                         >
//                           ₹ {activity.totalPlotCost}
//                         </Typography>
//                       </ListItem>
//                       {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
//                     </React.Fragment>
//                   ))}
//                 </List>
//               </Box>
//             </Paper>
//           </Grid>

//           {/* Quick Actions */}
//           <Grid item xs={12} md={4}>
//             <Paper
//               sx={{
//                 p: 3,
//                 borderRadius: 4,
//                 boxShadow: 2,
//                 transition: 'transform 0.3s ease',
//                 '&:hover': {
//                   transform: 'translateY(-5px)',
//                   boxShadow: 6
//                 }
//               }}
//             >
//               <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
//                 Assigned Enquiries
//               </Typography>

//               <Box
//                 sx={{
//                   maxHeight: 350,
//                   overflowY: 'auto',
//                   pr: 1,
//                   scrollbarWidth: 'thin',
//                   scrollbarColor: '#b39ddb #ede7f6',
//                   '&::-webkit-scrollbar': {
//                     width: '8px',
//                   },
//                   '&::-webkit-scrollbar-track': {
//                     backgroundColor: '#ede7f6',
//                     borderRadius: '10px',
//                   },
//                   '&::-webkit-scrollbar-thumb': {
//                     backgroundColor: '#b39ddb',
//                     borderRadius: '10px',
//                   }
//                 }}
//               >
//                 <List disablePadding>
//                   {assignedData.map((item, index) => (
//                     <React.Fragment key={item.assignEnquiryId}>
//                       <ListItem
//                         sx={{
//                           mb: 1,
//                           borderRadius: 3,
//                           bgcolor: '#F5F5F5',
//                           boxShadow: 1,
//                           px: 2,
//                           py: 1.5,
//                           transition: '0.3s',
//                           '&:hover': {
//                             bgcolor: '#ede7f6',
//                             boxShadow: 3
//                           },
//                           display: 'flex',
//                           flexDirection: 'column',
//                           alignItems: 'flex-start',
//                         }}
//                       >
//                         <Typography sx={{ fontWeight: 'bold', color: '#4527A0' }}>
//                           Associate Code: {item.associateCode}
//                         </Typography>
//                         <Typography variant="caption" sx={{ color: '#616161', mt: 0.5 }}>
//                           Status: {item.enquiryStatus}
//                         </Typography>
//                         <Typography variant="caption" sx={{ color: '#757575', mt: 0.5 }}>
//                           📅 Assigned: {item.assignedDate}
//                         </Typography>
//                         <Typography variant="caption" sx={{ color: '#757575' }}>
//                           💬 Feedback: {item.feedBack}
//                         </Typography>
//                       </ListItem>
//                       {index < assignedData.length - 1 && <Divider />}

//                     </React.Fragment>
//                   ))}
//                 </List>
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default RealEstateDashboard;



import React from 'react'

const AdminDashboard = () => {
  return (
    <div>
      Dashboard Incomplete
    </div>
  )
}

export default AdminDashboard
