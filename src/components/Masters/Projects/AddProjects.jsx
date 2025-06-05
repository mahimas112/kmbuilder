import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
  Fade,
  InputAdornment,
  Breadcrumbs,
  Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../axiosInstance';
// import { v4 as uuidv4 } from 'uuid'; // You'll need to install this: npm install uuid

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.14:2025';

const AddProjects = () => {
  const navigate = useNavigate();
  const { projectId } = useParams(); // For edit mode
  const theme = useTheme();
  
  // Responsive breakpoints
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isEditMode = Boolean(projectId);

  // Project data state
  const [projectData, setProjectData] = useState({
    projectId: '',
    siteName: '',
    siteLocation: '',
    siteCreationDate: new Date().toISOString().split('T')[0]
  });

  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Fetch project data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/realEstate/project/${projectId}`);
      
      if (response.data && response.data.status === 200) {
        setProjectData(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch project details');
      }
    } catch (err) {
      console.error('Error fetching project details:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load project details';
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: `Error: ${errorMessage}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
    
    setProjectData({
      ...projectData,
      [name]: value
    });
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!projectData.siteName.trim()) {
      errors.siteName = 'Site name is required';
    } else if (projectData.siteName.length > 100) {
      errors.siteName = 'Site name must be less than 100 characters';
    }
    
    if (!projectData.siteLocation.trim()) {
      errors.siteLocation = 'Location is required';
    } else if (projectData.siteLocation.length > 150) {
      errors.siteLocation = 'Location must be less than 150 characters';
    }
    
    if (!projectData.siteCreationDate) {
      errors.siteCreationDate = 'Creation date is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please correct the errors in the form',
        severity: 'error'
      });
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const endpoint = isEditMode 
        ? `/realEstate/project/update`
        : `/realEstate/project/post`;
      
      const response = await axiosInstance.post(endpoint, projectData);
      
      if (response.data && (response.data.status === 200 || response.data.status === 201)) {
        setSnackbar({
          open: true,
          message: isEditMode ? 'Project updated successfully!' : 'Project added successfully!',
          severity: 'success'
        });
        
        // If we're creating a new project, reset the form
        if (!isEditMode) {
          setProjectData({
            projectId: '',
            siteName: '',
            siteLocation: '',
            siteCreationDate: new Date().toISOString().split('T')[0]
          });
        }
        
        // Navigate back to projects list after short delay
        setTimeout(() => {
          navigate('/masters/all-projects-site');
        }, 2000);
      } else {
        throw new Error(response.data?.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Error submitting project:', err);
      
      let errorMessage = 'An unexpected error occurred';
      
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
        
        if (err.response.status === 400 && err.response.data?.errors) {
          const backendErrors = {};
          Object.entries(err.response.data.errors).forEach(([key, value]) => {
            backendErrors[key] = Array.isArray(value) ? value[0] : value;
          });
          setValidationErrors({...validationErrors, ...backendErrors});
        }
      } else if (err.request) {
        errorMessage = 'No response received from server. Please check your connection.';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: `Error: ${errorMessage}`,
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          height: '50vh'
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading project details...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in={!loading}>
      <Box sx={{ 
        mt: { xs: 2, sm: 3, md: 4 }, 
        px: { xs: 2, sm: 3, md: 4 },
        maxWidth: '1200px',
        mx: 'auto'
      }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link 
            color="inherit" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
            underline="hover"
          >
            Dashboard
          </Link>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/masters/all-projects-site');
            }}
            underline="hover"
          >
            Projects
          </Link>
          <Typography color="text.primary">
            {isEditMode ? 'Edit Project' : 'Add Project'}
          </Typography>
        </Breadcrumbs>
        
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          justifyContent: 'space-between',
          mb: 4,
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              sx={{ 
                color: 'text.secondary', 
                mr: 2,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
              onClick={() => navigate('/masters/all-projects-site')}
            >
              Back
            </Button>
            <Typography 
              variant={isXsScreen ? "h6" : "h5"} 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.primary.main
              }}
            >
              {isEditMode ? 'Edit Project' : 'Add New Project'}
            </Typography>
          </Box>
          
          {isEditMode && (
            <Box>
              <MenuItem 
                label="Project ID"
                value={projectData.projectId}
                sx={{ mr: 1, backgroundColor: theme.palette.primary.light, color: 'white' }}
              />
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {projectData.projectId?.substring(0, 8)}...
              </Typography>
            </Box>
          )}
        </Box>

        {/* Form Card */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            borderRadius: 3,
            transition: "box-shadow 0.3s",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)"
            }
          }}
        >
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  fontSize: "1.2rem"
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 1
                  }}
                >
                  Project Information
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    mb: 2
                  }}
                >
                  Enter the details of your real estate project
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              {/* Site Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Site Name"
                  name="siteName"
                  value={projectData.siteName}
                  onChange={handleChange}
                  disabled={submitting}
                  error={Boolean(validationErrors.siteName)}
                  helperText={validationErrors.siteName}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: 2,
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Site Location */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Location"
                  name="siteLocation"
                  value={projectData.siteLocation}
                  onChange={handleChange}
                  disabled={submitting}
                  error={Boolean(validationErrors.siteLocation)}
                  helperText={validationErrors.siteLocation}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: 2,
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Creation Date */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Creation Date"
                  name="siteCreationDate"
                  type="date"
                  value={projectData.siteCreationDate}
                  onChange={handleChange}
                  disabled={submitting}
                  error={Boolean(validationErrors.siteCreationDate)}
                  helperText={validationErrors.siteCreationDate}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: 2,
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Spacer for layout balance */}
              <Grid item xs={12} md={6}></Grid>

              {/* Form Actions */}
              <Grid item xs={12}>
                <Divider sx={{ mt: 2, mb: 4 }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 2, 
                  flexDirection: isXsScreen ? 'column' : 'row'
                }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/masters/all-projects-site')}
                    disabled={submitting}
                    fullWidth={isXsScreen}
                    sx={{
                      borderRadius: 2,
                      py: 1.2,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    fullWidth={isXsScreen}
                    sx={{
                      backgroundColor: theme.palette.success.main,
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.2,
                      px: 4,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                      '&:hover': {
                        backgroundColor: theme.palette.success.dark,
                        boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)',
                      }
                    }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      isEditMode ? 'Update Project' : 'Add Project'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={Fade}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity}
            sx={{ 
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              '& .MuiAlert-icon': {
                fontSize: '1.2rem'
              }
            }}
            variant="filled"
            elevation={6}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={handleSnackbarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default AddProjects;