// import React, { useState, useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import {
//   Box,
//   CssBaseline,
//   Toolbar,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import SidebarDrawer from "../components/SidebarDrawer";
// import Navbar from "../components/Navbar";

// const LayoutComponent = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [open, setOpen] = useState(!isMobile);

//   useEffect(() => {
//     setOpen(!isMobile);
//   }, [isMobile]);

//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       <CssBaseline />
//       <Navbar open={open} onDrawerOpen={handleDrawerOpen} isMobile={isMobile} />
//       <SidebarDrawer
//         open={open}
//         onDrawerClose={handleDrawerClose}
//         isMobile={isMobile}
//       />
//       <Box
//         component="main"
//         sx={{
//           backgroundColor: "#F9F9FC",
//           flexGrow: 1,
//           p: { xs: 2, sm: 3 },
//           width: "100%",
//           transition: theme.transitions.create("margin", {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//           }),
//           ...(open && {
//             marginLeft: { xs: 0, sm: 0 },
//           }),
//         }}
//       >
//         <Toolbar />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default LayoutComponent;







// import React, { useState, useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import {
//   Box,
//   CssBaseline,
//   Toolbar,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import SidebarDrawer from "../components/SidebarDrawer";
// import Navbar from "../components/Navbar";

// const drawerWidth = 260; 

// const LayoutComponent = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [open, setOpen] = useState(!isMobile);
//   const [forceRefresh, setForceRefresh] = useState(false);

//   const handleDrawerToggle = () => {
//     setOpen(!open);
//   };

//   useEffect(() => {
//     const handleStorageChange = (event) => {
//       if (event.key === 'userRole') {
//         setForceRefresh(true);
//         setTimeout(() => setForceRefresh(false), 1000);
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   return (
//     <Box sx={{ display: "flex" }}>
//       <CssBaseline />
//       <Navbar
//         open={open}
//         onDrawerOpen={handleDrawerToggle}
//         isMobile={isMobile}
//         drawerWidth={drawerWidth}
//       />
//       <SidebarDrawer
//         open={open}
//         onDrawerClose={handleDrawerToggle}
//         isMobile={isMobile}
//         forceRefresh={forceRefresh}
//       />
//       <Box
//         component="main"
//         sx={{
//           backgroundColor: "#F9F9FC",
//           flexGrow: 1,
//           p: { xs: 2, sm: 3 },
//           width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
//           marginLeft: { sm: 0 },
//           transition: theme.transitions.create(["width", "margin"], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//           }),
//         }}
//       >
//         <Toolbar />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default LayoutComponent;




import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip,
  Badge,
  InputBase,
  Divider,
} from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SidebarDrawer from "../components/SidebarDrawer";
import MyProfile from "../components/MyProfile";
// Custom styled components
const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.04),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.06),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.black, 0.54),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const StyledMenuButton = styled(IconButton)(({ theme }) => ({
  width: 38,
  height: 38,
  borderRadius: 8,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
  }
}));

const MainContentContainer = styled(Box)(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    [theme.breakpoints.up('md')]: {
      marginLeft: '240px',
      width: `calc(100% - 240px)`,
    },
  }),
  ...(!open && {
    [theme.breakpoints.up('md')]: {
      marginLeft: 0,
      width: '100%',
    },
  }),
}));

const LayoutComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);

  useEffect(() => {
    // On mobile, sidebar should be closed by default
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const [showProfile, setShowProfile] = useState(false);

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: '100vh', position: 'relative' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        color="default"
        sx={{
          width: { xs: '100%', md: open ? `calc(100% - 240px)` : '100%' },
          ml: { md: open ? '240px' : 0 },
          backgroundColor: "#ffffff",
          color: "#333333",
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          zIndex: theme.zIndex.drawer - 1,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StyledMenuButton
              edge="start"
              onClick={handleDrawerToggle}
              aria-label="Toggle sidebar"
            >
              <MenuIcon />
            </StyledMenuButton>

            <SearchContainer>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </SearchContainer>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Notifications">
              <IconButton size="large" color="inherit">
                <Badge badgeContent={3} color="primary">
                  <NotificationsNoneOutlinedIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, my: 'auto' }} />

            <Tooltip title="Profile">
              <IconButton
                sx={{ p: 0, ml: 1 }}
                onClick={handleProfileClick}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                  <PersonOutlineOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <SidebarDrawer
        open={open}
        onDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
      />

      <MainContentContainer component="main" open={open} sx={{ backgroundColor: "#F8F9FA" }}>
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </MainContentContainer>
      {showProfile && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1300,
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            onClick={handleCloseProfile}
          />
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflowY: 'auto',
            }}
          >
            <MyProfile onClose={handleCloseProfile} />
          </div>
        </div>
      )}
    </Box>

  );
};

export default LayoutComponent;