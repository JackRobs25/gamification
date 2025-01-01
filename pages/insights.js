import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Insights() {
  const [bestHabits, setBestHabits] = useState([]);
  const [worstHabits, setWorstHabits] = useState([]);

  useEffect(() => {
    const calculateInsights = () => {
      const reflections = JSON.parse(localStorage.getItem('reflections')) || [];

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
    };

    calculateInsights();

    // Recalculate insights whenever reflections change
    window.addEventListener('storage', calculateInsights);

    return () => {
      window.removeEventListener('storage', calculateInsights);
    };
  }, []);

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
      <Box>
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
    </Box>
  );
}
