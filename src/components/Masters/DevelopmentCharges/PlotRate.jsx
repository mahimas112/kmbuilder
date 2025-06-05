import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper,
  Container
} from '@mui/material';
import PlotRateTab from './PlotRateTab';
import PLCRateTab from './PlcRateTab';
import DevelopmentRateTab from './DevelopmentTab';
// Custom TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`plot-rate-tabpanel-${index}`}
      aria-labelledby={`plot-rate-tab-${index}`}
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

function a11yProps(index) {
  return {
    id: `plot-rate-tab-${index}`,
    'aria-controls': `plot-rate-tabpanel-${index}`,
  };
}

const PlotRateMaster = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ px: 4, py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="600">
            Plot Rate Master
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage plot rates, PLC rates, and development rates
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="plot rate master tabs"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 500,
                textTransform: 'none',
                minWidth: 120,
              },
              '& .Mui-selected': {
                color: '#FF3B3B',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FF3B3B',
              }
            }}
          >
            <Tab label="Plot Rates" {...a11yProps(0)} />
            <Tab label="PLC Rates" {...a11yProps(1)} />
            {/* <Tab label="Development Rates" {...a11yProps(2)} /> */}
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <PlotRateTab />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <PLCRateTab />
        </TabPanel>
        {/* <TabPanel value={tabValue} index={2}>
          <DevelopmentRateTab />
        </TabPanel> */}
      </Paper>
    </Container>
  );
};

export default PlotRateMaster;