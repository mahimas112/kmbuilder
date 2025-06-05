import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Alert,
  Box,
  Divider,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../axiosInstance';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AddEditEnquiry = ({ 
  open, 
  onClose, 
  mode = 'add', 
  currentEnquiry = null,
  onSuccess,
  refetchEnquiries
}) => {
  // State for form data
  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    email: '',
    dateOfBirth: null,
    state: '',
    city: '',
    plotSize: '',
    budget: '',
    referenceCode: '',
    primeLocationDetail: '',
    source: '',
    followupDate: null,
    leadType: ''
  });
  
  // State for API interactions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Options for dropdowns
  const sourceOptions = [
    'Website', 'Referral', 'Social Media', 'Advertisement', 'Direct Call', 'Walk-in', 'Other'
  ];
  
  const leadTypeOptions = [
    'Hot', 'Warm', 'Cold', 'New Lead', 'Follow-up'
  ];
  
  const referenceCodeOptions = [
    'RC001', 'RC002', 'RC003', 'RC004', 'RC005'
  ];

  // Update form data when editing existing enquiry
  useEffect(() => {
    if (mode === 'edit' && currentEnquiry) {
      setFormData({
        customerName: currentEnquiry.customerName || '',
        mobile: currentEnquiry.mobile || '',
        email: currentEnquiry.email || '',
        dateOfBirth: currentEnquiry.dateOfBirth || null,
        state: currentEnquiry.state || '',
        city: currentEnquiry.city || '',
        plotSize: currentEnquiry.plotSize || '',
        budget: currentEnquiry.budget || '',
        referenceCode: currentEnquiry.referenceCode || '',
        primeLocationDetail: currentEnquiry.primeLocationDetail || '',
        source: currentEnquiry.source || '',
        followupDate: currentEnquiry.followupDate || null,
        leadType: currentEnquiry.leadType || ''
      });
    } else {
      // Reset form for add mode
      setFormData({
        customerName: '',
        mobile: '',
        email: '',
        dateOfBirth: null,
        state: '',
        city: '',
        plotSize: '',
        budget: '',
        referenceCode: '',
        primeLocationDetail: '',
        source: '',
        followupDate: null,
        leadType: ''
      });
    }
    setError(null);
    setSubmitted(false);
  }, [mode, currentEnquiry, open]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user makes changes
    if (submitted) setError(null);
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
    
    if (submitted) setError(null);
  };

  // Form validation
  const validateForm = () => {
    setSubmitted(true);
    
    if (!formData.customerName || formData.customerName.trim() === '') {
      setError('Customer name is required');
      return false;
    }
    
    if (!formData.mobile || formData.mobile.trim() === '') {
      setError('Mobile number is required');
      return false;
    }
    
    // Additional validation logic as needed
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      const apiEndpoint = '/api';
      
      if (mode === 'add') {
        // Create new enquiry
        response = await axiosInstance.post(
          `${apiEndpoint}/enquiries`,
          formData
        );
        
        if (response.status === 201) {
          if (onSuccess) onSuccess('Enquiry added successfully');
          if (refetchEnquiries) refetchEnquiries();
          handleClose();
        } else {
          setError(response.data.message || 'Failed to add enquiry. Please try again.');
        }
      } else if (mode === 'edit' && currentEnquiry) {
        // Update existing enquiry
        response = await axiosInstance.put(
          `${apiEndpoint}/enquiries/${currentEnquiry.id}`,
          formData
        );
        
        if (response.status === 200) {
          if (onSuccess) onSuccess('Enquiry updated successfully');
          if (refetchEnquiries) refetchEnquiries();
          handleClose();
        } else {
          setError(response.data.message || 'Failed to update enquiry. Please try again.');
        }
      }
    } catch (error) {
      console.error('API error:', error);
      
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else if (error.response.status === 400) {
          setError('Invalid data provided. Please check your input.');
        } else if (error.response.status === 404) {
          setError('Enquiry not found.');
        } else {
          setError(`Error: ${error.response.status} - ${error.response.statusText}`);
        }
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Request configuration error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (!loading) {
      setFormData({
        customerName: '',
        mobile: '',
        email: '',
        dateOfBirth: null,
        state: '',
        city: '',
        plotSize: '',
        budget: '',
        referenceCode: '',
        primeLocationDetail: '',
        source: '',
        followupDate: null,
        leadType: ''
      });
      setError(null);
      setSubmitted(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 1
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          {mode === 'add' ? 'Add New Enquiry' : 'Edit Enquiry'}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          disabled={loading}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
          <Grid container spacing={2}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                Personal Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="customerName"
                label="Customer Name"
                fullWidth
                value={formData.customerName}
                onChange={handleChange}
                required
                error={submitted && !formData.customerName}
                helperText={submitted && !formData.customerName ? "Customer name is required" : ""}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="mobile"
                label="Mobile"
                fullWidth
                value={formData.mobile}
                onChange={handleChange}
                required
                error={submitted && !formData.mobile}
                helperText={submitted && !formData.mobile ? "Mobile number is required" : ""}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              {/* <DatePicker
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(date) => handleDateChange('dateOfBirth', date)}
                disabled={loading}
                renderInput={(params) => <TextField {...params} fullWidth />}
                format="dd/MM/yyyy"
              /> */}
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="state"
                label="State"
                fullWidth
                value={formData.state}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="city"
                label="City"
                fullWidth
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            {/* Property Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                Property Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="plotSize"
                label="Plot Size (sqft.)"
                fullWidth
                value={formData.plotSize}
                onChange={handleChange}
                disabled={loading}
                type="number"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="budget"
                label="Budget"
                fullWidth
                value={formData.budget}
                onChange={handleChange}
                disabled={loading}
                type="number"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Reference Code</InputLabel>
                <Select
                  name="referenceCode"
                  value={formData.referenceCode}
                  label="Reference Code"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="">Select</MenuItem>
                  {referenceCodeOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="primeLocationDetail"
                label="Prime Location Detail"
                fullWidth
                value={formData.primeLocationDetail}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            {/* Lead Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                Lead Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  name="source"
                  value={formData.source}
                  label="Source"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="">Select Source</MenuItem>
                  {sourceOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              {/* <DatePicker
                label="Follow-up Date"
                value={formData.followupDate}
                onChange={(date) => handleDateChange('followupDate', date)}
                disabled={loading}
                renderInput={(params) => <TextField {...params} fullWidth />}
                format="dd/MM/yyyy"
              /> */}
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Lead Type</InputLabel>
                <Select
                  name="leadType"
                  value={formData.leadType}
                  label="Lead Type"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="">Select Lead Type</MenuItem>
                  {leadTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        {/* </LocalizationProvider> */}
        
        {mode === 'edit' && currentEnquiry && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="caption" color="text.secondary">
              Enquiry ID: {currentEnquiry.id}
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2.5 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
          sx={{ 
            bgcolor: '#6B66FF',
            '&:hover': { bgcolor: '#5652e5' },
            minWidth: 100
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Saving...' : mode === 'add' ? 'Add Enquiry' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditEnquiry;