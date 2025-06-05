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
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Pagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Snackbar, Alert } from '@mui/material';
import { format } from 'date-fns';
import AddEditEnquiry from './AddEnquiry';
import axiosInstance from '../../axiosInstance';

const AllEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentEnquiry, setCurrentEnquiry] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/realEstate/enquiry/getAllEnquiry');
      
      if (response.status === 200) {
        // Ensure we're accessing the data property from the response
        const enquiriesData = response.data.data || [];
        setEnquiries(enquiriesData);
        setFilteredEnquiries(enquiriesData);
      } else {
        console.error('Invalid response format:', response.data);
        setEnquiries([]);
        setFilteredEnquiries([]);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      setEnquiries([]);
      setFilteredEnquiries([]);
      
      // Show error notification
      handleNotification('Failed to fetch enquiries. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      filterEnquiries(activeFilter);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = enquiries.filter(item => {
        return (
          (item.customerName && item.customerName.toLowerCase().includes(lowercasedFilter)) ||
          (item.mobile && item.mobile.includes(lowercasedFilter)) ||
          (item.email && item.email.toLowerCase().includes(lowercasedFilter)) ||
          (item.city && item.city.toLowerCase().includes(lowercasedFilter))
        );
      });

      if (activeFilter !== 'All') {
        setFilteredEnquiries(filtered.filter(item => item.leadType === activeFilter));
      } else {
        setFilteredEnquiries(filtered);
      }
    }
  }, [searchTerm, enquiries, activeFilter]);

  const handleSelectEnquiry = (event, id) => {
    if (event.target.checked) {
      setSelectedEnquiries([...selectedEnquiries, id]);
    } else {
      setSelectedEnquiries(selectedEnquiries.filter(item => item !== id));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const visibleEnquiriesIds = getCurrentPageItems().map(enquiry => enquiry.id);
      setSelectedEnquiries(visibleEnquiriesIds);
    } else {
      setSelectedEnquiries([]);
    }
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (filter) => {
    setActiveFilter(filter);
    filterEnquiries(filter);
    handleFilterClose();
  };

  const filterEnquiries = (filter) => {
    if (filter === 'All') {
      setFilteredEnquiries(enquiries);
    } else {
      setFilteredEnquiries(enquiries.filter(item => item.leadType === filter));
    }
  };

  const handleActionClick = (event, enquiry) => {
    setSelectedAction(enquiry);
    setActionAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedAction(null);
  };

  const handleAddEnquiry = () => {
    setCurrentEnquiry(null);
    setAddDialogOpen(true);
  };

  const handleEditEnquiry = (enquiry) => {
    setCurrentEnquiry(enquiry);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentEnquiry(null);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleDeleteEnquiry = (id) => {
    const enquiry = enquiries.find(item => item.id === id);
    if (enquiry) {
      setCurrentEnquiry(enquiry);
      setDeleteDialogOpen(true);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCurrentEnquiry(null);
  };

  const handleConfirmDelete = async () => {
    if (!currentEnquiry) return;

    setIsSubmitting(true);
    try {
      // Replace with your actual API endpoint
      const response = await axiosInstance.delete(
        `/realEstate/enquiry/deleteEnquiry/${currentEnquiry.id}`
      );
      
      if (response.status === 200) {
        // Update local state
        const updatedEnquiries = enquiries.filter(e => e.id !== currentEnquiry.id);
        setEnquiries(updatedEnquiries);
        setFilteredEnquiries(
          activeFilter === 'All'
            ? updatedEnquiries
            : updatedEnquiries.filter(item => item.leadType === activeFilter)
        );
        
        // Remove from selected enquiries if present
        setSelectedEnquiries(selectedEnquiries.filter(id => id !== currentEnquiry.id));
        
        // Close dialog
        setDeleteDialogOpen(false);
        setCurrentEnquiry(null);
        
        // Show success message
        handleNotification('Enquiry deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      handleNotification('Error deleting enquiry. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedEnquiries.length === 0) return;

    setIsSubmitting(true);
    try {
      // Make API call to delete multiple enquiries
      const response = await axiosInstance.post(
        '/realEstate/enquiry/bulkDeleteEnquiry',
        { ids: selectedEnquiries }
      );
      
      if (response.status === 200) {
        // Update local state
        const updatedEnquiries = enquiries.filter(e => !selectedEnquiries.includes(e.id));
        setEnquiries(updatedEnquiries);
        setFilteredEnquiries(
          activeFilter === 'All'
            ? updatedEnquiries
            : updatedEnquiries.filter(item => item.leadType === activeFilter)
        );
        
        // Clear selection
        setSelectedEnquiries([]);
        
        // Show success message
        handleNotification(`${selectedEnquiries.length} enquiries deleted successfully`, 'success');
      }
    } catch (error) {
      console.error('Error deleting enquiries:', error);
      handleNotification('Error deleting enquiries. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle notifications
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

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Get paginated enquiries
  const getCurrentPageItems = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredEnquiries.slice(startIndex, endIndex);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd-MM-yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Get lead type chip color
  const getLeadTypeColor = (type) => {
    switch (type) {
      case 'Hot':
        return { bg: '#FDEBE8', color: '#D63C25' };
      case 'Warm':
        return { bg: '#FFF9E7', color: '#E8B339' };
      case 'Cold':
        return { bg: '#EEF1FF', color: '#556CD6' };
      case 'New Lead':
        return { bg: '#E8F5E9', color: '#4CAF50' };
      case 'Follow-up':
        return { bg: '#F3E5F5', color: '#9C27B0' };
      default:
        return { bg: '#F5F5F5', color: '#757575' };
    }
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
          All Enquiries
        </Typography>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          width: { xs: '100%', sm: 'auto' }
        }}>
          <TextField
            placeholder="Search enquiries..."
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
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            sx={{
              borderColor: activeFilter !== 'All' ? '#6B66FF' : 'inherit',
              color: activeFilter !== 'All' ? '#6B66FF' : 'inherit',
            }}
          >
            {activeFilter === 'All' ? 'Filter' : `Filter: ${activeFilter}`}
          </Button>

          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            PaperProps={{
              elevation: 2,
              sx: { minWidth: 180 }
            }}
          >
            <MenuItem
              onClick={() => handleFilterSelect('All')}
              selected={activeFilter === 'All'}
            >
              All Enquiries
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterSelect('Hot')}
              selected={activeFilter === 'Hot'}
            >
              Hot Leads
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterSelect('Warm')}
              selected={activeFilter === 'Warm'}
            >
              Warm Leads
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterSelect('Cold')}
              selected={activeFilter === 'Cold'}
            >
              Cold Leads
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterSelect('New Lead')}
              selected={activeFilter === 'New Lead'}
            >
              New Leads
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterSelect('Follow-up')}
              selected={activeFilter === 'Follow-up'}
            >
              Follow-up Required
            </MenuItem>
          </Menu>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddEnquiry}
            sx={{
              bgcolor: '#6B66FF',
              '&:hover': { bgcolor: '#5652e5' }
            }}
          >
            Add Enquiry
          </Button>

          {selectedEnquiries.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleBulkDelete}
              disabled={isSubmitting}
            >
              Delete Selected ({selectedEnquiries.length})
            </Button>
          )}
        </Box>
      </Box>

      {/* Enquiries Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          overflowX: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: 1
        }}
      >
        <Table sx={{ minWidth: 1000 }}>
          <TableHead sx={{ backgroundColor: '#F5F5F7' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selectedEnquiries.length > 0 &&
                    selectedEnquiries.length < getCurrentPageItems().length
                  }
                  checked={
                    getCurrentPageItems().length > 0 &&
                    selectedEnquiries.length === getCurrentPageItems().length
                  }
                  onChange={handleSelectAll}
                  disabled={loading}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Plot Size</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Budget</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Follow-up Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading enquiries...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredEnquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                  <Typography variant="body1">
                    No enquiries found. {searchTerm && "Try adjusting your search criteria."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              getCurrentPageItems().map((enquiry) => (
                <TableRow
                  key={enquiry.id}
                  sx={{ '&:hover': { backgroundColor: '#F9F9FB' } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selectedEnquiries.includes(enquiry.id)}
                      onChange={(event) => handleSelectEnquiry(event, enquiry.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{enquiry.customerName}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {enquiry.mobile}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {enquiry.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {enquiry.city}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {enquiry.state}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{enquiry.plotSize} sqft.</TableCell>
                  <TableCell>₹{parseInt(enquiry.budget || 0).toLocaleString()}</TableCell>
                  <TableCell>{formatDate(enquiry.followupDate)}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: { xs: 'none', md: 'flex' },
                        gap: 1
                      }}
                    >
                      <Tooltip title="Edit Enquiry">
                        <IconButton
                          size="small"
                          sx={{ color: '#6B66FF' }}
                          onClick={() => handleEditEnquiry(enquiry)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Enquiry">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteEnquiry(enquiry.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Mobile Actions */}
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleActionClick(e, enquiry)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {filteredEnquiries.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredEnquiries.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Action Menu (Mobile) */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
      >
        <MenuItem
          onClick={() => {
            handleEditEnquiry(selectedAction);
            handleActionClose();
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1, color: '#6B66FF' }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDeleteEnquiry(selectedAction?.id);
            handleActionClose();
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} color="error" />
          Delete
        </MenuItem>
      </Menu>

      {/* Add/Edit Enquiry Dialogs */}
      <AddEditEnquiry
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        mode="add"
        onSuccess={(message) => {
          handleNotification(message);
          fetchEnquiries(); // Refresh list after adding
        }}
      />

      <AddEditEnquiry
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        mode="edit"
        currentEnquiry={currentEnquiry}
        onSuccess={(message) => {
          handleNotification(message);
          fetchEnquiries(); // Refresh list after editing
        }}
      />

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
            Are you sure you want to delete the enquiry for "{currentEnquiry?.customerName}"?
            This action cannot be undone.
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
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
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

export default AllEnquiries;