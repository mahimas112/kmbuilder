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
    Snackbar,
    Alert,
    Select,
    MenuItem,
    FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AddLead from './AddLead';
import axiosInstance from '../../axiosInstance';

const Lead = () => {
    // State variables
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [sources, setSources] = useState([]);
    const [leadTypes, setLeadTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [currentLead, setCurrentLead] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Notification state
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    fetchLeads(),
                    fetchSources(),
                    fetchLeadTypes()
                ]);
            } catch (error) {
                handleNotification('Failed to load initial data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Fetch leads
    const fetchLeads = async () => {
        try {
            const response = await axiosInstance.get('/realEstate/enquiry/getAllEnquiry');
            if (response.data.status === 200 && Array.isArray(response.data.data)) {
                setLeads(response.data.data);
                setFilteredLeads(response.data.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
            handleNotification('Failed to fetch leads', 'error');
        }
    };

    // Fetch sources
    const fetchSources = async () => {
        try {
            const response = await axiosInstance.get('/realEstate/source/getAllSource');
            if (response.data.status === 200 && Array.isArray(response.data.data)) {
                setSources(response.data.data);
            } else {
                throw new Error('Invalid sources response');
            }
        } catch (error) {
            console.error('Error fetching sources:', error);
            handleNotification('Failed to fetch sources', 'error');
        }
    };

    // Fetch lead types
    const fetchLeadTypes = async () => {
        try {
            const response = await axiosInstance.get('/realEstate/leadType/getAll');
            if (response.data.status === 201 && Array.isArray(response.data.data)) {
                setLeadTypes(response.data.data);
            } else {
                throw new Error('Invalid lead types response');
            }
        } catch (error) {
            console.error('Error fetching lead types:', error);
            handleNotification('Failed to fetch lead types', 'error');
        }
    };

    // Handle search input change
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredLeads(leads);
        } else {
            const lowercasedFilter = searchTerm.toLowerCase();
            const filtered = leads.filter(lead => 
                lead.customerName.toLowerCase().includes(lowercasedFilter) ||
                lead.mobile.toLowerCase().includes(lowercasedFilter) ||
                lead.email.toLowerCase().includes(lowercasedFilter)
            );
            setFilteredLeads(filtered);
        }
    }, [searchTerm, leads]);

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

    // Get source name
    const getSourceName = (sourceId) => {
        const source = sources.find(s => s.sourceId === sourceId);
        return source ? source.sourceName : 'Unknown';
    };

    // Get lead type name
    const getLeadTypeName = (leadId) => {
        const leadType = leadTypes.find(l => l.leadId === leadId);
        return leadType ? leadType.leadTypeName : 'Unknown';
    };

    // Handler for editing a lead
    const handleEditLead = (lead) => {
        setCurrentLead(lead);
        setEditDialogOpen(true);
    };

    // Handler for adding a new lead
    const handleAddLead = () => {
        setCurrentLead(null);
        setAddDialogOpen(true);
    };

    // Handler for closing Add Lead Dialog
    const handleCloseAddDialog = () => {
        setAddDialogOpen(false);
        fetchLeads(); // Fetch leads when add dialog closes
    };

    // Handler for closing Edit Lead Dialog
    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        fetchLeads(); // Fetch leads when edit dialog closes
    };

    // Handler for deleting a lead
    const handleDeleteLead = (enquiryId) => {
        setCurrentLead({ enquiryId });
        setDeleteDialogOpen(true);
    };

    // Handler for closing Delete Dialog
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        fetchLeads(); // Fetch leads when delete dialog closes
    };

    // Handler for confirming lead deletion
    const handleConfirmDelete = async () => {
        if (!currentLead) return;
        
        setIsSubmitting(true);
        try {
            const response = await axiosInstance.delete(
                `/realEstate/enquiry/deleteEnquiry?enquiryId=${currentLead.enquiryId}`
            );
            
            if (response.data.status === 200) {
                // Update local state
                const updatedLeads = leads.filter(l => l.enquiryId !== currentLead.enquiryId);
                setLeads(updatedLeads);
                setFilteredLeads(updatedLeads);
                
                // Close dialog
                setDeleteDialogOpen(false);
                setCurrentLead(null);
                
                // Show success notification
                handleNotification('Lead deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting lead:', error);
            handleNotification('Failed to delete lead', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateLeadType = async (lead, newLeadTypeId) => {
        setIsSubmitting(true);
        try {
            const response = await axiosInstance.put(
                '/realEstate/enquiry/updateEnquiry',
                {
                    ...lead,
                    leadId: newLeadTypeId
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.status === 201) {
                handleNotification('Lead type updated successfully');
                fetchLeads();
            } else {
                throw new Error(response.data?.message || 'Failed to update lead type');
            }
        } catch (error) {
            console.error('Error updating lead type:', error);
            handleNotification('Error updating lead type: ' + (error.message || 'Unknown error'), 'error');
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
                    Leads
                </Typography>
                
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    <TextField
                        placeholder="Search leads..."
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
                        onClick={handleAddLead}
                        sx={{ 
                            bgcolor: '#6B66FF',
                            '&:hover': { bgcolor: '#5652e5' }
                        }}
                    >
                        Add Lead
                    </Button>
                </Box>
            </Box>
            
            {/* Leads Table */}
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
                            <TableCell sx={{ fontWeight: 600 }}>Customer Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Mobile</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Lead Type</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={40} />
                                    <Typography variant="body2" sx={{ mt: 2 }}>
                                        Loading leads...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredLeads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1">
                                        No leads found. {searchTerm && "Try adjusting your search criteria."}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeads.map((lead) => (
                                <TableRow
                                    key={lead.enquiryId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell sx={{ fontWeight: 500 }}>{lead.customerName}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{lead.mobile}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{lead.email}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{getSourceName(lead.sourceId)}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        <FormControl fullWidth>
                                            <Select
                                                value={lead.leadId || ''}
                                                onChange={(e) => handleUpdateLeadType(lead, e.target.value)}
                                                disabled={isSubmitting}
                                                sx={{ 
                                                    '& .MuiSelect-select': { 
                                                        py: 1,
                                                        fontWeight: 500
                                                    }
                                                }}
                                            >
                                                {leadTypes.map((type) => (
                                                    <MenuItem key={type.leadId} value={type.leadId}>
                                                        {type.leadTypeName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="Delete Lead">
                                                <IconButton 
                                                    size="small" 
                                                    color="error"
                                                    onClick={() => handleDeleteLead(lead.enquiryId)}
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

            {/* Add Lead Dialog */}
            <AddLead
                open={addDialogOpen}
                onClose={handleCloseAddDialog}
                mode="add"
                sources={sources}
                leadTypes={leadTypes}
                onSuccess={handleNotification}
                refetchLeads={fetchLeads}
            />

            {/* Edit Lead Dialog */}
            <AddLead
                open={editDialogOpen}
                onClose={handleCloseEditDialog}
                mode="edit"
                currentLead={currentLead}
                sources={sources}
                leadTypes={leadTypes}
                onSuccess={handleNotification}
                refetchLeads={fetchLeads}
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
                        Are you sure you want to delete this lead? This action cannot be undone.
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

export default Lead;