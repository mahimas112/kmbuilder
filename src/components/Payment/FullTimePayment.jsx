import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Select,
    InputAdornment,
    CircularProgress,
    Divider,
    Stepper,
    Step,
    StepLabel,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    useTheme,
    useMediaQuery,
    IconButton,
    FormHelperText,
    Card,
    CardContent,
    Backdrop
} from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import PaymentIcon from '@mui/icons-material/Payment';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NumbersIcon from '@mui/icons-material/Numbers';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
// import { v4 as uuidv4 } from 'uuid';

// Steps for stepper
const steps = ['Select Project & Plot', 'Payment Information', 'Review & Submit'];

const FullPaymentForm = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const receiptRef = useRef(null);

    // State for tracking form progress
    const [activeStep, setActiveStep] = useState(0);

    // Data states
    const [projects, setProjects] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [plots, setPlots] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [filteredBlocks, setFilteredBlocks] = useState([]);
    const [filteredPlots, setFilteredPlots] = useState([]);

    // Loading states
    const [isLoading, setIsLoading] = useState(false);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [blocksLoading, setBlocksLoading] = useState(false);
    const [plotsLoading, setPlotsLoading] = useState(false);
    const [customersLoading, setCustomersLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // UI control states
    const [showReceipt, setShowReceipt] = useState(false);
    const [alert, setAlert] = useState({ show: false, severity: 'info', message: '' });

    // Form data state
    const [formData, setFormData] = useState({
        fullPaymentId: '',
        projectName: '',
        projectId: '',
        blockNo: '',
        blockId: '',
        plotNo: '',
        plotId: '',
        bookingCode: '',
        customerId: '',
        customerName: '',
        date: new Date(),
        paymentType: 'Full Payment',
        payableAmount: 0,
        paidAmount: 0,
        payMode: 'Cash',
        remark: '',
        accountNumber: '',
        chequeNo: '',
        bankName: '',
        branchName: '',
        chequeDate: new Date(),
        reciptNo: `RCP-${Math.floor(100000 + Math.random() * 900000)}` // Generate random receipt number
    });

    // Form validation errors
    const [errors, setErrors] = useState({});

    // Create axiosInstance instance with interceptors for consistent error handling
    // const api = axiosInstance.create({
    //     baseURL: 'https://app.ventureconsultancyservices.com/realEstate'
    // });

    // Add response interceptor for error handling
    // api.interceptors.response.use(
    //     response => response,
    //     error => {
    //         let errorMessage = 'An unexpected error occurred';

    //         if (error.response) {
    //             // The request was made and the server responded with a non-2xx status code
    //             errorMessage = error.response.data?.message || `Error: ${error.response.status} - ${error.response.statusText}`;
    //         } else if (error.request) {
    //             // The request was made but no response was received
    //             errorMessage = 'No response received from server. Please check your network connection.';
    //         } else {
    //             // Something happened in setting up the request
    //             errorMessage = error.message;
    //         }

    //         console.error('API Error:', errorMessage, error);
    //         return Promise.reject(errorMessage);
    //     }
    // );

    // Fetch initial data when component mounts
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchProjects(),
                    fetchBlocks(),
                    fetchPlots(),
                    fetchCustomers()
                ]);
            } catch (error) {
                setAlert({
                    show: true,
                    severity: 'error',
                    message: 'Failed to load initial data: ' + error
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Fetch all projects
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
            throw error;
        } finally {
            setProjectsLoading(false);
        }
    };

    // Fetch all blocks
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
            throw error;
        } finally {
            setBlocksLoading(false);
        }
    };

    // Fetch all plots
    const fetchPlots = async () => {
        try {
            setPlotsLoading(true);
            const response = await axiosInstance.get('/realEstate/plot-booking/getAllSellingOfPlots');

            if (response.data && Array.isArray(response.data.data)) {
                // Filter plots that have full payment mode
                const fullPaymentPlots = response.data.data.filter(plot =>
                    plot.planType === 'Full Payment' || plot.planType === 'Full Payment'
                );
                console.log("plots", fullPaymentPlots)
                setPlots(fullPaymentPlots);
            } else {
                throw new Error('Invalid response format for plots');
            }
        } catch (error) {
            console.error('Error fetching plots:', error);
            throw error;
        } finally {
            setPlotsLoading(false);
        }
    };

    // Fetch all customers
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
            throw error;
        } finally {
            setCustomersLoading(false);
        }
    };

    // Filter blocks based on selected project
    const filterBlocksByProject = (projectId) => {
        if (!projectId) {
            setFilteredBlocks([]);
            return;
        }

        const filtered = blocks.filter(block => block.projectId === projectId);
        setFilteredBlocks(filtered);
    };

    // Filter plots based on selected block
    const filterPlotsByBlock = (blockId) => {
        if (!blockId) {
            setFilteredPlots([]);
            return;
        }

        const filtered = plots.filter(plot =>
            plot.blockID === blockId &&
            (plot.planType === 'Full Payment' || plot.planType === 'Full Payment') &&
            plot.dueAmount != 0
        );
        setFilteredPlots(filtered);
    };

    // Handle plot selection and auto-populate related fields
    // Handle plot selection and auto-populate related fields
    const handlePlotSelection = (plotId) => {
        if (!plotId) return;

        console.log("Selected Plot ID:", plotId);
        console.log("Available plots:", plots);

        // Find the selected plot using the correct ID field
        const selectedPlot = plots.find(plot => plot.addPlotId === plotId);

        if (!selectedPlot) {
            console.error("Plot not found with ID:", plotId);
            return;
        }

        // Log the selected plot to verify data
        console.log("Selected plot data:", selectedPlot);

        // Determine client name (either customer or associate)
        let clientName = "Unknown";

        if (selectedPlot.customerId) {
            // It's a customer
            const customer = customers.find(cust => cust.customerId === selectedPlot.customerId);
            clientName = customer ? `Customer: ${customer.customerName}` : (selectedPlot.buyerCustomerName || "Unknown Customer");
        } else if (selectedPlot.associateCode) {
            // It's an associate
            clientName = selectedPlot.buyerAssociatName || `Associate: ${selectedPlot.associateCode}`;
        }

        // Update form with plot and customer details
        setFormData(prev => ({
            ...prev,
            plotNo: selectedPlot.plotNo,
            plotId: selectedPlot.addPlotId,
            bookingCode: selectedPlot.bookingCode, // Make sure this is correctly referenced
            customerId: selectedPlot.customerId || '',
            associateCode: selectedPlot.associateCode || '',
            customerName: clientName,
            payableAmount: selectedPlot.dueAmount || 0,
            paidAmount: selectedPlot.dueAmount || 0
        }));

        // Log the updated form data
        console.log("Updated form data:", formData);
    };

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error when field is updated
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }

        // Special handling for certain fields
        if (name === 'projectId') {
            const project = projects.find(p => p.projectId === value);
            filterBlocksByProject(value);
            setFormData(prev => ({
                ...prev,
                projectName: project ? (project.siteName || project.projectName) : '',
                blockId: '',
                blockNo: '',
                plotId: '',
                plotNo: ''
            }));
        }

        if (name === 'blockId') {
            const block = blocks.find(b => b.blockId === value);
            filterPlotsByBlock(value);
            setFormData(prev => ({
                ...prev,
                blockNo: block ? block.block : '',
                plotId: '',
                plotNo: ''
            }));
        }

        if (name === 'plotId') {
            handlePlotSelection(value);
        }

        if (name === 'payMode') {
            // Reset bank/cheque details if payment mode is changed to Cash
            if (value === 'Cash') {
                setFormData(prev => ({
                    ...prev,
                    accountNumber: '',
                    chequeNo: '',
                    bankName: '',
                    branchName: '',
                    chequeDate: new Date()
                }));
            }
        }
    };

    // Handle date field changes
    const handleDateChange = (name, date) => {
        setFormData(prev => ({
            ...prev,
            [name]: date
        }));

        // Clear validation error when date is updated
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

        // Required fields validation
        const requiredFields = {
            projectId: 'Project is required',
            blockId: 'Block is required',
            plotId: 'Plot is required',
            // customerId: 'Customer is required',
            payableAmount: 'Payable amount is required',
            paidAmount: 'Paid amount is required',
            payMode: 'Payment mode is required'
        };

        Object.entries(requiredFields).forEach(([field, message]) => {
            if (!formData[field]) {
                newErrors[field] = message;
                isValid = false;
            }
        });

        // Check if paid amount matches payable amount
        if (formData.paidAmount && formData.payableAmount &&
            parseFloat(formData.paidAmount) !== parseFloat(formData.payableAmount)) {
            newErrors.paidAmount = 'Paid amount must match payable amount for full payment';
            isValid = false;
        }

        // Validate cheque/bank details for non-cash payments
        if (formData.payMode === 'Cheque' || formData.payMode === 'DD' || formData.payMode === 'Online Transfer') {
            if (!formData.chequeNo && (formData.payMode === 'Cheque' || formData.payMode === 'DD')) {
                newErrors.chequeNo = `${formData.payMode} number is required`;
                isValid = false;
            }

            if (!formData.bankName) {
                newErrors.bankName = 'Bank name is required';
                isValid = false;
            }

            if (!formData.accountNumber && formData.payMode === 'Online Transfer') {
                newErrors.accountNumber = 'Account number is required';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle next step
    const handleNext = () => {
        if (validateForm()) {
            setActiveStep(prevStep => prevStep + 1);
        } else {
            setAlert({
                show: true,
                severity: 'error',
                message: 'Please fix the errors before proceeding'
            });
        }
    };

    // Handle back step
    const handleBack = () => {
        setActiveStep(prevStep => prevStep - 1);
    };

    // Handle form submission
    // const handleSubmit = async () => {
    //     if (!validateForm()) {
    //         setAlert({
    //             show: true,
    //             severity: 'error',
    //             message: 'Please fix the errors before submitting'
    //         });
    //         return;
    //     }

    //     setSubmitting(true);

    //     try {
    //         // Prepare data for API
    //         const payload = {
    //             fullPaymentId: formData.fullPaymentId || '', // Add this field
    //             projectId: formData.projectId || '', // Add project ID
    //             block: formData.blockNo || '', // Use blockNo as 'block'
    //             addPlotId: formData.addPlotId || '', // Use plotId as 'addPlotId'
    //             fullPaymentId: '', // Generate UUID if not present
    //             date: format(formData.date, 'yyyy-MM-dd'),
    //             projectName: formData.projectName,
    //             blockId: formData.blockId,
    //             plotNo: formData.plotNo,
    //             bookingCode: formData.bookingCode,
    //             customerId: formData.customerId,
    //             customerName: formData.customerName,
    //             paymentType: formData.paymentType,
    //             payableAmount: parseFloat(formData.payableAmount),
    //             paidAmount: parseFloat(formData.paidAmount),
    //             payMode: formData.payMode,
    //             remark: formData.remark,
    //             accountNumber: formData.accountNumber || '', // Add optional fields
    //             chequeNo: formData.chequeNo || '',
    //             bankName: formData.bankName || '',
    //             branchName: formData.branchName || '',
    //             chequeDate: formData.payMode === 'Cheque' || formData.payMode === 'DD' 
    //               ? format(formData.chequeDate, 'yyyy-MM-dd') 
    //               : null,
    //             reciptNo: formData.reciptNo
    //           };

    //         // Add bank/cheque details if not cash payment
    //         if (formData.payMode !== 'Cash') {
    //             payload.accountNumber = formData.accountNumber;
    //             payload.bankName = formData.bankName;
    //             payload.branchName = formData.branchName;

    //             if (formData.payMode === 'Cheque' || formData.payMode === 'DD') {
    //                 payload.chequeNo = formData.chequeNo;
    //                 payload.chequeDate = format(formData.chequeDate, 'yyyy-MM-dd');
    //             }
    //         }

    //         // API call to save full payment
    //         const response = await api.post('/fullPayment/add', payload);

    //         if (response.data && response.data.status === 200) {
    //             setAlert({
    //                 show: true,
    //                 severity: 'success',
    //                 message: 'Payment recorded successfully!'
    //             });

    //             // Show receipt
    //             setShowReceipt(true);
    //         } else {
    //             throw new Error(response.data?.message || 'Failed to save payment');
    //         }
    //     } catch (error) {
    //         setAlert({
    //             show: true,
    //             severity: 'error',
    //             message: `Failed to save payment: ${error}`
    //         });
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };


    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            setAlert({
                show: true,
                severity: 'error',
                message: 'Please fix the errors before submitting'
            });
            return;
        }

        setSubmitting(true);

        try {
            // Prepare data for API - ensuring all fields from swagger are included
            const payload = {
                // Required fields
                fullPaymentId: formData.fullPaymentId || '',
                projectId: formData.projectId,
                projectName: formData.projectName,
                blockId: formData.blockId,
                block: formData.blockNo,  // Use blockNo as 'block'
                addPlotId: formData.plotId, // Using plotId as addPlotId
                plotNo: formData.plotNo,
                bookingCode: formData.bookingCode,
                customerId: formData.customerId || '',
                customerName: formData.customerName,
                date: format(new Date(formData.date), 'yyyy-MM-dd'),
                paymentType: formData.paymentType,
                payableAmount: parseFloat(formData.payableAmount),
                paidAmount: parseFloat(formData.paidAmount),
                payMode: formData.payMode,
                remark: formData.remark || '',

                // Bank/cheque related fields (may be empty strings if cash payment)
                accountNumber: formData.accountNumber || '',
                chequeNo: formData.chequeNo || '',
                bankName: formData.bankName || '',
                branchName: formData.branchName || '',

                // Format chequeDate properly if present
                chequeDate: formData.payMode === 'Cash' ?
                    null : format(new Date(formData.chequeDate), 'yyyy-MM-dd'),

                // Receipt number
                reciptNo: formData.reciptNo
            };

            console.log("Sending payload to API:", payload);

            // API call to save full payment
            const response = await axiosInstance.post('/realEstate/fullPayment/add', payload);

            if (response.data && response.data.status === 201) {
                setAlert({
                    show: true,
                    severity: 'success',
                    message: 'Payment recorded successfully!'
                });

                // Show receipt
                setShowReceipt(true);
            } else {
                throw new Error(response.data?.message || 'Failed to save payment');
            }
        } catch (error) {
            setAlert({
                show: true,
                severity: 'error',
                message: `Failed to save payment: ${error}`
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Handle print receipt
    const handlePrintReceipt = () => {
        const printWindow = window.open('', '_blank');

        if (printWindow) {
            printWindow.document.write(`
        <html>
          <head>
            <title>Payment Receipt - ${formData.reciptNo}</title>
            <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
              body { 
                font-family: 'Quicksand', Arial, sans-serif; 
                margin: 0; 
                padding: 0; 
                color: #333;
              }
              .receipt { 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 30px; 
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                background-color: #fff;
              }
              .header { 
                text-align: center; 
                position: relative;
                padding-bottom: 15px;
                margin-bottom: 20px;
              }
              .header:after {
                content: "";
                display: block;
                width: 100%;
                height: 2px;
                background: linear-gradient(to right, #2c3e50, #3498db, #2c3e50);
                position: absolute;
                bottom: 0;
                left: 0;
              }
              .logo-container {
                position: absolute;
                top: 0;
                left: 0;
              }
              .company-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                background: linear-gradient(to bottom, #2c3e50, #3498db);
                color: white;
                border-radius: 5px;
                font-weight: bold;
                margin-right: 10px;
              }
              .receipt-title {
                font-size: 24px;
                font-weight: 700;
                color: #2c3e50;
                margin: 0;
              }
              .receipt-no { 
                font-size: 16px; 
                color: #3498db; 
                font-weight: 500;
                margin: 5px 0;
              }
              .receipt-date {
                font-size: 14px;
                color: #777;
              }
              .section { 
                margin-bottom: 25px; 
                padding-bottom: 5px;
              }
              .section-title { 
                border-left: 4px solid #3498db; 
                padding-left: 10px; 
                font-size: 16px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 15px;
              }
              .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
              }
              .info-item {
                padding: 10px;
                background-color: #f9f9f9;
                border-radius: 5px;
              }
              .info-label { 
                font-weight: 500; 
                font-size: 13px;
                color: #777;
                margin-bottom: 5px;
              }
              .info-value { 
                font-weight: 600;
                color: #333;
                font-size: 15px;
              }
              .payment-details {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
              }
              .payment-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
              }
              .payment-row:last-child {
                border-bottom: none;
              }
              .payment-label {
                font-weight: 500;
              }
              .payment-value {
                font-weight: 600;
              }
              .total-row { 
                font-size: 18px; 
                font-weight: 700; 
                color: #2c3e50;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 2px solid #3498db;
              }
              .signature-section {
                margin-top: 50px;
                display: flex;
                justify-content: space-between;
              }
              .signature-box {
                width: 45%;
                text-align: center;
              }
              .signature-line {
                border-top: 1px solid #ccc;
                padding-top: 5px;
                margin-top: 40px;
                font-weight: 500;
              }
              .footer { 
                margin-top: 30px; 
                text-align: center; 
                font-size: 12px; 
                color: #777;
                border-top: 1px solid #eee;
                padding-top: 20px;
              }
              .receipt-header-right {
                position: absolute;
                top: 0;
                right: 0;
                text-align: right;
                font-size: 12px;
                color: #777;
              }
              @media print { 
                .no-print { display: none; } 
                .receipt { box-shadow: none; } 
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="logo-container">
                  <div class="company-logo">RE</div>
                </div>
                <div class="receipt-header-right">
                  <div>www.yourcompany.com</div>
                  <div>Phone: +91 123-456-7890</div>
                  <div>info@yourcompany.com</div>
                </div>
                <h1 class="receipt-title">Real Estate Receipt</h1>
                <div class="receipt-no">Receipt No: ${formData.reciptNo}</div>
                <div class="receipt-date">Date: ${format(formData.date, 'dd/MM/yyyy')}</div>
              </div>
              
              <div class="section">
                <div class="section-title">Property Details</div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Project Name</div>
                    <div class="info-value">${formData.projectName}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Block Number</div>
                    <div class="info-value">${formData.blockNo}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Plot Number</div>
                    <div class="info-value">${formData.plotNo}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Booking Code</div>
                    <div class="info-value">${formData.bookingCode}</div>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">Customer Details</div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Customer Name</div>
                    <div class="info-value">${formData.customerName}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Customer ID</div>
                    <div class="info-value">${formData.customerId}</div>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">Payment Details</div>
                <div class="payment-details">
                  <div class="payment-row">
                    <div class="payment-label">Payment Type</div>
                    <div class="payment-value">${formData.paymentType}</div>
                  </div>
                  <div class="payment-row">
                    <div class="payment-label">Payment Mode</div>
                    <div class="payment-value">${formData.payMode}</div>
                  </div>
                  ${formData.payMode !== 'Cash' ? `
                    <div class="payment-row">
                      <div class="payment-label">Bank Name</div>
                      <div class="payment-value">${formData.bankName}</div>
                    </div>
                    ${formData.branchName ? `
                      <div class="payment-row">
                        <div class="payment-label">Branch Name</div>
                        <div class="payment-value">${formData.branchName}</div>
                      </div>
                    ` : ''}
                    ${formData.payMode === 'Online Transfer' ? `
                      <div class="payment-row">
                        <div class="payment-label">Account Number</div>
                        <div class="payment-value">${formData.accountNumber}</div>
                      </div>
                    ` : ''}
                    ${(formData.payMode === 'Cheque' || formData.payMode === 'DD') ? `
                      <div class="payment-row">
                        <div class="payment-label">${formData.payMode} Number</div>
                        <div class="payment-value">${formData.chequeNo}</div>
                      </div>
                      <div class="payment-row">
                        <div class="payment-label">${formData.payMode} Date</div>
                        <div class="payment-value">${format(formData.chequeDate, 'dd/MM/yyyy')}</div>
                      </div>
                    ` : ''}
                  ` : ''}
                  <div class="payment-row">
                    <div class="payment-label">Payable Amount</div>
                    <div class="payment-value">₹${parseFloat(formData.payableAmount).toLocaleString()}</div>
                  </div>
                  <div class="payment-row total-row">
                    <div class="payment-label">Amount Paid</div>
                    <div class="payment-value">₹${parseFloat(formData.paidAmount).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              ${formData.remark ? `
                <div class="section">
                  <div class="section-title">Remarks</div>
                  <div class="info-item">
                    <div class="info-value">${formData.remark}</div>
                  </div>
                </div>
              ` : ''}
              
              <div class="signature-section">
                <div class="signature-box">
                  <div class="signature-line">Customer Signature</div>
                </div>
                <div class="signature-box">
                  <div class="signature-line">Authorized Signature</div>
                </div>
              </div>
              
              <div class="footer">
                <p>This is a computer-generated receipt and does not require a physical signature.</p>
                <p>Thank you for your payment!</p>
              </div>
            </div>
            
            <div class="no-print" style="text-align: center; margin-top: 20px;">
              <button onclick="window.print()" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px; font-family: 'Quicksand', sans-serif; font-weight: 600;">Print Receipt</button>
              <button onclick="window.close()" style="background-color: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-family: 'Quicksand', sans-serif; font-weight: 600;">Close</button>
            </div>
          </body>
        </html>
      `);

            printWindow.document.close();
        }
    };

    // Handle close receipt and navigate back
    const handleCloseReceipt = () => {
        setShowReceipt(false);
        navigate(-1);
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <FormControl
                                fullWidth
                                error={!!errors.projectId}
                                disabled={isLoading || projectsLoading}
                            >
                                <InputLabel>Project</InputLabel>
                                <Select
                                    name="projectId"
                                    value={formData.projectId}
                                    label="Project"
                                    onChange={handleChange}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <BusinessIcon color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    {projectsLoading ? (
                                        <MenuItem disabled>Loading projects...</MenuItem>
                                    ) : projects.length === 0 ? (
                                        <MenuItem disabled>No projects available</MenuItem>
                                    ) : (
                                        projects.map(project => (
                                            <MenuItem key={project.projectId} value={project.projectId}>
                                                {project.siteName || project.projectName}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                                {errors.projectId && <FormHelperText>{errors.projectId}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl
                                fullWidth
                                error={!!errors.blockId}
                                disabled={isLoading || blocksLoading || !formData.projectId}
                            >
                                <InputLabel>Block</InputLabel>
                                <Select
                                    name="blockId"
                                    value={formData.blockId}
                                    label="Block"
                                    onChange={handleChange}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <LocationOnIcon color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    {!formData.projectId ? (
                                        <MenuItem disabled>Select a project first</MenuItem>
                                    ) : blocksLoading ? (
                                        <MenuItem disabled>Loading blocks...</MenuItem>
                                    ) : filteredBlocks.length === 0 ? (
                                        <MenuItem disabled>No blocks available for this project</MenuItem>
                                    ) : (
                                        filteredBlocks.map(block => (
                                            <MenuItem key={block.blockId} value={block.blockId}>
                                                {block.block}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                                {errors.blockId && <FormHelperText>{errors.blockId}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl
                                fullWidth
                                error={!!errors.plotId}
                                disabled={isLoading || plotsLoading || !formData.blockId}
                            >
                                <InputLabel>Plot</InputLabel>
                                <Select
                                    name="plotId"
                                    value={formData.plotId}
                                    label="Plot"
                                    onChange={handleChange}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <LocationOnIcon color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    {!formData.blockId ? (
                                        <MenuItem disabled>Select a block first</MenuItem>
                                    ) : plotsLoading ? (
                                        <MenuItem disabled>Loading plots...</MenuItem>
                                    ) : filteredPlots.length === 0 ? (
                                        <MenuItem disabled>No full payment plots available for this block</MenuItem>
                                    ) : (
                                        filteredPlots.map(plot => (
                                            <MenuItem key={plot.addPlotId} value={plot.addPlotId}>
                                                Plot {plot.plotNo} - ₹{plot.dueAmount.toLocaleString()}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                                {errors.plotId && <FormHelperText>{errors.plotId}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Booking Code"
                                name="bookingCode"
                                value={formData.bookingCode}
                                onChange={handleChange}
                                disabled={true}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <NumbersIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Customer Name"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                disabled={true}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                );

            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Payment Date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleDateChange('date', e.target.value)}
                                fullWidth
                                error={!!errors.date}
                                helperText={errors.date}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarTodayIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Payment Type"
                                name="paymentType"
                                value={formData.paymentType}
                                onChange={handleChange}
                                disabled={true}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PaymentIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Payable Amount (₹)"
                                name="payableAmount"
                                type="number"
                                value={formData.payableAmount}
                                onChange={handleChange}
                                disabled={true}
                                error={!!errors.payableAmount}
                                helperText={errors.payableAmount}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CurrencyRupeeIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Paid Amount (₹)"
                                name="paidAmount"
                                type="number"
                                value={formData.paidAmount}
                                onChange={handleChange}
                                error={!!errors.paidAmount}
                                helperText={errors.paidAmount}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CurrencyRupeeIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl
                                fullWidth
                                error={!!errors.payMode}
                            >
                                <InputLabel>Payment Mode</InputLabel>
                                <Select
                                    name="payMode"
                                    value={formData.payMode}
                                    label="Payment Mode"
                                    onChange={handleChange}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <PaymentIcon color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="Cash">Cash</MenuItem>
                                    <MenuItem value="Cheque">Cheque</MenuItem>
                                    <MenuItem value="DD">Demand Draft</MenuItem>
                                    <MenuItem value="Online Transfer">Online Transfer</MenuItem>
                                </Select>
                                {errors.payMode && <FormHelperText>{errors.payMode}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Remarks"
                                name="remark"
                                value={formData.remark}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />
                        </Grid>

                        {/* Bank/Cheque details for non-cash payments */}
                        {formData.payMode !== 'Cash' && (
                            <>
                                <Grid item xs={12}>
                                    <Divider>
                                        <Typography variant="body2" color="textSecondary">
                                            {formData.payMode === 'Online Transfer' ? 'Bank Details' : `${formData.payMode} Details`}
                                        </Typography>
                                    </Divider>
                                </Grid>

                                {(formData.payMode === 'Cheque' || formData.payMode === 'DD') && (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label={`${formData.payMode} Number`}
                                                name="chequeNo"
                                                value={formData.chequeNo}
                                                onChange={handleChange}
                                                error={!!errors.chequeNo}
                                                helperText={errors.chequeNo}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <NumbersIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label={`${formData.payMode} Date`}
                                                type="date"
                                                value={formData.chequeDate}
                                                onChange={(e) => handleDateChange('chequeDate', e.target.value)}
                                                fullWidth
                                                error={!!errors.chequeDate}
                                                helperText={errors.chequeDate}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CalendarTodayIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />

                                        </Grid>
                                    </>
                                )}

                                {(formData.payMode === 'Online Transfer' || formData.payMode === 'Cheque') && (
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Account Number"
                                            name="accountNumber"
                                            value={formData.accountNumber}
                                            onChange={handleChange}
                                            error={!!errors.accountNumber}
                                            helperText={errors.accountNumber}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <NumbersIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                )}

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Bank Name"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleChange}
                                        error={!!errors.bankName}
                                        helperText={errors.bankName}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountBalanceIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Branch Name"
                                        name="branchName"
                                        value={formData.branchName}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocationOnIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                )
            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Please review the payment details before submitting.
                            </Alert>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Property Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="body2" color="text.secondary">Project Name</Typography>
                                            <Typography variant="body1">{formData.projectName}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="body2" color="text.secondary">Block</Typography>
                                            <Typography variant="body1">{formData.blockNo}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="body2" color="text.secondary">Plot Number</Typography>
                                            <Typography variant="body1">{formData.plotNo}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Customer Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary">Customer Name</Typography>
                                            <Typography variant="body1">{formData.customerName}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary">Booking Code</Typography>
                                            <Typography variant="body1">{formData.bookingCode}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Payment Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="body2" color="text.secondary">Payment Date</Typography>
                                            <Typography variant="body1">{format(formData.date, 'dd/MM/yyyy')}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="body2" color="text.secondary">Payment Type</Typography>
                                            <Typography variant="body1">{formData.paymentType}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="body2" color="text.secondary">Payment Mode</Typography>
                                            <Typography variant="body1">{formData.payMode}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="body2" color="text.secondary">Receipt Number</Typography>
                                            <Typography variant="body1">{formData.reciptNo}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 2 }} />

                                    {formData.payMode !== 'Cash' && (
                                        <>
                                            <Typography variant="subtitle2" gutterBottom>
                                                {formData.payMode} Details
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {(formData.payMode === 'Cheque' || formData.payMode === 'DD') && (
                                                    <>
                                                        <Grid item xs={12} md={4}>
                                                            <Typography variant="body2" color="text.secondary">{formData.payMode} Number</Typography>
                                                            <Typography variant="body1">{formData.chequeNo}</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} md={4}>
                                                            <Typography variant="body2" color="text.secondary">{formData.payMode} Date</Typography>
                                                            <Typography variant="body1">{format(formData.chequeDate, 'dd/MM/yyyy')}</Typography>
                                                        </Grid>
                                                    </>
                                                )}
                                                {formData.payMode === 'Online Transfer' && (
                                                    <Grid item xs={12} md={4}>
                                                        <Typography variant="body2" color="text.secondary">Account Number</Typography>
                                                        <Typography variant="body1">{formData.accountNumber}</Typography>
                                                    </Grid>
                                                )}
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="body2" color="text.secondary">Bank Name</Typography>
                                                    <Typography variant="body1">{formData.bankName}</Typography>
                                                </Grid>
                                                {formData.branchName && (
                                                    <Grid item xs={12} md={4}>
                                                        <Typography variant="body2" color="text.secondary">Branch</Typography>
                                                        <Typography variant="body1">{formData.branchName}</Typography>
                                                    </Grid>
                                                )}
                                            </Grid>
                                            <Divider sx={{ my: 2 }} />
                                        </>
                                    )}

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary">Payable Amount</Typography>
                                            <Typography variant="h6" color="primary">₹{parseFloat(formData.payableAmount).toLocaleString()}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary">Paid Amount</Typography>
                                            <Typography variant="h6" color={formData.payMode === 'Cash' ? 'success.main' : 'warning.main'}>
                                                ₹{parseFloat(formData.paidAmount).toLocaleString()}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {formData.remark && (
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Remarks
                                        </Typography>
                                        <Typography variant="body1">{formData.remark}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                );

            default:
                return null;
        }
    };

    return (
        <Box>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom color="primary">
                    Full Payment Entry
                </Typography>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 3, mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {alert.show && (
                    <Alert
                        severity={alert.severity}
                        sx={{ mb: 3 }}
                        onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                    >
                        {alert.message}
                    </Alert>
                )}

                {isLoading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box sx={{ mb: 4 }}>
                            {getStepContent(activeStep)}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={activeStep === 0 ? () => navigate(-1) : handleBack}
                                startIcon={<NavigateBeforeIcon />}
                                disabled={submitting}
                            >
                                {activeStep === 0 ? 'Cancel' : 'Back'}
                            </Button>

                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Payment'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    endIcon={<NavigateNextIcon />}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </>
                )}
            </Paper>

            {/* Payment Receipt Dialog */}
            <Dialog
                open={showReceipt}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: 'primary.main',
                    color: 'white'
                }}>
                    <Box display="flex" alignItems="center">
                        <ReceiptIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Payment Receipt</Typography>
                    </Box>
                    <IconButton onClick={handleCloseReceipt} size="small" sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ p: 0 }}>
                    <Box ref={receiptRef} sx={{ p: 3 }}>
                        <Box textAlign="center" mb={3}>
                            <Typography variant="h5" gutterBottom>PAYMENT RECEIPT</Typography>
                            <Typography variant="subtitle1" color="primary">Receipt No: {formData.reciptNo}</Typography>
                            <Typography variant="body2">Date: {format(formData.date, 'dd/MM/yyyy')}</Typography>
                        </Box>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" color="primary" gutterBottom>
                                            <BusinessIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                            Property Details
                                        </Typography>
                                        <Box sx={{ ml: 1, mt: 2 }}>
                                            <Box display="flex" mb={1}>
                                                <Typography variant="body2" color="text.secondary" sx={{ width: '40%' }}>
                                                    Project:
                                                </Typography>
                                                <Typography variant="body1" sx={{ width: '60%' }}>
                                                    {formData.projectName}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" mb={1}>
                                                <Typography variant="body2" color="text.secondary" sx={{ width: '40%' }}>
                                                    Block:
                                                </Typography>
                                                <Typography variant="body1" sx={{ width: '60%' }}>
                                                    {formData.blockNo}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" mb={1}>
                                                <Typography variant="body2" color="text.secondary" sx={{ width: '40%' }}>
                                                    Plot Number:
                                                </Typography>
                                                <Typography variant="body1" sx={{ width: '60%' }}>
                                                    {formData.plotNo}
                                                </Typography>
                                            </Box>
                                            <Box display="flex">
                                                <Typography variant="body2" color="text.secondary" sx={{ width: '40%' }}>
                                                    Booking Code:
                                                </Typography>
                                                <Typography variant="body1" sx={{ width: '60%' }}>
                                                    {formData.bookingCode}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" color="primary" gutterBottom>
                                            <PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                            Customer Details
                                        </Typography>
                                        <Box sx={{ ml: 1, mt: 2 }}>
                                            <Box display="flex" mb={1}>
                                                <Typography variant="body2" color="text.secondary" sx={{ width: '40%' }}>
                                                    Name:
                                                </Typography>
                                                <Typography variant="body1" sx={{ width: '60%' }}>
                                                    {formData.customerName}
                                                </Typography>
                                            </Box>
                                            <Box display="flex">
                                                <Typography variant="body2" color="text.secondary" sx={{ width: '40%' }}>
                                                    Customer ID:
                                                </Typography>
                                                <Typography variant="body1" sx={{ width: '60%' }}>
                                                    {formData.customerId}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" color="primary" gutterBottom>
                                            <PaymentIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                            Payment Details
                                        </Typography>

                                        <Grid container spacing={2} sx={{ mt: 1 }}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">Payment Type</Typography>
                                                    <Typography variant="body1">{formData.paymentType}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">Payment Mode</Typography>
                                                    <Typography variant="body1">{formData.payMode}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">Payment Date</Typography>
                                                    <Typography variant="body1">{format(formData.date, 'dd/MM/yyyy')}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">Receipt Number</Typography>
                                                    <Typography variant="body1">{formData.reciptNo}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        {formData.payMode !== 'Cash' && (
                                            <Box mt={2} p={2} bgcolor="background.paper" borderRadius={1}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    {formData.payMode} Details
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    {(formData.payMode === 'Cheque' || formData.payMode === 'DD') && (
                                                        <>
                                                            <Grid item xs={12} sm={6} md={4}>
                                                                <Typography variant="body2" color="text.secondary">{formData.payMode} Number</Typography>
                                                                <Typography variant="body1">{formData.chequeNo}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4}>
                                                                <Typography variant="body2" color="text.secondary">{formData.payMode} Date</Typography>
                                                                <Typography variant="body1">{format(formData.chequeDate, 'dd/MM/yyyy')}</Typography>
                                                            </Grid>
                                                        </>
                                                    )}
                                                    {formData.payMode === 'Online Transfer' && (
                                                        <Grid item xs={12} sm={6} md={4}>
                                                            <Typography variant="body2" color="text.secondary">Account Number</Typography>
                                                            <Typography variant="body1">{formData.accountNumber}</Typography>
                                                        </Grid>
                                                    )}
                                                    <Grid item xs={12} sm={6} md={4}>
                                                        <Typography variant="body2" color="text.secondary">Bank Name</Typography>
                                                        <Typography variant="body1">{formData.bankName}</Typography>
                                                    </Grid>
                                                    {formData.branchName && (
                                                        <Grid item xs={12} sm={6} md={4}>
                                                            <Typography variant="body2" color="text.secondary">Branch</Typography>
                                                            <Typography variant="body1">{formData.branchName}</Typography>
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </Box>
                                        )}

                                        <Divider sx={{ my: 2 }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">Amount Paid</Typography>
                                                <Typography variant="h5" color="success.main">
                                                    ₹{parseFloat(formData.paidAmount).toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <Box textAlign="right">
                                                <Typography variant="body2" color="text.secondary">Status</Typography>
                                                <Typography variant="h6" color={formData.payMode === 'Cash' ? 'success.main' : 'warning.main'}>
                                                    {formData.payMode === 'Cash' ? 'PAID' : 'PENDING'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {formData.remark && (
                                            <Box mt={2}>
                                                <Typography variant="body2" color="text.secondary">Remarks</Typography>
                                                <Typography variant="body2" sx={{ mt: 0.5 }}>{formData.remark}</Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Customer Signature</Typography>
                                        <Box sx={{ width: 150, borderTop: '1px dashed', mt: 5 }}></Box>
                                    </Box>
                                    <Box textAlign="right">
                                        <Typography variant="body2" color="text.secondary">Authorized Signature</Typography>
                                        <Box sx={{ width: 150, borderTop: '1px dashed', mt: 5, ml: 'auto' }}></Box>
                                    </Box>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>
                                    This is a computer-generated receipt and does not require a physical signature.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, bgcolor: 'background.paper' }}>
                    <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={handlePrintReceipt}
                        sx={{ mr: 2 }}
                    >
                        Print Receipt
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCloseReceipt}
                    >
                        Close
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
};

export default FullPaymentForm;