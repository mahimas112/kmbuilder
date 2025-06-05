import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Typography,
    IconButton,
    Tooltip,
    CircularProgress,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Grid,
    InputAdornment,
    Snackbar,
    Alert,
    Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../../axiosInstance';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const AllPlotTypes = () => {
    // State variables
    const [plotTypes, setPlotTypes] = useState([]);
    const [filteredPlotTypes, setFilteredPlotTypes] = useState([]);
    const [selectedPlotTypes, setSelectedPlotTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [currentPlotType, setCurrentPlotType] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mode, setMode] = useState('add'); // 'add' or 'edit'
    
    // Form state
    const [formData, setFormData] = useState({
        plotTypeName: '',
        localDate: new Date().toISOString().split('T')[0]
    });
    
    // Notification state
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Form validation
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    // Fetch plot types data
    useEffect(() => {
        fetchPlotTypes();
    }, []);

    const fetchPlotTypes = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/realEstate/plotType/getAll');
            if (response.data.status === 200 && Array.isArray(response.data.data)) {
                setPlotTypes(response.data.data);
                setFilteredPlotTypes(response.data.data);
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to load plot types. Please try again.';
            handleNotification(errorMessage, 'error');
            console.error('Error fetching plot types:', error);
            setPlotTypes([]);
            setFilteredPlotTypes([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle search input change
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredPlotTypes(plotTypes);
        } else {
            const lowercasedFilter = searchTerm.toLowerCase();
            const filtered = plotTypes.filter(item => {
                return item.plotTypeName.toLowerCase().includes(lowercasedFilter);
            });
            setFilteredPlotTypes(filtered);
        }
    }, [searchTerm, plotTypes]);

    // Handler for checkbox selection
    const handleSelectPlotType = (event, plotTypeId) => {
        if (event.target.checked) {
            setSelectedPlotTypes([...selectedPlotTypes, plotTypeId]);
        } else {
            setSelectedPlotTypes(selectedPlotTypes.filter(id => id !== plotTypeId));
        }
    };

    // Handler for select all checkbox
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedPlotTypes(filteredPlotTypes.map(type => type.plotTypeId));
        } else {
            setSelectedPlotTypes([]);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date.getTime()) 
            ? 'Invalid Date' 
            : date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
    };

    // Handler for form field changes
    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear validation errors when user makes changes
        if (submitted && errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    // Validate form data
    const validateForm = () => {
        setSubmitted(true);
        const newErrors = {};
        
        if (!formData.plotTypeName?.trim()) {
            newErrors.plotTypeName = 'Plot type name is required';
        }
        
        if (!formData.localDate) {
            newErrors.localDate = 'Date is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handler for opening the add plot type dialog
    const handleAddPlotType = () => {
        setMode('add');
        setCurrentPlotType(null);
        setFormData({
            plotTypeName: '',
            localDate: new Date().toISOString().split('T')[0]
        });
        setSubmitted(false);
        setErrors({});
        setFormDialogOpen(true);
    };

    // Handler for opening the edit dialog with plot type data
    const handleEditPlotType = (plotType) => {
        setMode('edit');
        setCurrentPlotType(plotType);
        setFormData({
            plotTypeName: plotType.plotTypeName || '',
            localDate: plotType.localDate ? new Date(plotType.localDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setSubmitted(false);
        setErrors({});
        setFormDialogOpen(true);
    };

    // Handler for closing the form dialog
    const handleCloseFormDialog = () => {
        if (!isSubmitting) {
            setFormDialogOpen(false);
        }
    };

    // Handler for submitting the form
    const handleSubmitForm = async () => {
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            const endpoint = mode === 'add'
                ? '/realEstate/plotType/post'
                : `/realEstate/plotType/updatePlotType/${currentPlotType.plotTypeId}`;
            
            const payload = {
                plotTypeName: formData.plotTypeName.trim(),
                localDate: formData.localDate
            };

            const response = await (mode === 'add' ? axiosInstance.post(endpoint, payload) : axiosInstance.put(endpoint, payload));
            
            if (response.data.status === (mode === 'add' ? 201 : 202)) {
                handleNotification(mode === 'add' ? 'Plot type added successfully' : 'Plot type updated successfully');
                fetchPlotTypes();
                setFormDialogOpen(false);
            } else {
                throw new Error(response.data.message || 'Operation failed');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                error.message || 
                'An unexpected error occurred. Please try again.';
            handleNotification(errorMessage, 'error');
            console.error('API error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler for opening delete confirmation
    const handleDeletePlotType = (plotTypeId) => {
        setCurrentPlotType({ plotTypeId });
        setDeleteDialogOpen(true);
    };

    // Handler for closing delete dialog
    const handleCloseDeleteDialog = () => {
        if (!isSubmitting) {
            setDeleteDialogOpen(false);
            setCurrentPlotType(null);
        }
    };

    // Handler for confirming deletion
    const handleConfirmDelete = async () => {
        if (!currentPlotType) return;
        
        setIsSubmitting(true);
        try {
            // API call to delete plot type
            const response = await axiosInstance.delete(
                `/realEstate/plotType/deletePlotType/${currentPlotType.plotTypeId}`
            );
            
            if (response.data.status === 200) {
                // Update local state
                setPlotTypes(plotTypes.filter(p => p.plotTypeId !== currentPlotType.plotTypeId));
                setFilteredPlotTypes(filteredPlotTypes.filter(p => p.plotTypeId !== currentPlotType.plotTypeId));
                
                // Remove from selected plot types if present
                setSelectedPlotTypes(selectedPlotTypes.filter(id => id !== currentPlotType.plotTypeId));
                
                handleNotification('Plot type deleted successfully');
                setDeleteDialogOpen(false);
                setCurrentPlotType(null);
            } else {
                handleNotification(response.data.message || 'Failed to delete plot type', 'error');
            }
        } catch (error) {
            console.error('Error deleting plot type:', error);
            
            let errorMessage = 'An error occurred while deleting. Please try again.';
            
            if (error.response) {
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.status === 404) {
                    errorMessage = 'Plot type not found.';
                } else if (error.response.status === 409) {
                    errorMessage = 'Cannot delete this plot type as it is in use.';
                }
            }
            
            handleNotification(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        if (selectedPlotTypes.length === 0) return;
        
        setIsSubmitting(true);
        try {
            let successCount = 0;
            let errorCount = 0;
            
            // Delete one by one
            for (const plotTypeId of selectedPlotTypes) {
                try {
                    const response = await axiosInstance.delete(`/realEstate/plotType/deletePlotType/${plotTypeId}`);
                    if (response.data.status === 200) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (error) {
                    console.error(`Error deleting plot type ${plotTypeId}:`, error);
                    errorCount++;
                }
            }
            
            // Update local state
            fetchPlotTypes();
            
            // Clear selection
            setSelectedPlotTypes([]);
            
            // Show appropriate message
            if (successCount > 0 && errorCount === 0) {
                handleNotification(`Successfully deleted ${successCount} plot type(s)`);
            } else if (successCount > 0 && errorCount > 0) {
                handleNotification(`Deleted ${successCount} plot type(s), but failed to delete ${errorCount}`, 'warning');
            } else {
                handleNotification('Failed to delete plot types', 'error');
            }
        } catch (error) {
            console.error('Error in bulk delete:', error);
            handleNotification('An error occurred during bulk delete', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle notification
    const handleNotification = (message, severity = 'success') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    // Close notification handler
    const handleCloseNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header with title, search and actions */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                mb: 3,
                gap: 2
            }}>
                <Typography variant="h5" component="h1" fontWeight="bold">
                    Plot Types
                </Typography>
                
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    <TextField
                        placeholder="Search plot types..."
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
                    
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddPlotType}
                        sx={{ 
                            bgcolor: '#6B66FF',
                            '&:hover': { bgcolor: '#5652e5' }
                        }}
                    >
                        Add Plot Type
                    </Button>
                    
                    {selectedPlotTypes.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleBulkDelete}
                            disabled={isSubmitting}
                        >
                            Delete Selected ({selectedPlotTypes.length})
                        </Button>
                    )}
                </Box>
            </Box>
            
            {/* Plot Types Table */}
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    overflowX: 'auto',
                    border: '1px solid #e0e0e0'
                }}
            >
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#DAE1F3' }}>
                        <TableRow>
                            {/* <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={selectedPlotTypes.length > 0 && selectedPlotTypes.length < filteredPlotTypes.length}
                                    checked={filteredPlotTypes.length > 0 && selectedPlotTypes.length === filteredPlotTypes.length}
                                    onChange={handleSelectAll}
                                    disabled={loading}
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Plot Type ID</TableCell> */}
                            <TableCell sx={{ fontWeight: 600 }}>Plot Type Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                            {/* <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={40} />
                                    <Typography variant="body2" sx={{ mt: 2 }}>
                                        Loading plot types...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredPlotTypes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1">
                                        No plot types found. {searchTerm && "Try adjusting your search criteria."}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPlotTypes.map((plotType) => (
                                <TableRow
                                    key={plotType.plotTypeId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {/* <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={selectedPlotTypes.includes(plotType.plotTypeId)}
                                            onChange={(event) => handleSelectPlotType(event, plotType.plotTypeId)}
                                        />
                                    </TableCell> */}
                                    {/* <TableCell sx={{ fontWeight: 500 }}>
                                        {plotType.plotTypeId.substring(0, 8)}...
                                    </TableCell> */}
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        {plotType.plotTypeName}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        {formatDate(plotType.localDate)}
                                    </TableCell>
                                    {/* <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="Edit Plot Type">
                                                <IconButton 
                                                    size="small" 
                                                    sx={{ color: '#6B66FF' }}
                                                    onClick={() => handleEditPlotType(plotType)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell> */}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {/* Plot Type Form Dialog */}
            <Dialog
                open={formDialogOpen}
                onClose={handleCloseFormDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    pb: 1
                }}>
                    <Typography variant="h6" component="div" fontWeight="bold">
                        {mode === 'add' ? 'Add New Plot Type' : 'Edit Plot Type'}
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleCloseFormDialog}
                        disabled={isSubmitting}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                
                <Divider />
                
                <DialogContent sx={{ pt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="plotTypeName"
                                label="Plot Type Name"
                                placeholder="e.g., Residential, Commercial, etc."
                                fullWidth
                                value={formData.plotTypeName}
                                onChange={(e) => handleFormChange('plotTypeName', e.target.value)}
                                required
                                error={submitted && Boolean(errors.plotTypeName)}
                                helperText={submitted && errors.plotTypeName}
                                disabled={isSubmitting}
                                inputProps={{ maxLength: 50 }}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                label="Date"
                                type="date"
                                name="localDate"
                                value={formData.localDate}
                                onChange={(e) => handleFormChange('localDate', e.target.value)}
                                fullWidth
                                required
                                error={submitted && Boolean(errors.localDate)}
                                helperText={submitted && errors.localDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        
                        {mode === 'edit' && currentPlotType && (
                            <Grid item xs={12} sx={{ mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Plot Type ID: {currentPlotType.plotTypeId}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                
                <DialogActions sx={{ px: 3, py: 2.5 }}>
                    <Button 
                        onClick={handleCloseFormDialog} 
                        variant="outlined"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmitForm} 
                        variant="contained" 
                        sx={{ 
                            bgcolor: '#6B66FF',
                            '&:hover': { bgcolor: '#5652e5' },
                            minWidth: 100
                        }}
                        disabled={isSubmitting}
                        startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
                    >
                        {isSubmitting 
                            ? 'Saving...' 
                            : mode === 'add' 
                                ? 'Add Plot Type' 
                                : 'Save Changes'
                        }
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle>
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this plot type? This action cannot be undone and may affect associated plots.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button 
                        onClick={handleCloseDeleteDialog} 
                        variant="outlined"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        variant="contained" 
                        color="error"
                        disabled={isSubmitting}
                        startIcon={isSubmitting && <CircularProgress size={20} />}
                    >
                        {isSubmitting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
            
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

export default AllPlotTypes;