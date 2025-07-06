import React from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, ListItemButton, IconButton, Select, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DeviceManager from './components/DeviceManager';
import Results from './components/Results';
import Suggestions from './components/Suggestions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const drawerWidth = 220;

const navPages = [
  { key: 'Devices', icon: <DevicesIcon /> },
  { key: 'Results', icon: <AssessmentIcon /> },
  { key: 'Suggestions', icon: <TipsAndUpdatesIcon /> },
  { key: 'Settings', icon: <SettingsIcon /> },
];

function App() {
  const [selectedPage, setSelectedPage] = React.useState(0);
  const [devices, setDevices] = React.useState(require('./data').defaultDevices);
  const [region, setRegion] = React.useState('World');
  const [mode, setMode] = React.useState(() => localStorage.getItem('themeMode') || 'light');
  const theme = React.useMemo(() => createTheme({ palette: { mode: mode as 'light' | 'dark' } }), [mode]);
  const { t, i18n } = useTranslation();
  const themeMUI = useTheme();
  const isMobile = useMediaQuery(themeMUI.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  React.useEffect(() => { localStorage.setItem('themeMode', mode); }, [mode]);

  const renderPage = () => {
    switch (selectedPage) {
      case 0:
        return <Box p={3}><DeviceManager devices={devices} setDevices={setDevices} /></Box>;
      case 1:
        return <Box p={3}><Results devices={devices} region={region} onRegionChange={setRegion} /></Box>;
      case 2:
        return <Box p={3}><Suggestions devices={devices} region={region} /></Box>;
      case 3:
        return <Box p={3}><Typography variant="h4">Settings</Typography><Typography>Configure app preferences.</Typography></Box>;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }} aria-label="Open navigation menu">
              <span className="material-icons">menu</span>
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t('Sustainability Footprint Estimator')}
          </Typography>
          <Box sx={{ mr: 2 }}>
            <Select
              value={i18n.language}
              onChange={e => i18n.changeLanguage(e.target.value)}
              size="small"
              sx={{ color: 'inherit', borderColor: 'inherit', minWidth: 80 }}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="es">ES</MenuItem>
            </Select>
          </Box>
          <IconButton color="inherit" aria-label="Toggle dark/light mode" onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </AppBar>
        <a href="#main-content" style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden', zIndex: 1000 }} onFocus={e => { e.currentTarget.style.left = '0'; e.currentTarget.style.width = 'auto'; e.currentTarget.style.height = 'auto'; }}>Skip to main content</a>
        {/* Responsive Drawer */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List role="navigation" aria-label="Main navigation">
                {navPages.map((page, index) => (
                  <ListItemButton key={page.key} selected={selectedPage === index} onClick={() => { setSelectedPage(index); setMobileOpen(false); }} aria-label={t(page.key)}>
                    <ListItemIcon>{page.icon}</ListItemIcon>
                    <ListItemText primary={t(page.key)} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List role="navigation" aria-label="Main navigation">
                {navPages.map((page, index) => (
                  <ListItemButton key={page.key} selected={selectedPage === index} onClick={() => setSelectedPage(index)} aria-label={t(page.key)}>
                    <ListItemIcon>{page.icon}</ListItemIcon>
                    <ListItemText primary={t(page.key)} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Drawer>
        )}
        <Box component="main" id="main-content" sx={{ flexGrow: 1, bgcolor: 'background.default', p: { xs: 1, sm: 3 }, ml: isMobile ? 0 : `${drawerWidth}px` }}>
          <Toolbar />
          {renderPage()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
