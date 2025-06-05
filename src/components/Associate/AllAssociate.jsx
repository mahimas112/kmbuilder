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
    TextField,
    InputAdornment,
    Snackbar,
    Alert,
    Collapse,
    Grid,
    Card,
    CardContent,
    Pagination,
    useMediaQuery,
    useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PaymentIcon from '@mui/icons-material/Payment';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import DateRangeIcon from '@mui/icons-material/DateRange';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const AllAssociates = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // State variables
    const [associates, setAssociates] = useState([]);
    const [filteredAssociates, setFilteredAssociates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [expandedRows, setExpandedRows] = useState({});
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch associates data
    useEffect(() => {
        fetchAssociates();
    }, []);

    const fetchAssociates = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/realEstate/associate/getAll');
            if (response.data && Array.isArray(response.data.data)) {
                setAssociates(response.data.data);
                setFilteredAssociates(response.data.data);
            } else {
                console.error('Invalid response format:', response.data);
                setAssociates([]);
                setFilteredAssociates([]);
            }
        } catch (error) {
            console.error('Error fetching associates:', error);
            setAssociates([]);
            setFilteredAssociates([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle search input change
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredAssociates(associates);
        } else {
            const lowercasedFilter = searchTerm.toLowerCase();
            const filtered = associates.filter(item => {
                return (
                    (item.name && item.name.toLowerCase().includes(lowercasedFilter)) ||
                    (item.associateReperCode && item.associateReperCode.toLowerCase().includes(lowercasedFilter)) ||
                    (item.emailId && item.emailId.toLowerCase().includes(lowercasedFilter)) ||
                    (item.mobile && item.mobile.includes(searchTerm))
                );
            });
            setFilteredAssociates(filtered);
        }
        setCurrentPage(1); // Reset to first page when search changes
    }, [searchTerm, associates]);

    // Toggle row expansion
    const handleToggleRow = (associateId) => {
        setExpandedRows(prev => ({
            ...prev,
            [associateId]: !prev[associateId]
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

    // Handler for adding a new associate
    const handleAddAssociate = () => {
        navigate('/associates/add-associates', { state: { mode: 'add' } });
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

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAssociates = filteredAssociates.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAssociates.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Detail View Component
    const AssociateDetailView = ({ associate }) => {
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
                                        <Typography variant="body1">{associate.title} {associate.name}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
                                        <Typography variant="body1">{associate.gender}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                                        <Typography variant="body1">{formatDate(associate.dob)}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">Father/Husband Name</Typography>
                                        <Typography variant="body1">{associate.fatherOrHusbandName}</Typography>
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
                                    <ContactPhoneIcon sx={{ mr: 1 }} />
                                    Contact Information
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">Mobile</Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PhoneIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                            {associate.mobile}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <EmailIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                            {associate.emailId}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <HomeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                            {associate.address}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">City</Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocationCityIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                            {associate.city}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle2" color="text.secondary">State</Typography>
                                        <Typography variant="body1">{associate.state}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Identification Details */}
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
                                    Identification Details
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">PAN Card</Typography>
                                        <Typography variant="body1">{associate.panCardNo}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Aadhaar Number</Typography>
                                        <Typography variant="body1">{associate.aadhaarNo}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Association Details */}
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
                                    <BusinessIcon sx={{ mr: 1 }} />
                                    Association Details
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Associate ID</Typography>
                                        <Typography variant="body1">{associate.associateReperCode}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Rank</Typography>
                                        <Typography variant="body1">{associate.rankName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Joining Date</Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <DateRangeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                            {formatDate(associate.joiningDate)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Referral Code</Typography>
                                        <Typography variant="body1">{associate.refralCodeOfPresentAssociate || 'N/A'}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Bank Details */}
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
                                    <PaymentIcon sx={{ mr: 1 }} />
                                    Bank Details
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Account Holder</Typography>
                                        <Typography variant="body1">{associate.accountHolderName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Bank Name</Typography>
                                        <Typography variant="body1">{associate.bankName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Account Number</Typography>
                                        <Typography variant="body1">{associate.accountNo}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">IFSC Code</Typography>
                                        <Typography variant="body1">{associate.ifscCode}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Nominee Details */}
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
                                    Nominee Details
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Nominee Name</Typography>
                                        <Typography variant="body1">{associate.nomineeName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Relationship</Typography>
                                        <Typography variant="body1">{associate.nomineeRelation}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Nominee Age</Typography>
                                        <Typography variant="body1">{associate.nomineeAge}</Typography>
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
        <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
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
                    All Associates
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    <TextField
                        placeholder="Search associates..."
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
                        onClick={handleAddAssociate}
                        sx={{
                            bgcolor: '#6B66FF',
                            '&:hover': { bgcolor: '#5652e5' }
                        }}
                    >
                        Add Associate
                    </Button>
                </Box>
            </Box>

            {/* Associates Table with Accordion */}
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    overflowX: 'auto',
                    border: '1px solid #e0e0e0',
                    mb: 2
                }}
            >
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#DAE1F3' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Associate ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            {!isSmallScreen && <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>}
                            {!isSmallScreen && <TableCell sx={{ fontWeight: 600 }}>Mobile</TableCell>}
                            {!isSmallScreen && <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>}
                            {!isSmallScreen && <TableCell sx={{ fontWeight: 600 }}>Joining Date</TableCell>}
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={40} />
                                    <Typography variant="body2" sx={{ mt: 2 }}>
                                        Loading associates...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : currentAssociates.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1">
                                        No associates found. {searchTerm && "Try adjusting your search criteria."}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentAssociates.map((associate) => (
                                <React.Fragment key={associate.associateId}>
                                    <TableRow
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            backgroundColor: expandedRows[associate.associateId] ? 'rgba(107, 102, 255, 0.05)' : 'inherit',
                                            '& > td': {
                                                borderBottom: expandedRows[associate.associateId] ? 'none' : '1px solid rgba(224, 224, 224, 1)'
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            {associate.associateReperCode}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{associate.name}</TableCell>
                                        {!isSmallScreen && <TableCell>{associate.rankName}</TableCell>}
                                        {!isSmallScreen && <TableCell>{associate.mobile}</TableCell>}
                                        {!isSmallScreen && <TableCell>{associate.emailId}</TableCell>}
                                        {!isSmallScreen && <TableCell>{formatDate(associate.joiningDate)}</TableCell>}
                                        <TableCell>
                                            <Tooltip title={expandedRows[associate.associateId] ? "Hide Details" : "View Details"}>
                                                <IconButton
                                                    size="small"
                                                    sx={{ color: '#6B66FF' }}
                                                    onClick={() => handleToggleRow(associate.associateId)}
                                                >
                                                    {expandedRows[associate.associateId] ?
                                                        <KeyboardArrowUpIcon fontSize="small" /> :
                                                        <VisibilityIcon fontSize="small" />
                                                    }
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={7} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                            <Collapse in={expandedRows[associate.associateId]} timeout="auto" unmountOnExit>
                                                <AssociateDetailView associate={associate} />
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size={isSmallScreen ? "small" : "medium"}
                    />
                </Box>
            )}

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

export default AllAssociates;