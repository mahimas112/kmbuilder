import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import axiosInstance from '../axiosInstance';

const PlotAvailability = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState('');
  const [plots, setPlots] = useState([]);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch blocks whenever selectedProject changes
  useEffect(() => {
    if (selectedProject) {
      fetchBlocks(selectedProject);
    }
  }, [selectedProject]);

  // Fetch plots whenever selectedProject or selectedBlock changes
  useEffect(() => {
    if (selectedProject && selectedBlock) {
      fetchPlotDetails(selectedProject, selectedBlock);
    }
  }, [selectedProject, selectedBlock]);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get('/realEstate/project/getAll');
      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Fetch blocks based on projectId
  const fetchBlocks = async (projectId) => {
    try {
      const response = await axiosInstance.get(`/realEstate/Block/getAllBlockByProjectUUId?projectId=${projectId}`);
      if (response.data.status === 202 && Array.isArray(response.data.data)) {
        setBlocks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  };

  // Fetch plot details based on projectId and blockId
  const fetchPlotDetails = async (projectId, blockId) => {
    try {
      // Replace with your actual API endpoint for fetching plot details
      const response = await axiosInstance.get(`/realEstate/Plot/getPlotsByBlockId/${blockId}`);
      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setPlots(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching plot details:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Plot Availability
      </Typography>
      <Grid container spacing={2} alignItems="center">
        {/* Project Select */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined" size={isMobile ? 'small' : 'medium'}>
            <Select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setSelectedBlock('');
              }}
              displayEmpty
              renderValue={selectedProject !== '' ? undefined : () => 'Select Project'}
            >
              <MenuItem value="" disabled>
                Select Project
              </MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.projectId} value={project.projectId}>
                  {project.siteName || project.projectName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Block Select */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined" size={isMobile ? 'small' : 'medium'}>
            <Select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              displayEmpty
              renderValue={selectedBlock !== '' ? undefined : () => 'Select Block'}
              disabled={!selectedProject}
            >
              <MenuItem value="" disabled>
                Select Block
              </MenuItem>
              {blocks.map((block) => (
                <MenuItem key={block.blockId} value={block.blockId}>
                  {block.block}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {/* Plot Availability Grid */}
      {selectedProject && selectedBlock && (
        <Grid container spacing={2} mt={4}>
          {plots.map((plot) => (
            <Grid item key={plot.plotId} xs={6} sm={4} md={3} lg={2}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 1,
                  py: 2,
                  color: '#fff',
                  fontWeight: 'bold',
                  bgcolor: plot.status === 'available' ? '#6B66FF' : plot.status === 'booked' ? 'warning.main' : plot.status === 'hold' ? 'error.main' : 'gray.500',
                  '&:hover': {
                    bgcolor: plot.status === 'available' ? '#5652e5' : plot.status === 'booked' ? 'warning.dark' : plot.status === 'hold' ? 'error.dark' : 'gray.600',
                  }
                }}
              >
                {plot.plotNumber}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PlotAvailability;