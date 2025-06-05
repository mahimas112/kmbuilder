import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Grid,
    TextField,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import axiosInstance from '../../../axiosInstance';

const ProjectManipulation = () => {
    // Form selections
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('');
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [plotNoFilter, setPlotNoFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Data storage
    const [projects, setProjects] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [plots, setPlots] = useState([]);
    const [filteredPlots, setFilteredPlots] = useState([]);

    // Loading states
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [blocksLoading, setBlocksLoading] = useState(false);
    const [plotsLoading, setPlotsLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Status change dialog
    const [statusDialog, setStatusDialog] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    // Notification
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Status options for dropdown
    const statusOptions = ['Available', 'Booked', 'Sold', 'Reserved'];

    // Fetch all projects on initial load
    useEffect(() => {
        fetchAllProjects();
    }, []);

    // Fetch projects
    const fetchAllProjects = async () => {
        setProjectsLoading(true);
        try {
            const response = await axiosInstance.get('/realEstate/project/getAll');
            if (response.data.status === 200 && Array.isArray(response.data.data)) {
                setProjects(response.data.data);
            } else {
                handleNotification('Failed to load projects', 'error');
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            handleNotification('Network error while fetching projects', 'error');
        } finally {
            setProjectsLoading(false);
        }
    };

    // Fetch blocks for selected project
    const fetchBlocksByProject = async (projectId) => {
        if (!projectId) return;

        setBlocksLoading(true);
        setBlocks([]);
        setSelectedBlock('');
        setSelectedPlot(null);
        setPlots([]);
        setFilteredPlots([]);

        try {
            const response = await axiosInstance.get(`/realEstate/Block/getAllBlockByProjectUUId?projectId=${projectId}`);
            if (response.data.status === 200 && Array.isArray(response.data.data)) {
                setBlocks(response.data.data);
            } else {
                handleNotification('Failed to load blocks for this project', 'error');
            }
        } catch (error) {
            console.error('Error fetching blocks:', error);
            handleNotification('Network error while fetching blocks', 'error');
        } finally {
            setBlocksLoading(false);
        }
    };

    // Fetch plots for selected project and block
    const fetchPlotsByProjectAndBlock = async () => {
        if (!selectedProject || !selectedBlock) {
            handleNotification('Please select both project and block', 'warning');
            return;
        }

        setPlotsLoading(true);
        setPlots([]);
        setFilteredPlots([]);
        setSelectedPlot(null);

        try {
            const response = await axiosInstance.get('/realEstate/plotDetail/getAll');
            if (response.data.status === 200 && Array.isArray(response.data.data)) {
                const filteredByProject = response.data.data.filter(
                    plot => plot.projectId === selectedProject
                );
                const filteredByBlock = filteredByProject.filter(
                    plot => plot.blockId === selectedBlock
                );

                setPlots(filteredByBlock);
                setFilteredPlots(filteredByBlock);

                if (filteredByBlock.length === 0) {
                    handleNotification('No plots found for selected project and block', 'info');
                }
            } else {
                handleNotification('Failed to load plots', 'error');
            }
        } catch (error) {
            console.error('Error fetching plots:', error);
            handleNotification('Network error while fetching plots', 'error');
        } finally {
            setPlotsLoading(false);
        }
    };

    // Apply plot number and status filters
    const applyFilters = () => {
        if (!plots.length) return;

        let filtered = [...plots];

        if (plotNoFilter.trim()) {
            filtered = filtered.filter(plot =>
                plot.plotNo.toLowerCase().includes(plotNoFilter.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(plot => plot.status === statusFilter);
        }

        setFilteredPlots(filtered);
    };

    // Update filters on change
    useEffect(() => {
        applyFilters();
    }, [plotNoFilter, statusFilter, plots]);

    // Handle project selection
    const handleProjectChange = (event) => {
        const projectId = event.target.value;
        setSelectedProject(projectId);
        setSelectedBlock('');
        setPlotNoFilter('');
        setStatusFilter('');
        setPlots([]);
        setFilteredPlots([]);
        setSelectedPlot(null);

        if (projectId) {
            fetchBlocksByProject(projectId);
        } else {
            setBlocks([]);
        }
    };

    // Handle block selection  
    const handleBlockChange = (event) => {
        setSelectedBlock(event.target.value);
        setPlotNoFilter('');
        setStatusFilter('');
        setPlots([]);
        setFilteredPlots([]);
        setSelectedPlot(null);
    };

    // Handle plot selection
    const handlePlotSelect = (plot) => {
        setSelectedPlot(plot);
        setNewStatus(plot.status);
    };

    // Show notification
    const handleNotification = (message, severity = 'success') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    // Close notification
    const handleCloseNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    // Open status change dialog
    const handleOpenStatusDialog = (plot = null) => {
        const plotToUse = plot || selectedPlot;
        
        if (!plotToUse) {
            handleNotification('Please select a plot first', 'info');
            return;
        }

        // If a plot is passed directly, update the selected plot
        if (plot && plot !== selectedPlot) {
            setSelectedPlot(plot);
            setNewStatus(plot.status);
        } else {
            setNewStatus(selectedPlot.status);
        }

        setStatusDialog(true);
    };

    // Close status change dialog
    const handleCloseStatusDialog = () => {
        setStatusDialog(false);
    };

    // Handle status change
    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    // Update plot status 
    const handleUpdateStatus = async () => {
        if (!selectedPlot || !newStatus) return;

        setSubmitLoading(true);

        try {
            const manipulationData = {
                manipulationId: crypto.randomUUID(),
                projectId: selectedPlot.projectId,
                blockId: selectedPlot.blockId,
                addPlotId: selectedPlot.addPlotId,
                status: newStatus,
                updateDate: new Date().toISOString().split('T')[0],
                projectName: selectedPlot.projectName,
                plotNo: selectedPlot.plotNo,
                plotSize: selectedPlot.plotArea
            };

            const response = await axiosInstance.put(
                '/realEstate/plotDetail/updatePlotStatus',
                manipulationData
            );

            if (response.data.status === 200) {
                // Update plot status in the local state
                const updatedPlots = plots.map(plot =>
                    plot.addPlotId === selectedPlot.addPlotId
                        ? { ...plot, status: newStatus }
                        : plot
                );

                setPlots(updatedPlots);
                
                // Update selected plot
                setSelectedPlot(prev => ({ ...prev, status: newStatus }));
                
                handleNotification('Plot status updated successfully');
                handleCloseStatusDialog();
            } else {
                handleNotification('Failed to update plot status', 'error');
            }
        } catch (error) {
            console.error('Error updating plot status:', error);
            handleNotification('Error updating plot status', 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    // Reset form
    const handleReset = () => {
        setSelectedProject('');
        setSelectedBlock('');
        setPlotNoFilter('');
        setStatusFilter('');
        setBlocks([]);
        setPlots([]);
        setFilteredPlots([]);
        setSelectedPlot(null);
    };

    // Print current view
    const handlePrint = () => {
        window.print();
    };

    // Get color for status chip
    const getStatusColor = (status) => {
        switch (status) {
            case 'Available':
                return { bg: '#D1E9FC', color: '#1565C0' }; // Light Blue
            case 'Booked':
                return { bg: '#FFE0B2', color: '#FF8F00' }; // Light Orange/Amber
            case 'Sold':
                return { bg: '#C8E6C9', color: '#2E7D32' }; // Light Green 
            case 'Reserved':
                return { bg: '#E1BEE7', color: '#6A1B9A' }; // Light Purple
            default:
                return { bg: '#F5F5F5', color: '#616161' }; // Light Grey
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Search Form Section */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="h6" fontWeight="bold" mb={3} color="primary">
                    Project Manipulation
                </Typography>

                <Grid container spacing={2}>
                    {/* Project Selection */}
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small" disabled={projectsLoading}>
                            <InputLabel>Project</InputLabel>
                            <Select
                                value={selectedProject}
                                onChange={handleProjectChange}
                                label="Project"
                            >
                                <MenuItem value="">Select Project</MenuItem>
                                {projects.map((project) => (
                                    <MenuItem key={project.projectId} value={project.projectId}>
                                        {project.siteName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {projectsLoading && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <CircularProgress size={16} sx={{ mr: 1 }} />
                                    <Typography variant="caption" color="text.secondary">
                                        Loading projects...
                                    </Typography>
                                </Box>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Block Selection */}
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small" disabled={!selectedProject || blocksLoading}>
                            <InputLabel>Block</InputLabel>
                            <Select
                                value={selectedBlock}
                                onChange={handleBlockChange}
                                label="Block"
                            >
                                <MenuItem value="">Select Block</MenuItem>
                                {blocks.map((block) => (
                                    <MenuItem key={block.blockId} value={block.blockId}>
                                        {block.block}
                                    </MenuItem>
                                ))}
                            </Select>
                            {blocksLoading && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <CircularProgress size={16} sx={{ mr: 1 }} />
                                    <Typography variant="caption" color="text.secondary">
                                        Loading blocks...
                                    </Typography>
                                </Box>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Plot Number Filter */}
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Plot Number"
                            value={plotNoFilter}
                            onChange={(e) => setPlotNoFilter(e.target.value)}
                            disabled={!selectedProject || !selectedBlock || plots.length === 0}
                        />
                    </Grid>

                    {/* Status Filter */}
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small" disabled={!selectedProject || !selectedBlock || plots.length === 0}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="">All Statuses</MenuItem>
                                {statusOptions.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Selected Plot Info & Status */}
                {selectedPlot && (
                    <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                            Selected Plot
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body2" color="text.secondary">
                                    Project: <Typography component="span" variant="body2" fontWeight="500">{selectedPlot.projectName}</Typography>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Plot No: <Typography component="span" variant="body2" fontWeight="500">{selectedPlot.plotNo}</Typography>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Size: <Typography component="span" variant="body2" fontWeight="500">{selectedPlot.plotArea}</Typography>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body2" color="text.secondary">
                                    Current Status: 
                                    <Chip
                                        label={selectedPlot.status}
                                        size="small"
                                        sx={{
                                            ml: 1,
                                            backgroundColor: getStatusColor(selectedPlot.status).bg,
                                            color: getStatusColor(selectedPlot.status).color,
                                            fontWeight: 500
                                        }}
                                    />
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Action Buttons */}
                <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenStatusDialog()}
                        disabled={!selectedPlot || submitLoading}
                        sx={{ 
                            bgcolor: '#6B66FF',
                            '&:hover': { 
                                bgcolor: '#5652e5',
                            }
                        }}
                    >
                        Change Status
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SearchIcon />}
                        onClick={fetchPlotsByProjectAndBlock}
                        disabled={!selectedProject || !selectedBlock || plotsLoading}
                        sx={{ 
                            bgcolor: '#6B66FF',
                            '&:hover': { 
                                bgcolor: '#5652e5',
                            }
                        }}
                    >
                        Search Plots
                    </Button>

                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleReset}
                        disabled={plotsLoading || submitLoading}
                        sx={{ 
                            borderColor: '#6B66FF',
                            color: '#6B66FF',
                            '&:hover': { 
                                borderColor: '#5652e5',
                                backgroundColor: 'rgba(107, 102, 255, 0.04)'
                            }
                        }}
                    >
                        Reset
                    </Button>

                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        disabled={filteredPlots.length === 0}
                        sx={{ 
                            ml: { xs: 0, md: 'auto' },
                            borderColor: '#6B66FF',
                            color: '#6B66FF',
                            '&:hover': { 
                                borderColor: '#5652e5',
                                backgroundColor: 'rgba(107, 102, 255, 0.04)'
                            }
                        }}
                    >
                        Print
                    </Button>
                </Box>
            </Paper>

            {/* Status Change Dialog */}
            <Dialog open={statusDialog} onClose={handleCloseStatusDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ pb: 1 }}>
                    Change Plot Status
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseStatusDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedPlot && (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Plot Details
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Project: {selectedPlot.projectName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Plot No: {selectedPlot.plotNo}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Size: {selectedPlot.plotArea}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="status-change-label">New Status</InputLabel>
                                <Select
                                    labelId="status-change-label"
                                    value={newStatus}
                                    onChange={handleStatusChange}
                                    label="New Status"
                                >
                                    {statusOptions.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                                Current Status: 
                                <Chip
                                    label={selectedPlot.status}
                                    size="small"
                                    sx={{
                                        ml: 1,
                                        backgroundColor: getStatusColor(selectedPlot.status).bg,
                                        color: getStatusColor(selectedPlot.status).color,
                                        fontWeight: 500
                                    }}
                                />
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleCloseStatusDialog}
                        sx={{ color: '#5652e5' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleUpdateStatus}
                        disabled={submitLoading || !newStatus || newStatus === selectedPlot?.status}
                        sx={{ 
                            bgcolor: '#6B66FF',
                            '&:hover': { 
                                bgcolor: '#5652e5',
                            }
                        }}
                    >
                        {submitLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Status'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Plot Details Table */}
            {(plotsLoading || filteredPlots.length > 0) && (
                <Paper elevation={0} sx={{ mt: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box sx={{ 
                        p: 2, 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #e0e0e0'
                    }}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            Plot Details
                        </Typography>
                        
                        {filteredPlots.length > 0 && (
                            <Typography variant="body2" color="text.secondary">
                                Showing {filteredPlots.length} plots
                            </Typography>
                        )}
                    </Box>
                    
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#DAE1F3' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Sr.No</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Plot No.</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Plot Size</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Update Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {plotsLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                            <CircularProgress size={40} sx={{ color: '#6B66FF' }} />
                                            <Typography variant="body2" sx={{ mt: 2 }}>
                                                Loading plots...
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredPlots.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                            <Typography variant="body1">
                                                No plots found for the selected criteria.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPlots.map((plot, index) => (
                                        <TableRow 
                                            key={plot.addPlotId}
                                            sx={{ 
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                bgcolor: selectedPlot?.addPlotId === plot.addPlotId ? 'rgba(107, 102, 255, 0.04)' : 'inherit',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handlePlotSelect(plot)}
                                            hover
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{plot.projectName}</TableCell>
                                            <TableCell>{plot.plotNo}</TableCell>
                                            <TableCell>{plot.plotArea}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={plot.status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: getStatusColor(plot.status).bg,
                                                        color: getStatusColor(plot.status).color,
                                                        fontWeight: 500
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Date().toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ 
                                                        borderColor: '#6B66FF',
                                                        color: '#6B66FF',
                                                        '&:hover': { 
                                                            borderColor: '#5652e5',
                                                            backgroundColor: 'rgba(107, 102, 255, 0.04)'
                                                        }
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenStatusDialog(plot);
                                                    }}
                                                >
                                                    Change
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Notification Snackbar */}
            <Snackbar 
                open={notification.open} 
                autoHideDuration={6000} 
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProjectManipulation;