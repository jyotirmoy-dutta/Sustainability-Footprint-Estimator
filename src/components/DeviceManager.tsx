import React, { useState } from 'react';
import { Box, Typography, Button, TextField, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { defaultDevices, Device } from '../data';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';

const categories = Array.from(new Set(defaultDevices.map(d => d.category)));

type DeviceManagerProps = {
  devices: Device[];
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
};

const DeviceManager: React.FC<DeviceManagerProps> = ({ devices, setDevices }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Device>>({});

  const handleOpen = (device?: Device, index?: number) => {
    setForm(device ? { ...device } : {});
    setEditIndex(index ?? null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({});
    setEditIndex(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name!]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name!]: value }));
  };

  const handleSave = () => {
    if (!form.name || !form.category || !form.powerWatts || !form.usageHoursPerDay) return;
    if (editIndex !== null) {
      const updated = [...devices];
      updated[editIndex] = { ...form, id: devices[editIndex].id, powerWatts: Number(form.powerWatts), usageHoursPerDay: Number(form.usageHoursPerDay) } as Device;
      setDevices(updated);
    } else {
      setDevices([
        ...devices,
        {
          ...form,
          id: `${form.name!.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
          powerWatts: Number(form.powerWatts),
          usageHoursPerDay: Number(form.usageHoursPerDay),
        } as Device,
      ]);
    }
    handleClose();
  };

  const handleDelete = (index: number) => {
    setDevices(devices.filter((_, i) => i !== index));
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(devices, null, 2)], { type: 'application/json' });
    saveAs(blob, 'devices.json');
  };

  const handleExportCSV = () => {
    const header = 'Name,Category,Power (W),Usage (hrs/day)\n';
    const rows = devices.map(d => `${d.name},${d.category},${d.powerWatts},${d.usageHoursPerDay}`).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'devices.csv');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const imported = JSON.parse(evt.target?.result as string);
        if (Array.isArray(imported)) setDevices(imported);
      } catch {}
    };
    reader.readAsText(file);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h5" flexGrow={1}>{t('Your Devices')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>{t('Add Device')}</Button>
        <Button variant="outlined" sx={{ ml: 2 }} onClick={() => setDevices([...defaultDevices])}>{t('Reset')}</Button>
        <Button variant="outlined" sx={{ ml: 2 }} onClick={handleExportJSON}>Export JSON</Button>
        <Button variant="outlined" sx={{ ml: 1 }} onClick={handleExportCSV}>Export CSV</Button>
        <Button variant="outlined" component="label" sx={{ ml: 1 }}>
          Import JSON
          <input type="file" accept="application/json" hidden onChange={handleImportJSON} />
        </Button>
      </Box>
      <List>
        {devices.map((device, idx) => (
          <ListItem key={device.id} divider>
            <ListItemText
              primary={`${device.name} (${device.category})`}
              secondary={`Power: ${device.powerWatts}W, Usage: ${device.usageHoursPerDay} hrs/day`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(device, idx)}><EditIcon /></IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(idx)}><DeleteIcon /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? t('Edit Device') : t('Add Device')}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label={t('Device Name')}
            name="name"
            value={form.name || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>{t('Category')}</InputLabel>
            <Select
              name="category"
              value={form.category || ''}
              onChange={handleSelectChange}
              label={t('Category')}
            >
              {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label={t('Power (Watts)')}
            name="powerWatts"
            type="number"
            value={form.powerWatts || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label={t('Usage Hours/Day')}
            name="usageHoursPerDay"
            type="number"
            value={form.usageHoursPerDay || ''}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('Cancel')}</Button>
          <Button onClick={handleSave} variant="contained">{t('Save')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeviceManager; 