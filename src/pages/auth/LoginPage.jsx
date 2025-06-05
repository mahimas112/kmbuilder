// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   TextField,
//   Button,
//   FormControlLabel,
//   Checkbox,
//   Link,
//   useTheme,
//   Stack,
//   alpha,
//   Grid,
//   Fade,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   InputAdornment,
//   IconButton
// } from '@mui/material';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import EmailIcon from '@mui/icons-material/Email';
// import LockIcon from '@mui/icons-material/Lock';
// import HomeWorkIcon from '@mui/icons-material/HomeWork';
// import ApartmentIcon from '@mui/icons-material/Apartment';
// import AssessmentIcon from '@mui/icons-material/Assessment';
// import PeopleIcon from '@mui/icons-material/People';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../axiosInstance';


// const LoginPage = () => {

//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     rememberMe: false
//   });

//   const [validationErrors, setValidationErrors] = useState({
//     email: "",
//     password: ""
//   });
//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   });

//   const [error, setError] = useState(null);

//   const [currentSlide, setCurrentSlide] = useState(0);
//   const carouselContent = [
//     {
//       title: "Welcome to Our Portal",
//       subtitle: "Manage your real estate business with our comprehensive solution",
//       description: "Access property listings, client information, and performance analytics all in one place.",
//       icon: <HomeWorkIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
//     },
//     {
//       title: "Property Management",
//       subtitle: "Handle all your properties in one place",
//       description: "Easily track maintenance requests, lease agreements, and occupancy rates. Get real-time updates on your entire property portfolio.",
//       icon: <ApartmentIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
//     },
//     {
//       title: "Powerful Analytics",
//       subtitle: "Make data-driven decisions",
//       description: "Access detailed reports and analytics to track performance metrics, market trends, and financial forecasts for your real estate investments.",
//       icon: <AssessmentIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
//     },
//     {
//       title: "Client Management",
//       subtitle: "Build stronger relationships",
//       description: "Maintain detailed client profiles, track communication history, and provide personalized service to improve client satisfaction and retention.",
//       icon: <PeopleIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
//     }
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % carouselContent.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [carouselContent.length]);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'rememberMe' ? checked : value
//     }));

//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({
//         ...prev,
//         [name]: ""
//       }));
//     }
//   };

//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const validateForm = () => {
//     let isValid = true;
//     const errors = { email: "", password: "" };

//     if (!formData.email) {
//       errors.email = "Email is required";
//       isValid = false;
//     } 
//     // else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//     //   errors.email = "Please enter a valid email address";
//     //   isValid = false;
//     // }

//     if (!formData.password) {
//       errors.password = "Password is required";
//       isValid = false;
//     } else if (formData.password.length < 6) {
//       errors.password = "Password must be at least 6 characters";
//       isValid = false;
//     }

//     setValidationErrors(errors);
//     return isValid;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setFormSubmitted(true);
  
//     if (!validateForm()) return;
  
//     setIsLoading(true);
//     setError(null);
  
//     try {
//       const loginResponse = await axiosInstance.post(
//         '/realEstate/user/login',
//         {
//           email: formData.email,
//           password: formData.password,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': '*/*',
//           },
//         }
//       );
  
//       if (loginResponse.data && loginResponse.data.status === 200) {
//         const storage = formData.rememberMe ? localStorage : sessionStorage;
//         const role = loginResponse.data.data.role;
  
//         // Store essential user data
//         storage.setItem('userEmail', formData.email);
//         storage.setItem('accessToken', loginResponse.data.data.accessToken);
//         storage.setItem('userRole', role);
//         storage.setItem('associateCode', loginResponse.data.data.associateCode);
//         storage.setItem('userCode', loginResponse.data.data.userCode);
  
//         // Fetch user permissions
//         try {
//           const permissionsResponse = await axiosInstance.get(
//             '/realEstate/user-permission/getAll',
//             {
//               headers: {
//                 'Authorization': `Bearer ${loginResponse.data.data.accessToken}`,
//                 'Accept': '*/*',
//               },
//             }
//           );
  
//           if (permissionsResponse.data && permissionsResponse.data.status === 200) {
//             const rolePermissions = permissionsResponse.data.data.find(
//               p => p.roleName === role.toUpperCase()
//             );
  
//             if (rolePermissions) {
//               storage.setItem('userPermissions', JSON.stringify(rolePermissions.permissions));
//             }
//           }
//         } catch (permissionsError) {
//           console.error('Failed to fetch permissions:', permissionsError);
//         }
  
//         // Redirect based on user role
//         let redirectPath;
//         const roleUpperCase = role.toUpperCase();
        
//         if (roleUpperCase === 'ADMIN') {
//           redirectPath = '/dashboard';
//         } else if (roleUpperCase === 'ASSOCIATE') {
//           redirectPath = '/associate-dashboard';
//         } else if (roleUpperCase === 'CLIENT') {
//           redirectPath = '/client-dashboard';
//         } else if (roleUpperCase === 'AGENT') {
//           redirectPath = '/agent-dashboard';
//         } else {
//           redirectPath = '/dashboard';
//         }
  
//         setSnackbar({
//           open: true,
//           message: `Login successful! Redirecting to ${role.toLowerCase()} dashboard...`,
//           severity: 'success',
//         });
  
//         // Short delay to allow the snackbar to be seen
//         setTimeout(() => {
//           navigate(redirectPath);
//         }, 1000);
//       } else {
//         throw new Error('Login failed. Please check your credentials.');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
  
//       const errorMessage = err?.response?.data?.data ||
//         err?.response?.data?.message ||
//         err.message ||
//         'Login failed. Please check your credentials.';
//       setError(errorMessage);
  
//       setSnackbar({
//         open: true,
//         message: errorMessage,
//         severity: 'error',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const primaryBlue = '#0B2447';
//   const secondaryBlue = '#19376D';
//   const accentBlue = '#576CBC';
//   const highlightBlue = '#5D9CEC';
//   const bgColor = '#F8F9FD';
//   const formBg = '#FFFFFF';
//   const textDark = '#1E293B';
//   const textLight = '#FFFFFF';

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: { xs: 2, sm: 3 },
//         background: `linear-gradient(135deg, ${bgColor} 0%, #EEF2FF 100%)`,
//       }}
//     >
//       <Container maxWidth="lg">
//         <Grid
//           container
//           spacing={0}
//           sx={{
//             boxShadow: '0 15px 50px rgba(0, 0, 0, 0.12)',
//             borderRadius: 4,
//             overflow: 'hidden',
//             minHeight: { md: '600px' }
//           }}
//         >
//           <Grid
//             item
//             xs={12}
//             md={6}
//             sx={{
//               background: `linear-gradient(145deg, ${primaryBlue} 0%, ${secondaryBlue} 100%)`,
//               padding: { xs: 4, md: 6 },
//               display: { xs: 'none', md: 'flex' },
//               flexDirection: 'column',
//               justifyContent: 'center',
//               position: 'relative',
//               overflow: 'hidden',
//               '&::before': {
//                 content: '""',
//                 position: 'absolute',
//                 width: '200%',
//                 height: '200%',
//                 top: '-50%',
//                 left: '-50%',
//                 background: `radial-gradient(circle, ${alpha('#FFFFFF', 0.08)} 0%, ${alpha('#FFFFFF', 0)} 70%)`,
//               },
//               '&::after': {
//                 content: '""',
//                 position: 'absolute',
//                 width: '180%',
//                 height: '180%',
//                 bottom: '-90%',
//                 right: '-90%',
//                 background: `radial-gradient(circle, ${alpha('#FFFFFF', 0.05)} 0%, ${alpha('#FFFFFF', 0)} 60%)`,
//                 zIndex: 0,
//               }
//             }}
//           >
//             <Box position="relative" zIndex={1} sx={{ mb: 6 }}>
//               <Stack direction="row" spacing={2} alignItems="center">
//                 <HomeWorkIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
//                 <Typography variant="h4" fontWeight="700" color="#FFFFFF" sx={{ letterSpacing: '0.5px' }}>
//                   REALTY CRMS
//                 </Typography>
//               </Stack>
//             </Box>

//             <Box position="relative" zIndex={1} sx={{ height: '300px', position: 'relative' }}>
//               {carouselContent.map((slide, index) => (
//                 <Fade
//                   key={index}
//                   in={currentSlide === index}
//                   timeout={800}
//                   style={{
//                     display: currentSlide === index ? 'block' : 'none',
//                     position: 'absolute',
//                     width: '100%'
//                   }}
//                 >
//                   <Box>
//                     <Box
//                       sx={{
//                         mb: 2,
//                         display: 'inline-flex',
//                         p: 1.5,
//                         borderRadius: 2,
//                         backgroundColor: alpha('#FFFFFF', 0.1)
//                       }}
//                     >
//                       {slide.icon}
//                     </Box>
//                     <Typography
//                       variant="h3"
//                       component="h1"
//                       color={textLight}
//                       fontWeight="700"
//                       sx={{ mb: 1 }}
//                     >
//                       {slide.title}
//                     </Typography>
//                     <Typography
//                       variant="h6"
//                       color={alpha(textLight, 0.9)}
//                       gutterBottom
//                       fontWeight="500"
//                     >
//                       {slide.subtitle}
//                     </Typography>
//                     <Typography
//                       variant="body1"
//                       color={alpha(textLight, 0.8)}
//                       sx={{ maxWidth: '90%', mt: 2 }}
//                     >
//                       {slide.description}
//                     </Typography>
//                   </Box>
//                 </Fade>
//               ))}
//             </Box>

//             <Box sx={{ mt: 4, display: 'flex', gap: 1 }}>
//               {carouselContent.map((_, index) => (
//                 <Box
//                   key={index}
//                   onClick={() => setCurrentSlide(index)}
//                   sx={{
//                     width: 12,
//                     height: 12,
//                     borderRadius: '50%',
//                     bgcolor: currentSlide === index ? alpha('#FFFFFF', 0.9) : alpha('#FFFFFF', 0.4),
//                     transition: 'background-color 0.3s ease',
//                     cursor: 'pointer',
//                   }}
//                 />
//               ))}
//             </Box>
//           </Grid>

//           <Grid
//             item
//             xs={12}
//             md={6}
//             sx={{
//               backgroundColor: formBg,
//               padding: { xs: 3, sm: 4, md: 6 },
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center'
//             }}
//           >
//             <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 4 }}>
//               <Stack direction="row" spacing={1} alignItems="center">
//                 <HomeWorkIcon sx={{ fontSize: 30, color: primaryBlue }} />
//                 <Typography variant="h5" fontWeight="700" color={primaryBlue}>
//                   REALTY CRMS
//                 </Typography>
//               </Stack>
//             </Box>

//             <Typography variant="h4" component="h1" fontWeight="700" sx={{ mb: 1, color: textDark }}>
//               Sign In
//             </Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
//               Welcome back! Please enter your credentials to access your account.
//             </Typography>

//             {error && (
//               <Alert severity="error" sx={{ mb: 3 }}>
//                 {error}
//               </Alert>
//             )}

//             <Box component="form" onSubmit={handleLogin} noValidate>
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="email"
//                 label="Email Address"
//                 name="email"
//                 autoComplete="email"
//                 autoFocus
//                 value={formData.email}
//                 onChange={handleChange}
//                 error={!!validationErrors.email}
//                 helperText={validationErrors.email}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <EmailIcon sx={{ color: 'text.secondary' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   mb: 2,
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': {
//                       borderColor: alpha('#000', 0.2),
//                     },
//                   },
//                 }}
//               />

//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 type={showPassword ? 'text' : 'password'}
//                 id="password"
//                 autoComplete="current-password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 error={!!validationErrors.password}
//                 helperText={validationErrors.password}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <LockIcon sx={{ color: 'text.secondary' }} />
//                     </InputAdornment>
//                   ),
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         aria-label="toggle password visibility"
//                         onClick={() => setShowPassword(!showPassword)}
//                         edge="end"
//                       >
//                         {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   mb: 1,
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': {
//                       borderColor: alpha('#000', 0.2),
//                     },
//                   },
//                 }}
//               />

//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       name="rememberMe"
//                       checked={formData.rememberMe}
//                       onChange={handleChange}
//                       sx={{
//                         color: accentBlue,
//                         '&.Mui-checked': {
//                           color: highlightBlue,
//                         },
//                       }}
//                     />
//                   }
//                   label={
//                     <Typography variant="body2" color="text.secondary">
//                       Remember me
//                     </Typography>
//                   }
//                 />
//                 <Link
//                   href="/forgot-password"
//                   variant="body2"
//                   underline="hover"
//                   sx={{ color: accentBlue, fontWeight: 500 }}
//                 >
//                   Forgot password?
//                 </Link>
//               </Box>

//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{
//                   mt: 2,
//                   mb: 3,
//                   py: 1.5,
//                   backgroundColor: primaryBlue,
//                   '&:hover': {
//                     backgroundColor: secondaryBlue,
//                   },
//                   borderRadius: '8px',
//                   textTransform: 'none',
//                   fontSize: '1rem',
//                   fontWeight: 600,
//                   boxShadow: '0 4px 12px rgba(11, 36, 71, 0.15)',
//                   position: 'relative'
//                 }}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <CircularProgress size={24} sx={{ color: '#fff' }} />
//                 ) : (
//                   'Sign In'
//                 )}
//               </Button>

//               <Box sx={{ textAlign: 'center', mt: 2 }}>
//                 <Typography variant="body2" color="text.secondary" display="inline">
//                   Don't have an account?
//                 </Typography>
//                 <Link
//                   href="/Sign-up"
//                   variant="body2"
//                   sx={{ ml: 0.5, color: accentBlue, fontWeight: 500 }}
//                   underline="hover"
//                 >
//                   Create an account
//                 </Link>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default LoginPage;




import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  useTheme,
  Stack,
  alpha,
  Grid,
  Fade,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  useMediaQuery,
  Paper
} from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Enhanced carousel content with better descriptions
  const carouselContent = [
    {
      title: "Americorp Infra",
      subtitle: "Your Complete Real Estate Management Solution",
      description: "Streamline your property business with our comprehensive platform. Manage listings, clients, and transactions all in one secure environment.",
      icon: <BusinessIcon sx={{ fontSize: { xs: 32, md: 40 }, color: '#6563FF' }} />,
      gradient: 'linear-gradient(135deg, #6563FF 0%, #8B87FF 100%)'
    },
    {
      title: "Smart Property Management",
      subtitle: "Intelligent Solutions for Modern Real Estate",
      description: "Track properties, manage maintenance requests, and monitor occupancy rates with our advanced property management tools and real-time analytics.",
      icon: <ApartmentIcon sx={{ fontSize: { xs: 32, md: 40 }, color: '#6563FF' }} />,
      gradient: 'linear-gradient(135deg, #7B78FF 0%, #9B97FF 100%)'
    },
    {
      title: "Advanced Analytics",
      subtitle: "Data-Driven Real Estate Insights",
      description: "Make informed decisions with comprehensive market analysis, performance metrics, and predictive insights for your real estate portfolio.",
      icon: <TrendingUpIcon sx={{ fontSize: { xs: 32, md: 40 }, color: '#6563FF' }} />,
      gradient: 'linear-gradient(135deg, #8B87FF 0%, #AB97FF 100%)'
    },
    {
      title: "Client Excellence",
      subtitle: "Building Lasting Relationships",
      description: "Enhance client satisfaction with detailed profiles, communication tracking, and personalized service delivery for superior relationship management.",
      icon: <PeopleIcon sx={{ fontSize: { xs: 32, md: 40 }, color: '#6563FF' }} />,
      gradient: 'linear-gradient(135deg, #9B97FF 0%, #BBB7FF 100%)'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselContent.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [carouselContent.length]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { email: "", password: "" };

    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  
    if (!validateForm()) return;
  
    setIsLoading(true);
    setError(null);
  
    try {
      const loginResponse = await axiosInstance.post(
        '/realEstate/user/login',
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
          },
        }
      );
  
      if (loginResponse.data && loginResponse.data.status === 200) {
        const storage = formData.rememberMe ? localStorage : sessionStorage;
        const role = loginResponse.data.data.role;
  
        storage.setItem('userEmail', formData.email);
        storage.setItem('accessToken', loginResponse.data.data.accessToken);
        storage.setItem('userRole', role);
        storage.setItem('associateCode', loginResponse.data.data.associateCode);
        storage.setItem('userCode', loginResponse.data.data.userCode);
  
        try {
          const permissionsResponse = await axiosInstance.get(
            '/realEstate/user-permission/getAll',
            {
              headers: {
                'Authorization': `Bearer ${loginResponse.data.data.accessToken}`,
                'Accept': '*/*',
              },
            }
          );
  
          if (permissionsResponse.data && permissionsResponse.data.status === 200) {
            const rolePermissions = permissionsResponse.data.data.find(
              p => p.roleName === role.toUpperCase()
            );
  
            if (rolePermissions) {
              storage.setItem('userPermissions', JSON.stringify(rolePermissions.permissions));
            }
          }
        } catch (permissionsError) {
          console.error('Failed to fetch permissions:', permissionsError);
        }
  
        let redirectPath;
        const roleUpperCase = role.toUpperCase();
        
        if (roleUpperCase === 'ADMIN') {
          redirectPath = '/dashboard';
        } else if (roleUpperCase === 'ASSOCIATE') {
          redirectPath = '/associate-dashboard';
        } else if (roleUpperCase === 'CLIENT') {
          redirectPath = '/client-dashboard';
        } else if (roleUpperCase === 'AGENT') {
          redirectPath = '/agent-dashboard';
        } else {
          redirectPath = '/dashboard';
        }
  
        setSnackbar({
          open: true,
          message: `Login successful! Redirecting to ${role.toLowerCase()} dashboard...`,
          severity: 'success',
        });
  
        setTimeout(() => {
          navigate(redirectPath);
        }, 1000);
      } else {
        throw new Error('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
  
      const errorMessage = err?.response?.data?.data ||
        err?.response?.data?.message ||
        err.message ||
        'Login failed. Please check your credentials.';
      setError(errorMessage);
  
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced Logo Component
  const LogoComponent = ({ size = 'large' }) => {
    const logoSize = size === 'large' ? { xs: 40, sm: 48, md: 56 } : { xs: 32, sm: 36, md: 40 };
    const textSize = size === 'large' ? { xs: 'h5', sm: 'h4', md: 'h3' } : { xs: 'h6', sm: 'h5', md: 'h4' };
    
    return (
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        <Box
          sx={{
            width: logoSize,
            height: logoSize,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #6563FF 0%, #8B87FF 100%)',
            boxShadow: '0 4px 16px rgba(101, 99, 255, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              transform: 'rotate(45deg)',
              transition: 'all 0.6s ease',
            },
            '&:hover::before': {
              animation: 'shine 1.5s ease-in-out',
            },
            '@keyframes shine': {
              '0%': { transform: 'rotate(45deg) translateX(-100%)' },
              '100%': { transform: 'rotate(45deg) translateX(100%)' }
            }
          }}
        >
          <img
            src="/KMBuilderblack.png"
            alt="KM Builders"
            style={{
              width: '70%',
              height: '70%',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
              zIndex: 1,
              position: 'relative'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<div style="color: white; font-weight: bold; font-size: 18px; z-index: 1; position: relative;">KM</div>';
            }}
          />
        </Box>
        <Typography
          variant={textSize}
          component="h1"
          sx={{
            fontWeight: 700,
            color: '#333333',
            letterSpacing: '0.5px',
            background: 'linear-gradient(135deg, #333333 0%, #6563FF 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Km Builders
        </Typography>
      </Stack>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 1, sm: 2, md: 3 },
        backgroundColor: '#FFFFFF',
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(101, 99, 255, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(101, 99, 255, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(101, 99, 255, 0.02) 0%, transparent 50%)
        `,
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: 2, sm: 3, md: 4 },
            overflow: 'hidden',
            boxShadow: '0 20px 80px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            backgroundColor: '#FFFFFF'
          }}
        >
          <Grid container sx={{ minHeight: { xs: 'auto', md: '600px', lg: '700px' } }}>
            {/* Left Side - Carousel (Hidden on mobile) */}
            <Grid
              item
              xs={12}
              md={6}
              lg={7}
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: { md: 4, lg: 6 },
                background: 'linear-gradient(135deg, #F8F9FD 0%, #EEF2FF 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: '300px',
                  height: '300px',
                  top: '-150px',
                  left: '-150px',
                  background: 'radial-gradient(circle, rgba(101, 99, 255, 0.08) 0%, transparent 70%)',
                  borderRadius: '50%',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '400px',
                  height: '400px',
                  bottom: '-200px',
                  right: '-200px',
                  background: 'radial-gradient(circle, rgba(139, 135, 255, 0.06) 0%, transparent 70%)',
                  borderRadius: '50%',
                }
              }}
            >
              <Box position="relative" zIndex={1} sx={{ textAlign: 'center', width: '100%', maxWidth: '500px' }}>
                <Box sx={{ mb: { md: 4, lg: 6 } }}>
                  <LogoComponent size="large" />
                </Box>

                <Box sx={{ height: { md: '350px', lg: '400px' }, position: 'relative' }}>
                  {carouselContent.map((slide, index) => (
                    <Fade
                      key={index}
                      in={currentSlide === index}
                      timeout={1000}
                      style={{
                        display: currentSlide === index ? 'block' : 'none',
                        position: 'absolute',
                        width: '100%',
                        top: 0
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Box
                          sx={{
                            mb: 3,
                            display: 'inline-flex',
                            p: 2,
                            borderRadius: 3,
                            background: slide.gradient,
                            boxShadow: '0 8px 32px rgba(101, 99, 255, 0.15)'
                          }}
                        >
                          {slide.icon}
                        </Box>
                        <Typography
                          variant="h3"
                          component="h2"
                          sx={{
                            mb: 2,
                            fontWeight: 700,
                            color: '#333333',
                            fontSize: { md: '1.8rem', lg: '2.2rem' }
                          }}
                        >
                          {slide.title}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 3,
                            color: '#6E6E6E',
                            fontWeight: 500,
                            fontSize: { md: '1rem', lg: '1.1rem' }
                          }}
                        >
                          {slide.subtitle}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#6E6E6E',
                            lineHeight: 1.6,
                            fontSize: { md: '0.9rem', lg: '1rem' }
                          }}
                        >
                          {slide.description}
                        </Typography>
                      </Box>
                    </Fade>
                  ))}
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 1 }}>
                  {carouselContent.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      sx={{
                        width: { md: 10, lg: 12 },
                        height: { md: 10, lg: 12 },
                        borderRadius: '50%',
                        bgcolor: currentSlide === index ? '#6563FF' : 'rgba(101, 99, 255, 0.3)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: currentSlide === index ? '#6563FF' : 'rgba(101, 99, 255, 0.5)',
                          transform: 'scale(1.2)'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Login Form */}
            <Grid
              item
              xs={12}
              md={6}
              lg={5}
              sx={{
                padding: { xs: 3, sm: 4, md: 5, lg: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF'
              }}
            >
              {/* Mobile Logo */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 4 }}>
                <LogoComponent size="small" />
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    mb: 1,
                    fontWeight: 700,
                    color: '#333333',
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    color: '#6E6E6E',
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Please sign in to your account to continue
                </Typography>

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-message': {
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleLogin} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={formData.email}
                    onChange={handleChange}
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#6E6E6E' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.15)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#6563FF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#6563FF',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6E6E6E',
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }
                    }}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!validationErrors.password}
                    helperText={validationErrors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#6E6E6E' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#6E6E6E' }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.15)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#6563FF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#6563FF',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6E6E6E',
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }
                    }}
                  />

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    my: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 0 }
                  }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          sx={{
                            color: '#6563FF',
                            '&.Mui-checked': {
                              color: '#6563FF',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ color: '#6E6E6E', fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                          Remember me
                        </Typography>
                      }
                    />
                    <Link
                      href="/forgot-password"
                      variant="body2"
                      underline="hover"
                      sx={{ 
                        color: '#6563FF', 
                        fontWeight: 500,
                        fontSize: { xs: '0.85rem', sm: '0.875rem' }
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 3,
                      py: { xs: 1.25, sm: 1.5 },
                      backgroundColor: '#6563FF',
                      '&:hover': {
                        backgroundColor: '#5451E5',
                      },
                      '&:disabled': {
                        backgroundColor: 'rgba(101, 99, 255, 0.5)',
                      },
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      fontWeight: 600,
                      boxShadow: '0 4px 16px rgba(101, 99, 255, 0.25)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(101, 99, 255, 0.35)',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} sx={{ color: '#fff' }} />
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  {/* <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#6E6E6E', fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                      Don't have an account?{' '}
                      <Link
                        href="/Sign-up"
                        sx={{ 
                          color: '#6563FF', 
                          fontWeight: 500,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Create an account
                      </Link>
                    </Typography>
                  </Box> */}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            fontSize: { xs: '0.85rem', sm: '0.875rem' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;