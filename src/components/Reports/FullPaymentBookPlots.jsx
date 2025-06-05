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
    Grid,
    InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Snackbar, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosInstance from '../../axiosInstance';


const FullPaymentBookPlots = () => {
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
            const response = await axiosInstance.get('/realEstate/plot-booking/getAllFullPayment');
            if (response.data.status === 200 && Array.isArray(response.data.data)) {
                const emiPlanData = response.data.data
                setBlocks(emiPlanData);
                setFilteredBlocks(emiPlanData);
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
                item.bookingDate?.includes(filterDate)
            );
        }

        if (filterBookingCode.trim()) {
            filtered = filtered.filter(item =>
                item.buyerName?.toLowerCase().includes(filterBookingCode.toLowerCase())
            );
        }

        setFilteredBlocks(filtered);
    }, [searchTerm, filterDate, filterBookingCode, blocks]);






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
                    Full Plot Booking
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
                            label="Filter by Client Name"
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
                            <TableCell sx={{ fontWeight: 600 }}>Project Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Block</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Plot No.</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Client Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Amtount</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBlocks.map((block) => (
                            <React.Fragment key={block.blockId}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 500 }}>{block.bookingCode}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{block.projectName}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{block.blockName}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{block.plotNo}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{block.buyerName}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{block.finalPaybleAmount}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{block.bookingDate}</TableCell>


                                </TableRow>
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


export default FullPaymentBookPlots