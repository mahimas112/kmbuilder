import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Container,
    InputAdornment,
    IconButton,
    AppBar,
    Toolbar,
    Card,
    CardContent,
    Divider,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Payment as PaymentIcon,
    CalendarToday as CalendarTodayIcon,
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CloudUpload as CloudUploadIcon,
    Map as MapIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';

const AddPayment = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        maujaName: '',
        aarziNo: '',
        farmerName: '',
        brokerDetails: '',
        khsraNo: '',
        payableAmount: '',
        paidAmount: '',
        balanceAmount: '',
        payDate: new Date().toISOString().split('T')[0],
        payMode: 'CASH',
        remark: ''
    });

    // Sample data for dropdowns
    const maujaOptions = [
        { id: 'MJ001', name: 'Rampur' },
        { id: 'MJ002', name: 'Sultanpur' },
        { id: 'MJ003', name: 'Rasulpur' }
    ];

    const aarziOptions = [
        { id: 'AZ001', name: 'Aarzi 153' },
        { id: 'AZ002', name: 'Aarzi 187' },
        { id: 'AZ003', name: 'Aarzi 221' }
    ];

    const farmerOptions = [
        { id: 'F1001', name: 'Anil Kumar' },
        { id: 'F1002', name: 'Suresh Patel' },
        { id: 'F1003', name: 'Ramesh Yadav' }
    ];

    const brokerOptions = [
        { id: 'BR001', name: 'Rahul Mehta' },
        { id: 'BR002', name: 'Priya Singh' },
        { id: 'BR003', name: 'Ankit Sharma' }
    ];

    const paymentModes = [
        { id: 'CASH', name: 'Cash' },
        { id: 'CHEQUE', name: 'Cheque' },
        { id: 'ONLINE', name: 'Online Transfer' },
        { id: 'UPI', name: 'UPI' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Calculate balance amount when paid amount changes
        if (name === 'paidAmount') {
            const payable = parseFloat(formData.payableAmount) || 0;
            const paid = parseFloat(value) || 0;
            setFormData(prev => ({
                ...prev,
                balanceAmount: (payable - paid).toFixed(2)
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Payment submitted:', formData);
        onCancel();
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <AppBar position="static" color="default" elevation={0} sx={{ 
                mb: 3, 
                backgroundColor: 'white',
                borderRadius: 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onCancel} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ 
                        flexGrow: 1,
                        fontWeight: 'bold',
                        color: '#111827'
                    }}>
                        Add New Payment
                    </Typography>
                </Toolbar>
            </AppBar>

            <form onSubmit={handleSubmit}>
                {/* Land and Farmer Details */}
                <Card sx={{ 
                    mb: 4,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    borderRadius: 1 
                }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#111827' }}>
                            Land & Farmer Details
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="mauja-select-label">Mauja Name</InputLabel>
                                    <Select
                                        labelId="mauja-select-label"
                                        id="mauja-select"
                                        name="maujaName"
                                        value={formData.maujaName}
                                        label="Mauja Name"
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#e0e0e0',
                                            }
                                        }}
                                    >
                                        {maujaOptions.map((mauja) => (
                                            <MenuItem key={mauja.id} value={mauja.id}>{mauja.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="aarzi-select-label">Aarzi No</InputLabel>
                                    <Select
                                        labelId="aarzi-select-label"
                                        id="aarzi-select"
                                        name="aarziNo"
                                        value={formData.aarziNo}
                                        label="Aarzi No"
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#e0e0e0',
                                            }
                                        }}
                                    >
                                        {aarziOptions.map((aarzi) => (
                                            <MenuItem key={aarzi.id} value={aarzi.id}>{aarzi.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="farmer-select-label">Farmer Name</InputLabel>
                                    <Select
                                        labelId="farmer-select-label"
                                        id="farmer-select"
                                        name="farmerName"
                                        value={formData.farmerName}
                                        label="Farmer Name"
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#e0e0e0',
                                            }
                                        }}
                                    >
                                        {farmerOptions.map((farmer) => (
                                            <MenuItem key={farmer.id} value={farmer.id}>{farmer.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="broker-select-label">Broker Details</InputLabel>
                                    <Select
                                        labelId="broker-select-label"
                                        id="broker-select"
                                        name="brokerDetails"
                                        value={formData.brokerDetails}
                                        label="Broker Details"
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#e0e0e0',
                                            }
                                        }}
                                    >
                                        {brokerOptions.map((broker) => (
                                            <MenuItem key={broker.id} value={broker.id}>{broker.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Khsra No"
                                    name="khsraNo"
                                    value={formData.khsraNo}
                                    onChange={handleChange}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                            },
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Payment Details */}
                <Card sx={{ 
                    mb: 4,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    borderRadius: 1 
                }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#111827' }}>
                            Payment Details
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Payable Amount (₹)"
                                    name="payableAmount"
                                    type="number"
                                    value={formData.payableAmount}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PaymentIcon color="action" fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                            },
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Paid Amount (₹)"
                                    name="paidAmount"
                                    type="number"
                                    value={formData.paidAmount}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PaymentIcon color="action" fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                            },
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Balance Amount (₹)"
                                    name="balanceAmount"
                                    value={formData.balanceAmount}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PaymentIcon color="action" fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                            },
                                            backgroundColor: '#f9fafb'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Payment Date"
                                    name="payDate"
                                    type="date"
                                    value={formData.payDate}
                                    onChange={handleChange}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarTodayIcon color="action" fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                            },
                                            backgroundColor: '#f9fafb'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth required>
                                    <InputLabel id="paymode-select-label">Payment Mode</InputLabel>
                                    <Select
                                        labelId="paymode-select-label"
                                        id="paymode-select"
                                        name="payMode"
                                        value={formData.payMode}
                                        label="Payment Mode"
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#e0e0e0',
                                            }
                                        }}
                                    >
                                        {paymentModes.map((mode) => (
                                            <MenuItem key={mode.id} value={mode.id}>{mode.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Remark"
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                            },
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Form Actions */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: 2,
                    mt: 4,
                    mb: 6
                }}>
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        sx={{
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            color: '#6b7280',
                            borderColor: '#e0e0e0',
                            '&:hover': {
                                borderColor: '#d1d5db',
                                backgroundColor: '#f9fafb'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            backgroundColor: '#4f46e5',
                            '&:hover': {
                                backgroundColor: '#4338ca',
                            }
                        }}
                    >
                        Save Payment
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default AddPayment;