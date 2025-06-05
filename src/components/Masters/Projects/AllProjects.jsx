import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    IconButton,
    Checkbox,
    Menu,
    MenuItem,
    Tooltip,
    CircularProgress,
    Alert,
    Snackbar,
    InputAdornment,
    useMediaQuery,
    Grid,
    Card,
    CardContent,
    Divider,
    Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import GetAppIcon from '@mui/icons-material/GetApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Delete from '@mui/icons-material/Delete';
import axiosInstance from '../../../axiosInstance';

// Get base URL from environment variables

const AllProjects = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    // Responsive breakpoints
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));

    // State variables
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [locationFilter, setLocationFilter] = useState('All');

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locations, setLocations] = useState(['All']);

    // Snackbar for notifications
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Fetch projects data
    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get(`/realEstate/project/getAll`);

            if (response.data && response.data.status === 200) {
                const projectsData = response.data.data;

                // Extract unique locations for filter
                const uniqueLocations = [...new Set(projectsData.map(project => project.siteLocation))];
                setLocations(['All', ...uniqueLocations]);

                // Set projects data
                setProjects(projectsData);
                setFilteredProjects(projectsData);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch projects');
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred while fetching data';
            setError(errorMessage);

            // Show error notification
            setSnackbar({
                open: true,
                message: `Error: ${errorMessage}`,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchProjects();
    }, []);

    // Apply filters whenever filter values change
    useEffect(() => {
        handleFilter();
    }, [searchTerm, locationFilter]);

    // Handle filtering
    const handleFilter = () => {
        if (!projects.length) return;

        let result = [...projects];

        // Apply search term filter
        if (searchTerm) {
            result = result.filter(project =>
                project.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.siteLocation.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply location filter
        if (locationFilter !== 'All') {
            result = result.filter(project => project.siteLocation === locationFilter);
        }

        setFilteredProjects(result);
        setSelectedProjects([]);
    };

    // Reset filters
    const handleResetFilter = () => {
        setSearchTerm('');
        setLocationFilter('All');
        setFilteredProjects(projects);

        // Show success notification
        setSnackbar({
            open: true,
            message: 'Filters have been reset',
            severity: 'success'
        });
    };

    // Handle checkbox selection
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedProjects(filteredProjects.map(project => project.projectId));
        } else {
            setSelectedProjects([]);
        }
    };

    const handleSelectProject = (event, id) => {
        if (event.target.checked) {
            setSelectedProjects([...selectedProjects, id]);
        } else {
            setSelectedProjects(selectedProjects.filter(projectId => projectId !== id));
        }
    };

    // Filter menu
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    // Navigate to add project page
    const navigateToAddProject = () => {
        navigate('/masters/add-project');
    };

    // Handle snackbar close
    const handleSnackbarClose = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    // Format date function (YYYY-MM-DD to DD/MM/YYYY)
    const formatDate = (dateString) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '/');
        } catch (e) {
            console.error('Date formatting error:', e);
            return dateString;
        }
    };

    // Render card view for mobile
    const renderCardView = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Loading projects...
                    </Typography>
                </Box>
            );
        }

        if (filteredProjects.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', my: 4 }}>
                    <Typography variant="body1">
                        No projects found. {searchTerm && "Try adjusting your search criteria."}
                    </Typography>
                </Box>
            );
        }

        return (
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {filteredProjects.map((project) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} key={project.projectId}>
                        <Card
                            elevation={0}
                            sx={{
                                border: '1px solid #e0e0e0',
                                height: '100%',
                                position: 'relative'
                            }}
                        >
                            <CardContent sx={{ p: 2, pb: '16px !important' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }} component="div">
                                        {project.siteName}
                                    </Typography>
                                    <Checkbox
                                        size="small"
                                        checked={selectedProjects.includes(project.projectId)}
                                        onChange={(event) => handleSelectProject(event, project.projectId)}
                                    />
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Project ID:</strong> {project.projectId.substring(0, 8)}...
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Location:</strong> {project.siteLocation}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Creation Date:</strong> {formatDate(project.siteCreationDate)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
            {/* Header with breadcrumb */}
            <Box sx={{
                display: 'flex',
                flexDirection: isXsScreen ? 'column' : 'row',
                alignItems: isXsScreen ? 'flex-start' : 'center',
                gap: isXsScreen ? 1 : 0,
                mb: 2
            }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    sx={{ color: 'text.secondary', mr: 2 }}
                    onClick={() => navigate('/dashboard')}
                    size={isXsScreen ? "small" : "medium"}
                >
                    Back
                </Button>
                <Typography
                    variant={isXsScreen ? "h6" : "h5"}
                    sx={{ fontWeight: 500 }}
                >
                    All Projects
                </Typography>
            </Box>

            {/* Error message if fetch failed */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Actions Bar */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 1.5, sm: 2 },
                    mb: 3,
                    backgroundColor: '#F5F8FF',
                    borderRadius: 1
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: isXsScreen ? 'column' : 'row',
                    alignItems: isXsScreen ? 'stretch' : 'center',
                    justifyContent: 'space-between',
                    gap: isXsScreen ? 2 : 0
                }}>
                    {/* Left Side - Search */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: isXsScreen ? '100%' : 'auto'
                    }}>
                        <TextField
                            placeholder="Search"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                backgroundColor: 'white',
                                width: isXsScreen ? '100%' : 250,
                                mr: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Right Side - Actions */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: isXsScreen ? 'space-between' : 'flex-end',
                        width: isXsScreen ? '100%' : 'auto'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Tooltip title="Reset Filters">
                                <IconButton
                                    onClick={handleResetFilter}
                                    sx={{ backgroundColor: 'white' }}
                                    disabled={loading}
                                    size={isXsScreen ? "small" : "medium"}
                                >
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Filter">
                                <IconButton
                                    onClick={handleFilterClick}
                                    sx={{ backgroundColor: 'white' }}
                                    disabled={loading}
                                    size={isXsScreen ? "small" : "medium"}
                                >
                                    <FilterListIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Download">
                                <IconButton
                                    sx={{ backgroundColor: 'white' }}
                                    disabled={loading}
                                    size={isXsScreen ? "small" : "medium"}
                                >
                                    <GetAppIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Button
                            variant="contained"
                            startIcon={isXsScreen ? null : <AddIcon />}
                            onClick={navigateToAddProject}
                            disabled={loading}
                            size={isXsScreen ? "small" : "medium"}
                            sx={{
                                ml: 1,
                                minWidth: isXsScreen ? 0 : undefined,
                                backgroundColor: '#10B981',
                                '&:hover': {
                                    backgroundColor: '#059669'
                                }
                            }}
                        >
                            {isXsScreen ? <AddIcon fontSize="small" /> : "Add Project"}
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Conditional rendering based on screen size */}
            {isXsScreen || isSmScreen ? (
                // Card view for mobile and small tablets
                renderCardView()
            ) : (
                // Table view for larger screens
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
                                {/* <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        indeterminate={selectedProjects.length > 0 && selectedProjects.length < filteredProjects.length}
                                        checked={filteredProjects.length > 0 && selectedProjects.length === filteredProjects.length}
                                        onChange={handleSelectAll}
                                        disabled={loading}
                                    />
                                </TableCell> */}
                                {/* <TableCell sx={{ fontWeight: 600 }}>Project ID</TableCell> */}
                                <TableCell sx={{ fontWeight: 600 }}>Site Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Creation Date</TableCell>
                                {/* <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        <CircularProgress size={40} />
                                        <Typography variant="body2" sx={{ mt: 2 }}>
                                            Loading projects...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredProjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body1">
                                            No projects found. {searchTerm && "Try adjusting your search criteria."}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProjects.map((project) => (
                                    <TableRow
                                        key={project.projectId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        {/* <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={selectedProjects.includes(project.projectId)}
                                                onChange={(event) => handleSelectProject(event, project.projectId)}
                                            />
                                        </TableCell> */}
                                        {/* <TableCell sx={{ fontWeight: 600 }}>{project.projectId.substring(0, 8)}...</TableCell> */}
                                        <TableCell sx={{ fontWeight: 600 }}>{project.siteName}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{project.siteLocation}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{formatDate(project.siteCreationDate)}</TableCell>
                                        
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Filter Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleFilterClose}
                PaperProps={{
                    sx: {
                        width: isXsScreen ? '80%' : 250,
                        mt: 1,
                        p: 1
                    }
                }}
            >
                <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>Filter by Location:</Typography>

                {locations.map((location) => (
                    <MenuItem
                        key={location}
                        onClick={() => {
                            setLocationFilter(location);
                            handleFilterClose();
                        }}
                        selected={locationFilter === location}
                    >
                        {location}
                    </MenuItem>
                ))}
            </Menu>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: isXsScreen ? 'top' : 'bottom',
                    horizontal: isXsScreen ? 'center' : 'right'
                }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AllProjects;
