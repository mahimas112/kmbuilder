// // // import React, { useState, useEffect } from 'react';
// // // import { styled } from '@mui/material/styles';
// // // import MuiDrawer from '@mui/material/Drawer';
// // // import List from '@mui/material/List';
// // // import Box from '@mui/material/Box';
// // // import ListItem from '@mui/material/ListItem';
// // // import ListItemButton from '@mui/material/ListItemButton';
// // // import ListItemIcon from '@mui/material/ListItemIcon';
// // // import ListItemText from '@mui/material/ListItemText';
// // // import { useTheme } from '@mui/material/styles';
// // // import { useNavigate, useLocation } from 'react-router-dom';
// // // import Collapse from '@mui/material/Collapse';
// // // import ExpandLess from '@mui/icons-material/ExpandLess';
// // // import ExpandMore from '@mui/icons-material/ExpandMore';
// // // import IconButton from '@mui/material/IconButton';
// // // import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// // // import DashboardIcon from '@mui/icons-material/Dashboard';
// // // import FolderIcon from '@mui/icons-material/Folder';
// // // import PeopleIcon from '@mui/icons-material/People';
// // // import AnalyticsIcon from '@mui/icons-material/Analytics';
// // // import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// // // import TimelineIcon from '@mui/icons-material/Timeline';
// // // import SettingsIcon from '@mui/icons-material/Settings';
// // // import Avatar from '@mui/material/Avatar';
// // // import Typography from '@mui/material/Typography';
// // // import Divider from '@mui/material/Divider';

// // // const drawerWidth = 260;

// // // const DrawerHeader = styled('div')(({ theme }) => ({
// // //   display: 'flex',
// // //   alignItems: 'center',
// // //   justifyContent: 'flex-end',
// // //   padding: theme.spacing(0, 1),
// // //   ...theme.mixins.toolbar,
// // // }));

// // // const LogoSection = styled(Box)(({ theme }) => ({
// // //   display: 'flex',
// // //   alignItems: 'center',
// // //   padding: theme.spacing(0, 2),
// // //   height: 64,
// // //   backgroundColor: '#ffffff',
// // // }));

// // // const Logo = styled('div')(({ theme }) => ({
// // //   display: 'flex',
// // //   alignItems: 'center',
// // //   gap: theme.spacing(1),
// // // }));

// // // const LogoIcon = styled('div')(({ theme }) => ({
// // //   width: 30,
// // //   height: 30,
// // //   borderRadius: '50%',
// // //   background: 'linear-gradient(45deg, #FF6B6B, #6B66FF, #66D8FF)',
// // // }));

// // // const openedMixin = (theme) => ({
// // //   width: drawerWidth,
// // //   transition: theme.transitions.create('width', {
// // //     easing: theme.transitions.easing.sharp,
// // //     duration: theme.transitions.duration.enteringScreen,
// // //   }),
// // //   overflowX: 'hidden',
// // //   backgroundColor: '#ffffff',
// // //   borderRight: '1px solid rgba(0, 0, 0, 0.08)',
// // // });

// // // const closedMixin = (theme) => ({
// // //   transition: theme.transitions.create('width', {
// // //     easing: theme.transitions.easing.sharp,
// // //     duration: theme.transitions.duration.leavingScreen,
// // //   }),
// // //   overflowX: 'hidden',
// // //   backgroundColor: '#ffffff',
// // //   width: `calc(${theme.spacing(7)} + 1px)`,
// // //   [theme.breakpoints.up('sm')]: {
// // //     width: `calc(${theme.spacing(8)} + 1px)`,
// // //   },
// // //   borderRight: '1px solid rgba(0, 0, 0, 0.08)',
// // // });

// // // const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
// // //   margin: '4px 8px',
// // //   borderRadius: '8px',
// // //   transition: 'all 0.2s ease-in-out',
// // //   '&:hover': {
// // //     backgroundColor: 'rgba(107, 102, 255, 0.08)',
// // //     transform: 'translateX(4px)',
// // //   },
// // //   ...(active && {
// // //     backgroundColor: 'rgba(107, 102, 255, 0.12)',
// // //     '&:hover': {
// // //       backgroundColor: 'rgba(107, 102, 255, 0.16)',
// // //     },
// // //   }),
// // // }));

// // // const StyledSubItemButton = styled(ListItemButton)(({ theme, active }) => ({
// // //   margin: '2px 8px 2px 16px',
// // //   borderRadius: '8px',
// // //   transition: 'all 0.2s ease-in-out',
// // //   '&:hover': {
// // //     backgroundColor: 'rgba(107, 102, 255, 0.08)',
// // //     transform: 'translateX(4px)',
// // //   },
// // //   ...(active && {
// // //     backgroundColor: 'rgba(107, 102, 255, 0.12)',
// // //     '&:hover': {
// // //       backgroundColor: 'rgba(107, 102, 255, 0.16)',
// // //     },
// // //   }),
// // // }));

// // // const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
// // //   ({ theme, open, isMobile }) => ({
// // //     width: drawerWidth,
// // //     flexShrink: 0,
// // //     whiteSpace: 'nowrap',
// // //     boxSizing: 'border-box',
// // //     ...(open && {
// // //       ...openedMixin(theme),
// // //       '& .MuiDrawer-paper': openedMixin(theme),
// // //     }),
// // //     ...(!open && !isMobile && {
// // //       ...closedMixin(theme),
// // //       '& .MuiDrawer-paper': closedMixin(theme),
// // //     }),
// // //   }),
// // // );

// // // const UserProfile = styled(Box)(({ theme }) => ({
// // //   padding: theme.spacing(2),
// // //   display: 'flex',
// // //   flexDirection: 'column',
// // //   alignItems: 'center',
// // //   gap: theme.spacing(1),
// // //   marginBottom: theme.spacing(2),
// // //   '& .MuiAvatar-root': {
// // //     width: 70,
// // //     height: 70,
// // //     border: '2px solid #6B66FF',
// // //     transition: 'transform 0.2s ease-in-out',
// // //     '&:hover': {
// // //       transform: 'scale(1.05)',
// // //     },
// // //   },
// // // }));

// // // const MainLabel = styled(Typography)(({ theme }) => ({
// // //   color: '#718096',
// // //   fontSize: '0.75rem',
// // //   fontWeight: 600,
// // //   textTransform: 'uppercase',
// // //   letterSpacing: '0.05em',
// // //   padding: theme.spacing(0, 3),
// // //   marginBottom: theme.spacing(1),
// // //   marginTop: theme.spacing(2),
// // // }));

// // // const menuItems = [
// // //   {
// // //     text: 'Dashboard',
// // //     icon: <DashboardIcon />,
// // //     path: '/dashboard',
// // //   },

// // //   {
// // //     text: 'User Permisssion',
// // //     icon: <DashboardIcon />,
// // //     path: '/user-permission',
// // //   },
// // //   {
// // //     text: 'Masters',
// // //     icon: <FolderIcon />,
// // //     path: '/master',
// // //     subItems: [
// // //       { text: 'All Projects', path: '/masters/all-projects-site' },
// // //       { text: 'All Blocks', path: '/masters/all-blocks' },
// // //       { text: 'All Plot Types', path: '/masters/all-plot-types' },
// // //       { text: 'PLC/Development Rate', path: '/masters/all-plot-rate-master' },
// // //       { text: 'All Ranks', path: '/masters/all-ranks' },
// // //       { text: 'Plot Details', path: '/masters/all-plot-details' },
// // //       { text: 'Project Manipulation', path: '/masters/project-manipulation' },
// // //     ],
// // //   },
// // //   {
// // //     text: 'Associate',
// // //     icon: <FolderIcon />,
// // //     path: '/associates',
// // //     subItems: [
// // //       { text: 'Add Associate', path: '/associates/add-associates' },
// // //       { text: 'Associate Tree', path: '/associates/associates-trees' },
// // //       { text: 'Associate Details', path: '/associates/all-associates' },
// // //     ],
// // //   },
// // //   {
// // //     text: 'Customer',
// // //     icon: <FolderIcon />,
// // //     path: '/customers',
// // //     subItems: [
// // //       { text: 'Add Customers', path: '/customers/add-customer' },
// // //       { text: 'Customer Details', path: '/customers/all-customer' },
// // //     ],
// // //   },
// // //   {
// // //     text: 'Manage Plots',
// // //     icon: <FolderIcon />,
// // //     path: '/plots',
// // //     subItems: [
// // //       { text: 'Plot Booking', path: '/plots/add-plot-booking' },
// // //       { text: 'All Bookings', path: '/plots/all-plot-bookings' },
// // //     ],
// // //   },
// // //   {
// // //     text: 'Payment',
// // //     icon: <FolderIcon />,
// // //     path: '/payment',
// // //     subItems: [
// // //       { text: 'One Time Payment', path: '/payment/one-time-payment' },
// // //       { text: 'All One Time Payment', path: '/payment/all-one-time-payment' },
// // //       { text: 'EMI Plan', path: '/payment/emi-generator' },
// // //       { text: 'EMI Payment', path: '/payment/emi-payment' },
// // //       { text: 'All Emi Payment', path: '/payment/all-emi-payments' },
// // //       { text: 'Cheque Clearence', path: '/payment/cheque-clearence' },

// // //     ],
// // //   },
// // //   {
// // //     text: 'Manage Lead',
// // //     icon: <FolderIcon />,
// // //     path: '/leads',
// // //     subItems: [
// // //       { text: 'Sources', path: '/leads/sources' },
// // //       { text: 'Lead Types', path: '/leads/lead-types' },
// // //       { text: 'All Leads', path: '/leads/all-leads' },
// // //       { text: 'All Enquiry', path: '/leads/all-enquiry' },
// // //       { text: 'Assign Enquiry', path: '/leads/all-assign-enquiry' },

// // //     ],
// // //   },
// // //   {
// // //     text: 'Manage Land',
// // //     icon: <FolderIcon />,
// // //     path: '/Land-Management',
// // //     subItems: [
// // //       { text: 'Add Broker', path: '/Land-Management/add-Broker' },
// // //       { text: 'Add Farmer', path: '/Land-Management/add-farmer' },
// // //       { text: 'Purchase Land', path: '/Land-Management/PurchaseLand' },
// // //       { text: 'Add Payment', path: '/Land-Management/Add-Payment' },
// // //     ],
// // //   }
// // // ];

// // // const SidebarDrawer = ({ open, onDrawerClose, isMobile }) => {
// // //   const theme = useTheme();
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   const [expandedItem, setExpandedItem] = useState('');

// // //   useEffect(() => {
// // //     // Auto-expand the section containing the current path
// // //     const currentMenuItem = menuItems.find(item =>
// // //       item.subItems?.some(subItem => location.pathname === subItem.path)
// // //     );
// // //     if (currentMenuItem) {
// // //       setExpandedItem(currentMenuItem.text);
// // //     }
// // //   }, [location.pathname]);

// // //   const handleNavigation = (path) => {
// // //     navigate(path);
// // //     if (isMobile) {
// // //       onDrawerClose();
// // //     }
// // //   };

// // //   const handleExpand = (text) => {
// // //     setExpandedItem(expandedItem === text ? '' : text);
// // //   };

// // //   const isMainItemActive = (item) => {
// // //     return item.subItems
// // //       ? item.subItems.some(subItem => location.pathname === subItem.path)
// // //       : location.pathname === item.path;
// // //   };

// // //   const drawerContent = (
// // //     <>
// // //       {open && (
// // //         <LogoSection>
// // //           <Logo>
// // //             <LogoIcon />
// // //             <Typography
// // //               variant="h6"
// // //               sx={{
// // //                 fontWeight: 600,
// // //                 color: '#2D3748',
// // //               }}
// // //             >
// // //               Americorp Infra
// // //             </Typography>
// // //           </Logo>
// // //         </LogoSection>
// // //       )}

// // //       {/* {open && (
// // //         <UserProfile>
// // //           <Avatar
// // //             sx={{ width: 70, height: 70 }}
// // //             src="/path-to-profile-image.jpg"
// // //           />
// // //           <Box textAlign="center">
// // //             <Typography variant="subtitle1" sx={{
// // //               fontWeight: 600,
// // //               color: '#2D3748',
// // //             }}>
// // //               Sarah Smith
// // //             </Typography>
// // //             <Typography variant="body2" sx={{
// // //               color: '#718096',
// // //               fontSize: '0.8rem',
// // //             }}>
// // //               Admin
// // //             </Typography>
// // //           </Box>
// // //         </UserProfile>
// // //       )} */}

// // //       {/* {open && <MainLabel>MAIN</MainLabel>} */}

// // //       <List sx={{ px: 1, py: 1 }}>
// // //         {menuItems.map((item) => (
// // //           <React.Fragment key={item.text}>
// // //             <ListItem disablePadding>
// // //               <StyledListItemButton
// // //                 active={isMainItemActive(item)}
// // //                 onClick={() => {
// // //                   if (item.subItems) {
// // //                     handleExpand(item.text);
// // //                   } else {
// // //                     handleNavigation(item.path);
// // //                   }
// // //                 }}
// // //                 sx={{
// // //                   minHeight: 48,
// // //                   justifyContent: open ? 'initial' : 'center',

// // //                 }}
// // //               >
// // //                 <ListItemIcon
// // //                   sx={{
// // //                     minWidth: 0,
// // //                     mr: open ? 3 : 'auto',
// // //                     justifyContent: 'center',
// // //                     color: isMainItemActive(item) ? '#6B66FF' : '#718096',
// // //                     transition: 'color 0.2s ease-in-out',
// // //                   }}
// // //                 >
// // //                   {item.icon}
// // //                 </ListItemIcon>
// // //                 <ListItemText
// // //                   primary={item.text}
// // //                   sx={{
// // //                     opacity: open ? 1 : 0,
// // //                     color: isMainItemActive(item) ? '#6B66FF' : '#2D3748',
// // //                     '& .MuiTypography-root': {
// // //                       fontWeight: isMainItemActive(item) ? 600 : 600,                    },
// // //                   }}
// // //                 />
// // //                 {item.subItems && open && (
// // //                   <Box
// // //                     component={expandedItem === item.text ? ExpandLess : ExpandMore}
// // //                     sx={{
// // //                       color: isMainItemActive(item) ? '#6B66FF' : '#718096',
// // //                       transition: 'transform 0.2s ease-in-out',
// // //                       transform: expandedItem === item.text ? 'rotate(0deg)' : 'rotate(0deg)',
// // //                     }}
// // //                   />
// // //                 )}
// // //               </StyledListItemButton>
// // //             </ListItem>
// // //             {item.subItems && (
// // //               <Collapse in={expandedItem === item.text && open} timeout="auto" unmountOnExit>
// // //                 <List component="div" disablePadding>
// // //                   {item.subItems.map((subItem) => (
// // //                     <StyledSubItemButton
// // //                       key={subItem.text}
// // //                       active={location.pathname === subItem.path}
// // //                       onClick={() => handleNavigation(subItem.path)}
// // //                     >
// // //                       <ListItemText
// // //                         primary={subItem.text}
// // //                         sx={{
// // //                           '& .MuiTypography-root': {
// // //                             fontSize: '0.9rem',
// // //                             fontWeight: location.pathname === subItem.path ? 600 : 600,
// // //                             color: location.pathname === subItem.path ? '#6B66FF' : '#718096',
// // //                           },
// // //                         }}
// // //                       />
// // //                     </StyledSubItemButton>
// // //                   ))}
// // //                 </List>
// // //               </Collapse>
// // //             )}
// // //           </React.Fragment>
// // //         ))}
// // //       </List>
// // //     </>
// // //   );

// // //   if (isMobile) {
// // //     return (
// // //       <MuiDrawer
// // //         variant="temporary"
// // //         open={open}
// // //         onClose={onDrawerClose}
// // //         ModalProps={{
// // //           keepMounted: true,
// // //         }}
// // //         sx={{
// // //           '& .MuiDrawer-paper': {
// // //             boxSizing: 'border-box',
// // //             width: drawerWidth,
// // //             backgroundColor: '#ffffff',
// // //             mt: 7,
// // //             borderRight: '1px solid rgba(0, 0, 0, 0.08)',
// // //           },
// // //         }}
// // //       >
// // //         {drawerContent}
// // //       </MuiDrawer>
// // //     );
// // //   }

// // //   return (
// // //     <Drawer variant="permanent" open={open} isMobile={isMobile}>
// // //       {drawerContent}
// // //     </Drawer>
// // //   );
// // // };

// // // export default SidebarDrawer;
// // //mycode



// // import React, { useState, useEffect, useCallback } from 'react';
// // import { styled } from '@mui/material/styles';
// // import MuiDrawer from '@mui/material/Drawer';
// // import List from '@mui/material/List';
// // import Box from '@mui/material/Box';
// // import ListItem from '@mui/material/ListItem';
// // import ListItemButton from '@mui/material/ListItemButton';
// // import ListItemIcon from '@mui/material/ListItemIcon';
// // import ListItemText from '@mui/material/ListItemText';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import Collapse from '@mui/material/Collapse';
// // import ExpandLess from '@mui/icons-material/ExpandLess';
// // import ExpandMore from '@mui/icons-material/ExpandMore';
// // import DashboardIcon from '@mui/icons-material/Dashboard';
// // import FolderIcon from '@mui/icons-material/Folder';
// // import PeopleIcon from '@mui/icons-material/People';
// // import Typography from '@mui/material/Typography';
// // import PermissionsIcon from '@mui/icons-material/Security';
// // import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// // import HomeWorkIcon from '@mui/icons-material/HomeWork';
// // import PaymentIcon from '@mui/icons-material/Payment';
// // import GroupAddIcon from '@mui/icons-material/GroupAdd';
// // import PersonIcon from '@mui/icons-material/Person';
// // import LandscapeIcon from '@mui/icons-material/Landscape';
// // import ContactsIcon from '@mui/icons-material/Contacts';
// // import GroupIcon from '@mui/icons-material/Group';
// // import Avatar from '@mui/material/Avatar';
// // import Divider from '@mui/material/Divider';

// // import axiosInstance from 'axiosInstance';

// // const drawerWidth = 260;

// // const primaryBlue = '#0B2447';
// // const secondaryBlue = '#19376D';
// // const accentBlue = '#576CBC';
// // const highlightBlue = '#5D9CEC';
// // const bgColor = '#F8F9FD';
// // const formBg = '#FFFFFF';
// // const textDark = '#1E293B';
// // const textLight = '#FFFFFF';

// // const DrawerHeader = styled('div')(({ theme }) => ({
// //   display: 'flex',
// //   alignItems: 'center',
// //   justifyContent: 'flex-end',
// //   padding: theme.spacing(0, 1),
// //   ...theme.mixins.toolbar,
// // }));

// // const LogoSection = styled(Box)(({ theme }) => ({
// //   display: 'flex',
// //   alignItems: 'center',
// //   padding: theme.spacing(0, 2),
// //   height: 68,
// //   backgroundColor: primaryBlue,
// //   boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
// //   position: 'sticky',
// //   top: 0,
// //   zIndex: 1200,
// // }));

// // const Logo = styled('div')(({ theme }) => ({
// //   display: 'flex',
// //   alignItems: 'center',
// //   gap: theme.spacing(1),
// // }));

// // const LogoIcon = styled('div')(({ theme }) => ({
// //   width: 32,
// //   height: 32,
// //   borderRadius: '50%',
// //   display: 'flex',
// //   alignItems: 'center',
// //   justifyContent: 'center',
// //   background: `linear-gradient(45deg, #FF6B6B, #6B66FF, #66D8FF)`,
// //   boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
// // }));

// // const StickyHeaderContainer = styled(Box)(({ theme }) => ({
// //   position: 'sticky',
// //   top: 0,
// //   zIndex: 1100,
// //   backgroundColor: formBg,
// // }));

// // const openedMixin = (theme) => ({
// //   width: drawerWidth,
// //   transition: theme.transitions.create('width', {
// //     easing: theme.transitions.easing.sharp,
// //     duration: theme.transitions.duration.enteringScreen,
// //   }),
// //   overflowX: 'hidden',
// //   backgroundColor: formBg,
// //   borderRight: '1px solid rgba(0, 0, 0, 0.05)',
// //   boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
// //   '&::-webkit-scrollbar': {
// //     width: '5px',
// //   },
// //   '&::-webkit-scrollbar-thumb': {
// //     backgroundColor: 'rgba(107, 102, 255, 0.2)',
// //     borderRadius: '3px',
// //   },
// //   '&::-webkit-scrollbar-track': {
// //     backgroundColor: 'rgba(0, 0, 0, 0.03)',
// //     borderRadius: '3px',
// //   },
// // });

// // const closedMixin = (theme) => ({
// //   transition: theme.transitions.create('width', {
// //     easing: theme.transitions.easing.sharp,
// //     duration: theme.transitions.duration.leavingScreen,
// //   }),
// //   overflowX: 'hidden',
// //   backgroundColor: formBg,
// //   width: `calc(${theme.spacing(7)} + 1px)`,
// //   [theme.breakpoints.up('sm')]: {
// //     width: `calc(${theme.spacing(8)} + 1px)`,
// //   },
// //   borderRight: '1px solid rgba(0, 0, 0, 0.05)',
// //   boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
// // });

// // const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
// //   margin: '4px 10px',
// //   borderRadius: '10px',
// //   transition: 'all 0.2s ease-in-out',
// //   position: 'relative',
// //   '&:hover': {
// //     backgroundColor: 'rgba(107, 102, 255, 0.08)',
// //     transform: 'translateX(4px)',
// //   },
// //   ...(active && {
// //     backgroundColor: 'rgba(107, 102, 255, 0.12)',
// //     '&:hover': {
// //       backgroundColor: 'rgba(107, 102, 255, 0.16)',
// //     },
// //     '&::before': {
// //       content: '""',
// //       position: 'absolute',
// //       left: '-10px',
// //       top: '25%',
// //       height: '50%',
// //       width: '4px',
// //       backgroundColor: highlightBlue,
// //       borderRadius: '0 4px 4px 0',
// //     }
// //   }),
// // }));

// // const StyledSubItemButton = styled(ListItemButton)(({ theme, active }) => ({
// //   margin: '2px 10px 2px 20px',
// //   borderRadius: '10px',
// //   transition: 'all 0.2s ease-in-out',
// //   paddingLeft: theme.spacing(4),
// //   '&:hover': {
// //     backgroundColor: 'rgba(107, 102, 255, 0.08)',
// //     transform: 'translateX(4px)',
// //   },
// //   ...(active && {
// //     backgroundColor: 'rgba(107, 102, 255, 0.12)',
// //     '&:hover': {
// //       backgroundColor: 'rgba(107, 102, 255, 0.16)',
// //     },
// //   }),
// // }));

// // const UserInfoCard = styled(Box)(({ theme }) => ({
// //   margin: theme.spacing(2, 2, 3),
// //   padding: theme.spacing(2),
// //   borderRadius: 16,
// //   background: `linear-gradient(145deg, ${primaryBlue} 0%, ${secondaryBlue} 100%)`,
// //   boxShadow: '0 4px 12px rgba(11, 36, 71, 0.1)',
// //   position: 'relative',
// //   overflow: 'hidden',
// //   '&::before': {
// //     content: '""',
// //     position: 'absolute',
// //     width: '150%',
// //     height: '150%',
// //     top: '-50%',
// //     left: '-25%',
// //     background: `radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)`,
// //   },
// // }));

// // const DrawerContent = styled(Box)(({ theme }) => ({
// //   display: 'flex',
// //   flexDirection: 'column',
// //   height: '100%',
// //   overflowY: 'auto',
// //   outline: '1px solid white',

// //   '&::-webkit-scrollbar': {
// //     width: '6px', 
// //   },
// //   '&::-webkit-scrollbar-track': {
// //     backgroundColor: 'transparent',
// //   },
// //   '&::-webkit-scrollbar-thumb': {
// //     backgroundColor: 'white',
// //     borderRadius: '10px', 
// //   },
// //   '&::-webkit-scrollbar-thumb:hover': {
// //     backgroundColor: 'lightgray',
// //   },
// // }));

// // const ScrollableContent = styled(Box)(({ theme }) => ({
// //   overflowY: 'auto',
// //   flex: 1,
// //   outline: '1px solid white',

// //   '&::-webkit-scrollbar': {
// //     width: '6px', 
// //   },
// //   '&::-webkit-scrollbar-track': {
// //     backgroundColor: 'transparent',
// //   },
// //   '&::-webkit-scrollbar-thumb': {
// //     backgroundColor: 'white',
// //     borderRadius: '10px', 
// //   },
// //   '&::-webkit-scrollbar-thumb:hover': {
// //     backgroundColor: 'lightgray', 
// //   },
// // }));


// // const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
// //   ({ theme, open, isMobile }) => ({
// //     width: drawerWidth,
// //     flexShrink: 0,
// //     whiteSpace: 'nowrap',
// //     boxSizing: 'border-box',
// //     ...(open && {
// //       ...openedMixin(theme),
// //       '& .MuiDrawer-paper': openedMixin(theme),
// //     }),
// //     ...(!open && !isMobile && {
// //       ...closedMixin(theme),
// //       '& .MuiDrawer-paper': closedMixin(theme),
// //     }),
// //   }),
// // );

// // const getDashboardItem = (role) => {
// //   if (role === 'ADMIN') {
// //     return {
// //       text: 'Admin Dashboard',
// //       icon: <DashboardIcon />,
// //       path: '/admin-dashboard',
// //       category: 'Dashboard',
// //       permission: 'Overview'
// //     };
// //   } else if (role === 'ASSOCIATE') {
// //     return {
// //       text: 'Associate Dashboard',
// //       icon: <DashboardIcon />,
// //       path: '/associate-dashboard',
// //       category: 'Dashboard',
// //       permission: 'Overview'
// //     };
// //   }
// //   else {
// //     return {
// //       text: 'Dashboard',
// //       icon: <DashboardIcon />,
// //       path: '/dashboard',
// //       category: 'Dashboard',
// //       permission: 'Overview'
// //     };
// //   }
// // };

// // const getMenuItemsForRole = (role) => {
// //   const dashboardItem = getDashboardItem(role);

// //   const commonMenuItems = [
// //     dashboardItem,
// //     {
// //       text: 'Masters',
// //       icon: <FolderIcon />,
// //       path: '/masters',
// //       category: 'Masters',
// //       subItems: [
// //         { text: 'All Project', path: '/masters/all-projects-site', permission: 'Project Master' },
// //         { text: 'Add Project', path: '/masters/add-project', permission: 'Project Master' },
// //         { text: 'All Block', path: '/masters/all-blocks', permission: 'Block Master' },
// //         { text: 'All Plot Types', path: '/masters/all-plot-types', permission: 'Plot Size Master' },
// //         { text: 'Plc/Development Rate', path: '/masters/all-plot-rate-master', permission: 'Plot Master' },
// //         { text: 'All Ranks', path: '/masters/all-ranks', permission: 'Sector Master' },
// //         { text: 'Plot Details', path: '/masters/all-plot-details', permission: 'Plot Master' },
// //         { text: 'Project Manipulation', path: '/masters/project-manipulation', permission: 'Sector Master' },
// //         { text: 'Plot Availability', path: '/masters/plot-availibility', permission: 'Plot Master' },
// //       ],
// //     },
// //     {
// //       text: 'Manage Plots',
// //       icon: <HomeWorkIcon />,
// //       path: '/plots',
// //       category: 'Plot Management',
// //       subItems: [
// //         { text: 'Plot Booking', path: '/plots/add-plot-booking', permission: 'Plot Booking' },
// //         { text: 'All Bookings', path: '/plots/all-plot-bookings', permission: 'Booking List' },
// //         { text: 'Plot Registry', path: '/plots/add-plot-registry', permission: 'Plot Registry' },
// //       ],
// //     },
// //     {
// //       text: 'Customers',
// //       icon: <PersonIcon />,
// //       path: '/customers',
// //       category: 'Customer',
// //       subItems: [
// //         { text: 'Add Customer', path: '/customers/add-customer', permission: 'Add Customer' },
// //         { text: 'Plot Booking', path: '/customers/plot-booking', permission: 'Plot Booking' },
// //       ],
// //     },
// //     {
// //       text: 'Payments',
// //       icon: <PaymentIcon />,
// //       path: '/payment',
// //       category: 'Payment',
// //       subItems: [
// //         { text: 'One Time Payment', path: '/payment/one-time-payment', permission: 'One Time Payment' },
// //         { text: 'All One Time Payments', path: '/payment/all-one-time-payment', permission: 'Payment List' },
// //         { text: 'EMI Payment', path: '/payment/emi-payment', permission: 'EMI Payment' },
// //         { text: 'EMI Generator', path: '/payment/emi-generator', permission: 'EMI Generator' },
// //         { text: 'All EMI Payments', path: '/payment/all-emi-payments', permission: 'EMI Payments List' },
// //       ],
// //     },
// //     {
// //       text: 'Lead Management',
// //       icon: <ContactsIcon />,
// //       path: '/manage-leads',
// //       category: 'Lead',
// //       subItems: [
// //         { text: 'Sources', path: '/manage-leads/sources', permission: 'Lead Sources' },
// //         { text: 'Lead Types', path: '/manage-leads/lead-types', permission: 'Lead Types' },
// //         { text: 'All Leads', path: '/manage-leads/all-leads', permission: 'Leads List' },
// //         { text: 'All Enquiry', path: '/manage-leads/all-enquiry', permission: 'All Enquiry' },
// //         { text: 'Assign Enquiry', path: '/manage-leads/assign-enquiry', permission: 'Assign Enquiry' }
// //       ],
// //     },
// //     {
// //       text: 'Associates',
// //       icon: <GroupAddIcon />,
// //       path: '/associate',
// //       category: 'Associate',
// //       subItems: [
// //         { text: 'Add Associate', path: '/associate/add-associate', permission: 'Add Associate' },
// //         { text: 'Associate Details', path: '/associate/associate-details', permission: 'Associate List' },
// //         { text: 'Associate Tree', path: '/associate/associates-trees', permission: 'Associate Tree' },
// //       ],
// //     },
// //     {
// //       text: 'Land Management',
// //       icon: <LandscapeIcon />,
// //       path: '/Land-Management',
// //       category: 'Manage Land',
// //       subItems: [
// //         { text: 'Add Broker', path: '/Land-Management/add-Broker', permission: 'Add Broker' },
// //         { text: 'Add Farmer', path: '/Land-Management/add-farmer', permission: 'Add Farmer' },
// //         { text: 'Purchase Land', path: '/Land-Management/PurchaseLand', permission: 'Purchase Land' },
// //         { text: 'Add Payment', path: '/Land-Management/Add-Payment', permission: 'Add Payment' },
// //       ],
// //     },
// //     {
// //       text: 'Payroll',
// //       icon: <PaymentIcon />,
// //       path: '/Payroll',
// //       category: 'Payroll',
// //       subItems: [
// //         { text: 'Attendance', path: '/Payroll/attendence', permission: 'Attendance' },
// //         { text: 'Attendance Report', path: '/Payroll/attendencereport', permission: 'Attendance Report' },
// //         { text: 'Advanced Payment', path: '/Payroll/advancedpayment', permission: 'Advanced Payment' },
// //         { text: 'Employee', path: '/Payroll/Employee', permission: 'Employee' },
// //         { text: 'Generate Salary', path: '/Payroll/genrate-salary', permission: 'Generate Salary' },
// //       ],
// //     },
// //     {
// //       text: 'Permissions',
// //       icon: <PermissionsIcon />,
// //       path: '/permissions',
// //       category: 'Permission',
// //       subItems: [
// //         { text: 'User Permission', path: '/user-permission', permission: 'User Permission' },
// //       ],
// //     },{
// //       text: 'Reports',
// //       icon: <FolderIcon />,
// //       path: '/Reports',
// //       category: 'Reports',
// //       subItems: [
// //         { text: 'Pending EMI', path: '/Reports/pending-emi',permission: 'Pending EMI' },
// //         { text: 'Downline Tree', path: '/Reports/down-line-tree',permission: 'Downline Tree' },
// //         { text: 'Monthly EMI', path: '/Reports/monthly-emi-payment',permission: 'Monthly EMI' },
// //         { text: 'EMI Book Plot', path: '/Reports/emi-book-plot',permission: 'EMI Book Plot' },
// //         { text: 'Bounce Cheque', path: '/Reports/bounce-Cheque',permission: 'Bounce Cheque' },
// //         { text: 'Full Plot Booking', path: '/Reports/full-payment-book-plots',permission: 'Full Plot Booking' },
// //       ],
// //     },
// //     {
// //       text: 'My Profile',
// //       icon: <AccountCircleIcon />,
// //       path: '/Profile',
// //       alwaysShow: true
// //     }
// //   ];

// //   if (role === 'ASSOCIATE') {
// //     commonMenuItems.push({
// //       text: 'Associate Info',
// //       icon: <PersonIcon />,
// //       path: '/AssociateInfo',
// //       alwaysShow: true
// //     });
// //   }

// //   if (role === 'ASSOCIATE') {
// //     commonMenuItems.push({
// //       text: 'Associate Dowline',
// //       icon: <GroupIcon />,
// //       path: '/AssociateDowline',
// //       alwaysShow: true
// //     });
// //   }

// //   return commonMenuItems;
// // };

// // const categoryIconMap = {
// //   Dashboard: <DashboardIcon />,
// //   Masters: <FolderIcon />,
// //   'User Management': <PeopleIcon />,
// //   'Plot Management': <HomeWorkIcon />,
// //   Permissions: <PermissionsIcon />,
// //   Permission: <PermissionsIcon />,
// //   Associate: <GroupAddIcon />,
// //   Customer: <PersonIcon />,
// //   Payment: <PaymentIcon />,
// //   Lead: <ContactsIcon />,
// //   'Manage Land': <LandscapeIcon />
// // };

// // const fixedMenuItems = [
// //   {
// //     text: 'My Profile',
// //     icon: <AccountCircleIcon />,
// //     path: '/Profile',
// //     alwaysShow: true
// //   },
// //   {
// //     text: 'Permissions',
// //     icon: <PermissionsIcon />,
// //     path: '/permissions',
// //     category: 'Permission',
// //     subItems: [
// //       { text: 'User Permission', path: '/user-permission', permission: 'User Permission' },
// //     ],
// //   },
// // ];

// // const SidebarDrawer = ({ open, onDrawerClose, isMobile, forceRefresh }) => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [expandedItem, setExpandedItem] = useState('');
// //   const [permissionsData, setPermissionsData] = useState([]);
// //   const [menuItems, setMenuItems] = useState([]);
// //   const [userRole, setUserRole] = useState('');
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [refreshKey, setRefreshKey] = useState(0);
// //   const [permissionUpdateTimestamp, setPermissionUpdateTimestamp] = useState(Date.now());

// //   const getCurrentUserRole = useCallback(() => {
// //     const localRole = localStorage.getItem('userRole');
// //     if (localRole) {
// //       return localRole.toUpperCase();
// //     }

// //     const sessionRole = sessionStorage.getItem('userRole');
// //     if (sessionRole) {
// //       return sessionRole.toUpperCase();
// //     }

// //     return 'ASSOCIATE';
// //   }, []);

// //   const fetchPermissions = useCallback(async () => {
// //     try {
// //       setIsLoading(true);

// //       const response = await axiosInstance.get('/realEstate/user-permission/getAll');

// //       if (response.data && response.data.status === 200) {
// //         const newData = response.data.data;
// //         const dataChanged = JSON.stringify(newData) !== JSON.stringify(permissionsData);

// //         if (dataChanged) {
// //           setPermissionsData(newData);
// //           setPermissionUpdateTimestamp(Date.now());
// //         } 

// //         const currentRole = getCurrentUserRole();
// //         setUserRole(currentRole);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching permissions:', error);
// //       setTimeout(() => {
// //         if (navigator.onLine) {
// //           fetchPermissions();
// //         }
// //       }, 3000);

// //       const fallbackRole = getCurrentUserRole();
// //       setUserRole(fallbackRole);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }, [permissionsData, getCurrentUserRole]);

// //   useEffect(() => {
// //     const permissionPollInterval = setInterval(() => {
// //       fetchPermissions();
// //     }, 30000);

// //     return () => clearInterval(permissionPollInterval);
// //   }, [fetchPermissions]);

// //   useEffect(() => {
// //     const handlePermissionUpdate = () => {
// //       fetchPermissions();
// //       setRefreshKey(prev => prev + 1);
// //     };

// //     window.addEventListener('permissionUpdate', handlePermissionUpdate);

// //     return () => {
// //       window.removeEventListener('permissionUpdate', handlePermissionUpdate);
// //     };
// //   }, [fetchPermissions]);

// //   useEffect(() => {
// //     const handleStorageChange = (event) => {
// //       if (event.key === 'userRole' || event.key === null) {
// //         const updatedRole = getCurrentUserRole();

// //         if (updatedRole !== userRole) {
// //           setUserRole(updatedRole);
// //           setRefreshKey(prev => prev + 1);
// //           fetchPermissions();
// //         }
// //       }
// //     };

// //     window.addEventListener('storage', handleStorageChange);

// //     const handleRoleChangeEvent = () => {
// //       const updatedRole = getCurrentUserRole();
// //       if (updatedRole !== userRole) {
// //         setUserRole(updatedRole);
// //         setRefreshKey(prev => prev + 1);
// //         fetchPermissions();
// //       }
// //     };

// //     window.addEventListener('roleChange', handleRoleChangeEvent);

// //     return () => {
// //       window.removeEventListener('storage', handleStorageChange);
// //       window.removeEventListener('roleChange', handleRoleChangeEvent);
// //     };
// //   }, [userRole, getCurrentUserRole, fetchPermissions]);

// //   useEffect(() => {
// //     fetchPermissions();
// //   }, [fetchPermissions]);

// //   useEffect(() => {
// //     if (forceRefresh) {
// //       fetchPermissions();
// //       setRefreshKey(prev => prev + 1);
// //     }
// //   }, [forceRefresh, fetchPermissions]);

// //   useEffect(() => {
// //     if (permissionsData.length > 0 && userRole) {
// //       const allMenuItemsForRole = getMenuItemsForRole(userRole);

// //       const rolePermissions = permissionsData.find(p => p.roleName === userRole)?.permissions || {};
// //       let visibleMenuItems = allMenuItemsForRole.filter(item => {
// //         if (item.alwaysShow) return true;

// //         if (item.subItems) {
// //           const category = item.category;
// //           const allowedPermissions = rolePermissions[category] || [];

// //           if (allowedPermissions.length === 0) return false;

// //           return item.subItems.some(subItem =>
// //             allowedPermissions.includes(subItem.text)
// //           );
// //         }

// //         if (item.permission) {
// //           const category = item.category;
// //           const allowedPermissions = rolePermissions[category] || [];

// //           return allowedPermissions.includes(item.permission);
// //         }

// //         return false;
// //       }).map(item => {
// //         if (item.subItems) {
// //           const category = item.category;
// //           const allowedPermissions = rolePermissions[category] || [];

// //           const filteredSubItems = item.subItems.filter(subItem =>
// //             allowedPermissions.includes(subItem.text)
// //           );

// //           return {
// //             ...item,
// //             subItems: filteredSubItems.length > 0 ? filteredSubItems : []
// //           };
// //         }

// //         return item;
// //       }).filter(item => {
// //         return !item.subItems || item.subItems.length > 0;
// //       });

// //       visibleMenuItems = [...visibleMenuItems, ...fixedMenuItems.filter(
// //         item => !visibleMenuItems.some(mi => mi.text === item.text)
// //       )];

// //       setMenuItems([...visibleMenuItems]);
// //     } else {
// //       const defaultDashboard = getDashboardItem('');
// //       setMenuItems([defaultDashboard, ...fixedMenuItems]);
// //     }
// //   }, [permissionsData, userRole, refreshKey, permissionUpdateTimestamp]);

// //   useEffect(() => {
// //     const currentMenuItem = menuItems.find(item =>
// //       item.subItems?.some(subItem => location.pathname === subItem.path)
// //     );
// //     if (currentMenuItem) {
// //       setExpandedItem(currentMenuItem.text);
// //     }
// //   }, [location.pathname, menuItems]);

// //   const handleNavigation = (path) => {
// //     navigate(path);
// //     if (isMobile) {
// //       onDrawerClose();
// //     }
// //   };

// //   const handleExpand = (text) => {
// //     setExpandedItem(expandedItem === text ? '' : text);
// //   };

// //   const isMainItemActive = (item) => {
// //     return item.subItems
// //       ? item.subItems.some(subItem => location.pathname === subItem.path)
// //       : location.pathname === item.path;
// //   };

// //   const drawerContent = (
// //     <DrawerContent>
// //       <StickyHeaderContainer>
// //         {open && (
// //           <LogoSection>
// //             <Logo>
// //               <LogoIcon>
// //                 <HomeWorkIcon sx={{ fontSize: 18, color: textLight }} />
// //               </LogoIcon>
// //               <Typography
// //                 variant="h6"
// //                 sx={{
// //                   fontWeight: 700,
// //                   color: textLight,
// //                   letterSpacing: '0.5px',
// //                 }}
// //               >
// //                 REALTY CRMS
// //               </Typography>
// //             </Logo>
// //           </LogoSection>
// //         )}

// //         {open && (
// //           <UserInfoCard>
// //             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// //               <Avatar
// //                 sx={{
// //                   width: 48,
// //                   height: 48,
// //                   bgcolor: accentBlue,
// //                   boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
// //                 }}
// //               >
// //                 <AccountCircleIcon sx={{ fontSize: 30 }} />
// //               </Avatar>
// //               <Box sx={{ ml: 2 }}>
// //                 <Typography variant="subtitle1" sx={{ fontWeight: 600, color: textLight }}>
// //                   {userRole || 'User'}
// //                 </Typography>
// //                 <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
// //                   {userRole === 'ADMIN' ? 'Administrator' : userRole === 'ASSOCIATE' ? 'Associate Member' : 'Team Member'}
// //                 </Typography>
// //               </Box>
// //             </Box>
// //           </UserInfoCard>
// //         )}
// //       </StickyHeaderContainer>

// //       <ScrollableContent>
// //         {isLoading ? (
// //           <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
// //             <Typography variant="body2" color="text.secondary">
// //               Loading menu...
// //             </Typography>
// //           </Box>
// //         ) : (
// //           <List sx={{ px: 1, py: 1, mt: open ? 0 : 8 }}>
// //             {menuItems.map((item, index) => (
// //               <React.Fragment key={item.text}>
// //                 {index > 0 && index % 3 === 0 && open && (
// //                   <Divider sx={{ my: 1.5, mx: 2, opacity: 0.6 }} />
// //                 )}
// //                 <ListItem disablePadding>
// //                   <StyledListItemButton
// //                     active={isMainItemActive(item) ? 1 : 0}
// //                     onClick={() => {
// //                       if (item.subItems) {
// //                         handleExpand(item.text);
// //                       } else {
// //                         handleNavigation(item.path);
// //                       }
// //                     }}
// //                     sx={{
// //                       minHeight: 48,
// //                       justifyContent: open ? 'initial' : 'center',
// //                       px: open ? 2.5 : 2,
// //                     }}
// //                   >
// //                     <ListItemIcon
// //                       sx={{
// //                         minWidth: 0,
// //                         mr: open ? 3 : 'auto',
// //                         justifyContent: 'center',
// //                         color: isMainItemActive(item) ? highlightBlue : '#718096',
// //                         transition: 'color 0.2s ease-in-out',
// //                       }}
// //                     >
// //                       {item.icon}
// //                     </ListItemIcon>
// //                     <ListItemText
// //                       primary={item.text}
// //                       sx={{
// //                         opacity: open ? 1 : 0,
// //                         color: isMainItemActive(item) ? highlightBlue : textDark,
// //                         '& .MuiTypography-root': {
// //                           fontWeight: isMainItemActive(item) ? 600 : 500,
// //                           fontSize: '0.9rem',
// //                         },
// //                       }}
// //                     />
// //                     {item.subItems && open && (
// //                       <Box
// //                         component={expandedItem === item.text ? ExpandLess : ExpandMore}
// //                         sx={{
// //                           color: isMainItemActive(item) ? highlightBlue : '#718096',
// //                           transition: 'transform 0.2s ease-in-out',
// //                         }}
// //                       />
// //                     )}
// //                   </StyledListItemButton>
// //                 </ListItem>
// //                 {item.subItems && (
// //                   <Collapse in={expandedItem === item.text && open} timeout="auto" unmountOnExit>
// //                     <List component="div" disablePadding>
// //                       {item.subItems.map((subItem) => (
// //                         <StyledSubItemButton
// //                           key={subItem.text}
// //                           active={location.pathname === subItem.path ? 1 : 0}
// //                           onClick={() => handleNavigation(subItem.path)}
// //                         >
// //                           <ListItemText
// //                             primary={subItem.text}
// //                             sx={{
// //                               '& .MuiTypography-root': {
// //                                 fontSize: '0.85rem',
// //                                 fontWeight: location.pathname === subItem.path ? 600 : 400,
// //                                 color: location.pathname === subItem.path ? highlightBlue : '#718096',
// //                               },
// //                             }}
// //                           />
// //                         </StyledSubItemButton>
// //                       ))}
// //                     </List>
// //                   </Collapse>
// //                 )}
// //               </React.Fragment>
// //             ))}
// //           </List>
// //         )}
// //       </ScrollableContent>
// //     </DrawerContent>
// //   );

// //   if (isMobile) {
// //     return (
// //       <MuiDrawer
// //         variant="temporary"
// //         open={open}
// //         onClose={onDrawerClose}
// //         ModalProps={{
// //           keepMounted: true,
// //         }}
// //         sx={{
// //           '& .MuiDrawer-paper': {
// //             boxSizing: 'border-box',
// //             width: drawerWidth,
// //             backgroundColor: bgColor,
// //             mt: 7,
// //             borderRight: 'none',
// //             boxShadow: '2px 0 10px rgba(0, 0, 0, 0.08)',
// //             borderRadius: '0 16px 0 0',
// //           },
// //         }}
// //       >
// //         {drawerContent}
// //       </MuiDrawer>
// //     );
// //   }

// //   return (
// //     <Drawer variant="permanent" open={open} isMobile={isMobile}>
// //       {drawerContent}
// //     </Drawer>
// //   );
// // };

// // export default SidebarDrawer;


// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { styled, alpha } from '@mui/material/styles';
// import MuiDrawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import Box from '@mui/material/Box';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import { useNavigate, useLocation } from 'react-router-dom';
// import Collapse from '@mui/material/Collapse';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import FolderIcon from '@mui/icons-material/Folder';
// import PeopleIcon from '@mui/icons-material/People';
// import Typography from '@mui/material/Typography';
// import PermissionsIcon from '@mui/icons-material/Security';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import HomeWorkIcon from '@mui/icons-material/HomeWork';
// import PaymentIcon from '@mui/icons-material/Payment';
// import GroupAddIcon from '@mui/icons-material/GroupAdd';
// import PersonIcon from '@mui/icons-material/Person';
// import LandscapeIcon from '@mui/icons-material/Landscape';
// import ContactsIcon from '@mui/icons-material/Contacts';
// import GroupIcon from '@mui/icons-material/Group';
// import Avatar from '@mui/material/Avatar';
// import Divider from '@mui/material/Divider';
// import CircularProgress from '@mui/material/CircularProgress';
// import WifiOffIcon from '@mui/icons-material/WifiOff';
// import Backdrop from '@mui/material/Backdrop';
// import Tooltip from '@mui/material/Tooltip';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { useTheme } from '@mui/material/styles';
// import axiosInstance from 'axiosInstance';

// // Theme colors
// const colors = {
//   primary: {
//     main: '#0B2447',
//     light: '#19376D',
//     dark: '#071A36',
//     contrastText: '#FFFFFF'
//   },
//   secondary: {
//     main: '#576CBC',
//     light: '#A5D7E8',
//     dark: '#4358A8',
//     contrastText: '#FFFFFF'
//   },
//   accent: '#5D9CEC',
//   background: {
//     default: '#F8F9FD',
//     paper: '#FFFFFF',
//     sidebar: '#ffffff'
//   },
//   text: {
//     primary: '#1E293B',
//     secondary: '#718096',
//     light: '#FFFFFF'
//   },
//   divider: 'rgba(0, 0, 0, 0.06)',
//   success: {
//     main: '#10B981',
//     light: '#D1FAE5'
//   },
//   error: {
//     main: '#EF4444',
//     light: '#FEE2E2'
//   }
// };

// const drawerWidth = 240;

// // Styled components
// const DrawerHeader = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'flex-end',
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
// }));

// const LogoSection = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'flex-start',
//   padding: theme.spacing(0, 2),
//   height: 72,
//   backgroundColor: colors.primary.main,
//   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
//   position: 'sticky',
//   top: 0,
//   zIndex: 1200,
// }));

// const Logo = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   gap: theme.spacing(1.5),
// }));

// const LogoIcon = styled(Box)(({ theme }) => ({
//   width: 38,
//   height: 38,
//   borderRadius: '12px',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary.main})`,
//   boxShadow: '0 4px 10px rgba(93, 156, 236, 0.25)',
//   transition: 'transform 0.3s ease',
//   '&:hover': {
//     transform: 'scale(1.05)',
//   }
// }));

// const StickyHeaderContainer = styled(Box)(({ theme }) => ({
//   position: 'sticky',
//   top: 0,
//   zIndex: 1100,
//   backgroundColor: colors.background.sidebar,
// }));

// const openedMixin = (theme) => ({
//   width: drawerWidth,
//   transition: theme.transitions.create('width', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: 'hidden',
//   backgroundColor: colors.background.sidebar,
//   borderRight: `1px solid ${colors.divider}`,
//   boxShadow: '0 0 20px rgba(0, 0, 0, 0.03)',
//   '&::-webkit-scrollbar': {
//     width: '5px',
//   },
//   '&::-webkit-scrollbar-thumb': {
//     backgroundColor: alpha(colors.secondary.main, 0.2),
//     borderRadius: '3px',
//   },
//   '&::-webkit-scrollbar-track': {
//     backgroundColor: alpha(colors.text.primary, 0.03),
//     borderRadius: '3px',
//   },
// });

// const closedMixin = (theme) => ({
//   transition: theme.transitions.create('width', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: 'hidden',
//   backgroundColor: colors.background.sidebar,
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   [theme.breakpoints.up('sm')]: {
//     width: `calc(${theme.spacing(8)} + 1px)`,
//   },
//   borderRight: `1px solid ${colors.divider}`,
//   boxShadow: '0 0 20px rgba(0, 0, 0, 0.03)',
// });

// const StyledListItemButton = styled(ListItemButton, {
//   shouldForwardProp: (prop) => prop !== 'active'
// })(({ theme, active }) => ({
//   margin: '4px 12px',
//   borderRadius: '12px',
//   transition: 'all 0.3s ease-in-out',
//   position: 'relative',
//   overflow: 'hidden',
//   '&:hover': {
//     backgroundColor: alpha(colors.secondary.main, 0.08),
//     transform: 'translateX(4px)',
//     },
//     '&::before': {
//       content: '""',
//       position: 'absolute',
//       left: '-10px',
//     top: '50%',
//     height: '0%',
//       width: '4px',
//     backgroundColor: colors.accent,
//       borderRadius: '0 4px 4px 0',
//     transition: 'all 0.3s ease-in-out',
//     transform: 'translateY(-50%)',
//   },
//   ...(active && {
//     backgroundColor: alpha(colors.secondary.main, 0.12),
//     '&:hover': {
//       backgroundColor: alpha(colors.secondary.main, 0.16),
//     },
//     '&::before': {
//       height: '70%',
//       left: '0',
//     }
//   }),
// }));

// const StyledSubItemButton = styled(ListItemButton, {
//   shouldForwardProp: (prop) => prop !== 'active'
// })(({ theme, active }) => ({
//   margin: '2px 12px 2px 20px',
//   borderRadius: '10px',
//   transition: 'all 0.3s ease-in-out',
//   paddingLeft: theme.spacing(4),
//   fontSize: '0.875rem',
//   '&:hover': {
//     backgroundColor: alpha(colors.secondary.main, 0.08),
//     transform: 'translateX(4px)',
//   },
//   ...(active && {
//     backgroundColor: alpha(colors.secondary.main, 0.12),
//     '&:hover': {
//       backgroundColor: alpha(colors.secondary.main, 0.16),
//     },
//   }),
// }));

// const UserInfoCard = styled(Box)(({ theme }) => ({
//   margin: theme.spacing(2),
//   padding: theme.spacing(2),
//   borderRadius: 16,
//   background: `linear-gradient(145deg, ${colors.primary.main} 0%, ${colors.primary.light} 100%)`,
//   boxShadow: '0 8px 24px rgba(11, 36, 71, 0.12)',
//   position: 'relative',
//   overflow: 'hidden',
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     width: '150%',
//     height: '150%',
//     top: '-50%',
//     left: '-25%',
//     background: `radial-gradient(circle, ${alpha(colors.text.light, 0.1)} 0%, ${alpha(colors.text.light, 0)} 70%)`,
//   },
//   '&::after': {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     bottom: 0,
//     left: 0,
//     background: `linear-gradient(120deg, ${alpha(colors.secondary.main, 0.1)} 0%, transparent 70%)`,
//   }
// }));

// const DrawerContent = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   height: '100%',
//   overflowY: 'auto',
//   '&::-webkit-scrollbar': {
//     width: '4px',
//   },
//   '&::-webkit-scrollbar-track': {
//     backgroundColor: 'transparent',
//   },
//   '&::-webkit-scrollbar-thumb': {
//     backgroundColor: alpha(colors.text.secondary, 0.2),
//     borderRadius: '10px', 
//   },
//   '&::-webkit-scrollbar-thumb:hover': {
//     backgroundColor: alpha(colors.text.secondary, 0.4),
//   },
// }));

// const ScrollableContent = styled(Box)(({ theme }) => ({
//   overflowY: 'auto',
//   flex: 1,
//   '&::-webkit-scrollbar': {
//     width: '4px',
//   },
//   '&::-webkit-scrollbar-track': {
//     backgroundColor: 'transparent',
//   },
//   '&::-webkit-scrollbar-thumb': {
//     backgroundColor: alpha(colors.text.secondary, 0.2),
//     borderRadius: '10px', 
//   },
//   '&::-webkit-scrollbar-thumb:hover': {
//     backgroundColor: alpha(colors.text.secondary, 0.4),
//   },
// }));

// const CategoryLabel = styled(Typography)(({ theme }) => ({
//   fontSize: '0.7rem',
//   fontWeight: 700,
//   textTransform: 'uppercase',
//   letterSpacing: '0.1em',
//   color: alpha(colors.text.secondary, 0.7),
//   margin: theme.spacing(1.5, 3, 0.5),
// }));

// const Drawer = styled(MuiDrawer, { 
//   shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile'
// })(({ theme, open, isMobile }) => ({
//     width: drawerWidth,
//     flexShrink: 0,
//     whiteSpace: 'nowrap',
//     boxSizing: 'border-box',
//     ...(open && {
//       ...openedMixin(theme),
//       '& .MuiDrawer-paper': openedMixin(theme),
//     }),
//     ...(!open && !isMobile && {
//       ...closedMixin(theme),
//       '& .MuiDrawer-paper': closedMixin(theme),
//     }),
// }));

// const OfflineIndicator = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(1, 2),
//   backgroundColor: colors.error.light,
//   color: colors.error.main,
//   borderRadius: theme.spacing(1),
//   margin: theme.spacing(1),
// }));

// // Helper functions
// const getDashboardItem = (role) => {
//   if (role === 'ADMIN') {
//     return {
//       text: 'Admin Dashboard',
//       icon: <DashboardIcon />,
//       path: '/admin-dashboard',
//       category: 'Dashboard',
//       permission: 'Overview'
//     };
//   } else if (role === 'ASSOCIATE') {
//     return {
//       text: 'Associate Dashboard',
//       icon: <DashboardIcon />,
//       path: '/associate-dashboard',
//       category: 'Dashboard',
//       permission: 'Overview'
//     };
//   }
//   else {
//     return {
//       text: 'Dashboard',
//       icon: <DashboardIcon />,
//       path: '/dashboard',
//       category: 'Dashboard',
//       permission: 'Overview'
//     };
//   }
// };

// const getMenuItemsForRole = (role) => {
//   const dashboardItem = getDashboardItem(role);

//   const commonMenuItems = [
//     dashboardItem,
//     {
//       text: 'Masters',
//       icon: <FolderIcon />,
//       path: '/masters',
//       category: 'Masters',
//       subItems: [
//         { text: 'All Project', path: '/masters/all-projects-site', permission: 'Project Master' },
//         { text: 'Add Project', path: '/masters/add-project', permission: 'Project Master' },
//         { text: 'All Block', path: '/masters/all-blocks', permission: 'Block Master' },
//         { text: 'All Plot Types', path: '/masters/all-plot-types', permission: 'Plot Size Master' },
//         { text: 'Plc/Development Rate', path: '/masters/all-plot-rate-master', permission: 'Plot Master' },
//         { text: 'All Ranks', path: '/masters/all-ranks', permission: 'Sector Master' },
//         { text: 'Plot Details', path: '/masters/all-plot-details', permission: 'Plot Master' },
//         { text: 'Project Manipulation', path: '/masters/project-manipulation', permission: 'Sector Master' },
//         { text: 'Plot Availability', path: '/masters/plot-availibility', permission: 'Plot Master' },
//       ],
//     },
//     {
//       text: 'Manage Plots',
//       icon: <HomeWorkIcon />,
//       path: '/plots',
//       category: 'Plot Management',
//       subItems: [
//         { text: 'Plot Booking', path: '/plots/add-plot-booking', permission: 'Plot Booking' },
//         { text: 'All Bookings', path: '/plots/all-plot-bookings', permission: 'Booking List' },
//         { text: 'Plot Registry', path: '/plots/add-plot-registry', permission: 'Plot Registry' },
//       ],
//     },
//     {
//       text: 'Customers',
//       icon: <PersonIcon />,
//       path: '/customers',
//       category: 'Customer',
//       subItems: [
//         { text: 'Add Customer', path: '/customers/add-customer', permission: 'Add Customer' },
//         { text: 'Plot Booking', path: '/customers/plot-booking', permission: 'Plot Booking' },
//       ],
//     },
//     {
//       text: 'Payments',
//       icon: <PaymentIcon />,
//       path: '/payment',
//       category: 'Payment',
//       subItems: [
//         { text: 'One Time Payment', path: '/payment/one-time-payment', permission: 'One Time Payment' },
//         { text: 'All One Time Payments', path: '/payment/all-one-time-payment', permission: 'Payment List' },
//         { text: 'EMI Payment', path: '/payment/emi-payment', permission: 'EMI Payment' },
//         { text: 'EMI Generator', path: '/payment/emi-generator', permission: 'EMI Generator' },
//         { text: 'All EMI Payments', path: '/payment/all-emi-payments', permission: 'EMI Payments List' },
//       ],
//     },
//     {
//       text: 'Lead Management',
//       icon: <ContactsIcon />,
//       path: '/manage-leads',
//       category: 'Lead',
//       subItems: [
//         { text: 'Sources', path: '/manage-leads/sources', permission: 'Lead Sources' },
//         { text: 'Lead Types', path: '/manage-leads/lead-types', permission: 'Lead Types' },
//         { text: 'All Leads', path: '/manage-leads/all-leads', permission: 'Leads List' },
//         { text: 'All Enquiry', path: '/manage-leads/all-enquiry', permission: 'All Enquiry' },
//         { text: 'Assign Enquiry', path: '/manage-leads/assign-enquiry', permission: 'Assign Enquiry' }
//       ],
//     },
//     {
//       text: 'Associates',
//       icon: <GroupAddIcon />,
//       path: '/associate',
//       category: 'Associate',
//       subItems: [
//         { text: 'Add Associate', path: '/associate/add-associate', permission: 'Add Associate' },
//         { text: 'Associate Details', path: '/associate/associate-details', permission: 'Associate List' },
//         { text: 'Associate Tree', path: '/associate/associates-trees', permission: 'Associate Tree' },
//       ],
//     },
//     {
//       text: 'Land Management',
//       icon: <LandscapeIcon />,
//       path: '/Land-Management',
//       category: 'Manage Land',
//       subItems: [
//         { text: 'Add Broker', path: '/Land-Management/add-Broker', permission: 'Add Broker' },
//         { text: 'Add Farmer', path: '/Land-Management/add-farmer', permission: 'Add Farmer' },
//         { text: 'Purchase Land', path: '/Land-Management/PurchaseLand', permission: 'Purchase Land' },
//         { text: 'Add Payment', path: '/Land-Management/Add-Payment', permission: 'Add Payment' },
//       ],
//     },
//     {
//       text: 'Payroll',
//       icon: <PaymentIcon />,
//       path: '/Payroll',
//       category: 'Payroll',
//       subItems: [
//         { text: 'Attendance', path: '/Payroll/attendence', permission: 'Attendance' },
//         { text: 'Attendance Report', path: '/Payroll/attendencereport', permission: 'Attendance Report' },
//         { text: 'Advanced Payment', path: '/Payroll/advancedpayment', permission: 'Advanced Payment' },
//         { text: 'Employee', path: '/Payroll/Employee', permission: 'Employee' },
//         { text: 'Generate Salary', path: '/Payroll/genrate-salary', permission: 'Generate Salary' },
//       ],
//     },
//     {
//       text: 'Permissions',
//       icon: <PermissionsIcon />,
//       path: '/permissions',
//       category: 'Permission',
//       subItems: [
//         { text: 'User Permission', path: '/user-permission', permission: 'User Permission' },
//       ],
//     },
//     {
//       text: 'Reports',
//       icon: <FolderIcon />,
//       path: '/Reports',
//       category: 'Reports',
//       subItems: [
//         { text: 'Pending EMI', path: '/Reports/pending-emi',permission: 'Pending EMI' },
//         { text: 'Downline Tree', path: '/Reports/down-line-tree',permission: 'Downline Tree' },
//         { text: 'Monthly EMI', path: '/Reports/monthly-emi-payment',permission: 'Monthly EMI' },
//         { text: 'EMI Book Plot', path: '/Reports/emi-book-plot',permission: 'EMI Book Plot' },
//         { text: 'Bounce Cheque', path: '/Reports/bounce-Cheque',permission: 'Bounce Cheque' },
//         { text: 'Full Plot Booking', path: '/Reports/full-payment-book-plots',permission: 'Full Plot Booking' },
//       ],
//     },
//     {
//       text: 'My Profile',
//       icon: <AccountCircleIcon />,
//       path: '/Profile',
//       alwaysShow: true
//     }
//   ];

//   if (role === 'ASSOCIATE') {
//     commonMenuItems.push({
//       text: 'Associate Info',
//       icon: <PersonIcon />,
//       path: '/AssociateInfo',
//       alwaysShow: true
//     });
//   }

//   if (role === 'ASSOCIATE') {
//     commonMenuItems.push({
//       text: 'Associate Downline',
//       icon: <GroupIcon />,
//       path: '/AssociateDowline',
//       alwaysShow: true
//     });
//   }

//   return commonMenuItems;
// };

// const categoryIconMap = {
//   Dashboard: <DashboardIcon />,
//   Masters: <FolderIcon />,
//   'User Management': <PeopleIcon />,
//   'Plot Management': <HomeWorkIcon />,
//   Permissions: <PermissionsIcon />,
//   Permission: <PermissionsIcon />,
//   Associate: <GroupAddIcon />,
//   Customer: <PersonIcon />,
//   Payment: <PaymentIcon />,
//   Lead: <ContactsIcon />,
//   'Manage Land': <LandscapeIcon />,
//   Payroll: <PaymentIcon />,
//   Reports: <FolderIcon />
// };

// const fixedMenuItems = [
//   {
//     text: 'My Profile',
//     icon: <AccountCircleIcon />,
//     path: '/Profile',
//     alwaysShow: true
//   },
//   {
//     text: 'Permissions',
//     icon: <PermissionsIcon />,
//     path: '/permissions',
//     category: 'Permission',
//     subItems: [
//       { text: 'User Permission', path: '/user-permission', permission: 'User Permission' },
//     ],
//   },
// ];

// // Main component
// const SidebarDrawer = ({ open, onDrawerClose, isMobile, forceRefresh }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const theme = useTheme();
//   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
//   const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
//   const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

//   // States
//   const [expandedItem, setExpandedItem] = useState('');
//   const [permissionsData, setPermissionsData] = useState([]);
//   const [menuItems, setMenuItems] = useState([]);
//   const [userRole, setUserRole] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingError, setIsLoadingError] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [permissionUpdateTimestamp, setPermissionUpdateTimestamp] = useState(Date.now());
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [categorizedMenuItems, setCategorizedMenuItems] = useState({});
//   const [retryCount, setRetryCount] = useState(0);

//   // Refs
//   const refreshTimeoutRef = useRef(null);
//   const permissionPollIntervalRef = useRef(null);

//   // Get current user role from storage
//   const getCurrentUserRole = useCallback(() => {
//     try {
//     const localRole = localStorage.getItem('userRole');
//     if (localRole) {
//       return localRole.toUpperCase();
//     }

//     const sessionRole = sessionStorage.getItem('userRole');
//     if (sessionRole) {
//       return sessionRole.toUpperCase();
//     }

//       return 'ASSOCIATE'; // Default role
//     } catch (error) {
//       console.error('Error accessing storage:', error);
//       return 'ASSOCIATE'; // Fallback to default role
//     }
//   }, []);

//   // Check online status
//   useEffect(() => {
//     const handleOnlineStatus = () => {
//       setIsOnline(navigator.onLine);
//       if (navigator.onLine) {
//         // Refresh data when coming back online
//         fetchPermissions();
//       }
//     };

//     window.addEventListener('online', handleOnlineStatus);
//     window.addEventListener('offline', handleOnlineStatus);

//     return () => {
//       window.removeEventListener('online', handleOnlineStatus);
//       window.removeEventListener('offline', handleOnlineStatus);
//     };
//   }, []);

//   // Fetch permissions from API
//   const fetchPermissions = useCallback(async () => {
//     if (!isOnline) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setIsLoadingError(false);

//       const response = await axiosInstance.get('/realEstate/user-permission/getAll');

//       if (response.data && response.data.status === 200) {
//         const newData = response.data.data;
//         const dataChanged = JSON.stringify(newData) !== JSON.stringify(permissionsData);

//         if (dataChanged) {
//           setPermissionsData(newData);
//           setPermissionUpdateTimestamp(Date.now());
//         } 

//         const currentRole = getCurrentUserRole();
//         setUserRole(currentRole);
//         setRetryCount(0); // Reset retry count on success
//       } else {
//         throw new Error('Invalid response format');
//       }
//     } catch (error) {
//       console.error('Error fetching permissions:', error);
//       setIsLoadingError(true);

//       // Exponential backoff for retries (max 30 seconds)
//       const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000);

//       if (refreshTimeoutRef.current) {
//         clearTimeout(refreshTimeoutRef.current);
//       }

//       refreshTimeoutRef.current = setTimeout(() => {
//         if (navigator.onLine) {
//           setRetryCount(prev => prev + 1);
//           fetchPermissions();
//         }
//       }, retryDelay);

//       // Still set user role from storage even if API fails
//       const fallbackRole = getCurrentUserRole();
//       setUserRole(fallbackRole);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [permissionsData, getCurrentUserRole, isOnline, retryCount]);

//   // Set up permission polling
//   useEffect(() => {
//     // Clear any existing interval
//     if (permissionPollIntervalRef.current) {
//       clearInterval(permissionPollIntervalRef.current);
//     }

//     // Set up new interval if online
//     if (isOnline) {
//       permissionPollIntervalRef.current = setInterval(() => {
//       fetchPermissions();
//       }, 60000); // Poll every minute
//     }

//     return () => {
//       if (permissionPollIntervalRef.current) {
//         clearInterval(permissionPollIntervalRef.current);
//       }

//       if (refreshTimeoutRef.current) {
//         clearTimeout(refreshTimeoutRef.current);
//       }
//     };
//   }, [fetchPermissions, isOnline]);

//   // Listen for permission update events
//   useEffect(() => {
//     const handlePermissionUpdate = () => {
//       fetchPermissions();
//       setRefreshKey(prev => prev + 1);
//     };

//     window.addEventListener('permissionUpdate', handlePermissionUpdate);

//     return () => {
//       window.removeEventListener('permissionUpdate', handlePermissionUpdate);
//     };
//   }, [fetchPermissions]);

//   // Listen for storage and role changes
//   useEffect(() => {
//     const handleStorageChange = (event) => {
//       if (event.key === 'userRole' || event.key === null) {
//         const updatedRole = getCurrentUserRole();

//         if (updatedRole !== userRole) {
//           setUserRole(updatedRole);
//           setRefreshKey(prev => prev + 1);
//           fetchPermissions();
//         }
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);

//     const handleRoleChangeEvent = () => {
//       const updatedRole = getCurrentUserRole();
//       if (updatedRole !== userRole) {
//         setUserRole(updatedRole);
//         setRefreshKey(prev => prev + 1);
//         fetchPermissions();
//       }
//     };

//     window.addEventListener('roleChange', handleRoleChangeEvent);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//       window.removeEventListener('roleChange', handleRoleChangeEvent);
//     };
//   }, [userRole, getCurrentUserRole, fetchPermissions]);

//   // Initial fetch on mount
//   useEffect(() => {
//     fetchPermissions();
//   }, [fetchPermissions]);

//   // Handle forced refresh
//   useEffect(() => {
//     if (forceRefresh) {
//       fetchPermissions();
//       setRefreshKey(prev => prev + 1);
//     }
//   }, [forceRefresh, fetchPermissions]);

//   // Process menu items based on permissions
//   useEffect(() => {
//     if (permissionsData.length > 0 && userRole) {
//       const allMenuItemsForRole = getMenuItemsForRole(userRole);

//       const rolePermissions = permissionsData.find(p => p.roleName === userRole)?.permissions || {};
//       let visibleMenuItems = allMenuItemsForRole.filter(item => {
//         if (item.alwaysShow) return true;

//         if (item.subItems) {
//           const category = item.category;
//           const allowedPermissions = rolePermissions[category] || [];

//           if (allowedPermissions.length === 0) return false;

//           return item.subItems.some(subItem =>
//             allowedPermissions.includes(subItem.text)
//           );
//         }

//         if (item.permission) {
//           const category = item.category;
//           const allowedPermissions = rolePermissions[category] || [];

//           return allowedPermissions.includes(item.permission);
//         }

//         return false;
//       }).map(item => {
//         if (item.subItems) {
//           const category = item.category;
//           const allowedPermissions = rolePermissions[category] || [];

//           const filteredSubItems = item.subItems.filter(subItem =>
//             allowedPermissions.includes(subItem.text)
//           );

//           return {
//             ...item,
//             subItems: filteredSubItems.length > 0 ? filteredSubItems : []
//           };
//         }

//         return item;
//       }).filter(item => {
//         return !item.subItems || item.subItems.length > 0;
//       });

//       // Add fixed menu items that aren't already included
//       visibleMenuItems = [...visibleMenuItems, ...fixedMenuItems.filter(
//         item => !visibleMenuItems.some(mi => mi.text === item.text)
//       )];

//       // Group items by category
//       const groupedItems = {};

//       visibleMenuItems.forEach(item => {
//         const category = item.category || 'Other';
//         if (!groupedItems[category]) {
//           groupedItems[category] = [];
//         }
//         groupedItems[category].push(item);
//       });

//       setCategorizedMenuItems(groupedItems);
//       setMenuItems([...visibleMenuItems]);
//     } else {
//       const defaultDashboard = getDashboardItem('');
//       setMenuItems([defaultDashboard, ...fixedMenuItems]);

//       // Set default categorization
//       const defaultGrouped = {
//         'Dashboard': [defaultDashboard],
//         'Other': [...fixedMenuItems]
//       };
//       setCategorizedMenuItems(defaultGrouped);
//     }
//   }, [permissionsData, userRole, refreshKey, permissionUpdateTimestamp]);

//   // Auto-expand menu item based on current location
//   useEffect(() => {
//     const currentMenuItem = menuItems.find(item =>
//       item.subItems?.some(subItem => location.pathname === subItem.path)
//     );
//     if (currentMenuItem) {
//       setExpandedItem(currentMenuItem.text);
//     }
//   }, [location.pathname, menuItems]);

//   // Handle navigation
//   const handleNavigation = (path) => {
//     navigate(path);
//     if (isMobile) {
//       onDrawerClose();
//     }
//   };

//   // Handle menu expansion
//   const handleExpand = (text) => {
//     setExpandedItem(expandedItem === text ? '' : text);
//   };

//   // Check if menu item is active
//   const isMainItemActive = (item) => {
//     return item.subItems
//       ? item.subItems.some(subItem => location.pathname === subItem.path)
//       : location.pathname === item.path;
//   };

//   // Drawer content JSX
//   const drawerContent = (
//     <DrawerContent>
//       <StickyHeaderContainer>
//         {/* {open && (
//           <LogoSection>
//             <Logo>
//               <LogoIcon>
//                 <HomeWorkIcon sx={{ fontSize: 20, color: colors.text.light }} />
//               </LogoIcon>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: 700,
//                   color: colors.text.light,
//                   letterSpacing: '0.5px',
//                   fontSize: isSmUp ? '1.25rem' : '1rem',
//                 }}
//               >
//                 REALTY CRMS
//               </Typography>
//             </Logo>
//           </LogoSection>
//         )} */}

//         {open && (
//           <UserInfoCard>
//             <Box sx={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               mb: 1,
//               position: 'relative',
//               zIndex: 2 
//             }}>
//               <Avatar
//                 sx={{
//                   width: 48,
//                   height: 48,
//                   bgcolor: colors.secondary.main,
//                   boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
//                   border: `2px solid ${colors.text.light}`
//                 }}
//               >
//                 <AccountCircleIcon sx={{ fontSize: 28 }} />
//               </Avatar>
//               <Box sx={{ ml: 2 }}>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.light }}>
//                   {userRole || 'User'}
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
//                   {userRole === 'ADMIN' ? 'Administrator' : userRole === 'ASSOCIATE' ? 'Associate Member' : 'Team Member'}
//                 </Typography>
//               </Box>
//             </Box>
//           </UserInfoCard>
//         )}

//         {!isOnline && open && (
//           <OfflineIndicator>
//             <WifiOffIcon sx={{ mr: 1, fontSize: '1rem' }} />
//             <Typography variant="caption" fontWeight={500}>
//               You're offline. Some features may be limited.
//             </Typography>
//           </OfflineIndicator>
//         )}
//       </StickyHeaderContainer>

//       <ScrollableContent>
//         {isLoading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', py: 4 }}>
//             <CircularProgress size={28} color="primary" />
//             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//               Loading menu...
//             </Typography>
//           </Box>
//         ) : isLoadingError && !isOnline ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', py: 4, px: 2 }}>
//             <WifiOffIcon sx={{ fontSize: 32, color: colors.error.main, mb: 1 }} />
//             <Typography variant="body2" color="text.secondary" align="center">
//               Can't load menu while offline. Some features may be limited.
//             </Typography>
//           </Box>
//         ) : (
//           <List sx={{ px: 1, py: 1, mt: open ? 0 : 8 }}>
//             {Object.entries(categorizedMenuItems).map(([category, items], categoryIndex) => (
//               <React.Fragment key={category}>
//                 {categoryIndex > 0 && open && (
//                   <Divider sx={{ my: 1.5, mx: 2, opacity: 0.4 }} />
//                 )}

//                 {open && category !== 'Other' && (
//                   <CategoryLabel>{category}</CategoryLabel>
//                 )}

//                 {items.map((item, index) => (
//                   <React.Fragment key={item.text}>
//                 <ListItem disablePadding>
//                       <Tooltip 
//                         title={!open ? item.text : ""}
//                         placement="right"
//                         arrow
//                         disableHoverListener={open}
//                       >
//                   <StyledListItemButton
//                     active={isMainItemActive(item) ? 1 : 0}
//                     onClick={() => {
//                       if (item.subItems) {
//                         handleExpand(item.text);
//                       } else {
//                         handleNavigation(item.path);
//                       }
//                     }}
//                     sx={{
//                       minHeight: 48,
//                       justifyContent: open ? 'initial' : 'center',
//                       px: open ? 2.5 : 2,
//                     }}
//                   >
//                     <ListItemIcon
//                       sx={{
//                         minWidth: 0,
//                         mr: open ? 3 : 'auto',
//                         justifyContent: 'center',
//                               color: isMainItemActive(item) ? colors.accent : colors.text.secondary,
//                         transition: 'color 0.2s ease-in-out',
//                       }}
//                     >
//                       {item.icon}
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={item.text}
//                       sx={{
//                         opacity: open ? 1 : 0,
//                               color: isMainItemActive(item) ? colors.accent : colors.text.primary,
//                         '& .MuiTypography-root': {
//                           fontWeight: isMainItemActive(item) ? 600 : 500,
//                                 fontSize: '0.875rem',
//                                 whiteSpace: 'nowrap',
//                                 overflow: 'hidden',
//                                 textOverflow: 'ellipsis',
//                         },
//                       }}
//                     />
//                     {item.subItems && open && (
//                       <Box
//                         component={expandedItem === item.text ? ExpandLess : ExpandMore}
//                         sx={{
//                                 color: isMainItemActive(item) ? colors.accent : colors.text.secondary,
//                                 transition: 'transform 0.3s ease-in-out',
//                                 transform: expandedItem === item.text ? 'rotate(0deg)' : 'rotate(0deg)',
//                         }}
//                       />
//                     )}
//                   </StyledListItemButton>
//                       </Tooltip>
//                 </ListItem>
//                 {item.subItems && (
//                   <Collapse in={expandedItem === item.text && open} timeout="auto" unmountOnExit>
//                     <List component="div" disablePadding>
//                       {item.subItems.map((subItem) => (
//                         <StyledSubItemButton
//                           key={subItem.text}
//                           active={location.pathname === subItem.path ? 1 : 0}
//                           onClick={() => handleNavigation(subItem.path)}
//                         >
//                           <ListItemText
//                             primary={subItem.text}
//                             sx={{
//                               '& .MuiTypography-root': {
//                                     fontSize: '0.8rem',
//                                 fontWeight: location.pathname === subItem.path ? 600 : 400,
//                                     color: location.pathname === subItem.path ? colors.accent : colors.text.secondary,
//                                     whiteSpace: 'nowrap',
//                                     overflow: 'hidden',
//                                     textOverflow: 'ellipsis',
//                               },
//                             }}
//                           />
//                         </StyledSubItemButton>
//                       ))}
//                     </List>
//                   </Collapse>
//                 )}
//                   </React.Fragment>
//                 ))}
//               </React.Fragment>
//             ))}
//           </List>
//         )}
//       </ScrollableContent>
//     </DrawerContent>
//   );

//   // Mobile drawer variant
//   if (isMobile) {
//     return (
//       <>
//       <MuiDrawer
//         variant="temporary"
//         open={open}
//         onClose={onDrawerClose}
//         ModalProps={{
//           keepMounted: true,
//         }}
//         sx={{
//             display: { xs: 'block', sm: 'block' },
//           '& .MuiDrawer-paper': {
//             boxSizing: 'border-box',
//             width: drawerWidth,
//               backgroundColor: colors.background.sidebar,
//               mt: { xs: 7, sm: 8 },
//             borderRight: 'none',
//               boxShadow: '4px 0 24px rgba(0, 0, 0, 0.08)',
//               borderRadius: '0 16px 16px 0',
//           },
//         }}
//       >
//         {drawerContent}
//       </MuiDrawer>

//         <Backdrop
//           sx={{ 
//             color: '#fff', 
//             zIndex: (theme) => theme.zIndex.drawer - 1,
//             display: { lg: 'none' }
//           }}
//           open={open}
//           onClick={onDrawerClose}
//         />
//       </>
//     );
//   }

//   // Desktop drawer variant
//   return (
//     <Drawer 
//       variant="permanent" 
//       open={open} 
//       isMobile={isMobile}
//       sx={{
//         display: { xs: 'none', sm: 'block' },
//       }}
//     >
//       {drawerContent}
//     </Drawer>
//   );
// };

// export default SidebarDrawer;







// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { styled, alpha } from '@mui/material/styles';
// import MuiDrawer from '@mui/material/Drawer';
// import Box from '@mui/material/Box';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import { useNavigate, useLocation } from 'react-router-dom';
// import Collapse from '@mui/material/Collapse';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import FolderIcon from '@mui/icons-material/Folder';
// import HomeWorkIcon from '@mui/icons-material/HomeWork';
// import PaymentIcon from '@mui/icons-material/Payment';
// import PersonIcon from '@mui/icons-material/Person';
// import LandscapeIcon from '@mui/icons-material/Landscape';
// import ContactsIcon from '@mui/icons-material/Contacts';
// import GroupAddIcon from '@mui/icons-material/GroupAdd';
// import SecurityIcon from '@mui/icons-material/Security';
// import Avatar from '@mui/material/Avatar';
// import Typography from '@mui/material/Typography';
// import Backdrop from '@mui/material/Backdrop';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { useTheme } from '@mui/material/styles';
// import WifiOffIcon from '@mui/icons-material/WifiOff';
// import IconButton from '@mui/material/IconButton';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import Tooltip from '@mui/material/Tooltip';

// // Theme colors
// const colors = {
//   primary: '#6563FF', // Changed to match the purple in image
//   secondary: '#959CB6',
//   background: {
//     default: '#F8F9FA',
//     paper: '#FFFFFF',
//     sidebar: '#FFFFFF'
//   },
//   text: {
//     primary: '#333333',
//     secondary: '#6E6E6E',
//     light: '#FFFFFF'
//   },
//   divider: 'rgba(0, 0, 0, 0.05)',
// };

// const drawerWidth = 240;

// // Styled components
// const openedMixin = (theme) => ({
//   width: drawerWidth,
//   transition: theme.transitions.create('width', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: 'hidden',
//   backgroundColor: colors.background.sidebar,
//   borderRight: `1px solid ${colors.divider}`,
//   boxShadow: '0 0 10px rgba(0, 0, 0, 0.03)',
// });

// const closedMixin = (theme) => ({
//   transition: theme.transitions.create('width', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: 'hidden',
//   backgroundColor: colors.background.sidebar,
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   [theme.breakpoints.up('sm')]: {
//     width: `calc(${theme.spacing(8)} + 1px)`,
//   },
//   borderRight: `1px solid ${colors.divider}`,
//   boxShadow: '0 0 10px rgba(0, 0, 0, 0.03)',
// });

// const LogoSection = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(0, 2),
//   height: 64,
//   backgroundColor: colors.background.sidebar,
//   position: 'sticky',
//   top: 0,
//   zIndex: 1,
//   borderBottom: `1px solid ${colors.divider}`,
// }));

// const DrawerHeader = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'flex-end',
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
// }));

// const StyledLogoContainer = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   gap: theme.spacing(1),
// }));

// const LogoIcon = styled(Box)(({ theme }) => ({
//   width: 34,
//   height: 34,
//   borderRadius: '50%',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   background: 'linear-gradient(135deg, #6665FF, #7B78FF)',
//   boxShadow: '0 2px 8px rgba(101, 99, 255, 0.3)',
//   transition: 'transform 0.3s ease',
//   '&:hover': {
//     transform: 'scale(1.05)',
//   }
// }));

// const DrawerContent = styled(Box)(() => ({
//   display: 'flex',
//   flexDirection: 'column',
//   height: '100%',
//   overflowY: 'auto',
//   '&::-webkit-scrollbar': {
//     width: '4px',
//   },
//   '&::-webkit-scrollbar-track': {
//     backgroundColor: 'transparent',
//   },
//   '&::-webkit-scrollbar-thumb': {
//     backgroundColor: alpha(colors.secondary, 0.2),
//     borderRadius: '10px', 
//   },
//   '&::-webkit-scrollbar-thumb:hover': {
//     backgroundColor: alpha(colors.secondary, 0.4),
//   },
// }));

// const StyledListItemButton = styled(ListItemButton, {
//   shouldForwardProp: (prop) => prop !== 'active'
// })(({ theme, active }) => ({
//   borderRadius: '8px',
//   margin: '2px 12px',
//   padding: '8px 12px',
//   transition: 'all 0.2s ease-in-out',
//   position: 'relative',
//   '&:hover': {
//     backgroundColor: alpha(colors.primary, 0.08),
//   },
//   ...(active && {
//     backgroundColor: alpha(colors.primary, 0.1),
//     '&:hover': {
//       backgroundColor: alpha(colors.primary, 0.15),
//     },
//     '& .MuiListItemIcon-root': {
//       color: colors.primary,
//     },
//     '& .MuiListItemText-primary': {
//       color: colors.primary,
//       fontWeight: 500,
//     },
//   }),
// }));

// const StyledSubItemButton = styled(ListItemButton, {
//   shouldForwardProp: (prop) => prop !== 'active'
// })(({ theme, active }) => ({
//   margin: '2px 12px 2px 20px',
//   padding: '6px 12px 6px 32px',
//   borderRadius: '8px',
//   transition: 'all 0.2s ease-in-out',
//   fontSize: '0.875rem',
//   '&:hover': {
//     backgroundColor: alpha(colors.primary, 0.08),
//   },
//   ...(active && {
//     backgroundColor: alpha(colors.primary, 0.1),
//     '&:hover': {
//       backgroundColor: alpha(colors.primary, 0.15),
//     },
//     '& .MuiListItemText-primary': {
//       color: colors.primary,
//       fontWeight: 500,
//     },
//   }),
// }));

// const OfflineIndicator = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(1, 2),
//   backgroundColor: '#FEE2E2',
//   color: '#EF4444',
//   margin: theme.spacing(1),
//   borderRadius: theme.spacing(1),
// }));

// const Drawer = styled(MuiDrawer, { 
//   shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile'
// })(({ theme, open, isMobile }) => ({
//   width: drawerWidth,
//   flexShrink: 0,
//   whiteSpace: 'nowrap',
//   boxSizing: 'border-box',
//   ...(open && {
//     ...openedMixin(theme),
//     '& .MuiDrawer-paper': openedMixin(theme),
//   }),
//   ...(!open && !isMobile && {
//     ...closedMixin(theme),
//     '& .MuiDrawer-paper': closedMixin(theme),
//   }),
// }));

// // Define menu items
// const menuItems = [
//   {
//     text: 'Dashboard',
//     icon: <DashboardIcon />,
//     path: '/dashboard',
//   },
//   {
//     text: 'User Permission',
//     icon: <SecurityIcon />,
//     path: '/user-permission',
//   },
//   {
//     text: 'Masters',
//     icon: <FolderIcon />,
//     path: '/masters',
//     subItems: [
//       { text: 'All Projects', path: '/masters/all-projects' },
//       { text: 'All Blocks', path: '/masters/all-blocks' },
//       { text: 'All Plot Types', path: '/masters/all-plot-types' },
//       { text: 'Plot Details', path: '/masters/plot-details' },
//     ],
//   },
//   {
//     text: 'Associate',
//     icon: <GroupAddIcon />,
//     path: '/associate',
//     subItems: [
//       { text: 'Add Associate', path: '/associate/add-associate' },
//       { text: 'Associate Details', path: '/associate/associate-details' },
//       { text: 'Associate Tree', path: '/associate/associate-tree' },
//     ],
//   },
//   {
//     text: 'Customer',
//     icon: <PersonIcon />,
//     path: '/customer',
//     subItems: [
//       { text: 'Add Customer', path: '/customer/add-customer' },
//       { text: 'Customer Details', path: '/customer/customer-details' },
//     ],
//   },
//   {
//     text: 'Manage Plots',
//     icon: <HomeWorkIcon />,
//     path: '/manage-plots',
//     subItems: [
//       { text: 'Plot Booking', path: '/manage-plots/plot-booking' },
//       { text: 'All Bookings', path: '/manage-plots/all-bookings' },
//       { text: 'Plot Registry', path: '/manage-plots/plot-registry' },
//     ],
//   },
//   {
//     text: 'Payment',
//     icon: <PaymentIcon />,
//     path: '/payment',
//     subItems: [
//       { text: 'One Time Payment', path: '/payment/one-time-payment' },
//       { text: 'All One Time Payments', path: '/payment/all-one-time-payments' },
//       { text: 'EMI Payment', path: '/payment/emi-payment' },
//       { text: 'All EMI Payments', path: '/payment/all-emi-payments' },
//     ],
//   },
//   {
//     text: 'Manage Lead',
//     icon: <ContactsIcon />,
//     path: '/manage-lead',
//     subItems: [
//       { text: 'Sources', path: '/manage-lead/sources' },
//       { text: 'Lead Types', path: '/manage-lead/lead-types' },
//       { text: 'All Leads', path: '/manage-lead/all-leads' },
//       { text: 'All Enquiry', path: '/manage-lead/all-enquiry' },
//     ],
//   },
//   {
//     text: 'Manage Land',
//     icon: <LandscapeIcon />,
//     path: '/manage-land',
//     subItems: [
//       { text: 'Add Broker', path: '/manage-land/add-broker' },
//       { text: 'Add Farmer', path: '/manage-land/add-farmer' },
//       { text: 'Purchase Land', path: '/manage-land/purchase-land' },
//     ],
//   },
// ];

// const SidebarDrawer = ({ open, onDrawerClose, isMobile }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const theme = useTheme();
//   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

//   // States
//   const [expandedItem, setExpandedItem] = useState('');
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   // Check online status
//   useEffect(() => {
//     const handleOnlineStatus = () => {
//       setIsOnline(navigator.onLine);
//     };

//     window.addEventListener('online', handleOnlineStatus);
//     window.addEventListener('offline', handleOnlineStatus);

//     return () => {
//       window.removeEventListener('online', handleOnlineStatus);
//       window.removeEventListener('offline', handleOnlineStatus);
//     };
//   }, []);

//   // Auto-expand menu item based on current location
//   useEffect(() => {
//     const currentMenuItem = menuItems.find(item =>
//       item.subItems?.some(subItem => location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/'))
//     );
//     if (currentMenuItem) {
//       setExpandedItem(currentMenuItem.text);
//     }
//   }, [location.pathname]);

//   // Handle navigation
//   const handleNavigation = (path) => {
//     navigate(path);
//     if (isMobile) {
//       onDrawerClose();
//     }
//   };

//   // Handle menu expansion
//   const handleExpand = (text) => {
//     setExpandedItem(expandedItem === text ? '' : text);
//   };

//   // Check if menu item is active
//   const isMainItemActive = (item) => {
//     if (item.path === location.pathname) return true;

//     return item.subItems
//       ? item.subItems.some(subItem => location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/'))
//       : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
//   };

//   // Drawer content JSX
//   const drawerContent = (
//     <DrawerContent>
//       <LogoSection>
//         <StyledLogoContainer>
//           <LogoIcon>
//             <div style={{ width: 14, height: 14, backgroundColor: '#fff', borderRadius: '50%' }} />
//           </LogoIcon>
//           {open && (
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 500,
//                 color: colors.text.primary,
//                 fontSize: '1.1rem',
//               }}
//             >
//               Americorp Infra
//             </Typography>
//           )}
//         </StyledLogoContainer>

//         <IconButton onClick={onDrawerClose} sx={{ ml: 'auto', display: { md: 'none' } }}>
//           <ChevronLeftIcon />
//         </IconButton>
//       </LogoSection>

//       {!isOnline && open && (
//         <OfflineIndicator>
//           <WifiOffIcon sx={{ mr: 1, fontSize: '1rem' }} />
//           <Typography variant="caption" fontWeight={500}>
//             You're offline
//           </Typography>
//         </OfflineIndicator>
//       )}

//       <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
//         {menuItems.map((item) => (
//           <React.Fragment key={item.text}>
//             <ListItem disablePadding>
//               <Tooltip 
//                 title={!open ? item.text : ""}
//                 placement="right"
//                 arrow
//                 disableHoverListener={open}
//               >
//                 <StyledListItemButton
//                   active={isMainItemActive(item) ? 1 : 0}
//                   onClick={() => {
//                     if (item.subItems) {
//                       handleExpand(item.text);
//                     } else {
//                       handleNavigation(item.path);
//                     }
//                   }}
//                   sx={{
//                     justifyContent: open ? 'initial' : 'center',
//                     px: open ? 2.5 : 2,
//                     backgroundColor: isMainItemActive(item) ? alpha(colors.primary, 0.1) : 'transparent',
//                   }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       minWidth: 0,
//                       mr: open ? 2 : 'auto',
//                       justifyContent: 'center',
//                       color: isMainItemActive(item) ? colors.primary : colors.secondary,
//                     }}
//                   >
//                     {item.icon}
//                   </ListItemIcon>
//                   <ListItemText
//                     primary={item.text}
//                     sx={{
//                       opacity: open ? 1 : 0,
//                       '& .MuiTypography-root': {
//                         fontSize: '0.9rem',
//                         fontWeight: isMainItemActive(item) ? 500 : 400,
//                         color: isMainItemActive(item) ? colors.primary : colors.text.primary,
//                       },
//                     }}
//                   />
//                   {item.subItems && open && (
//                     <Box 
//                       component={expandedItem === item.text ? ExpandLess : ExpandMore}
//                       sx={{
//                         color: colors.secondary,
//                       }}
//                     />
//                   )}
//                 </StyledListItemButton>
//               </Tooltip>
//             </ListItem>

//             {item.subItems && (
//               <Collapse in={expandedItem === item.text && open} timeout="auto" unmountOnExit>
//                 <List component="div" disablePadding>
//                   {item.subItems.map((subItem) => (
//                     <StyledSubItemButton
//                       key={subItem.text}
//                       active={location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/') ? 1 : 0}
//                       onClick={() => handleNavigation(subItem.path)}
//                     >
//                       <ListItemText
//                         primary={subItem.text}
//                         sx={{
//                           '& .MuiTypography-root': {
//                             fontSize: '0.85rem',
//                             fontWeight: (location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/')) ? 500 : 400,
//                             color: (location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/')) ? colors.primary : colors.text.secondary,
//                           },
//                         }}
//                       />
//                     </StyledSubItemButton>
//                   ))}
//                 </List>
//               </Collapse>
//             )}
//           </React.Fragment>
//         ))}
//       </List>
//     </DrawerContent>
//   );

//   // Mobile drawer variant
//   if (isMobile) {
//     return (
//       <>
//         <MuiDrawer
//           variant="temporary"
//           open={open}
//           onClose={onDrawerClose}
//           ModalProps={{
//             keepMounted: true,
//           }}
//           sx={{
//             display: { xs: 'block', md: 'none' },
//             '& .MuiDrawer-paper': {
//               boxSizing: 'border-box',
//               width: drawerWidth,
//               backgroundColor: colors.background.sidebar,
//               borderRight: 'none',
//               boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
//             },
//           }}
//         >
//           {drawerContent}
//         </MuiDrawer>

//         <Backdrop
//           sx={{ 
//             color: '#fff', 
//             zIndex: (theme) => theme.zIndex.drawer - 1,
//             display: { md: 'none' }
//           }}
//           open={open}
//           onClick={onDrawerClose}
//         />
//       </>
//     );
//   }

//   // Desktop drawer variant
//   return (
//     <Drawer 
//       variant="permanent" 
//       open={open} 
//       isMobile={isMobile}
//       sx={{
//         display: { xs: 'none', md: 'block' },
//       }}
//     >
//       {drawerContent}
//     </Drawer>
//   );
// };

// export default SidebarDrawer;



import React, { useState, useEffect, useCallback } from 'react';
import { styled, alpha } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate, useLocation } from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import LandscapeOutlinedIcon from '@mui/icons-material/LandscapeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import axiosInstance from '../axiosInstance';


// Theme colors
const colors = {
  primary: '#6563FF',
  secondary: '#959CB6',
  background: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
    sidebar: '#FFFFFF',
    active: '#F1F0FF'
  },
  text: {
    primary: '#333333',
    secondary: '#6E6E6E',
    light: '#FFFFFF'
  },
  divider: 'rgba(0, 0, 0, 0.05)',
};

const drawerWidth = 240;

// Styled components
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: colors.background.sidebar,
  borderRight: `1px solid ${colors.divider}`,
  height: '100%',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: colors.background.sidebar,
  width: 0,
  borderRight: `1px solid ${colors.divider}`,
  height: '100%',
});

// const LogoSection = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: theme.spacing(2.5, 2),
//   height: 80,
//   backgroundColor: colors.background.sidebar,
//   position: 'sticky',
//   top: 0,
//   zIndex: 1,
//   borderBottom: `1px solid ${colors.divider}`,
//   '&::after': {
//     content: '""',
//     position: 'absolute',
//     bottom: 0,
//     left: '50%',
//     transform: 'translateX(-50%)',
//     width: '80%',
//     height: '1px',
//     background: `linear-gradient(90deg, transparent 0%, ${colors.divider} 50%, transparent 100%)`,
//   }
// }));


const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2.5, 2),
  height: 80,
  backgroundColor: colors.background.sidebar,
  position: 'sticky',
  top: 0,
  zIndex: 1,
  borderBottom: `1px solid ${colors.divider}`,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: '1px',
    background: `linear-gradient(90deg, transparent 0%, ${colors.divider} 50%, transparent 100%)`,
  }
}));
const StyledLogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  // borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // background: 'linear-gradient(135deg, #6665FF, #7B78FF)',
  // boxShadow: '0 2px 4px rgba(101, 99, 255, 0.2)',
}));

const DrawerContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: alpha(colors.secondary, 0.2),
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: alpha(colors.secondary, 0.4),
  },
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active'
})(({ theme, active }) => ({
  borderRadius: '4px',
  margin: '2px 8px',
  padding: '8px 12px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(colors.primary, 0.08),
  },
  ...(active && {
    backgroundColor: colors.background.active,
    '& .MuiListItemIcon-root': {
      color: colors.primary,
    },
    '& .MuiListItemText-primary': {
      color: colors.primary,
      fontWeight: 500,
    },
  }),
}));

const StyledSubItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active'
})(({ theme, active }) => ({
  margin: '2px 8px 2px 24px',
  padding: '6px 12px',
  borderRadius: '4px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(colors.primary, 0.08),
  },
  ...(active && {
    backgroundColor: colors.background.active,
    '& .MuiListItemText-primary': {
      color: colors.primary,
      fontWeight: 500,
    },
  }),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  height: '100%',
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  color: theme.palette.error.main,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile'
})(({ theme, open, isMobile }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  position: 'fixed',
  height: '100%',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': {
      ...openedMixin(theme),
      position: 'fixed',
    },
  }),
  ...(!open && !isMobile && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': {
      ...closedMixin(theme),
      position: 'fixed',
    },
  }),
}));

// Define base menu items with their icons and paths
const allMenuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardOutlinedIcon />,
    path: '/dashboard',
    category: 'Dashboard',
    permission: 'Overview',
  },
  {
    text: 'User Permission',
    icon: <SecurityOutlinedIcon />,
    path: '/user-permission',
    category: 'Permission',
    permission: 'User Permission',
  },
  {
    text: 'Masters',
    icon: <FolderOutlinedIcon />,
    path: '/masters',
    category: 'Masters',
    subItems: [
      { text: 'All Projects', path: '/masters/all-projects-site', permission: 'All Project' },
      { text: 'All Blocks', path: '/masters/all-blocks', permission: 'All Block' },
      { text: 'All Plot Types', path: '/masters/all-plot-types', permission: 'All Plot Types' },
      { text: 'PLC/Development Rate', path: '/masters/all-plot-rate-master', permission: 'Plc/Devlopment Rate' },
      { text: 'All Ranks', path: '/masters/all-ranks', permission: 'All Ranks' },
      { text: 'Plot Details', path: '/masters/all-plot-details', permission: 'Plot Details' },
      { text: 'Project Manipulation', path: '/masters/project-manipulation', permission: 'Project Manipulation' },
    ],
  },
  {
    text: 'Associate',
    icon: <PeopleOutlineOutlinedIcon />,
    path: '/associates',
    category: 'Associate',
    subItems: [
      { text: 'Add Associate', path: '/associates/add-associates', permission: 'Add Associate' },
      { text: 'Associate Tree', path: '/associates/associates-trees', permission: 'Associate Tree' },
      { text: 'Associate Details', path: '/associates/all-associates', permission: 'Associate Details' },
    ],
  },
  {
    text: 'Customer',
    icon: <PersonOutlineOutlinedIcon />,
    path: '/customers',
    category: 'Customer',
    subItems: [
      { text: 'Add Customer', path: '/customers/add-customer', permission: 'Add Customer' },
      { text: 'Customer Details', path: '/customers/all-customer', permission: 'Customer Details' },
    ],
  },
  {
    text: 'Manage Plots',
    icon: <BusinessOutlinedIcon />,
    path: '/plots',
    category: 'Plot Management',
    subItems: [
      { text: 'Plot Booking', path: '/plots/add-plot-booking', permission: 'Plot Booking' },
      { text: 'All Bookings', path: '/plots/all-plot-bookings', permission: 'All Bookings' },
    ],
  },
  {
    text: 'Payment',
    icon: <PaymentOutlinedIcon />,
    path: '/payment',
    category: 'Payment',
    subItems: [
      { text: 'One Time Payment', path: '/payment/one-time-payment', permission: 'One Time Payment' },
      { text: 'All One Time Payment', path: '/payment/all-one-time-payment', permission: 'All One Time Payment' },
      { text: 'EMI Plan', path: '/payment/emi-generator', permission: 'EMI Plan' },
      { text: 'EMI Payment', path: '/payment/emi-payment', permission: 'EMI Payment' },
      { text: 'All EMI Payment', path: '/payment/all-emi-payments', permission: 'All EMI Payment' },
      { text: 'Cheque Clearence', path: '/payment/cheque-clearence', permission: 'Cheque Clearence' },

    ],
  },
  {
    text: 'Manage Lead',
    icon: <ContactsOutlinedIcon />,
    path: '/leads',
    category: 'Manage Lead',
    subItems: [
      { text: 'Sources', path: '/leads/sources', permission: 'Sources' },
      { text: 'Lead Types', path: '/leads/lead-types', permission: 'Lead Types' },
      { text: 'All Leads', path: '/leads/all-leads', permission: 'All Leads' },
      { text: 'All Enquiry', path: '/leads/all-enquiry', permission: 'All Enquiry' },
      { text: 'Assign Enquiry', path: '/leads/all-assign-enquiry', permission: 'All Assign Enquiry' },

    ],
  },
  {
    text: 'Manage Land',
    icon: <LandscapeOutlinedIcon />,
    path: '/Land-Management',
    category: 'Manage Land',
    subItems: [
      { text: 'Add Broker', path: '/Land-Management/add-Broker', permission: 'Add Broker' },
      { text: 'Add Farmer', path: '/Land-Management/add-farmer', permission: 'Add Farmer' },
      { text: 'Purchase Land', path: '/Land-Management/PurchaseLand', permission: 'Purchase Land' },
      { text: 'Add Payment', path: '/Land-Management/Add-Payment', permission: 'Add Payment' },
    ],
  },
  {
    text: 'Reports',
    icon: <AssessmentOutlinedIcon />,
    path: '/Reports',
    category: 'Reports',
    subItems: [
      { text: 'Pending EMI', path: '/Reports/pending-emi', permission: 'Pending EMI' },
      { text: 'Downline Tree', path: '/Reports/down-line-tree', permission: 'Downline Tree' },
      { text: 'Monthly EMI', path: '/Reports/monthly-emi-payment', permission: 'Monthly EMI' },
      { text: 'EMI Book Plot', path: '/Reports/emi-book-plot', permission: 'EMI Book Plot' },
      { text: 'Bounce Cheque', path: '/Reports/bounce-Cheque', permission: 'Bounce Cheque' },
      { text: 'Full Plot Booking', path: '/Reports/full-payment-book-plots', permission: 'Full Plot Booking' },
    ],
  },
];

const SidebarDrawer = ({ open, onDrawerToggle, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // States
  const [expandedItem, setExpandedItem] = useState('');
  const [userRole, setUserRole] = useState('');
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleMenuItems, setVisibleMenuItems] = useState([]);

  // Get current user role from localStorage
  const getUserRole = useCallback(() => {
    const role = sessionStorage.getItem('userRole');
    return role ? role.toUpperCase() : 'GUEST';
  }, []);

  // Fetch permissions from API
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const currentRole = getUserRole();
        setUserRole(currentRole);

        const response = await axiosInstance.get(
          `/realEstate/user-permission/getPermissionByRoleName?roleName=${currentRole}`
        );

        if (response.data && response.data.status === 200 && response.data.data && response.data.data.length > 0) {
          setPermissions(response.data.data[0].permissions || {});
        } else {
          // If role has no permissions defined, use empty object
          setPermissions({});
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching permissions:', err);
        setError('Failed to load permissions. Some menu items may not be displayed.');
        // If API call fails, still try to use role-based default items
        setPermissions({});
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [getUserRole]);

  // Filter menu items based on permissions
  useEffect(() => {
    if (Object.keys(permissions).length === 0 && !loading) {
      // If permissions are empty, show basic items based on role
      const basicItems = userRole === 'ADMIN'
        ? allMenuItems
        : allMenuItems.filter(item =>
          ['Dashboard', 'Customer', 'Associate'].includes(item.category));
      setVisibleMenuItems(basicItems);
      return;
    }

    // Filter menu items based on permissions
    const filteredItems = allMenuItems.filter(item => {
      // Special case for Dashboard which everyone should see
      if (item.text === 'Dashboard') return true;

      // Check if the item category exists in permissions
      if (!permissions[item.category]) return false;

      // If item has direct permission (not subItems)
      if (item.permission) {
        return permissions[item.category].includes(item.permission);
      }

      // If item has subItems, check if any of them are permitted
      if (item.subItems) {
        const permittedSubItems = item.subItems.filter(
          subItem => permissions[item.category].includes(subItem.permission)
        );
        return permittedSubItems.length > 0;
      }

      return false;
    }).map(item => {
      // If item has subItems, filter them based on permissions
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter(
          subItem => !subItem.permission || permissions[item.category]?.includes(subItem.permission)
        );
        return { ...item, subItems: filteredSubItems };
      }
      return item;
    });

    setVisibleMenuItems(filteredItems);
  }, [permissions, loading, userRole]);

  // Auto-expand menu item based on current location
  useEffect(() => {
    const currentMenuItem = visibleMenuItems.find(item =>
      item.subItems?.some(subItem => location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/'))
    );
    if (currentMenuItem) {
      setExpandedItem(currentMenuItem.text);
    }
  }, [location.pathname, visibleMenuItems]);

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onDrawerToggle();
    }
  };

  // Handle menu expansion
  const handleExpand = (text) => {
    setExpandedItem(expandedItem === text ? '' : text);
  };

  // Check if menu item is active
  const isMainItemActive = (item) => {
    if (item.path === location.pathname) return true;

    return item.subItems
      ? item.subItems.some(subItem => location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/'))
      : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  };

  // Drawer content JSX
  const drawerContent = (
    <DrawerContent>
      <LogoSection>
        <StyledLogoContainer>
          <LogoIcon>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: colors.text.primary
              }}
            >
              KM Builders
            </Typography>
          </LogoIcon>
        </StyledLogoContainer>
      </LogoSection>



      {loading ? (
        <LoadingContainer>
          <CircularProgress size={24} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading menu...
          </Typography>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <WarningAmberOutlinedIcon sx={{ mb: 1 }} />
          <Typography variant="body2" color="inherit" align="center">
            {error}
          </Typography>
        </ErrorContainer>
      ) : (
        <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
          {visibleMenuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <StyledListItemButton
                  active={isMainItemActive(item) ? 1 : 0}
                  onClick={() => {
                    if (item.subItems) {
                      handleExpand(item.text);
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                  sx={{
                    backgroundColor: isMainItemActive(item) ? colors.background.active : 'transparent',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isMainItemActive(item) ? colors.primary : colors.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.875rem',
                        fontWeight: isMainItemActive(item) ? 600 : 600,
                        color: isMainItemActive(item) ? colors.primary : colors.text.primary,
                      },
                    }}
                  />
                  {item.subItems && (
                    <Box
                      component={expandedItem === item.text ? ExpandLess : ExpandMore}
                      sx={{
                        color: colors.secondary,
                      }}
                    />
                  )}
                </StyledListItemButton>
              </ListItem>

              {item.subItems && (
                <Collapse in={expandedItem === item.text && open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <StyledSubItemButton
                        key={subItem.text}
                        active={location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/') ? 1 : 0}
                        onClick={() => handleNavigation(subItem.path)}
                      >
                        <ListItemText
                          primary={subItem.text}
                          sx={{
                            '& .MuiTypography-root': {
                              fontSize: '0.875rem',
                              fontWeight: (location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/')) ? 600 : 600,
                              color: (location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/')) ? colors.primary : colors.text.secondary,
                            },
                          }}
                        />
                      </StyledSubItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      )}
    </DrawerContent>
  );

  // Mobile drawer variant
  if (isMobile) {
    return (
      <>
        <MuiDrawer
          variant="temporary"
          open={open}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: colors.background.sidebar,
              borderRight: 'none',
              boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          {drawerContent}
        </MuiDrawer>

        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer - 1,
            display: { md: 'none' }
          }}
          open={open}
          onClick={onDrawerToggle}
        />
      </>
    );
  }

  // Desktop drawer variant
  return (
    <Drawer
      variant="permanent"
      open={open}
      isMobile={isMobile}
      sx={{
        display: { xs: 'none', md: 'block' },
        position: 'fixed',
        zIndex: 1200,
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SidebarDrawer;