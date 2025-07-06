import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Device, getEmissionFactor } from '../data';
import { useTranslation } from 'react-i18next';

type SuggestionsProps = {
  devices: Device[];
  region: string;
};

const tips: { [category: string]: string[] } = {
  'Computing': [
    'Enable power-saving mode on computers and laptops.',
    'Shut down or sleep devices when not in use.',
  ],
  'Appliance': [
    'Use energy-efficient appliances (look for ENERGY STAR label).',
    'Run washing machines and dishwashers with full loads.',
  ],
  'Lighting': [
    'Switch to LED bulbs.',
    'Turn off lights when not needed.',
  ],
  'Entertainment': [
    'Reduce screen brightness.',
    'Turn off TVs and consoles when not in use.',
  ],
  'Networking': [
    'Turn off routers when away for extended periods.',
  ],
  'Mobile': [
    'Use battery saver mode.',
  ],
};

const Suggestions: React.FC<SuggestionsProps> = ({ devices, region }) => {
  const { t } = useTranslation();
  const emissionFactor = getEmissionFactor(region);
  const totalEnergy = devices.reduce((sum, d) => sum + (d.powerWatts * d.usageHoursPerDay * 365) / 1000, 0);
  const totalCO2 = totalEnergy * emissionFactor;

  // Find the highest energy-consuming device
  const sorted = [...devices].sort((a, b) => (b.powerWatts * b.usageHoursPerDay) - (a.powerWatts * a.usageHoursPerDay));
  const topDevice = sorted[0];

  // Example: Suggest reducing usage of top device by 20%
  const potentialSavings = topDevice ? {
    energy: (topDevice.powerWatts * topDevice.usageHoursPerDay * 365 * 0.2) / 1000,
    co2: (topDevice.powerWatts * topDevice.usageHoursPerDay * 365 * 0.2) / 1000 * emissionFactor,
    name: topDevice.name,
  } : null;

  return (
    <Box>
      <Typography variant="h5" mb={2}>{t('Optimization Suggestions')}</Typography>
      {potentialSavings && (
        <Box mb={2}>
          <Typography variant="body1">
            <b>{t('Tip:')}</b> Reducing your <b>{potentialSavings.name}</b> usage by 20% could save <b>{potentialSavings.energy.toFixed(1)} kWh</b> and <b>{potentialSavings.co2.toFixed(1)} kg CO₂</b> per year.
          </Typography>
        </Box>
      )}
      <Typography variant="h6" mt={2}>{t('General Tips')}</Typography>
      <List>
        {Array.from(new Set(devices.map(d => d.category))).flatMap(cat =>
          (tips[cat] || []).map((tip, idx) => (
            <ListItem key={cat + idx}>
              <ListItemText primary={tip} />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default Suggestions; 