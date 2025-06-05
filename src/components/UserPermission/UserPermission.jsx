import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Container,
  alpha,
  Stack,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearIcon from '@mui/icons-material/Clear';
import SecurityIcon from '@mui/icons-material/Security';
import axiosInstance from '../../axiosInstance';

const RolePermissionsManagement = () => {
  // Colors from the login page
  const primaryBlue = '#0B2447';
  const secondaryBlue = '#19376D';
  const accentBlue = '#576CBC';
  const highlightBlue = '#5D9CEC';
  const bgColor = '#F8F9FD';
  const formBg = '#FFFFFF';
  const textDark = '#1E293B';
  const textLight = '#FFFFFF';

  const mockRoles = [
    { name: 'COMPANY' },
    { name: 'ADMIN' },
    { name: 'CUSTOMER' },
    { name: 'ASSOCIATE' }
  ];

  const mockPermissionCategories = [
    {
      category: 'Dashboard',
      permissions: ['Overview']
    },
    {
      category: 'Masters',
      permissions: ['All Project', 'All Block', 'All Plot Types', 'Plc/Devlopment Rate', 'All Ranks', 'Plot Details', 'Project Manipulation']
    },
    {
      category: 'Plot Management',
      permissions: ['Plot Booking', 'All Bookings']
    },
    {
      category: 'Associate',
      permissions: ['Add Associate', 'Associate Tree', 'Associate Details']
    },
    {
      category: 'Customer',
      permissions: ['Add Customer', 'Customer Details']
    },
    {
      category: 'Payment',
      permissions: ['One Time Payment', 'All One Time Payment', 'EMI Plan', 'EMI Payment', 'All EMI Payment','Cheque Clearence']
    },
    {
      category: 'Manage Lead',
      permissions: ['Sources', 'Lead Types', 'All Leads', 'All Enquiry', 'Assign Enquiry', 'All Assign Enquiry']
    },
    {
      category: 'Manage Land',
      permissions: ['Add Broker', 'Add Farmer', 'Purchase Land', 'Add Payment']
    },
    {
      category: 'Reports',
      permissions: ['Pending EMI', 'Downline Tree', 'Monthly EMI', 'EMI Book Plot', 'Bounce Cheque', 'Full Plot Booking']
    },
    {
      category: 'Permission',
      permissions: ['User Permission']
    },
  ];

  // State
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedRoleData, setSelectedRoleData] = useState({
    id: '',
    role: '',
    permissions: {},
    active: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [filteredCategories, setFilteredCategories] = useState(mockPermissionCategories);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const initialExpanded = {};
    mockPermissionCategories.forEach(category => {
      initialExpanded[category.category] = true;
    });
    setExpandedCategories(initialExpanded);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(mockPermissionCategories);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = mockPermissionCategories.filter(category => {
        if (category.category.toLowerCase().includes(lowercasedFilter)) {
          return true;
        }
        return category.permissions.some(permission =>
          permission.toLowerCase().includes(lowercasedFilter)
        );
      });
      setFilteredCategories(filtered);
    }
  }, [searchTerm]);

  const refreshSidebar = () => {
    setRefreshing(true);
    try {
    const currentRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
      const storage = localStorage.getItem('userRole') ? localStorage : sessionStorage;

      if (currentRole) {
        const tempRole = currentRole;
        storage.removeItem('userRole');

      setTimeout(() => {
          storage.setItem('userRole', tempRole);
        const event = new CustomEvent('roleChange', {
          detail: { role: tempRole, timestamp: Date.now() }
        });
        window.dispatchEvent(event);

        setRefreshing(false);
        setDialogOpen(false);

        setNotification({
          open: true,
          message: 'Sidebar refreshed with updated permissions',
          severity: 'success'
        });
      }, 100);
    } else {
        throw new Error('No active user role found in storage');
      }
    } catch (error) {
      setRefreshing(false);
      setDialogOpen(false);
      setNotification({
        open: true,
        message: error.message || 'Failed to refresh sidebar',
        severity: 'error'
      });
    }
  };

  const handleRefreshSidebar = () => {
    refreshSidebar();
  };

  const fetchRolePermissions = async (roleName) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/realEstate/user-permission/getPermissionByRoleName?roleName=${roleName}`);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch role permissions');
      }

      if (!response.data.data || !response.data.data.length) {
        setSelectedRoleData({
          id: '',
          role: roleName,
          permissions: {},
          active: true
        });
        setSelectedPermissions({});
        return;
      }

      const roleData = response.data.data[0];
        setSelectedRoleData({
          id: roleData.permissionId,
          role: roleData.roleName,
          permissions: roleData.permissions,
          active: roleData.active
        });

        const formattedPermissions = {};
        Object.keys(roleData.permissions).forEach(category => {
          roleData.permissions[category].forEach(permission => {
            formattedPermissions[`${category}-${permission}`] = true;
          });
        });

        setSelectedPermissions(formattedPermissions);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to fetch role permissions',
        severity: 'error'
      });
      setSelectedPermissions({});
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (event) => {
    const roleName = event.target.value;
    setSelectedRole(roleName);

    if (roleName) {
      setSelectedRoleData({
        id: '',
        role: roleName,
        permissions: {},
        active: true
      });
      fetchRolePermissions(roleName);
    } else {
      setSelectedRoleData({
        id: '',
        role: '',
        permissions: {},
        active: true
      });
      setSelectedPermissions({});
    }
  };

  const handlePermissionToggle = (category, permission) => {
    const key = `${category}-${permission}`;
    setSelectedPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isPermissionSelected = (category, permission) => {
    const key = `${category}-${permission}`;
    return !!selectedPermissions[key];
  };

  const handleCategoryToggle = (category) => {
    const categoryPermissions = mockPermissionCategories.find(c => c.category === category)?.permissions || [];
    const newSelectedPermissions = { ...selectedPermissions };

    const allSelected = categoryPermissions.every(permission =>
      isPermissionSelected(category, permission)
    );

    categoryPermissions.forEach(permission => {
      const key = `${category}-${permission}`;
      newSelectedPermissions[key] = !allSelected;
    });

    setSelectedPermissions(newSelectedPermissions);
  };

  const isCategoryFullySelected = (category) => {
    const categoryPermissions = mockPermissionCategories.find(c => c.category === category)?.permissions || [];
    return categoryPermissions.length > 0 && categoryPermissions.every(permission =>
      isPermissionSelected(category, permission)
    );
  };

  const isCategoryPartiallySelected = (category) => {
    const categoryPermissions = mockPermissionCategories.find(c => c.category === category)?.permissions || [];
    const selectedCount = categoryPermissions.filter(permission =>
      isPermissionSelected(category, permission)
    ).length;

    return selectedCount > 0 && selectedCount < categoryPermissions.length;
  };

  const formatPermissionsForApi = () => {
    const formattedData = {};

    Object.keys(selectedPermissions).forEach(key => {
      if (selectedPermissions[key]) {
        const [category, ...permissionParts] = key.split('-');
        const permission = permissionParts.join('-');

        if (!formattedData[category]) {
          formattedData[category] = [];
        }

        formattedData[category].push(permission);
      }
    });

    return formattedData;
  };

  const handleSavePermissions = async () => {
    if (!selectedRole || !selectedRoleData) {
      setNotification({
        open: true,
        message: 'No role selected or role data missing',
        severity: 'error'
      });
      return;
    }

    setSaving(true);
    try {
      const formattedPermissions = formatPermissionsForApi();

      const dataToSubmit = {
        permissionId: selectedRoleData.id || '',
        roleName: selectedRole,
        permissions: formattedPermissions,
        active: true
      };

      let response;
      try {
        const existingPermissionsResponse = await axiosInstance.get(`/realEstate/user-permission/getPermissionByRoleName?roleName=${selectedRole}`);

        if (existingPermissionsResponse.data?.status === 200 && 
            existingPermissionsResponse.data?.data?.length > 0) {
          response = await axiosInstance.post('/realEstate/user-permission/post', {
            ...dataToSubmit,
            permissionId: existingPermissionsResponse.data.data[0].permissionId
          });
        } else {
          response = await axiosInstance.post('/realEstate/user-permission/post', dataToSubmit);
        }
      } catch (error) {
        console.error('Error in API calls:', error);
        response = await axiosInstance.post('/realEstate/user-permission/post', dataToSubmit);
      }

      if (!response.data) {
        throw new Error('No response received from server');
      }

      if (response.data.status !== 201 && response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to save permissions');
      }

      setNotification({
        open: true,
        message: 'Permissions saved successfully',
        severity: 'success'
      });

      // Reset states
      setSelectedRole('');
      setSelectedRoleData({
        id: '',
        role: '',
        permissions: {},
        active: true
      });
      setSelectedPermissions({});

      // Force a complete application refresh
      window.location.reload();

    } catch (error) {
      console.error('Error saving permissions:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to save permissions',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const getSelectedCountForCategory = (category) => {
    const categoryPermissions = mockPermissionCategories.find(c => c.category === category)?.permissions || [];
    return categoryPermissions.filter(permission => isPermissionSelected(category, permission)).length;
  };

  const getTotalSelectedPermissions = () => {
    return Object.values(selectedPermissions).filter(Boolean).length;
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleToggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(135deg, ${bgColor} 0%, #EEF2FF 100%)`,
      // p: { xs: 2, sm: 3 }
    }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, mt: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <SecurityIcon sx={{ fontSize: 40, color: primaryBlue }} />
            <Typography variant="h4" fontWeight="700" color={primaryBlue} sx={{ letterSpacing: '0.5px' }}>
              Role Permissions Management
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Configure and manage access levels for different user roles in the system
          </Typography>
        </Box>

        <Paper sx={{
          p: 4,
          mb: 4,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          borderRadius: 2
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="role-select-label">Select Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={selectedRole}
                  onChange={handleRoleChange}
                  label="Select Role"
                  disabled={saving}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#000', 0.2),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: accentBlue,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: primaryBlue,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select a role</em>
                  </MenuItem>
                  {mockRoles.map((role) => (
                    <MenuItem key={role.name} value={role.name}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {selectedRole && (
          <Paper sx={{
            p: 4,
            mb: 4,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            borderRadius: 2
          }}>
            <Typography variant="h5" gutterBottom fontWeight="600" color={primaryBlue}>
              Permissions for {selectedRole}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search Permissions"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: accentBlue }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchTerm('')}>
                        <ClearIcon sx={{ color: accentBlue }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: alpha('#000', 0.2),
                    },
                    '&:hover fieldset': {
                      borderColor: accentBlue,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: primaryBlue,
                    },
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress sx={{ color: accentBlue }} />
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="500" color={textDark}>
                    Total Selected: <Chip
                      label={getTotalSelectedPermissions()}
                      color="primary"
                      size="small"
                      sx={{
                        backgroundColor: secondaryBlue,
                        fontWeight: 'bold',
                        ml: 1
                      }}
                    />
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSavePermissions}
                    disabled={saving}
                    sx={{
                      backgroundColor: primaryBlue,
                      '&:hover': {
                        backgroundColor: secondaryBlue,
                      },
                      borderRadius: 1.5,
                      textTransform: 'none',
                      px: 3,
                      py: 1,
                      boxShadow: '0 4px 12px rgba(11, 36, 71, 0.15)',
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Permissions'}
                  </Button>
                </Box>

                <Box sx={{ maxHeight: '600px', overflowY: 'auto', pr: 1 }}>
                  {filteredCategories.map((category) => (
                    <Accordion
                      key={category.category}
                      expanded={expandedCategories[category.category] || false}
                      onChange={() => handleToggleCategory(category.category)}
                      sx={{
                        mb: 2,
                        borderRadius: '8px !important',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        '&:before': {
                          display: 'none',
                        },
                        '& .MuiAccordionSummary-root': {
                          backgroundColor: alpha(accentBlue, 0.05),
                          '&:hover': {
                            backgroundColor: alpha(accentBlue, 0.1),
                          },
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: secondaryBlue }} />}
                        aria-controls={`${category.category}-content`}
                        id={`${category.category}-header`}
                        sx={{
                          borderLeft: `4px solid ${secondaryBlue}`,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isCategoryFullySelected(category.category)}
                                indeterminate={isCategoryPartiallySelected(category.category)}
                                onChange={() => handleCategoryToggle(category.category)}
                                onClick={(e) => e.stopPropagation()}
                                sx={{
                                  color: accentBlue,
                                  '&.Mui-checked': {
                                    color: secondaryBlue,
                                  },
                                  '&.MuiCheckbox-indeterminate': {
                                    color: secondaryBlue,
                                  },
                                }}
                              />
                            }
                            onClick={(e) => e.stopPropagation()}
                            label=""
                            sx={{ mr: 0 }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Typography variant="subtitle1" fontWeight="600" color={textDark}>
                              {category.category}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Chip
                                label={`${getSelectedCountForCategory(category.category)}/${category.permissions.length}`}
                                size="small"
                                color={isCategoryFullySelected(category.category) ? "primary" : "default"}
                                sx={{
                                  backgroundColor: isCategoryFullySelected(category.category) ? secondaryBlue : alpha(secondaryBlue, 0.1),
                                  color: isCategoryFullySelected(category.category) ? textLight : secondaryBlue,
                                  fontWeight: 'medium',
                                  mr: 2
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 1, pb: 2 }}>
                        <Box sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1.5,
                          mt: 1
                        }}>
                          {category.permissions.map((permission) => (
                            <FormControlLabel
                              key={`${category.category}-${permission}`}
                              control={
                                <Checkbox
                                  checked={isPermissionSelected(category.category, permission)}
                                  onChange={() => handlePermissionToggle(category.category, permission)}
                                  sx={{
                                    color: accentBlue,
                                    '&.Mui-checked': {
                                      color: secondaryBlue,
                                    },
                                  }}
                                />
                              }
                              label={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: textDark,
                                    fontWeight: isPermissionSelected(category.category, permission) ? '500' : '400'
                                  }}
                                >
                                  {permission}
                                </Typography>
                              }
                              sx={{
                                border: `1px solid ${alpha(accentBlue, 0.2)}`,
                                borderRadius: 1.5,
                                px: 1,
                                py: 0.5,
                                m: 0,
                                backgroundColor: isPermissionSelected(category.category, permission) ? alpha(accentBlue, 0.08) : 'transparent',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  backgroundColor: alpha(accentBlue, 0.12),
                                  borderColor: alpha(accentBlue, 0.4),
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </>
            )}
          </Paper>
        )}
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="refresh-dialog-title"
        aria-describedby="refresh-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        <DialogTitle id="refresh-dialog-title" sx={{ bgcolor: primaryBlue, color: 'white', py: 2 }}>
          <Box display="flex" alignItems="center">
            <RefreshIcon sx={{ mr: 1 }} />
            Permission Update
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText id="refresh-dialog-description">
            Permissions have been saved successfully. Would you like to refresh the sidebar to apply the changes immediately?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            color="primary"
            variant="outlined"
            sx={{
              borderColor: accentBlue,
              color: accentBlue,
              '&:hover': {
                borderColor: secondaryBlue,
                backgroundColor: alpha(secondaryBlue, 0.04),
              },
              borderRadius: 1.5,
              textTransform: 'none',
              px: 3,
            }}
          >
            Later
          </Button>
          <Button
            onClick={handleRefreshSidebar}
            color="primary"
            variant="contained"
            disabled={refreshing}
            sx={{
              backgroundColor: primaryBlue,
              '&:hover': {
                backgroundColor: secondaryBlue,
              },
              borderRadius: 1.5,
              textTransform: 'none',
              px: 3,
              boxShadow: '0 4px 12px rgba(11, 36, 71, 0.15)',
            }}
            startIcon={refreshing ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolePermissionsManagement;