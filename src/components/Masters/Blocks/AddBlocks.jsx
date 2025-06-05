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
import axiosInstance from '../../../axiosInstance';

const AddBlock = ({ 
  open, 
  onClose, 
  mode = 'add', 
  currentBlock = null,
  onSuccess,
  refetchBlocks
}) => {
  // State for form data
  const [formData, setFormData] = useState({
    block: '',
    projectId: '',
    projectName: ''
  });
  
  // State for API interactions
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Update form data when editing existing block
  useEffect(() => {
    if (mode === 'edit' && currentBlock) {
      setFormData({
        block: currentBlock.block || '',
        projectId: currentBlock.projectId || '',
        projectName: currentBlock.projectName || ''
      });
    } else {
      // Reset form for add mode
      setFormData({
        block: '',
        projectId: '',
        projectName: ''
      });
    }
    setError(null);
    setSubmitted(false);
  }, [mode, currentBlock, open]);

  // Fetch all projects when dialog opens
  useEffect(() => {
    if (open) {
      fetchProjects();
    }
  }, [open]);

  // Fetch projects for dropdown
  const fetchProjects = async () => {
    setProjectsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/realEstate/project/getAll');
      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setProjects(response.data.data);
      } else {
        setError('Failed to load projects. Please try again.');
        console.error('Invalid response format:', response.data);
      }
    } catch (error) {
      setError('Network error. Could not fetch projects.');
      console.error('Error fetching projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If project ID changes, update project name
    if (name === 'projectId') {
      const selectedProject = projects.find(p => p.projectId === value);
      if (selectedProject) {
        setFormData(prev => ({
          ...prev,
          projectName: selectedProject.siteName || selectedProject.projectName
        }));
      }
    }

    // Clear errors when user makes changes
    if (submitted) setError(null);
  };

  // Form validation
  const validateForm = () => {
    setSubmitted(true);
    
    if (!formData.block || formData.block.trim() === '') {
      setError('Block name is required');
      return false;
    }
    
    if (!formData.projectId) {
      setError('Project selection is required');
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
      let response;
      
      if (mode === 'add') {
        // Create new block
        response = await axiosInstance.post(
          '/realEstate/Block/post',
          {
            block: formData.block.trim(),
            projectId: formData.projectId,
            projectName: formData.projectName,
            
          }
        );
        
        if (response.data.status === 201) {
          if (onSuccess) onSuccess('Block added successfully');
          if (refetchBlocks) refetchBlocks();
          handleClose();
        } else {
          setError(response.data.message || 'Failed to add block. Please try again.');
        }
      } else if (mode === 'edit' && currentBlock) {
        // Update existing block
        response = await axiosInstance.put(
          `/realEstate/Block/updateBlock`,
          {
            block: formData.block.trim(),
            projectId: formData.projectId,
            projectName: currentBlock.projectName,
            blockId: currentBlock.blockId
          }
        );
        
        if (response.data.status === 201) {
          if (onSuccess) onSuccess('Block updated successfully');
          if (refetchBlocks) refetchBlocks();
          handleClose();
        } else {
          setError(response.data.message || 'Failed to update block. Please try again.');
        }
      }
    } catch (error) {
      console.error('API error:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else if (error.response.status === 400) {
          setError('Invalid data provided. Please check your input.');
        } else if (error.response.status === 404) {
          setError('Block or project not found.');
        } else if (error.response.status === 409) {
          setError('A block with this name already exists for this project.');
        } else if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Error: ${error.response.status} - ${error.response.statusText}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
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
        block: '',
        projectId: '',
        projectName: ''
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
          {mode === 'add' ? 'Add New Block' : 'Edit Block'}
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
              name="block"
              label="Block Name"
              placeholder="e.g., A, B, Tower-1, etc."
              fullWidth
              value={formData.block}
              onChange={handleChange}
              required
              error={submitted && !formData.block}
              helperText={submitted && !formData.block ? "Block name is required" : ""}
              disabled={loading}
              inputProps={{ maxLength: 50 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth required error={submitted && !formData.projectId}>
              <InputLabel>Project</InputLabel>
              <Select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                label="Project"
                disabled={loading || projectsLoading}
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
                      {project.siteName || project.projectName}
                    </MenuItem>
                  ))
                )}
              </Select>
              {submitted && !formData.projectId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  Project selection is required
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
        
        {mode === 'edit' && currentBlock && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="caption" color="text.secondary">
              Block ID: {currentBlock.blockId}
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
          {loading ? 'Saving...' : mode === 'add' ? 'Add Block' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBlock;