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
    useTheme,
    useMediaQuery,
    Stack,
    alpha,
    Grid,
    Fade,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const OTPVerificationPage = () => {
    const theme = useTheme();
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        otp: ""
    });

    // Validation states
    const [validationError, setValidationError] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Snackbar states
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const [error, setError] = useState(null);
    
    // Get email from localStorage or sessionStorage
    const [email, setEmail] = useState(() => {
        return localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || "";
    });

    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselContent = [
        {
            title: "Welcome to Our Real Estate Portal",
            subtitle: "Secure and smart real estate management",
            description: "Access listings, clients, and analytics — all protected with robust OTP authentication.",
            icon: <HomeWorkIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
        },
        {
            title: "OTP-Based Security",
            subtitle: "Protect access with One-Time Passwords",
            description: "Ensure user authentication and sensitive actions are secured using fast, reliable OTP delivery via SMS or email.",
            icon: <SecurityIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
        },
        {
            title: "Property Management",
            subtitle: "Track and manage your properties with ease",
            description: "Monitor leases, maintenance, and tenant occupancy — all protected behind OTP-secured logins.",
            icon: <ApartmentIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
        },
        {
            title: "Analytics & Insights",
            subtitle: "Make smarter decisions",
            description: "Use real-time analytics and reports to track performance, market trends, and investments securely.",
            icon: <AssessmentIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
        },
        {
            title: "Client Engagement",
            subtitle: "Build trust with secured communication",
            description: "Manage client profiles and interactions, with OTP verification to keep all data protected.",
            icon: <PeopleIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
        }
    ];
    
    // Refs for the 6 OTP fields
    const otpRefs = Array(6).fill(0).map(() => React.createRef());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselContent.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [carouselContent.length]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && resendDisabled) {
            setResendDisabled(false);
        }
    }, [countdown, resendDisabled]);

    // Set a timer for 10 minutes (600 seconds) when the component mounts
    useEffect(() => {
        // Only start the timer if email exists (meaning user has logged in)
        if (email) {
            setCountdown(600); // 10 minutes in seconds
            setResendDisabled(true);
        }
    }, [email]);

    const navigate = useNavigate();

    const handleOTPChange = (index, value) => {
        if (value && !/^\d+$/.test(value)) return;

        const newOTP = [...formData.otp];
        newOTP[index] = value.substring(0, 1);

        setFormData(prev => ({
            ...prev,
            otp: newOTP
        }));

        if (validationError) {
            setValidationError("");
        }

        if (value && index < 5) {
            otpRefs[index + 1].current.focus();
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
            otpRefs[index - 1].current.focus();
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            otpRefs[index - 1].current.focus();
        }
        
        if (e.key === 'ArrowRight' && index < 5) {
            otpRefs[index + 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        if (!/^\d+$/.test(pastedData)) {
            return;
        }

        const digits = pastedData.split('').slice(0, 6);
        const newOTP = [...formData.otp];

        digits.forEach((digit, index) => {
            if (index < 6) {
                newOTP[index] = digit;
            }
        });

        setFormData(prev => ({
            ...prev,
            otp: newOTP
        }));

        // Focus on the next empty field or the last field
        const nextEmptyIndex = newOTP.findIndex(val => val === '');
        if (nextEmptyIndex !== -1) {
            otpRefs[nextEmptyIndex].current.focus();
        } else if (digits.length < 6) {
            otpRefs[digits.length].current.focus();
        } else {
            otpRefs[5].current.focus(); // Focus on the last (6th) input
        }
    };

    // Close snackbar handler
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Form validation function
    const validateForm = () => {
        const otpCode = formData.otp.join('');
        if (otpCode.length !== 6) {
            setValidationError("Please enter the complete 6-digit OTP code");
            return false;
        }

        return true;
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setError(null);

    if (!validateForm()) {
        setSnackbar({
            open: true,
            message: "Please enter the complete 6-digit OTP code",
            severity: "error"
        });
        return;
    }

    setIsLoading(true);

    try {
        
        const response = await axiosInstance.post(
            '/realEstate/user/login-with-otp',
            {
                email: email || formData.email,
                password: formData.password,
                otp: formData.otp,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            }
        );

        console.log('OTP verification successful:', response.data);
        
        const userRole = response.data?.data?.userRole || response.data?.userRole;
        
        // Store user data in the selected storage
        const storage = formData.rememberMe ? localStorage : sessionStorage;
        
        // Store token and user role
        if (response.data?.token) {
            storage.setItem('authToken', response.data.token);
            storage.setItem('userRole', userRole);
            
            // Additionally store any user data if available
            if (response.data?.data?.user || response.data?.user) {
                const userData = response.data?.data?.user || response.data?.user;
                storage.setItem('userData', JSON.stringify(userData));
            }
        }

        // Success message
        setSnackbar({
            open: true,
            message: "Verification successful! Redirecting to dashboard...",
            severity: "success"
        });

        // Redirect based on user role after a short delay
        setTimeout(() => {
            if (userRole === 'ADMIN') {
                navigate('/admin-dashboard');
            } else if (userRole === 'ASSOCIATE') {
                navigate('/associate-dashboard');
            } else {
                navigate('/dashboard');
            }
        }, 1500);

    } catch (error) {
        console.error('OTP verification error:', error);

        const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
        setError(errorMessage);

        setSnackbar({
            open: true,
            message: errorMessage,
            severity: "error"
        });
    } finally {
        setIsLoading(false);
    }
};
    
    const handleResendOTP = async () => {
        if (resendDisabled) return;
    
        setResendLoading(true);
        setError(null);
    
        try {
            // Use email from state or form data
            const userEmail = email || formData.email;
            
            // Send request to generate new OTP
            const response = await axiosInstance.post(
                '/realEstate/user/login-with-otp',
                {
                    email: userEmail,
                    password: formData.password
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                }
            );
    
            console.log('OTP resent successfully:', response.data);
    
            // Set the resend cooldown
            setCountdown(600);
            setResendDisabled(true);
    
            setSnackbar({
                open: true,
                message: "A new OTP has been sent to your email",
                severity: "success"
            });
    
        } catch (error) {
            console.error('Resend OTP error:', error);
    
            const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again later.';
            setError(errorMessage);
    
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: "error"
            });
        } finally {
            setResendLoading(false);
        }
    };
    

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const primaryBlue = '#0B2447';
    const secondaryBlue = '#19376D';
    const accentBlue = '#576CBC';
    const highlightBlue = '#5D9CEC';
    const bgColor = '#F8F9FD';
    const textDark = '#1E293B';

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
                        <Box position="relative" zIndex={1} sx={{ mb: 6 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <HomeWorkIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
                                <Typography variant="h4" fontWeight="700" color="#FFFFFF" sx={{ letterSpacing: '0.5px' }}>
                                    REALTY CRMS
                                </Typography>
                            </Stack>
                        </Box>

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
                            <Stack spacing={2.5} sx={{ mb: 3 }}>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 600, color: textDark }}
                                >
                                    Verify OTP
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Enter the 6-digit verification code sent to your email
                                    {email && <span> ({email})</span>}
                                </Typography>
                            </Stack>

                            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                                <Stack spacing={3}>
                                    <Box>
                                        <Stack direction="column" spacing={1}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    mb: 1
                                                }}
                                            >
                                                <VerifiedUserIcon sx={{ color: accentBlue, fontSize: 24, mr: 1 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Enter 6-digit code
                                                </Typography>
                                            </Box>

                                            <Grid container spacing={1} justifyContent="center">
                                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                                    <Grid item key={index}>
                                                        <TextField
                                                            inputRef={otpRefs[index]}
                                                            value={formData.otp[index]}
                                                            onChange={(e) => handleOTPChange(index, e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                                            onPaste={index === 0 ? handlePaste : null}
                                                            variant="outlined"
                                                            inputProps={{
                                                                maxLength: 1,
                                                                style: {
                                                                    textAlign: 'center',
                                                                    fontWeight: 600,
                                                                    fontSize: '1.3rem',
                                                                    padding: isSmallMobile ? '6px' : '10px'
                                                                }
                                                            }}
                                                            sx={{
                                                                width: isSmallMobile ? '40px' : '52px',
                                                                height: isSmallMobile ? '40px' : '52px',
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: 2,
                                                                    backgroundColor: alpha('#F8FAFF', 0.6),
                                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                        borderColor: highlightBlue,
                                                                        borderWidth: 2,
                                                                    },
                                                                },
                                                                '& .MuiOutlinedInput-input': {
                                                                    p: 1
                                                                }
                                                            }}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Stack>

                                        {validationError && (
                                            <Typography
                                                color="error"
                                                variant="body2"
                                                sx={{ mt: 1, textAlign: 'center' }}
                                            >
                                                {validationError}
                                            </Typography>
                                        )}
                                    </Box>

                                    {error && (
                                        <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                                            {error}
                                        </Typography>
                                    )}

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="rememberMe"
                                                    checked={formData.rememberMe}
                                                    onChange={handleCheckboxChange}
                                                    size="small"
                                                    sx={{
                                                        color: accentBlue,
                                                        '&.Mui-checked': {
                                                            color: accentBlue,
                                                        },
                                                    }}
                                                />
                                            }
                                            label={<Typography variant="body2">Trust this device</Typography>}
                                        />
                                        <Button
                                            disabled={resendDisabled || resendLoading}
                                            onClick={handleResendOTP}
                                            sx={{
                                                color: accentBlue,
                                                fontWeight: 500,
                                                textTransform: 'none',
                                                '&:hover': {
                                                    background: 'transparent',
                                                    color: secondaryBlue
                                                },
                                                '&.Mui-disabled': {
                                                    color: 'text.disabled'
                                                }
                                            }}
                                        >
                                            {resendLoading ? (
                                                <CircularProgress size={16} color="inherit" />
                                            ) : resendDisabled ? (
                                                `Resend in ${formatTime(countdown)}`
                                            ) : (
                                                'Resend OTP'
                                            )}
                                        </Button>
                                    </Box>

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={isLoading}
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
                                            textTransform: 'none'
                                        }}
                                    >
                                        {isLoading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            "Verify & Continue"
                                        )}
                                    </Button>
                                </Stack>

                                <Box sx={{ textAlign: 'center', mt: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Need help?{' '}
                                        <Link
                                            href="/contact-support"
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
                                            Contact Support
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    elevation={6}
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                            fontSize: '1.2rem'
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OTPVerificationPage;
