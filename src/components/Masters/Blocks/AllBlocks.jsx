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
    IconButton,
    Tooltip,
    CircularProgress,
    Button,
    TextField,
    InputAdornment,
    Snackbar,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AddBlock from './AddBlocks';
import axiosInstance from '../../../axiosInstance';

const AllBlocks = () => {
    const [blocks, setBlocks] = useState([]);
    const [filteredBlocks, setFilteredBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetchBlocks();
    }, []);

    const fetchBlocks = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/realEstate/Block/getAllBlock');
            if (response.data.status === 200 && Array.isArray(response.data.data)) {
                setBlocks(response.data.data);
                setFilteredBlocks(response.data.data);
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to load blocks. Please try again.';
            handleNotification(errorMessage, 'error');
            console.error('Error fetching blocks:', error);
            setBlocks([]);
            setFilteredBlocks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredBlocks(blocks);
        } else {
            const lowercasedFilter = searchTerm.toLowerCase();
            const filtered = blocks.filter(item => {
                return (
                    item.block.toLowerCase().includes(lowercasedFilter) ||
                    item.projectName.toLowerCase().includes(lowercasedFilter)
                );
            });
            setFilteredBlocks(filtered);
        }
    }, [searchTerm, blocks]);

    const handleNotification = (message, severity = 'success') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    const handleEditBlock = (block) => {
        setCurrentBlock(block);
        setEditDialogOpen(true);
    };

    const handleAddBlock = () => {
        setCurrentBlock(null);
        setAddDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setCurrentBlock(null);
    };

    const handleCloseAddDialog = () => {
        setAddDialogOpen(false);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                mb: 3,
                gap: 2
            }}>
                <Typography variant="h5" component="h1" fontWeight="bold">
                    All Blocks
                </Typography>
                
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    <TextField
                        placeholder="Search blocks..."
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
                        onClick={handleAddBlock}
                        sx={{ 
                            bgcolor: '#6B66FF',
                            '&:hover': { bgcolor: '#5652e5' }
                        }}
                    >
                        Add Block
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
                            <TableCell sx={{ fontWeight: 600 }}>Block Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Project Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={40} />
                                    <Typography variant="body2" sx={{ mt: 2 }}>
                                        Loading blocks...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredBlocks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1">
                                        No blocks found. {searchTerm && "Try adjusting your search criteria."}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBlocks.map((block) => (
                                <TableRow
                                    key={block.blockId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell sx={{ fontWeight: 500 }}>{block.block}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{block.projectName}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="Edit Block">
                                                <IconButton 
                                                    size="small" 
                                                    sx={{ color: '#6B66FF' }}
                                                    onClick={() => handleEditBlock(block)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <AddBlock
                open={addDialogOpen}
                onClose={handleCloseAddDialog}
                mode="add"
                onSuccess={handleNotification}
                refetchBlocks={fetchBlocks}
            />

            <AddBlock
                open={editDialogOpen}
                onClose={handleCloseEditDialog}
                mode="edit"
                currentBlock={currentBlock}
                onSuccess={handleNotification}
                refetchBlocks={fetchBlocks}
            />

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

export default AllBlocks;