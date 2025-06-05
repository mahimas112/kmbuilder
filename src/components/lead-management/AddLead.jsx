import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
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

const AddLead = ({ 
    open, 
    onClose, 
    mode = 'add', 
    currentLead = null,
    onSuccess,
    refetchLeads,
    sources,
    leadTypes
}) => {
    // State for form data
    const [formData, setFormData] = useState({
        enquiryId: 0,
        customerName: '',
        mobile: '',
        email: '',
        dateOfBirth: '',
        state: '',
        city: '',
        plotSize: 0,
        budget: 0,
        primeDetailLocation: '',
        followupDate: '',
        sourceId: 0,
        leadId: 0,
    });
    
    // State for API interactions
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // Update form data when editing existing lead
    useEffect(() => {
        if (mode === 'edit' && currentLead) {
            setFormData({
                ...currentLead
            });
        } else {
            // Reset form for add mode
            setFormData({
                enquiryId: 0,
                customerName: '',
                mobile: '',
                email: '',
                dateOfBirth: '',
                state: '',
                city: '',
                plotSize: 0,
                budget: 0,
                primeDetailLocation: '',
                followupDate: '',
                sourceId: 0,
                leadId: 0,
            });
        }
        setError(null);
        setSubmitted(false);
    }, [mode, currentLead, open]);

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

    // Form validation
    const validateForm = () => {
        setSubmitted(true);
        
        const newErrors = {};
        
        // Add validation rules
        if (!formData.customerName || formData.customerName.trim() === '') {
            newErrors.customerName = 'Customer name is required';
        }
        
        if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Valid 10-digit mobile number is required';
        }
        
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Valid email is required';
        }
        
        if (!formData.sourceId) {
            newErrors.sourceId = 'Source is required';
        }
        
        if (!formData.leadId) {
            newErrors.leadId = 'Lead type is required';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return false;
        }
        
        return true;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            let response;
            
            if (mode === 'add') {
                // Create new lead
                response = await axiosInstance.post(
                    '/realEstate/enquiry/createEnquiry',
                    formData
                );
                
                if (response.data.status === 201) {
                    if (onSuccess) onSuccess('Lead added successfully');
                    if (refetchLeads) refetchLeads();
                    onClose();
                } else {
                    setError(response.data.message || 'Failed to add lead. Please try again.');
                }
            } else if (mode === 'edit' && currentLead) {
                // Update existing lead
                response = await axiosInstance.put(
                    '/realEstate/enquiry/updateEnquiry',
                    formData
                );
                
                if (response.data.status === 202) {
                    if (onSuccess) onSuccess('Lead updated successfully');
                    if (refetchLeads) refetchLeads();
                    onClose();
                } else {
                    setError(response.data.message || 'Failed to update lead. Please try again.');
                }
            }
        } catch (error) {
            console.error('API error:', error);
            
            if (error.response) {
                // Server responded with an error
                if (error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError(`Error: ${error.response.status} - ${error.response.statusText}`);
                }
            } else if (error.request) {
                // No response received
                setError('No response from server. Please check your connection.');
            } else {
                // Error setting up the request
                setError('Request configuration error: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
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
                    {mode === 'add' ? 'Add New Lead' : 'Edit Lead'}
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <Divider />
            
            <DialogContent sx={{ pt: 3 }}>
                {error && typeof error === 'object' ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {Object.values(error).map((err, index) => (
                            <div key={index}>{err}</div>
                        ))}
                    </Alert>
                ) : error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Customer Name"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                            error={submitted && !formData.customerName}
                            helperText={submitted && !formData.customerName ? "Customer name is required" : ""}
                            disabled={loading}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            error={submitted && (!formData.mobile || !/^\d{10}$/.test(formData.mobile))}
                            helperText={submitted && (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) ? "Valid 10-digit mobile number is required" : ""}
                            disabled={loading}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            error={submitted && (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))}
                            helperText={submitted && (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) ? "Valid email is required" : ""}
                            disabled={loading}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            disabled={loading}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Plot Size"
                            name="plotSize"
                            type="number"
                            value={formData.plotSize}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Budget"
                            name="budget"
                            type="number"
                            value={formData.budget}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Prime Detail Location"
                            name="primeDetailLocation"
                            value={formData.primeDetailLocation}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Follow-up Date"
                            name="followupDate"
                            type="date"
                            value={formData.followupDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            disabled={loading}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Source"
                            name="sourceId"
                            value={formData.sourceId}
                            onChange={handleChange}
                            required
                            error={submitted && !formData.sourceId}
                            helperText={submitted && !formData.sourceId ? "Source is required" : ""}
                            disabled={loading}
                        >
                            {sources.map((source) => (
                                <MenuItem key={source.sourceId} value={source.sourceId}>
                                    {source.sourceName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Lead Type"
                            name="leadId"
                            value={formData.leadId}
                            onChange={handleChange}
                            required
                            error={submitted && !formData.leadId}
                            helperText={submitted && !formData.leadId ? "Lead type is required" : ""}
                            disabled={loading}
                        >
                            {leadTypes.map((leadType) => (
                                <MenuItem key={leadType.leadId} value={leadType.leadId}>
                                    {leadType.leadTypeName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </DialogContent>
            
            <DialogActions sx={{ px: 3, py: 2.5 }}>
                <Button 
                    onClick={onClose} 
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
                    {loading ? 'Saving...' : mode === 'add' ? 'Add Lead' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddLead;