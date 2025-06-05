// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Checkbox,
//     Typography,
//     IconButton,
//     Tooltip,
//     CircularProgress,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle,
//     TextField,
//     InputAdornment,
//     Chip,
//     Snackbar,
//     Alert,
//     Container
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SearchIcon from '@mui/icons-material/Search';
// import AddIcon from '@mui/icons-material/Add';
// import axiosInstance from 'axiosInstance';
// import AddPlotDetail from './AddPlotDetails';
// const statusColorMap = {
//     'AVAILABLE': { bgcolor: '#e3f2fd', color: '#1976d2' },
//     'BOOKED': { bgcolor: '#fff8e1', color: '#f57c00' },
//     'SOLD': { bgcolor: '#e8f5e9', color: '#388e3c' },
//     'RESERVED': { bgcolor: '#f3e5f5', color: '#7b1fa2' }
// };

// const AllPlotDetails = () => {
//     // State variables
//     const [plots, setPlots] = useState([]);
//     const [filteredPlots, setFilteredPlots] = useState([]);
//     const [selectedPlots, setSelectedPlots] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//     const [addDialogOpen, setAddDialogOpen] = useState(false);
//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [currentPlot, setCurrentPlot] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const [notification, setNotification] = useState({
//         open: false,
//         message: '',
//         severity: 'success'
//     });

//     // Fetch plots data
//     useEffect(() => {
//         fetchPlots();
//     }, []);

//     const fetchPlots = async () => {
//         setLoading(true);
//         try {
//             // Replace with your actual API endpoint for fetching plot details
//             const response = await axiosInstance.get('/realEstate/plotDetail/getAll');
//             if (response.data && Array.isArray(response.data.data)) {
//                 setPlots(response.data.data);
//                 setFilteredPlots(response.data.data);
//             } else {
//                 console.error('Invalid response format:', response.data);
//                 setPlots([]);
//                 setFilteredPlots([]);
//             }
//         } catch (error) {
//             console.error('Error fetching plots:', error);
//             setPlots([]);
//             setFilteredPlots([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle search input change
//     useEffect(() => {
//         if (!searchTerm.trim()) {
//             setFilteredPlots(plots);
//         } else {
//             const lowercasedFilter = searchTerm.toLowerCase();
//             const filtered = plots.filter(item => {
//                 return (
//                     (item.plotNo && item.plotNo.toLowerCase().includes(lowercasedFilter)) ||
//                     (item.projectName && item.projectName.toLowerCase().includes(lowercasedFilter)) ||
//                     (item.block && item.block.toLowerCase().includes(lowercasedFilter)) ||
//                     (item.location && item.location.toLowerCase().includes(lowercasedFilter))
//                 );
//             });
//             setFilteredPlots(filtered);
//         }
//     }, [searchTerm, plots]);

//     // Handler for checkbox selection
//     const handleSelectPlot = (event, plotId) => {
//         if (event.target.checked) {
//             setSelectedPlots([...selectedPlots, plotId]);
//         } else {
//             setSelectedPlots(selectedPlots.filter(id => id !== plotId));
//         }
//     };

//     // Handler for select all checkbox
//     const handleSelectAll = (event) => {
//         if (event.target.checked) {
//             setSelectedPlots(filteredPlots.map(plot => plot.addPlotId));
//         } else {
//             setSelectedPlots([]);
//         }
//     };

//     // Handle notifications
//     const handleNotification = (message, severity = 'success') => {
//         setNotification({
//             open: true,
//             message,
//             severity
//         });
//     };

//     // Close notification
//     const handleCloseNotification = () => {
//         setNotification(prev => ({
//             ...prev,
//             open: false
//         }));
//     };

//     // Handler for opening the add dialog
//     const handleAddPlot = () => {
//         setCurrentPlot(null);
//         setAddDialogOpen(true);
//     };

//     // Handler for opening the edit dialog
//     const handleEditPlot = (plot) => {
//         setCurrentPlot(plot);
//         setEditDialogOpen(true);
//     };

//     // Handler for opening delete confirmation
//     const handleDeletePlot = (plotId) => {
//         setCurrentPlot({ addPlotId: plotId });
//         setDeleteDialogOpen(true);
//     };

//     // Handler for closing delete dialog
//     const handleCloseDeleteDialog = () => {
//         setDeleteDialogOpen(false);
//         setCurrentPlot(null);
//     };

//     // Handler for confirming deletion
//     const handleConfirmDelete = async () => {
//         if (!currentPlot || !currentPlot.addPlotId) return;

//         setIsSubmitting(true);
//         try {
//             // API call to delete plot
//             const response = await axiosInstance.delete(
//                 `/realEstate/plotDetail/delete/${currentPlot.addPlotId}`
//             );

//             if (response.data && (response.data.status === 200 || response.data.status === 202)) {
//                 // Update local state
//                 const updatedPlots = plots.filter(p => p.addPlotId !== currentPlot.addPlotId);
//                 setPlots(updatedPlots);
//                 setFilteredPlots(filteredPlots.filter(p => p.addPlotId !== currentPlot.addPlotId));

//                 // Remove from selected plots if present
//                 setSelectedPlots(selectedPlots.filter(id => id !== currentPlot.addPlotId));

//                 // Show success message
//                 handleNotification('Plot deleted successfully');
//             } else {
//                 handleNotification(response.data?.message || 'Failed to delete plot', 'error');
//             }
//         } catch (error) {
//             console.error('Error deleting plot:', error);
//             handleNotification('Error deleting plot. Please try again.', 'error');
//         } finally {
//             setIsSubmitting(false);
//             setDeleteDialogOpen(false);
//             setCurrentPlot(null);
//         }
//     };

//     // Handle bulk delete
//     const handleBulkDelete = async () => {
//         if (selectedPlots.length === 0) return;

//         setIsSubmitting(true);
//         try {
//             let successCount = 0;
//             let failCount = 0;

//             // Delete each selected plot
//             for (const plotId of selectedPlots) {
//                 try {
//                     const response = await axiosInstance.delete(
//                         `/realEstate/plotDetail/delete/${plotId}`
//                     );

//                     if (response.data && (response.data.status === 200 || response.data.status === 202)) {
//                         successCount++;
//                     } else {
//                         failCount++;
//                     }
//                 } catch (error) {
//                     failCount++;
//                     console.error(`Error deleting plot ${plotId}:`, error);
//                 }
//             }

//             // Update local state
//             const updatedPlots = plots.filter(p => !selectedPlots.includes(p.addPlotId));
//             setPlots(updatedPlots);
//             setFilteredPlots(filteredPlots.filter(p => !selectedPlots.includes(p.addPlotId)));

//             // Clear selection
//             setSelectedPlots([]);

//             // Show success/error message
//             if (failCount === 0) {
//                 handleNotification(`Successfully deleted ${successCount} plots`);
//             } else if (successCount === 0) {
//                 handleNotification(`Failed to delete ${failCount} plots`, 'error');
//             } else {
//                 handleNotification(`Successfully deleted ${successCount} plots, failed to delete ${failCount} plots`, 'warning');
//             }
//         } catch (error) {
//             console.error('Error in bulk deletion:', error);
//             handleNotification('Error performing bulk deletion. Please try again.', 'error');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <Container maxWidth='lg' sx={{ px: 4, py: 4 }}>
//             <Box sx={{ width: '100%' }}>
//                 {/* Header with title, search and actions */}
//                 <Box sx={{
//                     display: 'flex',
//                     flexDirection: { xs: 'column', sm: 'row' },
//                     justifyContent: 'space-between',
//                     alignItems: { xs: 'flex-start', sm: 'center' },
//                     mb: 3,
//                     gap: 2
//                 }}>
//                     <Typography variant="h5" component="h1" fontWeight="bold">
//                         Plot Details
//                     </Typography>

//                     <Box sx={{
//                         display: 'flex',
//                         flexDirection: { xs: 'column', sm: 'row' },
//                         gap: 2,
//                         width: { xs: '100%', sm: 'auto' }
//                     }}>
//                         <TextField
//                             placeholder="Search plots..."
//                             size="small"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <SearchIcon fontSize="small" />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             sx={{ width: { xs: '100%', sm: 220 } }}
//                         />

//                         <Button
//                             variant="contained"
//                             startIcon={<AddIcon />}
//                             onClick={handleAddPlot}
//                             sx={{
//                                 bgcolor: '#6B66FF',
//                                 '&:hover': { bgcolor: '#5652e5' }
//                             }}
//                         >
//                             Add Plot
//                         </Button>

//                         {selectedPlots.length > 0 && (
//                             <Button
//                                 variant="outlined"
//                                 color="error"
//                                 onClick={handleBulkDelete}
//                                 disabled={isSubmitting}
//                             >
//                                 Delete Selected ({selectedPlots.length})
//                             </Button>
//                         )}
//                     </Box>
//                 </Box>

//                 {/* Plots Table */}
//                 <TableContainer
//                     component={Paper}
//                     elevation={0}
//                     sx={{
//                         overflowX: 'auto',
//                         border: '1px solid #e0e0e0'
//                     }}
//                 >
//                     <Table sx={{ minWidth: 650 }}>
//                         <TableHead sx={{ backgroundColor: '#DAE1F3' }}>
//                             <TableRow>
//                                 {/* <TableCell padding="checkbox">
//                                     <Checkbox
//                                         color="primary"
//                                         indeterminate={selectedPlots.length > 0 && selectedPlots.length < filteredPlots.length}
//                                         checked={filteredPlots.length > 0 && selectedPlots.length === filteredPlots.length}
//                                         onChange={handleSelectAll}
//                                         disabled={loading}
//                                     />
//                                 </TableCell> */}
//                                 <TableCell sx={{ fontWeight: 600 }}>Plot No</TableCell>
//                                 <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
//                                 <TableCell sx={{ fontWeight: 600 }}>Block</TableCell>
//                                 <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
//                                 <TableCell sx={{ fontWeight: 600 }}>Plot Area</TableCell>
//                                 <TableCell sx={{ fontWeight: 600 }}>Rate</TableCell>
//                                 <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//                                 {/* <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell> */}
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {loading ? (
//                                 <TableRow>
//                                     <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
//                                         <CircularProgress size={40} />
//                                         <Typography variant="body2" sx={{ mt: 2 }}>
//                                             Loading plots...
//                                         </Typography>
//                                     </TableCell>
//                                 </TableRow>
//                             ) : filteredPlots.length === 0 ? (
//                                 <TableRow>
//                                     <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
//                                         <Typography variant="body1">
//                                             No plots found. {searchTerm && "Try adjusting your search criteria."}
//                                         </Typography>
//                                     </TableCell>
//                                 </TableRow>
//                             ) : (
//                                 filteredPlots.map((plot) => (
//                                     <TableRow
//                                         key={plot.addPlotId || plot.id}
//                                         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                                     >
//                                         {/* <TableCell padding="checkbox">
//                                             <Checkbox
//                                                 color="primary"
//                                                 checked={selectedPlots.includes(plot.addPlotId || plot.id)}
//                                                 onChange={(event) => handleSelectPlot(event, plot.addPlotId || plot.id)}
//                                             />
//                                         </TableCell> */}
//                                         <TableCell sx={{ fontWeight: 500 }}>{plot.plotNo}</TableCell>
//                                         <TableCell>{plot.projectName}</TableCell>
//                                         <TableCell>{plot.block}</TableCell>
//                                         <TableCell>{plot.location}</TableCell>
//                                         <TableCell>{plot.plotArea}</TableCell>
//                                         <TableCell>₹{Number(plot.plotRate).toLocaleString()}</TableCell>
//                                         <TableCell>
//                                             <Chip
//                                                 label={plot.status || 'AVAILABLE'}
//                                                 size="small"
//                                                 sx={{
//                                                     bgcolor: statusColorMap[plot.status || 'AVAILABLE']?.bgcolor || '#e0e0e0',
//                                                     color: statusColorMap[plot.status || 'AVAILABLE']?.color || '#616161',
//                                                     fontWeight: 500
//                                                 }}
//                                             />
//                                         </TableCell>
//                                         {/* <TableCell>
//                                             <Box sx={{ display: 'flex', gap: 1 }}>
//                                                 <Tooltip title="Edit Plot">
//                                                     <IconButton
//                                                         size="small"
//                                                         sx={{ color: '#6B66FF' }}
//                                                         onClick={() => handleEditPlot(plot)}
//                                                     >
//                                                         <EditIcon fontSize="small" />
//                                                     </IconButton>
//                                                 </Tooltip>
//                                                 <Tooltip title="Delete Plot">
//                                                     <IconButton
//                                                         size="small"
//                                                         color="error"
//                                                         onClick={() => handleDeletePlot(plot.addPlotId || plot.id)}
//                                                     >
//                                                         <DeleteIcon fontSize="small" />
//                                                     </IconButton>
//                                                 </Tooltip>
//                                             </Box>
//                                         </TableCell> */}
//                                     </TableRow>
//                                 ))
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>

//                 {/* Add/Edit Plot Dialogs */}
//                 <AddPlotDetail
//                     open={addDialogOpen}
//                     onClose={() => setAddDialogOpen(false)}
//                     mode="add"
//                     onSuccess={handleNotification}
//                     refetchPlots={fetchPlots}
//                 />

//                 <AddPlotDetail
//                     open={editDialogOpen}
//                     onClose={() => setEditDialogOpen(false)}
//                     mode="edit"
//                     currentPlot={currentPlot}
//                     onSuccess={handleNotification}
//                     refetchPlots={fetchPlots}
//                 />

//                 {/* Delete Confirmation Dialog */}
//                 <Dialog
//                     open={deleteDialogOpen}
//                     onClose={handleCloseDeleteDialog}
//                 >
//                     <DialogTitle>
//                         Confirm Deletion
//                     </DialogTitle>
//                     <DialogContent>
//                         <DialogContentText>
//                             Are you sure you want to delete this plot? This action cannot be undone.
//                         </DialogContentText>
//                     </DialogContent>
//                     <DialogActions sx={{ px: 3, py: 2 }}>
//                         <Button
//                             onClick={handleCloseDeleteDialog}
//                             variant="outlined"
//                             disabled={isSubmitting}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             onClick={handleConfirmDelete}
//                             variant="contained"
//                             color="error"
//                             disabled={isSubmitting}
//                             startIcon={isSubmitting && <CircularProgress size={20} />}
//                         >
//                             {isSubmitting ? 'Deleting...' : 'Delete'}
//                         </Button>
//                     </DialogActions>
//                 </Dialog>

//                 {/* Notification Snackbar */}
//                 <Snackbar
//                     open={notification.open}
//                     autoHideDuration={6000}
//                     onClose={handleCloseNotification}
//                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                 >
//                     <Alert
//                         onClose={handleCloseNotification}
//                         severity={notification.severity}
//                         variant="filled"
//                         sx={{ width: '100%' }}
//                     >
//                         {notification.message}
//                     </Alert>
//                 </Snackbar>
//             </Box>
//         </Container>
//     );
// };

// export default AllPlotDetails;


import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
    Button,
    TextField,
    InputAdornment,
    Chip,
    Snackbar,
    Alert,
    Container,
    TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AddPlotDetail from './AddPlotDetails';
import axiosInstance from '../../../axiosInstance';

const statusColorMap = {
    'Available': { bgcolor: '#e3f2fd', color: '#1976d2' },
    'Booked': { bgcolor: '#fff8e1', color: '#f57c00' },
    'Sold': { bgcolor: '#e8f5e9', color: '#388e3c' },
    'Reserved': { bgcolor: '#f3e5f5', color: '#7b1fa2' }
};

const AllPlotDetails = () => {
    // State variables
    const [plots, setPlots] = useState([]);
    const [filteredPlots, setFilteredPlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentPlot, setCurrentPlot] = useState(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Fetch plots data
    useEffect(() => {
        fetchPlots();
    }, []);

    const fetchPlots = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/realEstate/plotDetail/getAll');
            if (response.data && Array.isArray(response.data.data)) {
                setPlots(response.data.data);
                setFilteredPlots(response.data.data);
            } else {
                console.error('Invalid response format:', response.data);
                setPlots([]);
                setFilteredPlots([]);
            }
        } catch (error) {
            console.error('Error fetching plots:', error);
            setPlots([]);
            setFilteredPlots([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle search input change
    useEffect(() => {
        // Reset page to 0 when search term changes
        setPage(0);

        if (!searchTerm.trim()) {
            setFilteredPlots(plots);
        } else {
            const lowercasedFilter = searchTerm.toLowerCase();
            const filtered = plots.filter(item => {
                return (
                    (item.plotNo && item.plotNo.toLowerCase().includes(lowercasedFilter)) ||
                    (item.projectName && item.projectName.toLowerCase().includes(lowercasedFilter)) ||
                    (item.block && item.block.toLowerCase().includes(lowercasedFilter)) ||
                    (item.location && item.location.toLowerCase().includes(lowercasedFilter))
                );
            });
            setFilteredPlots(filtered);
        }
    }, [searchTerm, plots]);

    // Pagination change handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handler for opening the add dialog
    const handleAddPlot = () => {
        setCurrentPlot(null);
        setAddDialogOpen(true);
    };

    // Handler for opening the edit dialog
    const handleEditPlot = (plot) => {
        setCurrentPlot(plot);
        setEditDialogOpen(true);
    };

    // Handle notifications
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

    // Slice plots for pagination
    const paginatedPlots = filteredPlots.slice(
        page * rowsPerPage, 
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Container maxWidth='lg' sx={{ px: 4, py: 4 }}>
            <Box sx={{ width: '100%' }}>
                {/* Header with title, search and actions */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 3,
                    gap: 2
                }}>
                    <Typography variant="h5" component="h1" fontWeight="bold">
                        Plot Details
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        width: { xs: '100%', sm: 'auto' }
                    }}>
                        <TextField
                            placeholder="Search plots..."
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                            onClick={handleAddPlot}
                            sx={{
                                bgcolor: '#6B66FF',
                                '&:hover': { bgcolor: '#5652e5' }
                            }}
                        >
                            Add Plot
                        </Button>
                    </Box>
                </Box>

                {/* Plots Table */}
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
                                <TableCell sx={{ fontWeight: 600 }}>Plot No</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Block</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Plot Area</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Rate</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                {/* <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                        <CircularProgress size={40} />
                                        <Typography variant="body2" sx={{ mt: 2 }}>
                                            Loading plots...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredPlots.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body1">
                                            No plots found. {searchTerm && "Try adjusting your search criteria."}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedPlots.map((plot) => (
                                    <TableRow
                                        key={plot.addPlotId || plot.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>{plot.plotNo}</TableCell>
                                        <TableCell>{plot.projectName}</TableCell>
                                        <TableCell>{plot.block}</TableCell>
                                        <TableCell>{plot.location}</TableCell>
                                        <TableCell>{plot.plotArea}</TableCell>
                                        <TableCell>₹{Number(plot.plotRate).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={plot.status || 'Available'}
                                                size="small"
                                                sx={{
                                                    bgcolor: statusColorMap[plot.status || 'Available']?.bgcolor || '#e0e0e0',
                                                    color: statusColorMap[plot.status || 'Available']?.color || '#616161',
                                                    fontWeight: 500
                                                }}
                                            />
                                        </TableCell>
                                        {/* <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button 
                                                    size="small" 
                                                    variant="outlined" 
                                                    color="primary"
                                                    onClick={() => handleEditPlot(plot)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    size="small" 
                                                    variant="outlined" 
                                                    color="error"
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </TableCell> */}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    
                    {/* Pagination */}
                    {!loading && filteredPlots.length > 0 && (
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredPlots.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    )}
                </TableContainer>

                {/* Add Plot Dialog */}
                <AddPlotDetail
                    open={addDialogOpen}
                    onClose={() => setAddDialogOpen(false)}
                    mode="add"
                    onSuccess={handleNotification}
                    refetchPlots={fetchPlots}
                />

                {/* Edit Plot Dialog */}
                <AddPlotDetail
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    mode="edit"
                    currentPlot={currentPlot}
                    onSuccess={handleNotification}
                    refetchPlots={fetchPlots}
                />

                {/* Notification Snackbar */}
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
        </Container>
    );
};

export default AllPlotDetails;