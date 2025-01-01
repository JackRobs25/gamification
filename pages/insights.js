import { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/router';

export default function Insights() {
  const [bestHabits, setBestHabits] = useState([]);
  const [worstHabits, setWorstHabits] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const reflections = JSON.parse(localStorage.getItem('reflections')) || [];

    // Analyze reflections for scores >= 7 (Best Habits) and <= 3 (Worst Habits)
    const analyzeHabits = (threshold, condition) => {
      const habits = {};
      reflections
        .filter((reflection) => condition(reflection.score, threshold))
        .forEach((reflection) => {
          if (Array.isArray(reflection.features)) {
            reflection.features.forEach((feature) => {
              habits[feature] = (habits[feature] || 0) + 1;
            });
          }
        });
      return Object.entries(habits).map(([name, count]) => ({ name, count }));
    };

    const best = analyzeHabits(7, (score, threshold) => score >= threshold);
    const worst = analyzeHabits(3, (score, threshold) => score <= threshold);

    setBestHabits(best);
    setWorstHabits(worst);
  }, []);

  const handleViewPastComments = () => {
    router.push('/past-comments');
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Insights
      </Typography>

      {/* Best Habits */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Best Habits</Typography>
        {bestHabits.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestHabits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography>No best habits yet. Start reflecting to see insights!</Typography>
        )}
      </Box>

      {/* Worst Habits */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Worst Habits</Typography>
        {worstHabits.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={worstHabits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f44336" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography>No worst habits yet. Start reflecting to see insights!</Typography>
        )}
      </Box>

      {/* Button to View Past Comments */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleViewPastComments}
        sx={{ marginTop: 2 }}
      >
        View Past Comments
      </Button>
    </Box>
  );
}
