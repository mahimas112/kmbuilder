import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from '../../../axiosInstance';

const initialFormData = {
  plotRateId: "",
  projectId: "",
  blockId: "",
  plotRate: "",
  projectName: "",
  block: ""
};

const PLCRateTab = () => {
  // State variables
  const [formData, setFormData] = useState(initialFormData);
  const [plotRates, setPlotRates] = useState([]);
  const [filteredPlotRates, setFilteredPlotRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Additional state for projects and blocks
  const [projects, setProjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [blocksLoading, setBlocksLoading] = useState(false);
  const [blocksError, setBlocksError] = useState(null);

  useEffect(() => {
    fetchPlotRates();
    fetchProjects();
  }, []);

  // Handle search filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPlotRates(plotRates);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = plotRates.filter(item => {
        return (
          (item.projectName && item.projectName.toLowerCase().includes(lowercasedFilter)) ||
          (item.block && item.block.toLowerCase().includes(lowercasedFilter)) ||
          (item.plotRate && item.plotRate.toString().includes(lowercasedFilter))
        );
      });
      setFilteredPlotRates(filtered);
    }
  }, [searchTerm, plotRates]);

  // Fetch all plot rates
  const fetchPlotRates = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/realEstate/plot-rate/getAll');
      
      if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
        setPlotRates(response.data.data);
        setFilteredPlotRates(response.data.data);
      } else {
        handleNotification('Failed to fetch plot rates. Invalid response format.', 'error');
        console.error('Invalid response format:', response.data);
        setPlotRates([]);
        setFilteredPlotRates([]);
      }
    } catch (error) {
      handleApiError(error, 'Failed to fetch plot rates');
      setPlotRates([]);
      setFilteredPlotRates([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all projects
  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const response = await axiosInstance.get('/realEstate/project/getAll');
      
      if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
        setProjects(response.data.data);
      } else {
        console.error('Invalid projects response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Fetch blocks for a specific project
  const fetchBlocksByProject = async (projectId) => {
    if (!projectId) {
      setBlocks([]);
      return;
    }
    
    setBlocksLoading(true);
    setBlocksError(null);
    try {
      const response = await axiosInstance.get(`/realEstate/Block/getAllBlockByProjectUUId?projectId=${projectId}`);
      
      if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
        setBlocks(response.data.data);
        if (response.data.data.length === 0) {
          setBlocksError('No blocks found for this project');
        }
      } else {
        setBlocksError('Failed to fetch blocks for this project');
        console.error('Invalid blocks response format:', response.data);
        setBlocks([]);
      }
    } catch (error) {
      setBlocksError('Error fetching blocks. Please try again.');
      console.error('Error fetching blocks:', error);
      setBlocks([]);
    } finally {
      setBlocksLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If project changes, fetch blocks and update project name
    if (name === 'projectId') {
      fetchBlocksByProject(value);
      
      const selectedProject = projects.find(p => p.projectId === value);
      if (selectedProject) {
        setFormData(prev => ({
          ...prev,
          projectName: selectedProject.projectName || selectedProject.siteName,
          // Reset block when project changes
          blockId: '',
          block: ''
        }));
      }
    }
    
    // If block changes, update block name
    if (name === 'blockId') {
      const selectedBlock = blocks.find(b => b.blockId === value);
      if (selectedBlock) {
        setFormData(prev => ({
          ...prev,
          block: selectedBlock.block
        }));
      }
    }
  };

  const validateForm = () => {
    if (!formData.projectId) {
      handleNotification('Please select a project', 'error');
      return false;
    }
    
    if (!formData.blockId) {
      handleNotification('Please select a block', 'error');
      return false;
    }
    
    if (!formData.plotRate || formData.plotRate <= 0) {
      handleNotification('Please enter a valid plot rate', 'error');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    console.log(formData);
    
    setIsSubmitting(true);
    try {
      if (isEditing) {
        // Update existing plot rate
        const response = await axiosInstance.put(`/realEstate/plot-rate/update?plotRateId=${formData.plotRateId}`, {
          plotRateId: formData.plotRateId,
          projectId: formData.projectId,
          blockId: formData.blockId,
          plotRate: Number(formData.plotRate),
          projectName: projects.find(p => p.projectId === formData.projectId)?.siteName || formData.siteName,
          block: blocks.find(b => b.blockId === formData.blockId)?.block || formData.block
        });
        
        
        if (response.data && response.data.status === 201) {
          handleNotification('Plot rate updated successfully', 'success');
          fetchPlotRates(); // Refresh the list
          resetForm();
        } else {
          handleNotification(response.data.message || 'Failed to update plot rate', 'error');
        }
      } else {
        // Create new plot rate
        const response = await axiosInstance.post('/realEstate/plot-rate/post', {
          plotRateId: null, // Will be generated by the server
          projectId: formData.projectId,
          blockId: formData.blockId,
          plotRate: Number(formData.plotRate),
          projectName: formData.projectName, // Will be populated by the server
          block: formData.block // Will be populated by the server
        });
        
        if (response.data && response.data.status === 201) {
          handleNotification('Plot rate added successfully', 'success');
          fetchPlotRates(); // Refresh the list
          resetForm();
        } else {
          handleNotification(response.data.message || 'Failed to add plot rate', 'error');
        }
      }
    } catch (error) {
      handleApiError(error, isEditing ? 'Failed to update plot rate' : 'Failed to add plot rate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (plotRate) => {
    setFormData({
      plotRateId: plotRate.plotRateId,
      projectId: plotRate.projectId,
      blockId: plotRate.blockId,
      plotRate: plotRate.plotRate,
      projectName: plotRate.projectName,
      block: plotRate.block
    });
    
    // Fetch blocks for the selected project
    fetchBlocksByProject(plotRate.projectId);
    
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setBlocks([]);
    setBlocksError(null);
  };

  const handleCancel = () => {
    resetForm();
  };

  // Helper function for consistent API error handling
  const handleApiError = (error, defaultMessage) => {
    console.error(defaultMessage, error);
    
    let errorMessage = defaultMessage;
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid data provided. Please check your input.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 409:
            errorMessage = 'A plot rate for this block already exists.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `Error: ${error.response.status} - ${error.response.statusText}`;
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your connection.';
    } else {
      // Something happened in setting up the request
      errorMessage = 'Request configuration error: ' + error.message;
    }
    
    handleNotification(errorMessage, 'error');
  };

  // Helper function for showing notifications
  const handleNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with title and search */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Plot Rate Management
        </Typography>
        
        <TextField
          placeholder="Search rates..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 220 } }}
        />
      </Box>
      
      {/* Form Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          border: '1px solid #e0e0e0',
          borderRadius: 1
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {isEditing ? 'Edit Plot Rate' : 'Add New Plot Rate'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required error={!formData.projectId}>
                <InputLabel>Project</InputLabel>
                <Select
                  name="projectId"
                  value={formData.projectId}
                  label="Project"
                  onChange={handleChange}
                  disabled={isSubmitting || projectsLoading}
                >
                  {projectsLoading ? (
                    <MenuItem disabled>
                      Loading projects...
                    </MenuItem>
                  ) : projects.length === 0 ? (
                    <MenuItem disabled>
                      No projects available
                    </MenuItem>
                  ) : (
                    projects.map((project) => (
                      <MenuItem key={project.projectId} value={project.projectId}>
                        {project.projectName || project.siteName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required error={!formData.blockId}>
                <InputLabel>Block</InputLabel>
                <Select
                  name="blockId"
                  value={formData.blockId}
                  label="Block"
                  onChange={handleChange}
                  disabled={isSubmitting || blocksLoading || !formData.projectId}
                >
                  {blocksLoading ? (
                    <MenuItem disabled>
                      Loading blocks...
                    </MenuItem>
                  ) : blocksError ? (
                    <MenuItem disabled>
                      {blocksError}
                    </MenuItem>
                  ) : blocks.length === 0 ? (
                    <MenuItem disabled>
                      {formData.projectId ? 'No blocks available for this project' : 'Select a project first'}
                    </MenuItem>
                  ) : (
                    blocks.map((block) => (
                      <MenuItem key={block.blockId} value={block.blockId}>
                        {block.block}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Plot Rate"
                name="plotRate"
                type="number"
                value={formData.plotRate}
                onChange={handleChange}
                disabled={isSubmitting}
                InputProps={{ 
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  inputProps: { min: 1 }
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : (isEditing ? null : <AddIcon />)}
              sx={{
                bgcolor: '#6B66FF',
                '&:hover': { bgcolor: '#5652e5' }
              }}
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Rate' : 'Add Rate')}
            </Button>
            
            {isEditing && (
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      {/* Table Section */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          overflowX: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: 1
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: '#DAE1F3' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Block</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rate (₹)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading plot rates...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredPlotRates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1">
                    No plot rates found. {searchTerm && "Try adjusting your search criteria."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPlotRates.map((rate) => (
                <TableRow key={rate.plotRateId}>
                  <TableCell sx={{ fontWeight: 500 }}>{rate.projectName}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{rate.block}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>₹{rate.plotRate.toLocaleString()}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#6B66FF' }}
                        onClick={() => handleEdit(rate)}
                        disabled={isSubmitting}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Notifications */}
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

export default PLCRateTab;