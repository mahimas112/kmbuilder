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
  Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axiosInstance from '../../axiosInstance';


const EMIPlotList = () => {
  const [plots, setPlots] = useState([]);
  const [emiPayments, setEmiPayments] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  // Fetch all plots
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await axiosInstance.get('/realEstate/plot-booking/getAllSellingOfPlots');
        if (response.data && response.data.status === 200) {
          // Filter plots with genrateEmistatus true
          const emiPlots = response.data.data.filter(plot => plot.genrateEmistatus === true);
          setPlots(emiPlots);
        }
      } catch (error) {
        console.error('Error fetching plots:', error);
      }
    };

    fetchPlots();
  }, []);

  // Fetch all EMI payments
  useEffect(() => {
    const fetchEmiPayments = async () => {
      try {
        const response = await axiosInstance.get('/realEstate/emiPayments/getAll');
        if (response.data && response.data.status === 200) {
          setEmiPayments(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching EMI payments:', error);
      }
    };

    fetchEmiPayments();
  }, []);

  const handleViewPayments = (plot) => {
    setSelectedPlot(plot);
    setShowPaymentHistory(true);
  };

  const handleClosePaymentHistory = () => {
    setShowPaymentHistory(false);
    setSelectedPlot(null);
  };

  const getPlotPayments = (bookingCode) => {
    return emiPayments.filter(payment => payment.bookingCode === bookingCode);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        EMI Plots List
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plot No</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Block</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Booking Code</TableCell>
              <TableCell>Total Plot Cost</TableCell>
              <TableCell>Due Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plots.map((plot) => (
              <TableRow key={plot.plotsellingId}>
                <TableCell>{plot.plotNo}</TableCell>
                <TableCell>{plot.projectName}</TableCell>
                <TableCell>{plot.blockName}</TableCell>
                <TableCell>{plot.buyerName || '-'}</TableCell>
                <TableCell>{plot.bookingCode}</TableCell>
                <TableCell>₹{plot.totalPlotCost}</TableCell>
                <TableCell>₹{plot.dueAmount}</TableCell>
                <TableCell>
                  <Tooltip title="View Payment History">
                    <IconButton onClick={() => handleViewPayments(plot)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payment History Dialog */}
      <Dialog
        open={showPaymentHistory}
        onClose={handleClosePaymentHistory}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Payment History - {selectedPlot?.plotNo}
        </DialogTitle>
        <DialogContent>
          {selectedPlot && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Customer: {selectedPlot.buyerName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Booking Code: {selectedPlot.bookingCode}
              </Typography>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Receipt No</TableCell>
                      <TableCell>Amount Paid</TableCell>
                      <TableCell>Payment Mode</TableCell>
                      <TableCell>Pending EMI</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getPlotPayments(selectedPlot.bookingCode).map((payment) => (
                      <TableRow key={payment.emiPaymentId}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{payment.receiptNo}</TableCell>
                        <TableCell>₹{payment.paidAmount}</TableCell>
                        <TableCell>{payment.payMode}</TableCell>
                        <TableCell>{payment.pendingEmi}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentHistory}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EMIPlotList; 