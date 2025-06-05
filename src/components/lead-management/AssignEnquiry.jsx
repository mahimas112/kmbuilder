import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Search as SearchIcon,
    Update as UpdateIcon
} from '@mui/icons-material';
import axiosInstance from '../../axiosInstance';
const AssignEnquiryManager = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteEnquiryId, setDeleteEnquiryId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [assignedEnquiries, setAssignedEnquiries] = useState([]);
    const [formData, setFormData] = useState({
        assignEnquiryId: 0,
        assignedDate: new Date().toISOString().split('T')[0],
        enquiryId: "",
        associateCode: localStorage.getItem('associatecode') || "",
        enquiryStatus: "",
        feedback: ""
    });
    const [statusData, setStatusData] = useState({
        assignEnquiryId: 0,
        assignedDate: "",
        enquiryId: 0,
        associateCode: "",
        enquiryStatus: "",
        feedBack: ""
    });
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        assignedDate: "",
        enquiryId: "",
        associateCode: "",
        enquiryStatus: "",
        feedback: ""
    });

    const [statusErrors, setStatusErrors] = useState({
        enquiryStatus: "",
        feedBack: ""
    });

    const [associates, setAssociates] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ""
        });
    };

    const handleStatusChange = (e) => {
        const { name, value } = e.target;
        setStatusData({
            ...statusData,
            [name]: value
        });

        setStatusErrors({
            ...statusErrors,
            [name]: ""
        });
    };

    const handleSnackbarClose = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!formData.assignedDate) {
            newErrors.assignedDate = "Assigned date is required";
            isValid = false;
        } else {
            const selectedDate = new Date(formData.assignedDate);
            const today = new Date();
            if (selectedDate > today) {
                newErrors.assignedDate = "Assigned date cannot be in the future";
                isValid = false;
            }
        }

        if (!formData.enquiryId) {
            newErrors.enquiryId = "Please select an enquiry";
            isValid = false;
        }

        if (!formData.associateCode) {
            newErrors.associateCode = "Please select an associate";
            isValid = false;
        }

        if (!formData.enquiryStatus) {
            newErrors.enquiryStatus = "Please select a status";
            isValid = false;
        }

        if (formData.feedback && formData.feedback.length < 3) {
            newErrors.feedback = "Feedback must be at least 3 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateStatusForm = () => {
        let isValid = true;
        const newStatusErrors = { ...statusErrors };

        if (!statusData.assignEnquiryId || statusData.assignEnquiryId === 0) {
            showSnackbar('Invalid enquiry assignment ID', 'error');
            return false;
        }

        if (!statusData.enquiryStatus) {
            newStatusErrors.enquiryStatus = "Please select a status";
            isValid = false;
        }

        if ((statusData.enquiryStatus === "Completed" || statusData.enquiryStatus === "Cancelled") &&
            (!statusData.feedBack || statusData.feedBack.trim().length < 5)) {
            newStatusErrors.feedBack = `Detailed feedback is required when marking as ${statusData.enquiryStatus}`;
            isValid = false;
        }

        setStatusErrors(newStatusErrors);
        return isValid;
    };

    const getAllAssignedEnquiries = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                '/realEstate/assignEnquiry/getAllAssignEnquiry'
            );

            if (response.data && response.data.data) {
                setAssignedEnquiries(response.data.data);
            } else {
                throw new Error('Unexpected response format from assigned enquiries API');
            }
        } catch (error) {
            console.error('Error fetching assigned enquiries:', error);
            showSnackbar(`Error: ${error.response?.data?.message || error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        try {
            const payload = {
                ...formData,
                enquiryId: Number(formData.enquiryId),
                assignEnquiryId: Number(formData.assignEnquiryId)
            };
            // console.log(assignEnquiryId)
            const url = isEditMode
                ? `/realEstate/assignEnquiry/updateAssignEnquiry?assignEnquiryId=${payload.assignEnquiryId}`
                : '/realEstate/assignEnquiry/createAssignEnquiry';

            const method = isEditMode ? 'put' : 'post';

            const response = await axiosInstance[method](url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*'
                }
            });

            if (response.data && response.data.status === 201) {
                showSnackbar(isEditMode ? 'Enquiry updated successfully' : 'Enquiry assigned successfully');

                setIsDialogOpen(false);
                resetForm();

                await getAllAssignedEnquiries();
            } else {
                throw new Error(response.data?.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            showSnackbar(`Error: ${error.response?.data?.message || error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();

        if (!validateStatusForm()) {
            return;
        }

        setLoading(true);
        try {
            const payload = {
                assignEnquiryId: Number(statusData.assignEnquiryId),
                assignedDate: statusData.assignedDate,
                enquiryId: Number(statusData.enquiryId),
                associateCode: statusData.associateCode,
                enquiryStatus: statusData.enquiryStatus,
                feedBack: statusData.feedBack
            };


            const response = await axiosInstance.put(
                '/realEstate/assignEnquiry/updateAssingEnquiryStatus',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': '*/*'
                    }
                }
            );

            if (response.data && response.data.status === 201 && response.data.data) {
                showSnackbar('Status updated successfully');

                setIsStatusDialogOpen(false);
                setStatusData({
                    assignEnquiryId: 0,
                    assignedDate: "",
                    enquiryId: 0,
                    associateCode: "",
                    enquiryStatus: "",
                    feedBack: ""
                });

                await getAllAssignedEnquiries();
            } else {
                throw new Error(response.data?.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showSnackbar(`Error: ${error.response?.data?.message || error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const openDeleteDialog = (id) => {
        setDeleteEnquiryId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteEnquiryId) return;

        setLoading(true);
        try {
            const response = await axiosInstance.delete(
                `/realEstate/assignEnquiry/deleteAssignEnquiry?assignEnquiryId=${deleteEnquiryId}`
            );

            if (response.data && response.data.status === 200) {
                showSnackbar('Enquiry assignment deleted successfully');
                await getAllAssignedEnquiries();
            } else {
                throw new Error(response.data?.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error deleting assigned enquiry:', error);
            showSnackbar(`Error: ${error.response?.data?.message || error.message}`, 'error');
        } finally {
            setLoading(false);
            setIsDeleteDialogOpen(false);
            setDeleteEnquiryId(null);
        }
    };

    const resetForm = () => {
        setFormData({
            assignEnquiryId: 0,
            assignedDate: new Date().toISOString().split('T')[0],
            enquiryId: "",
            associateCode: "",
            enquiryStatus: "",
            feedback: ""
        });
        setErrors({
            assignedDate: "",
            enquiryId: "",
            associateCode: "",
            enquiryStatus: "",
            feedback: ""
        });
        setIsEditMode(false);
    };

    const handleEditClick = (enquiry) => {
        setFormData({
            assignEnquiryId: enquiry.assignEnquiryId || 0,
            assignedDate: enquiry.assignedDate || new Date().toISOString().split('T')[0],
            enquiryId: enquiry.enquiryId || "",
            associateCode: enquiry.associateCode || "",
            enquiryStatus: enquiry.enquiryStatus || "",
            feedback: enquiry.feedback || enquiry.feedBack || ""
        });
        setIsEditMode(true);
        setIsDialogOpen(true);
    };

    const handleStatusClick = (enquiry) => {
        console.log("Status update for enquiry:", enquiry);

        setStatusData({
            assignEnquiryId: enquiry.assignEnquiryId || 0,
            assignedDate: enquiry.assignedDate || new Date().toISOString().split('T')[0],
            enquiryId: enquiry.enquiryId || 0,
            associateCode: enquiry.associateCode || "",
            enquiryStatus: enquiry.enquiryStatus || "",
            feedBack: enquiry.feedBack || enquiry.feedback || ""
        });

        setStatusErrors({
            enquiryStatus: "",
            feedBack: ""
        });

        setIsStatusDialogOpen(true);
    };

    const getAllAssociates = async () => {
        try {
            const response = await axiosInstance.get('/realEstate/associate/getAll')
            if (response.data && Array.isArray(response.data.data) && response.data.status === 200) {
                setAssociates(response.data.data)
            }
            else {
                throw new Error('Unexpected response format from enquiries API');
            }
        } catch (error) {
            console.error('Error fetching enquiries:', error);
            showSnackbar(`Error: ${error.response?.data?.message || error.message}`, 'error');
        }
    }

    // const getAllAssociates = async () => {
    //     try {
    //         const associateCode = sessionStorage.getItem('associateCode');
    //         console.log("Associate code from session storage:", associateCode);
    //         if (!associateCode) {
    //             showSnackbar('Associate code not found in session storage', 'error');
    //             return;
    //         }

    //         const response = await axiosInstance.get(
    //             `/realEstate/associate/assocateCode?assoccode=${associateCode}`
    //         );

    //         if (response.data && response.data.data) {
    //             if (!Array.isArray(response.data.data)) {
    //                 setAssociates([response.data.data]);
    //             } else {
    //                 setAssociates(response.data.data);
    //             }
    //         } else {
    //             throw new Error('Unexpected response format from associates API');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching associates:', error);
    //         showSnackbar(`Error: ${error.response?.data?.message || error.message}`, 'error');
    //     }
    // };

    const getAllEnquiry = async () => {
        try {
            const response = await axiosInstance.get(
                '/realEstate/enquiry/getAllEnquiry'
            );

            if (response.data && response.data.data) {
                setEnquiries(response.data.data);
            } else {
                throw new Error('Unexpected response format from enquiries API');
            }
        } catch (error) {
            console.error('Error fetching enquiries:', error);
            showSnackbar(`Error: ${error.response?.data?.message || error.message}`, 'error');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        getAllAssociates();
        getAllEnquiry();
        getAllAssignedEnquiries();
    }, []);

    const filteredAssignedEnquiries = assignedEnquiries.filter(enquiry =>
        (enquiry.enquiryId && enquiry.enquiryId.toString().includes(searchTerm)) ||
        (enquiry.associateName && enquiry.associateName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (enquiry.enquiryStatus && enquiry.enquiryStatus.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                mb: 3,
                gap: 2
            }}>
                <Typography variant="h5" component="h1" fontWeight="bold">
                    Assigned Enquiries {loading && "(Loading...)"}
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    <TextField
                        placeholder="Search assigned enquiries..."
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: { xs: '100%', sm: 220 } }}
                    />

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            resetForm();
                            setIsDialogOpen(true);
                        }}
                        sx={{
                            bgcolor: '#6B66FF',
                            '&:hover': { bgcolor: '#5652e5' }
                        }}
                        disabled={loading}
                    >
                        Assign Enquiry
                    </Button>
                </Box>
            </Box>
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    overflowX: 'auto',
                    border: '1px solid #e0e0e0'
                }}
            >
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#DAE1F3' }}>
                        <TableRow>
                            <TableCell><Typography sx={{ fontWeight: 600 }}>Sr.No</Typography></TableCell>
                            <TableCell><Typography sx={{ fontWeight: 600 }}>Associate Name</Typography></TableCell>
                            <TableCell><Typography sx={{ fontWeight: 600 }}>Assigned Date</Typography></TableCell>
                            <TableCell><Typography sx={{ fontWeight: 600 }}>Feedback</Typography></TableCell>
                            <TableCell><Typography sx={{ fontWeight: 600 }}>Status</Typography></TableCell>
                            <TableCell><Typography sx={{ fontWeight: 600 }}>Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAssignedEnquiries.map((enquiry, index) => (
                            <TableRow key={enquiry.id || enquiry.assignEnquiryId || index}>
                                <TableCell sx={{ fontWeight: 500 }}>{index + 1}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{enquiry.associateName || enquiry.associateCode}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{enquiry.assignedDate}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{enquiry.feedBack || enquiry.feedback}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>
                                    <Typography
                                        sx={{
                                            display: 'inline-block',
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 1,
                                            color: 'white',
                                            fontWeight: 'medium',
                                            fontSize: '0.75rem',
                                            bgcolor:
                                                enquiry.enquiryStatus === 'Completed' ? 'success.main' :
                                                    enquiry.enquiryStatus === 'Cancelled' ? 'error.main' :
                                                        enquiry.enquiryStatus === 'In Progress' ? 'info.main' : 'warning.main'
                                        }}
                                    >
                                        {enquiry.enquiryStatus || "New"}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ fontWeight: 500 }}>
                                    {/* <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => handleEditClick(enquiry)}
                                        title="Edit Enquiry"
                                        disabled={loading}
                                    >
                                        <EditIcon />
                                    </IconButton> */}

                                    <IconButton
                                        color="success"
                                        size="small"
                                        onClick={() => handleStatusClick(enquiry)}
                                        title="Update Status"
                                        sx={{ ml: 1 }}
                                        disabled={loading}
                                    >
                                        <UpdateIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => openDeleteDialog(enquiry.assignEnquiryId || enquiry.id)}
                                        title="Delete Enquiry"
                                        disabled={loading}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredAssignedEnquiries.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    {loading ? 'Loading data...' : 'No records found'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={isDialogOpen}
                onClose={() => {
                    if (!loading) {
                        setIsDialogOpen(false);
                        resetForm();
                    }
                }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{isEditMode ? 'Update Assigned Enquiry' : 'Assign Enquiry'}</Typography>
                        <IconButton
                            onClick={() => {
                                if (!loading) {
                                    setIsDialogOpen(false);
                                    resetForm();
                                }
                            }}
                            disabled={loading}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            {isEditMode && (
                                <input
                                    type="hidden"
                                    name="id"
                                    value={formData.id}
                                />
                            )}

                            <TextField
                                fullWidth
                                type="date"
                                label="Assigned Date"
                                name="assignedDate"
                                value={formData.assignedDate}
                                onChange={handleInputChange}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                required
                                error={!!errors.assignedDate}
                                helperText={errors.assignedDate}
                                inputProps={{
                                    max: new Date().toISOString().split('T')[0]
                                }}
                                disabled={loading}
                            />

                            <FormControl
                                fullWidth
                                variant="outlined"
                                required
                                error={!!errors.enquiryId}
                                disabled={loading}
                            >
                                <InputLabel>Enquiry</InputLabel>
                                <Select
                                    label="Enquiry"
                                    name="enquiryId"
                                    value={formData.enquiryId}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value=""><em>Select Enquiry</em></MenuItem>
                                    {enquiries.map((enquiry) => (
                                        <MenuItem key={enquiry.id} value={enquiry.enquiryId}>
                                            {enquiry.enquiryId} - {enquiry.customerName || enquiry.description || 'Enquiry'}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.enquiryId && <FormHelperText>{errors.enquiryId}</FormHelperText>}
                            </FormControl>

                            <FormControl
                                fullWidth
                                variant="outlined"
                                required
                                error={!!errors.associateCode}
                                disabled={loading}
                            >
                                <InputLabel>Associate</InputLabel>
                                <Select
                                    label="Associate"
                                    name="associateCode"
                                    value={formData.associateCode}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value=""><em>Select Associate</em></MenuItem>
                                    {Array.isArray(associates) && associates.map((associate) => (
                                        <MenuItem key={associate.associateReperCode} value={associate.associateReperCode}>
                                            {associate.name || associate.associateReperCode || 'Associate'}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.associateCode && <FormHelperText>{errors.associateCode}</FormHelperText>}
                            </FormControl>

                            <FormControl
                                fullWidth
                                variant="outlined"
                                required
                                error={!!errors.enquiryStatus}
                                disabled={loading}
                            >
                                <InputLabel>Enquiry Status</InputLabel>
                                <Select
                                    label="Enquiry Status"
                                    name="enquiryStatus"
                                    value={formData.enquiryStatus}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value=""><em>Select Status</em></MenuItem>
                                    <MenuItem value="New">New</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                </Select>
                                {errors.enquiryStatus && <FormHelperText>{errors.enquiryStatus}</FormHelperText>}
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Feedback"
                                name="feedback"
                                value={formData.feedback}
                                onChange={handleInputChange}
                                variant="outlined"
                                multiline
                                rows={3}
                                error={!!errors.feedback}
                                helperText={errors.feedback}
                                disabled={loading}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button
                            onClick={() => {
                                if (!loading) {
                                    setIsDialogOpen(false);
                                    resetForm();
                                }
                            }}
                            variant="outlined"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : (isEditMode ? 'Update' : 'Submit')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog
                open={isStatusDialogOpen}
                onClose={() => {
                    if (!loading) {
                        setIsStatusDialogOpen(false);
                    }
                }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Update Enquiry Status</Typography>
                        <IconButton
                            onClick={() => {
                                if (!loading) {
                                    setIsStatusDialogOpen(false);
                                }
                            }}
                            disabled={loading}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <form onSubmit={handleStatusUpdate}>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <input type="hidden" name="assignEnquiryId" value={statusData.assignEnquiryId} />

                            <FormControl
                                fullWidth
                                variant="outlined"
                                required
                                error={!!statusErrors.enquiryStatus}
                                disabled={loading}
                            >
                                <InputLabel>Enquiry Status</InputLabel>
                                <Select
                                    label="Enquiry Status"
                                    name="enquiryStatus"
                                    value={statusData.enquiryStatus}
                                    onChange={handleStatusChange}
                                >
                                    <MenuItem value=""><em>Select Status</em></MenuItem>
                                    <MenuItem value="New">New</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                </Select>
                                {statusErrors.enquiryStatus && <FormHelperText>{statusErrors.enquiryStatus}</FormHelperText>}
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Feedback"
                                name="feedBack"
                                value={statusData.feedBack}
                                onChange={handleStatusChange}
                                variant="outlined"
                                multiline
                                rows={3}
                                required={statusData.enquiryStatus === "Completed" || statusData.enquiryStatus === "Cancelled"}
                                error={!!statusErrors.feedBack}
                                helperText={statusErrors.feedBack || (statusData.enquiryStatus === "Completed" || statusData.enquiryStatus === "Cancelled" ? "Detailed feedback is required for this status" : "")}
                                disabled={loading}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button
                            onClick={() => {
                                if (!loading) {
                                    setIsStatusDialogOpen(false);
                                }
                            }}
                            variant="outlined"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Status'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => {
                    if (!loading) {
                        setIsDeleteDialogOpen(false);
                        setDeleteEnquiryId(null);
                    }
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Confirm Delete</Typography>
                        <IconButton
                            onClick={() => {
                                if (!loading) {
                                    setIsDeleteDialogOpen(false);
                                    setDeleteEnquiryId(null);
                                }
                            }}
                            disabled={loading}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to delete this enquiry assignment? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={() => {
                            if (!loading) {
                                setIsDeleteDialogOpen(false);
                                setDeleteEnquiryId(null);
                            }
                        }}
                        variant="outlined"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default AssignEnquiryManager;