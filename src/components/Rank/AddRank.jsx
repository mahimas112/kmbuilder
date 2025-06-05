import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Typography,
  Alert,
  Box,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PercentIcon from '@mui/icons-material/Percent';
import axios from 'axios';
import axiosInstance from '../../axiosInstance';
const AddRank = ({ 
  open, 
  onClose, 
  mode = 'add', 
  currentRank = null,
  onSuccess,
  refetchRanks
}) => {
  // State for form data
  const [formData, setFormData] = useState({
    rankName: '',
    rankNumber: '',
    commissionPercent: ''
  });
  
  // State for API interactions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Update form data when editing existing rank
  useEffect(() => {
    if (mode === 'edit' && currentRank) {
      setFormData({
        rankName: currentRank.rankName || '',
        rankNumber: currentRank.rankNumber || '',
        commissionPercent: currentRank.commissionPercent || ''
      });
    } else {
      // Reset form for add mode
      setFormData({
        rankName: '',
        rankNumber: '',
        commissionPercent: ''
      });
    }
    setError(null);
    setSubmitted(false);
  }, [mode, currentRank, open]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate numeric inputs
    if (name === 'rankNumber' || name === 'commissionPercent') {
      // Allow only numbers, empty string, and decimal point for commission
      const regex = name === 'rankNumber' ? /^[0-9]*$/ : /^[0-9]*\.?[0-9]*$/;
      if (value === '' || regex.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear errors when user makes changes
    if (submitted) setError(null);
  };

  // Form validation
  const validateForm = () => {
    setSubmitted(true);
    
    if (!formData.rankName || formData.rankName.trim() === '') {
      setError('Rank name is required');
      return false;
    }
    
    if (!formData.rankNumber) {
      setError('Rank number is required');
      return false;
    }
    
    if (!formData.commissionPercent) {
      setError('Commission percentage is required');
      return false;
    }
    
    // Convert to numbers for comparison
    const commission = parseFloat(formData.commissionPercent);
    if (commission < 0 || commission > 100) {
      setError('Commission percentage must be between 0 and 100');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Prepare data
      const rankData = {
        rankName: formData.rankName.trim(),
        rankNumber: parseInt(formData.rankNumber),
        commissionPercent: parseFloat(formData.commissionPercent)
      };
      
      // Add rankId for edit mode
      if (mode === 'edit' && currentRank && currentRank.rankId) {
        rankData.rankId = currentRank.rankId;
      }
      
      // Using axiosInstance instead of axios directly
      // No need for full URL since base URL is included in axiosInstance
      const endpoint = '/realEstate/rank/post';
      
      // Determine method based on mode
      let response;
      if (mode === 'add') {
        response = await axiosInstance.post(endpoint, rankData);
      } else {
        response = await axiosInstance.put(endpoint, rankData);
      }
      
      if (response.data && (response.data.status === 201 || response.data.status === 202)) {
        const successMessage = mode === 'add' ? 'Rank added successfully' : 'Rank updated successfully';
        if (onSuccess) onSuccess(successMessage);
        if (refetchRanks) refetchRanks();
        handleClose();
      } else {
        throw new Error(response.data?.message || 'Operation failed. Please try again.');
      }
    } catch (error) {
      console.error('API error:', error);
      
      if (error.response) {
        // Handle specific error responses
        if (error.response.data && error.response.data.message) {
          setError(error.response.data.data);
        } else if (error.response.status === 400) {
          setError('Invalid data provided. Please check your input.');
        } else if (error.response.status === 409) {
          setError('A rank with this name or number already exists.');
        } else if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Error: ${error.response.status} - ${error.response.statusText}`);
        }
      } else if (error.request) {
        // Request made but no response
        setError('No response from server. Please check your connection.');
      } else {
        // Other errors
        setError('Error: ' + (error.message || 'Something went wrong'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (!loading) {
      setFormData({
        rankName: '',
        rankNumber: '',
        commissionPercent: ''
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
      maxWidth="sm"
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
          {mode === 'add' ? 'Add New Rank' : 'Edit Rank'}
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
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="rankName"
              label="Rank Name"
              placeholder="e.g., Senior Agent, Team Lead, etc."
              fullWidth
              value={formData.rankName}
              onChange={handleChange}
              required
              error={submitted && !formData.rankName}
              helperText={submitted && !formData.rankName ? "Rank name is required" : ""}
              disabled={loading}
              inputProps={{ maxLength: 50 }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="rankNumber"
              label="Rank Number"
              placeholder="e.g., 1, 2, 3, etc."
              fullWidth
              value={formData.rankNumber}
              onChange={handleChange}
              required
              error={submitted && !formData.rankNumber}
              helperText={submitted && !formData.rankNumber ? "Rank number is required" : ""}
              disabled={loading}
              type="text"
              inputProps={{ inputMode: 'numeric' }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="commissionPercent"
              label="Commission Percentage"
              placeholder="e.g., 5, 10, 15, etc."
              fullWidth
              value={formData.commissionPercent}
              onChange={handleChange}
              required
              error={submitted && (!formData.commissionPercent || parseFloat(formData.commissionPercent) < 0 || parseFloat(formData.commissionPercent) > 100)}
              helperText={
                submitted && !formData.commissionPercent 
                  ? "Commission percentage is required" 
                  : submitted && (parseFloat(formData.commissionPercent) < 0 || parseFloat(formData.commissionPercent) > 100)
                    ? "Must be between 0 and 100"
                    : ""
              }
              disabled={loading}
              type="text"
              inputProps={{ inputMode: 'decimal' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PercentIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        
        {mode === 'edit' && currentRank && currentRank.rankId && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="caption" color="text.secondary">
              Rank ID: {currentRank.rankId}
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
          {loading ? 'Saving...' : mode === 'add' ? 'Add Rank' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRank;