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
    Snackbar,
    Alert,
    Collapse,
    Grid,
    Card,
    CardContent,
    Divider,
    Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import WorkIcon from '@mui/icons-material/Work';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import DateRangeIcon from '@mui/icons-material/DateRange';
import BadgeIcon from '@mui/icons-material/Badge';
import FlagIcon from '@mui/icons-material/Flag';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const AllCustomers = () => {
    // Navigation hook
    const navigate = useNavigate();

    // State variables
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    // State to track expanded rows
    const [expandedRows, setExpandedRows] = useState({});

    // Fetch customers data
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/realEstate/addNew-customer/getAllCustomers');
            if (response.data && Array.isArray(response.data.data)) {
                setCustomers(response.data.data);
                setFilteredCustomers(response.data.data);
            } else {
                console.error('Invalid response format:', response.data);
                // Sample data if API fails
                const sampleData = [
                    {
                        "customerId": "9b68f9e0-2a6b-4936-833d-0cbc1507362e",
                        "associateCode": "MOHD8420",
                        "customerName": "Manas Gupta",
                        "title": "Mr",
                        "swdOf": "Mr.Gupta",
                        "dateOfBirth": "2009-02-02",
                        "gender": "Male",
                        "address": "Gomti Nagar, Lucknow",
                        "pinCode": "244001",
                        "city": "Lucknow",
                        "state": "Uttar-Pradesh",
                        "emailId": "manas@gmail.com",
                        "mobileNo": "8899008877",
                        "panOrAddharNo": "723839977768",
                        "occupation": "Bussiness-Man",
                        "nationality": "India",
                        "nomineeName": "Manas Gupta",
                        "relation": "sibling",
                        "profilePic": null,
                        "uploadAddhaarCard": null,
                        "userVisitType": "Online",
                        "associateName": "Mohd Zaid"
                    }
                ];
                setCustomers(sampleData);
                setFilteredCustomers(sampleData);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            // Sample data if API fails
            const sampleData = [
                {
                    "customerId": "9b68f9e0-2a6b-4936-833d-0cbc1507362e",
                    "associateCode": "MOHD8420",
                    "customerName": "Manas Gupta",
                    "title": "Mr",
                    "swdOf": "Mr.Gupta",
                    "dateOfBirth": "2009-02-02",
                    "gender": "Male",
                    "address": "Gomti Nagar, Lucknow",
                    "pinCode": "244001",
                    "city": "Lucknow",
                    "state": "Uttar-Pradesh",
                    "emailId": "manas@gmail.com",
                    "mobileNo": "8899008877",
                    "panOrAddharNo": "723839977768",
                    "occupation": "Bussiness-Man",
                    "nationality": "India",
                    "nomineeName": "Manas Gupta",
                    "relation": "sibling",
                    "profilePic": null,
                    "uploadAddhaarCard": null,
                    "userVisitType": "Online",
                    "associateName": "Mohd Zaid"
                }
            ];
            setCustomers(sampleData);
            setFilteredCustomers(sampleData);
        } finally {
            setLoading(false);
        }
    };

    // Handle search input change
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredCustomers(customers);
        } else {
            const lowercasedFilter = searchTerm.toLowerCase();
            const filtered = customers.filter(item => {
                return (
                    (item.customerName && item.customerName.toLowerCase().includes(lowercasedFilter)) ||
                    (item.associateCode && item.associateCode.toLowerCase().includes(lowercasedFilter)) ||
                    (item.emailId && item.emailId.toLowerCase().includes(lowercasedFilter)) ||
                    (item.mobileNo && item.mobileNo?.includes(searchTerm))
                );
            });
            setFilteredCustomers(filtered);
        }
    }, [searchTerm, customers]);

    // Handler for checkbox selection
    const handleSelectCustomer = (event, customerId) => {
        if (event.target.checked) {
            setSelectedCustomers([...selectedCustomers, customerId]);
        } else {
            setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
        }
    };

    // Handler for select all checkbox
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedCustomers(filteredCustomers.map(customer => customer.customerId));
        } else {
            setSelectedCustomers([]);
        }
    };

    // Toggle row expansion
    const handleToggleRow = (customerId) => {
        setExpandedRows(prev => ({
            ...prev,
            [customerId]: !prev[customerId]
        }));
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

    // Handler for adding a new customer - navigate to add page
    const handleAddCustomer = () => {
        navigate('/customers/add-customer');
    };

    // Handler for opening delete confirmation
    const handleDeleteCustomer = (customerId) => {
        setCurrentCustomer({ customerId });
        setDeleteDialogOpen(true);
    };

    // Handler for closing delete dialog
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCurrentCustomer(null);
    };

    // Handler for confirming deletion
    const handleConfirmDelete = async () => {
        if (!currentCustomer) return;

        setIsSubmitting(true);
        try {
            // API call to delete customer
            const response = await axiosInstance.delete(
                `/realEstate/addNew-customer/deleteCustomer/${currentCustomer.customerId}`
            );

            if (response.data && response.data.status === 200) {
                // Update local state
                const updatedCustomers = customers.filter(c => c.customerId !== currentCustomer.customerId);
                setCustomers(updatedCustomers);
                setFilteredCustomers(filteredCustomers.filter(c => c.customerId !== currentCustomer.customerId));

                // Remove from selected customers if present
                setSelectedCustomers(selectedCustomers.filter(id => id !== currentCustomer.customerId));

                // Close dialog
                setDeleteDialogOpen(false);
                setCurrentCustomer(null);

                // Show success message
                handleNotification('Customer deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            handleNotification('Failed to delete customer', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        if (selectedCustomers.length === 0) return;

        setIsSubmitting(true);
        try {
            // API call to delete multiple customers
            // Example approach - delete one by one
            for (const customerId of selectedCustomers) {
                await axiosInstance.delete(`/realEstate/addNew-customer/deleteCustomer/${customerId}`);
            }

            // Update local state
            const updatedCustomers = customers.filter(c => !selectedCustomers.includes(c.customerId));
            setCustomers(updatedCustomers);
            setFilteredCustomers(filteredCustomers.filter(c => !selectedCustomers.includes(c.customerId)));

            // Clear selection
            setSelectedCustomers([]);

            // Show success message
            handleNotification(`${selectedCustomers.length} customers deleted successfully`);
        } catch (error) {
            console.error('Error deleting customers:', error);
            handleNotification('Failed to delete customers', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Detail View Component
    const CustomerDetailView = ({ customer }) => {
        return (
            <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <Grid container spacing={3}>
                    {/* Personal Information */}
                    <Grid item xs={12}>
                        <Card elevation={0} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6" color="primary" gutterBottom sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: '1px solid',
                                    borderColor: 'primary.light',
                                    pb: 1,
                                    mb: 2
                                }}>
                                    <PersonIcon sx={{ mr: 1 }} />
                                    Personal Information
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                                        <Typography variant="body1">{customer.title} {customer.customerName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
                                        <Typography variant="body1">{customer.gender}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                                        <Typography variant="body1">{formatDate(customer.dateOfBirth)}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">Son/Wife/Daughter of</Typography>
                                        <Typography variant="body1">{customer.swdOf}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Contact Information */}
                    <Grid item xs={12}>
                        <Card elevation={0} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6" color="primary" gutterBottom sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: '1px solid',
                                    borderColor: 'primary.light',
                                    pb: 1,
                                    mb: 2
                                }}>
                                    <PermContactCalendarIcon sx={{ mr: 1 }} />
                                    Contact Information
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">Mobile</Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PhoneIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                            {customer.mobileNo || 'N/A'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <EmailIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                            {customer.emailId}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <HomeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                            {customer.address}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">City</Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocationCityIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                            {customer.city}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">State</Typography>
                                        <Typography variant="body1">{customer.state}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">PIN Code</Typography>
                                        <Typography variant="body1">{customer.pinCode}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Identification & Professional Details */}
                    <Grid item xs={12} sm={6}>
                        <Card elevation={0} sx={{ mb: 2, height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" color="primary" gutterBottom sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: '1px solid',
                                    borderColor: 'primary.light',
                                    pb: 1,
                                    mb: 2
                                }}>
                                    <BadgeIcon sx={{ mr: 1 }} />
                                    Identification & Professional Details
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">PAN/Aadhaar Number</Typography>
                                        <Typography variant="body1">{customer.panOrAddharNo}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Occupation</Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <WorkIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                            {customer.occupation}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Nationality</Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <FlagIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                            {customer.nationality}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Visit Type</Typography>
                                        <Typography variant="body1">
                                            <Chip 
                                                size="small" 
                                                label={customer.userVisitType}
                                                color={customer.userVisitType === 'Online' ? 'primary' : 'default'}
                                            />
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Nominee & Associate Details */}
                    <Grid item xs={12} sm={6}>
                        <Card elevation={0} sx={{ mb: 2, height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" color="primary" gutterBottom sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: '1px solid',
                                    borderColor: 'primary.light',
                                    pb: 1,
                                    mb: 2
                                }}>
                                    <FamilyRestroomIcon sx={{ mr: 1 }} />
                                    Nominee & Associate Details
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Nominee Name</Typography>
                                        <Typography variant="body1">{customer.nomineeName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Relationship</Typography>
                                        <Typography variant="body1">{customer.relation}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Associate Code</Typography>
                                        <Typography variant="body1">{customer.associateCode || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Associate Name</Typography>
                                        <Typography variant="body1">{customer.associateName || 'N/A'}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        );
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
                    All Customers
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    <TextField
                        placeholder="Search customers..."
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
                        onClick={handleAddCustomer}
                        sx={{
                            bgcolor: '#6B66FF',
                            '&:hover': { bgcolor: '#5652e5' }
                        }}
                    >
                        Add Customer
                    </Button>

                    {selectedCustomers.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleBulkDelete}
                            disabled={isSubmitting}
                        >
                            Delete Selected ({selectedCustomers.length})
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Customers Table with Accordion */}
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
                                    indeterminate={selectedCustomers.length > 0 && selectedCustomers.length < filteredCustomers.length}
                                    checked={filteredCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length}
                                    onChange={handleSelectAll}
                                    disabled={loading}
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Mobile</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Associate</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Visit Type</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={40} />
                                    <Typography variant="body2" sx={{ mt: 2 }}>
                                        Loading customers...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredCustomers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1">
                                        No customers found. {searchTerm && "Try adjusting your search criteria."}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <React.Fragment key={customer.customerId}>
                                    <TableRow
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            backgroundColor: expandedRows[customer.customerId] ? 'rgba(107, 102, 255, 0.05)' : 'inherit',
                                            '& > td': {
                                                borderBottom: expandedRows[customer.customerId] ? 'none' : '1px solid rgba(224, 224, 224, 1)'
                                            }
                                        }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={selectedCustomers.includes(customer.customerId)}
                                                onChange={(event) => handleSelectCustomer(event, customer.customerId)}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{customer.customerName}</TableCell>
                                        <TableCell>{customer.mobileNo || 'N/A'}</TableCell>
                                        <TableCell>{customer.emailId}</TableCell>
                                        <TableCell>{customer.city}</TableCell>
                                        <TableCell>
                                            {customer.associateName ? (
                                                <Tooltip title={`Associate Code: ${customer.associateCode}`}>
                                                    <Typography variant="body2">{customer.associateName}</Typography>
                                                </Tooltip>
                                            ) : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={customer.userVisitType}
                                                size="small"
                                                color={customer.userVisitType === 'Online' ? 'primary' : 'default'}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title={expandedRows[customer.customerId] ? "Hide Details" : "View Details"}>
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: '#6B66FF' }}
                                                        onClick={() => handleToggleRow(customer.customerId)}
                                                    >
                                                        {expandedRows[customer.customerId] ?
                                                            <KeyboardArrowUpIcon fontSize="small" /> :
                                                            <VisibilityIcon fontSize="small" />
                                                        }
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Customer">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteCustomer(customer.customerId)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                            <Collapse in={expandedRows[customer.customerId]} timeout="auto" unmountOnExit>
                                                <CustomerDetailView customer={customer} />
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

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
                        Are you sure you want to delete this customer? This action cannot be undone and may affect related data.
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

export default AllCustomers;