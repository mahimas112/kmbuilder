
import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import OrganizationalChart from './OrganisationChart';
const AssociateHierarchyPage = () => {
  const [associateCode, setAssociateCode] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState('');

  const handleSearch = () => {
    // Validate associate code format - assuming it's something like "MOHD3885"
    const codePattern = /^[A-Z]{4}\d{4}$/;
    if (!searchValue) {
      setError('Please enter an Associate Code');
      return;
    }
    
    if (!codePattern.test(searchValue)) {
      setError('Invalid Associate Code format. Example: MOHD3885');
      return;
    }
    
    setError('');
    setAssociateCode(searchValue);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setAssociateCode('');
    setError('');
  };

  return (
    <Container maxWidth="xl">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
          Associate Hierarchy Visualization
        </Typography>
        
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Search by Associate Code
          </Typography>
          
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <TextField
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="Enter Associate Code (e.g., MOHD3885)"
              variant="outlined"
              size="small"
              error={!!error}
              helperText={error}
              sx={{ flexGrow: 1, maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchValue && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClearSearch}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
            
            {associateCode && (
              <Button 
                variant="outlined"
                onClick={handleClearSearch}
              >
                View All
              </Button>
            )}
          </Box>
          
          {associateCode && (
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 500 }}>
              Showing hierarchy for Associate Code: <Box component="span" fontWeight="bold" color="primary">{associateCode}</Box>
            </Typography>
          )}
        </Paper>

        {/* Organization Chart Component */}
        <Box sx={{ mt: 2, height: 'calc(100vh - 250px)', minHeight: '500px' }}>
          <OrganizationalChart associateCode={associateCode} />
        </Box>
      </Box>
    </Container>
  );
};

export default AssociateHierarchyPage;