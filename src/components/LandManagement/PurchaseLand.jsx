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
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MapIcon from '@mui/icons-material/Map';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';

const PurchaseLandSystem = () => {
  const [showForm, setShowForm] = useState(false);

  const handleAddPurchase = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <Container maxWidth="xl">
      {!showForm ? (
        <AllPurchasesPage onAddClick={handleAddPurchase} />
      ) : (
        <AddPurchasePage onCancel={handleCancel} />
      )}
    </Container>
  );
};

const AllPurchasesPage = ({ onAddClick }) => {
  const [purchases, setPurchases] = useState([
    {
      id: 'PL001',
      date: '15-03-2025',
      farmerName: 'Anil Kumar',
      farmerID: 'F1001',
      landDetails: 'Aarzi 153, Mauja Rampur',
      area: '5280 sqft',
      amount: '₹8,50,000',
      brokerName: 'Rahul Mehta',
      registry: 'Rampur Registry Office'
    },
    {
      id: 'PL002',
      date: '22-03-2025',
      farmerName: 'Suresh Patel',
      farmerID: 'F1005',
      landDetails: 'Aarzi 187, Mauja Sultanpur',
      area: '7200 sqft',
      amount: '₹12,00,000',
      brokerName: 'Priya Singh',
      registry: 'Sultanpur Registry Office'
    },
    {
      id: 'PL003',
      date: '28-03-2025',
      farmerName: 'Ramesh Yadav',
      farmerID: 'F1008',
      landDetails: 'Aarzi 221, Mauja Rasulpur',
      area: '4500 sqft',
      amount: '₹7,50,000',
      brokerName: 'Ankit Sharma',
      registry: 'Rasulpur Registry Office'
    },
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
          Land Purchases
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search purchases..."
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
            ADD PURCHASE
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
                Purchase ID
              </TableCell>
              <TableCell sx={{
                fontWeight: 'bold',
                borderBottom: '1px solid #e0e0e0',
                color: '#111827'
              }}>
                Date
              </TableCell>
              <TableCell sx={{
                fontWeight: 'bold',
                borderBottom: '1px solid #e0e0e0',
                color: '#111827'
              }}>
                Farmer Name
              </TableCell>
              <TableCell sx={{
                fontWeight: 'bold',
                borderBottom: '1px solid #e0e0e0',
                color: '#111827'
              }}>
                Farmer ID
              </TableCell>
              <TableCell sx={{
                fontWeight: 'bold',
                borderBottom: '1px solid #e0e0e0',
                color: '#111827'
              }}>
                Land Details
              </TableCell>
              <TableCell sx={{
                fontWeight: 'bold',
                borderBottom: '1px solid #e0e0e0',
                color: '#111827'
              }}>
                Area
              </TableCell>
              <TableCell sx={{
                fontWeight: 'bold',
                borderBottom: '1px solid #e0e0e0',
                color: '#111827'
              }}>
                Amount
              </TableCell>
              <TableCell sx={{
                fontWeight: 'bold',
                borderBottom: '1px solid #e0e0e0',
                color: '#111827'
              }}>
                Broker
              </TableCell>
              <TableCell sx={{
                fontWeight: 'bold',
                borderBottom: '1px solid #e0e0e0',
                color: '#111827'
              }}>
                Registry
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
            {purchases.length > 0 ? (
              purchases.map((purchase, index) => (
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
                    {purchase.id}
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563' }}>
                    {purchase.date}
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563' }}>
                    {purchase.farmerName}
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563' }}>
                    {purchase.farmerID}
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563' }}>
                    {purchase.landDetails}
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563' }}>
                    {purchase.area}
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563' }}>
                    {purchase.amount}
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563' }}>
                    {purchase.brokerName}
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563' }}>
                    {purchase.registry}
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
                <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                  <Typography color="textSecondary">No land purchases found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

const AddPurchasePage = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    date: '',
    brokerId: '',
    farmerId: '',
    farmerName: '',
    aadharNo: '',
    aarziNo: '',
    maujaName: '',
    measurementType: '',
    areaInSqft: '',
    areaInYard: '',
    registryId: '',
    additionalName: '',
    measurementSelection: '',
    totalAmount: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    aadharPhoto: null,
    profilePhoto: null,
    landMap: null,
    agreement: null
  });

  // Sample data for dropdowns
  const brokers = [
    { id: 'BR001', name: 'Rahul Mehta' },
    { id: 'BR002', name: 'Priya Singh' },
    { id: 'BR003', name: 'Ankit Sharma' }
  ];

  const farmers = [
    { id: 'F1001', name: 'Anil Kumar', aadhar: '1234 5678 9012' },
    { id: 'F1002', name: 'Suresh Patel', aadhar: '2345 6789 0123' },
    { id: 'F1003', name: 'Ramesh Yadav', aadhar: '3456 7890 1234' }
  ];

  const registries = [
    { id: 'REG001', name: 'Rampur Registry Office' },
    { id: 'REG002', name: 'Sultanpur Registry Office' },
    { id: 'REG003', name: 'Rasulpur Registry Office' }
  ];

  const additionalOptions = [
    { id: 'ADD001', name: 'Stamp Duty' },
    { id: 'ADD002', name: 'Registration Fee' },
    { id: 'ADD003', name: 'Legal Fee' }
  ];

  const measurementTypes = [
    { id: 'SQ_FT', name: 'Square Feet' },
    { id: 'SQ_YD', name: 'Square Yard' },
    { id: 'BIGHA', name: 'Bigha' },
    { id: 'ACRE', name: 'Acre' }
  ];

  const measurementSelections = [
    { id: 'M001', name: 'Per Square Feet' },
    { id: 'M002', name: 'Per Square Yard' },
    { id: 'M003', name: 'Per Bigha' },
    { id: 'M004', name: 'Per Acre' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Auto-populate farmer details when farmer is selected
    if (name === 'farmerId') {
      const selectedFarmer = farmers.find(farmer => farmer.id === value);
      if (selectedFarmer) {
        setFormData(prev => ({
          ...prev,
          farmerName: selectedFarmer.name,
          aadharNo: selectedFarmer.aadhar
        }));
      }
    }
  };

  const handleFileUpload = (fileType) => (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles({
        ...uploadedFiles,
        [fileType]: {
          file,
          preview: URL.createObjectURL(file)
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, files: uploadedFiles });
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
            Add New Land Purchase
          </Typography>
        </Toolbar>
      </AppBar>

      <form onSubmit={handleSubmit}>
        {/* Purchase Date and Broker Selection */}
        <Card sx={{
          mb: 4,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          borderRadius: 1
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#111827' }}>
              Purchase Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Purchase Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
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
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="broker-select-label">Select Broker</InputLabel>
                  <Select
                    labelId="broker-select-label"
                    id="broker-select"
                    name="brokerId"
                    value={formData.brokerId}
                    label="Select Broker"
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      }
                    }}
                  >
                    {brokers.map((broker) => (
                      <MenuItem key={broker.id} value={broker.id}>{broker.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Farmer Details */}
        <Card sx={{
          mb: 4,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          borderRadius: 1
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#111827' }}>
              Farmer Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="farmer-select-label">Select Farmer</InputLabel>
                  <Select
                    labelId="farmer-select-label"
                    id="farmer-select"
                    name="farmerId"
                    value={formData.farmerId}
                    label="Select Farmer"
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      }
                    }}
                  >
                    {farmers.map((farmer) => (
                      <MenuItem key={farmer.id} value={farmer.id}>{farmer.name} ({farmer.id})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Farmer Name"
                  name="farmerName"
                  value={formData.farmerName}
                  onChange={handleChange}
                  InputProps={{ readOnly: true }}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Aadhar Number"
                  name="aadharNo"
                  value={formData.aadharNo}
                  onChange={handleChange}
                  InputProps={{ readOnly: true }}
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
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 4, mb: 2, fontWeight: 'medium', color: '#4b5563' }}>
              Document Upload
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#4b5563' }}>
                    Aadhar Card Photo
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="aadhar-photo-upload"
                      type="file"
                      onChange={handleFileUpload('aadharPhoto')}
                    />
                    <label htmlFor="aadhar-photo-upload">
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
                    {uploadedFiles.aadharPhoto && (
                      <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ mr: 1 }}>
                          {uploadedFiles.aadharPhoto.file.name}
                        </Typography>
                        <img
                          src={uploadedFiles.aadharPhoto.preview}
                          alt="Aadhar Preview"
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </Box>
                    )}
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#4b5563' }}>
                    Profile Photo
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-photo-upload"
                      type="file"
                      onChange={handleFileUpload('profilePhoto')}
                    />
                    <label htmlFor="profile-photo-upload">
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
                    {uploadedFiles.profilePhoto && (
                      <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ mr: 1 }}>
                          {uploadedFiles.profilePhoto.file.name}
                        </Typography>
                        <img
                          src={uploadedFiles.profilePhoto.preview}
                          alt="Profile Preview"
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </Box>
                    )}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Land Details */}
        {/* Land Details */}
        <Card sx={{
          mb: 4,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          borderRadius: 1
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#111827' }}>
              Land Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Aarzi Number"
                  name="aarziNo"
                  value={formData.aarziNo}
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
                  label="Mauja Name"
                  name="maujaName"
                  value={formData.maujaName}
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
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel id="measurement-type-label">Measurement Type</InputLabel>
                  <Select
                    labelId="measurement-type-label"
                    id="measurement-type"
                    name="measurementType"
                    value={formData.measurementType}
                    label="Measurement Type"
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      }
                    }}
                  >
                    {measurementTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Area (Sqft)"
                  name="areaInSqft"
                  type="number"
                  value={formData.areaInSqft}
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
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Area (Yard)"
                  name="areaInYard"
                  type="number"
                  value={formData.areaInYard}
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

            <Typography variant="subtitle1" sx={{ mt: 4, mb: 2, fontWeight: 'medium', color: '#4b5563' }}>
              Document Upload
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#4b5563' }}>
                    Land Map Upload
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <input
                      accept="image/*,.pdf"
                      style={{ display: 'none' }}
                      id="land-map-upload"
                      type="file"
                      onChange={handleFileUpload('landMap')}
                    />
                    <label htmlFor="land-map-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<MapIcon />}
                        size="small"
                        sx={{
                          backgroundColor: '#4f46e5',
                          '&:hover': {
                            backgroundColor: '#4338ca',
                          }
                        }}
                      >
                        Upload Map
                      </Button>
                    </label>
                    {uploadedFiles.landMap && (
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="caption">
                          {uploadedFiles.landMap.file.name}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#4b5563' }}>
                    Direct Agreement
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <input
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      id="direct-agreement-upload"
                      type="file"
                      onChange={handleFileUpload('directAgreement')}
                    />
                    <label htmlFor="direct-agreement-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<DescriptionIcon />}
                        size="small"
                        sx={{
                          backgroundColor: '#4f46e5',
                          '&:hover': {
                            backgroundColor: '#4338ca',
                          }
                        }}
                      >
                        Upload Agreement
                      </Button>
                    </label>
                    {uploadedFiles.directAgreement && (
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="caption">
                          {uploadedFiles.directAgreement.file.name}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Card>
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="registry-select-label">Registry Office</InputLabel>
                  <Select
                    labelId="registry-select-label"
                    id="registry-select"
                    name="registryId"
                    value={formData.registryId}
                    label="Registry Office"
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      }
                    }}
                  >
                    {registries.map((registry) => (
                      <MenuItem key={registry.id} value={registry.id}>{registry.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="additional-fields-label">Additional Fields</InputLabel>
                  <Select
                    labelId="additional-fields-label"
                    id="additional-fields"
                    name="additionalFields"
                    value={formData.additionalFields}
                    label="Additional Fields"
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      }
                    }}
                  >
                    {additionalOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="measurement-selection-label">Measurement Selection</InputLabel>
                  <Select
                    labelId="measurement-selection-label"
                    id="measurement-selection"
                    name="measurementSelection"
                    value={formData.measurementSelection}
                    label="Measurement Selection"
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      }
                    }}
                  >
                    {measurementSelections.map((selection) => (
                      <MenuItem key={selection.id} value={selection.id}>{selection.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Amount (₹)"
                  name="totalAmount"
                  type="number"
                  value={formData.totalAmount}
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
            Save Purchase
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default PurchaseLandSystem;