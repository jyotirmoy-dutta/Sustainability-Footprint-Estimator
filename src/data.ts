// Device data and types for Sustainability Footprint Estimator

export type Device = {
  id: string;
  name: string;
  category: string;
  powerWatts: number; // Typical power consumption in watts
  usageHoursPerDay: number; // Default usage hours per day
  lifecycleImpact?: { manufacturing: number; disposal: number };
};

export const defaultDevices: Device[] = [
  { id: 'laptop', name: 'Laptop', category: 'Computing', powerWatts: 50, usageHoursPerDay: 8 },
  { id: 'desktop', name: 'Desktop PC', category: 'Computing', powerWatts: 150, usageHoursPerDay: 8 },
  { id: 'smartphone', name: 'Smartphone', category: 'Mobile', powerWatts: 5, usageHoursPerDay: 4 },
  { id: 'tv', name: 'Television', category: 'Entertainment', powerWatts: 100, usageHoursPerDay: 3 },
  { id: 'fridge', name: 'Refrigerator', category: 'Appliance', powerWatts: 150, usageHoursPerDay: 24 },
  { id: 'washing_machine', name: 'Washing Machine', category: 'Appliance', powerWatts: 500, usageHoursPerDay: 0.5 },
  { id: 'microwave', name: 'Microwave Oven', category: 'Appliance', powerWatts: 1200, usageHoursPerDay: 0.2 },
  { id: 'light_led', name: 'LED Light Bulb', category: 'Lighting', powerWatts: 10, usageHoursPerDay: 5 },
  { id: 'router', name: 'WiFi Router', category: 'Networking', powerWatts: 8, usageHoursPerDay: 24 },
  { id: 'fan', name: 'Ceiling Fan', category: 'Appliance', powerWatts: 75, usageHoursPerDay: 6 },
  // Add more as needed
];

// CO2 emission factors in kg CO2 per kWh for various regions (example values)
export const emissionFactors: { [region: string]: number } = {
  'World': 0.475, // global average
  'USA': 0.385,
  'EU': 0.255,
  'India': 0.708,
  'China': 0.681,
  'Australia': 0.7,
  'Canada': 0.15,
  'Brazil': 0.09,
  // Add more as needed
};

export function getEmissionFactor(region: string): number {
  return emissionFactors[region] ?? emissionFactors['World'];
}

// Lifecycle CO2 impact in kg CO2e (example values, open data)
export const lifecycleImpactData: { [id: string]: { manufacturing: number; disposal: number } } = {
  laptop: { manufacturing: 200, disposal: 10 },
  desktop: { manufacturing: 350, disposal: 15 },
  smartphone: { manufacturing: 70, disposal: 5 },
  tv: { manufacturing: 250, disposal: 12 },
  fridge: { manufacturing: 400, disposal: 20 },
  washing_machine: { manufacturing: 600, disposal: 25 },
  microwave: { manufacturing: 120, disposal: 8 },
  light_led: { manufacturing: 5, disposal: 0.5 },
  router: { manufacturing: 30, disposal: 2 },
  fan: { manufacturing: 40, disposal: 2 },
  // Add more as needed
};

// Benchmarks: average household annual energy use (kWh) and CO2 (kg)
export const benchmarks: { [key: string]: { energy: number; co2: number } } = {
  World: { energy: 3500, co2: 1660 }, // global average
  USA: { energy: 11000, co2: 4235 },
  EU: { energy: 4000, co2: 1020 },
  India: { energy: 1200, co2: 850 },
  China: { energy: 1700, co2: 1150 },
  Australia: { energy: 6000, co2: 4200 },
  Canada: { energy: 11000, co2: 1650 },
  Brazil: { energy: 2500, co2: 225 },
}; 