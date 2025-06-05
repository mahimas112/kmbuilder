import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Divider,
    Button,
    CircularProgress,
    Alert,
    Snackbar,
    InputAdornment,
    FormHelperText,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { format } from 'date-fns';
import axiosInstance from '../../axiosInstance';

// TabPanel component for tab content
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`plot-booking-tabpanel-${index}`}
            aria-labelledby={`plot-booking-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Plot container component
const PlotBox = ({ plot, selected, onClick }) => {
    return (
        <Box
            onClick={() => onClick(plot)}
            sx={{
                border: '1px solid',
                borderColor: selected ? '#6B66FF' : 'divider',
                bgcolor: selected ? 'rgba(107, 102, 255, 0.1)' : 'background.paper',
                borderRadius: 1,
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    borderColor: '#6B66FF',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: 120
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: selected ? '#6B66FF' : 'text.primary' }}>
                {plot.plotNo}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {plot.plotArea} sq.ft
            </Typography>
            <Typography variant="caption" sx={{
                mt: 1,
                bgcolor: 'success.light',
                color: 'success.contrastText',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 'bold'
            }}>
                Available
            </Typography>
        </Box>
    );
};

const PlotBooking = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    // Tab state
    const [tabValue, setTabValue] = useState(0);

    // Form data state
    const [formData, setFormData] = useState({
        plotsellingId: '',
        bookingCode: '',
        customerId: '',
        associateCode: '',
        bookingDate: format(new Date(), 'yyyy-MM-dd'),
        projectId: '',
        blockID: '',
        addPlotId: '',
        plotNo: '',
        totalDevelopmentRate: 0,
        developmentRatePerSqft: 0,
        plotRate: 0,
        plotArea: '',
        poatCoast: 0,
        plcAmount: 0,
        remark: '',
        otherCharges: 0,
        finalPaybleAmount: 0,
        couponDiscount: 0,
        totalPlotCost: 0,
        planType: '',
        buyerAssociatName: '',
        buyerCustomerName: '',
        mobileNo: '',
        branchName: '',
        projectName:'',
        blockName:''

    });

    // Options for dropdowns
    const [customers, setCustomers] = useState([]);
    const [associates, setAssociates] = useState([]);
    const [projects, setProjects] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [plots, setPlots] = useState([]);
    const [filteredPlots, setFilteredPlots] = useState([]);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedAssociate, setSelectedAssociate] = useState(null);

    // UI states
    const [loading, setLoading] = useState(false);
    const [customersLoading, setCustomersLoading] = useState(false);
    const [associatesLoading, setAssociatesLoading] = useState(false);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [blocksLoading, setBlocksLoading] = useState(false);
    const [plotsLoading, setPlotsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [plotCost, setPlotCost] = useState(0);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [developmentRates, setDevelopmentRates] = useState([]);
    const [developmentRatesLoading, setDevelopmentRatesLoading] = useState(false);

    // Fetch development rates
    const fetchDevelopmentRates = async () => {
        setDevelopmentRatesLoading(true);
        try {
            // Replace with your actual API endpoint for development rates
            const response = await axiosInstance.get('/realEstate/developmentRate/getAll');

            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setDevelopmentRates(response.data.data);
            } else {
                // Mock data if API fails
                setDevelopmentRates([
                    {
                        developmentRateId: 'DR001',
                        ratePerSqft: 500,
                        description: 'Standard Development Rate',
                        applicableFrom: '2024-01-01'
                    },
                    {
                        developmentRateId: 'DR002',
                        ratePerSqft: 550,
                        description: 'Premium Development Rate',
                        applicableFrom: '2024-01-01'
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching development rates:', error);
            // Mock data if API fails
            setDevelopmentRates([
                {
                    developmentRateId: 'DR001',
                    ratePerSqft: 500,
                    description: 'Standard Development Rate',
                    applicableFrom: '2024-01-01'
                },
                {
                    developmentRateId: 'DR002',
                    ratePerSqft: 550,
                    description: 'Premium Development Rate',
                    applicableFrom: '2024-01-01'
                }
            ]);
        } finally {
            setDevelopmentRatesLoading(false);
        }
    };



    // Fetch initial data
    useEffect(() => {
        fetchCustomers();
        fetchAssociates();
        fetchProjects();
        fetchDevelopmentRates();
    }, []);

    // Fetch customers
    const fetchCustomers = async () => {
        setCustomersLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await axiosInstance.get('/realEstate/addNew-customer/getAllCustomers');
            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setCustomers(response.data.data);
            } else {
                // Mock data if API fails
                setCustomers([
                    { customerId: '1', name: 'John Doe', emailId: 'john@example.com', mobile: '9876543210', associateCode: 'A001', associateName: 'Sam Smith' },
                    { customerId: '2', name: 'Jane Smith', emailId: 'jane@example.com', mobile: '8765432109', associateCode: 'A002', associateName: 'Alex Johnson' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            // Mock data if API fails
            setCustomers([
                { customerId: '1', name: 'John Doe', emailId: 'john@example.com', mobile: '9876543210', associateCode: 'A001', associateName: 'Sam Smith' },
                { customerId: '2', name: 'Jane Smith', emailId: 'jane@example.com', mobile: '8765432109', associateCode: 'A002', associateName: 'Alex Johnson' }
            ]);
        } finally {
            setCustomersLoading(false);
        }
    };

    // Fetch associates
    const fetchAssociates = async () => {
        setAssociatesLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await axiosInstance.get('/realEstate/associate/getAll');
            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setAssociates(response.data.data);
            } else {
                // Mock data if API fails
                setAssociates([
                    { associateId: 'A001', name: 'Sam Smith', emailId: 'sam@example.com', mobile: '7654321098' },
                    { associateId: 'A002', name: 'Alex Johnson', emailId: 'alex@example.com', mobile: '6543210987' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching associates:', error);
            // Mock data if API fails
            setAssociates([
                { associateId: 'A001', name: 'Sam Smith', emailId: 'sam@example.com', mobile: '7654321098' },
                { associateId: 'A002', name: 'Alex Johnson', emailId: 'alex@example.com', mobile: '6543210987' }
            ]);
        } finally {
            setAssociatesLoading(false);
        }
    };

    // Fetch projects
    const fetchProjects = async () => {
        setProjectsLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await axiosInstance.get('/realEstate/project/getAll');
            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setProjects(response.data.data);
            } else {
                // Mock data if API fails
                setProjects([
                    { projectId: 'P001', siteName: 'Green Valley', location: 'East City' },
                    { projectId: 'P002', siteName: 'Blue Hills', location: 'West Town' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            // Mock data if API fails
            setProjects([
                { projectId: 'P001', siteName: 'Green Valley', location: 'East City' },
                { projectId: 'P002', siteName: 'Blue Hills', location: 'West Town' }
            ]);
        } finally {
            setProjectsLoading(false);
        }
    };

    // Fetch blocks based on selected project
    const fetchBlocks = async (projectId) => {
        setBlocksLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await axiosInstance.get(`/realEstate/Block/getAllBlockByProjectUUId?projectId=${projectId}`);
            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setBlocks(response.data.data);
            } else {
                // Mock data if API fails
                setBlocks([
                    { blockId: 'B001', block: 'Block A', projectId },
                    { blockId: 'B002', block: 'Block B', projectId }
                ]);
            }
        } catch (error) {
            console.error('Error fetching blocks:', error);
            // Mock data if API fails
            setBlocks([
                { blockId: 'B001', block: 'Block A', projectId },
                { blockId: 'B002', block: 'Block B', projectId }
            ]);
        } finally {
            setBlocksLoading(false);
        }
    };

    // Fetch plots based on selected block
    const fetchPlots = async (blockId) => {
        setPlotsLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await axiosInstance.get(`/realEstate/plotDetail/getNoOfPlotsByBlockId?blockId=${blockId}`);
            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setPlots(response.data.data);
                // Filter only available plots
                const availablePlots = response.data.data.filter(plot => plot.status === 'Available');
                setFilteredPlots(availablePlots);
            }
            else {
                // Mock data if API fails
                const mockPlots = [
                    {
                        plotId: 'PL001',
                        plotNo: 'A101',
                        blockId,
                        status: 'Available',
                        plotArea: '1200',
                        plotRate: 3000,
                        developmentRatePerSqft: 500,
                        totalDevelopmentRate: 600000,
                        plcAmount: 30000
                    },
                    {
                        plotId: 'PL002',
                        plotNo: 'A102',
                        blockId,
                        status: 'Available',
                        plotArea: '1500',
                        plotRate: 3200,
                        developmentRatePerSqft: 500,
                        totalDevelopmentRate: 750000,
                        plcAmount: 36000
                    },
                    {
                        plotId: 'PL003',
                        plotNo: 'A103',
                        blockId,
                        status: 'Sold',
                        plotArea: '1800',
                        plotRate: 3500,
                        developmentRatePerSqft: 550,
                        totalDevelopmentRate: 990000,
                        plcAmount: 40000
                    }
                ];
                setPlots(mockPlots);
                // Filter only available plots
                const availablePlots = mockPlots.filter(plot => plot.status === 'Available');
                setFilteredPlots(availablePlots);
            }
        } catch (error) {
            console.error('Error fetching plots:', error);
            // Mock data if API fails
            const mockPlots = [
                {
                    plotId: 'PL001',
                    plotNo: 'A101',
                    blockId,
                    status: 'Available',
                    plotArea: '1200',
                    plotRate: 3000,
                    developmentRatePerSqft: 500,
                    totalDevelopmentRate: 600000,
                    plcAmount: 30000
                },
                {
                    plotId: 'PL002',
                    plotNo: 'A102',
                    blockId,
                    status: 'Available',
                    plotArea: '1500',
                    plotRate: 3200,
                    developmentRatePerSqft: 500,
                    totalDevelopmentRate: 750000,
                    plcAmount: 36000
                },
                {
                    plotId: 'PL003',
                    plotNo: 'A103',
                    blockId,
                    status: 'Sold',
                    plotArea: '1800',
                    plotRate: 3500,
                    developmentRatePerSqft: 550,
                    totalDevelopmentRate: 990000,
                    plcAmount: 40000
                }
            ];
            setPlots(mockPlots);
            // Filter only available plots
            const availablePlots = mockPlots.filter(plot => plot.status === 'Available');
            setFilteredPlots(availablePlots);
        } finally {
            setPlotsLoading(false);
        }
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        // Reset form for the new tab
        setFormData({
            ...formData,
            customerId: '',
            associateCode: '',
            buyerAssociatName: '',
            buyerCustomerName: '',
        });
        setSelectedCustomer(null);
        setSelectedAssociate(null);
        setSelectedPlot(null);
        setFilteredPlots([]);
        setErrors({});
    };

    // Handle customer selection
    const handleCustomerChange = (event) => {
        const customerId = event.target.value;
        const selected = customers.find(customer => customer.customerId === customerId);

        if (selected) {
            setSelectedCustomer(selected);
            setFormData({
                ...formData,
                customerId: selected.customerId,
                associateCode: selected.associateCode || '',
                buyerCustomerName: selected.name || '',
                buyerAssociatName: selected.associateName || ''
            });
        } else {
            setSelectedCustomer(null);
            setFormData({
                ...formData,
                customerId: '',
                associateCode: '',
                buyerCustomerName: '',
                buyerAssociatName: ''
            });
        }
    };

    // Handle associate selection
    const handleAssociateChange = (event) => {
        const associateReperCode = event.target.value;
        const selected = associates.find(associate => associate.associateReperCode === associateReperCode);

        if (selected) {
            setSelectedAssociate(selected);
            setFormData({
                ...formData,
                associateCode: selected.associateReperCode || '',
                buyerAssociatName: selected.name || ''
            });
        } else {
            setSelectedAssociate(null);
            setFormData({
                ...formData,
                associateCode: '',
                buyerAssociatName: ''
            });
        }
    };

    // Handle project selection
    const handleProjectChange = (event) => {
        const projectId = event.target.value;

        setFormData({
            ...formData,
            projectId,
            blockID: '',
            addPlotId: '',
            plotNo: '',
            totalDevelopmentRate: 0,
            developmentRatePerSqft: 0,
            plotRate: 0,
            plotArea: '',
            poatCoast: 0,
            plcAmount: 0,
            totalPlotCost: 0,
            finalPaybleAmount: 0
        });

        setSelectedPlot(null);
        setFilteredPlots([]);

        if (projectId) {
            fetchBlocks(projectId);
        } else {
            setBlocks([]);
        }
    };

    // Handle block selection
    const handleBlockChange = (event) => {
        const blockID = event.target.value;

        setFormData({
            ...formData,
            blockID,
            addPlotId: '',
            plotNo: '',
            totalDevelopmentRate: 0,
            developmentRatePerSqft: 0,
            plotRate: 0,
            plotArea: '',
            poatCoast: 0,
            plcAmount: 0,
            totalPlotCost: 0,
            finalPaybleAmount: 0
        });

        setSelectedPlot(null);

        if (blockID) {
            fetchPlots(blockID);
        } else {
            setPlots([]);
            setFilteredPlots([]);
        }
    };

    // Handle plot selection
    const handlePlotSelect = (plot) => {
        setSelectedPlot(plot);
        const defaultDevelopmentRate = developmentRates[0] || { ratePerSqft: 0 };

        // Convert values to numbers to ensure proper calculation
        const plotArea = parseFloat(plot.plotArea);
        const plotRate = parseFloat(plot.plotRate);
        const plcRate = parseFloat(plot.plcRate || 0);

        // Calculate development amount
        const developmentAmount = plot.developmentAmount;

        // Calculate PLC Amount
        const plcAmount = plotArea * plcRate;

        // Calculate plot cost (plot area * plot rate)
        const plotCost = plotArea * plotRate;

        // Calculate total plot cost (plot cost + PLC amount + development amount)
        const totalPlotCost = plotCost + plcAmount + developmentAmount;

        setFormData({
            ...formData,
            addPlotId: plot.plotId,
            plotNo: plot.plotNo,

            // Development rate details
            totalDevelopmentRate: developmentAmount,
            developmentRatePerSqft: defaultDevelopmentRate.ratePerSqft,
            developmentRateId: defaultDevelopmentRate.developmentRateId,
            developmentAmount: developmentAmount,

            // Plot details
            plotRate: plotRate,
            plotArea: plot.plotArea,
            poatCoast: plotCost,

            // PLC details
            plcRate: plcRate,
            plcAmount: plcAmount,

            // Total costs
            totalPlotCost: totalPlotCost,
            finalPaybleAmount: totalPlotCost
        });
    };

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'developmentRateId') {
            // Find selected development rate
            const selectedRate = developmentRates.find(rate => rate.developmentRateId === value);

            if (selectedRate && selectedPlot) {
                const developmentAmount = parseFloat(selectedPlot.plotArea) * selectedRate.ratePerSqft;

                setFormData(prev => ({
                    ...prev,
                    developmentRateId: value,
                    developmentRatePerSqft: selectedRate.ratePerSqft,
                    totalDevelopmentRate: developmentAmount,
                    finalPaybleAmount: prev.totalPlotCost + developmentAmount
                }));
            }
        } else {
            // Existing change handler logic
            if (['otherCharges', 'couponDiscount', 'bookingAmount'].includes(name)) {
                const numValue = parseFloat(value) || 0;

                setFormData(prev => {
                    const newData = {
                        ...prev,
                        [name]: numValue >= 0 ? numValue : 0
                    };

                    // Recalculate final payable amount
                    const totalCost = parseFloat(newData.totalPlotCost) || 0;
                    const developmentAmount = parseFloat(newData.totalDevelopmentRate) || 0;
                    const otherCharges = parseFloat(newData.otherCharges) || 0;
                    const discount = parseFloat(newData.couponDiscount) || 0;
                    const bookingAmount = parseFloat(newData.bookingAmount) || 0;

                    newData.finalPaybleAmount = totalCost + otherCharges - discount;

                    // Calculate due amount
                    newData.dueAmount = newData.finalPaybleAmount - bookingAmount;

                    return newData;
                });
            } else {
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        }

        // Clear error for the field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        // Required fields validation
        if (tabValue === 0) { // Customer Tab
            if (!formData.customerId) newErrors.customerId = "Customer is required";
        } else { // Associate Tab
            if (!formData.associateCode) newErrors.associateCode = "Associate is required";
        }

        if (!formData.projectId) newErrors.projectId = "Project is required";
        if (!formData.blockID) newErrors.blockID = "Block is required";
        if (!formData.addPlotId) newErrors.addPlotId = "Plot selection is required";
        if (!formData.planType) newErrors.planType = "Payment plan is required";

        // Validate booking date
        if (!formData.bookingDate) newErrors.bookingDate = "Booking date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure a plot is selected
        if (!selectedPlot) {
            setNotification({
                open: true,
                message: 'Please select a plot before booking.',
                severity: 'error'
            });
            return;
        }

        setLoading(true);

        try {
            // Generate a unique booking code
            const bookingCode = `BK${Date.now().toString().slice(-8)}`;

            // Prepare comprehensive data payload
            const dataToSubmit = {
                // Basic plot details
                plotNo: formData.plotNo,
                ploatArea: formData.plotArea,
                plotRate: formData.plotRate,
                addPlotId: selectedPlot.addPlotId,
                poatCoast: formData.poatCoast,

                // Project and Block details
                projectId: formData.projectId,
                projectName: projects.find(p => p.projectId === formData.projectId)?.siteName || '',
                blockID: formData.blockID,
                blockName: blocks.find(b => b.blockId === formData.blockID)?.block || '',

                // Customer/Associate details based on selected tab
                ...(tabValue === 0
                    ? {
                        customerId: formData.customerId,
                        buyerName: selectedCustomer?.customerName,
                        mobileNo: selectedCustomer?.mobileNo,
                        emailId: selectedCustomer?.emailId,
                        address: selectedCustomer?.address
                    }
                    : {
                        associateCode: formData.associateCode,
                        buyerName: selectedAssociate?.name,
                        mobileNo: selectedAssociate?.mobile,
                        emailId: selectedAssociate?.emailId,
                        address: selectedAssociate?.address
                    }),

                // Financial details
                totalPlotCost: formData.totalPlotCost,
                developmentAmount: formData.developmentAmount,
                plcAmount: formData.plcAmount,
                otherCharges: formData.otherCharges || 0,
                couponDiscount: formData.couponDiscount || 0,
                finalPaybleAmount: formData.finalPaybleAmount,

                // Payment details
                bookingCode,
                bookingDate: formData.bookingDate,
                paymentPlan: formData.planType,

                // Additional optional fields
                bookingAmount: formData.bookingAmount || 0,
                dueAmount: formData.dueAmount || 0,
                remark: formData.remark || '',

                // Payment mode details
                ...(formData.planType === 'Full Payment' || formData.planType === 'EMI Plan'
                    ? {
                        planType: formData.planType,
                        ...(formData.payMode === 'Cheque'
                            ? {
                                payMode: 'Cheque',
                                bankName: formData.bankName,
                                accountNumber: formData.accountNumber,
                                checqueNo: formData.checqueNo,
                                checqueDate: formData.checqueDate,
                                branchName: formData.branchName
                            }
                            : { payMode: 'Cash' }
                        )
                    }
                    : { paymentMode: 'Cash' }
                ),

                // Additional fields from the form
                totalDevelopmentRate: formData.totalDevelopmentRate,
                developmentRatePerSqft: formData.developmentRatePerSqft,
                developmentAmount: formData.developmentAmount,
                plotsellingId: formData.plotsellingId
            };

            // API call with comprehensive error handling
            const response = await axiosInstance.post(
                '/realEstate/plot-booking/post',
                dataToSubmit,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000
                }
            );

            // Check for successful response
            if (response.data && (response.data.status === 200 || response.data.status === 201)) {
                // Show success notification
                setNotification({
                    open: true,
                    message: response.data.message || 'Plot booked successfully!',
                    severity: 'success'
                });

                // Reset form first
                resetForm();

                // Generate receipts immediately
                generatePlotBookingReceipts(dataToSubmit);
            } else {
                throw new Error(response.data?.message || 'Unexpected response from server');
            }
        } catch (error) {
            console.error('Booking Error:', error);
            setNotification({
                open: true,
                message: error.response?.data?.message || error.message || 'Failed to book plot',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Update resetForm method to handle both tabs
    const resetForm = () => {
        setFormData({
            plotsellingId: '',
            bookingCode: '',
            customerId: '',
            associateCode: '',
            bookingDate: format(new Date(), 'yyyy-MM-dd'),
            projectId: '',
            blockID: '',
            addPlotId: '',
            plotNo: '',
            totalDevelopmentRate: 0,
            developmentRatePerSqft: 0,
            plotRate: 0,
            plotArea: '',
            poatCoast: 0,
            plcAmount: 0,
            remark: '',
            otherCharges: 0,
            finalPaybleAmount: 0,
            couponDiscount: 0,
            totalPlotCost: 0,
            planType: '',
            buyerAssociatName: '',
            buyerCustomerName: '',
            mobileNo: '',
            bookingAmount: 0,
            dueAmount: 0,
            payMode: 'Cash',
            bankName: '',
            accountNumber: '',
            checqueNo: '',
            checqueDate: '',
            branchName: ''
        });

        // Reset related states
        setSelectedCustomer(null);
        setSelectedAssociate(null);
        setSelectedPlot(null);
        setFilteredPlots([]);
        setErrors({});
    };

    // Add handleCloseNotification function
    const handleCloseNotification = () => {
        setNotification({
            ...notification,
            open: false
        });
    };

    const generatePlotBookingReceipts = (bookingData) => {
        // Open a single window for both receipts
        const receiptWindow = window.open('', '_blank', 'width=800,height=1200,scrollbars=yes');
        if (receiptWindow) {
            receiptWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Plot Booking Receipts</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
                        body { 
                            font-family: 'Quicksand', sans-serif; 
                            margin: 0; 
                            padding: 20px; 
                            color: #333;
                            background-color: #f5f5f5;
                        }
                        .receipt-container { 
                            max-width: 800px; 
                            margin: 0 auto 40px; 
                            padding: 30px; 
                            background: white;
                            border: 1px solid #e0e0e0; 
                            box-shadow: 0 0 20px rgba(0,0,0,0.1);
                            border-radius: 8px;
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 30px; 
                            padding-bottom: 20px; 
                            border-bottom: 2px solid #6B66FF; 
                        }
                        .company-name { 
                            font-size: 28px; 
                            font-weight: 700; 
                            color: #6B66FF; 
                            margin-bottom: 10px; 
                        }
                        .company-address { 
                            font-size: 14px; 
                            color: #666; 
                            margin-bottom: 5px; 
                        }
                        .receipt-title { 
                            font-size: 22px; 
                            font-weight: 600; 
                            margin: 30px 0; 
                            text-align: center; 
                            color: #333;
                            background: #f8f9fa;
                            padding: 10px;
                            border-radius: 5px;
                        }
                        .payment-plan {
                            text-align: center;
                            font-size: 18px;
                            font-weight: 600;
                            color: #6B66FF;
                            margin: 20px 0;
                            padding: 10px;
                            background: #f0f0ff;
                            border-radius: 5px;
                        }
                        .section { 
                            margin-bottom: 25px; 
                            background: #f8f9fa;
                            padding: 15px;
                            border-radius: 5px;
                        }
                        .section-title { 
                            font-size: 18px; 
                            font-weight: 600; 
                            color: #6B66FF; 
                            margin-bottom: 15px; 
                            border-bottom: 1px solid #e0e0e0; 
                            padding-bottom: 8px; 
                        }
                        .details-grid { 
                            display: grid; 
                            grid-template-columns: 1fr 1fr; 
                            gap: 20px; 
                        }
                        .detail-item { 
                            margin-bottom: 12px; 
                        }
                        .detail-label { 
                            font-weight: 600; 
                            color: #666; 
                            margin-bottom: 5px; 
                            font-size: 14px;
                        }
                        .detail-value { 
                            color: #333; 
                            font-size: 15px;
                        }
                        .payment-table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin: 20px 0; 
                        }
                        .payment-table th, .payment-table td { 
                            border: 1px solid #e0e0e0; 
                            padding: 12px; 
                            text-align: left; 
                        }
                        .payment-table th { 
                            background-color: #f5f5f5; 
                            font-weight: 600;
                            color: #6B66FF;
                        }
                        .total-row { 
                            font-weight: 600; 
                            background-color: #f9f9f9; 
                        }
                        .terms { 
                            margin-top: 30px; 
                            font-size: 13px; 
                            color: #666;
                            line-height: 1.6;
                        }
                        .signature-section { 
                            margin-top: 50px; 
                            display: flex; 
                            justify-content: space-between; 
                        }
                        .signature-box { 
                            text-align: center; 
                            width: 200px; 
                        }
                        .signature-line { 
                            border-top: 1px solid #333; 
                            margin-top: 50px; 
                            width: 100%; 
                        }
                        .footer { 
                            margin-top: 30px; 
                            text-align: center; 
                            font-size: 12px; 
                            color: #666; 
                            border-top: 1px solid #e0e0e0; 
                            padding-top: 10px; 
                        }
                        .highlight { 
                            color: #6B66FF; 
                            font-weight: 600; 
                        }
                        .print-buttons {
                            text-align: center;
                            margin-top: 20px;
                        }
                        .print-button {
                            padding: 10px 20px;
                            background: #6B66FF;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            margin: 0 10px;
                            font-family: 'Quicksand', sans-serif;
                            font-weight: 600;
                        }
                        .print-button:hover {
                            background: #5652e5;
                        }
                        @media print { 
                            body { padding: 0; } 
                            .receipt-container { box-shadow: none; border: none; } 
                            .no-print { display: none; } 
                        }
                    </style>
                </head>
                <body>
                    <!-- Customer Receipt -->
                    <div class="receipt-container">
                        <div class="header">
                            <div class="company-name">KM Builders</div>
                            <div class="company-address">123 Business Street, City, State - 123456</div>
                            <div class="company-address">Phone: +91 1234567890 | Email: info@kmbuilders.com</div>
                        </div>

                        <div class="receipt-title">PLOT BOOKING RECEIPT - CUSTOMER COPY</div>
                        <div class="payment-plan">Payment Plan: ${bookingData.planType || 'N/A'}</div>

                        <div class="section">
                            <div class="section-title">Plot Details</div>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Project</div>
                                    <div class="detail-value">${projects.find(p => p.projectId === bookingData.projectId)?.siteName || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Block</div>
                                    <div class="detail-value">${blocks.find(b => b.blockId === bookingData.blockID)?.block || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Plot Number</div>
                                    <div class="detail-value">${bookingData.plotNo || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Plot Area</div>
                                    <div class="detail-value">${bookingData.ploatArea || 'N/A'} sq.ft</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Plot Rate</div>
                                    <div class="detail-value">₹${new Intl.NumberFormat('en-IN').format(bookingData.plotRate || 0)} per sq.ft</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Booking Code</div>
                                    <div class="detail-value highlight">${bookingData.bookingCode}</div>
                                </div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">Contact Details</div>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Name</div>
                                    <div class="detail-value">${bookingData.buyerName || bookingData.buyerAssociatName || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Contact Type</div>
                                    <div class="detail-value">${tabValue === 0 ? 'Customer' : 'Associate'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Phone</div>
                                    <div class="detail-value">${bookingData.mobileNo || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Email</div>
                                    <div class="detail-value">${bookingData.emailId || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Address</div>
                                    <div class="detail-value">${bookingData.address || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">Payment Details</div>
                            <table class="payment-table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Plot Cost (${bookingData.ploatArea} sq.ft × ₹${bookingData.plotRate})</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.poatCoast || 0)}</td>
                                    </tr>
                                    <tr>
                                        <td>Development Charges</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.developmentAmount || 0)}</td>
                                    </tr>
                                    <tr>
                                        <td>PLC Amount</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.plcAmount || 0)}</td>
                                    </tr>
                                    <tr>
                                        <td>Other Charges</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.otherCharges || 0)}</td>
                                    </tr>
                                    <tr>
                                        <td>Coupon Discount</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.couponDiscount || 0)}</td>
                                    </tr>
                                    <tr class="total-row">
                                        <td>Total Plot Cost</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.totalPlotCost || 0)}</td>
                                    </tr>
                                    <tr>
                                        <td>Booking Amount</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.bookingAmount || 0)}</td>
                                    </tr>
                                    <tr class="total-row">
                                        <td>Due Amount</td>
                                        <td class="highlight">${new Intl.NumberFormat('en-IN').format(bookingData.dueAmount || 0)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        

                        <div class="section">
                            <div class="section-title">Terms & Conditions</div>
                            <div class="terms">
                                <ol>
                                    <li>This receipt confirms the booking of the plot mentioned above.</li>
                                    <li>The booking amount is non-refundable.</li>
                                    <li>The remaining amount must be paid as per the agreed payment schedule.</li>
                                    <li>All payments must be made through official payment channels only.</li>
                                    <li>In case of any dispute, the company's decision will be final.</li>
                                    <li>The plot will be transferred only after the complete payment is received.</li>
                                    <li>Any changes in the payment schedule must be approved by the company in writing.</li>
                                    <li>The customer/associate is responsible for all applicable taxes and charges.</li>
                                </ol>
                            </div>
                        </div>

                        <div class="signature-section">
                            <div class="signature-box">
                                <div class="signature-line"></div>
                                <div>Customer/Associate Signature</div>
                            </div>
                            <div class="signature-box">
                                <div class="signature-line"></div>
                                <div>Authorized Signatory</div>
                            </div>
                        </div>

                        <div class="footer">
                            <div>This is a computer-generated receipt and does not require a signature.</div>
                            <div>Generated on: ${new Date().toLocaleString()}</div>
                        </div>
                    </div>

                    <!-- Company Receipt -->
                    <div class="receipt-container">
                        <div class="header">
                            <div class="company-name">KM Builders</div>
                            <div class="company-address">123 Business Street, City, State - 123456</div>
                            <div class="company-address">Phone: +91 1234567890 | Email: info@kmbuilders.com</div>
                        </div>

                        <div class="receipt-title">PLOT BOOKING RECEIPT - COMPANY COPY</div>
                        <div class="payment-plan">Payment Plan: ${bookingData.planType || 'N/A'}</div>

                        <div class="section">
                            <div class="section-title">Plot Details</div>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Project</div>
                                    <div class="detail-value">${projects.find(p => p.projectId === bookingData.projectId)?.siteName || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Block</div>
                                    <div class="detail-value">${blocks.find(b => b.blockId === bookingData.blockID)?.block || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Plot Number</div>
                                    <div class="detail-value">${bookingData.plotNo || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Plot Area</div>
                                    <div class="detail-value">${bookingData.ploatArea || 'N/A'} sq.ft</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Plot Rate</div>
                                    <div class="detail-value">₹${new Intl.NumberFormat('en-IN').format(bookingData.plotRate || 0)} per sq.ft</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Booking Code</div>
                                    <div class="detail-value highlight">${bookingData.bookingCode}</div>
                                </div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">Contact Details</div>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Name</div>
                                    <div class="detail-value">${bookingData.buyerName || bookingData.buyerAssociatName || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Contact Type</div>
                                    <div class="detail-value">${tabValue === 0 ? 'Customer' : 'Associate'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Phone</div>
                                    <div class="detail-value">${bookingData.mobileNo || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Email</div>
                                    <div class="detail-value">${bookingData.emailId || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Address</div>
                                    <div class="detail-value">${bookingData.address || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">Payment Details</div>
                            <table class="payment-table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Plot Cost (${bookingData.ploatArea} sq.ft × ₹${bookingData.plotRate})</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.poatCoast || 0)}</td>
                                    </tr>
                                    <tr>
                                        <td>Development Charges</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.developmentAmount || 0)}</td>
                                    </tr>
                                    <tr>
                                        <td>PLC Amount</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.plcAmount || 0)}</td>
                                    </tr>
                                    <tr>
                                        <td>Other Charges</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.otherCharges || 0)}</td>
                                    </tr>
                                    <tr>
                                        <td>Coupon Discount</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.couponDiscount || 0)}</td>
                                    </tr>
                                    <tr class="total-row">
                                        <td>Total Plot Cost</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.totalPlotCost || 0)}</td>
                                    </tr>
                                    <tr>
                                        <td>Booking Amount</td>
                                        <td>${new Intl.NumberFormat('en-IN').format(bookingData.bookingAmount || 0)}</td>
                                    </tr>
                                    <tr class="total-row">
                                        <td>Due Amount</td>
                                        <td class="highlight">${new Intl.NumberFormat('en-IN').format(bookingData.dueAmount || 0)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        

                        <div class="section">
                            <div class="section-title">Terms & Conditions</div>
                            <div class="terms">
                                <ol>
                                    <li>This receipt confirms the booking of the plot mentioned above.</li>
                                    <li>The booking amount is non-refundable.</li>
                                    <li>The remaining amount must be paid as per the agreed payment schedule.</li>
                                    <li>All payments must be made through official payment channels only.</li>
                                    <li>In case of any dispute, the company's decision will be final.</li>
                                    <li>The plot will be transferred only after the complete payment is received.</li>
                                    <li>Any changes in the payment schedule must be approved by the company in writing.</li>
                                    <li>The customer/associate is responsible for all applicable taxes and charges.</li>
                                </ol>
                            </div>
                        </div>

                        <div class="signature-section">
                            <div class="signature-box">
                                <div class="signature-line"></div>
                                <div>Customer/Associate Signature</div>
                            </div>
                            <div class="signature-box">
                                <div class="signature-line"></div>
                                <div>Authorized Signatory</div>
                            </div>
                        </div>

                        <div class="footer">
                            <div>This is a computer-generated receipt and does not require a signature.</div>
                            <div>Generated on: ${new Date().toLocaleString()}</div>
                        </div>
                    </div>

                    <div class="print-buttons no-print">
                        <button class="print-button" onclick="window.print()">Print Receipts</button>
                        <button class="print-button" onclick="window.close()" style="background: #f44336;">Close</button>
                    </div>
                </body>
                </html>
            `);
            receiptWindow.document.close();
            receiptWindow.focus();
        }
    };

    return (
        <Box sx={{ width: '100%', mb: 4 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    border: '1px solid #e0e0e0',
                    borderRadius: 2
                }}
            >
                {/* Header */}
                <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                    Plot Booking
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Book plots for customers or associates by filling in the required details.
                </Typography>

                {/* Tab navigation */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="plot booking tabs"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                minWidth: 0,
                                px: { xs: 2, sm: 3 }
                            },
                            '& .Mui-selected': {
                                color: '#6B66FF',
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#6B66FF',
                            }
                        }}
                    >
                        <Tab label="Sell to Customer" id="tab-0" />
                        <Tab label="Sell to Associate" id="tab-1" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Customer Selection Section */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Customer Selection
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth error={!!errors.customerId}>
                                        <InputLabel>Select Customer</InputLabel>
                                        <Select
                                            value={formData.customerId}
                                            onChange={handleCustomerChange}
                                            label="Select Customer"
                                            disabled={customersLoading}
                                        >
                                            {customersLoading ? (
                                                <MenuItem disabled>Loading customers...</MenuItem>
                                            ) : customers.length === 0 ? (
                                                <MenuItem disabled>No customers available</MenuItem>
                                            ) : (
                                                customers.map(customer => (
                                                    <MenuItem key={customer.customerId} value={customer.customerId}>
                                                        {customer.customerName}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                        {errors.customerId && (
                                            <FormHelperText error>{errors.customerId}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Associate Code"
                                        value={formData.associateCode}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Customer Details */}
                        {selectedCustomer && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Customer Details
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            value={selectedCustomer.customerName || ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={selectedCustomer.emailId || ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Mobile"
                                            value={selectedCustomer.mobileNo || ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Plot Booking Section */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Plot Selection
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Booking Date"
                                        type="date"
                                        name="bookingDate"
                                        value={formData.bookingDate}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={!!errors.bookingDate}
                                        helperText={errors.bookingDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth error={!!errors.projectId}>
                                        <InputLabel>Select Project</InputLabel>
                                        <Select
                                            name="projectId"
                                            value={formData.projectId}
                                            onChange={handleProjectChange}
                                            label="Select Project"
                                            disabled={projectsLoading}
                                        >
                                            {projectsLoading ? (
                                                <MenuItem disabled>Loading projects...</MenuItem>
                                            ) : projects.length === 0 ? (
                                                <MenuItem disabled>No projects available</MenuItem>
                                            ) : (
                                                projects.map(project => (
                                                    <MenuItem key={project.projectId} value={project.projectId}>
                                                        {project.siteName}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                        {errors.projectId && (
                                            <FormHelperText error>{errors.projectId}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth error={!!errors.blockID} disabled={!formData.projectId || blocksLoading}>
                                        <InputLabel>Select Block</InputLabel>
                                        <Select
                                            name="blockID"
                                            value={formData.blockID}
                                            onChange={handleBlockChange}
                                            label="Select Block"
                                        >
                                            {blocksLoading ? (
                                                <MenuItem disabled>Loading blocks...</MenuItem>
                                            ) : blocks.length === 0 ? (
                                                <MenuItem disabled>No blocks available</MenuItem>
                                            ) : (
                                                blocks.map(block => (
                                                    <MenuItem key={block.blockId} value={block.blockId}>
                                                        {block.block}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                        {errors.blockID && (
                                            <FormHelperText error>{errors.blockID}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                        {formData.blockID && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                    Available Plots
                                </Typography>

                                {plotsLoading ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <CircularProgress size={40} />
                                        <Typography variant="body2" sx={{ mt: 2 }}>
                                            Loading available plots...
                                        </Typography>
                                    </Box>
                                ) : filteredPlots.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                                        <Typography variant="body1">
                                            No available plots found for this block
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}>
                                        {filteredPlots.map((plot) => (
                                            <Grid item xs={6} sm={4} md={3} key={plot.addPlotId}>
                                                <PlotBox
                                                    plot={plot}
                                                    selected={selectedPlot && selectedPlot.addPlotId === plot.addPlotId}
                                                    onClick={handlePlotSelect}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        )}

                        {/* Plot Details Section */}
                        {selectedPlot && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Plot Details
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Plot Number"
                                            value={formData.plotNo}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Plot Area (sq.ft)"
                                            value={formData.plotArea}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Plot Rate (per sq.ft)"
                                            value={formData.plotRate}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Plot Cost"
                                            value={formData.poatCoast}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    {/* <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Development Rate (per sq.ft)"
                                            value={formData.developmentRatePerSqft}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid> */}

                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Total Development Amount"
                                            value={formData.developmentAmount}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="PLC Rate"
                                            value={formData.plcRate}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="PLC Amount"
                                            value={formData.plcAmount}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>


                                </Grid>
                            </Box>
                        )}

                        {/* Payment Details Section */}
                        {selectedPlot && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Payment Details
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Total Plot Cost"
                                            value={formData.totalPlotCost}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Other Charges"
                                            name="otherCharges"
                                            type="number"
                                            value={formData.otherCharges}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Coupon Discount"
                                            name="couponDiscount"
                                            type="number"
                                            value={formData.couponDiscount}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Final Payable Amount"
                                            value={formData.finalPaybleAmount}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    fontWeight: 'bold',
                                                    '& fieldset': {
                                                        borderColor: '#6B66FF',
                                                        borderWidth: 2
                                                    }
                                                },
                                                '& .MuiInputBase-input': {
                                                    fontWeight: 'bold',
                                                    color: '#6B66FF'
                                                }
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControl fullWidth error={!!errors.planType}>
                                            <InputLabel>Payment Plan</InputLabel>
                                            <Select
                                                name="planType"
                                                value={formData.planType}
                                                onChange={handleChange}
                                                label="Payment Plan"
                                            >
                                                <MenuItem value="Full Payment">Full Payment</MenuItem>
                                                <MenuItem value="EMI Plan">EMI Plan</MenuItem>
                                                {/* <MenuItem value="ConstructionLinked">Construction Linked</MenuItem> */}
                                            </Select>
                                            {errors.planType && (
                                                <FormHelperText error>{errors.planType}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    {(formData.planType === 'Full Payment' || formData.planType === 'EMI Plan') && (
                                        <>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Booking Amount"
                                                    name="bookingAmount"
                                                    type="number"
                                                    value={formData.bookingAmount}
                                                    onChange={handleChange}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                                    }}
                                                    variant="outlined"
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Due Amount"
                                                    name="dueAmount"
                                                    type="number"
                                                    value={formData.dueAmount}
                                                    onChange={handleChange}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                                    }}
                                                    variant="outlined"
                                                />
                                            </Grid>

                                            {/* <Grid item xs={12} sm={6} md={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Payment Mode</InputLabel>
                                                    <Select
                                                        name="payMode"
                                                        value={formData.payMode}
                                                        onChange={handleChange}
                                                        label="Payment Mode"
                                                    >
                                                        <MenuItem value="Cheque">Cheque</MenuItem>
                                                        <MenuItem value="Cash">Cash</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid> */}

                                            {formData.payMode === 'Cheque' && (
                                                <>
                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <TextField
                                                            fullWidth
                                                            label="Account Number"
                                                            name="accountNumber"
                                                            value={formData.accountNumber}
                                                            onChange={handleChange}
                                                            variant="outlined"
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <TextField
                                                            fullWidth
                                                            label="Bank Name"
                                                            name="bankName"
                                                            value={formData.bankName}
                                                            onChange={handleChange}
                                                            variant="outlined"
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <TextField
                                                            fullWidth
                                                            label="Branch Name"
                                                            name="branchName"
                                                            value={formData.branchName}
                                                            onChange={handleChange}
                                                            variant="outlined"
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <TextField
                                                            fullWidth
                                                            label="Cheque Date"
                                                            name="checqueDate"
                                                            type="date"
                                                            value={formData.checqueDate}
                                                            onChange={handleChange}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            variant="outlined"
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <TextField
                                                            fullWidth
                                                            label="Cheque Number"
                                                            name="checqueNo"
                                                            value={formData.checqueNo}
                                                            onChange={handleChange}
                                                            variant="outlined"
                                                        />
                                                    </Grid>
                                                </>
                                            )}
                                        </>
                                    )}

                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Remarks"
                                            name="remark"
                                            multiline
                                            rows={1}
                                            value={formData.remark}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Submit Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading || !selectedPlot}
                                sx={{
                                    bgcolor: '#6B66FF',
                                    '&:hover': { bgcolor: '#5652e5' },
                                    px: 4,
                                    py: 1.5
                                }}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                {loading ? 'Processing...' : 'Book Plot'}
                            </Button>
                        </Box>
                    </Box>
                </TabPanel>

                {/* Customer Tab Content */}
                <TabPanel value={tabValue} index={1}>
                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Associate Selection Section */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Associate Selection
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth error={!!errors.associateCode}>
                                        <InputLabel>Select Associate</InputLabel>
                                        <Select
                                            value={formData.associateCode}
                                            onChange={handleAssociateChange}
                                            label="Select Associate"
                                            disabled={associatesLoading}
                                        >
                                            {associatesLoading ? (
                                                <MenuItem disabled>Loading associates...</MenuItem>
                                            ) : associates.length === 0 ? (
                                                <MenuItem disabled>No associates available</MenuItem>
                                            ) : (
                                                associates.map(associate => (
                                                    <MenuItem key={associate.associateReperCode} value={associate.associateReperCode}>
                                                        {associate.name} - {associate.mobile}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                        {errors.associateCode && (
                                            <FormHelperText error>{errors.associateCode}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Associate Details */}
                        {selectedAssociate && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Associate Details
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            value={selectedAssociate.name || ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={selectedAssociate.emailId || ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Mobile"
                                            value={selectedAssociate.mobile || ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Plot Booking Section - Same as customer tab */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Plot Selection
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Booking Date"
                                        type="date"
                                        name="bookingDate"
                                        value={formData.bookingDate}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={!!errors.bookingDate}
                                        helperText={errors.bookingDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth error={!!errors.projectId}>
                                        <InputLabel>Select Project</InputLabel>
                                        <Select
                                            name="projectId"
                                            value={formData.projectId}
                                            onChange={handleProjectChange}
                                            label="Select Project"
                                            disabled={projectsLoading}
                                        >
                                            {projectsLoading ? (
                                                <MenuItem disabled>Loading projects...</MenuItem>
                                            ) : projects.length === 0 ? (
                                                <MenuItem disabled>No projects available</MenuItem>
                                            ) : (
                                                projects.map(project => (
                                                    <MenuItem key={project.projectId} value={project.projectId}>
                                                        {project.siteName}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                        {errors.projectId && (
                                            <FormHelperText error>{errors.projectId}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth error={!!errors.blockID} disabled={!formData.projectId || blocksLoading}>
                                        <InputLabel>Select Block</InputLabel>
                                        <Select
                                            name="blockID"
                                            value={formData.blockID}
                                            onChange={handleBlockChange}
                                            label="Select Block"
                                        >
                                            {blocksLoading ? (
                                                <MenuItem disabled>Loading blocks...</MenuItem>
                                            ) : blocks.length === 0 ? (
                                                <MenuItem disabled>No blocks available</MenuItem>
                                            ) : (
                                                blocks.map(block => (
                                                    <MenuItem key={block.blockId} value={block.blockId}>
                                                        {block.block}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                        {errors.blockID && (
                                            <FormHelperText error>{errors.blockID}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Plot Grid - Same as customer tab */}
                        {formData.blockID && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                    Available Plots
                                </Typography>

                                {plotsLoading ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <CircularProgress size={40} />
                                        <Typography variant="body2" sx={{ mt: 2 }}>
                                            Loading available plots...
                                        </Typography>
                                    </Box>
                                ) : filteredPlots.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                                        <Typography variant="body1">
                                            No available plots found for this block
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}>
                                        {filteredPlots.map((plot) => (
                                            <Grid item xs={6} sm={4} md={3} key={plot.addPlotId}>
                                                <PlotBox
                                                    plot={plot}
                                                    selected={selectedPlot && selectedPlot.addPlotId === plot.addPlotId}
                                                    onClick={handlePlotSelect}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        )}

                        {/* Plot Details Section - Same as customer tab */}
                        {selectedPlot && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Plot Details
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Plot Number"
                                            value={formData.plotNo}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Plot Area (sq.ft)"
                                            value={formData.plotArea}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Plot Rate (per sq.ft)"
                                            value={formData.plotRate}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Plot Cost"
                                            value={formData.poatCoast}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Development Rate (per sq.ft)"
                                            value={formData.developmentRatePerSqft}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Total Development Amount"
                                            value={formData.totalDevelopmentRate}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="PLC Amount"
                                            value={formData.plcAmount}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Payment Details Section - Same as customer tab */}
                        {selectedPlot && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Payment Details
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Total Plot Cost"
                                            value={formData.totalPlotCost}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Other Charges"
                                            name="otherCharges"
                                            type="number"
                                            value={formData.otherCharges}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Coupon Discount"
                                            name="couponDiscount"
                                            type="number"
                                            value={formData.couponDiscount}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Final Payable Amount"
                                            value={formData.finalPaybleAmount}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    fontWeight: 'bold',
                                                    '& fieldset': {
                                                        borderColor: '#6B66FF',
                                                        borderWidth: 2
                                                    }
                                                },
                                                '& .MuiInputBase-input': {
                                                    fontWeight: 'bold',
                                                    color: '#6B66FF'
                                                }
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControl fullWidth error={!!errors.planType}>
                                            <InputLabel>Payment Plan</InputLabel>
                                            <Select
                                                name="planType"
                                                value={formData.planType}
                                                onChange={handleChange}
                                                label="Payment Plan"
                                            >
                                                <MenuItem value="Full Payment">Full Payment</MenuItem>
                                                <MenuItem value="EMI Plan">EMI Plan</MenuItem>
                                                {/* <MenuItem value="ConstructionLinked">Construction Linked</MenuItem> */}
                                            </Select>
                                            {errors.planType && (
                                                <FormHelperText error>{errors.planType}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    {(formData.planType === 'Full Payment' || formData.planType === 'EMI Plan') && (
                                        <>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Booking Amount"
                                                    name="bookingAmount"
                                                    type="number"
                                                    value={formData.bookingAmount}
                                                    onChange={handleChange}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                                    }}
                                                    variant="outlined"
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Due Amount"
                                                    name="dueAmount"
                                                    type="number"
                                                    value={formData.dueAmount}
                                                    onChange={handleChange}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                                    }}
                                                    variant="outlined"
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Payment Mode</InputLabel>
                                                    <Select
                                                        name="payMode"
                                                        value={formData.payMode}
                                                        onChange={handleChange}
                                                        label="Payment Mode"
                                                    >
                                                        <MenuItem value="Cheque">Cheque</MenuItem>
                                                        <MenuItem value="Cash">Cash</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            {formData.payMode === 'Cheque' && (
                                                <>
                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <TextField
                                                            fullWidth
                                                            label="Account Number"
                                                            name="accountNumber"
                                                            value={formData.accountNumber}
                                                            onChange={handleChange}
                                                            variant="outlined"
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <TextField
                                                            fullWidth
                                                            label="Bank Name"
                                                            name="bankName"
                                                            value={formData.bankName}
                                                            onChange={handleChange}
                                                            variant="outlined"
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <TextField
                                                            fullWidth
                                                            label="Branch Name"
                                                            name="branchName"
                                                            value={formData.branchName}
                                                            onChange={handleChange}
                                                            variant="outlined"
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <TextField
                                                            fullWidth
                                                            label="Cheque Date"
                                                            name="checqueDate"
                                                            type="date"
                                                            value={formData.checqueDate}
                                                            onChange={handleChange}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            variant="outlined"
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <TextField
                                                            fullWidth
                                                            label="Cheque Number"
                                                            name="checqueNo"
                                                            value={formData.checqueNo}
                                                            onChange={handleChange}
                                                            variant="outlined"
                                                        />
                                                    </Grid>
                                                </>
                                            )}
                                        </>
                                    )}

                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Remarks"
                                            name="remark"
                                            multiline
                                            rows={1}
                                            value={formData.remark}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}


                        {/* Submit Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading || !selectedPlot}
                                sx={{
                                    bgcolor: '#6B66FF',
                                    '&:hover': { bgcolor: '#5652e5' },
                                    px: 4,
                                    py: 1.5
                                }}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                {loading ? 'Processing...' : 'Book Plot'}
                            </Button>
                        </Box>
                    </Box>
                </TabPanel>
            </Paper>

            {/* Notification */}
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
        </Box>
    );
};

export default PlotBooking;