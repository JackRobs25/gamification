// components/Layout.js
import { useRouter } from 'next/router';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Layout({ children }) {
  const router = useRouter();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Main Content */}
      <Box sx={{ flex: 1 }}>{children}</Box>

      {/* Bottom Navigation */}
      <BottomNavigation
        showLabels
        value={router.pathname}
        onChange={(event, newValue) => router.push(newValue)}
        sx={{ position: 'fixed', bottom: 0, width: '100%' }}
      >
        <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
        <BottomNavigationAction label="Insights" value="/insights" icon={<InsightsIcon />} />
        <BottomNavigationAction label="Settings" value="/settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Box>
  );
}
