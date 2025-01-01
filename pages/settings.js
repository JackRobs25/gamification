import { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

export default function Settings() {
  const [dayFeatures, setDayFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    const savedFeatures = JSON.parse(localStorage.getItem('dayFeatures')) || [
      'Family',
      'Friends',
      'Exercise',
      'Social',
      'Work',
      'Relaxation',
    ];
    setDayFeatures(savedFeatures);
  }, []);

  const addFeature = () => {
    if (newFeature && !dayFeatures.includes(newFeature)) {
      const updatedFeatures = [...dayFeatures, newFeature];
      setDayFeatures(updatedFeatures);
      localStorage.setItem('dayFeatures', JSON.stringify(updatedFeatures));
      setNewFeature('');
    }
  };

  const removeFeature = (feature) => {
    const updatedFeatures = dayFeatures.filter((f) => f !== feature);
    setDayFeatures(updatedFeatures);
    localStorage.setItem('dayFeatures', JSON.stringify(updatedFeatures));
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Customize Daily Features
      </Typography>

      <Grid container spacing={1} sx={{ marginBottom: 2 }}>
        {dayFeatures.map((feature) => (
          <Grid item key={feature}>
            <Box display="flex" alignItems="center">
              <Typography sx={{ marginRight: 1 }}>{feature}</Typography>
              <IconButton
                size="small"
                onClick={() => removeFeature(feature)}
                color="error"
              >
                <Delete />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>

      <TextField
        label="New Feature"
        fullWidth
        value={newFeature}
        onChange={(e) => setNewFeature(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" onClick={addFeature} fullWidth>
        Add Feature
      </Button>
    </Box>
  );
}
