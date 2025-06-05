import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormHelperText,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axiosInstance from '../../axiosInstance';

const Sources = () => {
  const [sources, setSources] = useState([]);
  const [filteredSources, setFilteredSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    sourceId: '',
    sourceName: '',
    sourceCreated: new Date().toISOString().split('T')[0],
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
  const [sourceToDelete, setSourceToDelete] = useState(null);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('realEstate/source/getAllSource');
      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setSources(response.data.data);
        setFilteredSources(response.data.data);
      } else {
        handleNotification('Invalid response format', 'error');
        setSources([]);
        setFilteredSources([]);
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
      handleNotification('Error fetching sources', 'error');
      setSources([]);
      setFilteredSources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSources(sources);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = sources.filter(item => 
        item.sourceName.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredSources(filtered);
    }
  }, [searchTerm, sources]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.sourceName.trim()) {
      newErrors.sourceName = "Source name is required";
    }
    
    if (!formData.sourceCreated) {
      newErrors.sourceCreated = "Created date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (source = null) => {
    if (source) {
      setFormData(source);
      setEditingId(source.sourceId);
    } else {
      setFormData({
        sourceId: '',
        sourceName: '',
        sourceCreated: new Date().toISOString().split('T')[0],
      });
      setEditingId(null);
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
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
        ? '/realEstate/source/updateSource'
        : '/realEstate/source/postSource';
      
      const response = await axiosInstance({
        method: editingId ? 'PUT' : 'POST',
        url,
        data: formData,
      });

      if (response.data.status === (editingId ? 201 : 201)) {
        handleNotification(editingId ? 'Source updated successfully' : 'Source added successfully');
        fetchSources();
        handleCloseDialog();
      } else {
        handleNotification('Operation failed', 'error');
      }
    } catch (error) {
      console.error('Error saving source:', error);
      handleNotification('Error saving source', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteDialog = (source) => {
    setSourceToDelete(source);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSourceToDelete(null);
  };

  const handleDelete = async () => {
    if (!sourceToDelete) return;
    
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.delete(`/realEstate/source/deleteSource?sourceId=${sourceToDelete.sourceId}`);
      if (response.data.status === 200) {
        handleNotification('Source deleted successfully');
        fetchSources();
        handleCloseDeleteDialog();
      } else {
        handleNotification('Failed to delete source', 'error');
      }
    } catch (error) {
      console.error('Error deleting source:', error);
      handleNotification('Error deleting source', 'error');
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
          Lead Sources
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          width: { xs: '100%', sm: 'auto' }
        }}>
          <TextField
            placeholder="Search sources..."
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
            Add Source
          </Button>
        </Box>
      </Box>
      
      {/* Sources Table */}
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
              <TableCell sx={{ fontWeight: 600 }}>Source Name</TableCell>
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
                    Loading sources...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredSources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1">
                    No sources found. {searchTerm && "Try adjusting your search criteria."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredSources.map((source) => (
                <TableRow
                  key={source.sourceId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{source.sourceName}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{source.sourceCreated}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Source">
                        <IconButton 
                          size="small" 
                          sx={{ color: '#6B66FF' }}
                          onClick={() => handleOpenDialog(source)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Source">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleOpenDeleteDialog(source)}
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

      {/* Add/Edit Source Dialog */}
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
            {editingId ? 'Edit Source' : 'Add New Source'}
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
                label="Source Name"
                name="sourceName"
                placeholder="e.g., Instagram, Facebook, Referral"
                value={formData.sourceName}
                onChange={handleChange}
                error={!!errors.sourceName}
                helperText={errors.sourceName}
                required
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Created Date"
                name="sourceCreated"
                type="date"
                value={formData.sourceCreated}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.sourceCreated}
                helperText={errors.sourceCreated}
                required
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
          
          {editingId && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(0, 0, 0, 0.12)' }}>
              <Typography variant="caption" color="text.secondary">
                Source ID: {formData.sourceId}
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
            {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Source'}
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
            Are you sure you want to delete the source "{sourceToDelete?.sourceName}"? This action cannot be undone.
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

export default Sources;