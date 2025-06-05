
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
    Divider ,
    CardContent ,
    Chip,
    DialogTitle,
    TextField,
    Grid,
    Card,
    InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Snackbar, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosInstance from '../../axiosInstance';


const PendingReports = () => {
    // State variables
    const [blocks, setBlocks] = useState([]);
    const [filteredBlocks, setFilteredBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [filterDate, setFilterDate] = useState('');
    const [filterBookingCode, setFilterBookingCode] = useState('');
    const [bookingData, setBookingData] = useState(null);


    const [projects, setProjects] = useState([]); // For project dropdown in form

    // Fetch blocks data
    useEffect(() => {
        fetchBlocks();
        fetchProjects(); // Fetch projects for dropdown
    }, []);

    const fetchBlocks = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/realEstate/emi/currentMonthPendingEMI');
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


    // Fetch projects for dropdown
    const fetchProjects = async () => {
        try {
            // Replace with your actual API endpoint
            const response = await axiosInstance.get('/realEstate/project/getAll');
            if (response.data.status === 202 && Array.isArray(response.data.data)) {
                setProjects(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    // Handle search input change
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredBlocks(blocks);
        } else {
            const lowercasedFilter = searchTerm.toLowerCase();
            const filtered = blocks.filter(item => {
                return (
                    item.block.toLowerCase().includes(lowercasedFilter) ||
                    item.projectName.toLowerCase().includes(lowercasedFilter)
                );
            });
            setFilteredBlocks(filtered);
        }
    }, [searchTerm, blocks]);


    const [expandedBooking, setExpandedBooking] = useState(null); // Track the expanded row
    const [bookingDetailsMap, setBookingDetailsMap] = useState({}); // Cache booking details

    const handleToggleDetails = async (bookingCode) => {
        if (expandedBooking === bookingCode) {
            setExpandedBooking(null);
        } else {
            // If not already fetched, then fetch
            if (!bookingDetailsMap[bookingCode]) {
                try {
                    const response = await axiosInstance.get(`/realEstate/plot-booking/getBookingPlotByBookingCode?bookingCode=${bookingCode}`);
                    if (response.data.status === 200) {
                        setBookingDetailsMap(prev => ({
                            ...prev,
                            [bookingCode]: response.data.data
                        }));
                    }
                } catch (error) {
                    console.error("Failed to fetch booking details:", error);
                }
            }
            setExpandedBooking(bookingCode);
        }
    };

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Close notification handler
    const handleCloseNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    useEffect(() => {
        let filtered = [...blocks];

        if (searchTerm.trim()) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.block.toLowerCase().includes(lowerSearch) ||
                item.projectName.toLowerCase().includes(lowerSearch)
            );
        }

        if (filterDate) {
            filtered = filtered.filter(item =>
                item.getEmiDate?.includes(filterDate)
            );
        }

        if (filterBookingCode.trim()) {
            filtered = filtered.filter(item =>
                item.bookingCode?.toLowerCase().includes(filterBookingCode.toLowerCase())
            );
        }

        setFilteredBlocks(filtered);
    }, [searchTerm, filterDate, filterBookingCode, blocks]);


    const handleEditBlock = async (block) => {
        try {
            const response = await axiosInstance.get(`/realEstate/plot-booking/getBookingPlotByBookingCode?bookingCode=${block.bookingCode}`);
            if (response.data.status === 200) {
                setBookingData(response.data.data); // store the data in state
                console.log("Fetched Booking Data:", response.data.data);
                setEditDialogOpen(true); // open the dialog to display info
            } else {
                console.error("Error fetching booking data:", response.data.message);
            }
        } catch (error) {
            console.error("API Error:", error);
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
                    Pending EMI
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
                            label="Filter by Booking Code"
                            value={filterBookingCode}
                            onChange={(e) => setFilterBookingCode(e.target.value)}
                        />
                    </Grid>
                </Grid>

            </Box>

            {/* Blocks Table */}
            <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#DAE1F3' }}>
                        <TableRow>

                            <TableCell sx={{ fontWeight: 600 }}>Booking Code</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Duration In Month</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Nnst Amount</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {filteredBlocks.map((block) => (
                                            <React.Fragment key={block.blockId || block.bookingCode}>
                                                <TableRow 
                                                    hover 
                                                    sx={{ 
                                                        '&:hover': { 
                                                            backgroundColor: '#f9faff',
                                                        },
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {block.bookingCode}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            size="small" 
                                                            label={`${block.durationInMonth} months`}
                                                            sx={{ 
                                                                backgroundColor: '#e3f2fd', 
                                                                color: '#1976d2',
                                                                fontWeight: 500
                                                            }} 
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, color: '#f57c00' }} />
                                                            <Typography variant="body2">
                                                                {block.getEmiDate}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600} color="#2e7d32">
                                                            ₹{Number(block.instAmount).toLocaleString()}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip title="View Details">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleToggleDetails(block.bookingCode)}
                                                                sx={{ 
                                                                    color: expandedBooking === block.bookingCode ? '#3f51b5' : '#9e9e9e',
                                                                    backgroundColor: expandedBooking === block.bookingCode ? '#e8eaf6' : 'transparent',
                                                                    '&:hover': {
                                                                        backgroundColor: '#e8eaf6',
                                                                        color: '#3f51b5'
                                                                    }
                                                                }}
                                                            >
                                                                <VisibilityIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Expanded Booking Details */}
                                                {expandedBooking === block.bookingCode && bookingDetailsMap[block.bookingCode] && (
                                                    <TableRow>
                                                        <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                                                            <Box sx={{ 
                                                                backgroundColor: '#f5f9ff', 
                                                                borderLeft: '4px solid #3f51b5',
                                                                borderRadius: '0 0 8px 8px',
                                                                m: 1,
                                                                mb: 2,
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                                            }}>
                                                                <Box sx={{ p: 2 }}>
                                                                    <Typography variant="subtitle1" fontWeight={600} color="#3f51b5" gutterBottom>
                                                                        Booking Details
                                                                    </Typography>
                                                                    
                                                                    <Grid container spacing={2}>
                                                                        <Grid item xs={12} md={6}>
                                                                            <Card variant="outlined" sx={{ height: '100%', backgroundColor: 'white' }}>
                                                                                <CardContent>
                                                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                                                        Buyer Information
                                                                                    </Typography>
                                                                                    <Divider sx={{ mb: 2 }} />
                                                                                    <Typography variant="body2" gutterBottom>
                                                                                        <strong>Name:</strong> {bookingDetailsMap[block.bookingCode].buyerName}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" gutterBottom>
                                                                                        <strong>Booking Date:</strong> {bookingDetailsMap[block.bookingCode].bookingDate || 'N/A'}
                                                                                    </Typography>
                                                                                    <Typography variant="body2">
                                                                                        <strong>Booking Code:</strong> {bookingDetailsMap[block.bookingCode].bookingCode}
                                                                                    </Typography>
                                                                                </CardContent>
                                                                            </Card>
                                                                        </Grid>
                                                                        
                                                                        <Grid item xs={12} md={6}>
                                                                            <Card variant="outlined" sx={{ height: '100%', backgroundColor: 'white' }}>
                                                                                <CardContent>
                                                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                                                        Property Details
                                                                                    </Typography>
                                                                                    <Divider sx={{ mb: 2 }} />
                                                                                    <Typography variant="body2" gutterBottom>
                                                                                        <strong>Project:</strong> {bookingDetailsMap[block.bookingCode].projectName}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" gutterBottom>
                                                                                        <strong>Block:</strong> {bookingDetailsMap[block.bookingCode].blockName}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" gutterBottom>
                                                                                        <strong>Plot No:</strong> {bookingDetailsMap[block.bookingCode].plotNo}
                                                                                    </Typography>
                                                                                    <Typography variant="body2">
                                                                                        <strong>Area:</strong> {bookingDetailsMap[block.bookingCode].ploatArea} sqft
                                                                                    </Typography>
                                                                                </CardContent>
                                                                            </Card>
                                                                        </Grid>
                                                                        
                                                                        <Grid item xs={12}>
                                                                            <Card variant="outlined" sx={{ backgroundColor: 'white' }}>
                                                                                <CardContent>
                                                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                                                        Financial Details
                                                                                    </Typography>
                                                                                    <Divider sx={{ mb: 2 }} />
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item xs={12} sm={6}>
                                                                                            <Box sx={{ display: 'flex', flexDirection: 'column', p: 1, borderRadius: 1, bgcolor: '#e8f5e9' }}>
                                                                                                <Typography variant="caption" color="text.secondary">Final Amount</Typography>
                                                                                                <Typography variant="h6" color="#2e7d32" fontWeight={600}>
                                                                                                    ₹{bookingDetailsMap[block.bookingCode].finalPaybleAmount.toLocaleString()}
                                                                                                </Typography>
                                                                                            </Box>
                                                                                        </Grid>
                                                                                        <Grid item xs={12} sm={6}>
                                                                                            <Box sx={{ display: 'flex', flexDirection: 'column', p: 1, borderRadius: 1, bgcolor: '#e3f2fd' }}>
                                                                                                <Typography variant="caption" color="text.secondary">Booking Amount</Typography>
                                                                                                <Typography variant="h6" color="#1976d2" fontWeight={600}>
                                                                                                    ₹{bookingDetailsMap[block.bookingCode].bookingAmount.toLocaleString()}
                                                                                                </Typography>
                                                                                            </Box>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </CardContent>
                                                                            </Card>
                                                                        </Grid>
                                                                        
                                                                        {bookingDetailsMap[block.bookingCode].remark && (
                                                                            <Grid item xs={12}>
                                                                                <Card variant="outlined" sx={{ backgroundColor: '#fffde7' }}>
                                                                                    <CardContent>
                                                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                                                            Remarks
                                                                                        </Typography>
                                                                                        <Typography variant="body2">
                                                                                            {bookingDetailsMap[block.bookingCode].remark}
                                                                                        </Typography>
                                                                                    </CardContent>
                                                                                </Card>
                                                                            </Grid>
                                                                        )}
                                                                    </Grid>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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

export default PendingReports































// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Typography,
//     IconButton,
//     Tooltip,
//     CircularProgress,
//     TextField,
//     Grid,
//     Card,
//     CardContent,
//     Chip,
//     Divider,
//     Container
// } from '@mui/material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import SearchIcon from '@mui/icons-material/Search';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import ReceiptIcon from '@mui/icons-material/Receipt';
// import axiosInstance from 'axiosInstance';
// import { Snackbar, Alert } from '@mui/material';
// import {
//     Accordion,
//     AccordionSummary,
//     AccordionDetails,
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// const PendingReports = () => {
//     // State variables
//     const [blocks, setBlocks] = useState([]);
//     const [filteredBlocks, setFilteredBlocks] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterDate, setFilterDate] = useState('');
//     const [filterBookingCode, setFilterBookingCode] = useState('');
//     const [bookingData, setBookingData] = useState(null);
//     const [projects, setProjects] = useState([]);
//     const [expandedBooking, setExpandedBooking] = useState(null);
//     const [bookingDetailsMap, setBookingDetailsMap] = useState({});

//     // Fetch blocks data
//     useEffect(() => {
//         fetchBlocks();
//         fetchProjects();
//     }, []);

//     const fetchBlocks = async () => {
//         setLoading(true);
//         try {
//             const response = await axiosInstance.get('/realEstate/emi/currentMonthPendingEMI');
//             if (response.data.status === 200 && Array.isArray(response.data.data)) {
//                 setBlocks(response.data.data);
//                 setFilteredBlocks(response.data.data);
//             } else {
//                 console.error('Invalid response format:', response.data);
//                 setBlocks([]);
//                 setFilteredBlocks([]);
//             }
//         } catch (error) {
//             console.error('Error fetching blocks:', error);
//             setBlocks([]);
//             setFilteredBlocks([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch projects for dropdown
//     const fetchProjects = async () => {
//         try {
//             const response = await axiosInstance.get('/realEstate/project/getAll');
//             if (response.data.status === 202 && Array.isArray(response.data.data)) {
//                 setProjects(response.data.data);
//             }
//         } catch (error) {
//             console.error('Error fetching projects:', error);
//         }
//     };

//     // Handle search input change
//     useEffect(() => {
//         let filtered = [...blocks];

//         if (searchTerm.trim()) {
//             const lowerSearch = searchTerm.toLowerCase();
//             filtered = filtered.filter(item =>
//                 item.block?.toLowerCase().includes(lowerSearch) ||
//                 item.projectName?.toLowerCase().includes(lowerSearch)
//             );
//         }

//         if (filterDate) {
//             filtered = filtered.filter(item =>
//                 item.getEmiDate?.includes(filterDate)
//             );
//         }

//         if (filterBookingCode.trim()) {
//             filtered = filtered.filter(item =>
//                 item.bookingCode?.toLowerCase().includes(filterBookingCode.toLowerCase())
//             );
//         }

//         setFilteredBlocks(filtered);
//     }, [searchTerm, filterDate, filterBookingCode, blocks]);

//     const handleToggleDetails = async (bookingCode) => {
//         if (expandedBooking === bookingCode) {
//             setExpandedBooking(null);
//         } else {
//             // If not already fetched, then fetch
//             if (!bookingDetailsMap[bookingCode]) {
//                 try {
//                     const response = await axiosInstance.get(`/realEstate/plot-booking/getBookingPlotByBookingCode?bookingCode=${bookingCode}`);
//                     if (response.data.status === 200) {
//                         setBookingDetailsMap(prev => ({
//                             ...prev,
//                             [bookingCode]: response.data.data
//                         }));
//                     }
//                 } catch (error) {
//                     console.error("Failed to fetch booking details:", error);
//                 }
//             }
//             setExpandedBooking(bookingCode);
//         }
//     };

//     const [notification, setNotification] = useState({
//         open: false,
//         message: '',
//         severity: 'success'
//     });

//     // Close notification handler
//     const handleCloseNotification = () => {
//         setNotification(prev => ({
//             ...prev,
//             open: false
//         }));
//     };

//     return (
//         <Container maxWidth="xl">
//             <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
//                 <Box 
//                     sx={{ 
//                         p: 3, 
//                         background: 'linear-gradient(90deg, #3949AB 0%, #1E88E5 100%)',
//                         color: 'white'
//                     }}
//                 >
//                     <Typography variant="h5" component="h1" fontWeight="600">
//                         Pending EMI Dashboard
//                     </Typography>
//                     <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
//                         Track and manage all due EMI payments
//                     </Typography>
//                 </Box>

//                 <CardContent>
//                     <Grid container spacing={3} sx={{ mb: 3 }}>
//                         <Grid item xs={12} sm={4}>
//                             <TextField
//                                 fullWidth
//                                 placeholder="Search by project or block..."
//                                 variant="outlined"
//                                 size="small"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 InputProps={{
//                                     startAdornment: (
//                                         <SearchIcon color="action" sx={{ mr: 1 }} />
//                                     ),
//                                 }}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={4}>
//                             <TextField
//                                 type="date"
//                                 size="small"
//                                 fullWidth
//                                 variant="outlined"
//                                 label="Filter by Date"
//                                 InputLabelProps={{ shrink: true }}
//                                 value={filterDate}
//                                 onChange={(e) => setFilterDate(e.target.value)}
//                                 InputProps={{
//                                     startAdornment: (
//                                         <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
//                                     ),
//                                 }}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={4}>
//                             <TextField
//                                 size="small"
//                                 fullWidth
//                                 variant="outlined"
//                                 label="Filter by Booking Code"
//                                 value={filterBookingCode}
//                                 onChange={(e) => setFilterBookingCode(e.target.value)}
//                                 InputProps={{
//                                     startAdornment: (
//                                         <ReceiptIcon color="action" sx={{ mr: 1 }} />
//                                     ),
//                                 }}
//                             />
//                         </Grid>
//                     </Grid>

//                     {loading ? (
//                         <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
//                             <CircularProgress />
//                         </Box>
//                     ) : filteredBlocks.length === 0 ? (
//                         <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
//                             <Typography variant="body1" color="text.secondary">No pending EMIs found</Typography>
//                         </Box>
//                     ) : (
//                         <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
//                             <TableContainer>
//                                 <Table sx={{ minWidth: 650 }}>
//                                     <TableHead sx={{ backgroundColor: '#f5f7ff' }}>
//                                         <TableRow>
//                                             <TableCell sx={{ fontWeight: 600, color: '#3f51b5' }}>Booking Code</TableCell>
//                                             <TableCell sx={{ fontWeight: 600, color: '#3f51b5' }}>Duration (Months)</TableCell>
//                                             <TableCell sx={{ fontWeight: 600, color: '#3f51b5' }}>Due Date</TableCell>
//                                             <TableCell sx={{ fontWeight: 600, color: '#3f51b5' }}>Amount (₹)</TableCell>
//                                             <TableCell sx={{ fontWeight: 600, color: '#3f51b5' }}>Actions</TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {filteredBlocks.map((block) => (
//                                             <React.Fragment key={block.blockId || block.bookingCode}>
//                                                 <TableRow 
//                                                     hover 
//                                                     sx={{ 
//                                                         '&:hover': { 
//                                                             backgroundColor: '#f9faff',
//                                                         },
//                                                         cursor: 'pointer',
//                                                     }}
//                                                 >
//                                                     <TableCell>
//                                                         <Typography variant="body2" fontWeight={500}>
//                                                             {block.bookingCode}
//                                                         </Typography>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Chip 
//                                                             size="small" 
//                                                             label={`${block.durationInMonth} months`}
//                                                             sx={{ 
//                                                                 backgroundColor: '#e3f2fd', 
//                                                                 color: '#1976d2',
//                                                                 fontWeight: 500
//                                                             }} 
//                                                         />
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                                             <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, color: '#f57c00' }} />
//                                                             <Typography variant="body2">
//                                                                 {block.getEmiDate}
//                                                             </Typography>
//                                                         </Box>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Typography variant="body2" fontWeight={600} color="#2e7d32">
//                                                             ₹{Number(block.instAmount).toLocaleString()}
//                                                         </Typography>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Tooltip title="View Details">
//                                                             <IconButton
//                                                                 size="small"
//                                                                 onClick={() => handleToggleDetails(block.bookingCode)}
//                                                                 sx={{ 
//                                                                     color: expandedBooking === block.bookingCode ? '#3f51b5' : '#9e9e9e',
//                                                                     backgroundColor: expandedBooking === block.bookingCode ? '#e8eaf6' : 'transparent',
//                                                                     '&:hover': {
//                                                                         backgroundColor: '#e8eaf6',
//                                                                         color: '#3f51b5'
//                                                                     }
//                                                                 }}
//                                                             >
//                                                                 <VisibilityIcon fontSize="small" />
//                                                             </IconButton>
//                                                         </Tooltip>
//                                                     </TableCell>
//                                                 </TableRow>

//                                                 {/* Expanded Booking Details */}
//                                                 {expandedBooking === block.bookingCode && bookingDetailsMap[block.bookingCode] && (
//                                                     <TableRow>
//                                                         <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
//                                                             <Box sx={{ 
//                                                                 backgroundColor: '#f5f9ff', 
//                                                                 borderLeft: '4px solid #3f51b5',
//                                                                 borderRadius: '0 0 8px 8px',
//                                                                 m: 1,
//                                                                 mb: 2,
//                                                                 boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
//                                                             }}>
//                                                                 <Box sx={{ p: 2 }}>
//                                                                     <Typography variant="subtitle1" fontWeight={600} color="#3f51b5" gutterBottom>
//                                                                         Booking Details
//                                                                     </Typography>
                                                                    
//                                                                     <Grid container spacing={2}>
//                                                                         <Grid item xs={12} md={6}>
//                                                                             <Card variant="outlined" sx={{ height: '100%', backgroundColor: 'white' }}>
//                                                                                 <CardContent>
//                                                                                     <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                                                                                         Buyer Information
//                                                                                     </Typography>
//                                                                                     <Divider sx={{ mb: 2 }} />
//                                                                                     <Typography variant="body2" gutterBottom>
//                                                                                         <strong>Name:</strong> {bookingDetailsMap[block.bookingCode].buyerName}
//                                                                                     </Typography>
//                                                                                     <Typography variant="body2" gutterBottom>
//                                                                                         <strong>Booking Date:</strong> {bookingDetailsMap[block.bookingCode].bookingDate || 'N/A'}
//                                                                                     </Typography>
//                                                                                     <Typography variant="body2">
//                                                                                         <strong>Booking Code:</strong> {bookingDetailsMap[block.bookingCode].bookingCode}
//                                                                                     </Typography>
//                                                                                 </CardContent>
//                                                                             </Card>
//                                                                         </Grid>
                                                                        
//                                                                         <Grid item xs={12} md={6}>
//                                                                             <Card variant="outlined" sx={{ height: '100%', backgroundColor: 'white' }}>
//                                                                                 <CardContent>
//                                                                                     <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                                                                                         Property Details
//                                                                                     </Typography>
//                                                                                     <Divider sx={{ mb: 2 }} />
//                                                                                     <Typography variant="body2" gutterBottom>
//                                                                                         <strong>Project:</strong> {bookingDetailsMap[block.bookingCode].projectName}
//                                                                                     </Typography>
//                                                                                     <Typography variant="body2" gutterBottom>
//                                                                                         <strong>Block:</strong> {bookingDetailsMap[block.bookingCode].blockName}
//                                                                                     </Typography>
//                                                                                     <Typography variant="body2" gutterBottom>
//                                                                                         <strong>Plot No:</strong> {bookingDetailsMap[block.bookingCode].plotNo}
//                                                                                     </Typography>
//                                                                                     <Typography variant="body2">
//                                                                                         <strong>Area:</strong> {bookingDetailsMap[block.bookingCode].ploatArea} sqft
//                                                                                     </Typography>
//                                                                                 </CardContent>
//                                                                             </Card>
//                                                                         </Grid>
                                                                        
//                                                                         <Grid item xs={12}>
//                                                                             <Card variant="outlined" sx={{ backgroundColor: 'white' }}>
//                                                                                 <CardContent>
//                                                                                     <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                                                                                         Financial Details
//                                                                                     </Typography>
//                                                                                     <Divider sx={{ mb: 2 }} />
//                                                                                     <Grid container spacing={2}>
//                                                                                         <Grid item xs={12} sm={6}>
//                                                                                             <Box sx={{ display: 'flex', flexDirection: 'column', p: 1, borderRadius: 1, bgcolor: '#e8f5e9' }}>
//                                                                                                 <Typography variant="caption" color="text.secondary">Final Amount</Typography>
//                                                                                                 <Typography variant="h6" color="#2e7d32" fontWeight={600}>
//                                                                                                     ₹{bookingDetailsMap[block.bookingCode].finalPaybleAmount.toLocaleString()}
//                                                                                                 </Typography>
//                                                                                             </Box>
//                                                                                         </Grid>
//                                                                                         <Grid item xs={12} sm={6}>
//                                                                                             <Box sx={{ display: 'flex', flexDirection: 'column', p: 1, borderRadius: 1, bgcolor: '#e3f2fd' }}>
//                                                                                                 <Typography variant="caption" color="text.secondary">Booking Amount</Typography>
//                                                                                                 <Typography variant="h6" color="#1976d2" fontWeight={600}>
//                                                                                                     ₹{bookingDetailsMap[block.bookingCode].bookingAmount.toLocaleString()}
//                                                                                                 </Typography>
//                                                                                             </Box>
//                                                                                         </Grid>
//                                                                                     </Grid>
//                                                                                 </CardContent>
//                                                                             </Card>
//                                                                         </Grid>
                                                                        
//                                                                         {bookingDetailsMap[block.bookingCode].remark && (
//                                                                             <Grid item xs={12}>
//                                                                                 <Card variant="outlined" sx={{ backgroundColor: '#fffde7' }}>
//                                                                                     <CardContent>
//                                                                                         <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                                                                                             Remarks
//                                                                                         </Typography>
//                                                                                         <Typography variant="body2">
//                                                                                             {bookingDetailsMap[block.bookingCode].remark}
//                                                                                         </Typography>
//                                                                                     </CardContent>
//                                                                                 </Card>
//                                                                             </Grid>
//                                                                         )}
//                                                                     </Grid>
//                                                                 </Box>
//                                                             </Box>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 )}
//                                             </React.Fragment>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                         </Paper>
//                     )}
//                 </CardContent>
//             </Card>

//             <Snackbar
//                 open={notification.open}
//                 autoHideDuration={6000}
//                 onClose={handleCloseNotification}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//             >
//                 <Alert
//                     onClose={handleCloseNotification}
//                     severity={notification.severity}
//                     variant="filled"
//                     sx={{ width: '100%' }}
//                 >
//                     {notification.message}
//                 </Alert>
//             </Snackbar>
//         </Container>
//     );
// };

// export default PendingReports;