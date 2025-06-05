// import React from 'react';
// import { styled } from '@mui/material/styles';
// import MuiAppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
// import Box from '@mui/material/Box';

// const drawerWidth = 240;

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })(({ theme, open, isMobile }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(['width', 'margin'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   backgroundColor: '#fff',
//   boxShadow: 'none',
//   borderBottom: '1px solid #eee',
//   ...(open && !isMobile && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(['width', 'margin'], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

// const Navbar = ({ open, onDrawerOpen, isMobile }) => {
//   return (
//     <AppBar position="fixed" open={open} isMobile={isMobile}>
//       <Toolbar>
//         <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={onDrawerOpen}
//             edge="start"
//             sx={{
//               marginRight: 5,
//               ...(!isMobile && open && { display: 'none' }),
//               color: '#000',
//             }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Box 
//             component="img"
//             src="/path-to-your-logo.png"
//             alt="CRMS"
//             sx={{ height: 40 }}
//           />
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;



import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import logoimage from "../assets/loginpageimage/KMBuilderblack.png"

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, isMobile }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#fff',
  boxShadow: 'none',
  borderBottom: '1px solid #eee',
  ...(open && !isMobile && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const ProfileButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const Navbar = ({ open, onDrawerOpen, isMobile }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goMyProfile =()=>{
    navigate('/dashboard/my-profile');
  }

  const goToDashboard =()=>{
    navigate("/dashboard");
  }

  const handleLogout =()=>{
    navigate("/");
  }

  return (
    <AppBar position="fixed" open={open} isMobile={isMobile}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side - Menu and Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerOpen}
            edge="start"
            sx={{
              marginRight: 2,
              ...(!isMobile && open && { display: 'none' }),
              color: '#000',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            src={logoimage}
            alt="CRMS"
            sx={{ height: 40 }}
          />
        </Box>

        {/* Right side - Profile Menu */}
        <Box>
          <ProfileButton
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
            startIcon={
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#f5f5f5' }}>
                <PersonIcon sx={{ color: '#757575', fontSize: 20 }} />
              </Avatar>
            }
          >
            My Profile
          </ProfileButton>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 2,
              sx: {
                width: 200,
                maxWidth: '100%',
                mt: 1.5,
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={goMyProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={goToDashboard}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              Dashboard
            </MenuItem>
            <Divider />
            <MenuItem sx={{ color: 'error.main' }} onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;