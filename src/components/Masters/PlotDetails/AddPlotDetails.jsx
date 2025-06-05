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

const AddPlotDetail = ({
  open,
  onClose,
  mode = 'add',
  currentPlot = null,
  onSuccess,
  refetchPlots
}) => {
  // State for form data
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    location: '',
    noOfPlots: 0,
    blockId: '',
    block: null,
    plotTypeId: '',
    plotTypeName: null,
    plotNo: '',
    plotRate: 0,
    plcRate: 0,
    plotArea: '',
    status: 'Available',
    developmentAmount: 0
  });

  // State for API interactions
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [plotTypes, setPlotTypes] = useState([]);
  const [plotRates, setPlotRates] = useState([]);
  const [plcRates, setPlcRates] = useState([]);

  const [projectsLoading, setProjectsLoading] = useState(false);
  const [blocksLoading, setBlocksLoading] = useState(false);
  const [plotTypesLoading, setPlotTypesLoading] = useState(false);
  const [plotRatesLoading, setPlotRatesLoading] = useState(false);
  const [plcRatesLoading, setPlcRatesLoading] = useState(false);

  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Status options
  const statusOptions = ['Available', 'Booked', 'Sold', 'Reserved'];

  // Update form data when editing existing plot
  useEffect(() => {
    if (mode === 'edit' && currentPlot) {
      setFormData({
        projectId: currentPlot.projectId || '',
        projectName: currentPlot.projectName || '',
        location: currentPlot.location || '',
        noOfPlots: currentPlot.noOfPlots || 0,
        blockId: currentPlot.blockId || '',
        block: currentPlot.block || '',
        plotTypeId: currentPlot.plotTypeId || '',
        plotTypeName: currentPlot.plotTypeName || '',
        plotNo: currentPlot.plotNo || '',
        plotRate: currentPlot.plotRate || 0,
        plcRate: currentPlot.plcRate || 0,
        plotArea: currentPlot.plotArea || '',
        status: currentPlot.status || 'Available',
        developmentAmount: currentPlot.developmentAmount || 0
      });

      // If we have a project ID, fetch the blocks for that project
      if (currentPlot.projectId) {
        fetchBlocksByProjectId(currentPlot.projectId);
      }
    } else {
      // Reset form for add mode
      setFormData({
        projectId: '',
        projectName: '',
        location: '',
        noOfPlots: 0,
        blockId: '',
        block: '',
        plotTypeId: '',
        plotTypeName: '',
        plotNo: '',
        plotRate: 0,
        plcRate: 0,
        plotArea: '',
        status: 'Available',
        developmentAmount: 0
      });
    }
    setError(null);
    setSubmitted(false);
  }, [mode, currentPlot, open]);

  // Fetch all initial data when dialog opens
  useEffect(() => {
    if (open) {
      fetchProjects();
      fetchPlotTypes();
      fetchAllPlotRates();
      fetchAllPlcRates();
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

  // Fetch blocks by project ID
  const fetchBlocksByProjectId = async (projectId) => {
    if (!projectId) {
      setBlocks([]);
      return;
    }

    setBlocksLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/realEstate/Block/getAllBlockByProjectUUId?projectId=${projectId}`);
      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setBlocks(response.data.data);
      } else {
        setError('Failed to load blocks. Please try again.');
        console.error('Invalid response format:', response.data);
      }
    } catch (error) {
      setError('Network error. Could not fetch blocks.');
      console.error('Error fetching blocks:', error);
    } finally {
      setBlocksLoading(false);
    }
  };

  // Fetch all plot types
  const fetchPlotTypes = async () => {
    setPlotTypesLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/realEstate/plotType/getAll');
      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setPlotTypes(response.data.data);
      } else {
        setError('Failed to load plot types. Please try again.');
        console.error('Invalid response format:', response.data);
      }
    } catch (error) {
      setError('Network error. Could not fetch plot types.');
      console.error('Error fetching plot types:', error);
    } finally {
      setPlotTypesLoading(false);
    }
  };

  // Fetch all plot rates
  const fetchAllPlotRates = async () => {
    setPlotRatesLoading(true);
    try {
      const response = await axiosInstance.get('/realEstate/plot-rate/getAll');
      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setPlotRates(response.data.data);
      } else {
        console.error('Invalid plot rates response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching plot rates:', error);
    } finally {
      setPlotRatesLoading(false);
    }
  };

  // Fetch all PLC rates
  const fetchAllPlcRates = async () => {
    setPlcRatesLoading(true);
    try {
      const response = await axiosInstance.get('/realEstate/plotType-rate-details/getAll');
      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setPlcRates(response.data.data);
      } else {
        console.error('Invalid PLC rates response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching PLC rates:', error);
    } finally {
      setPlcRatesLoading(false);
    }
  };

  // Auto-populate plot rate based on project and block selection
  const autoPopulatePlotRate = (projectId, blockId) => {
    if (projectId && blockId) {
      const matchingRate = plotRates.find(rate =>
        rate.projectId === projectId && rate.blockId === blockId
      );

      if (matchingRate) {
        setFormData(prev => ({
          ...prev,
          plotRate: matchingRate.plotRate
        }));
      } else {
        // Default to 0 if no matching rate found
        setFormData(prev => ({
          ...prev,
          plotRate: 0
        }));
      }
    }
  };

  // Auto-populate PLC rate based on plot type selection
  const autoPopulatePlcRate = (plotTypeId) => {
    if (plotTypeId) {
      const matchingPlcRate = plcRates.find(rate =>
        rate.plotTypeId === plotTypeId
      );

      if (matchingPlcRate) {
        setFormData(prev => ({
          ...prev,
          plcRate: matchingPlcRate.ratePercentage
        }));
      } else {
        // Default to 0 if no matching rate found
        setFormData(prev => ({
          ...prev,
          plcRate: 0
        }));
      }
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Special handling for project selection
    if (name === 'projectId') {
      // Find the selected project
      const selectedProject = projects.find(p => p.projectId === value);
      if (selectedProject) {
        // Update project name and location
        setFormData(prev => ({
          ...prev,
          //   projectName: selectedProject.siteName || '',
          location: selectedProject.siteLocation || '',
          // Reset block-related fields since we're changing the project
          blockId: '',
          block: '',
          // Reset plot rate since it depends on project and block
          plotRate: 0
        }));
        // Fetch blocks for the selected project
        fetchBlocksByProjectId(value);
      }
    }

    // Special handling for block selection
    if (name === 'blockId') {
      // Find the selected block
      const selectedBlock = blocks.find(b => b.blockId === value);
      if (selectedBlock) {
        setFormData(prev => ({
          ...prev,
          block: selectedBlock.block || ''
        }));

        // Auto-populate plot rate based on project and block
        autoPopulatePlotRate(formData.projectId, value);
      }
    }

    // Special handling for plot type selection
    if (name === 'plotTypeId') {
      // Find the selected plot type
      const selectedPlotType = plotTypes.find(pt => pt.plotTypeId === value);
      if (selectedPlotType) {
        setFormData(prev => ({
          ...prev,
          plotTypeName: selectedPlotType.plotTypeName || ''
        }));

        // Auto-populate PLC rate based on plot type
        autoPopulatePlcRate(value);
      }
    }

    // Clear errors when user makes changes
    if (submitted) setError(null);
  };

  // Form validation
  const validateForm = () => {
    setSubmitted(true);

    const requiredFields = [
      'projectId',
      'blockId',
      'plotTypeId',
      'plotNo',
      'plotRate',
      'plotArea',
      'status'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (formData.plotRate < 0) {
      setError('Plot rate cannot be negative');
      return false;
    }

    if (formData.plcRate < 0) {
      setError('PLC rate cannot be negative');
      return false;
    }

    if (formData.noOfPlots < 0) {
      setError('Number of plots cannot be negative');
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
    const payload = {
      projectId: formData.projectId,
      projectName: projects.find(p => p.projectId === formData.projectId)?.siteName || null,
      location: formData.location,
      noOfPlots: parseInt(formData.noOfPlots),
      blockId: formData.blockId,
      block: blocks.find(b => b.blockId === formData.blockId)?.block || null,
      plotTypeId: formData.plotTypeId,
      plotTypeName: plotTypes.find(pt => pt.plotTypeId === formData.plotTypeId)?.plotTypeName || null,
      plotNo: formData.plotNo,
      plotRate: parseFloat(formData.plotRate),
      plcRate: parseFloat(formData.plcRate),
      plotArea: formData.plotArea,
      status: formData.status,
      developmentAmount: formData.developmentAmount
    };

    // For edit mode, include addPlotId
    if (mode === 'edit' && currentPlot) {
      payload.addPlotId = currentPlot.addPlotId || currentPlot.id;
    }

    if (mode === 'add') {
      // Create new plot detail
      response = await axiosInstance.post(
        '/realEstate/plotDetail/post',
        payload
      );

      if (response.data && (response.data.status === 201 || response.data.status === 200)) {
        if (onSuccess) onSuccess('Plot detail added successfully');
        if (refetchPlots) refetchPlots();
        handleClose();
      } else {
        setError(response.data?.message || 'Failed to add plot detail. Please try again.');
      }
    } else if (mode === 'edit' && currentPlot) {
      // Update existing plot detail
      response = await axiosInstance.put(
        '/realEstate/plotDetail/update',
        payload
      );

      if (response.data && (response.data.status === 202 || response.data.status === 200)) {
        if (onSuccess) onSuccess('Plot detail updated successfully');
        if (refetchPlots) refetchPlots();
        handleClose();
      } else {
        setError(response.data?.message || 'Failed to update plot detail. Please try again.');
      }
    }
  }
  catch (error) {
      console.error('API error:', error);

      if (error.response) {
        if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else if (error.response.status === 400) {
          setError('Invalid data provided. Please check your input.');
        } else if (error.response.status === 404) {
          setError('Plot detail not found.');
        } else if (error.response.status === 409) {
          setError('A plot with this number already exists for this block.');
        } else if (error.response.status === 500) {
          setError('Server error. Please try again later.');
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
        projectId: '',
        projectName: '',
        location: '',
        noOfPlots: 0,
        blockId: '',
        block: '',
        plotTypeId: '',
        plotTypeName: '',
        plotNo: '',
        plotRate: 0,
        plcRate: 0,
        plotArea: '',
        status: 'Available',
        developmentAmount: 0
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
          {mode === 'add' ? 'Add New Plot' : 'Edit Plot'}
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
          {/* Project Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={submitted && !formData.projectId}>
              <InputLabel>Project</InputLabel>
              <Select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                label="Project"
                disabled={loading || projectsLoading || (mode === 'edit' && currentPlot)}
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
                      {project.siteName}
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

          {/* Location (Read-only) */}
          <Grid item xs={12} md={6}>
            <TextField
              name="location"
              label="Location"
              fullWidth
              value={formData.location || ''}
              InputProps={{
                readOnly: true,
              }}
              disabled={!formData.projectId}
            />
          </Grid>

          {/* Block Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={submitted && !formData.blockId}>
              <InputLabel>Block</InputLabel>
              <Select
                name="blockId"
                value={formData.blockId}
                onChange={handleChange}
                label="Block"
                disabled={loading || blocksLoading || !formData.projectId}
              >
                {blocksLoading ? (
                  <MenuItem disabled>
                    Loading blocks...
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
              {submitted && !formData.blockId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  Block selection is required
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Plot Type Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={submitted && !formData.plotTypeId}>
              <InputLabel>Plot Type</InputLabel>
              <Select
                name="plotTypeId"
                value={formData.plotTypeId}
                onChange={handleChange}
                label="Plot Type"
                disabled={loading || plotTypesLoading}
              >
                {plotTypesLoading ? (
                  <MenuItem disabled>
                    Loading plot types...
                  </MenuItem>
                ) : plotTypes.length === 0 ? (
                  <MenuItem disabled>
                    No plot types available
                  </MenuItem>
                ) : (
                  plotTypes.map((type) => (
                    <MenuItem key={type.plotTypeId} value={type.plotTypeId}>
                      {type.plotTypeName}
                    </MenuItem>
                  ))
                )}
              </Select>
              {submitted && !formData.plotTypeId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  Plot type selection is required
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Plot Number */}
          <Grid item xs={12} md={6}>
            <TextField
              name="plotNo"
              label="Plot Number"
              placeholder="e.g., A-101"
              fullWidth
              value={formData.plotNo}
              onChange={handleChange}
              required
              error={submitted && !formData.plotNo}
              helperText={submitted && !formData.plotNo ? "Plot number is required" : ""}
              disabled={loading}
              inputProps={{ maxLength: 20 }}
            />
          </Grid>

          {/* Number of Plots */}
          {/* <Grid item xs={12} md={6}>
            <TextField
              name="noOfPlots"
              label="Number of Plots"
              type="number"
              fullWidth
              value={formData.noOfPlots}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              disabled={loading}
            />
          </Grid> */}

          {/* Plot Area */}
          <Grid item xs={12} md={4}>
            <TextField
              name="plotArea"
              label="Plot Area"
              placeholder="e.g., 1200 sq ft"
              fullWidth
              value={formData.plotArea}
              onChange={handleChange}
              required
              error={submitted && !formData.plotArea}
              helperText={submitted && !formData.plotArea ? "Plot area is required" : ""}
              disabled={loading}
            />
          </Grid>

          {/* Plot Rate (Auto-populated based on project and block) */}
          <Grid item xs={12} md={4}>
            <TextField
              name="plotRate"
              label="Plot Rate"
              type="number"
              fullWidth
              value={formData.plotRate}
              onChange={handleChange}
              required
              error={submitted && (!formData.plotRate || formData.plotRate < 0)}
              helperText={submitted && (!formData.plotRate || formData.plotRate < 0) ? "Valid plot rate is required" : ""}
              disabled={loading || plotRatesLoading}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          {/* PLC Rate (Auto-populated based on plot type) */}
          <Grid item xs={12} md={4}>
            <TextField
              name="plcRate"
              label="PLC Rate (%)"
              type="number"
              fullWidth
              value={formData.plcRate}
              onChange={handleChange}
              error={submitted && formData.plcRate < 0}
              helperText={submitted && formData.plcRate < 0 ? "PLC rate cannot be negative" : ""}
              disabled={loading || plcRatesLoading}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              name="developmentAmount"
              label="Development Amount"
              type="number"
              fullWidth
              value={formData.developmentAmount}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={submitted && !formData.status}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
                disabled={loading}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
              {submitted && !formData.status && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  Status selection is required
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>

        {mode === 'edit' && currentPlot && currentPlot.addPlotId && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="caption" color="text.secondary">
              Plot ID: {currentPlot.addPlotId}
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
          {loading ? 'Saving...' : mode === 'add' ? 'Add Plot' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPlotDetail;