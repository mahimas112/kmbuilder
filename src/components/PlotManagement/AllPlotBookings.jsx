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
    Button,
    CircularProgress,
    IconButton,
    Tooltip,
    Accordion,
    AccordionDetails,
    Grid,
    Chip,
    Divider,
    Card,
    CardContent,
    Alert,
    Collapse,
    TextField,
    MenuItem,
    TablePagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from 'react-router-dom';
import { handleShowReceipt } from './Receipt';
import axiosInstance from '../../axiosInstance';

const AllPlotBookings = () => {
    const navigate = useNavigate();
    const [plotBookings, setPlotBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tableLoading, setTableLoading] = useState(true);

    // Use expanded state for controlling expansion of rows
    const [expandedRows, setExpandedRows] = useState({});

    // State for mapping data
    const [projects, setProjects] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [associates, setAssociates] = useState([]);

    // Additional loading states
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [blocksLoading, setBlocksLoading] = useState(true);
    const [customersLoading, setCustomersLoading] = useState(true);
    const [associatesLoading, setAssociatesLoading] = useState(true);

    // Filter states
    const [filters, setFilters] = useState({
        project: '',
        clientType: '',
        bookingDate: '',
        search: ''
    });

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Professional color palette
    const colors = {
        primary: '#2C3E50',      // Dark blue-gray
        secondary: '#34495E',    // Slightly lighter blue-gray
        accent: '#3498DB',       // Bright blue
        background: '#F4F6F7',   // Light grayish-blue
        text: {
            primary: '#2C3E50',
            secondary: '#7F8C8D'
        }
    };

    // Create axiosInstance instance with interceptors for consistent error handling
    // const api = axiosInstance.create({
    //     baseURL: 'https://app.ventureconsultancyservices.com/realEstate'
    // });

    // Add response interceptor for error handling
    // api.interceptors.response.use(
    //     response => response,
    //     error => {
    //         const errorMessage = error.response?.data?.message ||
    //             error.message ||
    //             'An unexpected error occurred';
    //         console.error('API Error:', errorMessage, error);
    //         return Promise.reject(errorMessage);
    //     }
    // );

    useEffect(() => {
        // Fetch all required data in parallel
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setTableLoading(true);
                const [bookingsData, projectsData, blocksData, customersData, associatesData] = await Promise.all([
                    fetchPlotBookings(),
                    fetchProjects(),
                    fetchBlocks(),
                    fetchCustomers(),
                    fetchAssociates()
                ]);

                // Process all data at once
                if (bookingsData && projectsData && blocksData && customersData && associatesData) {
                    const processedData = processBookingsData();
                    setPlotBookings(processedData);
                }
            } catch (error) {
                console.error('Error loading initial data:', error);
                setError('Failed to load some data. Please refresh the page.');
            } finally {
                setLoading(false);
                setTableLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Process bookings with additional data after all data is loaded
    useEffect(() => {
        if (!loading && !projectsLoading && !blocksLoading && !customersLoading && !associatesLoading && plotBookings.length > 0) {
            const enhancedBookings = processBookingsData();
            setPlotBookings(enhancedBookings);
        }
    }, [loading, projectsLoading, blocksLoading, customersLoading, associatesLoading]);

    // Process bookings to include names instead of IDs
    const processBookingsData = () => {
        // Create lookup maps for faster access
        const projectMap = new Map(projects.map(p => [p.projectId, p]));
        const blockMap = new Map(blocks.map(b => [b.blockId, b]));
        const customerMap = new Map(customers.map(c => [c.customerId, c]));
        const associateMap = new Map(associates.map(a => [a.associateReperCode, a]));

        const processedBookings = plotBookings.map(booking => {
            // Get data from maps (much faster than find)
            const project = projectMap.get(booking.projectId);
            console.log(`📦 BookingCode: ${booking.bookingCode}`);
            console.log('🏗️  Project:', project);


            const block = blockMap.get(booking.blockID);

            let clientName = "N/A";
            let clientType = "Unknown";
            let email = "N/A";
            let mobileNo = "N/A";
            let address = "N/A";

            if (booking.customerId) {
                const customer = customerMap.get(booking.customerId);
                if (customer) {
                    clientName = customer.customerName;
                    clientType = "Customer";
                    email = customer.emailId;
                    mobileNo = customer.mobileNo;
                    address = customer.address;
                }
            } else if (booking.associateCode) {
                const associate = associateMap.get(booking.associateCode);
                if (associate) {
                    clientName = associate.name;
                    clientType = "Associate";
                    email = associate.emailId;
                    mobileNo = associate.mobileNo;
                    address = associate.address;
                }
            }

            return {
                ...booking,
                projectName: project ? project.siteName : 'Unknown Project',
                blockName: block ? block.block : 'Unknown Block',
                clientName,
                clientType,
                email,
                mobileNo,
                address,
                plotNo: booking.plotNo || 'N/A',
                ploatArea: booking.ploatArea || 0,
                plotRate: booking.plotRate || 0,
                bookingCode: booking.bookingCode || 'N/A',
                bookingDate: booking.bookingDate || 'N/A',
                poatCoast: booking.poatCoast || 0,
                developmentAmount: booking.developmentAmount || 0,
                plcAmount: booking.plcAmount || 0,
                otherCharges: booking.otherCharges || 0,
                couponDiscount: booking.couponDiscount || 0,
                totalPlotCost: booking.totalPlotCost || 0,
                bookingAmount: booking.bookingAmount || 0,
                dueAmount: booking.dueAmount || 0,
                payMode: booking.payMode || 'Cash',
                bankName: booking.bankName || 'N/A',
                checqueNo: booking.checqueNo || 'N/A',
                checqueDate: booking.checqueDate || 'N/A'
            };
        });

        setTableLoading(false);
        return processedBookings;
    };

    const fetchPlotBookings = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/realEstate/plot-booking/getAllSellingOfPlots');

            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setPlotBookings(response.data.data);
                return response.data.data;
            } else {
                throw new Error('Invalid response format for plot bookings');
            }
        } catch (error) {
            setError('Failed to fetch plot bookings: ' + error);
            return [];
        }
    };

    const fetchProjects = async () => {
        try {
            setProjectsLoading(true);
            const response = await axiosInstance.get('/realEstate/project/getAll');

            if (response.data && Array.isArray(response.data.data)) {
                setProjects(response.data.data);
            } else {
                throw new Error('Invalid response format for projects');
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setProjectsLoading(false);
        }
    };

    const fetchBlocks = async () => {
        try {
            setBlocksLoading(true);
            const response = await axiosInstance.get('/realEstate/Block/getAllBlock');

            if (response.data && Array.isArray(response.data.data)) {
                setBlocks(response.data.data);
            } else {
                throw new Error('Invalid response format for blocks');
            }
        } catch (error) {
            console.error('Error fetching blocks:', error);
        } finally {
            setBlocksLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            setCustomersLoading(true);
            const response = await axiosInstance.get('/realEstate/addNew-customer/getAllCustomers');

            if (response.data && Array.isArray(response.data.data)) {
                setCustomers(response.data.data);
            } else {
                throw new Error('Invalid response format for customers');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setCustomersLoading(false);
        }
    };

    const fetchAssociates = async () => {
        try {
            setAssociatesLoading(true);
            const response = await axiosInstance.get('/realEstate/associate/getAll');

            if (response.data && Array.isArray(response.data.data)) {
                setAssociates(response.data.data);
            } else {
                throw new Error('Invalid response format for associates');
            }
        } catch (error) {
            console.error('Error fetching associates:', error);
        } finally {
            setAssociatesLoading(false);
        }
    };

    const handleAddPlotBooking = () => {
        navigate('/masters/add-plot-booking');
    };

    const handleViewDetails = (bookingId) => {
        setExpandedRows(prev => ({
            ...prev,
            [bookingId]: !prev[bookingId]
        }));
    };

    const renderBookingDetailsAccordion = (booking) => (
        <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
            <Grid container spacing={3}>
                {/* Plot Details Section */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocationOnIcon sx={{ color: '#6B66FF', mr: 1 }} />
                                <Typography variant="h6" color="primary">Plot Details</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Project Name</Typography>
                                    <Typography variant="body1">{booking.projectName}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Block Name</Typography>
                                    <Typography variant="body1">{booking.blockName}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Plot Number</Typography>
                                    <Typography variant="body1">{booking.plotNo}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Plot Area</Typography>
                                    <Typography variant="body1">{booking.ploatArea} sq.ft</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Plot Rate</Typography>
                                    <Typography variant="body1">₹{booking.plotRate?.toLocaleString() || 0}/sq.ft</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Development Rate</Typography>
                                    <Typography variant="body1">₹{booking.developmentAmount?.toLocaleString() || 0}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Client Details Section */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PersonIcon sx={{ color: '#6B66FF', mr: 1 }} />
                                <Typography variant="h6" color="primary">Client Details</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Client Name</Typography>
                                    <Typography variant="body1">{booking.clientName}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Client Type</Typography>
                                    <Chip
                                        label={booking.clientType}
                                        color={booking.clientType === "Customer" ? "primary" : "secondary"}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Mobile Number</Typography>
                                    <Typography variant="body1">{booking.mobileNo || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                    <Typography variant="body1">{booking.email || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                                    <Typography variant="body1">{booking.address || 'N/A'}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Payment Details Section */}
                <Grid item xs={12}>
                    <Card elevation={0}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PaymentIcon sx={{ color: '#6B66FF', mr: 1 }} />
                                <Typography variant="h6" color="primary">Payment Details</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" color="text.secondary">Total Plot Cost</Typography>
                                    <Typography variant="body1" fontWeight="bold">₹{booking.totalPlotCost?.toLocaleString() || 0}</Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" color="text.secondary">Booking Amount</Typography>
                                    <Typography variant="body1">₹{booking.bookingAmount?.toLocaleString() || 0}</Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" color="text.secondary">Due Amount</Typography>
                                    <Typography variant="body1" color="error">₹{booking.dueAmount?.toLocaleString() || 0}</Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" color="text.secondary">Payment Mode</Typography>
                                    <Typography variant="body1">{booking.payMode || 'Cash'}</Typography>
                                </Grid>
                                {booking.payMode === 'Cheque' && (
                                    <>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="subtitle2" color="text.secondary">Bank Name</Typography>
                                            <Typography variant="body1">{booking.bankName || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="subtitle2" color="text.secondary">Cheque Number</Typography>
                                            <Typography variant="body1">{booking.checqueNo || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="subtitle2" color="text.secondary">Cheque Date</Typography>
                                            <Typography variant="body1">{booking.checqueDate || 'N/A'}</Typography>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Additional Details Section */}
                <Grid item xs={12}>
                    <Card elevation={0}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <BusinessIcon sx={{ color: '#6B66FF', mr: 1 }} />
                                <Typography variant="h6" color="primary">Additional Details</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" color="text.secondary">Booking Date</Typography>
                                    <Typography variant="body1">{booking.bookingDate}</Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" color="text.secondary">Booking Code</Typography>
                                    <Typography variant="body1" sx={{ color: '#6B66FF', fontWeight: 'bold' }}>{booking.bookingCode}</Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" color="text.secondary">Payment Plan</Typography>
                                    <Typography variant="body1">{booking.planType || 'One Time Payment'}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );

    
    // Filter function
    const filterBookings = (bookings) => {
        return bookings.filter(booking => {
            const matchesProject = !filters.project || booking.projectName.toLowerCase().includes(filters.project.toLowerCase());
            const matchesClientType = !filters.clientType || booking.clientType === filters.clientType;
            const matchesSearch = !filters.search ||
                booking.bookingCode.toLowerCase().includes(filters.search.toLowerCase()) ||
                booking.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
                booking.plotNo.toLowerCase().includes(filters.search.toLowerCase());

            return matchesProject && matchesClientType && matchesSearch;
        });
    };

    // Handle filter change
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setPage(0); // Reset to first page when filters change
    };
    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Get filtered and paginated bookings
    const getFilteredAndPaginatedBookings = () => {
        const filteredBookings = filterBookings(plotBookings);
        return filteredBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    };

    // Check if data is still loading
    const isDataLoading = loading || projectsLoading || blocksLoading || customersLoading || associatesLoading;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h5" fontWeight="bold">
                    Plot Bookings
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddPlotBooking}
                    sx={{
                        bgcolor: '#6B66FF',
                        '&:hover': { bgcolor: '#5652e5' }
                    }}
                >
                    Add Plot Booking
                </Button>
            </Box>

            {/* Filters Section */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Search"
                            variant="outlined"
                            size="small"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            placeholder="Search by booking code, client name, plot no"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            select
                            label="Project"
                            variant="outlined"
                            size="small"
                            value={filters.project}
                            onChange={(e) => handleFilterChange('project', e.target.value)}
                        >
                            <MenuItem value="">All Projects</MenuItem>
                            {projects.map((project) => (
                                <MenuItem key={project.projectId} value={project.siteName}>
                                    {project.siteName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            select
                            label="Client Type"
                            variant="outlined"
                            size="small"
                            value={filters.clientType}
                            onChange={(e) => handleFilterChange('clientType', e.target.value)}
                        >
                            <MenuItem value="">All Types</MenuItem>
                            <MenuItem value="Customer">Customer</MenuItem>
                            <MenuItem value="Associate">Associate</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    <CircularProgress />
                </Box>
            ) : plotBookings.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6">No plot bookings found</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Click on "Add Plot Booking" to create a new entry
                    </Typography>
                </Paper>
            ) : (
                <>
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', position: 'relative' }}>
                        {tableLoading && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    zIndex: 1
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        )}
                        <Table>
                            <TableHead sx={{ backgroundColor: '#DAE1F3' }}>
                                <TableRow>
                                    <TableCell>Booking Code</TableCell>
                                    <TableCell>Project</TableCell>
                                    <TableCell>Block</TableCell>
                                    <TableCell>Plot No</TableCell>
                                    <TableCell>Client Name</TableCell>
                                    <TableCell>Client Type</TableCell>
                                    <TableCell>Booking Date</TableCell>
                                    <TableCell>Total Plot Cost</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getFilteredAndPaginatedBookings().map((booking) => (
                                    <React.Fragment key={booking.plotsellingId}>
                                        <TableRow>
                                            <TableCell>{booking.bookingCode}</TableCell>
                                            <TableCell>{booking.projectName}</TableCell>
                                            <TableCell>{booking.blockName}</TableCell>
                                            <TableCell>{booking.plotNo}</TableCell>
                                            <TableCell>{booking.clientName}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={booking.clientType}
                                                    color={booking.clientType === "Customer" ? "primary" : "secondary"}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{booking.bookingDate}</TableCell>
                                            <TableCell>₹{booking.totalPlotCost.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewDetails(booking.plotsellingId)}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<PaymentIcon />}
                                                        onClick={() => handleShowReceipt(booking)}
                                                    >
                                                        Show Receipt
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell
                                                colSpan={9}
                                                sx={{
                                                    p: 0,
                                                    borderBottom: expandedRows[booking.plotsellingId] ? '1px solid #e0e0e0' : 'none'
                                                }}
                                            >
                                                <Collapse
                                                    in={expandedRows[booking.plotsellingId]}
                                                    timeout="auto"
                                                    unmountOnExit
                                                >
                                                    {renderBookingDetailsAccordion(booking)}
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <TablePagination
                        component="div"
                        count={filterBookings(plotBookings).length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                </>
            )}
        </Box>
    );
};

export default AllPlotBookings;