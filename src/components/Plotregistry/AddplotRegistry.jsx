import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  FormHelperText,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
// import { format, parseISO } from 'date-fns';

const PlotRegistryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode = 'add', registry = null } = location.state || {};

  // Initial form state
  const initialFormData = {
    registryId: '',
    projectId: '',
    blockId: '',
    addPlotId: '',
    bookingCode: '',
    customerId: '',
    customerName: '',
    gataNumber: '',
    sellerName: '',
    registerNo: '',
    registryDate: null,
    projectName: ''
  };

  // Form states
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Data fetching states
  const [projects, setProjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [plots, setPlots] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  // Loading states
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [blocksLoading, setBlocksLoading] = useState(false);
  const [plotsLoading, setPlotsLoading] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Set initial data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && registry) {
      // Format date from string to Date object
      const formattedRegistryDate = registry.registryDate ? (registry.registryDate) : null;
      
      setFormData({
        registryId: registry.registryId || '',
        projectId: registry.projectId || '',
        blockId: registry.blockId || '',
        addPlotId: registry.addPlotId || '',
        bookingCode: registry.bookingCode || '',
        customerId: registry.customerId || '',
        customerName: registry.customerName || '',
        gataNumber: registry.gataNumber || '',
        sellerName: registry.sellerName || '',
        registerNo: registry.registerNo || '',
        registryDate: formattedRegistryDate,
        projectName: registry.projectName || ''
      });
      
      // Fetch dependent data when in edit mode
      if (registry.projectId) {
        fetchBlocks(registry.projectId);
        if (registry.blockId) {
          fetchPlots(registry.blockId);
        }
      }
    }
  }, [mode, registry]);

  // Fetch all projects when component mounts
  useEffect(() => {
    fetchProjects();
    fetchCustomers();
  }, []);

  // Fetch projects
  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const response = await axiosInstance.get('/realEstate/project/getAll');
      
      if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
        setProjects(response.data.data);
      } else {
        console.error('Invalid projects response format:', response.data);
        setProjects([
          { projectId: '1', siteName: 'Green Valley Heights' },
          { projectId: '2', siteName: 'Sunset Gardens' },
          { projectId: '3', siteName: 'Metro City Towers' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Set dummy data for projects
      setProjects([
        { projectId: '1', siteName: 'Green Valley Heights' },
        { projectId: '2', siteName: 'Sunset Gardens' },
        { projectId: '3', siteName: 'Metro City Towers' }
      ]);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Fetch blocks based on selected project
  const fetchBlocks = async (projectId) => {
    if (!projectId) return;
    
    setBlocksLoading(true);
    setBlocks([]);
    
    try {
      const response = await axiosInstance.get(`/realEstate/Block/getBlockByProjectId/${projectId}`);
      
      if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
        setBlocks(response.data.data);
      } else {
        console.error('Invalid blocks response format:', response.data);
        // Set dummy data for blocks
        setBlocks([
          { blockId: 'b1', block: 'A' },
          { blockId: 'b2', block: 'B' },
          { blockId: 'b3', block: 'C' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
      // Set dummy data for blocks
      setBlocks([
        { blockId: 'b1', block: 'A' },
        { blockId: 'b2', block: 'B' },
        { blockId: 'b3', block: 'C' }
      ]);
    } finally {
      setBlocksLoading(false);
    }
  };

  // Fetch plots based on selected block
  const fetchPlots = async (blockId) => {
    if (!blockId) return;
    
    setPlotsLoading(true);
    setPlots([]);
    
    try {
      const response = await axiosInstance.get(`/realEstate/plot/getPlotByBlockId/${blockId}`);
      
      if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
        setPlots(response.data.data);
      } else {
        console.error('Invalid plots response format:', response.data);
        // Set dummy data for plots
        setPlots([
          { addPlotId: 'p1', plotNo: '101', bookingCode: 'BK001', customerName: 'John Doe', customerId: 'c1' },
          { addPlotId: 'p2', plotNo: '102', bookingCode: 'BK002', customerName: 'Jane Smith', customerId: 'c2' },
          { addPlotId: 'p3', plotNo: '103', bookingCode: 'BK003', customerName: 'Robert Johnson', customerId: 'c3' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching plots:', error);
      // Set dummy data for plots
      setPlots([
        { addPlotId: 'p1', plotNo: '101', bookingCode: 'BK001', customerName: 'John Doe', customerId: 'c1' },
        { addPlotId: 'p2', plotNo: '102', bookingCode: 'BK002', customerName: 'Jane Smith', customerId: 'c2' },
        { addPlotId: 'p3', plotNo: '103', bookingCode: 'BK003', customerName: 'Robert Johnson', customerId: 'c3' }
      ]);
    } finally {
      setPlotsLoading(false);
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    setCustomersLoading(true);
    try {
      const response = await axiosInstance.get('/realEstate/associate/getAllAssociate');
      
      if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
        // Filter customers with role as "Customer"
        const customersList = response.data.data.filter(item => item.role === 'Customer');
        setCustomers(customersList);
      } else {
        console.error('Invalid customers response format:', response.data);
        // Set dummy data for customers
        setCustomers([
          { associateId: 'c1', name: 'John Doe' },
          { associateId: 'c2', name: 'Jane Smith' },
          { associateId: 'c3', name: 'Robert Johnson' },
          { associateId: 'c4', name: 'Emily Davis' },
          { associateId: 'c5', name: 'Michael Brown' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Set dummy data for customers
      setCustomers([
        { associateId: 'c1', name: 'John Doe' },
        { associateId: 'c2', name: 'Jane Smith' },
        { associateId: 'c3', name: 'Robert Johnson' },
        { associateId: 'c4', name: 'Emily Davis' },
        { associateId: 'c5', name: 'Michael Brown' }
      ]);
    } finally {
      setCustomersLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // Additional actions based on field changes
    if (name === 'projectId') {
      // When project changes, reset block and plot selections
      setFormData(prev => ({
        ...prev,
        blockId: '',
        addPlotId: '',
        bookingCode: '',
        customerId: '',
        customerName: '',
        projectName: projects.find(p => p.projectId === value)?.siteName || ''
      }));
      
      // Fetch blocks for the selected project
      fetchBlocks(value);
    }
    
    if (name === 'blockId') {
      // When block changes, reset plot selection
      setFormData(prev => ({
        ...prev,
        addPlotId: '',
        bookingCode: '',
        customerId: '',
        customerName: ''
      }));
      
      // Fetch plots for the selected block
      fetchPlots(value);
    }
    
    if (name === 'addPlotId') {
      // When plot changes, update booking code and customer info
      const selectedPlot = plots.find(p => p.addPlotId === value);
      if (selectedPlot) {
        setFormData(prev => ({
          ...prev,
          bookingCode: selectedPlot.bookingCode || '',
          customerId: selectedPlot.customerId || '',
          customerName: selectedPlot.customerName || ''
        }));
      }
    }
    
    if (name === 'customerId') {
      // When customer changes, update customer name
      const selectedCustomer = customers.find(c => c.associateId === value);
      if (selectedCustomer) {
        setFormData(prev => ({
          ...prev,
          customerName: selectedCustomer.name || ''
        }));
      }
    }
  };

  // Handle date field changes
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      registryDate: date
    }));
    
    // Clear error when field is updated
    if (errors.registryDate) {
      setErrors(prev => ({
        ...prev,
        registryDate: null
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Required fields validation
    const requiredFields = [
      { key: 'projectId', label: 'Project' },
      { key: 'blockId', label: 'Block' },
      { key: 'addPlotId', label: 'Plot' },
      { key: 'customerId', label: 'Customer' },
      { key: 'gataNumber', label: 'Gata Number' },
      { key: 'sellerName', label: 'Seller Name' },
      { key: 'registerNo', label: 'Register Number' }
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field.key] || (typeof formData[field.key] === 'string' && !formData[field.key].trim())) {
        newErrors[field.key] = `${field.label} is required`;
        isValid = false;
      }
    });
    
    // Date validation
    if (!formData.registryDate) {
      newErrors.registryDate = 'Registry Date is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const dataToSend = {
        ...formData,
        registryDate: formData.registryDate ? (formData.registryDate, 'yyyy-MM-dd') : null
      };
      
      let response;
      
      if (mode === 'edit') {
        // Update existing registry
        response = await axiosInstance.put(
          `/realEstate/registry/update/${formData.registryId}`,
          dataToSend
        );
      } else {
        // Create new registry
        response = await axiosInstance.post(
          '/realEstate/registry/post',
          dataToSend
        );
      }
      
      if (response.data && (response.data.status === 201 || response.data.status === 200)) {
        setNotification({
          open: true,
          message: `Registry ${mode === 'edit' ? 'updated' : 'created'} successfully`,
          severity: 'success'
        });
        
        // Redirect to registry list after short delay
        setTimeout(() => {
          navigate('/masters/registry-list');
        }, 2000);
      } else {
        throw new Error(response.data.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} registry`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      let errorMessage = `Failed to ${mode === 'edit' ? 'update' : 'create'} registry`;
      
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `Error: ${error.response.status} - ${error.response.statusText}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/masters/registry-list');
  };

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Paper
        elevation={0}
        sx={{ 
          p: { xs: 2, md: 4 }, 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
          {mode === 'edit' ? 'Edit Plot Registry' : 'New Plot Registry'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {mode === 'edit' 
            ? 'Update the plot registry information below' 
            : 'Fill out the form to create a new plot registry'
          }
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Project Selection */}
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                required 
                error={!!errors.projectId}
                disabled={submitting}
              >
                <InputLabel>Project</InputLabel>
                <Select
                  name="projectId"
                  value={formData.projectId}
                  label="Project"
                  onChange={handleChange}
                >
                  {projectsLoading ? (
                    <MenuItem disabled>Loading projects...</MenuItem>
                  ) : projects.length === 0 ? (
                    <MenuItem disabled>No projects available</MenuItem>
                  ) : (
                    projects.map(project => (
                      <MenuItem key={project.projectId} value={project.projectId}>
                        {project.siteName || project.projectName}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.projectId && (
                  <FormHelperText>{errors.projectId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* Block Selection */}
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                required 
                error={!!errors.blockId}
                disabled={!formData.projectId || blocksLoading || submitting}
              >
                <InputLabel>Block</InputLabel>
                <Select
                  name="blockId"
                  value={formData.blockId}
                  label="Block"
                  onChange={handleChange}
                >
                  {blocksLoading ? (
                    <MenuItem disabled>Loading blocks...</MenuItem>
                  ) : blocks.length === 0 ? (
                    <MenuItem disabled>No blocks available</MenuItem>
                  ) : (
                    blocks.map(block => (
                      <MenuItem key={block.blockId} value={block.blockId}>
                        {block.block}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.blockId && (
                  <FormHelperText>{errors.blockId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* Plot Selection */}
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                required 
                error={!!errors.addPlotId}
                disabled={!formData.blockId || plotsLoading || submitting}
              >
                <InputLabel>Plot</InputLabel>
                <Select
                  name="addPlotId"
                  value={formData.addPlotId}
                  label="Plot"
                  onChange={handleChange}
                >
                  {plotsLoading ? (
                    <MenuItem disabled>Loading plots...</MenuItem>
                  ) : plots.length === 0 ? (
                    <MenuItem disabled>No plots available</MenuItem>
                  ) : (
                    plots.map(plot => (
                      <MenuItem key={plot.addPlotId} value={plot.addPlotId}>
                        {plot.plotNo}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.addPlotId && (
                  <FormHelperText>{errors.addPlotId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* Booking Code */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Booking Code"
                name="bookingCode"
                value={formData.bookingCode}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                variant="filled"
                disabled={submitting}
              />
            </Grid>
            
            {/* Customer */}
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                required 
                error={!!errors.customerId}
                disabled={submitting}
              >
                <InputLabel>Customer</InputLabel>
                <Select
                  name="customerId"
                  value={formData.customerId}
                  label="Customer"
                  onChange={handleChange}
                >
                  {customersLoading ? (
                    <MenuItem disabled>Loading customers...</MenuItem>
                  ) : customers.length === 0 ? (
                    <MenuItem disabled>No customers available</MenuItem>
                  ) : (
                    customers.map(customer => (
                      <MenuItem key={customer.associateId} value={customer.associateId}>
                        {customer.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.customerId && (
                  <FormHelperText>{errors.customerId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* Customer Name (readonly) */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                InputProps={{
                  readOnly: true,
                }}
                variant="filled"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            {/* Registry Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                Registry Details
              </Typography>
            </Grid>
            
            {/* Gata Number */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Gata Number"
                name="gataNumber"
                value={formData.gataNumber}
                onChange={handleChange}
                error={!!errors.gataNumber}
                helperText={errors.gataNumber}
                disabled={submitting}
              />
            </Grid>
            
            {/* Registry Date */}
            <Grid item xs={12} md={6}>
              {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Registry Date*"
                  value={formData.registryDate}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={!!errors.registryDate}
                      helperText={errors.registryDate}
                      disabled={submitting}
                    />
                  )}
                  disabled={submitting}
                />
              </LocalizationProvider> */}
            </Grid>
            
            {/* Seller Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Seller Name"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleChange}
                error={!!errors.sellerName}
                helperText={errors.sellerName}
                disabled={submitting}
              />
            </Grid>
            
            {/* Register Number */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Register Number"
                name="registerNo"
                value={formData.registerNo}
                onChange={handleChange}
                error={!!errors.registerNo}
                helperText={errors.registerNo}
                disabled={submitting}
              />
            </Grid>
          </Grid>
          
          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              sx={{ 
                bgcolor: '#6B66FF',
                '&:hover': { bgcolor: '#5652e5' },
                minWidth: 100
              }}
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {submitting 
                ? (mode === 'edit' ? 'Updating...' : 'Saving...') 
                : (mode === 'edit' ? 'Update Registry' : 'Save Registry')
              }
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlotRegistryForm;