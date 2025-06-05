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
  ratePLCDetailId: "",
  plotTypeId: "",
  ratePercentage: "",
  plotType: ""
};

const PLCRateTab = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [plcRates, setPlcRates] = useState([]);
  const [filteredPlcRates, setFilteredPlcRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [plotTypes, setPlotTypes] = useState([]);
  const [plotTypesLoading, setPlotTypesLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchPLCRates();
    fetchPlotTypes();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPlcRates(plcRates);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = plcRates.filter(item => {
        return (
          (item.plotType && item.plotType.toLowerCase().includes(lowercasedFilter)) ||
          (item.ratePercentage && item.ratePercentage.toString().includes(lowercasedFilter))
        );
      });
      setFilteredPlcRates(filtered);
    }
  }, [searchTerm, plcRates]);

  const fetchPLCRates = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/realEstate/plotType-rate-details/getAll');

      if (response.data?.status === 200 && Array.isArray(response.data.data)) {
        setPlcRates(response.data.data);
        setFilteredPlcRates(response.data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      handleApiError(error, 'Failed to fetch PLC rates');
      setPlcRates([]);
      setFilteredPlcRates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlotTypes = async () => {
    setPlotTypesLoading(true);
    try {
      const response = await axiosInstance.get('/realEstate/plotType/getAll');

      if (response.data?.status === 200 && Array.isArray(response.data.data)) {
        setPlotTypes(response.data.data);
      } else {
        throw new Error('Invalid plot types response format');
      }
    } catch (error) {
      handleApiError(error, 'Failed to fetch plot types');
      setPlotTypes([]);
    } finally {
      setPlotTypesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'plotTypeId') {
      const selectedPlotType = plotTypes.find(type => type.plotTypeId === value);
      if (selectedPlotType) {
        setFormData(prev => ({
          ...prev,
          plotType: selectedPlotType.plotType
        }));
      }
    }
  };

  const validateForm = () => {
    if (!formData.plotTypeId) {
      handleNotification('Please select a plot type', 'error');
      return false;
    }

    if (!formData.ratePercentage || formData.ratePercentage <= 0 || formData.ratePercentage > 100) {
      handleNotification('Please enter a valid rate percentage (1-100)', 'error');
      return false;
    }

    return true;
  };

  const handleCreate = async (payload) => {
    try {
      const response = await axiosInstance.post(
        '/realEstate/plotType-rate-details/post',
        payload
      );

      handleNotification('PLC rate added successfully', 'success');
      await fetchPLCRates();
      resetForm();
      return true;
    } catch (error) {
      console.error('Create failed:', error.response || error);
      handleApiError(error, 'Failed to add PLC rate');
      return false;
    }
  };

  const handleUpdate = async (payload) => {
    try {
      console.log('Update Payload:', payload);
      
      const updateUrl = `/realEstate/plotType-rate-details/update?plotRateDetailsId=${formData.ratePLCDetailId}`;
      console.log('Update URL:', updateUrl);
      
      const response = await axiosInstance({
        method: 'put',
        url: updateUrl,
        data: {
          ratePLCDetailId: formData.ratePLCDetailId,
          plotTypeId: formData.plotTypeId,
          ratePercentage: Number(formData.ratePercentage),
          plotType: formData.plotType
        }
      });

      console.log('Update Response:', response.data);

      if (response.data?.status === 201) {
        handleNotification('PLC rate updated successfully', 'success');
        await fetchPLCRates();
        resetForm();
        return true;
      } else {
        throw new Error(response.data?.message || 'Failed to update PLC rate');
      }
    } catch (error) {
      console.error('Update failed:', error.response || error);
      handleApiError(error, 'Failed to update PLC rate');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const selectedPlotType = plotTypes.find(type => type.plotTypeId === formData.plotTypeId);
    
    setIsSubmitting(true);
    try {
      const payload = {
        ratePLCDetailId: isEditing ? formData.ratePLCDetailId : null,
        plotTypeId: formData.plotTypeId,
        ratePercentage: Number(formData.ratePercentage),
        plotType: selectedPlotType ? selectedPlotType.plotTypeName : formData.plotType
      };

      if (isEditing) {
        await handleUpdate(payload);
      } else {
        await handleCreate(payload);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (plcRate) => {
    setFormData({
      ratePLCDetailId: plcRate.ratePLCDetailId,
      plotTypeId: plcRate.plotTypeId,
      ratePercentage: plcRate.ratePercentage,
      plotType: plcRate.plotType
    });
    
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleApiError = (error, defaultMessage) => {
    console.error(defaultMessage, error);
    
    let errorMessage = defaultMessage;
    
    if (error.response) {
      // If we get a successful status but ended up here, treat it as success
      if (error.response.status === 201) {
        handleNotification(isEditing ? 'PLC rate updated successfully' : 'PLC rate added successfully', 'success');
        fetchPLCRates();
        resetForm();
        return;
      }

      if (error.response.data?.message) {
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
            errorMessage = 'A PLC rate for this plot type already exists.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `Error: ${error.response.status} - ${error.response.statusText}`;
        }
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    handleNotification(errorMessage, 'error');
  };

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
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          PLC Rate Management
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
          {isEditing ? 'Edit PLC Rate' : 'Add New PLC Rate'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!formData.plotTypeId}>
                <InputLabel>Plot Type</InputLabel>
                <Select
                  name="plotTypeId"
                  value={formData.plotTypeId}
                  label="Plot Type"
                  onChange={handleChange}
                  disabled={isSubmitting || plotTypesLoading}
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
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Rate Percentage (%)"
                name="ratePercentage"
                type="number"
                value={formData.ratePercentage}
                onChange={handleChange}
                disabled={isSubmitting}
                InputProps={{
                  inputProps: { min: 1, max: 100 },
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
                helperText="Premium percentage to be applied on base rate"
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
              <TableCell sx={{ fontWeight: 600 }}>Plot Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rate Percentage (%)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading PLC rates...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredPlcRates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1">
                    No PLC rates found. {searchTerm && "Try adjusting your search criteria."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPlcRates.map((rate) => (
                <TableRow key={rate.ratePLCDetailId}>
                  <TableCell sx={{ fontWeight: 500 }}>{rate.plotType}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{rate.ratePercentage}%</TableCell>
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