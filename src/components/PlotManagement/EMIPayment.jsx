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
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import axiosInstance from '../../axiosInstance';

const EMIPayment = () => {
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

  // Form states
  const [formData, setFormData] = useState({
    emiPaymentId: '',
    projectName: '',
    blockNo: '',
    addPlotId: '',
    plotNo: '',
    genratedEmiId: '',
    bookingCode: '',
    customerId: '',
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    paymentType: '',
    installmentAmount: 0,
    payableAmount: 0,
    pendingEmi: 0,
    paidAmount: 0,
    payMode: '',
    remark: '',
    totalPlotCost: 0,
    bookingAmount: 0,
    receiptNo: '',
    totalPaidAmount: 0,
    dueAmount: 0,
    accountNumber: '',
    chequeNo: '',
    bankName: '',
    branchName: '',
    chequeDate: new Date().toISOString().split('T')[0]
  });

  // Dropdown data states
  const [projects, setProjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [plots, setPlots] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [filteredPlots, setFilteredPlots] = useState([]);
  const [emiDetails, setEmiDetails] = useState(null);

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/realEstate/project/getAll');
        if (response.data && response.data.status === 200) {
          setProjects(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setNotification({
          open: true,
          message: 'Failed to fetch projects',
          severity: 'error'
        });
      }
    };

    fetchProjects();
  }, []);

  // Fetch all blocks
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await axiosInstance.get('/realEstate/Block/getAllBlock');
        if (response.data && response.data.status === 200) {
          setBlocks(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching blocks:', error);
        setNotification({
          open: true,
          message: 'Failed to fetch blocks',
          severity: 'error'
        });
      }
    };

    fetchBlocks();
  }, []);

  // Fetch all plots
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await axiosInstance.get('/realEstate/plot-booking/getAllSellingOfPlots');
        if (response.data && response.data.status === 200) {
          setPlots(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching plots:', error);
        setNotification({
          open: true,
          message: 'Failed to fetch plots',
          severity: 'error'
        });
      }
    };

    fetchPlots();
  }, []);

  // Filter blocks based on selected project
  useEffect(() => {
    if (formData.projectName && blocks.length > 0) {
      const filtered = blocks.filter(block => block.projectName === formData.projectName);
      setFilteredBlocks(filtered);
    } else {
      setFilteredBlocks([]);
    }
  }, [formData.projectName, blocks]);

  // Filter plots based on selected block
  useEffect(() => {
    if (formData.blockNo && plots.length > 0) {
      const filtered = plots.filter(plot => 
        plot.blockName === formData.blockNo && 
        plot.planType === 'EMI Plan' &&
        plot.genrateEmistatus === true
      );
      setFilteredPlots(filtered);
    } else {
      setFilteredPlots([]);
    }
  }, [formData.blockNo, plots]);

  // Fetch EMI details when booking code changes
  useEffect(() => {
    const fetchEmiDetails = async () => {
      if (formData.bookingCode) {
        try {
          const response = await axiosInstance.get(`/realEstate/emi/getByBookingCode?bookingCode=${formData.bookingCode}`);
          if (response.data && response.data.status === 200) {
            setEmiDetails(response.data.data);
            setFormData(prev => ({
              ...prev,
              genratedEmiId: response.data.data.emiGenrateId,
              installmentAmount: response.data.data.instAmount,
              pendingEmi: response.data.data.durationInMonth,
              paymentType: 'EMI'
            }));
          }
        } catch (error) {
          console.error('Error fetching EMI details:', error);
          setNotification({
            open: true,
            message: 'Failed to fetch EMI details',
            severity: 'error'
          });
        }
      }
    };

    fetchEmiDetails();
  }, [formData.bookingCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlotSelect = (plot) => {
    setFormData(prev => ({
      ...prev,
      emiPaymentId: '', // Will be generated by backend
      projectName: plot.projectName,
      blockNo: plot.blockName,
      addPlotId: plot.addPlotId,
      plotNo: plot.plotNo,
      bookingCode: plot.bookingCode,
      customerId: plot.customerId,
      customerName: plot.buyerName,
      totalPlotCost: plot.totalPlotCost,
      bookingAmount: plot.bookingAmount,
      dueAmount: plot.dueAmount,
      payMode: plot.payMode,
      totalPaidAmount: plot.totalPlotCost - plot.dueAmount,
      paidAmount: 0, // Will be set to payableAmount on submit
      receiptNo: '', // Will be generated by backend
      paymentType: 'EMI',
      date: new Date().toISOString().split('T')[0],
      chequeDate: new Date().toISOString().split('T')[0]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.plotNo) {
      setNotification({
        open: true,
        message: 'Please select a plot first',
        severity: 'error'
      });
      return;
    }

    if (!formData.payableAmount || formData.payableAmount <= 0) {
      setNotification({
        open: true,
        message: 'Please enter a valid payable amount',
        severity: 'error'
      });
      return;
    }

    if (formData.payMode !== 'Cash' && (!formData.accountNumber || !formData.chequeNo || !formData.bankName || !formData.branchName || !formData.chequeDate)) {
      setNotification({
        open: true,
        message: 'Please fill all bank details',
        severity: 'error'
      });
      return;
    }

    setSaving(true);
    try {
      const submissionData = {
        ...formData,
        paidAmount: formData.payableAmount,
        totalPaidAmount: formData.totalPaidAmount + formData.payableAmount,
        dueAmount: formData.dueAmount - formData.payableAmount,
        paymentType: 'EMI',
        date: formData.date,
        chequeDate: formData.chequeDate
      };

      const response = await axiosInstance.post('/realEstate/emi-payment/post', submissionData);
      
      if (response.data && response.data.status === 201) {
        setNotification({
          open: true,
          message: 'EMI Payment saved successfully',
          severity: 'success'
        });
        setReceiptData(response.data.data);
        setShowReceipt(true);
        
        // Reset form after successful submission
        setFormData({
          emiPaymentId: '',
          projectName: '',
          blockNo: '',
          addPlotId: '',
          plotNo: '',
          genratedEmiId: '',
          bookingCode: '',
          customerId: '',
          customerName: '',
          date: new Date().toISOString().split('T')[0],
          paymentType: '',
          installmentAmount: 0,
          payableAmount: 0,
          pendingEmi: 0,
          paidAmount: 0,
          payMode: '',
          remark: '',
          totalPlotCost: 0,
          bookingAmount: 0,
          receiptNo: '',
          totalPaidAmount: 0,
          dueAmount: 0,
          accountNumber: '',
          chequeNo: '',
          bankName: '',
          branchName: '',
          chequeDate: new Date().toISOString().split('T')[0]
        });
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
  };

  const handlePrintReceipt = () => {
    // Implement print functionality
    window.print();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        EMI Payment
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Project Selection */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={formData.projectName}
                onChange={handleInputChange}
                name="projectName"
                label="Project"
              >
                {projects.map(project => (
                  <MenuItem key={project.projectId} value={project.siteName}>
                    {project.siteName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Block Selection */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Block</InputLabel>
              <Select
                value={formData.blockNo}
                onChange={handleInputChange}
                name="blockNo"
                label="Block"
                disabled={!formData.projectName}
              >
                {filteredBlocks.map(block => (
                  <MenuItem key={block.blockId} value={block.block}>
                    {block.block}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Plot Selection */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Plot</InputLabel>
              <Select
                value={formData.plotNo}
                onChange={(e) => {
                  const selectedPlot = filteredPlots.find(plot => plot.plotNo === e.target.value);
                  if (selectedPlot) {
                    handlePlotSelect(selectedPlot);
                  }
                }}
                name="plotNo"
                label="Plot"
                disabled={!formData.blockNo}
              >
                {filteredPlots.map(plot => (
                  <MenuItem key={plot.plotsellingId} value={plot.plotNo}>
                    {plot.plotNo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Customer Details */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Customer Name"
              value={formData.customerName}
              name="customerName"
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Booking Code"
              value={formData.bookingCode}
              name="bookingCode"
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              name="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Payment Details */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Installment Amount"
              value={formData.installmentAmount}
              name="installmentAmount"
              disabled
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Pending EMI"
              value={formData.pendingEmi}
              name="pendingEmi"
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Payable Amount"
              value={formData.payableAmount}
              onChange={handleInputChange}
              name="payableAmount"
              type="number"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Total Plot Cost"
              value={formData.totalPlotCost}
              name="totalPlotCost"
              disabled
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Booking Amount"
              value={formData.bookingAmount}
              name="bookingAmount"
              disabled
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Due Amount"
              value={formData.dueAmount}
              name="dueAmount"
              disabled
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          {/* Payment Mode */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Payment Mode</InputLabel>
              <Select
                value={formData.payMode}
                onChange={handleInputChange}
                name="payMode"
                label="Payment Mode"
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Cheque">Cheque</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Bank Details (shown only when payment mode is not Cash) */}
          {formData.payMode !== 'Cash' && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Account Number"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  name="accountNumber"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Cheque Number"
                  value={formData.chequeNo}
                  onChange={handleInputChange}
                  name="chequeNo"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  name="bankName"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Branch Name"
                  value={formData.branchName}
                  onChange={handleInputChange}
                  name="branchName"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Cheque Date"
                  type="date"
                  value={formData.chequeDate}
                  onChange={handleInputChange}
                  name="chequeDate"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}

          {/* Remarks */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Remarks"
              value={formData.remark}
              onChange={handleInputChange}
              name="remark"
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Payment'}
          </Button>
        </Box>
      </Paper>

      {/* Receipt Dialog */}
      <Dialog
        open={showReceipt}
        onClose={handleCloseReceipt}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', borderBottom: '2px solid #f0f0f0', pb: 2 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            EMI Payment Receipt
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {receiptData?.date}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {receiptData && (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                {/* Company Details */}
                <Grid item xs={12} sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Real Estate Management System
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Plot No. 123, Sector 45, Noida, Uttar Pradesh
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone: +91 1234567890 | Email: info@rems.com
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Payment Details */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Payment Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Receipt No:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{receiptData.receiptNo}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Date:</Typography>
                      <Typography variant="body2">{receiptData.date}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Payment Mode:</Typography>
                      <Typography variant="body2">{receiptData.payMode}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Amount Paid:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>₹{receiptData.paidAmount}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Customer Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Customer Name:</Typography>
                      <Typography variant="body2">{receiptData.customerName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Booking Code:</Typography>
                      <Typography variant="body2">{receiptData.bookingCode}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Plot Details */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Plot Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Project:</Typography>
                      <Typography variant="body2">{receiptData.projectName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Block:</Typography>
                      <Typography variant="body2">{receiptData.block}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Plot No:</Typography>
                      <Typography variant="body2">{receiptData.plotNo}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    EMI Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Installment Amount:</Typography>
                      <Typography variant="body2">₹{receiptData.installmentAmount}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Pending EMI:</Typography>
                      <Typography variant="body2">{receiptData.pendingEmi}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Due Amount:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>₹{receiptData.dueAmount}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* EMI Installment Table */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    EMI Installment Schedule
                  </Typography>
                  <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Month</TableCell>
                          <TableCell>Due Date</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.from({ length: receiptData.pendingEmi }, (_, i) => {
                          const dueDate = new Date(receiptData.date);
                          dueDate.setMonth(dueDate.getMonth() + i + 1);
                          const isPaid = i < (receiptData.totalPaidAmount / receiptData.installmentAmount);
                          
                          return (
                            <TableRow key={i}>
                              <TableCell>Month {i + 1}</TableCell>
                              <TableCell>{dueDate.toLocaleDateString()}</TableCell>
                              <TableCell>₹{receiptData.installmentAmount}</TableCell>
                              <TableCell>
                                {isPaid ? (
                                  <CheckCircleIcon color="success" />
                                ) : (
                                  <PendingIcon color="action" />
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Bank Details (if applicable) */}
                {receiptData.payMode !== 'Cash' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Bank Details
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Bank Name:</Typography>
                        <Typography variant="body2">{receiptData.bankName}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Branch Name:</Typography>
                        <Typography variant="body2">{receiptData.branchName}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Account Number:</Typography>
                        <Typography variant="body2">{receiptData.accountNumber}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Cheque No:</Typography>
                        <Typography variant="body2">{receiptData.chequeNo}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Cheque Date:</Typography>
                        <Typography variant="body2">{receiptData.chequeDate}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Footer */}
                <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    This is a computer generated receipt. No signature required.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Thank you for your payment!
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '2px solid #f0f0f0', pt: 2 }}>
          <Button onClick={handleCloseReceipt}>Close</Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrintReceipt}
          >
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EMIPayment; 