
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
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Snackbar,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import AddRank from './AddRank';
import axiosInstance from '../../axiosInstance';

const AllRanks = () => {
    // State variables
    const [ranks, setRanks] = useState([]);
    const [filteredRanks, setFilteredRanks] = useState([]);
    const [selectedRanks, setSelectedRanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOptions, setFilterOptions] = useState({
        sortBy: 'rankNumber',
        sortOrder: 'asc',
        filterCommission: '',
        minCommission: '',
        maxCommission: ''
    });
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [currentRank, setCurrentRank] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Fetch ranks data
    useEffect(() => {
        fetchRanks();
    }, []);

    const fetchRanks = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/realEstate/rank/getAll');
            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setRanks(response.data.data);
                setFilteredRanks(response.data.data);
                applyFilters(response.data.data);
            } else {
                console.error('Invalid response format:', response.data);
                setRanks([]);
                setFilteredRanks([]);
                handleNotification('Failed to fetch ranks. Invalid data format.', 'error');
            }
        } catch (error) {
            console.error('Error fetching ranks:', error);
            setRanks([]);
            setFilteredRanks([]);
            
            let errorMessage = 'Failed to fetch ranks.';
            if (error.response) {
                errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'No response from server.';
            } else {
                errorMessage = error.message;
            }
            
            handleNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Apply filters and search
    const applyFilters = (data = ranks) => {
        if (!data || data.length === 0) {
            setFilteredRanks([]);
            return;
        }

        let filteredData = [...data];
        
        // Apply search term
        if (searchTerm.trim()) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filteredData = filteredData.filter(item => 
                String(item.rankName || '').toLowerCase().includes(lowercasedFilter) ||
                String(item.rankNumber || '').includes(lowercasedFilter) ||
                String(item.commissionPercent || '').includes(lowercasedFilter)
            );
        }
        
        // Apply commission filter
        if (filterOptions.minCommission !== '') {
            filteredData = filteredData.filter(item => 
                (item.commissionPercent !== null && item.commissionPercent !== undefined) &&
                item.commissionPercent >= parseFloat(filterOptions.minCommission)
            );
        }
        
        if (filterOptions.maxCommission !== '') {
            filteredData = filteredData.filter(item => 
                (item.commissionPercent !== null && item.commissionPercent !== undefined) &&
                item.commissionPercent <= parseFloat(filterOptions.maxCommission)
            );
        }
        
        // Apply sorting
        filteredData.sort((a, b) => {
            let aValue = a[filterOptions.sortBy];
            let bValue = b[filterOptions.sortBy];
            
            // Handle null values
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;
            
            // Handle string comparison
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (filterOptions.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        setFilteredRanks(filteredData);
    };

    // Handle search and filter changes
    useEffect(() => {
        applyFilters();
    }, [searchTerm, filterOptions, ranks]);

    // Handler for checkbox selection
    const handleSelectRank = (event, rankId) => {
        if (event.target.checked) {
            setSelectedRanks([...selectedRanks, rankId]);
        } else {
            setSelectedRanks(selectedRanks.filter(id => id !== rankId));
        }
    };

    // Handler for select all checkbox
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedRanks(filteredRanks.map(rank => rank.rankId));
        } else {
            setSelectedRanks([]);
        }
    };

    // Handle filter options change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Reset filters
    const handleResetFilters = () => {
        setFilterOptions({
            sortBy: 'rankNumber',
            sortOrder: 'asc',
            filterCommission: '',
            minCommission: '',
            maxCommission: ''
        });
        setSearchTerm('');
        setFilterDialogOpen(false);
    };

    // Handler for opening the add new rank dialog
    const handleAddRank = () => {
        setCurrentRank(null);
        setAddDialogOpen(true);
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

    // Handler for editing a rank
    const handleEditRank = (rank) => {
        setCurrentRank(rank);
        setEditDialogOpen(true);
    };

    // Handler for closing the edit dialog
    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setCurrentRank(null);
    };

    // Handler for closing the add dialog
    const handleCloseAddDialog = () => {
        setAddDialogOpen(false);
    };

    // Handler for opening delete confirmation
    const handleDeleteRank = (rankId) => {
        const rank = ranks.find(r => r.rankId === rankId);
        setCurrentRank(rank || { rankId });
        setDeleteDialogOpen(true);
    };

    // Handler for closing delete dialog
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCurrentRank(null);
    };

    // Handler for confirming deletion
    const handleConfirmDelete = async () => {
        if (!currentRank || !currentRank.rankId) return;
        
        setIsSubmitting(true);
        try {
            // API call to delete rank
            const response = await axiosInstance.delete(
                `/realEstate/rank/delete/${currentRank.rankId}`
            );
            
            if (response.data && response.data.status === 200) {
                // Update local state
                const updatedRanks = ranks.filter(r => r.rankId !== currentRank.rankId);
                setRanks(updatedRanks);
                
                // Remove from selected ranks if present
                setSelectedRanks(selectedRanks.filter(id => id !== currentRank.rankId));
                
                // Close dialog
                setDeleteDialogOpen(false);
                setCurrentRank(null);
                
                // Apply filters to updated data
                applyFilters(updatedRanks);
                
                // Show success message
                handleNotification('Rank deleted successfully');
            } else {
                throw new Error(response.data?.message || 'Failed to delete rank');
            }
        } catch (error) {
            console.error('Error deleting rank:', error);
            
            let errorMessage = 'Failed to delete rank.';
            if (error.response) {
                errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'No response from server.';
            } else {
                errorMessage = error.message;
            }
            
            handleNotification(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        if (selectedRanks.length === 0) return;
        
        setIsSubmitting(true);
        try {
            let successCount = 0;
            let errorCount = 0;
            
            // Delete ranks one by one
            for (const rankId of selectedRanks) {
                try {
                    const response = await axiosInstance.delete(`/realEstate/rank/delete/${rankId}`);
                    if (response.data && response.data.status === 200) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (error) {
                    console.error(`Error deleting rank ${rankId}:`, error);
                    errorCount++;
                }
            }
            
            // Refresh the list
            await fetchRanks();
            
            // Clear selection
            setSelectedRanks([]);
            
            // Show result message
            if (errorCount === 0) {
                handleNotification(`Successfully deleted ${successCount} ranks`);
            } else {
                handleNotification(`Deleted ${successCount} ranks, but failed to delete ${errorCount} ranks`, 'warning');
            }
        } catch (error) {
            console.error('Error in bulk delete operation:', error);
            handleNotification('Failed to complete bulk delete operation', 'error');
        } finally {
            setIsSubmitting(false);
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
                    All Ranks
                </Typography>
                
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    <TextField
                        placeholder="Search ranks..."
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
                        onClick={() => setFilterDialogOpen(true)}
                        sx={{ minWidth: 100 }}
                    >
                        Filter
                    </Button>
                    
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddRank}
                        sx={{ 
                            bgcolor: '#6B66FF',
                            '&:hover': { bgcolor: '#5652e5' }
                        }}
                    >
                        Add Rank
                    </Button>
                    
                    {selectedRanks.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleBulkDelete}
                            disabled={isSubmitting}
                        >
                            Delete Selected ({selectedRanks.length})
                        </Button>
                    )}
                </Box>
            </Box>
            
            {/* Ranks Table */}
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
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={selectedRanks.length > 0 && selectedRanks.length < filteredRanks.length}
                                    checked={filteredRanks.length > 0 && selectedRanks.length === filteredRanks.length}
                                    onChange={handleSelectAll}
                                    disabled={loading}
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Rank ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    Rank Name
                                    <IconButton 
                                        size="small" 
                                        onClick={() => setFilterOptions(prev => ({
                                            ...prev,
                                            sortBy: 'rankName',
                                            sortOrder: prev.sortBy === 'rankName' && prev.sortOrder === 'asc' ? 'desc' : 'asc'
                                        }))}
                                    >
                                        <SortIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    Rank Number
                                    <IconButton 
                                        size="small" 
                                        onClick={() => setFilterOptions(prev => ({
                                            ...prev,
                                            sortBy: 'rankNumber',
                                            sortOrder: prev.sortBy === 'rankNumber' && prev.sortOrder === 'asc' ? 'desc' : 'asc'
                                        }))}
                                    >
                                        <SortIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    Commission %
                                    <IconButton 
                                        size="small" 
                                        onClick={() => setFilterOptions(prev => ({
                                            ...prev,
                                            sortBy: 'commissionPercent',
                                            sortOrder: prev.sortBy === 'commissionPercent' && prev.sortOrder === 'asc' ? 'desc' : 'asc'
                                        }))}
                                    >
                                        <SortIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </TableCell>
                            {/* <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={40} />
                                    <Typography variant="body2" sx={{ mt: 2 }}>
                                        Loading ranks...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredRanks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1">
                                        No ranks found. {searchTerm || 
                                          filterOptions.minCommission || 
                                          filterOptions.maxCommission ? 
                                          "Try adjusting your search criteria." : ""}
                                    </Typography>
                                    {!ranks.length && (
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={handleAddRank}
                                            sx={{ 
                                                mt: 2,
                                                bgcolor: '#6B66FF',
                                                '&:hover': { bgcolor: '#5652e5' }
                                            }}
                                        >
                                            Add Your First Rank
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRanks.map((rank) => (
                                <TableRow
                                    key={rank.rankId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={selectedRanks.includes(rank.rankId)}
                                            onChange={(event) => handleSelectRank(event, rank.rankId)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        {rank.rankId ? (rank.rankId.substring(0, 8) + '...') : 'N/A'}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{rank.rankName || 'N/A'}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{rank.rankNumber ?? 'N/A'}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{rank.commissionPercent !== null && rank.commissionPercent !== undefined ? `${rank.commissionPercent}%` : 'N/A'}</TableCell>
                                    {/* <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="Edit Rank">
                                                <IconButton 
                                                    size="small" 
                                                    sx={{ color: '#6B66FF' }}
                                                    onClick={() => handleEditRank(rank)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Rank">
                                                <IconButton 
                                                    size="small" 
                                                    color="error"
                                                    onClick={() => handleDeleteRank(rank.rankId)}
                                                >
                                                    <DeleteIcon fontSize="small" />
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
            
            {/* Dialogs */}
            {/* Add/Edit Rank Dialogs */}
            <AddRank
                open={addDialogOpen}
                onClose={handleCloseAddDialog}
                mode="add"
                onSuccess={handleNotification}
                refetchRanks={fetchRanks}
            />
            
            <AddRank
                open={editDialogOpen}
                onClose={handleCloseEditDialog}
                mode="edit"
                currentRank={currentRank}
                onSuccess={handleNotification}
                refetchRanks={fetchRanks}
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
                        Are you sure you want to delete this rank? This action cannot be undone and may affect associated users or commission structures.
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
            
            {/* Filter Dialog */}
            <Dialog 
                open={filterDialogOpen} 
                onClose={() => setFilterDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Filter Ranks
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Sort by
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Field</InputLabel>
                                    <Select
                                        value={filterOptions.sortBy}
                                        name="sortBy"
                                        label="Field"
                                        onChange={handleFilterChange}
                                    >
                                        <MenuItem value="rankName">Rank Name</MenuItem>
                                        <MenuItem value="rankNumber">Rank Number</MenuItem>
                                        <MenuItem value="commissionPercent">Commission %</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Order</InputLabel>
                                    <Select
                                        value={filterOptions.sortOrder}
                                        name="sortOrder"
                                        label="Order"
                                        onChange={handleFilterChange}
                                    >
                                        <MenuItem value="asc">Ascending</MenuItem>
                                        <MenuItem value="desc">Descending</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        
                        <Typography variant="subtitle2" gutterBottom>
                            Commission Range
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Min Commission %"
                                    name="minCommission"
                                    value={filterOptions.minCommission}
                                    onChange={handleFilterChange}
                                    type="number"
                                    InputProps={{
                                        inputProps: { min: 0, max: 100 }
                                    }}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Max Commission %"
                                    name="maxCommission"
                                    value={filterOptions.maxCommission}
                                    onChange={handleFilterChange}
                                    type="number"
                                    InputProps={{
                                        inputProps: { min: 0, max: 100 }
                                    }}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleResetFilters} color="inherit">
                        Reset
                    </Button>
                    <Button 
                        onClick={() => setFilterDialogOpen(false)} 
                        variant="contained"
                    >
                        Apply Filters
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

export default AllRanks;