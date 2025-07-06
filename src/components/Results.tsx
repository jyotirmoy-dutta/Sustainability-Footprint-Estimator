import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend, LineChart, Line } from 'recharts';
import { Device, getEmissionFactor, emissionFactors, lifecycleImpactData, benchmarks } from '../data';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';
import WhatIfScenario from './WhatIfScenario';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6F91', '#6FFFBF', '#FFB86F', '#6F8CFF', '#FF8C6F'];

type ResultsProps = {
  devices: Device[];
  region: string;
  onRegionChange: (region: string) => void;
};

const Results: React.FC<ResultsProps> = ({ devices, region, onRegionChange }) => {
  const { t } = useTranslation();
  const [renewableKWh, setRenewableKWh] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [liveEmission, setLiveEmission] = useState<number|null>(null);
  const [loadingEmission, setLoadingEmission] = useState(false);
  // kWh per year per device
  const deviceData = devices.map(d => ({
    ...d,
    energyKWh: (d.powerWatts * d.usageHoursPerDay * 365) / 1000,
  }));
  const totalEnergy = deviceData.reduce((sum, d) => sum + d.energyKWh, 0);
  const emissionFactor = getEmissionFactor(region);
  const emissionFactorUsed = liveEmission || emissionFactor;
  const totalCO2 = totalEnergy * emissionFactorUsed;

  // Lifecycle impact calculation
  const deviceLifecycle = devices.map(d => ({
    ...d,
    manufacturing: lifecycleImpactData[d.id]?.manufacturing || 0,
    disposal: lifecycleImpactData[d.id]?.disposal || 0,
  }));
  const totalManufacturing = deviceLifecycle.reduce((sum, d) => sum + d.manufacturing, 0);
  const totalDisposal = deviceLifecycle.reduce((sum, d) => sum + d.disposal, 0);

  const netEnergy = Math.max(totalEnergy - renewableKWh, 0);
  const netCO2 = netEnergy * emissionFactorUsed;

  const regionBench = benchmarks[region] || benchmarks['World'];
  const energyDiff = totalEnergy - regionBench.energy;
  const co2Diff = totalCO2 - regionBench.co2;

  const electricityPrices: { [key: string]: number } = {
    World: 0.15, // USD per kWh
    USA: 0.16,
    EU: 0.30,
    India: 0.08,
    China: 0.09,
    Australia: 0.25,
    Canada: 0.13,
    Brazil: 0.18,
  };
  const pricePerKWh = electricityPrices[region] || electricityPrices['World'];
  const totalCost = totalEnergy * pricePerKWh;
  const netCost = netEnergy * pricePerKWh;
  const savings = totalCost - netCost;

  useEffect(() => {
    const saved = localStorage.getItem('footprintHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingEmission(true);
    setLiveEmission(null);
    // Example: Use CO2 Signal API (requires free API key, here we use a demo endpoint or fallback)
    fetch(`https://api.co2signal.com/v1/latest?countryCode=${region}`, {
      headers: { 'auth-token': 'demo' } // Replace 'demo' with a real key for production
    })
      .then(res => res.json())
      .then(data => {
        if (!cancelled && data && data.data && data.data.carbonIntensity) {
          setLiveEmission(data.data.carbonIntensity / 1000); // gCO2/kWh to kgCO2/kWh
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingEmission(false); });
    return () => { cancelled = true; };
  }, [region]);

  const saveToHistory = () => {
    const entry = {
      date: new Date().toLocaleString(),
      energy: totalEnergy,
      co2: totalCO2,
      netCO2,
      region,
      devices: devices.map(d => d.name).join(', '),
    };
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem('footprintHistory', JSON.stringify(updated));
  };

  const handleExportCSV = () => {
    const header = 'Device,Category,Power (W),Usage (hrs/day),Annual Energy (kWh)\n';
    const rows = deviceData.map(d => `${d.name},${d.category},${d.powerWatts},${d.usageHoursPerDay},${d.energyKWh.toFixed(1)}`).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'energy_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Sustainability Footprint Results', 10, 10);
    doc.text(`Region: ${region}`, 10, 20);
    doc.text(`Total Annual Energy Use: ${totalEnergy.toFixed(1)} kWh`, 10, 30);
    doc.text(`Total Annual CO₂ Emissions: ${totalCO2.toFixed(1)} kg`, 10, 40);
    doc.text('Device Breakdown:', 10, 50);
    deviceData.forEach((d, i) => {
      doc.text(`${d.name}: ${d.energyKWh.toFixed(1)} kWh`, 10, 60 + i * 10);
    });
    doc.save('energy_results.pdf');
  };

  // Bar chart data: energy by category
  const categoryData = Object.values(devices.reduce((acc, d) => {
    acc[d.category] = acc[d.category] || { category: d.category, energy: 0 };
    acc[d.category].energy += (d.powerWatts * d.usageHoursPerDay * 365) / 1000;
    return acc;
  }, {} as Record<string, { category: string; energy: number }>));

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h5" flexGrow={1}>{t('Results')}</Typography>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>{t('Region')}</InputLabel>
          <Select value={region} label={t('Region')} onChange={e => onRegionChange(e.target.value)}>
            {Object.keys(emissionFactors).map(r => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" sx={{ ml: 2 }} onClick={handleExportCSV}>{t('Export CSV')}</Button>
        <Button variant="outlined" sx={{ ml: 1 }} onClick={handleExportPDF}>{t('Export PDF')}</Button>
        <Button variant="outlined" sx={{ ml: 2 }} onClick={saveToHistory}>Save to History</Button>
      </Box>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Renewable Energy Used (kWh/year)"
          type="number"
          value={renewableKWh}
          onChange={e => setRenewableKWh(Number(e.target.value))}
          sx={{ minWidth: 220 }}
        />
        <Typography variant="body2">(Subtracts from total for net CO₂)</Typography>
      </Box>
      <Box mb={2}>
        <Typography variant="body2">
          <b>CO₂ Factor Used:</b> {loadingEmission ? <CircularProgress size={16} /> : `${emissionFactorUsed.toFixed(3)} kg CO₂/kWh`} {liveEmission && '(Live)'}
        </Typography>
      </Box>
      <Typography variant="body1" mb={2}>
        <b>{t('Total Annual Energy Use:')}</b> {totalEnergy.toFixed(1)} kWh<br />
        <b>{t('Total Annual CO₂ Emissions:')}</b> {totalCO2.toFixed(1)} kg<br />
        <b>Net CO₂ after Renewables:</b> {netCO2.toFixed(1)} kg<br />
        <b>Estimated Annual Cost:</b> ${totalCost.toFixed(2)}<br />
        <b>Net Cost after Renewables:</b> ${netCost.toFixed(2)}<br />
        {renewableKWh > 0 && <span style={{ color: 'green' }}><b>Estimated Savings from Renewables:</b> ${savings.toFixed(2)}</span>}
      </Typography>
      <Box mt={3} mb={2}>
        <Typography variant="h6">Comparison Benchmarks</Typography>
        <Typography variant="body2">
          <b>Your Energy Use:</b> {totalEnergy.toFixed(1)} kWh vs. {region} average: {regionBench.energy} kWh
          <br />
          <b>Your CO₂ Emissions:</b> {totalCO2.toFixed(1)} kg vs. {region} average: {regionBench.co2} kg
          <br />
          {energyDiff > 0 ? (
            <span style={{ color: 'red' }}>Above average by {energyDiff.toFixed(1)} kWh</span>
          ) : (
            <span style={{ color: 'green' }}>Below average by {Math.abs(energyDiff).toFixed(1)} kWh</span>
          )}
          <br />
          {co2Diff > 0 ? (
            <span style={{ color: 'red' }}>Above average by {co2Diff.toFixed(1)} kg CO₂</span>
          ) : (
            <span style={{ color: 'green' }}>Below average by {Math.abs(co2Diff).toFixed(1)} kg CO₂</span>
          )}
        </Typography>
      </Box>
      <Typography variant="h6" mt={2}>{t('Breakdown by Device')}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={deviceData}
            dataKey="energyKWh"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name }) => name}
          >
            {deviceData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value.toFixed(1)} kWh`} />
        </PieChart>
      </ResponsiveContainer>
      <Box mt={4}>
        <WhatIfScenario devices={devices} region={region} emissionFactor={emissionFactor} />
      </Box>
      <Typography variant="h6" mt={4}>Lifecycle CO₂ Impact</Typography>
      <Typography variant="body2">
        <b>Total Manufacturing:</b> {totalManufacturing.toFixed(1)} kg CO₂e<br />
        <b>Total Disposal:</b> {totalDisposal.toFixed(1)} kg CO₂e
      </Typography>
      <ul>
        {deviceLifecycle.map(d => (
          <li key={d.id}>
            {d.name}: {d.manufacturing} kg (manufacturing), {d.disposal} kg (disposal)
          </li>
        ))}
      </ul>
      <Box mt={3}>
        <Typography variant="h6">History (last 20 records)</Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '0.95em' }}>
            <thead>
              <tr>
                <th>Date</th><th>Region</th><th>Energy (kWh)</th><th>CO₂ (kg)</th><th>Net CO₂ (kg)</th><th>Devices</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h: any, i: number) => (
                <tr key={i}>
                  <td>{h.date}</td><td>{h.region}</td><td>{h.energy.toFixed(1)}</td><td>{h.co2.toFixed(1)}</td><td>{h.netCO2.toFixed(1)}</td><td>{h.devices}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
      <Box mt={3}>
        <Typography variant="h6">Energy by Device Category</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="category" />
            <YAxis />
            <Legend />
            <Bar dataKey="energy" fill="#1976d2" name="Energy (kWh)" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box mt={3}>
        <Typography variant="h6">Historical Energy/CO₂ Trend</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={history.slice().reverse()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" tick={false} />
            <YAxis />
            <Legend />
            <Line type="monotone" dataKey="energy" stroke="#1976d2" name="Energy (kWh)" />
            <Line type="monotone" dataKey="co2" stroke="#d32f2f" name="CO₂ (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Results; 