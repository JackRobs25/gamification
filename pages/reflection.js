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
  const [reflectionDate, setReflectionDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get date from query parameter or default to today
    const { date } = router.query;
    const selectedDate = date || new Date().toISOString().slice(0, 10);
    setReflectionDate(selectedDate);

    // Load custom features
    const savedFeatures = JSON.parse(localStorage.getItem('dayFeatures')) || [
      'Family',
      'Friends',
      'Exercise',
      'Social',
      'Work',
      'Relaxation',
    ];
    setDayFeatures(savedFeatures);

    // Load feature scores
    const savedFeatureScores = JSON.parse(localStorage.getItem('featureScores')) || {};
    setFeatureScores(savedFeatureScores);

    // Load the selected date's reflection
    const reflections = JSON.parse(localStorage.getItem('reflections')) || [];
    const selectedReflection = reflections.find((reflection) => reflection.date === selectedDate);

    if (selectedReflection) {
      setScore(selectedReflection.score);
      setFeatures(selectedReflection.features || []);
      setComments(selectedReflection.comments || '');
      setIsEditing(true);
    }
  }, [router.query]);

  useEffect(() => {
    // Update feature scores based on reflection data
    const reflections = JSON.parse(localStorage.getItem('reflections')) || [];

    if (reflections.length >= 20) {
      const scores = {};
      reflections.forEach((reflection) => {
        if (Array.isArray(reflection.features)) {
          reflection.features.forEach((feature) => {
            scores[feature] = scores[feature] || { totalScore: 0, count: 0 };
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
    let reflections = JSON.parse(localStorage.getItem('reflections')) || [];

    // Remove the existing reflection for the selected date
    reflections = reflections.filter((reflection) => reflection.date !== reflectionDate);

    const updatedReflection = {
      date: reflectionDate,
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
        {isEditing ? `Edit Reflection for ${reflectionDate}` : `Reflection for ${reflectionDate}`}
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
