import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Save as SaveIcon,
  Print as PrintIcon,
  CalendarToday as CalendarTodayIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Home as HomeIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Payments as PaymentsIcon,
  AccountBalance as AccountBalanceIcon,
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axiosInstance from '../../axiosInstance';

// Create a reusable API client with error handling


// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     console.error('API Error:', error);
//     return Promise.reject(error);
//   }
// );

const EMIPayment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    emiPaymentId: '',
    projectId: '',
    projectName: '',
    blockId: '',
    block: '',
    addPlotId: '',
    plotNo: '',
    genratedEmiId: '',
    bookingCode: '',
    customerId: '',
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    paymentType: 'EMI',
    installmentAmount: 0,
    payableAmount: 0,
    pendingEmi: 0,
    paidAmount: 0,
    payMode: 'Cash',
    remark: '',
    totalPlotCost: 0,
    bookingAmount: 0,
    receiptNo: '',
    totalPaidAmount: 0,
    previousPaidAmount: 0, // To track previous paid amount
    dueAmount: 0,
    accountNumber: '',
    chequeNo: '',
    bankName: '',
    branchName: '',
    chequeDate: new Date().toISOString().split('T')[0]
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Dropdown data states
  const [projects, setProjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [plots, setPlots] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [filteredPlots, setFilteredPlots] = useState([]);
  const [emiDetails, setEmiDetails] = useState(null);
  const [customerData, setCustomerData] = useState(null);

  // Steps for form completion
  const steps = ['Select Property', 'Enter Payment Details', 'Review & Submit'];

  // Fetch all projects
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchProjects(),
          fetchBlocks(),
          fetchPlots()
        ]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setNotification({
          open: true,
          message: 'Failed to load initial data',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get('/realEstate/project/getAll');
      if (response.data && response.data.data) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  };

  const fetchBlocks = async () => {
    try {
      const response = await axiosInstance.get('/realEstate/Block/getAllBlock');
      if (response.data && response.data.data) {
        setBlocks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
      throw error;
    }
  };

  const fetchPlots = async () => {
    try {
      const response = await axiosInstance.get('/realEstate/plot-booking/getAllSellingOfPlots');
      if (response.data && response.data.data) {
        setPlots(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching plots:', error);
      throw error;
    }
  };

  // Filter blocks based on selected project
  useEffect(() => {
    if (formData.projectId && blocks.length > 0) {
      const filtered = blocks.filter(block => block.projectId === formData.projectId);
      setFilteredBlocks(filtered);
    } else {
      setFilteredBlocks([]);
    }
  }, [formData.projectId, blocks]);

  // Filter plots based on selected block
  useEffect(() => {
    if (formData.blockId && plots.length > 0) {
      const filtered = plots.filter(plot => 
        plot.blockID === formData.blockId && 
        plot.planType === 'EMI Plan' &&
        plot.genrateEmistatus === true
      );
      setFilteredPlots(filtered);
    } else {
      setFilteredPlots([]);
    }
  }, [formData.blockId, plots]);

  // Fetch EMI details and previous payments when booking code changes
  useEffect(() => {
    const fetchEmiDetails = async () => {
      if (formData.bookingCode) {
        try {
          setLoading(true);
          // Fetch EMI details
          const emiResponse = await axiosInstance.get(`/realEstate/emi/getByBookingCode?bookingCode=${formData.bookingCode}`);
          
          if (emiResponse.data && emiResponse.data.data) {
            setEmiDetails(emiResponse.data.data);
            
            // Fetch previous EMI payments
            try {
              const paymentsResponse = await axiosInstance.get(`/realEstate/emiPayments/getByBookingCode?bookingCode=${formData.bookingCode}`);
              
              let totalPreviousPaid = 0;
              if (paymentsResponse.data && paymentsResponse.data.data && Array.isArray(paymentsResponse.data.data)) {
                // Sum up all previous payments
                totalPreviousPaid = paymentsResponse.data.data.reduce(
                  (sum, payment) => sum + parseFloat(payment.paidAmount || 0), 
                  0
                );
              }
              
              setFormData(prev => ({
                ...prev,
                genratedEmiId: emiResponse.data.data.emiGenrateId,
                installmentAmount: emiResponse.data.data.instAmount,
                pendingEmi: emiResponse.data.data.durationInMonth,
                paymentType: 'EMI',
                payableAmount: emiResponse.data.data.instAmount,
                previousPaidAmount: totalPreviousPaid,
                totalPaidAmount: totalPreviousPaid
              }));
            } catch (paymentError) {
              console.warn("Could not fetch previous payments:", paymentError);
              setFormData(prev => ({
                ...prev,
                genratedEmiId: emiResponse.data.data.emiGenrateId,
                installmentAmount: emiResponse.data.data.instAmount,
                pendingEmi: emiResponse.data.data.durationInMonth,
                paymentType: 'EMI',
                payableAmount: emiResponse.data.data.instAmount,
                previousPaidAmount: 0,
                totalPaidAmount: 0
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching EMI details:', error);
          setNotification({
            open: true,
            message: 'Failed to fetch EMI details',
            severity: 'error'
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEmiDetails();
  }, [formData.bookingCode]);

  // Fetch customer details when customerId changes
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (formData.customerId) {
        try {
          const response = await axiosInstance.get(`/realEstate/addNew-customer/getById?customerId=${formData.customerId}`);
          if (response.data && response.data.status === 200) {
            setCustomerData(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching customer details:', error);
        }
      }
    };

    fetchCustomerDetails();
  }, [formData.customerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: value
      };

      // If payable amount is changed, recalculate due amount
      if (name === 'payableAmount') {
        const payableAmount = parseFloat(value) || 0;
        newFormData.dueAmount = prev.dueAmount - payableAmount;
      }

      return newFormData;
    });

    // Clear validation error for the field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    const project = projects.find(p => p.projectId === projectId);
    
    setFormData(prev => ({
      ...prev,
      projectId: projectId,
      projectName: project ? (project.siteName || project.projectName) : '',
      blockId: '', // Reset block when project changes
      block: '',
      addPlotId: '', // Reset plot when project changes
      plotNo: '',
      bookingCode: '',
      customerId: '',
      customerName: ''
    }));
  };

  const handleBlockChange = (e) => {
    const blockId = e.target.value;
    const block = blocks.find(b => b.blockId === blockId);
    
    setFormData(prev => ({
      ...prev,
      blockId: blockId,
      block: block ? block.block : '',
      addPlotId: '', // Reset plot when block changes
      plotNo: '',
      bookingCode: '',
      customerId: '',
      customerName: ''
    }));
  };

  const handlePlotSelect = async (plotId) => {
    const selectedPlot = plots.find(plot => plot.addPlotId === plotId);
    
    if (selectedPlot) {
      // Fetch total paid amount for the selected plot
      const totalPaid = await fetchTotalPaidAmount(selectedPlot.bookingCode);
      
      setFormData(prev => ({
        ...prev,
        addPlotId: selectedPlot.addPlotId,
        plotNo: selectedPlot.plotNo,
        bookingCode: selectedPlot.bookingCode,
        customerId: selectedPlot.customerId,
        customerName: selectedPlot.buyerName || '',
        totalPlotCost: selectedPlot.totalPlotCost,
        bookingAmount: selectedPlot.bookingAmount,
        dueAmount: selectedPlot.dueAmount,
        totalPaidAmount: totalPaid // Set the fetched total paid amount
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (activeStep === 0) {
      // Validate property selection
      if (!formData.projectId) newErrors.projectId = "Project is required";
      if (!formData.blockId) newErrors.blockId = "Block is required";
      if (!formData.addPlotId) newErrors.addPlotId = "Plot is required";
    } else if (activeStep === 1) {
      // Validate payment details
      if (!formData.date) newErrors.date = "Payment date is required";
      if (!formData.payableAmount || formData.payableAmount <= 0) {
        newErrors.payableAmount = "Payable amount must be greater than 0";
      }
      if (!formData.payMode) newErrors.payMode = "Payment mode is required";
      
      // Validate bank details if not cash payment
      if (formData.payMode !== 'Cash') {
        if (!formData.bankName) newErrors.bankName = "Bank name is required";
        if (!formData.branchName) newErrors.branchName = "Branch name is required";
        if (!formData.accountNumber) newErrors.accountNumber = "Account number is required";
        if (!formData.chequeNo) newErrors.chequeNo = "Cheque number is required";
        if (!formData.chequeDate) newErrors.chequeDate = "Cheque date is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Add new function to fetch total paid amount
  const fetchTotalPaidAmount = async (bookingCode) => {
    try {
      const response = await axiosInstance.get(`/realEstate/emiPayments/getTotalPaidAmount?bookingCode=${bookingCode}`);
      if (response.data && response.data.status === 200) {
        return response.data.data;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching total paid amount:', error);
      return 0;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      // First fetch the current total paid amount
      const currentTotalPaid = await fetchTotalPaidAmount(formData.bookingCode);
      
      // Prepare data for submission
      const submissionData = {
        ...formData,
        paidAmount: parseFloat(formData.payableAmount),
        totalPaidAmount: currentTotalPaid + parseFloat(formData.payableAmount), // Add current payment to fetched total
        paymentType: 'EMI',
        date: formData.date,
        chequeDate: formData.chequeDate,
        chequeStatus: formData.payMode === 'Cheque' ? false : true
      };

      // API call to save payment
      const response = await axiosInstance.post('/realEstate/emiPayments/post', submissionData);

      if (response.data && (response.data.status === 201 || response.data.status === 200)) {
        // Fetch the updated total paid amount after saving
        const updatedTotalPaid = await fetchTotalPaidAmount(formData.bookingCode);
        
        setNotification({
          open: true,
          message: 'EMI Payment recorded successfully',
          severity: 'success'
        });
        
        // Update receipt data with fetched total paid amount
        const receiptData = {
          ...response.data.data,
          chequeStatus: submissionData.chequeStatus,
          totalPaidAmount: updatedTotalPaid, // Use the fetched total
          totalPlotCost: plots.find(plot => plot.bookingCode === formData.bookingCode)?.totalPlotCost || 0,
          bookingAmount: plots.find(plot => plot.bookingCode === formData.bookingCode)?.bookingAmount || 0,
          otherCharges: plots.find(plot => plot.bookingCode === formData.bookingCode)?.otherCharges || 0,
          couponDiscount: plots.find(plot => plot.bookingCode === formData.bookingCode)?.couponDiscount || 0
        };

        console.log(receiptData);
        setReceiptData(receiptData);
        setShowReceipt(true);
      } else {
        throw new Error(response.data?.message || 'Failed to save EMI payment');
      }
    } catch (error) {
      console.error('Error saving EMI payment:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Failed to save EMI payment',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setReceiptData(null);
    // Reset form and go back to first step
    setFormData({
      emiPaymentId: '',
      projectId: '',
      projectName: '',
      blockId: '',
      block: '',
      addPlotId: '',
      plotNo: '',
      genratedEmiId: '',
      bookingCode: '',
      customerId: '',
      customerName: '',
      date: new Date().toISOString().split('T')[0],
      paymentType: 'EMI',
      installmentAmount: 0,
      payableAmount: 0,
      pendingEmi: 0,
      paidAmount: 0,
      payMode: 'Cash',
      remark: '',
      totalPlotCost: 0,
      bookingAmount: 0,
      receiptNo: '',
      totalPaidAmount: 0,
      previousPaidAmount: 0,
      dueAmount: 0,
      accountNumber: '',
      chequeNo: '',
      bankName: '',
      branchName: '',
      chequeDate: new Date().toISOString().split('T')[0]
    });
    setActiveStep(0);
  };

  const handlePrintReceipt = async () => {
    const printWindow = window.open('', '_blank');
    
    if (printWindow && receiptData) {
      // Fetch the latest total paid amount
      const latestTotalPaid = await fetchTotalPaidAmount(receiptData.bookingCode);
      
      // Calculate remaining due amount
      const remainingDue = receiptData.totalPlotCost + receiptData.otherCharges - receiptData.couponDiscount - receiptData.bookingAmount - latestTotalPaid;
      
      const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>EMI Payment Receipt - ${receiptData.receiptNo}</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap">
          <style>
            body {
              font-family: 'Poppins', sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
              background-color: #f9fafc;
            }
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            .receipt-header {
              background: linear-gradient(45deg, #6B66FF, #4E4BB8);
              color: white;
              padding: 30px;
              text-align: center;
              position: relative;
            }
            .receipt-title {
              font-size: 28px;
              font-weight: 600;
              margin: 0 0 10px 0;
            }
            .receipt-subtitle {
              font-size: 16px;
              opacity: 0.9;
              margin: 5px 0;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 4px;
              font-size: 14px;
              font-weight: 500;
              margin-top: 15px;
            }
            .status-pending {
              background-color: #FFA726;
              color: white;
            }
            .status-completed {
              background-color: #4CAF50;
              color: white;
            }
            .section {
              padding: 25px;
              border-bottom: 1px solid #eee;
            }
            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: #2c3e50;
              margin-bottom: 20px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
            }
            .info-item {
              margin-bottom: 15px;
            }
            .info-label {
              font-size: 14px;
              color: #666;
              margin-bottom: 5px;
            }
            .info-value {
              font-size: 16px;
              font-weight: 500;
            }
            .payment-summary {
              background-color: #f8faff;
              padding: 25px;
              border-radius: 12px;
              margin-top: 20px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px dashed #e0e0e0;
            }
            .summary-row:last-child {
              border-bottom: none;
            }
            .total-row {
              font-size: 20px;
              font-weight: 700;
              color: #6B66FF;
              padding-top: 20px;
              margin-top: 10px;
              border-top: 2px solid #e0e0e0;
            }
            .bank-details {
              background-color: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .signature-area {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
              padding: 0 50px;
            }
            .signature-box {
              width: 200px;
              text-align: center;
            }
            .signature-line {
              width: 100%;
              border-top: 1px dashed #999;
              margin-bottom: 5px;
            }
            .receipt-footer {
              text-align: center;
              padding: 25px;
              color: #666;
              font-size: 14px;
            }
            .amount-highlight {
              color: #4CAF50;
              font-weight: 600;
            }
            .pending-amount {
              color: #f44336;
              font-weight: 600;
            }
            @media print {
              body {
                background: white;
              }
              .receipt-container {
                box-shadow: none;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="receipt-header">
              <h1 class="receipt-title">EMI Payment Receipt</h1>
              <div class="receipt-subtitle">Receipt No: ${receiptData.receiptNo}</div>
              <div class="receipt-subtitle">Date: ${format(new Date(receiptData.date), 'dd MMMM yyyy')}</div>
              <div class="status-badge ${receiptData.chequeStatus ? 'status-completed' : 'status-pending'}">
                ${receiptData.chequeStatus ? 'Payment Completed' : 'Payment Pending'}
              </div>
            </div>

            ${!receiptData.chequeStatus && receiptData.payMode === 'Cheque' ? `
              <div class="section" style="background-color: #fff3e0; border-left: 4px solid #ffa726;">
                <div style="color: #f57c00; font-weight: 500;">
                  ⚠️ Payment Pending: This receipt is subject to cheque clearance
                </div>
              </div>
            ` : ''}

            <div class="section">
              <h3 class="section-title">Property & Customer Details</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Customer Name</div>
                  <div class="info-value">${receiptData.customerName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Project Name</div>
                  <div class="info-value">${receiptData.projectName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Block & Plot</div>
                  <div class="info-value">${receiptData.block} - ${receiptData.plotNo}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Booking Code</div>
                  <div class="info-value">${receiptData.bookingCode}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h3 class="section-title">Payment Details</h3>
              <div class="payment-summary">
                <div class="summary-row">
                  <div class="info-label">Payment Mode</div>
                  <div class="info-value">${receiptData.payMode}</div>
                </div>
                <div class="summary-row">
                  <div class="info-label">Total Plot Cost</div>
                  <div class="info-value">₹${Number(receiptData.totalPlotCost).toLocaleString('en-IN')}</div>
                </div>
                <div class="summary-row">
                  <div class="info-label">Amount Paid (This Payment)</div>
                  <div class="info-value amount-highlight">₹${Number(receiptData.paidAmount).toLocaleString('en-IN')}</div>
                </div>
                <div class="summary-row">
                  <div class="info-label">Total Paid Till Date</div>
                  <div class="info-value amount-highlight">₹${Number(latestTotalPaid).toLocaleString('en-IN')}</div>
                </div>
                <div class="summary-row total-row">
                  <div class="info-label">Remaining Due Amount</div>
                  <div class="info-value pending-amount">₹${Number(remainingDue).toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            ${receiptData.payMode !== 'Cash' ? `
              <div class="section">
                <h3 class="section-title">Bank Details</h3>
                <div class="bank-details">
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Bank Name</div>
                      <div class="info-value">${receiptData.bankName}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Branch Name</div>
                      <div class="info-value">${receiptData.branchName}</div>
                    </div>
                    ${receiptData.payMode === 'Cheque' ? `
                      <div class="info-item">
                        <div class="info-label">Cheque Number</div>
                        <div class="info-value">${receiptData.chequeNo}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Cheque Date</div>
                        <div class="info-value">${format(new Date(receiptData.chequeDate), 'dd MMMM yyyy')}</div>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            ` : ''}

            ${receiptData.remark ? `
              <div class="section">
                <h3 class="section-title">Remarks</h3>
                <div class="info-value" style="font-style: italic;">${receiptData.remark}</div>
              </div>
            ` : ''}

            <div class="signature-area">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div style="color: #666;">Customer Signature</div>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <div style="color: #666;">Authorized Signature</div>
              </div>
            </div>

            <div class="receipt-footer">
              <p>This is a computer-generated receipt and does not require a physical signature.</p>
              <p>Thank you for your payment!</p>
            </div>
          </div>

          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="
              background: #6B66FF;
              color: white;
              border: none;
              padding: 12px 25px;
              border-radius: 4px;
              cursor: pointer;
              font-family: 'Poppins', sans-serif;
              font-weight: 500;
            ">Print Receipt</button>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(receiptHTML);
      printWindow.document.close();
    }
  };

  // Add a function to handle receipt download
  const handleDownloadReceipt = () => {
    if (receiptData) {
      const element = document.createElement('a');
      const receiptNo = receiptData.receiptNo || 'receipt';
      const date = new Date().toISOString().split('T')[0];
      element.setAttribute('href', `data:text/html;charset=utf-8,${encodeURIComponent(receiptData)}`);
      element.setAttribute('download', `EMI_Receipt_${receiptNo}_${date}.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.projectId}>
                <InputLabel>Select Project</InputLabel>
                <Select
                  value={formData.projectId}
                  onChange={handleProjectChange}
                  label="Select Project"
                  startAdornment={
                    <InputAdornment position="start">
                      <HomeIcon fontSize="small" />
                    </InputAdornment>
                  }
                  disabled={loading}
                >
                  {projects.map(project => (
                    <MenuItem key={project.projectId} value={project.projectId}>
                      {project.siteName || project.projectName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.projectId && <FormHelperText>{errors.projectId}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.blockId} disabled={!formData.projectId || loading}>
                <InputLabel>Select Block</InputLabel>
                <Select
                  value={formData.blockId}
                  onChange={handleBlockChange}
                  label="Select Block"
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationOnIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  {filteredBlocks.map(block => (
                    <MenuItem key={block.blockId} value={block.blockId}>
                      {block.block}
                    </MenuItem>
                  ))}
                </Select>
                {errors.blockId && <FormHelperText>{errors.blockId}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.addPlotId} disabled={!formData.blockId || loading}>
                <InputLabel>Select Plot</InputLabel>
                <Select
                  value={formData.addPlotId}
                  onChange={(e) => handlePlotSelect(e.target.value)}
                  label="Select Plot"
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationOnIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  {filteredPlots.map(plot => (
                    <MenuItem key={plot.addPlotId} value={plot.addPlotId}>
                      {plot.plotNo} - {plot.genrateEmistatus ? 'EMI Available' : 'Not Available'}
                    </MenuItem>
                  ))}
                </Select>
                {errors.addPlotId && <FormHelperText>{errors.addPlotId}</FormHelperText>}
              </FormControl>
            </Grid>

            {formData.addPlotId && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Chip label="Plot & Customer Details" color="primary" />
                  </Divider>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1 }} /> Customer Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="subtitle2" color="textSecondary">Customer Name</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{formData.customerName}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="subtitle2" color="textSecondary">Booking Code</Typography>
                          <Typography variant="body1">{formData.bookingCode}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="subtitle2" color="textSecondary">Customer ID</Typography>
                          <Typography variant="body1">{formData.customerId?.substring(0, 8)}...</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        <AccountBalanceWalletIcon sx={{ mr: 1 }} /> Financial Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="subtitle2" color="textSecondary">Total Plot Cost</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>₹{Number(formData.totalPlotCost).toLocaleString('en-IN')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="subtitle2" color="textSecondary">Booking Amount</Typography>
                          <Typography variant="body1">₹{Number(formData.bookingAmount).toLocaleString('en-IN')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="subtitle2" color="textSecondary">Due Amount</Typography>
                          <Typography variant="body1" color="primary">₹{Number(formData.dueAmount).toLocaleString('en-IN')}</Typography>
                        </Grid>
                        {formData.previousPaidAmount > 0 && (
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="subtitle2" color="textSecondary">Previously Paid</Typography>
                            <Typography variant="body1" color="success.main">₹{Number(formData.previousPaidAmount).toLocaleString('en-IN')}</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <PaymentsIcon sx={{ mr: 1 }} /> EMI Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Payment Date"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.date}
                        helperText={errors.date}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarTodayIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Installment Amount"
                        value={formData.installmentAmount}
                        InputProps={{
                          readOnly: true,
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Pending EMIs"
                        value={formData.pendingEmi}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Payable Amount"
                        name="payableAmount"
                        type="number"
                        value={formData.payableAmount}
                        onChange={handleInputChange}
                        required
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        error={!!errors.payableAmount}
                        helperText={errors.payableAmount}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.payMode}>
                        <InputLabel>Payment Mode</InputLabel>
                        <Select
                          name="payMode"
                          value={formData.payMode}
                          onChange={handleInputChange}
                          label="Payment Mode"
                          startAdornment={
                            <InputAdornment position="start">
                              <PaymentsIcon fontSize="small" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="Cash">Cash</MenuItem>
                          <MenuItem value="Cheque">Cheque</MenuItem>
                          <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
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
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        placeholder="Enter any additional information or notes about this payment"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              {formData.payMode !== 'Cash' ? (
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      <AccountBalanceIcon sx={{ mr: 1 }} /> Bank Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Bank Name"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          required
                          error={!!errors.bankName}
                          helperText={errors.bankName}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Branch Name"
                          name="branchName"
                          value={formData.branchName}
                          onChange={handleInputChange}
                          required
                          error={!!errors.branchName}
                          helperText={errors.branchName}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Account Number"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          required
                          error={!!errors.accountNumber}
                          helperText={errors.accountNumber}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={`${formData.payMode === 'Cheque' ? 'Cheque' : 'Reference'} Number`}
                          name="chequeNo"
                          value={formData.chequeNo}
                          onChange={handleInputChange}
                          required
                          error={!!errors.chequeNo}
                          helperText={errors.chequeNo}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={`${formData.payMode === 'Cheque' ? 'Cheque' : 'Transaction'} Date`}
                          type="date"
                          name="chequeDate"
                          value={formData.chequeDate}
                          onChange={handleInputChange}
                          InputLabelProps={{ shrink: true }}
                          required
                          error={!!errors.chequeDate}
                          helperText={errors.chequeDate}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ) : (
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.7, mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Cash Payment Selected
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph sx={{ maxWidth: 350, mx: 'auto' }}>
                      You've selected Cash as the payment mode. No additional bank or transaction details are required.
                    </Typography>
                    <Chip
                      label={`Amount: ₹${Number(formData.payableAmount).toLocaleString('en-IN')}`}
                      color="success"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Please review the payment details carefully before submitting.
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <HomeIcon sx={{ mr: 1 }} /> Property Details
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Project:</Typography>
                      <Typography variant="body2" fontWeight="medium">{formData.projectName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Block:</Typography>
                      <Typography variant="body2" fontWeight="medium">{formData.block}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Plot No:</Typography>
                      <Typography variant="body2" fontWeight="medium">{formData.plotNo}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Booking Code:</Typography>
                      <Typography variant="body2" fontWeight="medium">{formData.bookingCode}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} /> Customer Details
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Name:</Typography>
                      <Typography variant="body2" fontWeight="medium">{formData.customerName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Customer ID:</Typography>
                      <Typography variant="body2" fontWeight="medium">{formData.customerId?.substring(0, 8)}...</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <PaymentsIcon sx={{ mr: 1 }} /> EMI Details
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Installment Amount:</Typography>
                      <Typography variant="body2" fontWeight="medium">₹{Number(formData.installmentAmount).toLocaleString('en-IN')}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Pending EMIs:</Typography>
                      <Typography variant="body2" fontWeight="medium">{formData.pendingEmi}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Due Amount:</Typography>
                      <Typography variant="body2" fontWeight="medium">₹{Number(formData.dueAmount).toLocaleString('en-IN')}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Previously Paid:</Typography>
                      <Typography variant="body2" fontWeight="medium">₹{Number(formData.previousPaidAmount).toLocaleString('en-IN')}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Total After Payment:</Typography>
                      <Typography variant="body2" fontWeight="medium" color="success.main">
                        ₹{Number(parseFloat(formData.previousPaidAmount) + parseFloat(formData.payableAmount)).toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <ReceiptIcon sx={{ mr: 1 }} /> Payment Summary
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Payment Date:</Typography>
                          <Typography variant="body2" fontWeight="medium">{format(new Date(formData.date), 'dd MMM yyyy')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Payment Mode:</Typography>
                          <Chip label={formData.payMode} size="small" color="primary" variant="outlined" />
                        </Box>
                        {formData.payMode !== 'Cash' && (
                          <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Bank Name:</Typography>
                              <Typography variant="body2" fontWeight="medium">{formData.bankName}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">{formData.payMode === 'Cheque' ? 'Cheque' : 'Reference'} No:</Typography>
                              <Typography variant="body2" fontWeight="medium">{formData.chequeNo}</Typography>
                            </Box>
                          </>
                        )}
                        {formData.remark && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">Remarks:</Typography>
                            <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>"{formData.remark}"</Typography>
                          </Box>
                        )}
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ 
                        bgcolor: 'background.default', 
                        p: 3, 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Payment Breakdown
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Total Amount Due:</Typography>
                          <Typography variant="body1" fontWeight="medium">₹{Number(formData.dueAmount).toLocaleString('en-IN')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="body2">Remaining Balance (after payment):</Typography>
                          <Typography variant="body1" fontWeight="medium">₹{Number(formData.dueAmount - Number(formData.payableAmount)).toLocaleString('en-IN')}</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" fontWeight="bold">Amount to be Paid:</Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">₹{Number(formData.payableAmount).toLocaleString('en-IN')}</Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentsIcon sx={{ mr: 1 }} /> EMI Payment
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel={!isMobile} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIosIcon />}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{
                bgcolor: '#6B66FF',
                '&:hover': { bgcolor: '#5652e5' }
              }}
            >
              {saving ? 'Processing...' : 'Submit Payment'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              endIcon={<ArrowForwardIosIcon />}
              sx={{
                bgcolor: '#6B66FF',
                '&:hover': { bgcolor: '#5652e5' }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>

      {/* Receipt Dialog */}
      <Dialog
        open={showReceipt}
        onClose={handleCloseReceipt}
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
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ReceiptIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              Payment Receipt
            </Typography>
          </Box>
          <Box>
            <Button 
              variant="outlined"
              onClick={handleDownloadReceipt}
              startIcon={<DownloadIcon />}
              sx={{ mr: 1 }}
            >
              Download
            </Button>
            <Button 
              variant="contained" 
              onClick={handlePrintReceipt}
              startIcon={<PrintIcon />}
              sx={{
                bgcolor: '#6B66FF',
                '&:hover': { bgcolor: '#5652e5' }
              }}
            >
              Print Receipt
            </Button>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 0 }}>
          {receiptData && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  RE
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  EMI Payment Receipt
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {format(new Date(receiptData.date), 'dd MMMM yyyy')}
                </Typography>
                <Chip 
                  label={`Receipt: ${receiptData.receiptNo}`} 
                  color="primary" 
                  sx={{ position: 'absolute', top: 0, right: 0 }}
                />
                {formData.payMode === 'Cheque' && (
                  <Chip 
                    label={receiptData.chequeStatus ? 'Completed' : 'Pending Clearance'} 
                    color={receiptData.chequeStatus ? 'success' : 'warning'}
                    sx={{ position: 'absolute', top: 40, right: 0, mt: 1 }}
                  />
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        <HomeIcon sx={{ mr: 1 }} /> Property Details
                      </Typography>
                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Project:</Typography>
                          <Typography variant="body2" fontWeight="medium">{receiptData.projectName}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Block:</Typography>
                          <Typography variant="body2" fontWeight="medium">{receiptData.block}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Plot Number:</Typography>
                          <Typography variant="body2" fontWeight="medium">{receiptData.plotNo}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EMIPayment;