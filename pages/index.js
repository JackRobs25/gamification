// pages/index.js
import { Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  return (
    <Box sx={{ textAlign: 'center', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Hi, how was your day today?
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => router.push('/reflection')}
      >
        Reflect on Today
      </Button>
    </Box>
  );
}
