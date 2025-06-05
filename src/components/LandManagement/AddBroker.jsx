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
    FormControlLabel,
    FormGroup,
    FormLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const BrokerManagementSystem = () => {
    const [showForm, setShowForm] = useState(false);

    const handleAddBroker = () => {
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    return (
        <Container maxWidth="xl">
            {!showForm ? (
                <AllBrokersPage onAddClick={handleAddBroker} />
            ) : (
                <AddBrokerPage onCancel={handleCancel} />
            )}
        </Container>
    );
};

const AllBrokersPage = ({ onAddClick }) => {
    const [brokers, setBrokers] = useState([
        { id: 'BR001', name: 'Rahul Mehta', address: 'Sector 12', city: 'Moradabad', state: 'UP', pincode: '244001', mobile: '9876543210', aadhar: '1234 5678 9012', pan: 'ABCDE1234F', accountNo: '12345678901' },
        { id: 'BR002', name: 'Priya Singh', address: 'Gomti Nagar', city: 'Lucknow', state: 'UP', pincode: '226010', mobile: '8765432109', aadhar: '2345 6789 0123', pan: 'FGHIJ5678G', accountNo: '23456789012' },
        { id: 'BR003', name: 'Ankit Sharma', address: 'Civil Lines', city: 'Moradabad', state: 'UP', pincode: '244001', mobile: '7654321098', aadhar: '3456 7890 1234', pan: 'KLMNO9012H', accountNo: '34567890123' },
    ]);

    return (
        <Container sx={{ width: "100%", py: 3 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    All Brokers
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        placeholder="Search brokers..."
                        variant="outlined"
                        size="medium"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            width: '300px',
                            backgroundColor: 'white',
                            borderRadius: 1,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#e0e0e0',
                                },
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={onAddClick}
                        sx={{
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            backgroundColor: '#4f46e5',
                            '&:hover': {
                                backgroundColor: '#4338ca',
                            }
                        }}
                    >
                        ADD BROKER
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ 
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                borderRadius: 1,
                overflow: 'hidden'
            }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                <Checkbox
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#4f46e5',
                                        },
                                    }}
                                />
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                borderBottom: '1px solid #e0e0e0',
                                color: '#111827'
                            }}>
                                Broker ID
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                borderBottom: '1px solid #e0e0e0',
                                color: '#111827'
                            }}>
                                Broker Name
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                borderBottom: '1px solid #e0e0e0',
                                color: '#111827'
                            }}>
                                Address
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                borderBottom: '1px solid #e0e0e0',
                                color: '#111827'
                            }}>
                                City
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                borderBottom: '1px solid #e0e0e0',
                                color: '#111827'
                            }}>
                                State
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                borderBottom: '1px solid #e0e0e0',
                                color: '#111827'
                            }}>
                                PIN Code
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                borderBottom: '1px solid #e0e0e0',
                                color: '#111827'
                            }}>
                                Mobile No
                            </TableCell>
                            <TableCell align="right" sx={{ 
                                fontWeight: 'bold', 
                                borderBottom: '1px solid #e0e0e0',
                                color: '#111827'
                            }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {brokers.length > 0 ? (
                            brokers.map((broker, index) => (
                                <TableRow key={index} hover>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: '#4f46e5',
                                                },
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: '#4b5563' }}>
                                        {broker.id}
                                    </TableCell>
                                    <TableCell sx={{ color: '#4b5563' }}>
                                        {broker.name}
                                    </TableCell>
                                    <TableCell sx={{ color: '#4b5563' }}>
                                        {broker.address}
                                    </TableCell>
                                    <TableCell sx={{ color: '#4b5563' }}>
                                        {broker.city}
                                    </TableCell>
                                    <TableCell sx={{ color: '#4b5563' }}>
                                        {broker.state}
                                    </TableCell>
                                    <TableCell sx={{ color: '#4b5563' }}>
                                        {broker.pincode}
                                    </TableCell>
                                    <TableCell sx={{ color: '#4b5563' }}>
                                        {broker.mobile}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <IconButton size="small" color="primary" sx={{ color: '#4f46e5' }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                                    <Typography color="textSecondary">No brokers found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

const AddBrokerPage = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        brokerName: '',
        mobileNumber: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        aadharNo: '',
        panNo: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: ''
    });

    const [selectedDocType, setSelectedDocType] = useState({
        profileImage: false,
        aadharImage: false,
        panImage: false
    });

    const [uploadedImages, setUploadedImages] = useState({
        profileImage: null,
        aadharImage: null,
        panImage: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDocTypeChange = (e) => {
        const { name, checked } = e.target;
        setSelectedDocType({
            ...selectedDocType,
            [name]: checked
        });
    };

    const handleImageUpload = (docType) => (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadedImages({
                ...uploadedImages,
                [docType]: {
                    file,
                    preview: URL.createObjectURL(file)
                }
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { ...formData, images: uploadedImages });
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
                        Add New Broker
                    </Typography>
                </Toolbar>
            </AppBar>

            <form onSubmit={handleSubmit}>
                <Card sx={{ 
                    mb: 4,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    borderRadius: 1 
                }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#111827' }}>
                            Broker Details
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Broker Name"
                                    name="brokerName"
                                    variant="outlined"
                                    value={formData.brokerName}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Mobile Number"
                                    name="mobileNumber"
                                    variant="outlined"
                                    value={formData.mobileNumber}
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
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    variant="outlined"
                                    value={formData.address}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    name="city"
                                    variant="outlined"
                                    value={formData.city}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    name="state"
                                    variant="outlined"
                                    value={formData.state}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="PIN Code"
                                    name="pincode"
                                    variant="outlined"
                                    value={formData.pincode}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Aadhar Number"
                                    name="aadharNo"
                                    variant="outlined"
                                    value={formData.aadharNo}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="PAN Number"
                                    name="panNo"
                                    variant="outlined"
                                    value={formData.panNo}
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

                <Card sx={{ 
                    mb: 4,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    borderRadius: 1
                }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#111827' }}>
                            Document Upload
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <FormGroup>
                            <FormLabel component="legend" sx={{ mb: 2, color: '#4b5563' }}>
                                Select document type to upload:
                            </FormLabel>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedDocType.profileImage}
                                                onChange={handleDocTypeChange}
                                                name="profileImage"
                                                sx={{
                                                    '&.Mui-checked': {
                                                        color: '#4f46e5',
                                                    },
                                                }}
                                            />
                                        }
                                        label="Profile Photo"
                                    />
                                    {selectedDocType.profileImage && (
                                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="profile-image-upload"
                                                type="file"
                                                onChange={handleImageUpload('profileImage')}
                                            />
                                            <label htmlFor="profile-image-upload">
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    startIcon={<CloudUploadIcon />}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#4f46e5',
                                                        '&:hover': {
                                                            backgroundColor: '#4338ca',
                                                        }
                                                    }}
                                                >
                                                    Upload
                                                </Button>
                                            </label>
                                            {uploadedImages.profileImage && (
                                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                                    <img
                                                        src={uploadedImages.profileImage.preview}
                                                        alt="Profile Preview"
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                                    />
                                                    <Typography variant="caption" display="block">
                                                        {uploadedImages.profileImage.file.name}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedDocType.aadharImage}
                                                onChange={handleDocTypeChange}
                                                name="aadharImage"
                                                sx={{
                                                    '&.Mui-checked': {
                                                        color: '#4f46e5',
                                                    },
                                                }}
                                            />
                                        }
                                        label="Aadhar Card"
                                    />
                                    {selectedDocType.aadharImage && (
                                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="aadhar-image-upload"
                                                type="file"
                                                onChange={handleImageUpload('aadharImage')}
                                            />
                                            <label htmlFor="aadhar-image-upload">
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    startIcon={<CloudUploadIcon />}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#4f46e5',
                                                        '&:hover': {
                                                            backgroundColor: '#4338ca',
                                                        }
                                                    }}
                                                >
                                                    Upload
                                                </Button>
                                            </label>
                                            {uploadedImages.aadharImage && (
                                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                                    <img
                                                        src={uploadedImages.aadharImage.preview}
                                                        alt="Aadhar Preview"
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                                    />
                                                    <Typography variant="caption" display="block">
                                                        {uploadedImages.aadharImage.file.name}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedDocType.panImage}
                                                onChange={handleDocTypeChange}
                                                name="panImage"
                                                sx={{
                                                    '&.Mui-checked': {
                                                        color: '#4f46e5',
                                                    },
                                                }}
                                            />
                                        }
                                        label="PAN Card"
                                    />
                                    {selectedDocType.panImage && (
                                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="pan-image-upload"
                                                type="file"
                                                onChange={handleImageUpload('panImage')}
                                            />
                                            <label htmlFor="pan-image-upload">
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    startIcon={<CloudUploadIcon />}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#4f46e5',
                                                        '&:hover': {
                                                            backgroundColor: '#4338ca',
                                                        }
                                                    }}
                                                >
                                                    Upload
                                                </Button>
                                            </label>
                                            {uploadedImages.panImage && (
                                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                                    <img
                                                        src={uploadedImages.panImage.preview}
                                                        alt="PAN Preview"
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                                    />
                                                    <Typography variant="caption" display="block">
                                                        {uploadedImages.panImage.file.name}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </FormGroup>
                    </CardContent>
                </Card>

                <Card sx={{ 
                    mb: 4,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    borderRadius: 1
                }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#111827' }}>
                            Bank Details
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Bank Name"
                                    name="bankName"
                                    variant="outlined"
                                    value={formData.bankName}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Account Name"
                                    name="accountName"
                                    variant="outlined"
                                    value={formData.accountName}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Account Number"
                                    name="accountNumber"
                                    variant="outlined"
                                    value={formData.accountNumber}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="IFSC Code"
                                    name="ifscCode"
                                    variant="outlined"
                                    value={formData.ifscCode}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Account Holder Name"
                                    name="accountHolderName"
                                    variant="outlined"
                                    value={formData.accountHolderName}
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

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
                    <Button 
                        variant="outlined" 
                        onClick={onCancel}
                        sx={{
                            borderColor: '#e0e0e0',
                            color: '#4b5563',
                            '&:hover': {
                                borderColor: '#d1d5db',
                                backgroundColor: '#f9fafb',
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                        sx={{
                            backgroundColor: '#4f46e5',
                            '&:hover': {
                                backgroundColor: '#4338ca',
                            }
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default BrokerManagementSystem;