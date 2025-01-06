import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Box, Typography, Paper } from '@mui/material';
import 'react-calendar/dist/Calendar.css'; // Import default styles

export default function CalendarTab() {
  const [reflections, setReflections] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReflection, setSelectedReflection] = useState(null);

  useEffect(() => {
    // Fetch reflections from localStorage
    const storedReflections = JSON.parse(localStorage.getItem('reflections')) || [];
    setReflections(storedReflections);
  }, []);

  const getTileColor = (date) => {
    const reflection = reflections.find(
      (r) => r.date === date.toISOString().slice(0, 10) // Match YYYY-MM-DD format
    );

    if (reflection) {
      const score = reflection.score;
      const green = Math.round((score / 10) * 255);
      const red = 255 - green;
      return `rgb(${red}, ${green}, 0)`; // Gradient scale
    }

    return ''; // Default no color
  };

  const handleDateClick = (date) => {
    const reflection = reflections.find(
      (r) => r.date === date.toISOString().slice(0, 10)
    );
    setSelectedDate(date.toISOString().slice(0, 10));
    setSelectedReflection(reflection || null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 4,
      }}
    >
      {/* Calendar Section */}
      <Box sx={{ width: '50%', paddingRight: 2 }}>
        <Calendar
          onClickDay={handleDateClick}
          tileContent={({ date }) => (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: getTileColor(date),
                borderRadius: '50%',
              }}
            ></div>
          )}
        />
      </Box>

      {/* Reflection Details Section */}
      <Box sx={{ width: '50%', paddingLeft: 2 }}>
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            textAlign: 'center',
            backgroundColor: selectedReflection ? '#f0f0f0' : '#fff',
          }}
        >
          {selectedReflection ? (
            <>
              <Typography variant="h5" gutterBottom>
                Reflection for {selectedDate}
              </Typography>
              <Typography variant="body1">
                <strong>Score:</strong> {selectedReflection.score}
              </Typography>
              <Typography variant="body1">
                <strong>Features:</strong>{' '}
                {Array.isArray(selectedReflection.features) && selectedReflection.features.length > 0
                    ? selectedReflection.features.join(', ')
                    : 'None'}
              </Typography>
              <Typography variant="body1">
                <strong>Comments:</strong> {selectedReflection.comments || 'None'}
              </Typography>
            </>
          ) : selectedDate ? (
            <Typography variant="h6">
              No reflection available for {selectedDate}.
            </Typography>
          ) : (
            <Typography variant="h6">Select a date to view its reflection.</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
