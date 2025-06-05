import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Chip,
    Alert,
    Snackbar,
    IconButton,
    InputAdornment,
    FormHelperText,
    Card,
    CardContent,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Search as SearchIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Payment as PaymentIcon,
    CalendarToday as CalendarTodayIcon,
    AccountBalance as AccountBalanceIcon,
    CreditCard as CreditCardIcon,
    Comment as CommentIcon,
    Save as SaveIcon,
    Close as CloseIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axiosInstance from '../../axiosInstance';

// TabPanel component for tab content
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`cheque-clearance-tabpanel-${index}`}
            aria-labelledby={`cheque-clearance-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const ChequeClearance = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    // Tab state
    const [tabValue, setTabValue] = useState(0);

    // Data states
    const [fullPayments, setFullPayments] = useState([]);
    const [emiPayments, setEmiPayments] = useState([]);
    const [filteredFullPayments, setFilteredFullPayments] = useState([]);
    const [filteredEmiPayments, setFilteredEmiPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [clearedCheques, setClearedCheques] = useState([]);

    // UI states
    const [loading, setLoading] = useState(false);
    const [fullPaymentsLoading, setFullPaymentsLoading] = useState(false);
    const [emiPaymentsLoading, setEmiPaymentsLoading] = useState(false);
    const [clearedChequesLoading, setClearedChequesLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form data state
    const [formData, setFormData] = useState({
        chequeClearanceId: '',
        reciptNo: '',
        projectName: '',
        blockNo: '',
        plotNo: '',
        bookingCode: '',
        chequeDdNeftNo: '',
        amount: 0,
        accountNumber: '',
        bankName: '',
        branchName: '',
        chequeStatus: 'clear',
        updateDate: format(new Date(), 'yyyy-MM-dd'),
        remarks: ''
    });

    // Notification state
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Validation errors
    const [errors, setErrors] = useState({});

    // Create axiosInstance instance with interceptors for consistent error handling
    const api = axiosInstance.create({
        baseURL: '/realEstate'
    });

    // Add response interceptor for error handling
    api.interceptors.response.use(
        response => response,
        error => {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'An unexpected error occurred';
            console.error('API Error:', errorMessage, error);
            return Promise.reject(errorMessage);
        }
    );

    // Fetch data when component mounts
    useEffect(() => {
        fetchFullPayments();
        fetchEmiPayments();
        fetchClearedCheques();
    }, []);

    // Filter payments based on search term
    useEffect(() => {
        if (searchTerm.trim()) {
          const lowercasedSearch = searchTerm.toLowerCase();
          
          // Special case for status filtering
          if (lowercasedSearch === 'cleared' || lowercasedSearch === 'clear') {
            // सभी क्लियर्ड चेक्स (EMI और फुल पेमेंट्स) के लिए फिल्टर
            const clearedFullPayments = fullPayments.filter(payment => isPaymentCleared(payment));
            setFilteredFullPayments(clearedFullPayments);
            
            const clearedEmiPayments = emiPayments.filter(payment => isPaymentCleared(payment));
            setFilteredEmiPayments(clearedEmiPayments);
            return;
          }
          
          if (lowercasedSearch === 'pending') {
            const pendingFullPayments = fullPayments.filter(payment => !isPaymentCleared(payment) && !isChequeBouncedPayment(payment));
            setFilteredFullPayments(pendingFullPayments);
            
            const pendingEmiPayments = emiPayments.filter(payment => !isPaymentCleared(payment) && !isChequeBouncedPayment(payment));
            setFilteredEmiPayments(pendingEmiPayments);
            return;
          }
      
          if (lowercasedSearch === 'bounced' || lowercasedSearch === 'bounce') {
            const bouncedFullPayments = fullPayments.filter(payment => isChequeBouncedPayment(payment));
            setFilteredFullPayments(bouncedFullPayments);
            
            const bouncedEmiPayments = emiPayments.filter(payment => isChequeBouncedPayment(payment));
            setFilteredEmiPayments(bouncedEmiPayments);
            return;
          }
          
          const filteredFull = fullPayments.filter(payment => 
            payment.projectName?.toLowerCase().includes(lowercasedSearch) ||
            payment.plotNo?.toLowerCase().includes(lowercasedSearch) ||
            payment.customerName?.toLowerCase().includes(lowercasedSearch) ||
            payment.bookingCode?.toLowerCase().includes(lowercasedSearch) ||
            payment.reciptNo?.toLowerCase().includes(lowercasedSearch) ||
            payment.chequeNo?.toLowerCase().includes(lowercasedSearch)
          );
          setFilteredFullPayments(filteredFull);
          
          const filteredEmi = emiPayments.filter(payment => 
            payment.projectName?.toLowerCase().includes(lowercasedSearch) ||
            payment.plotNo?.toLowerCase().includes(lowercasedSearch) ||
            payment.customerName?.toLowerCase().includes(lowercasedSearch) ||
            payment.bookingCode?.toLowerCase().includes(lowercasedSearch) ||
            (payment.receiptNo?.toLowerCase().includes(lowercasedSearch) || payment.reciptNo?.toLowerCase().includes(lowercasedSearch)) ||
            payment.chequeNo?.toLowerCase().includes(lowercasedSearch)
          );
          setFilteredEmiPayments(filteredEmi);
        } else {
          setFilteredFullPayments(fullPayments);
          setFilteredEmiPayments(emiPayments);
        }
      }, [searchTerm, fullPayments, emiPayments, clearedCheques]);
    // Check if a payment's cheque has been cleared
    const isPaymentCleared = (payment) => {
        if (!payment) return false;

        // रिसीप्ट नंबर चेक करें, EMI और फुल पेमेंट दोनों के लिए
        const receiptNo = payment.reciptNo || payment.receiptNo;
        if (!receiptNo) return false;

        return clearedCheques.some(cleared =>
            (cleared.reciptNo === receiptNo) &&
            cleared.chequeStatus &&
            cleared.chequeStatus.toLowerCase() === 'clear'
        );
    };


    // Check if a payment's cheque has been bounced
    const isChequeBouncedPayment = (payment) => {
        if (!payment) return false;

        const receiptNo = payment.reciptNo || payment.receiptNo;
        if (!receiptNo) return false;

        return clearedCheques.some(cleared =>
            (cleared.reciptNo === receiptNo) &&
            cleared.chequeStatus &&
            cleared.chequeStatus.toLowerCase() === 'bounce'
        );
    };



    // Get cheque status for a payment
    const getChequeStatus = (payment) => {
        if (!payment) return 'pending';

        const receiptNo = payment.reciptNo || payment.receiptNo;
        if (!receiptNo) return 'pending';

        const matchingCheque = clearedCheques.find(cleared =>
            cleared.reciptNo === receiptNo
        );

        if (matchingCheque && matchingCheque.chequeStatus) {
            return matchingCheque.chequeStatus.toLowerCase();
        }

        return 'pending';
    };

    // Fetch cleared cheques
    const fetchClearedCheques = async () => {
        try {
            setClearedChequesLoading(true);
            const response = await axiosInstance.get('/cheque-clearance/getAll-cheques-payment');

            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setClearedCheques(response.data.data);
            } else {
                setClearedCheques([]);
            }
        } catch (error) {
            console.error('Error fetching cleared cheques:', error);
            setClearedCheques([]);
        } finally {
            setClearedChequesLoading(false);
        }
    };

    // Fetch full payments
    const fetchFullPayments = async () => {
        try {
            setFullPaymentsLoading(true);
            const response = await api.get('/fullPayment/all');

            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                // Filter only payments with Cheque or DD payment mode
                const chequePayments = response.data.data.filter(payment =>
                    (payment.payMode === 'Cheque' || payment.payMode === 'DD')
                );

                setFullPayments(chequePayments);
                setFilteredFullPayments(chequePayments);
            } else {
                throw new Error('Invalid response format for full payments');
            }
        } catch (error) {
            console.error('Error fetching full payments:', error);
            setNotification({
                open: true,
                message: `Failed to fetch full payments: ${error}`,
                severity: 'error'
            });
        } finally {
            setFullPaymentsLoading(false);
        }
    };

    // Fetch EMI payments 
    const fetchEmiPayments = async () => {
        try {
            setEmiPaymentsLoading(true);
            const response = await api.get('/emiPayments/getAll');

            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                // Filter only payments with Cheque or DD payment mode
                const chequePayments = response.data.data.filter(payment =>
                    (payment.payMode === 'Cheque' || payment.payMode === 'DD')
                );

                setEmiPayments(chequePayments);
                setFilteredEmiPayments(chequePayments);
            } else {
                setEmiPayments([]);
                setFilteredEmiPayments([]);
            }
        } catch (error) {
            console.error('Error fetching EMI payments:', error);
            setEmiPayments([]);
            setFilteredEmiPayments([]);
        } finally {
            setEmiPaymentsLoading(false);
        }
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setSearchTerm('');
        setSelectedPayment(null);
    };

    // Handle opening dialog for payment clearance
    const handleOpenClearanceDialog = (payment) => {
        setSelectedPayment(payment);
        
        // Get receipt number based on payment type (EMI or Full Payment)
        const receiptNo = payment.reciptNo || payment.receiptNo || '';
        
        // Prepare form data based on the selected payment
        setFormData({
          chequeClearanceId: '', // Will be generated by the backend
          reciptNo: receiptNo, // Use the receipt number we extracted
          projectName: payment.projectName || '',
          blockNo: payment.blockNo || '',
          plotNo: payment.plotNo || '',
          bookingCode: payment.bookingCode || '',
          chequeDdNeftNo: payment.chequeNo || '',
          amount: payment.paidAmount || 0,
          accountNumber: payment.accountNumber || '',
          bankName: payment.bankName || '',
          branchName: payment.branchName || '',
          chequeStatus: 'clear', // Default to clear
          updateDate: format(new Date(), 'yyyy-MM-dd'),
          remarks: ''
        });
        
        setOpenDialog(true);
      };

    // Handle dialog close
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPayment(null);
        setErrors({});
    };

    // Handle form field changes
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

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Required fields
        if (!formData.chequeStatus) {
            newErrors.chequeStatus = 'Status is required';
            isValid = false;
        }

        // If status is "bounce", remarks are required
        if (formData.chequeStatus === 'bounce' && !formData.remarks.trim()) {
            newErrors.remarks = 'Remarks are required for bounced cheques';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
          return;
        }
        
        setSubmitting(true);
        
        try {
          let endpoint = '/cheque-clearance/save-cheque-clearance-FullPayments';
          
          if (tabValue === 1) {
            // EMI payment clearance endpoint
            endpoint = '/cheque-clearance/save-cheque-clearance-EmiPayments';
          }
          
          const response = await api.post(endpoint, formData);
          
          if (response.data && (response.data.status === 200 || response.data.status === 201)) {
            setNotification({
              open: true,
              message: 'Cheque clearance updated successfully',
              severity: 'success'
            });
            
            // Refresh the payments list and cleared cheques
            await fetchClearedCheques();
            
            // EMI और फुल पेमेंट्स दोनों को रिफ्रेश करें
            await fetchFullPayments();
            await fetchEmiPayments();
            
            handleCloseDialog();
          } else {
            throw new Error(response.data?.message || 'Failed to update cheque clearance');
          }
        } catch (error) {
          setNotification({
            open: true,
            message: `Failed to update cheque clearance: ${error}`,
            severity: 'error'
          });
        } finally {
          setSubmitting(false);
        }
      };
      

    // Handle notification close
    const handleCloseNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    // Render cheque status chip
    const renderStatusChip = (payment) => {
        const status = getChequeStatus(payment);

        switch (status) {
            case 'clear':
                return (
                    <Chip
                        label="Cleared"
                        color="success"
                        size="small"
                        variant="filled"
                        sx={{ minWidth: 80 }}
                    />
                );
            case 'bounce':
                return (
                    <Chip
                        label="Bounced"
                        color="error"
                        size="small"
                        variant="filled"
                        sx={{ minWidth: 80 }}
                    />
                );
            default:
                return (
                    <Chip
                        label="Pending"
                        color="warning"
                        size="small"
                        variant="outlined"
                        sx={{ minWidth: 80 }}
                    />
                );
        }
    };

    // Render the payment table
    const renderPaymentTable = (payments, loading) => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (payments.length === 0) {
            return (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No cheque payments found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        There are no cheque or DD payments to display.
                    </Typography>
                </Paper>
            );
        }



        return (
            <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Receipt No</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Plot</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Cheque No</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Bank</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => {
                            const status = getChequeStatus(payment);
                            const isProcessed = status === 'clear' || status === 'bounce';

                            return (
                                <TableRow key={payment.fullPaymentId || payment.emiPaymentId} hover>
                                    <TableCell>{payment.reciptNo || payment.receiptNo}</TableCell>
                                    <TableCell>{payment.projectName}</TableCell>
                                    <TableCell>{payment.plotNo}</TableCell>
                                    <TableCell>{payment.customerName}</TableCell>
                                    <TableCell>{payment.chequeNo}</TableCell>
                                    <TableCell>{payment.bankName}</TableCell>
                                    <TableCell>₹{parseFloat(payment.paidAmount).toLocaleString()}</TableCell>
                                    <TableCell>{renderStatusChip(payment)}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleOpenClearanceDialog(payment)}
                                            disabled={isProcessed}
                                            sx={{
                                                backgroundColor: isProcessed ? '#e0e0e0' : '#6B66FF',
                                                '&:hover': { backgroundColor: isProcessed ? '#e0e0e0' : '#5652e5' },
                                                color: isProcessed ? '#757575' : 'white'
                                            }}
                                        >
                                            {status === 'clear' ? 'Cleared' :
                                                status === 'bounce' ? 'Bounced' :
                                                    'Update Status'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    // Render mobile view for payment list
    const renderMobilePaymentList = (payments, loading) => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (payments.length === 0) {
            return (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No cheque payments found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        There are no cheque or DD payments to display.
                    </Typography>
                </Paper>
            );
        }

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {payments.map((payment) => {
                    const status = getChequeStatus(payment);
                    const isProcessed = status === 'clear' || status === 'bounce';

                    return (
                        <Card key={payment.fullPaymentId || payment.emiPaymentId} sx={{ borderRadius: 2, boxShadow: 1 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        {payment.reciptNo || payment.receiptNo}
                                    </Typography>
                                    {renderStatusChip(payment)}
                                </Box>

                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Amount</Typography>
                                        <Typography variant="body1" fontWeight="bold">₹{parseFloat(payment.paidAmount).toLocaleString()}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Cheque No</Typography>
                                        <Typography variant="body1">{payment.chequeNo}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Project</Typography>
                                        <Typography variant="body1">{payment.projectName}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Plot</Typography>
                                        <Typography variant="body1">{payment.plotNo}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Bank</Typography>
                                        <Typography variant="body1">{payment.bankName}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Customer</Typography>
                                        <Typography variant="body1">{payment.customerName}</Typography>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenClearanceDialog(payment)}
                                        disabled={isProcessed}
                                        sx={{
                                            backgroundColor: isProcessed ? '#e0e0e0' : '#6B66FF',
                                            '&:hover': { backgroundColor: isProcessed ? '#e0e0e0' : '#5652e5' },
                                            color: isProcessed ? '#757575' : 'white'
                                        }}
                                    >
                                        {status === 'clear' ? 'Cleared' :
                                            status === 'bounce' ? 'Bounced' :
                                                'Update Status'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>
        );
    };

    return (
        <Box sx={{ width: '100%', mb: 4 }}>
            <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                    Cheque Clearance Management
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Update the status of pending cheques for full payment and EMI installments.
                </Typography>

                {/* Tab navigation */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="cheque clearance tabs"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                minWidth: 0,
                                px: { xs: 2, sm: 3 }
                            },
                            '& .Mui-selected': {
                                color: '#6B66FF',
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#6B66FF',
                            }
                        }}
                    >
                        <Tab label="One-Time Payment Cheques" id="tab-0" />
                        <Tab label="EMI Payment Cheques" id="tab-1" />
                    </Tabs>
                </Box>

                {/* Search bar */}
                <Box sx={{ my: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Search by project, plot, customer, receipt or cheque number"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        sx={{ maxWidth: 600 }}
                    />
                </Box>

                {/* Status summary */}
                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                        label="All Cheques"
                        color="default"
                        variant="outlined"
                        onClick={() => setSearchTerm('')}
                    />
                    <Chip
                        label="Pending Clearance"
                        color="warning"
                        variant="outlined"
                        onClick={() => setSearchTerm('pending')}
                    />
                    <Chip
                        label="Cleared"
                        color="success"
                        variant="outlined"
                        onClick={() => setSearchTerm('cleared')}
                    />
                    <Chip
                        label="Bounced"
                        color="error"
                        variant="outlined"
                        onClick={() => setSearchTerm('bounced')}
                    />
                </Box>

                {/* Tab panels */}
                <TabPanel value={tabValue} index={0}>
                    {isMobile
                        ? renderMobilePaymentList(filteredFullPayments, fullPaymentsLoading || clearedChequesLoading)
                        : renderPaymentTable(filteredFullPayments, fullPaymentsLoading || clearedChequesLoading)
                    }
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    {isMobile
                        ? renderMobilePaymentList(filteredEmiPayments, emiPaymentsLoading || clearedChequesLoading)
                        : renderPaymentTable(filteredEmiPayments, emiPaymentsLoading || clearedChequesLoading)
                    }
                </TabPanel>
            </Paper>

            {/* Cheque Clearance Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#6B66FF',
                    color: 'white',
                    py: 2
                }}>
                    <Typography variant="h6">Update Cheque Status</Typography>
                    <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ p: 3 }}>
                    {selectedPayment && (
                        <Grid container spacing={3}>
                            {/* Payment Information */}
                            <Grid item xs={12}>
                                <Card sx={{ mb: 3, bgcolor: '#f9f9f9', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                                            Payment Information
                                        </Typography>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="body2" color="text.secondary">Receipt No</Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {formData.reciptNo}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="body2" color="text.secondary">Project</Typography>
                                                <Typography variant="body1">
                                                    {formData.projectName}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="body2" color="text.secondary">Plot</Typography>
                                                <Typography variant="body1">
                                                    {formData.plotNo}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="body2" color="text.secondary">Booking Code</Typography>
                                                <Typography variant="body1">
                                                    {formData.bookingCode}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="body2" color="text.secondary">Customer</Typography>
                                                <Typography variant="body1">
                                                    {selectedPayment.customerName}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="body2" color="text.secondary">Amount</Typography>
                                                <Typography variant="body1" fontWeight="bold">
                                                    ₹{parseFloat(formData.amount).toLocaleString()}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                                            Cheque/DD Details
                                        </Typography>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="body2" color="text.secondary">Cheque/DD Number</Typography>
                                                <Typography variant="body1">
                                                    {formData.chequeDdNeftNo}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="body2" color="text.secondary">Bank Name</Typography>
                                                <Typography variant="body1">
                                                    {formData.bankName}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="body2" color="text.secondary">Branch</Typography>
                                                <Typography variant="body1">
                                                    {formData.branchName || 'N/A'}
                                                </Typography>
                                            </Grid>
                                            {formData.accountNumber && (
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Typography variant="body2" color="text.secondary">Account Number</Typography>
                                                    <Typography variant="body1">
                                                        {formData.accountNumber}
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Update Status Form */}
                            <Grid item xs={12} sm={6} md={6}>
                                <FormControl
                                    fullWidth
                                    error={!!errors.chequeStatus}
                                    variant="outlined"
                                    sx={{ mb: 3 }}
                                >
                                    <InputLabel>Cheque Status</InputLabel>
                                    <Select
                                        name="chequeStatus"
                                        value={formData.chequeStatus}
                                        onChange={handleChange}
                                        label="Cheque Status"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                {formData.chequeStatus === 'clear' ? (
                                                    <CheckCircleIcon color="success" />
                                                ) : (
                                                    <CancelIcon color="error" />
                                                )}
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="clear">Cleared</MenuItem>
                                        <MenuItem value="bounce">Bounced</MenuItem>
                                    </Select>
                                    {errors.chequeStatus && (
                                        <FormHelperText error>{errors.chequeStatus}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    label="Update Date"
                                    type="date"
                                    name="updateDate"
                                    value={formData.updateDate}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarTodayIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 3 }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Remarks"
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    error={!!errors.remarks}
                                    helperText={errors.remarks}
                                    multiline
                                    rows={3}
                                    placeholder={formData.chequeStatus === 'bounce' ? 'Provide reason for cheque bounce (required)' : 'Any additional notes (optional)'}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', pt: 1.5 }}>
                                                <CommentIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={handleCloseDialog}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={submitting}
                        startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                        sx={{
                            bgcolor: '#6B66FF',
                            '&:hover': { bgcolor: '#5652e5' }
                        }}
                    >
                        {submitting ? 'Updating...' : 'Update Status'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notifications */}
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

export default ChequeClearance;