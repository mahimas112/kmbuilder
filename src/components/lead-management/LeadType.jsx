import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Tooltip,
  InputAdornment,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import axiosInstance from '../../axiosInstance';



const LeadType = () => {
  const [leadTypes, setLeadTypes] = useState([]);
  const [filteredLeadTypes, setFilteredLeadTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    leadId: '',
    leadTypeName: '',
    leadTypeCreated: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadTypeToDelete, setLeadTypeToDelete] = useState(null);

  const fetchLeadTypes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/realEstate/leadType/getAll');
      if (response.data && response.data.status === 201) {
        const formattedLeadTypes = response.data.data.map(leadType => ({
          leadId: leadType.leadId,
          leadTypeName: leadType.leadTypeName,
          leadTypeCreated: leadType.leadTypeCreated || new Date().toISOString().split('T')[0],
        }));
        setLeadTypes(formattedLeadTypes);
        setFilteredLeadTypes(formattedLeadTypes);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching lead types:', error);
      handleNotification('Error fetching lead types: ' + (error.message || 'Unknown error'), 'error');
      setLeadTypes([]);
      setFilteredLeadTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadTypes();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLeadTypes(leadTypes);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = leadTypes.filter(item => 
        item.leadTypeName.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredLeadTypes(filtered);
    }
  }, [searchTerm, leadTypes]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.leadTypeName.trim()) {
      newErrors.leadTypeName = "Lead type name is required";
    }
    
    if (!formData.leadTypeCreated) {
      newErrors.leadTypeCreated = "Created date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (leadType = null) => {
    console.log('Opening dialog with leadType:', leadType);
    if (leadType && leadType.leadId !== undefined) {
      console.log('Setting edit mode with ID:', leadType.leadId);
      setFormData({
        leadId: leadType.leadId,
        leadTypeName: leadType.leadTypeName,
        leadTypeCreated: leadType.leadTypeCreated,
      });
      setEditingId(leadType.leadId);
    } else {
      console.log('Setting add mode');
      setFormData({
        leadId: '',
        leadTypeName: '',
        leadTypeCreated: new Date().toISOString().split('T')[0],
      });
      setEditingId(null);
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setErrors({});
  };

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const url = editingId
        ? '/realEstate/leadType/updateLead'
        : '/realEstate/leadType/postLead';
      
      const payload = {
        leadId: editingId || null,
        leadTypeName: formData.leadTypeName.trim(),
        leadTypeCreated: formData.leadTypeCreated
      };

      const response = await axiosInstance({
        method: editingId ? 'PUT' : 'POST',
        url,
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && (response.data.status === 200 || response.data.status === 201)) {
        handleNotification(editingId ? 'Lead type updated successfully' : 'Lead type added successfully');
        fetchLeadTypes();
        handleCloseDialog();
      } else {
        throw new Error(response.data?.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving lead type:', error);
      handleNotification('Error saving lead type: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteDialog = (leadType) => {
    setLeadTypeToDelete(leadType);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setLeadTypeToDelete(null);
  };

  const handleDelete = async () => {
    if (!leadTypeToDelete) return;
    
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.delete(
        `/realEstate/leadType/delete/ByLeadId`,
        {
          params: { leadId: leadTypeToDelete.leadId },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.status === 200) {
        handleNotification('Lead type deleted successfully');
        fetchLeadTypes();
        handleCloseDeleteDialog();
      } else {
        throw new Error(response.data?.message || 'Failed to delete lead type');
      }
    } catch (error) {
      console.error('Error deleting lead type:', error);
      handleNotification('Error deleting lead type: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
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
          Lead Types
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          width: { xs: '100%', sm: 'auto' }
        }}>
          <TextField
            placeholder="Search lead types..."
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
            onClick={() => handleOpenDialog()}
            sx={{ 
              bgcolor: '#6B66FF',
              '&:hover': { bgcolor: '#5652e5' }
            }}
          >
            Add Lead Type
          </Button>
        </Box>
      </Box>
      
      {/* Lead Types Table */}
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
              <TableCell sx={{ fontWeight: 600 }}>Lead Type Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading lead types...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredLeadTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1">
                    No lead types found. {searchTerm && "Try adjusting your search criteria."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredLeadTypes.map((leadType) => (
                <TableRow
                  key={leadType.leadId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{leadType.leadTypeName}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{leadType.leadTypeCreated}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Lead Type">
                        <IconButton 
                          size="small" 
                          sx={{ color: '#6B66FF' }}
                          onClick={() => {
                            console.log('Edit button clicked for leadType:', leadType);
                            if (leadType && leadType.leadId !== undefined) {
                              handleOpenDialog(leadType);
                            } else {
                              console.error('Invalid lead type data:', leadType);
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Lead Type">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleOpenDeleteDialog(leadType)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Lead Type Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
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
            {editingId !== null ? 'Edit Lead Type' : 'Add New Lead Type'}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            disabled={isSubmitting}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lead Type Name"
                name="leadTypeName"
                placeholder="e.g., Hot Lead, Cold Lead, Warm Lead"
                value={formData.leadTypeName}
                onChange={handleChange}
                error={!!errors.leadTypeName}
                helperText={errors.leadTypeName}
                required
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Created Date"
                name="leadTypeCreated"
                type="date"
                value={formData.leadTypeCreated}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.leadTypeCreated}
                helperText={errors.leadTypeCreated}
                required
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
          
          {editingId && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(0, 0, 0, 0.12)' }}>
              <Typography variant="caption" color="text.secondary">
                Lead Type ID: {formData.leadId}
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
            sx={{ 
              bgcolor: '#6B66FF',
              '&:hover': { bgcolor: '#5652e5' },
              minWidth: 100
            }}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? 'Saving...' : editingId !== null ? 'Save Changes' : 'Add Lead Type'}
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
          <Typography variant="body1">
            Are you sure you want to delete the lead type "{leadTypeToDelete?.leadTypeName}"? This action cannot be undone.
          </Typography>
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
            onClick={handleDelete} 
            variant="contained" 
            color="error"
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} />}
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
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

export default LeadType;