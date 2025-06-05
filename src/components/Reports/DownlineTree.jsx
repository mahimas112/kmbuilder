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
    TextField,
    Grid,
    Card,
    CardContent,
    Divider,
    Collapse,
    Chip
} from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import axiosInstance from '../../axiosInstance';

const DownlineTree = () => {
    // State variables
    const [blocks, setBlocks] = useState([]);
    const [filteredBlocks, setFilteredBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterBookingCode, setFilterBookingCode] = useState('');
    const [projects, setProjects] = useState([]);
    
    // New state for downline data
    const [expandedAssociate, setExpandedAssociate] = useState(null);
    const [downlineData, setDownlineData] = useState(null);
    const [loadingDownline, setLoadingDownline] = useState(false);

    // Notification state
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Fetch blocks data
    useEffect(() => {
        fetchBlocks();
        fetchProjects();
    }, []);

    const fetchBlocks = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/realEstate/associate/getAll');
            if (response.data.status === 200 && Array.isArray(response.data.data)) {
                setBlocks(response.data.data);
                setFilteredBlocks(response.data.data);
            } else {
                console.error('Invalid response format:', response.data);
                setBlocks([]);
                setFilteredBlocks([]);
            }
        } catch (error) {
            console.error('Error fetching blocks:', error);
            setBlocks([]);
            setFilteredBlocks([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axiosInstance.get('/realEstate/project/getAll');
            if (response.data.status === 202 && Array.isArray(response.data.data)) {
                setProjects(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    // Handle filters
    useEffect(() => {
        let filtered = [...blocks];

        if (searchTerm.trim()) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.block?.toLowerCase().includes(lowerSearch) ||
                item.associateReperCode?.toLowerCase().includes(lowerSearch)
            );
        }

        if (filterDate) {
            filtered = filtered.filter(item =>
                item.joiningDate?.includes(filterDate)
            );
        }

        if (filterBookingCode.trim()) {
            filtered = filtered.filter(item =>
                item.associateReperCode?.toLowerCase().includes(filterBookingCode.toLowerCase())
            );
        }

        setFilteredBlocks(filtered);
    }, [searchTerm, filterDate, filterBookingCode, blocks]);

    // Close notification handler
    const handleCloseNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    // Fetch downline data when eye icon is clicked
    const fetchDownlineData = async (associateCode) => {
        if (expandedAssociate === associateCode) {
            setExpandedAssociate(null);
            return;
        }

        setLoadingDownline(true);
        try {
            const response = await axiosInstance.get(`/realEstate/associate/getAll-downLine-associate-byAssociateCode?associateCode=${associateCode}`);
            if (response.data.status === 200) {
                setDownlineData(response.data.data);
                setExpandedAssociate(associateCode);
            } else {
                setNotification({
                    open: true,
                    message: 'Failed to fetch downline data',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Error fetching downline data:', error);
            setNotification({
                open: true,
                message: 'Error fetching downline data',
                severity: 'error'
            });
        } finally {
            setLoadingDownline(false);
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
                    Downline Tree
                </Typography>

                <Grid container spacing={2} sx={{ maxWidth: { sm: '60%' } }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            type="date"
                            size="small"
                            fullWidth
                            label="Filter by Date"
                            InputLabelProps={{ shrink: true }}
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            size="small"
                            fullWidth
                            label="Filter by Associate Id"
                            value={filterBookingCode}
                            onChange={(e) => setFilterBookingCode(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Blocks Table */}
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#DAE1F3' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Associate ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Mobile</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Joining Date</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBlocks.map((block) => (
                            <TableRow key={block.associateId || block.blockId}>
                                <TableCell sx={{ fontWeight: 500 }}>{block.associateReperCode}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{block.name}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{block.rankName}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{block.mobile}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{block.emailId}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{block.joiningDate}</TableCell>
                                <TableCell>
                                    <Tooltip title="View Downline Details">
                                        <IconButton
                                            size="small"
                                            sx={{ color: '#6B66FF' }}
                                            onClick={() => fetchDownlineData(block.associateReperCode)}
                                        >
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && filteredBlocks.length === 0 && (
                <Box sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="body1">No data found</Typography>
                </Box>
            )}

            {/* Expanded Downline Data Section */}
            {expandedAssociate && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Downline Details for Associate: {expandedAssociate}
                        </Typography>
                    </Box>
                    
                    {loadingDownline ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : downlineData ? (
                        <Box>
                            {/* Customer Cards */}
                            

                            {/* Associate Cards */}
                            {downlineData.Associate && downlineData.Associate.length > 0 && (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            Associates ({downlineData.Associate.length})
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        {downlineData.Associate.map((associate) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={associate.associateId}>
                                                <Card variant="outlined" sx={{ height: '100%' }}>
                                                    <CardContent sx={{ p: 2 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                                {associate.name}
                                                            </Typography>
                                                            <Chip 
                                                                label={associate.rankName} 
                                                                size="small" 
                                                                color="primary" 
                                                                sx={{ fontSize: '0.7rem', height: '20px' }}
                                                            />
                                                        </Box>
                                                        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                                                            ID: {associate.associateReperCode}
                                                        </Typography>
                                                        <Divider sx={{ my: 1 }} />
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, fontSize: '0.875rem' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <PhoneIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', color: 'text.secondary' }} />
                                                                <Typography variant="body2" noWrap>{associate.mobile}</Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <EmailIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', color: 'text.secondary' }} />
                                                                <Typography variant="body2" noWrap>{associate.emailId}</Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <EventIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', color: 'text.secondary' }} />
                                                                <Typography variant="body2">{associate.joiningDate}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                            {downlineData.Customer && downlineData.Customer.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            Customers ({downlineData.Customer.length})
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        {downlineData.Customer.map((customer) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={customer.customerId}>
                                                <Card variant="outlined" sx={{ height: '100%' }}>
                                                    <CardContent sx={{ p: 2 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                            {customer.customerName}
                                                        </Typography>
                                                        <Divider sx={{ my: 1 }} />
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, fontSize: '0.875rem' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <PhoneIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', color: 'text.secondary' }} />
                                                                <Typography variant="body2" noWrap>{customer.mobileNo}</Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <EmailIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', color: 'text.secondary' }} />
                                                                <Typography variant="body2" noWrap>{customer.emailId}</Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                                <LocationOnIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', mt: 0.3, color: 'text.secondary' }} />
                                                                <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                                    {customer.city}, {customer.state}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            {/* No data message */}
                            {(!downlineData.Customer || downlineData.Customer.length === 0) && 
                             (!downlineData.Associate || downlineData.Associate.length === 0) && (
                                <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                                    No downline data found for this associate
                                </Typography>
                            )}
                        </Box>
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                            Failed to load downline data
                        </Typography>
                    )}
                </Paper>
            )}

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

export default DownlineTree;