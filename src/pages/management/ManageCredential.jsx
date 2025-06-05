// import React, { useState } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import PersonIcon from '@mui/icons-material/Person';
// import EmailIcon from '@mui/icons-material/Email';
// import PhoneIcon from '@mui/icons-material/Phone';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import InputAdornment from '@mui/material/InputAdornment';
// import IconButton from '@mui/material/IconButton';

// const ManageCredential = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     mobileNumber: '',
//     password: '',
//     role: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: 'background.default',
//       }}
//     >
//       <Container maxWidth="sm">
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             width: '100%',
//             maxWidth: { xs: '100%', sm: '450px' },
//             mx: 'auto',
//             px: { xs: 2, sm: 0 },
//           }}
//         >
//           <Typography
//             variant={isSmallMobile ? 'h5' : 'h4'}
//             sx={{
//               mb: 0.5,
//               fontWeight: 700,
//               background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
//               backgroundClip: 'text',
//               WebkitBackgroundClip: 'text',
//               color: 'transparent',
//               textAlign: 'center',
//             }}
//           >
//             Manage Credentials
//           </Typography>

//           <Typography 
//             variant="body2" 
//             color="text.secondary" 
//             sx={{ mb: 3, textAlign: 'center' }}
//           >
//             Update user credentials and information
//           </Typography>

//           <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   name="name"
//                   label="Name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   size={isSmallMobile ? "small" : "medium"}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <PersonIcon color="action" sx={{ fontSize: isSmallMobile ? 18 : 20 }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   name="email"
//                   label="Email Address"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   size={isSmallMobile ? "small" : "medium"}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <EmailIcon color="action" sx={{ fontSize: isSmallMobile ? 18 : 20 }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   name="mobileNumber"
//                   label="Mobile Number"
//                   value={formData.mobileNumber}
//                   onChange={handleChange}
//                   size={isSmallMobile ? "small" : "medium"}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <PhoneIcon color="action" sx={{ fontSize: isSmallMobile ? 18 : 20 }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   name="password"
//                   label="Password"
//                   type={showPassword ? 'text' : 'password'}
//                   value={formData.password}
//                   onChange={handleChange}
//                   size={isSmallMobile ? "small" : "medium"}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={() => setShowPassword(!showPassword)}
//                           edge="end"
//                           size={isSmallMobile ? "small" : "medium"}
//                         >
//                           {showPassword ? 
//                             <VisibilityIcon sx={{ fontSize: isSmallMobile ? 18 : 20 }} /> : 
//                             <VisibilityOffIcon sx={{ fontSize: isSmallMobile ? 18 : 20 }} />
//                           }
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   name="role"
//                   label="Role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   size={isSmallMobile ? "small" : "medium"}
//                 />
//               </Grid>
//             </Grid>

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{
//                 mt: 3,
//                 mb: 2,
//                 py: isSmallMobile ? 0.75 : 1,
//                 background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
//                 boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
//                 '&:hover': {
//                   background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
//                 },
//               }}
//             >
//               Update Credentials
//             </Button>
//           </Box>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default ManageCredential;


import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const ManageCredential = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    role: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <Box
      sx={{
        paddingY: "20px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            p: 4,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
          }}
        >
          <Typography
            variant={isSmallMobile ? 'h5' : 'h4'}
            sx={{
              mb: 0.5,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
            }}
          >
            Manage Credentials
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 4, textAlign: 'center' }}
          >
            Update user credentials and information
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  size={isSmallMobile ? "small" : "medium"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonIcon color="action" sx={{ fontSize: isSmallMobile ? 18 : 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  size={isSmallMobile ? "small" : "medium"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EmailIcon color="action" sx={{ fontSize: isSmallMobile ? 18 : 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="mobileNumber"
                  label="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  size={isSmallMobile ? "small" : "medium"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PhoneIcon color="action" sx={{ fontSize: isSmallMobile ? 18 : 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  size={isSmallMobile ? "small" : "medium"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size={isSmallMobile ? "small" : "medium"}
                        >
                          {showPassword ? 
                            <VisibilityIcon sx={{ fontSize: isSmallMobile ? 18 : 20 }} /> : 
                            <VisibilityOffIcon sx={{ fontSize: isSmallMobile ? 18 : 20 }} />
                          }
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth size={isSmallMobile ? "small" : "medium"}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleChange}
                  >
                    <MenuItem value="AGENT">Agent</MenuItem>
                    <MenuItem value="CLIENT">Client</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                py: isSmallMobile ? 0.75 : 1,
                background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
                },
              }}
            >
              Update Credentials
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ManageCredential;