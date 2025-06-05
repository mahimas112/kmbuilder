// // import React, { useState } from 'react';
// // import {
// //   Box,
// //   Typography,
// //   TextField,
// //   Button,
// //   Paper,
// //   Grid,
// //   IconButton,
// //   Divider,
// //   Container
// // } from '@mui/material';
// // import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// // const MyProfile = () => {
// //   const [formData, setFormData] = useState({
// //     firstName: '',
// //     lastName: '',
// //     userName: '',
// //     phone: '',
// //     email: '',
// //     address: '',
// //     country: '',
// //     state: '',
// //     city: '',
// //     postalCode: ''
// //   });

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //     console.log('Form Data Updated:', { ...formData, [name]: value });
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     console.log('Form Submitted:', formData);
// //   };

// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       if (file.size <= 800 * 1024) { // 800K limit
// //         console.log('File uploaded:', file);
// //       } else {
// //         alert('File size should not exceed 800K');
// //       }
// //     }
// //   };

// //   return (
// //       <Paper elevation={3} sx={{ p: 4}}>
// //         <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
// //           Profile Settings
// //         </Typography>

// //         <Box component="form" onSubmit={handleSubmit}>
// //           {/* Employee Information Section */}
// //           <Typography variant="h6" sx={{ mb: 2 }}>
// //             Employee Information
// //           </Typography>
// //           <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
// //             Provide the information below
// //           </Typography>

// //           {/* Image Upload Section */}
// //           <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
// //             <Box
// //               sx={{
// //                 width: 100,
// //                 height: 100,
// //                 border: '1px dashed grey',
// //                 display: 'flex',
// //                 justifyContent: 'center',
// //                 alignItems: 'center',
// //                 mr: 2
// //               }}
// //             >
// //               <input
// //                 accept="image/*"
// //                 style={{ display: 'none' }}
// //                 id="upload-photo"
// //                 type="file"
// //                 onChange={handleFileUpload}
// //               />
// //               <label htmlFor="upload-photo">
// //                 <IconButton component="span">
// //                   <CloudUploadIcon />
// //                 </IconButton>
// //               </label>
// //             </Box>
// //             <Button
// //               variant="outlined"
// //               component="label"
// //               startIcon={<CloudUploadIcon />}
// //             >
// //               Upload File
// //               <input
// //                 hidden
// //                 accept="image/*"
// //                 type="file"
// //                 onChange={handleFileUpload}
// //               />
// //             </Button>
// //           </Box>
// //           <Typography variant="caption" sx={{ mb: 3, display: 'block' }}>
// //             JPG, GIF or PNG. Max size of 800K
// //           </Typography>

// //           {/* Form Grid */}
// //           <Grid container spacing={3}>
// //             <Grid item xs={12} md={4}>
// //               <TextField
// //                 required
// //                 fullWidth
// //                 label="First Name"
// //                 name="firstName"
// //                 value={formData.firstName}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={12} md={4}>
// //               <TextField
// //                 required
// //                 fullWidth
// //                 label="Last Name"
// //                 name="lastName"
// //                 value={formData.lastName}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={12} md={4}>
// //               <TextField
// //                 required
// //                 fullWidth
// //                 label="User Name"
// //                 name="userName"
// //                 value={formData.userName}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={12} md={6}>
// //               <TextField
// //                 required
// //                 fullWidth
// //                 label="Phone Number"
// //                 name="phone"
// //                 value={formData.phone}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={12} md={6}>
// //               <TextField
// //                 required
// //                 fullWidth
// //                 label="Email"
// //                 type="email"
// //                 name="email"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //           </Grid>

// //           <Divider sx={{ my: 4 }} />

// //           {/* Address Section */}
// //           <Typography variant="h6" sx={{ mb: 2 }}>
// //             Address
// //           </Typography>
// //           <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
// //             Please enter the address details
// //           </Typography>

// //           <Grid container spacing={3}>
// //             <Grid item xs={12}>
// //               <TextField
// //                 required
// //                 fullWidth
// //                 label="Address"
// //                 name="address"
// //                 value={formData.address}
// //                 onChange={handleChange}
// //                 multiline
// //                 rows={2}
// //               />
// //             </Grid>
// //             <Grid item xs={12} md={3}>
// //               <TextField
// //                 required
// //                 fullWidth
// //                 label="Country"
// //                 name="country"
// //                 value={formData.country}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={12} md={3}>
// //               <TextField
// //                 required
// //                 fullWidth
// //                 label="State/Province"
// //                 name="state"
// //                 value={formData.state}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={12} md={3}>
// //               <TextField
// //                 required
// //                 fullWidth
// //                 label="City"
// //                 name="city"
// //                 value={formData.city}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={12} md={3}>
// //               <TextField
// //                 required
// //                 fullWidth
// //                 label="Postal Code"
// //                 name="postalCode"
// //                 value={formData.postalCode}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //           </Grid>

// //           {/* Action Buttons */}
// //           <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
// //             <Button variant="outlined" color="primary">
// //               Cancel
// //             </Button>
// //             <Button
// //               variant="contained"
// //               color="error"
// //               type="submit"
// //             >
// //               Save Changes
// //             </Button>
// //           </Box>
// //         </Box>
// //       </Paper>
// //   );
// // };

// // export default MyProfile;



// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Grid,
//   IconButton,
//   Divider,
// } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import DeleteIcon from '@mui/icons-material/Delete';

// const MyProfile = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     userName: '',
//     phone: '',
//     email: '',
//     address: '',
//     country: '',
//     state: '',
//     city: '',
//     postalCode: ''
//   });

//   const [imagePreview, setImagePreview] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     console.log('Form Data Updated:', { ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form Submitted:', formData);
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//       console.log('File uploaded:', file);
//     }
//   };

//   const handleRemoveImage = () => {
//     setImagePreview(null);
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 4 }}>
//       <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
//         Profile Settings
//       </Typography>

//       <Box component="form" onSubmit={handleSubmit}>
//         {/* Employee Information Section */}
//         <Typography variant="h6" sx={{ mb: 2 }}>
//           Employee Information
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//           Provide the information below
//         </Typography>

//         {/* Image Upload Section */}
//         <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
//           <Box
//             sx={{
//               width: 100,
//               height: 100,
//               border: '1px dashed grey',
//               borderRadius: '4px',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               mr: 2,
//               position: 'relative',
//               overflow: 'hidden'
//             }}
//           >
//             {imagePreview ? (
//               <>
//                 <img
//                   src={imagePreview}
//                   alt="Profile Preview"
//                   style={{
//                     width: '100%',
//                     height: '100%',
//                     objectFit: 'cover'
//                   }}
//                 />
//                 <IconButton
//                   sx={{
//                     position: 'absolute',
//                     top: 0,
//                     right: 0,
//                     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//                     '&:hover': {
//                       backgroundColor: 'rgba(255, 255, 255, 0.9)'
//                     }
//                   }}
//                   onClick={handleRemoveImage}
//                   size="small"
//                 >
//                   <DeleteIcon fontSize="small" />
//                 </IconButton>
//               </>
//             ) : (
//               <input
//                 accept="image/*"
//                 style={{ display: 'none' }}
//                 id="upload-photo"
//                 type="file"
//                 onChange={handleFileUpload}
//               />
//             )}
//             {!imagePreview && (
//               <label htmlFor="upload-photo">
//                 <IconButton component="span">
//                   <CloudUploadIcon />
//                 </IconButton>
//               </label>
//             )}
//           </Box>
//           <Button
//             variant="outlined"
//             component="label"
//             startIcon={<CloudUploadIcon />}
//           >
//             Upload File
//             <input
//               hidden
//               accept="image/*"
//               type="file"
//               onChange={handleFileUpload}
//             />
//           </Button>
//         </Box>

//         {/* Form Grid */}
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={4}>
//             <TextField
//               required
//               fullWidth
//               label="First Name"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <TextField
//               required
//               fullWidth
//               label="Last Name"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <TextField
//               required
//               fullWidth
//               label="User Name"
//               name="userName"
//               value={formData.userName}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               required
//               fullWidth
//               label="Phone Number"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               required
//               fullWidth
//               label="Email"
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//             />
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 4 }} />

//         {/* Address Section */}
//         <Typography variant="h6" sx={{ mb: 2 }}>
//           Address
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//           Please enter the address details
//         </Typography>

//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <TextField
//               required
//               fullWidth
//               label="Address"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               multiline
//               rows={2}
//             />
//           </Grid>
//           <Grid item xs={12} md={3}>
//             <TextField
//               required
//               fullWidth
//               label="Country"
//               name="country"
//               value={formData.country}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} md={3}>
//             <TextField
//               required
//               fullWidth
//               label="State/Province"
//               name="state"
//               value={formData.state}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} md={3}>
//             <TextField
//               required
//               fullWidth
//               label="City"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} md={3}>
//             <TextField
//               required
//               fullWidth
//               label="Postal Code"
//               name="postalCode"
//               value={formData.postalCode}
//               onChange={handleChange}
//             />
//           </Grid>
//         </Grid>

//         {/* Action Buttons */}
//         <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
//           <Button variant="outlined" color="primary">
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             type="submit"
//           >
//             Save Changes
//           </Button>
//         </Box>
//       </Box>
//     </Paper>
//   );
// };

// export default MyProfile;






import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  Divider,
  Container,
  Stack,
  InputAdornment,
  Alert,
  alpha,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tabs,
  Tab,
  FormHelperText,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import BadgeIcon from '@mui/icons-material/Badge';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axiosInstance from '../axiosInstance';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MyProfile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    phone: '',
    email: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: ''
  });

  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  // Password validation requirements
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [activeStep, setActiveStep] = useState(0);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  // Fetch user credentials from storage
  const [userCredentials, setUserCredentials] = useState({
    associateCode: '',
    userCode: '',
  });

  useEffect(() => {
    // Get associateCode and userCode from local/session storage
    const associateCode = localStorage.getItem('associateCode') || sessionStorage.getItem('associateCode') || '';
    const userCode = localStorage.getItem('userCode') || sessionStorage.getItem('userCode') || '';

    setUserCredentials({
      associateCode,
      userCode,
    });
  }, []);

  // Colors from login page for consistent styling
  const primaryBlue = '#0B2447';
  const secondaryBlue = '#19376D';
  const accentBlue = '#576CBC';
  const highlightBlue = '#5D9CEC';
  const bgColor = '#F8F9FD';
  const formBg = '#FFFFFF';
  const textDark = '#1E293B';

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enhanced password validation
  const validatePassword = (password) => {
    const validations = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordValidation(validations);

    return validations.minLength &&
      validations.hasUppercase &&
      validations.hasLowercase &&
      validations.hasNumber &&
      validations.hasSpecial;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user types
    setPasswordErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    // Validate password complexity
    if (name === 'password') {
      validatePassword(value);

      // If confirmPassword is not empty, check if passwords match
      if (passwordData.confirmPassword && value !== passwordData.confirmPassword) {
        setPasswordErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else if (passwordData.confirmPassword) {
        setPasswordErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }

    // If changing confirmPassword, check if it matches password
    if (name === 'confirmPassword' && value !== passwordData.password) {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
    } else if (name === 'confirmPassword') {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    setSnackbar({
      open: true,
      message: "Profile updated successfully!",
      severity: "success"
    });
  };

  const validatePasswordForm = () => {
    const errors = {
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    // Check if password field is empty
    if (!passwordData.password) {
      errors.password = 'Password is required';
      isValid = false;
    }
    // Check if password meets all validation requirements
    else if (!validatePassword(passwordData.password)) {
      errors.password = 'Password does not meet all requirements';
      isValid = false;
    }

    // Check if confirm password field is empty
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    }
    // Check if passwords match
    else if (passwordData.password !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleStepNext = () => {
    if (activeStep === 0) {
      if (validatePasswordForm()) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleStepBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepReset = () => {
    setActiveStep(0);
    setPasswordData({
      password: '',
      confirmPassword: '',
    });
    setPasswordErrors({
      password: '',
      confirmPassword: '',
    });
    setPasswordValidation({
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecial: false,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const updatePassword = async () => {
    // Validate form again before API call
    if (!validatePasswordForm()) {
      return;
    }

    setIsPasswordUpdating(true);

    try {
      // Check if credentials exist
      if (!userCredentials.associateCode || !userCredentials.userCode) {
        setSnackbar({
          open: true,
          message: "User credentials not found. Please login again.",
          severity: "error"
        });
        setIsPasswordUpdating(false);
        return;
      }

      const response = await axiosInstance.post(
        `/realEstate/getuser/restYourPassword?associateCode=${userCredentials.associateCode}&userCode=${userCredentials.userCode}&password=${passwordData.password}`,
        ''
      );

      // Updated to check for status 201 or 200 as success statuses
      if (response.data && (response.data.status === 200 || response.data.status === 201)) {
        setSnackbar({
          open: true,
          message: response.data.message || "Password updated successfully!",
          severity: "success"
        });
        setActiveStep(2); // Move to success step
      } else {
        throw new Error(response.data?.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Password update error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || "An error occurred while updating password",
        severity: "error"
      });
      // Stay on current step instead of going back to beginning
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  // Render password requirements checklist
  const renderPasswordRequirements = () => (
    <Box sx={{ mt: 2, mb: 1 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Password Requirements:
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {passwordValidation.minLength ?
              <CheckCircleIcon fontSize="small" color="success" /> :
              <CancelIcon fontSize="small" color="error" />}
            <Typography variant="body2">At least 8 characters</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {passwordValidation.hasUppercase ?
              <CheckCircleIcon fontSize="small" color="success" /> :
              <CancelIcon fontSize="small" color="error" />}
            <Typography variant="body2">One uppercase letter</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {passwordValidation.hasLowercase ?
              <CheckCircleIcon fontSize="small" color="success" /> :
              <CancelIcon fontSize="small" color="error" />}
            <Typography variant="body2">One lowercase letter</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {passwordValidation.hasNumber ?
              <CheckCircleIcon fontSize="small" color="success" /> :
              <CancelIcon fontSize="small" color="error" />}
            <Typography variant="body2">One number</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {passwordValidation.hasSpecial ?
              <CheckCircleIcon fontSize="small" color="success" /> :
              <CancelIcon fontSize="small" color="error" />}
            <Typography variant="body2">One special character</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  // Stepper content
  const steps = [
    {
      label: 'Enter New Password',
      description: 'Create a new secure password',
      content: (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="password"
                label="New Password"
                name="password"
                value={passwordData.password}
                onChange={handlePasswordChange}
                error={!!passwordErrors.password}
                helperText={passwordErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: alpha('#000', 0.2),
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={!!passwordErrors.confirmPassword}
                helperText={passwordErrors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VerifiedUserIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: alpha('#000', 0.2),
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {renderPasswordRequirements()}
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, mb: 1 }}>
            <Button
              variant="contained"
              onClick={handleStepNext}
              sx={{
                px: 3,
                py: 1,
                backgroundColor: primaryBlue,
                '&:hover': {
                  backgroundColor: secondaryBlue,
                },
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(11, 36, 71, 0.15)',
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      ),
    },
    {
      label: 'Review & Confirm',
      description: 'Verify and confirm your new password',
      content: (
        <Box sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Once you confirm, your password will be updated. Make sure you remember your new password.
          </Alert>
          <Box sx={{ mt: 3, mb: 1, display: 'flex', gap: 2 }}>
            <Button
              onClick={handleStepBack}
              sx={{
                px: 3,
                py: 1,
                borderColor: alpha('#000', 0.3),
                color: textDark,
                '&:hover': {
                  borderColor: alpha('#000', 0.5),
                  backgroundColor: alpha('#000', 0.02)
                },
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '0.9rem',
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={updatePassword}
              disabled={isPasswordUpdating}
              sx={{
                px: 3,
                py: 1,
                backgroundColor: primaryBlue,
                '&:hover': {
                  backgroundColor: secondaryBlue,
                },
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(11, 36, 71, 0.15)',
              }}
            >
              {isPasswordUpdating ? 'Updating...' : 'Update Password'}
            </Button>
          </Box>
        </Box>
      ),
    },
    {
      label: 'Success',
      description: 'Your password has been updated successfully',
      content: (
        <Box sx={{ mt: 2 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Password updated successfully! Your account is now secured with the new password.
          </Alert>
          <Box sx={{ mt: 3, mb: 1 }}>
            <Button
              onClick={handleStepReset}
              variant="outlined"
              sx={{
                px: 3,
                py: 1,
                borderColor: primaryBlue,
                color: primaryBlue,
                '&:hover': {
                  borderColor: secondaryBlue,
                  backgroundColor: alpha(secondaryBlue, 0.05)
                },
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '0.9rem',
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${bgColor} 0%, #EEF2FF 100%)`,
        padding: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Main Paper with Tabs */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 15px 50px rgba(0, 0, 0, 0.12)',
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: `linear-gradient(145deg, ${primaryBlue} 0%, ${secondaryBlue} 100%)`,
              padding: { xs: 3, md: 4 },
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: '200%',
                height: '200%',
                top: '-50%',
                left: '-50%',
                background: `radial-gradient(circle, ${alpha('#FFFFFF', 0.08)} 0%, ${alpha('#FFFFFF', 0)} 70%)`,
              },
            }}
          >
            <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
              User Settings
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Manage your personal information and account settings
            </Typography>
          </Box>

          {/* Tabs Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="user settings tabs"
              sx={{
                backgroundColor: alpha(accentBlue, 0.03),
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  py: 2,
                  minHeight: '64px',
                },
                '& .Mui-selected': {
                  color: `${primaryBlue} !important`,
                }
              }}
              TabIndicatorProps={{
                style: {
                  backgroundColor: primaryBlue,
                  height: 3
                }
              }}
            >
              <Tab
                label="Profile Information"
                icon={<AccountCircleIcon />}
                iconPosition="start"
              />
              <Tab
                label="Security & Password"
                icon={<VpnKeyIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Profile Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, md: 5 } }}>
              {/* Employee Information Section */}
              <Typography
                variant="h5"
                sx={{
                  mb: 1,
                  fontWeight: '600',
                  color: textDark
                }}
              >
                Employee Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Please provide your personal details below
              </Typography>

              {/* Image Upload Section */}
              <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    border: `2px dashed ${alpha(accentBlue, 0.4)}`,
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mr: { xs: 0, sm: 4 },
                    mb: { xs: 2, sm: 0 },
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: alpha(accentBlue, 0.05)
                  }}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)'
                          },
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onClick={handleRemoveImage}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="upload-photo"
                      type="file"
                      onChange={handleFileUpload}
                    />
                  )}
                  {!imagePreview && (
                    <label htmlFor="upload-photo">
                      <IconButton
                        component="span"
                        sx={{
                          color: accentBlue,
                          '&:hover': {
                            backgroundColor: alpha(accentBlue, 0.1)
                          }
                        }}
                      >
                        <CloudUploadIcon sx={{ fontSize: 40 }} />
                      </IconButton>
                    </label>
                  )}
                </Box>
                <Stack spacing={1}>
                  <Typography variant="body1" fontWeight="500" color={textDark}>
                    Profile Photo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Upload a clear photo for your profile (JPG or PNG, max 5MB)
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      borderColor: accentBlue,
                      color: accentBlue,
                      '&:hover': {
                        borderColor: highlightBlue,
                        backgroundColor: alpha(highlightBlue, 0.05)
                      },
                      textTransform: 'none',
                      borderRadius: '8px',
                      alignSelf: 'flex-start'
                    }}
                  >
                    Upload Photo{''}
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Stack>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: alpha('#000', 0.2),
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: alpha('#000', 0.2),
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    label="User Name"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: alpha('#000', 0.2),
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: alpha('#000', 0.2),
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: alpha('#000', 0.2),
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 5, borderColor: alpha('#000', 0.1) }} />

              <Typography
                variant="h5"
                sx={{
                  mb: 1,
                  fontWeight: '600',
                  color: textDark
                }}
              >
                Address Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Please provide your current address details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                          <HomeIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: alpha('#000', 0.2),
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    required
                    fullWidth
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PublicIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: alpha('#000', 0.2),
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    required
                    fullWidth
                    label="State/Province"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCityIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: alpha('#000', 0.2),
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    required
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCityIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: alpha('#000', 0.2),
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    required
                    fullWidth
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MarkunreadMailboxIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: alpha('#000', 0.2),
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 5, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
                <Button
                  variant="outlined"
                  sx={{
                    px: 4,
                    py: 1.2,
                    borderColor: alpha('#000', 0.3),
                    color: textDark,
                    '&:hover': {
                      borderColor: alpha('#000', 0.5),
                      backgroundColor: alpha('#000', 0.02)
                    },
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '0.95rem',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    px: 4,
                    py: 1.2,
                    backgroundColor: primaryBlue,
                    '&:hover': {
                      backgroundColor: secondaryBlue,
                    },
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(11, 36, 71, 0.15)',
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <SecurityIcon sx={{ fontSize: 28, color: primaryBlue }} />
                <Typography variant="h5" sx={{ fontWeight: '600', color: textDark }}>
                  Security Settings
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Manage your password and security preferences
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mt: 2,
                  mb: 4,
                  backgroundColor: alpha(accentBlue, 0.03),
                  border: `1px solid ${alpha(accentBlue, 0.1)}`,
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: textDark }}>
                  Change Password
                </Typography>

                <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 3 }}>
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {step.label}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {step.description}
                        </Typography>
                        {step.content}
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Paper>

              {/* <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mt: 2,
                  backgroundColor: alpha(accentBlue, 0.03),
                  border: `1px solid ${alpha(accentBlue, 0.1)}`,
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: textDark }}>
                  Account Security
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            backgroundColor: alpha(primaryBlue, 0.1),
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <EmailIcon sx={{ color: primaryBlue }} />
                        </Box>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>Email Verification</Typography>
                          <Typography variant="body2" color="text.secondary">Verify your email address for added security</Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: primaryBlue,
                          color: primaryBlue,
                          '&:hover': {
                            borderColor: secondaryBlue,
                            backgroundColor: alpha(secondaryBlue, 0.05)
                          },
                          borderRadius: '8px',
                          textTransform: 'none',
                        }}
                      >
                        Verify Email
                      </Button>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1, borderColor: alpha('#000', 0.1) }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            backgroundColor: alpha(primaryBlue, 0.1),
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <PhoneIcon sx={{ color: primaryBlue }} />
                        </Box>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>Two-Factor Authentication</Typography>
                          <Typography variant="body2" color="text.secondary">Add an extra layer of security to your account</Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: primaryBlue,
                          color: primaryBlue,
                          '&:hover': {
                            borderColor: secondaryBlue,
                            backgroundColor: alpha(secondaryBlue, 0.05)
                          },
                          borderRadius: '8px',
                          textTransform: 'none',
                        }}
                      >
                        Enable 2FA
                      </Button>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1, borderColor: alpha('#000', 0.1) }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            backgroundColor: alpha(primaryBlue, 0.1),
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <LockIcon sx={{ color: primaryBlue }} />
                        </Box>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>Login History</Typography>
                          <Typography variant="body2" color="text.secondary">View your recent login activities</Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: primaryBlue,
                          color: primaryBlue,
                          '&:hover': {
                            borderColor: secondaryBlue,
                            backgroundColor: alpha(secondaryBlue, 0.05)
                          },
                          borderRadius: '8px',
                          textTransform: 'none',
                        }}
                      >
                        View History
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper> */}
            </Box>
          </TabPanel>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyProfile;