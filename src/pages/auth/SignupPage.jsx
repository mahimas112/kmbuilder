import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Link,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
    useTheme,
    useMediaQuery,
    Stack,
    alpha,
    Grid,
    Fade,
    Stepper,
    Step,
    StepLabel,
    Snackbar,
    Alert
} from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';


const SignupPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        password: "",
        roles: [],
        agreeToTerms: false
    });

    // Form validation states
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        contact: "",
        password: "",
        confirmPassword: ""
    });

    // Snackbar states
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // Validation functions
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return re.test(String(password));
    };

    // Carousel state
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselContent = [
        {
            title: "Join Our Platform",
            subtitle: "Create your account to get started",
            description: "Sign up today to access our comprehensive real estate management platform. Connect with clients, manage properties, and grow your business with our powerful tools.",
            icon: <HomeWorkIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
        },
        {
            title: "Property Management",
            subtitle: "Handle all your properties in one place",
            description: "Easily track maintenance requests, lease agreements, and occupancy rates. Get real-time updates on your entire property portfolio.",
            icon: <ApartmentIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
        },
        {
            title: "Powerful Analytics",
            subtitle: "Make data-driven decisions",
            description: "Access detailed reports and analytics to track performance metrics, market trends, and financial forecasts for your real estate investments.",
            icon: <AssessmentIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
        },
        {
            title: "Client Management",
            subtitle: "Build stronger relationships",
            description: "Maintain detailed client profiles, track communication history, and provide personalized service to improve client satisfaction and retention.",
            icon: <PeopleIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
        }
    ];

    // Auto-rotate carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselContent.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [carouselContent.length]);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'selectedRole') {
            setFormData(prev => ({
                ...prev,
                roles: [value]
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: name === 'agreeToTerms' ? checked : value
        }));

        validateField(name, name === 'agreeToTerms' ? checked : value);
    };

    const validatePhone = (value) => {
        const phoneRegex = /^[0-9]{10}$/; 
        return phoneRegex.test(value);
    };

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    error = "Name is required";
                } else if (value.trim().length < 2) {
                    error = "Name must be at least 2 characters";
                }
                break;
            case 'email':
                if (!value) {
                    error = "Email is required";
                } else if (!validateEmail(value)) {
                    error = "Please enter a valid email address";
                }
                break;
                case 'contact':
                    if (!value) {
                        error = "Phone number is required";
                    } else if (!validatePhone(value)) {
                        error = "Please enter a valid 10-digit phone number";
                    }
                    break;
            case 'password':
                if (!value) {
                    error = "Password is required";
                } else if (!validatePassword(value)) {
                    error = "Password must be at least 8 characters with uppercase, lowercase and number";
                }
                // Also validate confirm password if it exists
                if (confirmPassword) {
                    setErrors(prev => ({
                        ...prev,
                        confirmPassword: value !== confirmPassword ? "Passwords do not match" : ""
                    }));
                }
                break;
            case 'confirmPassword':
                if (!value) {
                    error = "Please confirm your password";
                } else if (value !== formData.password) {
                    error = "Passwords do not match";
                }
                break;
            default:
                break;
        }

        // Update error state
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        return !error; // Return true if valid
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        validateField('confirmPassword', value);
    };

    const validateStep = (step) => {
        if (step === 0) {
            // Validate step 1 fields
            const nameValid = validateField('name', formData.name);
            const emailValid = validateField('email', formData.email);
            const contactValid = validateField('contact', formData.contact);
            const roleValid = formData.roles.length > 0;

            return nameValid && emailValid && contactValid && roleValid;
        } else {
            // Validate step 2 fields
            const passwordValid = validateField('password', formData.password);
            const confirmValid = validateField('confirmPassword', confirmPassword);
            const termsValid = formData.agreeToTerms;

            return passwordValid && confirmValid && termsValid;
        }
    };

    const handleNext = () => {
        if (validateStep(0)) {
            setActiveStep(1);
        } else {
            setSnackbar({
                open: true,
                message: "Please correct the errors before proceeding",
                severity: "error"
            });
        }
    };

    const handleBack = () => {
        setActiveStep(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateStep(1)) {
            // Prepare submission data
            const submissionData = {
                name: formData.name,
                email: formData.email,
                contact: formData.contact,
                password: formData.password,
                roles: formData.roles
            };


            try {
                const res = await axiosInstance.post(`/realEstate/user/register`, submissionData);

                setSnackbar({
                    open: true,
                    message: "Registration successful! Redirecting to login...",
                    severity: "success"
                });

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } catch (error) {
                let errorMessage = "Registration failed";

                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                setSnackbar({
                    open: true,
                    message: errorMessage,
                    severity: "error"
                });
            }
        } else {
            setSnackbar({
                open: true,
                message: "Please correct the errors before submitting",
                severity: "error"
            });
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const primaryBlue = '#0B2447';
    const secondaryBlue = '#19376D';
    const accentBlue = '#576CBC';
    const highlightBlue = '#5D9CEC';
    const bgColor = '#F8F9FD';
    const formBg = '#FFFFFF';
    const textDark = '#1E293B';
    const textLight = '#FFFFFF';

    // Common TextField styling
    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: alpha('#F8FAFF', 0.6),
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: highlightBlue,
                borderWidth: 2,
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: accentBlue,
        },
        mb: 2.5 // Add consistent bottom margin to create space between fields
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: { xs: 2, sm: 3 },
                background: `linear-gradient(135deg, ${bgColor} 0%, #EEF2FF 100%)`,
            }}
        >
            <Container maxWidth="lg">
                <Grid
                    container
                    spacing={0}
                    sx={{
                        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.12)',
                        borderRadius: 4,
                        overflow: 'hidden',
                        minHeight: { md: '600px' }
                    }}
                >
                    {/* Welcome Left Side with Carousel */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            background: `linear-gradient(145deg, ${primaryBlue} 0%, ${secondaryBlue} 100%)`,
                            padding: { xs: 4, md: 6 },
                            display: { xs: 'none', md: 'flex' },
                            flexDirection: 'column',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                width: '200%',
                                height: '200%',
                                top: '-50%',
                                left: '-50%',
                                background: `radial-gradient(circle, ${alpha('#FFFFFF', 0.08)} 0%, ${alpha('#FFFFFF', 0)} 70%)`,
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: '180%',
                                height: '180%',
                                bottom: '-90%',
                                right: '-90%',
                                background: `radial-gradient(circle, ${alpha('#FFFFFF', 0.05)} 0%, ${alpha('#FFFFFF', 0)} 60%)`,
                                zIndex: 0,
                            }
                        }}
                    >
                        {/* Logo */}
                        <Box position="relative" zIndex={1} sx={{ mb: 6 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <HomeWorkIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
                                <Typography variant="h4" fontWeight="700" color="#FFFFFF" sx={{ letterSpacing: '0.5px' }}>
                                    REALTY CRMS
                                </Typography>
                            </Stack>
                        </Box>

                        {/* Carousel Content */}
                        <Box position="relative" zIndex={1} sx={{ height: '300px', position: 'relative' }}>
                            {carouselContent.map((slide, index) => (
                                <Fade
                                    key={index}
                                    in={currentSlide === index}
                                    timeout={800}
                                    style={{
                                        display: currentSlide === index ? 'block' : 'none',
                                        position: 'absolute',
                                        width: '100%'
                                    }}
                                >
                                    <Box>
                                        <Box sx={{ display: 'flex', mb: 3 }}>
                                            {slide.icon}
                                        </Box>
                                        <Typography
                                            variant="h2"
                                            fontWeight="700"
                                            color="#FFFFFF"
                                            sx={{ mb: 3, fontSize: { md: '2.5rem', lg: '3rem' } }}
                                        >
                                            {slide.title}
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            color={alpha('#FFFFFF', 0.85)}
                                            fontWeight="400"
                                            sx={{ mb: 2 }}
                                        >
                                            {slide.subtitle}
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            color={alpha('#FFFFFF', 0.7)}
                                            sx={{ maxWidth: '90%' }}
                                        >
                                            {slide.description}
                                        </Typography>
                                    </Box>
                                </Fade>
                            ))}
                        </Box>

                        <Box sx={{ mt: 4, display: 'flex', gap: 2, position: 'relative', zIndex: 1 }}>
                            {carouselContent.map((_, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        bgcolor: currentSlide === index ? alpha('#FFFFFF', 0.9) : alpha('#FFFFFF', 0.4),
                                        transition: 'background-color 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setCurrentSlide(index)}
                                />
                            ))}
                        </Box>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            bgcolor: '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                background: `linear-gradient(145deg, ${primaryBlue} 0%, ${secondaryBlue} 100%)`,
                                padding: 3,
                                display: { xs: 'flex', md: 'none' },
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    width: '200%',
                                    height: '200%',
                                    top: '-50%',
                                    left: '-50%',
                                    background: `radial-gradient(circle, ${alpha('#FFFFFF', 0.08)} 0%, ${alpha('#FFFFFF', 0)} 70%)`,
                                },
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <HomeWorkIcon sx={{ fontSize: 30, color: '#FFFFFF' }} />
                                <Typography variant="h5" fontWeight="700" color="#FFFFFF" sx={{ letterSpacing: '0.5px' }}>
                                    REALTY CRMS
                                </Typography>
                            </Stack>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: alpha('#FFFFFF', 0.85),
                                    fontWeight: 300,
                                    mt: 1,
                                    textAlign: 'center'
                                }}
                            >
                                Premium Property Management Solution
                            </Typography>
                        </Box>

                        <Box sx={{ py: 4, px: { xs: 3, sm: 5, md: 6 } }}>
                            <Stack spacing={2} sx={{ mb: 3 }}>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 600, color: textDark }}
                                >
                                    Create Account
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Join our platform and start managing your real estate business
                                </Typography>
                            </Stack>

                            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                                <Step>
                                    <StepLabel>Account Info</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>Security</StepLabel>
                                </Step>
                            </Stepper>

                            <Box component="form" onSubmit={activeStep === 1 ? handleSubmit : handleNext} sx={{ width: '100%' }}>
                                {activeStep === 0 ? (
                                    <Box sx={{ width: '100%' }}>
                                        {/* Full Name */}
                                        <TextField
                                            fullWidth
                                            id="name"
                                            label="Full Name"
                                            name="name"
                                            size={isSmallMobile ? "small" : "medium"}
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BadgeIcon sx={{ color: accentBlue, fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={textFieldSx}
                                        />

                                        <TextField
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            size={isSmallMobile ? "small" : "medium"}
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon sx={{ color: accentBlue, fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={textFieldSx}
                                        />

                                        <TextField
                                            fullWidth
                                            id="contact"
                                            label="Phone Number"
                                            name="contact"
                                            size={isSmallMobile ? "small" : "medium"}
                                            value={formData.contact}
                                            onChange={handleChange}
                                            required
                                            error={!!errors.contact}
                                            helperText={errors.contact}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneIcon sx={{ color: accentBlue, fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={textFieldSx}
                                        />

                                        <FormControl
                                            fullWidth
                                            size={isSmallMobile ? "small" : "medium"}
                                            required
                                            sx={{
                                                ...textFieldSx,
                                                mb: 4
                                            }}
                                        >
                                            <InputLabel>Select Role</InputLabel>
                                            <Select
                                                name="selectedRole"
                                                value={formData.roles[0] || ""}
                                                label="Select Role"
                                                onChange={handleChange}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <PersonIcon sx={{ color: accentBlue, fontSize: 20 }} />
                                                    </InputAdornment>
                                                }
                                            >
                                                <MenuItem value="Admin">Admin</MenuItem>
                                                <MenuItem value="Associate">Associate</MenuItem>
                                                {/* <MenuItem value="CLIENT">Client</MenuItem>
                                                <MenuItem value="PROPERTY_MANAGER">Property Manager</MenuItem> */}
                                            </Select>
                                        </FormControl>

                                        <Button
                                            type="button"
                                            fullWidth
                                            variant="contained"
                                            onClick={handleNext}
                                            disabled={!formData.name || !formData.email || !formData.contact || !formData.roles.length || !!errors.name || !!errors.email || !!errors.contact}
                                            sx={{
                                                py: 1.5,
                                                mt: 1,
                                                borderRadius: 2,
                                                background: `linear-gradient(90deg, ${accentBlue} 0%, ${secondaryBlue} 100%)`,
                                                boxShadow: `0 4px 12px ${alpha(secondaryBlue, 0.3)}`,
                                                '&:hover': {
                                                    background: `linear-gradient(90deg, ${secondaryBlue} 0%, ${accentBlue} 100%)`,
                                                    boxShadow: `0 6px 15px ${alpha(secondaryBlue, 0.4)}`,
                                                },
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                letterSpacing: '0.5px',
                                                textTransform: 'none',
                                                opacity: (formData.name && formData.email && formData.contact && formData.roles.length && !errors.name && !errors.email && !errors.contact) ? 1 : 0.7
                                            }}
                                        >
                                            Next Step
                                        </Button>
                                    </Box>
                                ) : (
                                    <Stack spacing={2.5}>
                                        <TextField
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            size={isSmallMobile ? "small" : "medium"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            error={!!errors.password}
                                            helperText={errors.password}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <VpnKeyIcon sx={{ color: accentBlue, fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            size="small"
                                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                        >
                                                            {showPassword ?
                                                                <VisibilityIcon sx={{ fontSize: 20, color: accentBlue }} /> :
                                                                <VisibilityOffIcon sx={{ fontSize: 20, color: '#94A3B8' }} />
                                                            }
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={textFieldSx}
                                        />

                                        <TextField
                                            fullWidth
                                            name="confirmPassword"
                                            label="Confirm Password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            size={isSmallMobile ? "small" : "medium"}
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                            required
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword}
                                            slotProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon sx={{ color: accentBlue, fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            edge="end"
                                                            size="small"
                                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                        >
                                                            {showConfirmPassword ? (
                                                                <VisibilityIcon sx={{ fontSize: 20, color: accentBlue }} />
                                                            ) : (
                                                                <VisibilityOffIcon sx={{ fontSize: 20, color: "#94A3B8" }} />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={textFieldSx}
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="agreeToTerms"
                                                    checked={formData.agreeToTerms || false}
                                                    onChange={handleChange}
                                                    size="small"
                                                    required
                                                    sx={{
                                                        color: accentBlue,
                                                        '&.Mui-checked': {
                                                            color: accentBlue,
                                                        },
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="body2">
                                                    I agree to the <Link href="#" sx={{ color: accentBlue, fontWeight: 600 }}>Terms of Service</Link> and <Link href="#" sx={{ color: accentBlue, fontWeight: 600 }}>Privacy Policy</Link>
                                                </Typography>
                                            }
                                            sx={{ mb: 2 }}
                                        />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                onClick={handleBack}
                                                sx={{
                                                    py: 1.5,
                                                    px: 3,
                                                    borderRadius: 2,
                                                    borderColor: accentBlue,
                                                    color: accentBlue,
                                                    '&:hover': {
                                                        borderColor: secondaryBlue,
                                                        color: secondaryBlue,
                                                        backgroundColor: alpha(accentBlue, 0.05),
                                                    },
                                                    fontWeight: 600,
                                                    textTransform: 'none'
                                                }}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={!formData.password || !confirmPassword || !!errors.password || !!errors.confirmPassword || !formData.agreeToTerms}
                                                sx={{
                                                    py: 1.5,
                                                    px: 3,
                                                    borderRadius: 2,
                                                    background: `linear-gradient(90deg, ${accentBlue} 0%, ${secondaryBlue} 100%)`,
                                                    boxShadow: `0 4px 12px ${alpha(secondaryBlue, 0.3)}`,
                                                    '&:hover': {
                                                        background: `linear-gradient(90deg, ${secondaryBlue} 0%, ${accentBlue} 100%)`,
                                                        boxShadow: `0 6px 15px ${alpha(secondaryBlue, 0.4)}`,
                                                    },
                                                    fontWeight: 600,
                                                    fontSize: '0.95rem',
                                                    letterSpacing: '0.5px',
                                                    textTransform: 'none',
                                                    opacity: (formData.password && confirmPassword && !errors.password && !errors.confirmPassword && formData.agreeToTerms) ? 1 : 0.7
                                                }}
                                            >
                                                Create Account
                                            </Button>
                                        </Box>
                                    </Stack>
                                )}

                                <Box sx={{ textAlign: 'center', mt: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Already have an account?{' '}
                                        <Link
                                            href="/"
                                            sx={{
                                                color: accentBlue,
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                    color: secondaryBlue
                                                }
                                            }}
                                        >
                                            Sign in
                                        </Link>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                            fontSize: 20
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SignupPage;
