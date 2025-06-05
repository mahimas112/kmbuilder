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
    IconButton,
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

} from '@mui/material';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

// Define steps for stepper
const steps = [
    'Personal Information',
    'Contact Details',
    'Sponsor Information',
    'Bank Details',
    'Nominee Details',
    'Documents Upload',
    'Review & Submit'
];

// Initial form data
const initialFormData = {
    // Personal Information
    role: '',
    title: '',
    name: '',
    gender: '',
    dob: null,
    aadhaarNo: '',
    panCardNo: '',
    fatherOrHusbandName: '',

    // Contact Details
    mobile: '',
    emailId: '',
    address: '',
    city: '',
    state: '',
    password: '',

    // Sponsor Information
    refralCodeOfPresentAssociate: '',
    referncerAssociateName: '',
    underPlaceId: '',
    rankId: '',
    rankName: '',
    joiningDate: null,

    // Bank Details
    accountHolderName: '',
    accountNo: '',
    ifscCode: '',
    bankName: '',

    // Nominee Details
    nomineeName: '',
    nomineeRelation: '',
    nomineeAge: '',

    // Documents Upload
    uploadPhoto: null,
    uploadIdProof: null,
    uploadPanCard: null,
    uploadBankPassbook: null,

    // Hidden fields
    associateId: '' // For edit mode
};

const AssociateForm = ({ editMode = false, initialData = null, onSuccess }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const location = useLocation();
    const { mode = 'add', associate } = location.state || {};

    // States
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [ranks, setRanks] = useState([]);
    const [ranksLoading, setRanksLoading] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [filePreview, setFilePreview] = useState({
        uploadPhoto: null,
        uploadIdProof: null,
        uploadPanCard: null,
        uploadBankPassbook: null
    });

    // Set initial data if in edit mode
    useEffect(() => {
        if (mode === 'edit' && associate) {
            // Format date from string to Date object
            const formattedDob = associate.dob ? new Date(associate.dob) : null;

            setFormData({
                name: associate.name || '',
                gender: associate.gender || 'Male',
                title: associate.title || 'Mr',
                fatherOrHusbandName: associate.fatherOrHusbandName || '',
                dob: formattedDob,
                address: associate.address || '',
                city: associate.city || '',
                state: associate.state || '',
                mobile: associate.mobile || '',
                emailId: associate.emailId || '',
                panCardNo: associate.panCardNo || '',
                aadhaarNo: associate.aadhaarNo || '',
                bankName: associate.bankName || '',
                accountNo: associate.accountNo || '',
                ifscCode: associate.ifscCode || '',
                accountHolderName: associate.accountHolderName || '',
                nomineeName: associate.nomineeName || '',
                nomineeRelation: associate.nomineeRelation || '',
                nomineeAge: associate.nomineeAge || 0,
                rankId: associate.rankId || '',
                rankName: associate.rankName || '',
                refralCodeOfPresentAssociate: associate.refralCodeOfPresentAssociate || '',
                referncerAssociateName: associate.referncerAssociateName || '',
                // Files remain null until user uploads new ones
                uploadPhoto: null,
                uploadIdProof: null,
                uploadPanCard: null,
                uploadBankPassbook: null
            });
        }
    }, [mode, associate]);

    // Fetch all ranks when component mounts
    useEffect(() => {
        fetchRanks();
    }, []);

    // Fetch ranks list
    const fetchRanks = async () => {
        setRanksLoading(true);
        try {
            const response = await axiosInstance.get('/realEstate/rank/getAll');

            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setRanks(response.data.data);
            } else {
                console.error('Invalid ranks response format:', response.data);
                setRanks([]);
            }
        } catch (error) {
            console.error('Error fetching ranks:', error);
            setRanks([]);
        } finally {
            setRanksLoading(false);
        }
    };

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

    // Handle date field changes
    const handleDateChange = (name, date) => {
        setFormData(prev => ({
            ...prev,
            [name]: date
        }));

        // Clear error when field is updated
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
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

    // Handle rank selection
    const handleRankChange = (e) => {
        const { value } = e.target;
        const selectedRank = ranks.find(rank => rank.rankId === value);

        setFormData(prev => ({
            ...prev,
            rankId: value,
            rankName: selectedRank ? selectedRank.rankName : ''
        }));

        // Clear errors
        if (errors.rankId) {
            setErrors(prev => ({
                ...prev,
                rankId: null
            }));
        }
    };

    // Validate current step
    const validateStep = () => {
        const newErrors = {};
        let isValid = true;

        // Step 1: Personal Information
        if (activeStep === 0) {
            if (!formData.role.trim()) {
                newErrors.role = 'role is required';
                isValid = false;
            }
            if (!formData.title.trim()) {
                newErrors.title = 'Title is required';
                isValid = false;
            }

            if (!formData.name.trim()) {
                newErrors.name = 'Name is required';
                isValid = false;
            } else if (formData.name.trim().length < 3) {
                newErrors.name = 'Name should be at least 3 characters';
                isValid = false;
            }

            if (!formData.gender) {
                newErrors.gender = 'Gender is required';
                isValid = false;
            }

            // if (!formData.dob) {
            //     newErrors.dob = 'Date of birth is required';
            //     isValid = false;
            // }

            if (!formData.aadhaarNo.trim()) {
                newErrors.aadhaarNo = 'Aadhaar number is required';
                isValid = false;
            } else if (!/^\d{12}$/.test(formData.aadhaarNo.trim())) {
                newErrors.aadhaarNo = 'Aadhaar number should be 12 digits';
                isValid = false;
            }

            if (!formData.panCardNo.trim()) {
                newErrors.panCardNo = 'PAN card number is required';
                isValid = false;
            } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCardNo.trim())) {
                newErrors.panCardNo = 'Invalid PAN card format (e.g., ABCDE1234F)';
                isValid = false;
            }

            if (!formData.fatherOrHusbandName.trim()) {
                newErrors.fatherOrHusbandName = 'Father/Husband name is required';
                isValid = false;
            }
        }

        // Step 2: Contact Details
        else if (activeStep === 1) {
            if (!formData.mobile.trim()) {
                newErrors.mobile = 'Mobile number is required';
                isValid = false;
            } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
                newErrors.mobile = 'Mobile number should be 10 digits';
                isValid = false;
            }

            if (!formData.emailId.trim()) {
                newErrors.emailId = 'Email is required';
                isValid = false;

            }
            if (!formData.password.trim()) {
                newErrors.password = 'Password is required';
                isValid = false;

            }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId.trim())) {
                newErrors.emailId = 'Invalid email format';
                isValid = false;
            }

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
        }

        // Step 3: Sponsor Information
        else if (activeStep === 2) {
            // We don't validate refralCodeOfPresentAssociate as it might be optional

            if (!formData.rankId) {
                newErrors.rankId = 'Rank is required';
                isValid = false;
            }

            // if (!formData.joiningDate) {
            //     newErrors.joiningDate = 'Joining date is required';
            //     isValid = false;
            // }
        }

        // Step 4: Bank Details
        else if (activeStep === 3) {
            if (!formData.accountHolderName.trim()) {
                newErrors.accountHolderName = 'Account holder name is required';
                isValid = false;
            }

            if (!formData.accountNo.trim()) {
                newErrors.accountNo = 'Account number is required';
                isValid = false;
            } else if (!/^\d{9,18}$/.test(formData.accountNo.trim())) {
                newErrors.accountNo = 'Invalid account number (9-18 digits)';
                isValid = false;
            }

            if (!formData.ifscCode.trim()) {
                newErrors.ifscCode = 'IFSC code is required';
                isValid = false;
            } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.trim())) {
                newErrors.ifscCode = 'Invalid IFSC code format (e.g., SBIN0123456)';
                isValid = false;
            }

            if (!formData.bankName.trim()) {
                newErrors.bankName = 'Bank name is required';
                isValid = false;
            }
        }

        // Step 5: Nominee Details
        else if (activeStep === 4) {
            if (!formData.nomineeName.trim()) {
                newErrors.nomineeName = 'Nominee name is required';
                isValid = false;
            }

            if (!formData.nomineeRelation.trim()) {
                newErrors.nomineeRelation = 'Nominee relation is required';
                isValid = false;
            }

            if (!formData.nomineeAge.trim()) {
                newErrors.nomineeAge = 'Nominee age is required';
                isValid = false;
            } else if (!/^\d+$/.test(formData.nomineeAge.trim()) || parseInt(formData.nomineeAge) <= 0) {
                newErrors.nomineeAge = 'Nominee age must be a positive number';
                isValid = false;
            }
        }

        // Step 6: Documents Upload
        else if (activeStep === 5) {
            // Only validate documents in add mode, not in edit mode (unless being changed)
            if (!editMode) {
                if (!formData.uploadPhoto) {
                    newErrors.uploadPhoto = 'Photo is required';
                    isValid = false;
                }

                if (!formData.uploadIdProof) {
                    newErrors.uploadIdProof = 'ID proof is required';
                    isValid = false;
                }

                if (!formData.uploadPanCard) {
                    newErrors.uploadPanCard = 'PAN card is required';
                    isValid = false;
                }

                if (!formData.uploadBankPassbook) {
                    newErrors.uploadBankPassbook = 'Bank passbook/statement is required';
                    isValid = false;
                }
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
                if (key === 'dob' || key === 'joiningDate') {
                    // Format dates to string for API
                    if (formData[key]) {
                        formDataToSend.append(key, format(formData[key], 'yyyy-MM-dd'));
                    }
                } else if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            let response;

            if (editMode) {
                // Update existing associate
                response = await axiosInstance.put(
                    '/realEstate/associate/update',
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            } else {
                // Create new associate
                response = await axiosInstance.post(
                    '/realEstate/associate/post',
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            if (response.data && (response.data.status === 201 || response.data.status === 200)) {
                setNotification({
                    open: true,
                    message: `Associate ${editMode ? 'updated' : 'created'} successfully`,
                    severity: 'success'
                });

                // Call success callback with response data
                if (onSuccess) {
                    onSuccess(response.data);
                }

                // Keep on success step
                setActiveStep(steps.length);
            } else {
                throw new Error(response.data.message || `Failed to ${editMode ? 'update' : 'create'} associate`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);

            let errorMessage = `Failed to ${editMode ? 'update' : 'create'} associate`;

            if (error.response) {
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else {
                    errorMessage = `Error: ${error.response.status} - ${error.response.statusText}`;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            setNotification({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle notification close
    const handleCloseNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    // Add this function to handle referral code search
    const handleReferralCodeSearch = async () => {
        if (!formData.refralCodeOfPresentAssociate.trim()) {
            handleNotification('Please enter a referral code', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.get(`/realEstate/associate/assocateCode?assoccode=${formData.refralCodeOfPresentAssociate}`);

            if (response.data && response.data.status === 200 && response.data.data) {
                const associate = response.data.data;
                setFormData(prev => ({
                    ...prev,
                    referncerAssociateName: associate.name || '',
                    underPlaceId: associate.associateId || ''
                }));
                handleNotification('Referral code found', 'success');
            } else {
                handleNotification('No associate found with this referral code', 'error');
                setFormData(prev => ({
                    ...prev,
                    referncerAssociateName: '',
                    underPlaceId: ''
                }));
            }
        } catch (error) {
            handleNotification('Error searching for referral code', 'error');
            console.error('Error searching referral code:', error);
        } finally {
            setLoading(false);
        }
    };

    // Render step content based on active step
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth error={!!errors.title}>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    name="role"
                                    value={formData.role}
                                    label="Role"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="ASSOCIATE">Associate</MenuItem>
                                </Select>
                                {errors.role && (
                                    <FormHelperText error>{errors.role}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

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
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
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
                            {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date of Birth*"
                                    value={formData.dob}
                                    onChange={(date) => handleDateChange('dob', date)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.dob,
                                            helperText: errors.dob,
                                            required: true
                                        }
                                    }}
                                    maxDate={new Date()}
                                />
                            </LocalizationProvider> */}
                            <TextField
                                label="Date of Birth*"
                                type="date"
                                value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                                onChange={(event) => handleDateChange('dob', new Date(event.target.value).toISOString())}
                                fullWidth
                                error={!!errors.dob}
                                helperText={errors.dob}
                                required
                                InputLabelProps={{ shrink: true }}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Aadhaar Number"
                                name="aadhaarNo"
                                value={formData.aadhaarNo}
                                onChange={handleChange}
                                error={!!errors.aadhaarNo}
                                helperText={errors.aadhaarNo}
                                required
                                inputProps={{ maxLength: 12 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="PAN Card Number"
                                name="panCardNo"
                                value={formData.panCardNo}
                                onChange={handleChange}
                                error={!!errors.panCardNo}
                                helperText={errors.panCardNo}
                                required
                                inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Father's/Husband's Name"
                                name="fatherOrHusbandName"
                                value={formData.fatherOrHusbandName}
                                onChange={handleChange}
                                error={!!errors.fatherOrHusbandName}
                                helperText={errors.fatherOrHusbandName}
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
                                label="Mobile Number"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                error={!!errors.mobile}
                                helperText={errors.mobile}
                                required
                                inputProps={{ maxLength: 10 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                }}
                            />
                        </Grid>

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
                                label="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                required
                            />
                        </Grid>



                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                error={!!errors.address}
                                helperText={errors.address}
                                required
                                multiline
                                rows={3}
                            />
                        </Grid>




                        <Grid item xs={12} sm={6}>
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

                        <Grid item xs={12} sm={6}>
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
                    </Grid>
                );

            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Referral Code"
                                name="refralCodeOfPresentAssociate"
                                value={formData.refralCodeOfPresentAssociate}
                                onChange={handleChange}
                                helperText="Enter the referral code of the associate who referred you"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleReferralCodeSearch}
                                                edge="end"
                                                disabled={loading}
                                            >
                                                {loading ? <CircularProgress size={24} /> : <SearchIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Referrer Associate Name"
                                value={formData.referncerAssociateName}
                                disabled
                                helperText="This field will be auto-populated when you search for a referral code"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Under Place ID"
                                name="underPlaceId"
                                value={formData.underPlaceId}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.rankId} required>
                                <InputLabel>Rank</InputLabel>
                                <Select
                                    name="rankId"
                                    value={formData.rankId}
                                    label="Rank"
                                    onChange={handleRankChange}
                                    disabled={ranksLoading}
                                >
                                    {ranksLoading ? (
                                        <MenuItem disabled>Loading ranks...</MenuItem>
                                    ) : ranks.length === 0 ? (
                                        <MenuItem disabled>No ranks available</MenuItem>
                                    ) : (
                                        ranks.map(rank => (
                                            <MenuItem key={rank.rankId} value={rank.rankId}>
                                                {rank.rankName}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                                {errors.rankId && (
                                    <FormHelperText error>{errors.rankId}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Joining Date*"
                                    value={formData.joiningDate}
                                    onChange={(date) => handleDateChange('joiningDate', date)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.joiningDate,
                                            helperText: errors.joiningDate,
                                            required: true
                                        }
                                    }}
                                    maxDate={new Date()}
                                />
                            </LocalizationProvider> */}

                            <TextField
                                label="Joining Date*"
                                type="date"
                                value={formData.joiningDate ? new Date(formData.joiningDate).toISOString().split('T')[0] : ''}
                                onChange={(event) => handleDateChange('joiningDate', new Date(event.target.value).toISOString())}
                                fullWidth
                                error={!!errors.joiningDate}
                                helperText={errors.joiningDate}
                                required
                                InputLabelProps={{ shrink: true }}
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
                                label="Account Holder Name"
                                name="accountHolderName"
                                value={formData.accountHolderName}
                                onChange={handleChange}
                                error={!!errors.accountHolderName}
                                helperText={errors.accountHolderName}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Account Number"
                                name="accountNo"
                                value={formData.accountNo}
                                onChange={handleChange}
                                error={!!errors.accountNo}
                                helperText={errors.accountNo}
                                required
                                inputProps={{ maxLength: 18 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="IFSC Code"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                                error={!!errors.ifscCode}
                                helperText={errors.ifscCode || "e.g., SBIN0123456"}
                                required
                                inputProps={{ maxLength: 11, style: { textTransform: 'uppercase' } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Bank Name"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                error={!!errors.bankName}
                                helperText={errors.bankName}
                                required
                            />
                        </Grid>
                    </Grid>
                );

            case 4:
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
                                name="nomineeRelation"
                                value={formData.nomineeRelation}
                                onChange={handleChange}
                                error={!!errors.nomineeRelation}
                                helperText={errors.nomineeRelation}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nominee Age"
                                name="nomineeAge"
                                type="number"
                                value={formData.nomineeAge}
                                onChange={handleChange}
                                error={!!errors.nomineeAge}
                                helperText={errors.nomineeAge}
                                required
                                InputProps={{
                                    inputProps: { min: 1, max: 120 }
                                }}
                            />
                        </Grid>
                    </Grid>
                );
            case 5:
                return (
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    border: '1px dashed',
                                    borderColor: errors.uploadPhoto ? 'error.main' : 'divider',
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
                                {filePreview.uploadPhoto ? (
                                    <>
                                        <img
                                            src={filePreview.uploadPhoto}
                                            alt="Photo Preview"
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
                                            onClick={() => handleFileDelete('uploadPhoto')}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="upload-photo"
                                            type="file"
                                            name="uploadPhoto"
                                            onChange={handleFileUpload}
                                        />
                                        <label htmlFor="upload-photo">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<CloudUploadIcon />}
                                                sx={{ mb: 2 }}
                                            >
                                                Upload Photo
                                            </Button>
                                        </label>
                                        <Typography variant="body2" color="textSecondary">
                                            Profile photo (JPG, PNG, max 2MB)
                                        </Typography>
                                    </>
                                )}
                            </Box>
                            {errors.uploadPhoto && (
                                <FormHelperText error>{errors.uploadPhoto}</FormHelperText>
                            )}
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                Profile Photo*
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    border: '1px dashed',
                                    borderColor: errors.uploadIdProof ? 'error.main' : 'divider',
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
                                {filePreview.uploadIdProof ? (
                                    <>
                                        <img
                                            src={filePreview.uploadIdProof}
                                            alt="ID Proof Preview"
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
                                            onClick={() => handleFileDelete('uploadIdProof')}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="upload-id-proof"
                                            type="file"
                                            name="uploadIdProof"
                                            onChange={handleFileUpload}
                                        />
                                        <label htmlFor="upload-id-proof">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<CloudUploadIcon />}
                                                sx={{ mb: 2 }}
                                            >
                                                Upload ID Proof
                                            </Button>
                                        </label>
                                        <Typography variant="body2" color="textSecondary">
                                            Aadhaar Card, Voter ID, etc. (JPG, PNG, max 2MB)
                                        </Typography>
                                    </>
                                )}
                            </Box>
                            {errors.uploadIdProof && (
                                <FormHelperText error>{errors.uploadIdProof}</FormHelperText>
                            )}
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                ID Proof*
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    border: '1px dashed',
                                    borderColor: errors.uploadPanCard ? 'error.main' : 'divider',
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
                                {filePreview.uploadPanCard ? (
                                    <>
                                        <img
                                            src={filePreview.uploadPanCard}
                                            alt="PAN Card Preview"
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
                                            onClick={() => handleFileDelete('uploadPanCard')}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="upload-pan-card"
                                            type="file"
                                            name="uploadPanCard"
                                            onChange={handleFileUpload}
                                        />
                                        <label htmlFor="upload-pan-card">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<CloudUploadIcon />}
                                                sx={{ mb: 2 }}
                                            >
                                                Upload PAN Card
                                            </Button>
                                        </label>
                                        <Typography variant="body2" color="textSecondary">
                                            PAN Card (JPG, PNG, max 2MB)
                                        </Typography>
                                    </>
                                )}
                            </Box>
                            {errors.uploadPanCard && (
                                <FormHelperText error>{errors.uploadPanCard}</FormHelperText>
                            )}
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                PAN Card*
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    border: '1px dashed',
                                    borderColor: errors.uploadBankPassbook ? 'error.main' : 'divider',
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
                                {filePreview.uploadBankPassbook ? (
                                    <>
                                        <img
                                            src={filePreview.uploadBankPassbook}
                                            alt="Bank Passbook Preview"
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
                                            onClick={() => handleFileDelete('uploadBankPassbook')}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="upload-bank-passbook"
                                            type="file"
                                            name="uploadBankPassbook"
                                            onChange={handleFileUpload}
                                        />
                                        <label htmlFor="upload-bank-passbook">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<CloudUploadIcon />}
                                                sx={{ mb: 2 }}
                                            >
                                                Upload Bank Document
                                            </Button>
                                        </label>
                                        <Typography variant="body2" color="textSecondary">
                                            Bank Passbook/Statement (JPG, PNG, max 2MB)
                                        </Typography>
                                    </>
                                )}
                            </Box>
                            {errors.uploadBankPassbook && (
                                <FormHelperText error>{errors.uploadBankPassbook}</FormHelperText>
                            )}
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                Bank Passbook/Statement*
                            </Typography>
                        </Grid>
                    </Grid>
                );

            case 6:
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
                                                {formData.title} {formData.name}
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
                                                Date of Birth
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.dob ? format(formData.dob, 'dd MMM yyyy') : 'Not provided'}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Father's/Husband's Name
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.fatherOrHusbandName}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Aadhaar Number
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.aadhaarNo}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                PAN Card Number
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.panCardNo}
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
                                                Mobile Number
                                            </Typography>
                                            <Typography variant="body1">
                                                +91 {formData.mobile}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Email
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.emailId}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary">
                                                Address
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.address}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary">
                                                Password
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.password}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                City
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.city}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                State
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.state}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Sponsor Information */}
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        Sponsor Information
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Referral Code
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.refralCodeOfPresentAssociate || 'None'}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Under Place ID
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.underPlaceId || 'None'}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Rank
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.rankName}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Joining Date
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.joiningDate ? format(formData.joiningDate, 'dd MMM yyyy') : 'Not provided'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Bank Details */}
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        Bank Details
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Account Holder Name
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.accountHolderName}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Bank Name
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.bankName}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Account Number
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.accountNo}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                IFSC Code
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.ifscCode}
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
                                                Relationship
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.nomineeRelation}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Nominee Age
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.nomineeAge}
                                            </Typography>
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
                            {editMode ? 'Associate Updated Successfully!' : 'Associate Registered Successfully!'}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {editMode
                                ? 'The associate information has been updated in the system.'
                                : 'The new associate has been registered successfully in the system.'}
                        </Typography>
                    </Box>
                );
        }
    };

    // Main component render
    return (
        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    {editMode ? 'Edit Associate' : 'Associate Registration'}
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

export default AssociateForm;