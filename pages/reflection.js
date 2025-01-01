import { Slider, TextField, Button, Box, Typography, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Reflection() {
  const [score, setScore] = useState(5);
  const [features, setFeatures] = useState([]);
  const [comments, setComments] = useState('');
  const [dayFeatures, setDayFeatures] = useState([]);
  const [featureScores, setFeatureScores] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load custom features and today's reflection
    const savedFeatures = JSON.parse(localStorage.getItem('dayFeatures')) || [
      'Family',
      'Friends',
      'Exercise',
      'Social',
      'Work',
      'Relaxation',
    ];
    setDayFeatures(savedFeatures);

    const savedFeatureScores = JSON.parse(localStorage.getItem('featureScores')) || {};
    setFeatureScores(savedFeatureScores);

    const reflections = JSON.parse(localStorage.getItem('reflections')) || [];
    const today = new Date().toISOString().slice(0, 10);
    const todayReflection = reflections.find((reflection) => reflection.date === today);

    if (todayReflection) {
      setScore(todayReflection.score);
      setFeatures(todayReflection.features || []);
      setComments(todayReflection.comments || '');
      setIsEditing(true);
    }
  }, []);

  useEffect(() => {
    // Update feature scores based on reflection data
    const reflections = JSON.parse(localStorage.getItem('reflections')) || [];

    if (reflections.length >= 20) {
      const scores = {};
      reflections.forEach((reflection) => {
        if (Array.isArray(reflection.features)) {
          reflection.features.forEach((feature) => {
            scores[feature] = (scores[feature] || { totalScore: 0, count: 0 });
            scores[feature].totalScore += reflection.score;
            scores[feature].count += 1;
          });
        }
      });

      const calculatedScores = {};
      for (const [feature, { totalScore, count }] of Object.entries(scores)) {
        calculatedScores[feature] = Math.round(totalScore / count - 5); // Normalize around neutral (5)
      }

      setFeatureScores(calculatedScores);
      localStorage.setItem('featureScores', JSON.stringify(calculatedScores));
    }
  }, [dayFeatures]);

  const toggleFeature = (feature) => {
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature) // Remove feature if already selected
        : [...prev, feature] // Add feature if not selected
    );
  };

  const handleSubmit = () => {
    const today = new Date().toISOString().slice(0, 10);
    let reflections = JSON.parse(localStorage.getItem('reflections')) || [];

    // Filter out today's reflection if it exists to avoid double-counting
    reflections = reflections.filter((reflection) => reflection.date !== today);

    const updatedReflection = {
      date: today,
      score,
      features,
      comments,
    };

    reflections.push(updatedReflection);
    localStorage.setItem('reflections', JSON.stringify(reflections));

    alert(isEditing ? 'Reflection Updated!' : 'Reflection Submitted!');
    router.push('/');
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? 'Edit Today\'s Reflection' : 'Daily Reflection'}
      </Typography>

      <Typography>Rate your day (1–10):</Typography>
      <Slider
        value={score}
        onChange={(e, newValue) => setScore(newValue)}
        min={1}
        max={10}
        step={1}
        marks
      />
      <Typography>Your score: {score}</Typography>

      <Typography sx={{ marginTop: 3 }}>Select features of your day:</Typography>
      <Grid container spacing={1} sx={{ marginTop: 1 }}>
        {dayFeatures.map((feature) => (
          <Grid item key={feature}>
            <Button
              variant="contained"
              onClick={() => toggleFeature(feature)}
              sx={{
                backgroundColor: features.includes(feature) ? 'navy' : 'white',
                color: features.includes(feature) ? 'white' : 'black',
                border: '1px solid navy',
                textTransform: 'capitalize',
              }}
            >
              {feature} {featureScores[feature] !== undefined && `(${featureScores[feature] >= 0 ? '+' : ''}${featureScores[feature]})`}
            </Button>
          </Grid>
        ))}
      </Grid>

      <TextField
        label="Additional Comments"
        fullWidth
        multiline
        rows={4}
        margin="normal"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={handleSubmit}
        sx={{ marginTop: 2 }}
      >
        {isEditing ? 'Update Reflection' : 'Submit Reflection'}
      </Button>
    </Box>
  );
}
