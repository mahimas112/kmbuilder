// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   Tooltip
// } from '@mui/material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import axiosInstance from 'axiosInstance';

// const AllEmiPayments = () => {
//   const [plots, setPlots] = useState([]);
//   const [emiPayments, setEmiPayments] = useState([]);
//   const [selectedPlot, setSelectedPlot] = useState(null);
//   const [showPaymentHistory, setShowPaymentHistory] = useState(false);

//   // Fetch all plots
//   useEffect(() => {
//     const fetchPlots = async () => {
//       try {
//         const response = await axiosInstance.get('https://app.ventureconsultancyservices.com/realEstate/plot-booking/getAllSellingOfPlots');
//         if (response.data && response.data.status === 200) {
//           // Filter plots with genrateEmistatus true
//           const emiPlots = response.data.data.filter(plot => plot.genrateEmistatus === true);
//           setPlots(emiPlots);
//         }
//       } catch (error) {
//         console.error('Error fetching plots:', error);
//       }
//     };

//     fetchPlots();
//   }, []);

//   // Fetch all EMI payments
//   useEffect(() => {
//     const fetchEmiPayments = async () => {
//       try {
//         const response = await axiosInstance.get('https://app.ventureconsultancyservices.com/realEstate/emiPayments/getAll');
//         if (response.data && response.data.status === 200) {
//           setEmiPayments(response.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching EMI payments:', error);
//       }
//     };

//     fetchEmiPayments();
//   }, []);

//   const handleViewPayments = (plot) => {
//     setSelectedPlot(plot);
//     setShowPaymentHistory(true);
//   };

//   const handleClosePaymentHistory = () => {
//     setShowPaymentHistory(false);
//     setSelectedPlot(null);
//   };

//   const getPlotPayments = (bookingCode) => {
//     return emiPayments.filter(payment => payment.bookingCode === bookingCode);
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" component="h1" gutterBottom>
//         EMI Plots List
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Plot No</TableCell>
//               <TableCell>Project</TableCell>
//               <TableCell>Block</TableCell>
//               <TableCell>Customer Name</TableCell>
//               <TableCell>Booking Code</TableCell>
//               <TableCell>Total Plot Cost</TableCell>
//               <TableCell>Due Amount</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {plots.map((plot) => (
//               <TableRow key={plot.plotsellingId}>
//                 <TableCell>{plot.plotNo}</TableCell>
//                 <TableCell>{plot.projectName}</TableCell>
//                 <TableCell>{plot.blockName}</TableCell>
//                 <TableCell>{plot.buyerName || '-'}</TableCell>
//                 <TableCell>{plot.bookingCode}</TableCell>
//                 <TableCell>₹{plot.totalPlotCost}</TableCell>
//                 <TableCell>₹{plot.dueAmount}</TableCell>
//                 <TableCell>
//                   <Tooltip title="View Payment History">
//                     <IconButton onClick={() => handleViewPayments(plot)}>
//                       <VisibilityIcon />
//                     </IconButton>
//                   </Tooltip>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Payment History Dialog */}
//       <Dialog
//         open={showPaymentHistory}
//         onClose={handleClosePaymentHistory}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           Payment History - {selectedPlot?.plotNo}
//         </DialogTitle>
//         <DialogContent>
//           {selectedPlot && (
//             <Box sx={{ mt: 2 }}>
//               <Typography variant="subtitle1" gutterBottom>
//                 Customer: {selectedPlot.buyerName}
//               </Typography>
//               <Typography variant="subtitle1" gutterBottom>
//                 Booking Code: {selectedPlot.bookingCode}
//               </Typography>

//               <TableContainer component={Paper} sx={{ mt: 2 }}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Date</TableCell>
//                       <TableCell>Receipt No</TableCell>
//                       <TableCell>Amount Paid</TableCell>
//                       <TableCell>Payment Mode</TableCell>
//                       <TableCell>Pending EMI</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {getPlotPayments(selectedPlot.bookingCode).map((payment) => (
//                       <TableRow key={payment.emiPaymentId}>
//                         <TableCell>{payment.date}</TableCell>
//                         <TableCell>{payment.receiptNo}</TableCell>
//                         <TableCell>₹{payment.paidAmount}</TableCell>
//                         <TableCell>{payment.payMode}</TableCell>
//                         <TableCell>{payment.pendingEmi}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClosePaymentHistory}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default AllEmiPayments;




import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  Backdrop,
  useTheme,
  useMediaQuery,
  TablePagination
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  Print as PrintIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarTodayIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  Done as DoneIcon,
  Close as CloseIcon,
  Add as AddIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  FilterList as FilterListIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  PersonOutline as PersonOutlineIcon,
  LocationOn as LocationOnIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

// Create a reusable API client with error handling
// const apiClient = axiosInstance.create({
//   baseURL: 'https://app.ventureconsultancyservices.com/realEstate'
// });

// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     console.error('API Error:', error);
//     return Promise.reject(error);
//   }
// );

// Status chip component
const StatusChip = ({ status }) => {
  let color = 'default';
  let label = 'Unknown';

  if (status === 'Completed') {
    color = 'success';
    label = 'Completed';
  } else if (status === 'Pending') {
    color = 'warning';
    label = 'Pending';
  } else if (status === 'Failed') {
    color = 'error';
    label = 'Failed';
  } else if (status === 'Processing') {
    color = 'info';
    label = 'Processing';
  } else if (status === 'Verified') {
    color = 'success';
    label = 'Verified';
  } else if (status === false) {
    color = 'warning';
    label = 'Pending';
  } else if (status === true) {
    color = 'success';
    label = 'Verified';
  }

  return <Chip size="small" color={color} label={label} />;
};

// Receipt component
const EmiReceipt = ({ payment, onClose, onPrint, getTotalEMIs,getInstallmentNumber }) => {
  if (!payment) return null;

  const handlePrint = () => {
    if (onPrint) onPrint(payment);
  };



  return (
    <Box sx={{ p: 3 }}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>EMI PAYMENT RECEIPT</Typography>
        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 500 }}>Receipt No: {payment.receiptNo}</Typography>
        <Typography variant="body2" color="text.secondary">Date: {format(new Date(payment.date), 'dd/MM/yyyy')}</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                <HomeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Property Details
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Box display="flex" mb={1}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: '40%' }}>
                    Project:
                  </Typography>
                  <Typography variant="body1" sx={{ width: '60%' }}>
                    {payment.projectName}
                  </Typography>
                </Box>
                <Box display="flex" mb={1}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: '40%' }}>
                    Block:
                  </Typography>
                  <Typography variant="body1" sx={{ width: '60%' }}>
                    {payment.block}
                  </Typography>
                </Box>
                <Box display="flex" mb={1}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: '40%' }}>
                    Plot Number:
                  </Typography>
                  <Typography variant="body1" sx={{ width: '60%' }}>
                    {payment.plotNo}
                  </Typography>
                </Box>
                <Box display="flex">
                  <Typography variant="body2" color="text.secondary" sx={{ width: '40%' }}>
                    Booking Code:
                  </Typography>
                  <Typography variant="body1" sx={{ width: '60%' }}>
                    {payment.bookingCode}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                <PersonOutlineIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Customer Details
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Box display="flex" mb={1}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: '40%' }}>
                    Name:
                  </Typography>
                  <Typography variant="body1" sx={{ width: '60%' }}>
                    {payment.customerName}
                  </Typography>
                </Box>
                <Box display="flex">
                  <Typography variant="body2" color="text.secondary" sx={{ width: '40%' }}>
                    Customer ID:
                  </Typography>
                  <Typography variant="body1" sx={{ width: '60%' }}>
                    {payment.customerId.substring(0, 12)}...
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
                    <Typography variant="body1">{payment.paymentType}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Payment Mode</Typography>
                    <Typography variant="body1">{payment.payMode}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Payment Date</Typography>
                    <Typography variant="body1">{format(new Date(payment.date), 'dd/MM/yyyy')}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Installment Number</Typography>
                    <Typography variant="body1">
                      {getInstallmentNumber(payment)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {payment.payMode !== 'Cash' && (
                <Box mt={2} p={2} bgcolor="background.paper" borderRadius={1}>
                  <Typography variant="subtitle2" gutterBottom>
                    {payment.payMode} Details
                  </Typography>
                  <Grid container spacing={2}>
                    {(payment.payMode === 'Cheque' || payment.payMode === 'DD') && (
                      <>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="body2" color="text.secondary">{payment.payMode} Number</Typography>
                          <Typography variant="body1">{payment.chequeNo}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="body2" color="text.secondary">{payment.payMode} Date</Typography>
                          <Typography variant="body1">{format(new Date(payment.chequeDate), 'dd/MM/yyyy')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="body2" color="text.secondary">Status</Typography>
                          <StatusChip status={payment.chequeStatus} />
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="body2" color="text.secondary">Bank Name</Typography>
                      <Typography variant="body1">{payment.bankName || 'N/A'}</Typography>
                    </Grid>
                    {payment.branchName && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="body2" color="text.secondary">Branch</Typography>
                        <Typography variant="body1">{payment.branchName}</Typography>
                      </Grid>
                    )}
                    {payment.accountNumber && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="body2" color="text.secondary">Account Number</Typography>
                        <Typography variant="body1">{payment.accountNumber}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Payable Amount</Typography>
                  <Typography variant="h6" color="text.primary">
                    ₹{payment.payableAmount.toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Amount Paid</Typography>
                  <Typography variant="h6" color="success.main" fontWeight="bold">
                    ₹{payment.paidAmount.toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" color="text.secondary">Remaining Due</Typography>
                  <Typography variant="h6" color="primary">
                    ₹{payment.dueAmount.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>

              {payment.remark && (
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">Remarks</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{payment.remark}</Typography>
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
  );
};

// Main component
const AllEmiPayments = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // States
  const [plots, setPlots] = useState([]);
  const [emiPayments, setEmiPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI States
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Fetch all plots with EMIs
  useEffect(() => {
    fetchPlots();
    fetchEmiPayments();
  }, []);

  // Filter EMI payments based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPayments(emiPayments);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = emiPayments.filter(payment => {
        return (
          (payment.customerName && payment.customerName.toLowerCase().includes(lowercasedFilter)) ||
          (payment.plotNo && payment.plotNo.toLowerCase().includes(lowercasedFilter)) ||
          (payment.projectName && payment.projectName.toLowerCase().includes(lowercasedFilter)) ||
          (payment.bookingCode && payment.bookingCode.toLowerCase().includes(lowercasedFilter)) ||
          (payment.receiptNo && payment.receiptNo.toLowerCase().includes(lowercasedFilter))
        );
      });
      setFilteredPayments(filtered);
    }
  }, [searchTerm, emiPayments]);

  const fetchPlots = async () => {
    try {
      const response = await axiosInstance.get('/realEstate/plot-booking/getAllSellingOfPlots');
      if (response.data && response.data.data) {
        // Filter plots with EMI plan type
        const emiPlots = response.data.data.filter(plot => plot.planType === 'EMI Plan');
        setPlots(emiPlots);
      }
    } catch (error) {
      setError('Failed to fetch plots data');
      console.error('Error fetching plots:', error);
    }
  };

  const fetchEmiPayments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/realEstate/emiPayments/getAll');
      if (response.data && response.data.data) {
        const payments = response.data.data;
        // Ensure the data is sorted by date (newest first)
        payments.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEmiPayments(payments);
        setFilteredPayments(payments);
      }
    } catch (error) {
      setError('Failed to fetch EMI payments data');
      console.error('Error fetching EMI payments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine total number of EMIs for a booking
  // Determine total number of EMIs for a booking
  const getTotalEMIs = (bookingCode) => {
    // Get all payments for this booking
    const bookingPayments = emiPayments.filter(p => p.bookingCode === bookingCode);

    if (bookingPayments.length === 0) return 12; // Default value

    // Sort payments by date to find the first one
    const sortedPayments = [...bookingPayments].sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );

    // Get the first payment's pendingEmi value
    const firstPayment = sortedPayments[0];

    // Total EMIs should be the initial pendingEmi value (before any payments)
    return firstPayment.pendingEmi;
  };

  // Calculate current installment number
  const getInstallmentNumber = (payment) => {
    if (payment.pendingEmi === 0) return "Final Payment";

    const totalEMIs = getTotalEMIs(payment.bookingCode);
    // Current installment = total - remaining + 1
    const currentInstallment = totalEMIs - payment.pendingEmi + 1;

    return `${currentInstallment} of ${totalEMIs}`;
  };

  const handleViewPayments = (plot) => {
    setSelectedPlot(plot);
    setShowPaymentHistory(true);
  };

  const handleClosePaymentHistory = () => {
    setShowPaymentHistory(false);
    setSelectedPlot(null);
  };

  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setSelectedPayment(null);
  };

  const handlePrintReceipt = (payment) => {
    const printWindow = window.open('', '_blank');

    if (printWindow && payment) {
      printWindow.document.write(`
        <html>
          <head>
            <title>EMI Payment Receipt - ${payment.receiptNo}</title>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
            <style>
              body { 
                font-family: 'Roboto', Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
                color: #333;
              }
              .receipt { 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 30px; 
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                border-radius: 8px;
              }
              .header { 
                text-align: center;
                margin-bottom: 30px;
              }
              .company-logo {
                text-align: center;
                margin-bottom: 15px;
              }
              .logo-placeholder {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 60px;
                height: 60px;
                background: linear-gradient(45deg, #6B66FF, #4E4BB8);
                color: white;
                border-radius: 8px;
                font-weight: bold;
                font-size: 24px;
              }
              .receipt-title {
                font-size: 24px;
                font-weight: 700;
                margin: 10px 0 5px;
              }
              .receipt-no {
                font-size: 16px;
                color: #6B66FF;
                font-weight: 500;
                margin-bottom: 5px;
              }
              .receipt-date {
                font-size: 14px;
                color: #777;
              }
              .section { 
                margin-bottom: 25px; 
              }
              .section-title { 
                font-size: 18px;
                font-weight: 600;
                color: #6B66FF;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #e0e0e0;
                padding-bottom: 8px;
              }
              .grid-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 20px;
              }
              .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
              }
              .info-item {
                padding: 15px;
                background-color: #f9f9f9;
                border-radius: 8px;
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
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 25px;
              }
              .payment-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
              }
              .payment-label {
                font-weight: 500;
                color: #777;
              }
              .payment-value {
                font-weight: 600;
              }
              .payment-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr;
                gap: 15px;
                margin-bottom: 20px;
              }
              .payment-field {
                padding: 10px;
              }
              .bank-details {
                background-color: #f0f5ff;
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
              }
              .status-chip {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
                background-color: #ffc107;
                color: white;
              }
              .status-success {
                background-color: #4caf50;
              }
              .amount-row {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 2px solid #e0e0e0;
              }
              .amount-box {
                text-align: center;
                padding: 10px;
                background-color: #f9f9f9;
                border-radius: 8px;
                min-width: 150px;
              }
              .amount-label {
                font-size: 14px;
                color: #777;
                margin-bottom: 5px;
              }
              .amount-value {
                font-size: 18px;
                font-weight: 700;
              }
              .amount-paid {
                color: #4caf50;
              }
              .amount-due {
                color: #6B66FF;
              }
              .signature-section {
                display: flex;
                justify-content: space-between;
                margin-top: 50px;
              }
              .signature-box {
                width: 45%;
                text-align: center;
              }
              .signature-line {
                border-top: 1px dashed #999;
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
              .no-print { 
                text-align: center;
                margin-top: 30px;
              }
              .btn {
                background-color: #6B66FF;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Roboto', sans-serif;
                font-weight: 500;
                margin: 0 10px;
              }
              .btn-secondary {
                background-color: #9e9e9e;
              }
              @media print {
                .no-print { display: none; }
                body { padding: 0; }
                .receipt { box-shadow: none; }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="company-logo">
                  <div class="logo-placeholder">RE</div>
                </div>
                <h1 class="receipt-title">EMI PAYMENT RECEIPT</h1>
                <div class="receipt-no">Receipt No: ${payment.receiptNo}</div>
                <div class="receipt-date">Date: ${format(new Date(payment.date), 'dd MMM yyyy')}</div>
              </div>
              
              <div class="grid-container">
                <div class="section">
                  <div class="section-title">
                    <span style="margin-right: 8px;">📍</span> Property Details
                  </div>
                  <div class="info-item">
                    <div class="info-label">Project Name</div>
                    <div class="info-value">${payment.projectName}</div>
                  </div>
                  <div class="info-item" style="margin-top: 10px;">
                    <div class="info-label">Block</div>
                    <div class="info-value">${payment.block}</div>
                  </div>
                  <div class="info-item" style="margin-top: 10px;">
                    <div class="info-label">Plot Number</div>
                    <div class="info-value">${payment.plotNo}</div>
                  </div>
                  <div class="info-item" style="margin-top: 10px;">
                    <div class="info-label">Booking Code</div>
                    <div class="info-value">${payment.bookingCode}</div>
                  </div>
                </div>
                
                <div class="section">
                  <div class="section-title">
                    <span style="margin-right: 8px;">👤</span> Customer Details
                  </div>
                  <div class="info-item">
                    <div class="info-label">Customer Name</div>
                    <div class="info-value">${payment.customerName}</div>
                  </div>
                  <div class="info-item" style="margin-top: 10px;">
                    <div class="info-label">Customer ID</div>
                    <div class="info-value">${payment.customerId.substring(0, 12)}...</div>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">
                  <span style="margin-right: 8px;">💳</span> Payment Details
                </div>
                <div class="payment-grid">
                  <div class="payment-field">
                    <div class="info-label">Payment Type</div>
                    <div class="info-value">${payment.paymentType}</div>
                  </div>
                  <div class="payment-field">
                    <div class="info-label">Payment Mode</div>
                    <div class="info-value">${payment.payMode}</div>
                  </div>
                  <div class="payment-field">
                    <div class="info-label">Payment Date</div>
                    <div class="info-value">${format(new Date(payment.date), 'dd/MM/yyyy')}</div>
                  </div>
                  <div class="payment-field">
                    <div class="info-label">Installment Number</div>
                    <div class="info-value">${13 - payment.pendingEmi} of 12</div>
                  </div>
                </div>
                
                ${payment.payMode !== 'Cash' ? `
                  <div class="bank-details">
                    <div class="section-title" style="margin-top: 0; border-bottom: none; padding-bottom: 0; margin-bottom: 10px;">
                      <span style="margin-right: 8px;">🏦</span> ${payment.payMode} Details
                    </div>
                    <div class="payment-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                      ${(payment.payMode === 'Cheque' || payment.payMode === 'DD') ? `
                        <div class="payment-field">
                          <div class="info-label">${payment.payMode} Number</div>
                          <div class="info-value">${payment.chequeNo}</div>
                        </div>
                        <div class="payment-field">
                          <div class="info-label">${payment.payMode} Date</div>
                          <div class="info-value">${format(new Date(payment.chequeDate), 'dd/MM/yyyy')}</div>
                        </div>
                        <div class="payment-field">
                          <div class="info-label">Status</div>
                          <div class="status-chip ${payment.chequeStatus ? 'status-success' : ''}">
                            ${payment.chequeStatus ? 'Verified' : 'Pending'}
                          </div>
                        </div>
                      ` : ''}
                      <div class="payment-field">
                        <div class="info-label">Bank Name</div>
                        <div class="info-value">${payment.bankName || 'N/A'}</div>
                      </div>
                      ${payment.branchName ? `
                        <div class="payment-field">
                          <div class="info-label">Branch</div>
                          <div class="info-value">${payment.branchName}</div>
                        </div>
                      ` : ''}
                      ${payment.accountNumber ? `
                        <div class="payment-field">
                          <div class="info-label">Account Number</div>
                          <div class="info-value">${payment.accountNumber}</div>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                ` : ''}
                
                <div class="amount-row">
                  <div class="amount-box">
                    <div class="amount-label">Payable Amount</div>
                    <div class="amount-value">₹${payment.payableAmount.toLocaleString('en-IN')}</div>
                  </div>
                  <div class="amount-box">
                    <div class="amount-label">Amount Paid</div>
                    <div class="amount-value amount-paid">₹${payment.paidAmount.toLocaleString('en-IN')}</div>
                  </div>
                  <div class="amount-box">
                    <div class="amount-label">Remaining Due</div>
                    <div class="amount-value amount-due">₹${payment.dueAmount.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                
                ${payment.remark ? `
                  <div style="margin-top: 20px; padding: 10px; background-color: #f9f9f9; border-radius: 8px;">
                    <div class="info-label">Remarks</div>
                    <div class="info-value">${payment.remark}</div>
                  </div>
                ` : ''}
              </div>
              
              <div class="signature-section">
                <div class="signature-box">
                  <div class="signature-lineCustomer Signature</div>
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
              
              <div class="no-print">
                <button class="btn" onclick="window.print()">Print Receipt</button>
                <button class="btn btn-secondary" onclick="window.close()">Close</button>
              </div>
            </body>
          </html>
        `);

      printWindow.document.close();
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddNewPayment = () => {
    navigate('/emi-payments/add');
  };

  // Get Payments for a specific plot
  const getPlotPayments = (bookingCode) => {
    return emiPayments.filter(payment => payment.bookingCode === bookingCode);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
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
          EMI Payment Records
        </Typography>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          width: { xs: '100%', sm: 'auto' }
        }}>
          <TextField
            placeholder="Search payments..."
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
            onClick={handleAddNewPayment}
            sx={{
              bgcolor: '#6B66FF',
              '&:hover': { bgcolor: '#5652e5' }
            }}
          >
            New EMI Payment
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* EMI Payments Table */}
      <TableContainer component={Paper} elevation={1} sx={{ mb: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Receipt No</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Plot No</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount Paid</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Payment Mode</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading payment records...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                  <Typography variant="body1">
                    No payment records found. {searchTerm && "Try adjusting your search criteria."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((payment) => (
                  <TableRow key={payment.emiPaymentId} hover>
                    <TableCell>{payment.receiptNo}</TableCell>
                    <TableCell>{format(new Date(payment.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{payment.customerName}</TableCell>
                    <TableCell>{payment.plotNo}</TableCell>
                    <TableCell>{payment.projectName}</TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {formatCurrency(payment.paidAmount)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.payMode}
                        size="small"
                        color={payment.payMode === 'Cash' ? 'success' : 'primary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {payment.payMode === 'Cheque' || payment.payMode === 'DD' ? (
                        <StatusChip status={payment.chequeStatus} />
                      ) : (
                        <Chip size="small" color="success" label="Completed" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Receipt">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewReceipt(payment)}
                          >
                            <ReceiptIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Receipt">
                          <IconButton
                            size="small"
                            onClick={() => handlePrintReceipt(payment)}
                          >
                            <PrintIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredPayments.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Rows per page:"
      />

      {/* Payment History Dialog */}
      <Dialog
        open={showPaymentHistory}
        onClose={handleClosePaymentHistory}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <AccountBalanceWalletIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Payment History - {selectedPlot?.plotNo}
          </Box>
          <IconButton color="inherit" onClick={handleClosePaymentHistory} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedPlot && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                        Property Details
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Project:</Typography>
                          <Typography variant="body1">{selectedPlot.projectName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Block:</Typography>
                          <Typography variant="body1">{selectedPlot.blockName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Plot Number:</Typography>
                          <Typography variant="body1">{selectedPlot.plotNo}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Booking Code:</Typography>
                          <Typography variant="body1">{selectedPlot.bookingCode}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        <PaymentIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                        Payment Summary
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Customer:</Typography>
                          <Typography variant="body1">{selectedPlot.buyerName || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Total Cost:</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatCurrency(selectedPlot.totalPlotCost)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Booking Amount:</Typography>
                          <Typography variant="body1">
                            {formatCurrency(selectedPlot.bookingAmount)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Due Amount:</Typography>
                          <Typography variant="body1" color="primary.main" fontWeight="medium">
                            {formatCurrency(selectedPlot.dueAmount)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                Payment History
              </Typography>

              <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Receipt No</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Amount Paid</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Payment Mode</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Remaining EMIs</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getPlotPayments(selectedPlot.bookingCode).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          <Typography variant="body1">No payment records found for this plot.</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      getPlotPayments(selectedPlot.bookingCode).map((payment) => (
                        <TableRow key={payment.emiPaymentId} hover>
                          <TableCell>{format(new Date(payment.date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{payment.receiptNo}</TableCell>
                          <TableCell sx={{ fontWeight: 'medium' }}>
                            {formatCurrency(payment.paidAmount)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={payment.payMode}
                              size="small"
                              color={payment.payMode === 'Cash' ? 'success' : 'primary'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{payment.pendingEmi}</TableCell>
                          <TableCell>
                            {payment.payMode === 'Cheque' || payment.payMode === 'DD' ? (
                              <StatusChip status={payment.chequeStatus} />
                            ) : (
                              <Chip size="small" color="success" label="Completed" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Receipt">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleViewReceipt(payment)}
                                >
                                  <ReceiptIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Print Receipt">
                                <IconButton
                                  size="small"
                                  onClick={() => handlePrintReceipt(payment)}
                                >
                                  <PrintIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentHistory} variant="outlined">
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNewPayment}
            sx={{
              bgcolor: '#6B66FF',
              '&:hover': { bgcolor: '#5652e5' }
            }}
          >
            Add New Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog
        open={showReceipt}
        onClose={handleCloseReceipt}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box display="flex" alignItems="center">
            <ReceiptIcon sx={{ mr: 1 }} />
            Payment Receipt
          </Box>
          <Box>
            <IconButton
              color="inherit"
              onClick={() => handlePrintReceipt(selectedPayment)}
              title="Print Receipt"
              size="small"
              sx={{ mr: 1 }}
            >
              <PrintIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleCloseReceipt}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{
          p: 0,
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px'
          }
        }}>
          {selectedPayment && (
            <EmiReceipt
              payment={selectedPayment}
              onClose={handleCloseReceipt}
              onPrint={() => handlePrintReceipt(selectedPayment)}
              getTotalEMIs={getTotalEMIs}
              getInstallmentNumber={getInstallmentNumber}
            />
          )}
        </DialogContent>
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

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading && !error}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default AllEmiPayments;