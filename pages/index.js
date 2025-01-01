import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, LinearProgress } from '@mui/material';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const [points, setPoints] = useState(0); // Current week's points
  const [recentPerformances, setRecentPerformances] = useState([]); // Previous weeks' points
  const [highScore, setHighScore] = useState(0); // Highest-ever weekly score
  const targetPoints = 50; // Weekly target points

  useEffect(() => {
    const today = new Date();
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - today.getDay()); // Get last Sunday's date
  
    const reflections = JSON.parse(localStorage.getItem('reflections')) || [];
  
    // Debug: Log the retrieved reflections
    console.log("Reflections from localStorage:", reflections);
  
    // Feature scores calculation
    const featureScores = {};
    reflections.forEach((reflection) => {
      if (Array.isArray(reflection.features)) {
        reflection.features.forEach((feature) => {
          if (!featureScores[feature]) {
            featureScores[feature] = { totalScore: 0, count: 0 };
          }
          featureScores[feature].totalScore += reflection.score;
          featureScores[feature].count += 1;
        });
      }
    });
  
    // Debug: Log the calculated feature scores
    console.log("Feature scores:", featureScores);
  
    const normalizedFeaturePoints = {};
    for (const [feature, data] of Object.entries(featureScores)) {
      const avgScore = data.totalScore / data.count;
      normalizedFeaturePoints[feature] = Math.round(avgScore - 5); // Normalize around 0
    }
  
    // Debug: Log normalized feature points
    console.log("Normalized feature points:", normalizedFeaturePoints);
  
    // Calculate points for the current week
    let currentPoints = 0;
    reflections.forEach((reflection) => {
      const reflectionDate = new Date(reflection.date);
      if (reflectionDate >= lastSunday) {
        if (Array.isArray(reflection.features)) {
          reflection.features.forEach((feature) => {
            currentPoints += normalizedFeaturePoints[feature] || 0;
          });
        }
      }
    });
  
    // Debug: Log calculated current points
    console.log("Calculated current points:", currentPoints);
  
    // Update state
    setPoints(currentPoints);
  }, []);
  

  const handleReflect = () => {
    router.push('/reflection');
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
        {/* Left Column: Day, Date, and Reflect Button */}
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
              onClick={handleReflect}
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

        {/* Right Column: Points, High Score, and Recent Performances */}
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
            {/* Points Section */}
            <Typography
              variant="h5"
              sx={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 2,
              }}
            >
              Points
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: '1.2rem',
                fontWeight: '300',
                color: '#666',
                marginBottom: 4,
              }}
            >
              {points} / {targetPoints}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={(points / targetPoints) * 100}
              sx={{
                height: '10px',
                borderRadius: '5px',
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: points >= targetPoints ? '#4caf50' : '#2196f3',
                },
              }}
            />

            {/* High Score Section */}
            <Box sx={{ marginTop: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: 2,
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                High Score
              </Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>
                {highScore} Points
              </Typography>
            </Box>

            {/* Recent Performances Section */}
            <Box sx={{ marginTop: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: 2,
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                Recent Performances
              </Typography>
              {recentPerformances.length > 0 ? (
                recentPerformances.map((log, index) => (
                  <Typography key={index} variant="body2" sx={{ color: '#555' }}>
                    Week {recentPerformances.length - index}: {log}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#999' }}>
                  No recent performances available.
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
