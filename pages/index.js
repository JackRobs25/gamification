import React, { useState } from 'react';
import { Box, Typography, Button, Grid, TextField } from '@mui/material';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');

  const handleReflectToday = () => {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
    router.push(`/reflection?date=${today}`); // Pass today's date as a query parameter
  };

  const handleReflectOtherDay = () => {
    if (selectedDate) {
      router.push(`/reflection?date=${selectedDate}`); // Pass selected date as a query parameter
    } else {
      alert('Please select a date to reflect on.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        padding: 4,
      }}
    >
      <Grid container spacing={4} sx={{ height: '100%', width: '100%' }}>
        {/* Left Column: Reflect on Today */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: '#4caf50',
                fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
              }}
            >
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontSize: '1.5rem',
                fontWeight: '300',
                color: '#555',
                marginBottom: 4,
              }}
            >
              {new Date().toLocaleDateString('en-US')}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleReflectToday}
              sx={{
                padding: '10px 20px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
            >
              Reflect on Today
            </Button>
          </Box>
        </Grid>

        {/* Right Column: Reflect on Another Day */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: 4,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              height: '100%',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 2,
              }}
            >
              Reflect on Another Day
            </Typography>

            <TextField
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              fullWidth
              sx={{ marginBottom: 3 }}
            />

            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleReflectOtherDay}
              sx={{
                padding: '10px 20px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
            >
              Reflect on Selected Day
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
