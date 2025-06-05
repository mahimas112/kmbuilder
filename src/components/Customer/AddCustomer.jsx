import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    InputAdornment,
    CircularProgress,
    Divider,
    Snackbar,
    Alert,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    useTheme,
    useMediaQuery,
    IconButton
} from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axiosInstance from '../../axiosInstance';

// Define steps for stepper
const steps = [
    'Personal Information',
    'Contact Details',
    'Address Information',
    'Nominee Details',
    'Document Upload',
    'Review & Submit'
];

// Initial form data
const initialFormData = {
    customerId: '',
    associateCode: '',
    customerName: '',
    title: '',
    swdOf: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    pinCode: '',
    city: '',
    state: '',
    emailId: '',
    panOrAddharNo: '',
    occupation: '',
    nationality: '',
    nomineeName: '',
    relation: '',
    associatename: '',
    userVisitType: '',
    mobileNo:'',
    profilePic: null,
    uploadAddhaarCard: null
};

const AddCustomerForm = ({ editMode = false, initialData = null }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // States
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [filePreview, setFilePreview] = useState({
        profilePic: null,
        uploadAddhaarCard: null
    });
    const [associates, setAssociates] = useState([]);
    const [associatesLoading, setAssociatesLoading] = useState(false);

    // New function to fetch associates
    const fetchAssociates = async () => {
        setAssociatesLoading(true);
        try {
            const response = await axiosInstance.get('/realEstate/associate/getAll');

            if (response.data.status === 200 && Array.isArray(response.data.data)) {
                setAssociates(response.data.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching associates:', error);
            setNotification({
                open: true,
                message: 'Failed to load associates. Please try again.',
                severity: 'error'
            });
        } finally {
            setAssociatesLoading(false);
        }
    };

    // Modify the useEffect to call fetchAssociates
    useEffect(() => {
        fetchAssociates();
    }, []);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when field is updated
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };
    const handleCloseNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        const { name, files } = e.target;

        if (files && files.length > 0) {
            // Validate file size (max 2MB)
            if (files[0].size > 2 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    [name]: 'File size should not exceed 2MB'
                }));
                return;
            }

            // Validate file type (images only)
            if (!files[0].type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    [name]: 'Only image files are allowed'
                }));
                return;
            }

            // Set file to form data
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));

            // Generate preview URL
            setFilePreview(prev => ({
                ...prev,
                [name]: URL.createObjectURL(files[0])
            }));

            // Clear error
            if (errors[name]) {
                setErrors(prev => ({
                    ...prev,
                    [name]: null
                }));
            }
        }
    };

    // Handle file delete
    const handleFileDelete = (name) => {
        setFormData(prev => ({
            ...prev,
            [name]: null
        }));

        setFilePreview(prev => ({
            ...prev,
            [name]: null
        }));
    };

    // Validate current step
    const validateStep = () => {
        const newErrors = {};
        let isValid = true;

        // Step 0: Personal Information
        if (activeStep === 0) {
            if (!formData.title.trim()) {
                newErrors.title = 'Title is required';
                isValid = false;
            }

            if (!formData.customerName.trim()) {
                newErrors.customerName = 'Customer Name is required';
                isValid = false;
            }

            if (!formData.swdOf.trim()) {
                newErrors.swdOf = 'Son/Daughter/Wife of is required';
                isValid = false;
            }

            if (!formData.mobileNo.trim()) {
                newErrors.swdOf = 'Mobile Number of is required';
                isValid = false;
            }

            if (!formData.dateOfBirth) {
                newErrors.dateOfBirth = 'Date of Birth is required';
                isValid = false;
            }

            if (!formData.gender) {
                newErrors.gender = 'Gender is required';
                isValid = false;
            }

            if (!formData.nationality) {
                newErrors.nationality = 'Nationality is required';
                isValid = false;
            }
        }

        // Step 1: Contact Details
        if (activeStep === 1) {
            if (!formData.emailId.trim()) {
                newErrors.emailId = 'Email is required';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId.trim())) {
                newErrors.emailId = 'Invalid email format';
                isValid = false;
            }

            if (!formData.occupation.trim()) {
                newErrors.occupation = 'Occupation is required';
                isValid = false;
            }

            if (!formData.panOrAddharNo.trim()) {
                newErrors.panOrAddharNo = 'PAN or Aadhaar number is required';
                isValid = false;
            }
        }

        // Step 2: Address Information
        if (activeStep === 2) {
            if (!formData.address.trim()) {
                newErrors.address = 'Address is required';
                isValid = false;
            }

            if (!formData.city.trim()) {
                newErrors.city = 'City is required';
                isValid = false;
            }

            if (!formData.state.trim()) {
                newErrors.state = 'State is required';
                isValid = false;
            }

            if (!formData.pinCode.trim()) {
                newErrors.pinCode = 'Pin Code is required';
                isValid = false;
            } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
                newErrors.pinCode = 'Invalid Pin Code (6 digits)';
                isValid = false;
            }
        }

        // Step 3: Nominee Details
        if (activeStep === 3) {
            if (!formData.nomineeName.trim()) {
                newErrors.nomineeName = 'Nominee Name is required';
                isValid = false;
            }

            if (!formData.relation.trim()) {
                newErrors.relation = 'Relation is required';
                isValid = false;
            }
        }

        // Step 4: Document Upload
        if (activeStep === 4 && !editMode) {
            if (!formData.profilePic) {
                newErrors.profilePic = 'Profile Picture is required';
                isValid = false;
            }

            if (!formData.uploadAddhaarCard) {
                newErrors.uploadAddhaarCard = 'Aadhaar Card is required';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle next step
    const handleNext = () => {
        if (validateStep()) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    // Handle back step
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // Handle form submission
    // Modify the handleSubmit function
    const handleSubmit = async () => {
        // Final validation
        if (!validateStep()) {
            return;
        }

        setLoading(true);

        try {
            // Create FormData for file uploads
            const formDataToSend = new FormData();

            // Append all form fields to FormData
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    // Special handling for date and associate fields
                    if (key === 'dateOfBirth') {
                        formDataToSend.append(key,
                            formData[key] instanceof Date
                                ? formData[key].toISOString().split('T')[0]
                                : formData[key]
                        );
                    } 
                    // else if (key === 'associateName') {
                    //     // Find the associateCode for the selected associate
                    //     const selectedAssociate = associates.find(a => a.name === formData[key]);
                    //     if (selectedAssociate) {
                    //         formDataToSend.append('associateCode', selectedAssociate.associateId);
                    //     }
                    // } 
                    else {
                        formDataToSend.append(key, formData[key]);
                    }
                }
            });

            // Explicitly add associateCode if it's not already added
            if (formData.associateName) {
                const selectedAssociate = associates.find(a => a.name === formData.associateName);
                if (selectedAssociate && !formDataToSend.get('associateCode')) {
                    formDataToSend.append('associateCode', selectedAssociate.associateId);
                }
            }

            // API call to create/update customer
            const response = await axiosInstance.post(
                editMode
                    ? '/realEstate/customer/update'
                    : '/realEstate/addNew-customer/post',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Handle different possible response scenarios
            if (response.data && (response.data.status === 201 || response.data.status === 200)) {
                // Success notification
                setNotification({
                    open: true,
                    message: `Customer ${editMode ? 'updated' : 'created'} successfully`,
                    severity: 'success'
                });

                // Move to success step
                setActiveStep(steps.length);
            } else {
                // Handle unexpected success response
                throw new Error(response.data.message || `Failed to ${editMode ? 'update' : 'create'} customer`);
            }
        } catch (error) {
            console.error('Submission Error:', error);

            // Comprehensive error handling
            let errorMessage = 'An unexpected error occurred';

            if (error.response) {
                // The request was made and the server responded with a status code
                switch (error.response.status) {
                    case 400:
                        errorMessage = 'Invalid data. Please check your inputs.';
                        break;
                    case 401:
                        errorMessage = 'Unauthorized. Please log in again.';
                        break;
                    case 403:
                        errorMessage = 'You do not have permission to perform this action.';
                        break;
                    case 404:
                        errorMessage = 'The requested resource was not found.';
                        break;
                    case 409:
                        errorMessage = 'A customer with similar details already exists.';
                        break;
                    case 500:
                        errorMessage = 'Server error. Please try again later.';
                        break;
                    default:
                        errorMessage = error.response.data.message || 'An error occurred while processing your request.';
                }
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = 'No response from server. Please check your internet connection.';
            } else {
                // Something happened in setting up the request
                errorMessage = error.message || 'An unexpected error occurred';
            }

            // Show error notification
            setNotification({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };
    // Render step content
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth error={!!errors.title}>
                                <InputLabel>Title</InputLabel>
                                <Select
                                    name="title"
                                    value={formData.title}
                                    label="Title"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Mr">Mr</MenuItem>
                                    <MenuItem value="Mrs">Mrs</MenuItem>
                                    <MenuItem value="Ms">Ms</MenuItem>
                                    <MenuItem value="Dr">Dr</MenuItem>
                                </Select>
                                {errors.title && (
                                    <FormHelperText error>{errors.title}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                label="Customer Name"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                error={!!errors.customerName}
                                helperText={errors.customerName}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Son/Daughter/Wife of"
                                name="swdOf"
                                value={formData.swdOf}
                                onChange={handleChange}
                                error={!!errors.swdOf}
                                helperText={errors.swdOf}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                name="mobileNo"
                                value={formData.mobileNo}
                                onChange={handleChange}
                                error={!!errors.mobileNo}
                                helperText={errors.mobileNo}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Date of Birth"
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.dateOfBirth}
                                helperText={errors.dateOfBirth}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl component="fieldset" error={!!errors.gender} required>
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup
                                    row
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                </RadioGroup>
                                {errors.gender && (
                                    <FormHelperText error>{errors.gender}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nationality"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                error={!!errors.nationality}
                                helperText={errors.nationality}
                                required
                            />
                        </Grid>
                    </Grid>
                );

            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email ID"
                                name="emailId"
                                type="email"
                                value={formData.emailId}
                                onChange={handleChange}
                                error={!!errors.emailId}
                                helperText={errors.emailId}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Occupation"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                error={!!errors.occupation}
                                helperText={errors.occupation}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="PAN/Aadhaar Number"
                                name="panOrAddharNo"
                                value={formData.panOrAddharNo}
                                onChange={handleChange}
                                error={!!errors.panOrAddharNo}
                                helperText={errors.panOrAddharNo}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="User Visit Type"
                                name="userVisitType"
                                value={formData.userVisitType}
                                onChange={handleChange}
                                select
                            >
                                <MenuItem value="Online">Online</MenuItem>
                                <MenuItem value="Offline">Offline</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                multiline
                                rows={3}
                                value={formData.address}
                                onChange={handleChange}
                                error={!!errors.address}
                                helperText={errors.address}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={!!errors.city}
                                helperText={errors.city}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                error={!!errors.state}
                                helperText={errors.state}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Pin Code"
                                name="pinCode"
                                value={formData.pinCode}
                                onChange={handleChange}
                                error={!!errors.pinCode}
                                helperText={errors.pinCode}
                                required
                                inputProps={{ maxLength: 6 }}
                            />
                        </Grid>
                    </Grid>
                );

            case 3:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nominee Name"
                                name="nomineeName"
                                value={formData.nomineeName}
                                onChange={handleChange}
                                error={!!errors.nomineeName}
                                helperText={errors.nomineeName}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Relation with Nominee"
                                name="relation"
                                value={formData.relation}
                                onChange={handleChange}
                                error={!!errors.relation}
                                helperText={errors.relation}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.associateName}>
                                <InputLabel>Select Associate</InputLabel>
                                <Select
                                    name="associateName"
                                    value={formData.associateName}
                                    label="Select Associate"
                                    onChange={(e) => {
                                        // Update both associateName and associateCode
                                        const selectedAssociate = associates.find(a => a.name === e.target.value);
                                        setFormData(prev => ({
                                            ...prev,
                                            associateName: selectedAssociate ? selectedAssociate.name : '',
                                            associateCode: selectedAssociate ? selectedAssociate.associateReperCode : ''
                                        }));
                                    }}
                                    disabled={associatesLoading}
                                >
                                    {associatesLoading ? (
                                        <MenuItem disabled>Loading Associates...</MenuItem>
                                    ) : associates.length === 0 ? (
                                        <MenuItem disabled>No Associates Available</MenuItem>
                                    ) : (
                                        associates.map((associate) => (
                                            <MenuItem
                                                key={associate.associateId}
                                                value={associate.name}
                                            >
                                                {associate.name} ({associate.associateReperCode})
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                                {errors.associateName && (
                                    <FormHelperText error>{errors.associateName}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Associate Code"
                                name="associateCode"
                                value={formData.associateCode}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                );

            case 4:
                return (
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    border: '1px dashed',
                                    borderColor: errors.profilePic ? 'error.main' : 'divider',
                                    borderRadius: 1,
                                    p: 2,
                                    mb: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 220,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {filePreview.profilePic ? (
                                    <>
                                        <img
                                            src={filePreview.profilePic}
                                            alt="Profile Preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain'
                                            }}
                                        />
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor: 'rgba(255, 255, 255, 0.7)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                                                }
                                            }}
                                            onClick={() => handleFileDelete('profilePic')}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="upload-profile-pic"
                                            type="file"
                                            name="profilePic"
                                            onChange={handleFileUpload}
                                        />
                                        <label htmlFor="upload-profile-pic">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<CloudUploadIcon />}
                                                sx={{ mb: 2 }}
                                            >
                                                Upload Profile Picture
                                            </Button>
                                        </label>
                                        <Typography variant="body2" color="textSecondary">
                                            Profile photo (JPG, PNG, max 2MB)
                                        </Typography>
                                    </>
                                )}
                            </Box>
                            {errors.profilePic && (
                                <FormHelperText error>{errors.profilePic}</FormHelperText>
                            )}
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                Profile Picture*
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    border: '1px dashed',
                                    borderColor: errors.uploadAddhaarCard ? 'error.main' : 'divider',
                                    borderRadius: 1,
                                    p: 2,
                                    mb: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 220,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {filePreview.uploadAddhaarCard ? (
                                    <>
                                        <img
                                            src={filePreview.uploadAddhaarCard}
                                            alt="Aadhaar Card Preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain'
                                            }}
                                        />
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor: 'rgba(255, 255, 255, 0.7)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                                                }
                                            }}
                                            onClick={() => handleFileDelete('uploadAddhaarCard')}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="upload-aadhaar-card"
                                            type="file"
                                            name="uploadAddhaarCard"
                                            onChange={handleFileUpload}
                                        />
                                        <label htmlFor="upload-aadhaar-card">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<CloudUploadIcon />}
                                                sx={{ mb: 2 }}
                                            >
                                                Upload Aadhaar Card
                                            </Button>
                                        </label>
                                        <Typography variant="body2" color="textSecondary">
                                            Aadhaar Card (JPG, PNG, max 2MB)
                                        </Typography>
                                    </>
                                )}
                            </Box>
                            {errors.uploadAddhaarCard && (
                                <FormHelperText error>{errors.uploadAddhaarCard}</FormHelperText>
                            )}
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                Aadhaar Card*
                            </Typography>
                        </Grid>
                    </Grid>
                );
            case 5:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Review Your Information
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Personal Information */}
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        Personal Information
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Name
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.title} {formData.customerName}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Son/Daughter/Wife of
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.swdOf}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Date of Birth
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.dateOfBirth}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Gender
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.gender}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Nationality
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.nationality}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Contact Details */}
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        Contact Details
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Email ID
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.emailId}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Occupation
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.occupation}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                PAN/Aadhaar Number
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.panOrAddharNo}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                User Visit Type
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.userVisitType || 'Not Specified'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Address Information */}
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        Address Information
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary">
                                                Full Address
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.address}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="body2" color="text.secondary">
                                                City
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.city}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="body2" color="text.secondary">
                                                State
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.state}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="body2" color="text.secondary">
                                                Pin Code
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.pinCode}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Nominee Details */}
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        Nominee Details
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Nominee Name
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.nomineeName}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Relation
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.relation}
                                            </Typography>
                                        </Grid>

                                        {formData.associateName && (
                                            <>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Associated Associate Name
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {formData.associateName}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Associate Code
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {formData.associateCode}
                                                    </Typography>
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Document Details */}
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        Uploaded Documents
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Profile Picture
                                            </Typography>
                                            {filePreview.profilePic ? (
                                                <Box
                                                    component="img"
                                                    src={filePreview.profilePic}
                                                    alt="Profile Preview"
                                                    sx={{
                                                        width: 150,
                                                        height: 150,
                                                        objectFit: 'cover',
                                                        borderRadius: 1
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="error">
                                                    No profile picture uploaded
                                                </Typography>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Aadhaar Card
                                            </Typography>
                                            {filePreview.uploadAddhaarCard ? (
                                                <Box
                                                    component="img"
                                                    src={filePreview.uploadAddhaarCard}
                                                    alt="Aadhaar Card Preview"
                                                    sx={{
                                                        width: 150,
                                                        height: 150,
                                                        objectFit: 'cover',
                                                        borderRadius: 1
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="error">
                                                    No Aadhaar card uploaded
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Please review all information carefully before submitting. By clicking submit, you confirm that all details provided are accurate.
                            </Typography>
                        </Box>
                    </Box>
                );

            default:
                return (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
                        <Typography variant="h5" color="success.main" gutterBottom>
                            {editMode ? 'Customer Updated Successfully!' : 'Customer Registered Successfully!'}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {editMode
                                ? 'The customer information has been updated in the system.'
                                : 'The new customer has been registered successfully in the system.'}
                        </Typography>
                    </Box>
                );
        }
    };
    return (
        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    {editMode ? 'Edit Customer' : 'Customer Registration'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {editMode
                        ? 'Update associate information by completing all required fields.'
                        : 'Please fill out the form with accurate information to register as an associate.'}
                </Typography>
            </Box>

            <Stepper
                activeStep={activeStep}
                alternativeLabel={!isMobile}
                orientation={isMobile ? 'vertical' : 'horizontal'}
                sx={{ mb: 4 }}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box>
                {getStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4, pb: 2 }}>
                <Button
                    color="inherit"
                    disabled={activeStep === 0 || loading || activeStep === steps.length}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    startIcon={<NavigateBeforeIcon />}
                >
                    Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />

                {activeStep === steps.length - 1 ? (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{
                            bgcolor: '#6B66FF',
                            '&:hover': { bgcolor: '#5652e5' }
                        }}
                        startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    >
                        {loading ? 'Submitting...' : (editMode ? 'Update' : 'Submit')}
                    </Button>
                ) : (
                    activeStep < steps.length && (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            endIcon={<NavigateNextIcon />}
                            sx={{
                                bgcolor: '#6B66FF',
                                '&:hover': { bgcolor: '#5652e5' }
                            }}
                        >
                            Next
                        </Button>
                    )
                )}
            </Box>

            {/* Notifications */}
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
        </Paper>
    );
};

export default AddCustomerForm;