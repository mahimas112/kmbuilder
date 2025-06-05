import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    MenuItem,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Alert,
    Snackbar,
    InputAdornment,
    useMediaQuery,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    Card,
    CardContent,
    Chip,
    useTheme,
    TablePagination,
    Collapse
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    CalendarMonth as CalendarMonthIcon,
    Payment as PaymentIcon,
    Receipt as ReceiptIcon,
    CreditCard as CreditCardIcon,
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
    Business as BusinessIcon,
    Apartment as ApartmentIcon,
    Person as PersonIcon,
    People as PeopleIcon
} from '@mui/icons-material';
import { format, addMonths } from 'date-fns';
import axiosInstance from '../../axiosInstance';

// Main EMI Generator Component
const EMIGenerator = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    // States for EMI Data and Booking Data
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [emiPlans, setEmiPlans] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);

    // New states for project, block, customer, and associate selection
    const [projects, setProjects] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [associates, setAssociates] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedAssociate, setSelectedAssociate] = useState('');
    const [loadingStates, setLoadingStates] = useState({
        projects: false,
        blocks: false,
        customers: false,
        associates: false,
        bookings: false
    });

    // State for add/edit dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
    const [dialogData, setDialogData] = useState({
        emiGenrateId: '',
        bookingCode: '',
        durationInMonth: 12,
        getEmiDate: format(new Date(), 'yyyy-MM-dd'),
        instAmount: 0,
        projectId: '',
        blockID: '',
        customerId: '',
        associateCode: ''
    });

    // UI States
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dialogValidationError, setDialogValidationError] = useState({});

    // New state for receipt dialog
    const [openReceipt, setOpenReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(null);

    // Create axiosInstance instance for API calls
    // const api = axiosInstance.create({
    //     baseURL: '/realEstate',
    //     timeout: 10000
    // });

    // Fetch all projects
    const fetchProjects = async () => {
        setLoadingStates(prev => ({ ...prev, projects: true }));
        try {
            const response = await axiosInstance.get('/realEstate/project/getAll');
            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setProjects(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, projects: false }));
        }
    };

    // Fetch blocks based on selected project
    const fetchBlocks = async (projectId) => {
        if (!projectId) {
            setBlocks([]);
            return;
        }
        setLoadingStates(prev => ({ ...prev, blocks: true }));
        try {
            const response = await axiosInstance.get(`/realEstate/Block/getAllBlockByProjectUUId?projectId=${projectId}`);
            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setBlocks(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching blocks:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, blocks: false }));
        }
    };

    // Fetch all customers
    const fetchCustomers = async () => {
        setLoadingStates(prev => ({ ...prev, customers: true }));
        try {
            const response = await axiosInstance.get('/realEstate/addNew-customer/getAllCustomers');
            if (response.data && Array.isArray(response.data.data)) {
                setCustomers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, customers: false }));
        }
    };

    // Fetch all associates
    const fetchAssociates = async () => {
        setLoadingStates(prev => ({ ...prev, associates: true }));
        try {
            const response = await axiosInstance.get('/realEstate/associate/getAll');
            if (response.data && Array.isArray(response.data.data)) {
                setAssociates(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching associates:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, associates: false }));
        }
    };

    // Fetch all plot bookings with EMI plan
    const fetchEmiBookings = async () => {
        setLoadingStates(prev => ({ ...prev, bookings: true }));
        try {
            const response = await axiosInstance.get('/realEstate/plot-booking/getAllEmibookedPlots');
            console.log('Initial bookings response:', response.data);

            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                // No need to filter for EMI plan since we're already getting EMI booked plots
                const emiBookings = response.data.data;
                console.log('EMI bookings:', emiBookings);

                // Fetch project and block names for each booking
                const bookingsWithNames = await Promise.all(emiBookings.map(async (booking) => {
                    try {
                        console.log('Processing booking:', booking);
                        
                        // Fetch project details
                        const projectResponse = await axiosInstance.get(`/realEstate/project/getAll`);
                        const project = projectResponse.data?.data?.find(p => p.projectId === booking.projectId);
                        const projectName = project?.siteName || project?.projectName || 'N/A';
                        console.log('Project details:', { project, projectName });

                        // Fetch blocks for the project
                        const blocksResponse = await axiosInstance.get(`/realEstate/Block/getAllBlockByProjectUUId?projectId=${booking.projectId}`);
                        console.log('Blocks response:', blocksResponse.data);
                        const block = blocksResponse.data?.data?.find(b => b.blockId === booking.blockID);
                        const blockName = block?.block || 'N/A';
                        console.log('Block details:', { block, blockName });

                        // Fetch customer or associate details
                        let customerName = 'N/A';
                        let associateName = 'N/A';
                        let contactType = 'N/A';

                        if (booking.customerId) {
                            try {
                                const customerResponse = await axiosInstance.get('/realEstate/addNew-customer/getAllCustomers');
                                console.log('Customer response:', customerResponse.data);
                                const customer = customerResponse.data?.data?.find(c => c.customerId === booking.customerId);
                                console.log('Found customer:', customer);
                                customerName = customer?.customerName || 'N/A';
                                contactType = 'Customer';
                                console.log('Setting customer name:', customerName);
                            } catch (error) {
                                console.error('Error fetching customer details:', error);
                                customerName = 'N/A';
                                contactType = 'N/A';
                            }
                        } else if (booking.associateCode) {
                            try {
                                const associateResponse = await axiosInstance.get('/realEstate/associate/getAll');
                                console.log('Associate response:', associateResponse.data);
                                const associate = associateResponse.data?.data?.find(a => a.associateReperCode === booking.associateCode);
                                console.log('Found associate:', associate);
                                associateName = associate?.name || 'N/A';
                                contactType = 'Associate';
                                console.log('Setting associate name:', associateName);
                            } catch (error) {
                                console.error('Error fetching associate details:', error);
                                associateName = 'N/A';
                                contactType = 'N/A';
                            }
                        }

                        const bookingWithNames = {
                            ...booking,
                            projectName,
                            blockName,
                            customerName,
                            associateName,
                            contactType
                        };
                        console.log('Final booking with names:', bookingWithNames);
                        return bookingWithNames;
                    } catch (error) {
                        console.error('Error fetching details:', error);
                        return {
                            ...booking,
                            projectName: 'N/A',
                            blockName: 'N/A',
                            customerName: 'N/A',
                            associateName: 'N/A',
                            contactType: 'N/A'
                        };
                    }
                }));

                console.log('All bookings with names:', bookingsWithNames);
                setBookings(bookingsWithNames);
                setFilteredBookings(bookingsWithNames);
            } else {
                handleNotification('Failed to load EMI bookings', 'error');
            }
        } catch (error) {
            console.error('Error fetching EMI bookings:', error);
            handleNotification('Error fetching EMI bookings: ' + error.message, 'error');
        } finally {
            setLoadingStates(prev => ({ ...prev, bookings: false }));
        }
    };

    // Fetch existing EMI plans
    const fetchExistingEmiPlans = async () => {
        try {
            const response = await axiosInstance.get('/realEstate/emi/getAll');

            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setEmiPlans(response.data.data);
            } else {
                console.warn('No EMI plans found or invalid response format');
                setEmiPlans([]);
            }
        } catch (error) {
            console.error('Error fetching EMI plans:', error);
            setEmiPlans([]);
        }
    };

    // Fetch initial data
    useEffect(() => {
        fetchProjects();
        fetchCustomers();
        fetchAssociates();
        fetchEmiBookings();
        fetchExistingEmiPlans();
    }, []);

    // Fetch blocks when project changes
    useEffect(() => {
        if (selectedProject) {
            fetchBlocks(selectedProject);
        }
    }, [selectedProject]);

    // Filter bookings when search term changes
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredBookings(bookings);
        } else {
            const lowercasedFilter = searchTerm.toLowerCase();
            const filtered = bookings.filter(booking => {
                return (
                    booking.bookingCode.toLowerCase().includes(lowercasedFilter) ||
                    booking.plotNo.toLowerCase().includes(lowercasedFilter) ||
                    booking.projectName.toLowerCase().includes(lowercasedFilter) ||
                    booking.blockName.toLowerCase().includes(lowercasedFilter) ||
                    (booking.customerName && booking.customerName.toLowerCase().includes(lowercasedFilter))
                );
            });
            setFilteredBookings(filtered);
        }
    }, [searchTerm, bookings]);

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle notification display
    const handleNotification = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    // Handle notification close
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Handle row expansion
    const toggleRowExpansion = (bookingId) => {
        setExpandedRow(expandedRow === bookingId ? null : bookingId);
    };

    // Handle add EMI button click
    const handleAddEmi = (booking) => {
        setSelectedBooking(booking);
        setDialogMode('add');

        // Calculate appropriate installment amount if possible
        let suggestedAmount = 0;
        if (booking.dueAmount && booking.dueAmount > 0) {
            suggestedAmount = Math.ceil(booking.dueAmount / 12);
        }

        setDialogData({
            emiGenrateId: '',
            bookingCode: booking.bookingCode,
            durationInMonth: 12,
            getEmiDate: format(new Date(), 'yyyy-MM-dd'),
            instAmount: suggestedAmount,
            projectId: booking.projectId,
            blockID: booking.blockID,
            customerId: booking.customerId,
            associateCode: booking.associateCode
        });

        setDialogValidationError({});
        setOpenDialog(true);
    };

    // Handle dialog field changes
    const handleDialogChange = (e) => {
        const { name, value } = e.target;

        setDialogData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error when field is updated
        if (dialogValidationError[name]) {
            setDialogValidationError(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Validate dialog form
    const validateDialogForm = () => {
        const errors = {};
        let isValid = true;

        if (!dialogData.projectId) {
            errors.projectId = 'Project selection is required';
            isValid = false;
        }

        if (!dialogData.blockID) {
            errors.blockId = 'Block selection is required';
            isValid = false;
        }

        if (!dialogData.customerId && !dialogData.associateCode) {
            errors.customerId = 'Either customer or associate must be selected';
            errors.associateCode = 'Either customer or associate must be selected';
            isValid = false;
        }

        if (!dialogData.durationInMonth || dialogData.durationInMonth <= 0) {
            errors.durationInMonth = 'Duration must be greater than 0';
            isValid = false;
        }

        if (!dialogData.getEmiDate) {
            errors.getEmiDate = 'Start date is required';
            isValid = false;
        }

        if (!dialogData.instAmount || dialogData.instAmount <= 0) {
            errors.instAmount = 'Installment amount must be greater than 0';
            isValid = false;
        }

        setDialogValidationError(errors);
        return isValid;
    };

    // Handle dialog submit
    const handleDialogSubmit = async () => {
        if (!validateDialogForm()) return;

        try {
            setLoadingStates(prev => ({ ...prev, dialog: true }));

            const payload = {
                ...dialogData,
                emiGenrateId: dialogMode === 'edit' ? dialogData.emiGenrateId : undefined
            };

            const response = dialogMode === 'add' 
                ? await axiosInstance.post('/realEstate/emi/post', payload)
                : await axiosInstance.put(`/realEstate/emi/update/${dialogData.emiGenrateId}`, payload);

            if (response.status >= 200 && response.status < 300) {
                handleNotification('EMI plan created successfully!');
                
                // Generate and display receipt
                const receiptWindow = window.open('', '_blank');
                receiptWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>EMI Receipt</title>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
                            body { font-family: 'Quicksand', sans-serif; margin: 0; padding: 20px; color: #333; }
                            .receipt-container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                            .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #6B66FF; }
                            .company-name { font-size: 24px; font-weight: 700; color: #6B66FF; margin-bottom: 10px; }
                            .company-address { font-size: 14px; color: #666; margin-bottom: 5px; }
                            .receipt-title { font-size: 20px; font-weight: 600; margin: 30px 0; text-align: center; color: #333; }
                            .section { margin-bottom: 25px; }
                            .section-title { font-size: 16px; font-weight: 600; color: #6B66FF; margin-bottom: 10px; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; }
                            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                            .detail-item { margin-bottom: 8px; }
                            .detail-label { font-weight: 600; color: #666; margin-bottom: 3px; }
                            .detail-value { color: #333; }
                            .emi-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                            .emi-table th, .emi-table td { border: 1px solid #e0e0e0; padding: 10px; text-align: left; }
                            .emi-table th { background-color: #f5f5f5; font-weight: 600; }
                            .total-row { font-weight: 600; background-color: #f9f9f9; }
                            .terms { margin-top: 30px; font-size: 12px; color: #666; }
                            .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
                            .signature-box { text-align: center; width: 200px; }
                            .signature-line { border-top: 1px solid #333; margin-top: 50px; width: 100%; }
                            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 10px; }
                            @media print { body { padding: 0; } .receipt-container { box-shadow: none; border: none; } .no-print { display: none; } }
                        </style>
                    </head>
                    <body>
                        <div class="receipt-container">
                            <div class="header">
                                <div class="company-name">Venture Consultancy Services</div>
                                <div class="company-address">123 Business Street, City, State - 123456</div>
                                <div class="company-address">Phone: +91 1234567890 | Email: info@ventureconsultancy.com</div>
                            </div>

                            <div class="receipt-title">EMI PLAN RECEIPT</div>

                            <div class="section">
                                <div class="section-title">Plot Details</div>
                                <div class="details-grid">
                                    <div class="detail-item">
                                        <div class="detail-label">Project</div>
                                        <div class="detail-value">${selectedBooking?.projectName || 'N/A'}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Block</div>
                                        <div class="detail-value">${selectedBooking?.blockName || 'N/A'}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Plot Number</div>
                                        <div class="detail-value">${selectedBooking?.plotNo || 'N/A'}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Plot Area</div>
                                        <div class="detail-value">${selectedBooking?.plotArea || 'N/A'} sq.ft</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Plot Rate</div>
                                        <div class="detail-value">₹${selectedBooking?.plotRate?.toLocaleString() || 'N/A'} per sq.ft</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Total Plot Cost</div>
                                        <div class="detail-value">₹${selectedBooking?.totalPlotCost?.toLocaleString() || 'N/A'}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Booking Code</div>
                                        <div class="detail-value">${selectedBooking?.bookingCode || 'N/A'}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Booking Date</div>
                                        <div class="detail-value">${selectedBooking?.bookingDate ? new Date(selectedBooking.bookingDate).toLocaleDateString() : 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="section">
                                <div class="section-title">Contact Details</div>
                                <div class="details-grid">
                                    <div class="detail-item">
                                        <div class="detail-label">Name</div>
                                        <div class="detail-value">${selectedBooking?.customerName || selectedBooking?.associateName || 'N/A'}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Contact Type</div>
                                        <div class="detail-value">${selectedBooking?.contactType || 'N/A'}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Phone</div>
                                        <div class="detail-value">${selectedBooking?.phone || selectedBooking?.mobileNo || 'N/A'}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Email</div>
                                        <div class="detail-value">${selectedBooking?.email || 'N/A'}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Address</div>
                                        <div class="detail-value">${selectedBooking?.address || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="section">
                                <div class="section-title">Payment Details</div>
                                <div class="details-grid">
                                    <div class="detail-item">
                                        <div class="detail-label">Booking Amount</div>
                                        <div class="detail-value">₹${selectedBooking?.bookingAmount?.toLocaleString() || 'N/A'}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Due Amount</div>
                                        <div class="detail-value">₹${selectedBooking?.dueAmount?.toLocaleString() || 'N/A'}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Payment Mode</div>
                                        <div class="detail-value">${selectedBooking?.payMode || 'N/A'}</div>
                                    </div>
                                    ${selectedBooking?.payMode === 'Cheque' || selectedBooking?.payMode === 'DD' ? `
                                        <div class="detail-item">
                                            <div class="detail-label">${selectedBooking.payMode} Number</div>
                                            <div class="detail-value">${selectedBooking.checqueNo || 'N/A'}</div>
                                        </div>
                                        <div class="detail-item">
                                            <div class="detail-label">${selectedBooking.payMode} Date</div>
                                            <div class="detail-value">${selectedBooking.checqueDate ? new Date(selectedBooking.checqueDate).toLocaleDateString() : 'N/A'}</div>
                                        </div>
                                        <div class="detail-item">
                                            <div class="detail-label">Bank Name</div>
                                            <div class="detail-value">${selectedBooking.bankName || 'N/A'}</div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <div class="section">
                                <div class="section-title">EMI Plan Details</div>
                                <div class="details-grid">
                                    <div class="detail-item">
                                        <div class="detail-label">Duration</div>
                                        <div class="detail-value">${dialogData.durationInMonth} months</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Monthly Installment</div>
                                        <div class="detail-value">₹${dialogData.instAmount.toLocaleString()}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">First EMI Date</div>
                                        <div class="detail-value">${new Date(dialogData.getEmiDate).toLocaleDateString()}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Total Amount</div>
                                        <div class="detail-value">₹${(dialogData.durationInMonth * dialogData.instAmount).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="section">
                                <div class="section-title">EMI Schedule</div>
                                <table class="emi-table">
                                    <thead>
                                        <tr>
                                            <th>Installment No.</th>
                                            <th>Due Date</th>
                                            <th>Amount (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${generateEmiPreview().map((emi, index) => `
                                            <tr>
                                                <td>${index + 1}</td>
                                                <td>${new Date(emi.dueDate).toLocaleDateString()}</td>
                                                <td>${emi.amount.toLocaleString()}</td>
                                            </tr>
                                        `).join('')}
                                        <tr class="total-row">
                                            <td colspan="2">Total</td>
                                            <td>₹${(dialogData.durationInMonth * dialogData.instAmount).toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="section">
                                <div class="section-title">Terms & Conditions</div>
                                <div class="terms">
                                    <ol>
                                        <li>All installments must be paid on or before the due date.</li>
                                        <li>A late fee of 2% per month will be charged on overdue payments.</li>
                                        <li>The EMI plan can be prepaid at any time without any additional charges.</li>
                                        <li>In case of default, the company reserves the right to take legal action.</li>
                                        <li>All disputes are subject to the jurisdiction of the local courts.</li>
                                    </ol>
                                </div>
                            </div>

                            <div class="signature-section">
                                <div class="signature-box">
                                    <div class="signature-line"></div>
                                    <div>Customer/Associate Signature</div>
                                </div>
                                <div class="signature-box">
                                    <div class="signature-line"></div>
                                    <div>Authorized Signatory</div>
                                </div>
                            </div>

                            <div class="footer">
                                <div>This is a computer-generated receipt and does not require a signature.</div>
                                <div>Generated on: ${new Date().toLocaleString()}</div>
                            </div>

                            <div class="no-print" style="text-align: center; margin-top: 20px;">
                                <button onclick="window.print()" style="padding: 10px 20px; background: #6B66FF; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Receipt</button>
                                <button onclick="window.close()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
                            </div>
                        </div>
                    </body>
                    </html>
                `);
                receiptWindow.document.close();
                receiptWindow.focus();

                handleCloseDialog();
                fetchEmiBookings();
                fetchExistingEmiPlans();
            } else {
                throw new Error(response.data.message || 'Failed to process EMI plan');
            }
        } catch (error) {
            console.error('Error processing EMI plan:', error);
            handleNotification(error.response?.data?.message || error.message || 'Failed to process EMI plan', 'error');
        } finally {
            setLoadingStates(prev => ({ ...prev, dialog: false }));
        }
    };

    // Close dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogValidationError({});
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd MMM yyyy');
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Generate preview of EMI dates
    const generateEmiPreview = () => {
        const { durationInMonth, getEmiDate, instAmount } = dialogData;
        if (!durationInMonth || !getEmiDate || !instAmount) return [];

        const startDate = new Date(getEmiDate);
        const emiDates = [];

        for (let i = 0; i < parseInt(durationInMonth); i++) {
            const emiDate = addMonths(startDate, i);
            emiDates.push({
                installmentNumber: i + 1,
                dueDate: format(emiDate, 'yyyy-MM-dd'),
                amount: parseFloat(instAmount)
            });
        }

        return emiDates;
    };

    // Render EMI preview table
    const renderEmiPreviewTable = () => {
        const emiDates = generateEmiPreview();

        if (emiDates.length === 0) return null;

        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    EMI Schedule Preview
                </Typography>
                <TableContainer sx={{ maxHeight: 300 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Installment</TableCell>
                                <TableCell>Due Date</TableCell>
                                <TableCell align="right">Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {emiDates.map((emi) => (
                                <TableRow key={emi.installmentNumber}>
                                    <TableCell>{emi.installmentNumber}</TableCell>
                                    <TableCell>{formatDate(emi.dueDate)}</TableCell>
                                    <TableCell align="right">{formatCurrency(emi.amount)}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow sx={{ '& td': { fontWeight: 'bold', borderTop: '2px solid rgba(224, 224, 224, 1)' } }}>
                                <TableCell colSpan={2}>Total</TableCell>
                                <TableCell align="right">
                                    {formatCurrency(emiDates.length * parseFloat(dialogData.instAmount))}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                {selectedBooking && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                            Due Amount: {formatCurrency(selectedBooking.dueAmount)}
                        </Typography>
                        <Typography variant="body2" color={
                            emiDates.length * parseFloat(dialogData.instAmount) < selectedBooking.dueAmount
                                ? 'error.main'
                                : emiDates.length * parseFloat(dialogData.instAmount) > selectedBooking.dueAmount
                                    ? 'warning.main'
                                    : 'success.main'
                        }>
                            {emiDates.length * parseFloat(dialogData.instAmount) < selectedBooking.dueAmount
                                ? `Shortage: ${formatCurrency(selectedBooking.dueAmount - (emiDates.length * parseFloat(dialogData.instAmount)))}`
                                : emiDates.length * parseFloat(dialogData.instAmount) > selectedBooking.dueAmount
                                    ? `Excess: ${formatCurrency((emiDates.length * parseFloat(dialogData.instAmount)) - selectedBooking.dueAmount)}`
                                    : 'Amount matches exactly'}
                        </Typography>
                    </Box>
                )}
            </Box>
        );
    };

    // Get existing EMI plans for a booking
    const getExistingEmiPlans = (bookingCode) => {
        return emiPlans.filter(plan => plan.bookingCode === bookingCode);
    };

    // Render EMI details for expanded row
    const renderEmiDetails = (booking) => {
        const existingPlans = getExistingEmiPlans(booking.bookingCode);

        return (
            <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Financial Overview
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Total Plot Cost</Typography>
                                        <Typography variant="body1">{formatCurrency(booking.totalPlotCost)}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Booking Amount</Typography>
                                        <Typography variant="body1">{formatCurrency(booking.bookingAmount)}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Due Amount</Typography>
                                        <Typography variant="body1">{formatCurrency(booking.dueAmount)}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="body2" color="text.secondary">EMI Status</Typography>
                                        <Chip
                                            label={existingPlans.length > 0 ? 'EMI Plan Created' : 'No EMI Plan'}
                                            color={existingPlans.length > 0 ? 'success' : 'warning'}
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">
                                        EMI Plans
                                    </Typography>
                                    <Button
                                        size="small"
                                        startIcon={<AddIcon />}
                                        variant="contained"
                                        onClick={() => handleAddEmi(booking)}
                                    >
                                        Add EMI Plan
                                    </Button>
                                </Box>

                                {existingPlans.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No EMI plans created yet
                                        </Typography>
                                    </Box>
                                ) : (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Duration</TableCell>
                                                    <TableCell>Start Date</TableCell>
                                                    <TableCell align="right">Installment</TableCell>
                                                    <TableCell align="right">Total</TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {existingPlans.map((plan) => (
                                                    <TableRow key={plan.emiGenrateId}>
                                                        <TableCell>{plan.durationInMonth} months</TableCell>
                                                        <TableCell>{formatDate(plan.getEmiDate)}</TableCell>
                                                        <TableCell align="right">{formatCurrency(plan.instAmount)}</TableCell>
                                                        <TableCell align="right">{formatCurrency(plan.durationInMonth * plan.instAmount)}</TableCell>
                                                        <TableCell>
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => {
                                                                    setSelectedBooking(booking);
                                                                    setDialogMode('edit');
                                                                    setDialogData({
                                                                        emiGenrateId: plan.emiGenrateId,
                                                                        bookingCode: plan.bookingCode,
                                                                        durationInMonth: plan.durationInMonth,
                                                                        getEmiDate: plan.getEmiDate,
                                                                        instAmount: plan.instAmount
                                                                    });
                                                                    setOpenDialog(true);
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    // Render mobile view card for each booking
    const renderMobileCard = (booking) => {
        const isExpanded = expandedRow === booking.plotsellingId;
        const existingPlans = getExistingEmiPlans(booking.bookingCode);

        return (
            <Card key={booking.plotsellingId} sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                {booking.projectName} - Plot {booking.plotNo}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {booking.blockName} | Code: {booking.bookingCode}
                            </Typography>
                        </Box>
                        <Chip
                            label={existingPlans.length > 0 ? 'EMI Active' : 'No EMI'}
                            color={existingPlans.length > 0 ? 'success' : 'warning'}
                            size="small"
                        />
                    </Box>

                    <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Customer</Typography>
                            <Typography variant="body2">{booking.customerName || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Due Amount</Typography>
                            <Typography variant="body2" fontWeight="bold">{formatCurrency(booking.dueAmount)}</Typography>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                            size="small"
                            startIcon={isExpanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                            onClick={() => toggleRowExpansion(booking.plotsellingId)}
                        >
                            {isExpanded ? 'Hide Details' : 'Show Details'}
                        </Button>

                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleAddEmi(booking)}
                        >
                            Add EMI
                        </Button>
                    </Box>

                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Divider sx={{ my: 2 }} />
                        {renderEmiDetails(booking)}
                    </Collapse>
                </CardContent>
            </Card>
        );
    };

    // Handle project selection
    const handleProjectChange = (event) => {
        const projectId = event.target.value;
        setSelectedProject(projectId);
        setSelectedBlock('');
        setDialogData(prev => ({
            ...prev,
            projectId,
            blockId: '',
            bookingCode: ''
        }));
    };

    // Handle block selection
    const handleBlockChange = (event) => {
        const blockId = event.target.value;
        setSelectedBlock(blockId);
        setDialogData(prev => ({
            ...prev,
            blockId,
            bookingCode: ''
        }));
    };

    // Handle customer selection
    const handleCustomerChange = (event) => {
        const customerId = event.target.value;
        setSelectedCustomer(customerId);
        setDialogData(prev => ({
            ...prev,
            customerId,
            associateCode: ''
        }));
    };

    // Handle associate selection
    const handleAssociateChange = (event) => {
        const associateCode = event.target.value;
        setSelectedAssociate(associateCode);
        setDialogData(prev => ({
            ...prev,
            associateCode,
            customerId: ''
        }));
    };

    // Calculate installment amount based on due amount and duration
    const calculateInstallmentAmount = (dueAmount, duration) => {
        if (!dueAmount || !duration) return 0;
        return Math.ceil(dueAmount / duration);
    };

    // Update installment amount when duration or due amount changes
    useEffect(() => {
        if (selectedBooking && dialogData.durationInMonth) {
            const installmentAmount = calculateInstallmentAmount(
                selectedBooking.dueAmount,
                dialogData.durationInMonth
            );
            setDialogData(prev => ({
                ...prev,
                instAmount: installmentAmount
            }));
        }
    }, [selectedBooking, dialogData.durationInMonth]);

    // Handle receipt dialog close
    const handleCloseReceipt = () => {
        setOpenReceipt(false);
        setReceiptData(null);
    };

    // Render receipt dialog
    const renderReceiptDialog = () => (
        <Dialog
            open={openReceipt}
            onClose={handleCloseReceipt}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ 
                backgroundColor: '#DAE1F3',
                color: '#2C3E50',
                fontWeight: 600,
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <ReceiptIcon />
                EMI Plan Receipt
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
                {receiptData && (
                    <Box sx={{ 
                        backgroundColor: 'white',
                        borderRadius: 2,
                        p: 3,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        {/* Header */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                                EMI Plan Receipt
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {format(new Date(), 'dd MMM yyyy')}
                            </Typography>
                        </Box>

                        {/* Project and Block Details */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ 
                                    backgroundColor: '#F5F7FA',
                                    p: 2,
                                    borderRadius: 1
                                }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Project
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {receiptData.projectName}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ 
                                    backgroundColor: '#F5F7FA',
                                    p: 2,
                                    borderRadius: 1
                                }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Block
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {receiptData.blockName}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Customer/Associate Details */}
                        <Box sx={{ 
                            backgroundColor: '#F5F7FA',
                            p: 2,
                            borderRadius: 1,
                            mb: 3
                        }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                {receiptData.customerName ? 'Customer' : 'Associate'}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {receiptData.customerName || receiptData.associateName}
                            </Typography>
                        </Box>

                        {/* EMI Details */}
                        <TableContainer component={Paper} elevation={0} sx={{ 
                            border: '1px solid #e0e0e0',
                            mb: 3
                        }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#DAE1F3' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>Installment No.</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {receiptData.emiDates.map((emi) => (
                                        <TableRow key={emi.installmentNumber}>
                                            <TableCell>{emi.installmentNumber}</TableCell>
                                            <TableCell>{format(new Date(emi.dueDate), 'dd MMM yyyy')}</TableCell>
                                            <TableCell align="right">{formatCurrency(emi.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow sx={{ '& td': { fontWeight: 'bold', borderTop: '2px solid #e0e0e0' } }}>
                                        <TableCell colSpan={2}>Total Amount</TableCell>
                                        <TableCell align="right">{formatCurrency(receiptData.totalAmount)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Summary */}
                        <Box sx={{ 
                            backgroundColor: '#F5F7FA',
                            p: 2,
                            borderRadius: 1
                        }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Duration
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {receiptData.durationInMonth} months
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Monthly Installment
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {formatCurrency(receiptData.instAmount)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button 
                    onClick={handleCloseReceipt}
                    variant="outlined"
                    sx={{ 
                        borderColor: '#6B66FF',
                        color: '#6B66FF',
                        '&:hover': { 
                            borderColor: '#5652e5',
                            backgroundColor: 'rgba(107, 102, 255, 0.04)'
                        }
                    }}
                >
                    Close
                </Button>
                <Button
                    variant="contained"
                    onClick={() => window.print()}
                    sx={{ 
                        bgcolor: '#6B66FF',
                        '&:hover': { bgcolor: '#5652e5' }
                    }}
                >
                    Print Receipt
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header section with title and actions */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                mb: 3,
                gap: 2
            }}>
                <Typography variant="h5" component="h1" fontWeight="bold">
                    EMI Generator
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    <TextField
                        placeholder="Search bookings..."
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
                </Box>
            </Box>

            {/* Main content */}
            {loadingStates.bookings ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                </Box>
            ) : filteredBookings.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No EMI plan bookings found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {searchTerm ? "Try adjusting your search criteria" : "There are no bookings with EMI plans in the system"}
                    </Typography>
                </Paper>
            ) : (
                <>
                    {/* Mobile view */}
                    {isMobile ? (
                        <Box>
                            {filteredBookings
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(booking => renderMobileCard(booking))}
                        </Box>
                    ) : (
                        /* Desktop view */
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
                                        <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Block</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Plot No</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Booking Code</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Due Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>EMI Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredBookings
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((booking) => {
                                            const isExpanded = expandedRow === booking.plotsellingId;
                                            const existingPlans = getExistingEmiPlans(booking.bookingCode);

                                            return (
                                                <React.Fragment key={booking.plotsellingId}>
                                                    <TableRow hover>
                                                        <TableCell sx={{ fontWeight: 500 }}>
                                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {booking.projectName || 'N/A'}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Project
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 500 }}>
                                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {booking.blockName || 'N/A'}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Block
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 500 }}>{booking.plotNo}</TableCell>
                                                        <TableCell sx={{ fontWeight: 500 }}>{booking.bookingCode}</TableCell>
                                                        <TableCell sx={{ fontWeight: 500 }}>
                                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {booking.contactType === 'Customer' ? booking.customerName : 
                                                                     booking.contactType === 'Associate' ? booking.associateName : 'N/A'}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {booking.contactType}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 500 }}>{formatCurrency(booking.dueAmount)}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={existingPlans.length > 0 ? 'EMI Active' : 'No EMI'}
                                                                color={existingPlans.length > 0 ? 'success' : 'warning'}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Tooltip title="Toggle Details">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => toggleRowExpansion(booking.plotsellingId)}
                                                                    >
                                                                        {isExpanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Add EMI Plan">
                                                                    <IconButton
                                                                        size="small"
                                                                        color="primary"
                                                                        onClick={() => handleAddEmi(booking)}
                                                                    >
                                                                        <AddIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                    {/* Expandable Row */}
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={8}
                                                            sx={{ p: 0, borderBottom: isExpanded ? '1px solid rgba(224, 224, 224, 1)' : 'none' }}
                                                        >
                                                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                                {renderEmiDetails(booking)}
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Pagination */}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredBookings.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}

            {/* Dialog for Adding/Editing EMI Plan */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ 
                    backgroundColor: '#DAE1F3',
                    color: '#2C3E50',
                    fontWeight: 600,
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <PaymentIcon />
                    {dialogMode === 'add' ? 'Create New EMI Plan' : 'Edit EMI Plan'}
                </DialogTitle>
                <DialogContent dividers sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        {/* Project Display */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Project"
                                value={projects.find(p => p.projectId === dialogData.projectId)?.siteName || projects.find(p => p.projectId === dialogData.projectId)?.projectName || 'N/A'}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BusinessIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Block Display */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Block"
                                value={selectedBooking?.blockName || 'N/A'}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ApartmentIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Customer Display */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Customer"
                                value={customers.find(c => c.customerId === dialogData.customerId)?.customerName || 'N/A'}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Associate Display */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Associate"
                                value={associates.find(a => a.associateReperCode === dialogData.associateCode)?.name || 'N/A'}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PeopleIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Existing EMI Plan fields */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Duration (Months)"
                                name="durationInMonth"
                                type="number"
                                value={dialogData.durationInMonth}
                                onChange={handleDialogChange}
                                fullWidth
                                error={!!dialogValidationError.durationInMonth}
                                helperText={dialogValidationError.durationInMonth}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarMonthIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{ min: 1, max: 120 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="First EMI Date"
                                name="getEmiDate"
                                type="date"
                                value={dialogData.getEmiDate}
                                onChange={handleDialogChange}
                                fullWidth
                                error={!!dialogValidationError.getEmiDate}
                                helperText={dialogValidationError.getEmiDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarMonthIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Installment Amount"
                                name="instAmount"
                                type="number"
                                value={dialogData.instAmount}
                                onChange={handleDialogChange}
                                fullWidth
                                error={!!dialogValidationError.instAmount}
                                helperText={dialogValidationError.instAmount}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CreditCardIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{ min: 1 }}
                            />
                        </Grid>
                    </Grid>

                    {renderEmiPreviewTable()}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button 
                        onClick={handleCloseDialog}
                        variant="outlined"
                        sx={{ 
                            borderColor: '#6B66FF',
                            color: '#6B66FF',
                            '&:hover': { 
                                borderColor: '#5652e5',
                                backgroundColor: 'rgba(107, 102, 255, 0.04)'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDialogSubmit}
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        disabled={loading}
                        sx={{ 
                            bgcolor: '#6B66FF',
                            '&:hover': { bgcolor: '#5652e5' },
                            minWidth: 100
                        }}
                    >
                        {loading ? 'Saving...' : (dialogMode === 'add' ? 'Create EMI Plan' : 'Update EMI Plan')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* MUI Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Receipt Dialog */}
            {renderReceiptDialog()}
        </Box>
    );
};

export default EMIGenerator;