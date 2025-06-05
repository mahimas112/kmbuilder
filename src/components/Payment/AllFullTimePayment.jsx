// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Button, 
//   Paper, 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableContainer, 
//   TableHead, 
//   TableRow,
//   Typography,
//   IconButton,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   CircularProgress,
//   TablePagination,
//   useMediaQuery,
//   Card,
//   CardContent,
//   Grid
// } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import {
//   Add as AddIcon,
//   Visibility as VisibilityIcon,
//   Receipt as ReceiptIcon,
//   Print as PrintIcon,
//   Search as SearchIcon
// } from '@mui/icons-material';
// import { format } from 'date-fns';

// const FullPaymentTable = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   // Fetch data from API
//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('https://app.ventureconsultancyservices.com/realEstate/fullPayment/all');
//         const result = await response.json();
//         if (result.status === 200) {
//           setPayments(result.data);
//         } else {
//           console.error('Failed to fetch payments');
//         }
//       } catch (error) {
//         console.error('Error fetching payments:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPayments();
//   }, []);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleShowReceipt = (payment) => {
//     setSelectedPayment(payment);
//     setOpenReceiptDialog(true);
//   };

//   const handleShowDetails = (payment) => {
//     setSelectedPayment(payment);
//     setOpenDetailsDialog(true);
//   };

//   const handlePrintReceipt = () => {
//     const printWindow = window.open('', '_blank');

//     if (printWindow && selectedPayment) {
//       const formData = selectedPayment;

//       printWindow.document.write(`
//       <html>
//         <head>
//           <title>Payment Receipt - ${formData.reciptNo}</title>
//           <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
//           <style>
//             body { 
//               font-family: 'Quicksand', Arial, sans-serif; 
//               margin: 0; 
//               padding: 0; 
//               color: #333;
//             }
//             .receipt { 
//               max-width: 800px; 
//               margin: 0 auto; 
//               padding: 30px; 
//               box-shadow: 0 0 10px rgba(0,0,0,0.1);
//               background-color: #fff;
//             }
//             .header { 
//               text-align: center; 
//               position: relative;
//               padding-bottom: 15px;
//               margin-bottom: 20px;
//             }
//             .header:after {
//               content: "";
//               display: block;
//               width: 100%;
//               height: 2px;
//               background: linear-gradient(to right, #2c3e50, #3498db, #2c3e50);
//               position: absolute;
//               bottom: 0;
//               left: 0;
//             }
//             .logo-container {
//               position: absolute;
//               top: 0;
//               left: 0;
//             }
//             .company-logo {
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               width: 50px;
//               height: 50px;
//               background: linear-gradient(to bottom, #2c3e50, #3498db);
//               color: white;
//               border-radius: 5px;
//               font-weight: bold;
//               margin-right: 10px;
//             }
//             .receipt-title {
//               font-size: 24px;
//               font-weight: 700;
//               color: #2c3e50;
//               margin: 0;
//             }
//             .receipt-no { 
//               font-size: 16px; 
//               color: #3498db; 
//               font-weight: 500;
//               margin: 5px 0;
//             }
//             .receipt-date {
//               font-size: 14px;
//               color: #777;
//             }
//             .section { 
//               margin-bottom: 25px; 
//               padding-bottom: 5px;
//             }
//             .section-title { 
//               border-left: 4px solid #3498db; 
//               padding-left: 10px; 
//               font-size: 16px;
//               font-weight: 600;
//               color: #2c3e50;
//               margin-bottom: 15px;
//             }
//             .info-grid {
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 15px;
//             }
//             .info-item {
//               padding: 10px;
//               background-color: #f9f9f9;
//               border-radius: 5px;
//             }
//             .info-label { 
//               font-weight: 500; 
//               font-size: 13px;
//               color: #777;
//               margin-bottom: 5px;
//             }
//             .info-value { 
//               font-weight: 600;
//               color: #333;
//               font-size: 15px;
//             }
//             .payment-details {
//               background-color: #f9f9f9;
//               padding: 15px;
//               border-radius: 5px;
//             }
//             .payment-row {
//               display: flex;
//               justify-content: space-between;
//               padding: 8px 0;
//               border-bottom: 1px solid #eee;
//             }
//             .payment-row:last-child {
//               border-bottom: none;
//             }
//             .payment-label {
//               font-weight: 500;
//             }
//             .payment-value {
//               font-weight: 600;
//             }
//             .total-row { 
//               font-size: 18px; 
//               font-weight: 700; 
//               color: #2c3e50;
//               margin-top: 10px;
//               padding-top: 10px;
//               border-top: 2px solid #3498db;
//             }
//             .signature-section {
//               margin-top: 50px;
//               display: flex;
//               justify-content: space-between;
//             }
//             .signature-box {
//               width: 45%;
//               text-align: center;
//             }
//             .signature-line {
//               border-top: 1px solid #ccc;
//               padding-top: 5px;
//               margin-top: 40px;
//               font-weight: 500;
//             }
//             .footer { 
//               margin-top: 30px; 
//               text-align: center; 
//               font-size: 12px; 
//               color: #777;
//               border-top: 1px solid #eee;
//               padding-top: 20px;
//             }
//             .receipt-header-right {
//               position: absolute;
//               top: 0;
//               right: 0;
//               text-align: right;
//               font-size: 12px;
//               color: #777;
//             }
//             @media print { 
//               .no-print { display: none; } 
//               .receipt { box-shadow: none; } 
//             }
//           </style>
//         </head>
//         <body>
//           <div class="receipt">
//             <div class="header">
//               <div class="logo-container">
//                 <div class="company-logo">RE</div>
//               </div>
//               <div class="receipt-header-right">
//                 <div>www.yourcompany.com</div>
//                 <div>Phone: +91 123-456-7890</div>
//                 <div>info@yourcompany.com</div>
//               </div>
//               <h1 class="receipt-title">Real Estate Receipt</h1>
//               <div class="receipt-no">Receipt No: ${formData.reciptNo}</div>
//               <div class="receipt-date">Date: ${format(new Date(formData.date), 'dd/MM/yyyy')}</div>
//             </div>

//             <div class="section">
//               <div class="section-title">Property Details</div>
//               <div class="info-grid">
//                 <div class="info-item">
//                   <div class="info-label">Project Name</div>
//                   <div class="info-value">${formData.projectName}</div>
//                 </div>
//                 <div class="info-item">
//                   <div class="info-label">Block Number</div>
//                   <div class="info-value">${formData.blockNo}</div>
//                 </div>
//                 <div class="info-item">
//                   <div class="info-label">Plot Number</div>
//                   <div class="info-value">${formData.plotNo}</div>
//                 </div>
//                 <div class="info-item">
//                   <div class="info-label">Booking Code</div>
//                   <div class="info-value">${formData.bookingCode}</div>
//                 </div>
//               </div>
//             </div>

//             <div class="section">
//               <div class="section-title">Customer Details</div>
//               <div class="info-grid">
//                 <div class="info-item">
//                   <div class="info-label">Customer Name</div>
//                   <div class="info-value">${formData.customerName || 'N/A'}</div>
//                 </div>
//                 <div class="info-item">
//                   <div class="info-label">Customer ID</div>
//                   <div class="info-value">${formData.customerId || 'N/A'}</div>
//                 </div>
//               </div>
//             </div>

//             <div class="section">
//               <div class="section-title">Payment Details</div>
//               <div class="payment-details">
//                 <div class="payment-row">
//                   <div class="payment-label">Payment Type</div>
//                   <div class="payment-value">${formData.paymentType}</div>
//                 </div>
//                 <div class="payment-row">
//                   <div class="payment-label">Payment Mode</div>
//                   <div class="payment-value">${formData.payMode}</div>
//                 </div>
//                 ${formData.payMode !== 'Cash' ? `
//                   <div class="payment-row">
//                     <div class="payment-label">Bank Name</div>
//                     <div class="payment-value">${formData.bankName || 'N/A'}</div>
//                   </div>
//                   ${formData.branchName ? `
//                     <div class="payment-row">
//                       <div class="payment-label">Branch Name</div>
//                       <div class="payment-value">${formData.branchName}</div>
//                     </div>
//                   ` : ''}
//                   ${formData.payMode === 'Online Transfer' ? `
//                     <div class="payment-row">
//                       <div class="payment-label">Account Number</div>
//                       <div class="payment-value">${formData.accountNumber || 'N/A'}</div>
//                     </div>
//                   ` : ''}
//                   ${(formData.payMode === 'Cheque' || formData.payMode === 'DD') ? `
//                     <div class="payment-row">
//                       <div class="payment-label">${formData.payMode} Number</div>
//                       <div class="payment-value">${formData.chequeNo || 'N/A'}</div>
//                     </div>
//                     <div class="payment-row">
//                       <div class="payment-label">${formData.payMode} Date</div>
//                       <div class="payment-value">${formData.chequeDate ? format(new Date(formData.chequeDate), 'dd/MM/yyyy') : 'N/A'}</div>
//                     </div>
//                   ` : ''}
//                 ` : ''}
//                 <div class="payment-row">
//                   <div class="payment-label">Payable Amount</div>
//                   <div class="payment-value">₹${parseFloat(formData.payableAmount).toLocaleString()}</div>
//                 </div>
//                 <div class="payment-row total-row">
//                   <div class="payment-label">Amount Paid</div>
//                   <div class="payment-value">₹${parseFloat(formData.paidAmount).toLocaleString()}</div>
//                 </div>
//               </div>
//             </div>

//             ${formData.remark ? `
//               <div class="section">
//                 <div class="section-title">Remarks</div>
//                 <div class="info-item">
//                   <div class="info-value">${formData.remark}</div>
//                 </div>
//               </div>
//             ` : ''}

//             <div class="signature-section">
//               <div class="signature-box">
//                 <div class="signature-line">Customer Signature</div>
//               </div>
//               <div class="signature-box">
//                 <div class="signature-line">Authorized Signature</div>
//               </div>
//             </div>

//             <div class="footer">
//               <p>This is a computer-generated receipt and does not require a physical signature.</p>
//               <p>Thank you for your payment!</p>
//             </div>
//           </div>

//           <div class="no-print" style="text-align: center; margin-top: 20px;">
//             <button onclick="window.print()" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px; font-family: 'Quicksand', sans-serif; font-weight: 600;">Print Receipt</button>
//             <button onclick="window.close()" style="background-color: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-family: 'Quicksand', sans-serif; font-weight: 600;">Close</button>
//           </div>
//         </body>
//       </html>
//     `);

//       printWindow.document.close();
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       return format(new Date(dateString), 'dd/MM/yyyy');
//     } catch {
//       return 'Invalid date';
//     }
//   };

//   // Display card view for mobile
//   const renderMobileView = () => {
//     return (
//       <Box>
//         {payments
//           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//           .map((payment) => (
//             <Card sx={{ mb: 2, boxShadow: 2 }} key={payment.fullPaymentId}>
//               <CardContent>
//                 <Typography variant="h6" sx={{ mb: 1, color: theme.palette.primary.main }}>
//                   {payment.projectName} - {payment.plotNo}
//                 </Typography>

//                 <Grid container spacing={1} sx={{ mb: 1 }}>
//                   <Grid item xs={6}>
//                     <Typography variant="caption" color="textSecondary">Receipt No</Typography>
//                     <Typography variant="body2">{payment.reciptNo}</Typography>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="caption" color="textSecondary">Date</Typography>
//                     <Typography variant="body2">{formatDate(payment.date)}</Typography>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="caption" color="textSecondary">Customer</Typography>
//                     <Typography variant="body2">{payment.customerName || 'N/A'}</Typography>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="caption" color="textSecondary">Amount</Typography>
//                     <Typography variant="body2" fontWeight="bold">₹{parseFloat(payment.paidAmount).toLocaleString()}</Typography>
//                   </Grid>
//                 </Grid>

//                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
//                   <Button 
//                     size="small" 
//                     startIcon={<VisibilityIcon />} 
//                     onClick={() => handleShowDetails(payment)}
//                     sx={{ mr: 1 }}
//                   >
//                     View
//                   </Button>
//                   <Button 
//                     size="small" 
//                     color="primary" 
//                     variant="contained" 
//                     startIcon={<ReceiptIcon />}
//                     onClick={() => handleShowReceipt(payment)}
//                   >
//                     Receipt
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           ))}
//       </Box>
//     );
//   };

//   // Display table view for desktop
//   const renderTableView = () => {
//     return (
//       <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
//         <Table sx={{ minWidth: 650 }}>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: theme.palette.primary.light }}>
//               <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Receipt No</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Date</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Project</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Plot</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Customer</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Payment Mode</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Amount</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {payments
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((payment) => (
//                 <TableRow key={payment.fullPaymentId} hover>
//                   <TableCell>{payment.reciptNo}</TableCell>
//                   <TableCell>{formatDate(payment.date)}</TableCell>
//                   <TableCell>{payment.projectName}</TableCell>
//                   <TableCell>{payment.plotNo}</TableCell>
//                   <TableCell>{payment.customerName || 'N/A'}</TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={payment.payMode} 
//                       size="small"
//                       color={payment.payMode === 'Cash' ? 'success' : 'primary'}
//                       variant="outlined"
//                     />
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>
//                     ₹{parseFloat(payment.paidAmount).toLocaleString()}
//                   </TableCell>
//                   <TableCell>
//                     <IconButton 
//                       size="small" 
//                       color="primary" 
//                       onClick={() => handleShowDetails(payment)}
//                       title="View Details"
//                     >
//                       <VisibilityIcon fontSize="small" />
//                     </IconButton>
//                     <IconButton 
//                       size="small" 
//                       color="secondary" 
//                       onClick={() => handleShowReceipt(payment)}
//                       title="Show Receipt"
//                     >
//                       <ReceiptIcon fontSize="small" />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     );
//   };

//   // Payment Details Dialog
//   const PaymentDetailsDialog = () => {
//     if (!selectedPayment) return null;

//     return (
//       <Dialog
//         open={openDetailsDialog}
//         onClose={() => setOpenDetailsDialog(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
//           Payment Details
//         </DialogTitle>
//         <DialogContent dividers>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Typography variant="h6" gutterBottom>
//                 Property Information
//               </Typography>
//               <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="textSecondary">Project Name</Typography>
//                     <Typography variant="body1">{selectedPayment.projectName}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="textSecondary">Block No</Typography>
//                     <Typography variant="body1">{selectedPayment.block}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="textSecondary">Plot No</Typography>
//                     <Typography variant="body1">{selectedPayment.plotNo}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="textSecondary">Booking Code</Typography>
//                     <Typography variant="body1">{selectedPayment.bookingCode}</Typography>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="h6" gutterBottom>
//                 Customer Information
//               </Typography>
//               <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="textSecondary">Customer Name</Typography>
//                     <Typography variant="body1">{selectedPayment.customerName || 'N/A'}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="textSecondary">Customer ID</Typography>
//                     <Typography variant="body1">{selectedPayment.customerId || 'N/A'}</Typography>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="h6" gutterBottom>
//                 Payment Information
//               </Typography>
//               <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="textSecondary">Receipt No</Typography>
//                     <Typography variant="body1">{selectedPayment.reciptNo}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="textSecondary">Date</Typography>
//                     <Typography variant="body1">{formatDate(selectedPayment.date)}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="textSecondary">Payment Type</Typography>
//                     <Typography variant="body1">{selectedPayment.paymentType}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="textSecondary">Payment Mode</Typography>
//                     <Typography variant="body1">{selectedPayment.payMode}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="textSecondary">Payable Amount</Typography>
//                     <Typography variant="body1">₹{parseFloat(selectedPayment.payableAmount).toLocaleString()}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="textSecondary">Paid Amount</Typography>
//                     <Typography variant="body1" sx={{ fontWeight: 'bold' }}>₹{parseFloat(selectedPayment.paidAmount).toLocaleString()}</Typography>
//                   </Grid>

//                   {selectedPayment.payMode !== 'Cash' && (
//                     <>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="textSecondary">Bank Name</Typography>
//                         <Typography variant="body1">{selectedPayment.bankName || 'N/A'}</Typography>
//                       </Grid>
//                       {selectedPayment.branchName && (
//                         <Grid item xs={12} sm={6}>
//                           <Typography variant="subtitle2" color="textSecondary">Branch Name</Typography>
//                           <Typography variant="body1">{selectedPayment.branchName}</Typography>
//                         </Grid>
//                       )}
//                       {selectedPayment.payMode === 'Online Transfer' && (
//                         <Grid item xs={12} sm={6}>
//                           <Typography variant="subtitle2" color="textSecondary">Account Number</Typography>
//                           <Typography variant="body1">{selectedPayment.accountNumber || 'N/A'}</Typography>
//                         </Grid>
//                       )}
//                       {(selectedPayment.payMode === 'Cheque' || selectedPayment.payMode === 'DD') && (
//                         <>
//                           <Grid item xs={12} sm={6}>
//                             <Typography variant="subtitle2" color="textSecondary">{selectedPayment.payMode} Number</Typography>
//                             <Typography variant="body1">{selectedPayment.chequeNo || 'N/A'}</Typography>
//                           </Grid>
//                           <Grid item xs={12} sm={6}>
//                             <Typography variant="subtitle2" color="textSecondary">{selectedPayment.payMode} Date</Typography>
//                             <Typography variant="body1">
//                               {selectedPayment.chequeDate ? formatDate(selectedPayment.chequeDate) : 'N/A'}
//                             </Typography>
//                           </Grid>
//                         </>
//                       )}
//                     </>
//                   )}
//                 </Grid>
//               </Paper>
//             </Grid>

//             {selectedPayment.remark && (
//               <Grid item xs={12}>
//                 <Typography variant="h6" gutterBottom>
//                   Remarks
//                 </Typography>
//                 <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
//                   <Typography variant="body1">{selectedPayment.remark}</Typography>
//                 </Paper>
//               </Grid>
//             )}
//           </Grid>

//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//             <Button 
//               startIcon={<ReceiptIcon />}
//               variant="contained"
//               color="primary"
//               onClick={() => {
//                 setOpenDetailsDialog(false);
//                 setOpenReceiptDialog(true);
//               }}
//             >
//               Show Receipt
//             </Button>
//           </Box>
//         </DialogContent>
//       </Dialog>
//     );
//   };

//   // Receipt Dialog
//   const ReceiptDialog = () => {
//     if (!selectedPayment) return null;

//     return (
//       <Dialog
//         open={openReceiptDialog}
//         onClose={() => setOpenReceiptDialog(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle sx={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'center',
//           backgroundColor: theme.palette.primary.main,
//           color: 'white'
//         }}>
//           <span>Payment Receipt</span>
//           <IconButton
//             color="inherit"
//             onClick={handlePrintReceipt}
//             title="Print Receipt"
//           >
//             <PrintIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers sx={{ padding: 0 }}>
//           <iframe
//             srcDoc={`
//               <html>
//                 <head>
//                   <title>Payment Receipt - ${selectedPayment.reciptNo}</title>
//                   <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
//                   <style>
//                     body { 
//                       font-family: 'Quicksand', Arial, sans-serif; 
//                       margin: 0; 
//                       padding: 0; 
//                       color: #333;
//                     }
//                     .receipt { 
//                       max-width: 800px; 
//                       margin: 0 auto; 
//                       padding: 30px; 
//                     }
//                     .header { 
//                       text-align: center; 
//                       position: relative;
//                       padding-bottom: 15px;
//                       margin-bottom: 20px;
//                     }
//                     .header:after {
//                       content: "";
//                       display: block;
//                       width: 100%;
//                       height: 2px;
//                       background: linear-gradient(to right, #2c3e50, #3498db, #2c3e50);
//                       position: absolute;
//                       bottom: 0;
//                       left: 0;
//                     }
//                     .logo-container {
//                       position: absolute;
//                       top: 0;
//                       left: 0;
//                     }
//                     .company-logo {
//                       display: flex;
//                       align-items: center;
//                       justify-content: center;
//                       width: 50px;
//                       height: 50px;
//                       background: linear-gradient(to bottom, #2c3e50, #3498db);
//                       color: white;
//                       border-radius: 5px;
//                       font-weight: bold;
//                       margin-right: 10px;
//                     }
//                     .receipt-title {
//                       font-size: 24px;
//                       font-weight: 700;
//                       color: #2c3e50;
//                       margin: 0;
//                     }
//                     .receipt-no { 
//                       font-size: 16px; 
//                       color: #3498db; 
//                       font-weight: 500;
//                       margin: 5px 0;
//                     }
//                     .receipt-date {
//                       font-size: 14px;
//                       color: #777;
//                     }
//                     .section { 
//                       margin-bottom: 25px; 
//                       padding-bottom: 5px;
//                     }
//                     .section-title { 
//                       border-left: 4px solid #3498db; 
//                       padding-left: 10px; 
//                       font-size: 16px;
//                       font-weight: 600;
//                       color: #2c3e50;
//                       margin-bottom: 15px;
//                     }
//                     .info-grid {
//                       display: grid;
//                       grid-template-columns: 1fr 1fr;
//                       gap: 15px;
//                     }
//                     .info-item {
//                       padding: 10px;
//                       background-color: #f9f9f9;
//                       border-radius: 5px;
//                     }
//                     .info-label { 
//                       font-weight: 500; 
//                       font-size: 13px;
//                       color: #777;
//                       margin-bottom: 5px;
//                     }
//                     .info-value { 
//                       font-weight: 600;
//                       color: #333;
//                       font-size: 15px;
//                     }
//                     .payment-details {
//                       background-color: #f9f9f9;
//                       padding: 15px;
//                       border-radius: 5px;
//                     }
//                     .payment-row {
//                       display: flex;
//                       justify-content: space-between;
//                       padding: 8px 0;
//                       border-bottom: 1px solid #eee;
//                     }
//                     .payment-row:last-child {
//                       border-bottom: none;
//                     }
//                     .payment-label {
//                       font-weight: 500;
//                     }
//                     .payment-value {
//                       font-weight: 600;
//                     }
//                     .total-row { 
//                       font-size: 18px; 
//                       font-weight: 700; 
//                       color: #2c3e50;
//                       margin-top: 10px;
//                       padding-top: 10px;
//                       border-top: 2px solid #3498db;
//                     }
//                     .signature-section {
//                       margin-top: 50px;
//                       display: flex;
//                       justify-content: space-between;
//                     }
//                     .signature-box {
//                       width: 45%;
//                       text-align: center;
//                     }
//                     .signature-line {
//                       border-top: 1px solid #ccc;
//                       padding-top: 5px;
//                       margin-top: 40px;
//                       font-weight: 500;
//                     }
//                     .footer { 
//                       margin-top: 30px; 
//                       text-align: center; 
//                       font-size: 12px; 
//                       color: #777;
//                       border-top: 1px solid #eee;
//                       padding-top: 20px;
//                     }
//                     .receipt-header-right {
//                       position: absolute;
//                       top: 0;
//                       right: 0;
//                       text-align: right;
//                       font-size: 12px;
//                       color: #777;
//                     }
//                   </style>
//                 </head>
//                 <body>
//                   <div class="receipt">
//                     <div class="header">
//                       <div class="logo-container">
//                         <div class="company-logo">RE</div>
//                       </div>
//                       <div class="receipt-header-right">
//                         <div>www.yourcompany.com</div>
//                         <div>Phone: +91 123-456-7890</div>
//                         <div>info@yourcompany.com</div>
//                       </div>
//                       <h1 class="receipt-title">Real Estate Receipt</h1>
//                       <div class="receipt-no">Receipt No: ${selectedPayment.reciptNo}</div>
//                       <div class="receipt-date">Date: ${formatDate(selectedPayment.date)}</div>
//                     </div>

//                     <div class="section">
//                       <div class="section-title">Property Details</div>
//                       <div class="info-grid">
//                         <div class="info-item">
//                           <div class="info-label">Project Name</div>
//                           <div class="info-value">${selectedPayment.projectName}</div>
//                         </div>
//                         <div class="info-item">
//                           <div class="info-label">Block Number</div>
//                           <div class="info-value">${selectedPayment.block}</div>
//                         </div>
//                         <div class="info-item">
//                           <div class="info-label">Plot Number</div>
//                           <div class="info-value">${selectedPayment.plotNo}</div>
//                         </div>
//                         <div class="info-item">
//                           <div class="info-label">Booking Code</div>
//                           <div class="info-value">${selectedPayment.bookingCode}</div>
//                         </div>
//                       </div>
//                     </div>

//                     <div class="section">
//                       <div class="section-title">Customer Details</div>
//                       <div class="info-grid">
//                         <div class="info-item">
//                           <div class="info-label">Customer Name</div>
//                           <div class="info-value">${selectedPayment.customerName || 'N/A'}</div>
//                         </div>
//                         <div class="info-item">
//                           <div class="info-label">Customer ID</div>
//                           <div class="info-value">${selectedPayment.customerId || 'N/A'}</div>
//                         </div>
//                       </div>
//                     </div>

//                     <div class="section">
//                       <div class="section-title">Payment Details</div>
//                       <div class="payment-details">
//                         <div class="payment-row">
//                           <div class="payment-label">Payment Type</div>
//                           <div class="payment-value">${selectedPayment.paymentType}</div>
//                         </div>
//                         <div class="payment-row">
//                           <div class="payment-label">Payment Mode</div>
//                           <div class="payment-value">${selectedPayment.payMode}</div>
//                         </div>
//                         ${selectedPayment.payMode !== 'Cash' ? `
//                           <div class="payment-row">
//                             <div class="payment-label">Bank Name</div>
//                             <div class="payment-value">${selectedPayment.bankName || 'N/A'}</div>
//                           </div>
//                           ${selectedPayment.branchName ? `
//                             <div class="payment-row">
//                               <div class="payment-label">Branch Name</div>
//                               <div class="payment-value">${selectedPayment.branchName}</div>
//                             </div>
//                           ` : ''}
//                           ${selectedPayment.payMode === 'Online Transfer' ? `
//                             <div class="payment-row">
//                               <div class="payment-label">Account Number</div>
//                               <div class="payment-value">${selectedPayment.accountNumber || 'N/A'}</div>
//                             </div>
//                           ` : ''}
//                           ${(selectedPayment.payMode === 'Cheque' || selectedPayment.payMode === 'DD') ? `
//                             <div class="payment-row">
//                               <div class="payment-label">${selectedPayment.payMode} Number</div>
//                               <div class="payment-value">${selectedPayment.chequeNo || 'N/A'}</div>
//                             </div>
//                             <div class="payment-row">
//                               <div class="payment-label">${selectedPayment.payMode} Date</div>
//                               <div class="payment-value">${selectedPayment.chequeDate ? formatDate(selectedPayment.chequeDate) : 'N/A'}</div>
//                             </div>
//                           ` : ''}
//                         ` : ''}
//                         <div class="payment-row">
//                           <div class="payment-label">Payable Amount</div>
//                           <div class="payment-value">₹${parseFloat(selectedPayment.payableAmount).toLocaleString()}</div>
//                         </div>
//                         <div class="payment-row total-row">
//                           <div class="payment-label">Amount Paid</div>
//                           <div class="payment-value">₹${parseFloat(selectedPayment.paidAmount).toLocaleString()}</div>
//                         </div>
//                       </div>
//                     </div>

//                     ${selectedPayment.remark ? `
//                       <div class="section">
//                         <div class="section-title">Remarks</div>
//                         <div class="info-item">
//                           <div class="info-value">${selectedPayment.remark}</div>
//                         </div>
//                       </div>
//                     ` : ''}

//                     <div class="signature-section">
//                       <div class="signature-box">
//                         <div class="signature-line">Customer Signature</div>
//                       </div>
//                       <div class="signature-box">
//                         <div class="signature-line">Authorized Signature</div>
//                       </div>
//                     </div>

//                     <div class="footer">
//                       <p>This is a computer-generated receipt and does not require a physical signature.</p>
//                       <p>Thank you for your payment!</p>
//                     </div>
//                   </div>
//                 </body>
//               </html>
//             `}
//             style={{ width: '100%', height: '70vh', border: 'none' }}
//           />
//         </DialogContent>
//       </Dialog>
//     );
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
//           Payment Records
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <Button
//             variant="outlined"
//             startIcon={<SearchIcon />}
//             sx={{ display: { xs: 'none', md: 'flex' } }}
//           >
//             Search
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             href="/payments/add"
//           >
//             New Payment
//           </Button>
//         </Box>
//       </Box>

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <>
//           {payments.length === 0 ? (
//             <Paper sx={{ p: 4, textAlign: 'center' }}>
//               <Typography variant="h6" color="textSecondary">
//                 No payment records found
//               </Typography>
//               <Button 
//                 variant="contained" 
//                 startIcon={<AddIcon />} 
//                 sx={{ mt: 2 }}
//                 href="/payments/add"
//               >
//                 Create New Payment
//               </Button>
//             </Paper>
//           ) : (
//             <>
//               {isMobile ? renderMobileView() : renderTableView()}

//               <TablePagination
//                 rowsPerPageOptions={[5, 10, 25]}
//                 component="div"
//                 count={payments.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//               />
//             </>
//           )}
//         </>
//       )}

//       <PaymentDetailsDialog />
//       <ReceiptDialog />
//     </Box>
//   );
// };

// export default FullPaymentTable;











import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  TablePagination,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Search as SearchIcon,
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axiosInstance from '../../axiosInstance';

const FullPaymentTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch data from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/realEstate/fullPayment/all');
        // const result = await response.json();
        if (response.data.status === 200) {
          setPayments(response.data.data);
        } else {
          console.error('Failed to fetch payments');
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleShowReceipt = (payment) => {
    // Only show receipt if it's not a pending cheque payment
    if (!(payment.payMode === 'Cheque' && payment.chequeStatus === false)) {
      setSelectedPayment(payment);
      setOpenReceiptDialog(true);
    }
  };

  const handleShowDetails = (payment) => {
    setSelectedPayment(payment);
    setOpenDetailsDialog(true);
  };

  const handlePrintReceipt = () => {
    // Only allow printing if chequeStatus is not false
    if (selectedPayment && selectedPayment.chequeStatus !== false) {
      const printWindow = window.open('', '_blank');

      if (printWindow) {
        const formData = selectedPayment;

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
                <div class="receipt-date">Date: ${format(new Date(formData.date), 'dd/MM/yyyy')}</div>
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
                    <div class="info-value">${formData.block}</div>
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
                    <div class="info-value">${formData.customerName || 'N/A'}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Customer ID</div>
                    <div class="info-value">${formData.customerId || 'N/A'}</div>
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
                      <div class="payment-value">${formData.bankName || 'N/A'}</div>
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
                        <div class="payment-value">${formData.accountNumber || 'N/A'}</div>
                      </div>
                    ` : ''}
                    ${(formData.payMode === 'Cheque' || formData.payMode === 'DD') ? `
                      <div class="payment-row">
                        <div class="payment-label">${formData.payMode} Number</div>
                        <div class="payment-value">${formData.chequeNo || 'N/A'}</div>
                      </div>
                      <div class="payment-row">
                        <div class="payment-label">${formData.payMode} Date</div>
                        <div class="payment-value">${formData.chequeDate ? format(new Date(formData.chequeDate), 'dd/MM/yyyy') : 'N/A'}</div>
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
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  // Display card view for mobile
  const renderMobileView = () => {
    return (
      <Box>
        {payments
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((payment) => (
            <Card sx={{ mb: 2, boxShadow: 2 }} key={payment.fullPaymentId}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: theme.palette.primary.main }}>
                  {payment.projectName} - {payment.plotNo}
                </Typography>

                <Grid container spacing={1} sx={{ mb: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Receipt No</Typography>
                    <Typography variant="body2">{payment.reciptNo}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Date</Typography>
                    <Typography variant="body2">{formatDate(payment.date)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Customer</Typography>
                    <Typography variant="body2">{payment.customerName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Amount</Typography>
                    <Typography variant="body2" fontWeight="bold">₹{parseFloat(payment.paidAmount).toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">Status</Typography>
                    <Box display="flex" alignItems="center">
                      <Chip
                        label={payment.payMode === 'Cheque' && payment.chequeStatus === false ? "Pending" : "Completed"}
                        size="small"
                        color={payment.payMode === 'Cheque' && payment.chequeStatus === false ? "warning" : "success"}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleShowDetails(payment)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    startIcon={<ReceiptIcon />}
                    onClick={() => handleShowReceipt(payment)}
                    disabled={payment.payMode === 'Cheque' && payment.chequeStatus === false}
                  >
                    Receipt
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
      </Box>
    );
  };
  // Display table view for desktop
  const renderTableView = () => {
    return (
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.light }}>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Receipt No</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Project</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Plot</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Payment Mode</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((payment) => (
                <TableRow key={payment.fullPaymentId} hover>
                  <TableCell>{payment.reciptNo}</TableCell>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell>{payment.projectName}</TableCell>
                  <TableCell>{payment.plotNo}</TableCell>
                  <TableCell>{payment.customerName || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.payMode}
                      size="small"
                      color={payment.payMode === 'Cash' ? 'success' : 'primary'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    ₹{parseFloat(payment.paidAmount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {/* Only show pending status for Cheque payments with chequeStatus=false */}
                    <Chip
                      label={payment.payMode === 'Cheque' && payment.chequeStatus === false ? "Pending" : "Completed"}
                      size="small"
                      color={payment.payMode === 'Cheque' && payment.chequeStatus === false ? "warning" : "success"}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleShowDetails(payment)}
                      title="View Details"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <Tooltip
                      title={payment.payMode === 'Cheque' && payment.chequeStatus === false ?
                        "Receipt unavailable until cheque is cleared" : "Show Receipt"}
                    >
                      <span>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleShowReceipt(payment)}
                          disabled={payment.payMode === 'Cheque' && payment.chequeStatus === false}
                        >
                          <ReceiptIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  // Payment Details Dialog
  const PaymentDetailsDialog = () => {
    if (!selectedPayment) return null;

    return (
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
          Payment Details
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Property Information
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Project Name</Typography>
                    <Typography variant="body1">{selectedPayment.projectName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Block No</Typography>
                    <Typography variant="body1">{selectedPayment.block}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Plot No</Typography>
                    <Typography variant="body1">{selectedPayment.plotNo}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Booking Code</Typography>
                    <Typography variant="body1">{selectedPayment.bookingCode}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Customer Name</Typography>
                    <Typography variant="body1">{selectedPayment.customerName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Customer ID</Typography>
                    <Typography variant="body1">{selectedPayment.customerId || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Payment Information
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Receipt No</Typography>
                    <Typography variant="body1">{selectedPayment.reciptNo}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                    <Typography variant="body1">{formatDate(selectedPayment.date)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Payment Type</Typography>
                    <Typography variant="body1">{selectedPayment.paymentType}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Payment Mode</Typography>
                    <Typography variant="body1">{selectedPayment.payMode}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Payable Amount</Typography>
                    <Typography variant="body1">₹{parseFloat(selectedPayment.payableAmount).toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Paid Amount</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>₹{parseFloat(selectedPayment.paidAmount).toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    <Box display="flex" alignItems="center">
                      <Chip
                        label={selectedPayment.payMode === 'Cheque' && selectedPayment.chequeStatus === false ? "Pending" : "Completed"}
                        size="small"
                        color={selectedPayment.payMode === 'Cheque' && selectedPayment.chequeStatus === false ? "warning" : "success"}
                      />
                      {selectedPayment.payMode === 'Cheque' && selectedPayment.chequeStatus === false && (
                        <Typography variant="caption" color="warning.main" sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                          <ErrorOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                          Awaiting cheque clearance
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {selectedPayment.payMode !== 'Cash' && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">Bank Name</Typography>
                        <Typography variant="body1">{selectedPayment.bankName || 'N/A'}</Typography>
                      </Grid>
                      {selectedPayment.branchName && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="textSecondary">Branch Name</Typography>
                          <Typography variant="body1">{selectedPayment.branchName}</Typography>
                        </Grid>
                      )}
                      {selectedPayment.payMode === 'Online Transfer' && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="textSecondary">Account Number</Typography>
                          <Typography variant="body1">{selectedPayment.accountNumber || 'N/A'}</Typography>
                        </Grid>
                      )}
                      {(selectedPayment.payMode === 'Cheque' || selectedPayment.payMode === 'DD') && (
                        <>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">{selectedPayment.payMode} Number</Typography>
                            <Typography variant="body1">{selectedPayment.chequeNo || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">{selectedPayment.payMode} Date</Typography>
                            <Typography variant="body1">
                              {selectedPayment.chequeDate ? formatDate(selectedPayment.chequeDate) : 'N/A'}
                            </Typography>
                          </Grid>
                        </>
                      )}
                    </>
                  )}
                </Grid>
              </Paper>
            </Grid>

            {selectedPayment.remark && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Remarks
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                  <Typography variant="body1">{selectedPayment.remark}</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              startIcon={<ReceiptIcon />}
              variant="contained"
              color="primary"
              onClick={() => {
                setOpenDetailsDialog(false);
                setOpenReceiptDialog(true);
              }}
              disabled={selectedPayment.payMode === 'Cheque' && selectedPayment.chequeStatus === false}
            >
              {selectedPayment.payMode === 'Cheque' && selectedPayment.chequeStatus === false ?
                "Receipt Unavailable" : "Show Receipt"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

  // Receipt Dialog
  const ReceiptDialog = () => {
    if (!selectedPayment) return null;

    return (
      <Dialog
        open={openReceiptDialog}
        onClose={() => setOpenReceiptDialog(false)}
        maxWidth="md"
        fullWidth
      ><DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        color: 'white'
      }}>
          <span>Payment Receipt</span>
          <IconButton
            color="inherit"
            onClick={handlePrintReceipt}
            title="Print Receipt"
            disabled={selectedPayment.chequeStatus === false}
          >
            <PrintIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ padding: 0 }}>
          {selectedPayment.payMode === 'Cheque' && selectedPayment.chequeStatus === false ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <ErrorOutlineIcon color="warning" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>Receipt Unavailable</Typography>
              <Typography variant="body1" color="text.secondary">
                This receipt is pending cheque clearance. The receipt will be available once the cheque is cleared.
              </Typography>
            </Box>
          ) : (
            <iframe
              srcDoc={`
              <html>
                <head>
                  <title>Payment Receipt - ${selectedPayment.reciptNo}</title>
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
                      <div class="receipt-no">Receipt No: ${selectedPayment.reciptNo}</div>
                      <div class="receipt-date">Date: ${formatDate(selectedPayment.date)}</div>
                    </div>
                    
                    <div class="section">
                      <div class="section-title">Property Details</div>
                      <div class="info-grid">
                        <div class="info-item">
                          <div class="info-label">Project Name</div>
                          <div class="info-value">${selectedPayment.projectName}</div>
                        </div>
                        <div class="info-item">
                          <div class="info-label">Block Number</div>
                          <div class="info-value">${selectedPayment.block}</div>
                        </div>
                        <div class="info-item">
                          <div class="info-label">Plot Number</div>
                          <div class="info-value">${selectedPayment.plotNo}</div>
                        </div>
                        <div class="info-item">
                          <div class="info-label">Booking Code</div>
                          <div class="info-value">${selectedPayment.bookingCode}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="section">
                      <div class="section-title">Customer Details</div>
                      <div class="info-grid">
                        <div class="info-item">
                          <div class="info-label">Customer Name</div>
                          <div class="info-value">${selectedPayment.customerName || 'N/A'}</div>
                        </div>
                        <div class="info-item">
                          <div class="info-label">Customer ID</div>
                          <div class="info-value">${selectedPayment.customerId || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="section">
                      <div class="section-title">Payment Details</div>
                      <div class="payment-details">
                        <div class="payment-row">
                          <div class="payment-label">Payment Type</div>
                          <div class="payment-value">${selectedPayment.paymentType}</div>
                        </div>
                        <div class="payment-row">
                          <div class="payment-label">Payment Mode</div>
                          <div class="payment-value">${selectedPayment.payMode}</div>
                        </div>
                        ${selectedPayment.payMode !== 'Cash' ? `
                          <div class="payment-row">
                            <div class="payment-label">Bank Name</div>
                            <div class="payment-value">${selectedPayment.bankName || 'N/A'}</div>
                          </div>
                          ${selectedPayment.branchName ? `
                            <div class="payment-row">
                              <div class="payment-label">Branch Name</div>
                              <div class="payment-value">${selectedPayment.branchName}</div>
                            </div>
                          ` : ''}
                          ${selectedPayment.payMode === 'Online Transfer' ? `
                            <div class="payment-row">
                              <div class="payment-label">Account Number</div>
                              <div class="payment-value">${selectedPayment.accountNumber || 'N/A'}</div>
                            </div>
                          ` : ''}
                          ${(selectedPayment.payMode === 'Cheque' || selectedPayment.payMode === 'DD') ? `
                            <div class="payment-row">
                              <div class="payment-label">${selectedPayment.payMode} Number</div>
                              <div class="payment-value">${selectedPayment.chequeNo || 'N/A'}</div>
                            </div>
                            <div class="payment-row">
                              <div class="payment-label">${selectedPayment.payMode} Date</div>
                              <div class="payment-value">${selectedPayment.chequeDate ? formatDate(selectedPayment.chequeDate) : 'N/A'}</div>
                            </div>
                          ` : ''}
                        ` : ''}
                        <div class="payment-row">
                          <div class="payment-label">Payable Amount</div>
                          <div class="payment-value">₹${parseFloat(selectedPayment.payableAmount).toLocaleString()}</div>
                        </div>
                        <div class="payment-row total-row">
                          <div class="payment-label">Amount Paid</div>
                          <div class="payment-value">₹${parseFloat(selectedPayment.paidAmount).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    
                    ${selectedPayment.remark ? `
                      <div class="section">
                        <div class="section-title">Remarks</div>
                        <div class="info-item">
                          <div class="info-value">${selectedPayment.remark}</div>
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
                </body>
              </html>
            `}
              style={{ width: '100%', height: '70vh', border: 'none' }}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Payment Records
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            Search
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            href="/payments/add"
          >
            New Payment
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {payments.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                No payment records found
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
                href="/payments/add"
              >
                Create New Payment
              </Button>
            </Paper>
          ) : (
            <>
              {isMobile ? renderMobileView() : renderTableView()}

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={payments.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </>
      )}

      <PaymentDetailsDialog />
      <ReceiptDialog />
    </Box>
  );
};

export default FullPaymentTable;
