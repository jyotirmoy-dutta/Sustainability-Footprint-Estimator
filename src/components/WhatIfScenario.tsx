import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Paper } from '@mui/material';
import { Device, defaultDevices } from '../data';

// What-if scenario simulation component for device energy/CO2 impact
export type { WhatIfScenarioProps };

interface WhatIfScenarioProps {
  devices: Device[];
  region: string;
  emissionFactor: number;
}

const WhatIfScenario: React.FC<WhatIfScenarioProps> = ({ devices, region, emissionFactor }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [whatIfDevice, setWhatIfDevice] = useState<Device>({ ...devices[0] });
  const [showResult, setShowResult] = useState(false);

  const handleDeviceChange = (e: any) => {
    const idx = Number(e.target.value);
    setSelectedIdx(idx);
    setWhatIfDevice({ ...devices[idx] });
    setShowResult(false);
  };

  const handleTypeChange = (e: any) => {
    const newType = defaultDevices.find(d => d.id === e.target.value);
    if (newType) {
      setWhatIfDevice({ ...whatIfDevice, name: newType.name, category: newType.category, powerWatts: newType.powerWatts });
    }
    setShowResult(false);
  };

  const handleUsageChange = (e: any) => {
    setWhatIfDevice({ ...whatIfDevice, usageHoursPerDay: Number(e.target.value) });
    setShowResult(false);
  };

  const handlePreview = () => {
    setShowResult(true);
  };

  // Calculate new totals
  const newDevices = devices.map((d, i) => (i === selectedIdx ? whatIfDevice : d));
  const totalEnergy = devices.reduce((sum, d) => sum + (d.powerWatts * d.usageHoursPerDay * 365) / 1000, 0);
  const newTotalEnergy = newDevices.reduce((sum, d) => sum + (d.powerWatts * d.usageHoursPerDay * 365) / 1000, 0);
  const totalCO2 = totalEnergy * emissionFactor;
  const newTotalCO2 = newTotalEnergy * emissionFactor;

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>What-if Scenario</Typography>
      <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Device</InputLabel>
          <Select value={selectedIdx} label="Device" onChange={handleDeviceChange}>
            {devices.map((d, idx) => (
              <MenuItem key={d.id} value={idx}>{d.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Type</InputLabel>
          <Select value={defaultDevices.find(dd => dd.name === whatIfDevice.name)?.id || ''} label="Type" onChange={handleTypeChange}>
            {defaultDevices.map(d => (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Usage Hours/Day"
          type="number"
          value={whatIfDevice.usageHoursPerDay}
          onChange={handleUsageChange}
          sx={{ minWidth: 120 }}
        />
        <Button variant="contained" onClick={handlePreview}>Preview Impact</Button>
      </Box>
      {showResult && (
        <Box mt={2}>
          <Typography variant="body2">
            <b>Current Total:</b> {totalEnergy.toFixed(1)} kWh, {totalCO2.toFixed(1)} kg CO₂<br />
            <b>What-if Total:</b> {newTotalEnergy.toFixed(1)} kWh, {newTotalCO2.toFixed(1)} kg CO₂<br />
            <b>Difference:</b> {(newTotalEnergy-totalEnergy).toFixed(1)} kWh, {(newTotalCO2-totalCO2).toFixed(1)} kg CO₂
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default WhatIfScenario; 