import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Sustainability Footprint Estimator': 'Sustainability Footprint Estimator',
      'Devices': 'Devices',
      'Results': 'Results',
      'Suggestions': 'Suggestions',
      'Settings': 'Settings',
      'Your Devices': 'Your Devices',
      'Add Device': 'Add Device',
      'Reset': 'Reset',
      'Edit Device': 'Edit Device',
      'Device Name': 'Device Name',
      'Category': 'Category',
      'Power (Watts)': 'Power (Watts)',
      'Usage Hours/Day': 'Usage Hours/Day',
      'Cancel': 'Cancel',
      'Save': 'Save',
      'Region': 'Region',
      'Export CSV': 'Export CSV',
      'Export PDF': 'Export PDF',
      'Total Annual Energy Use:': 'Total Annual Energy Use:',
      'Total Annual CO₂ Emissions:': 'Total Annual CO₂ Emissions:',
      'Breakdown by Device': 'Breakdown by Device',
      'Optimization Suggestions': 'Optimization Suggestions',
      'General Tips': 'General Tips',
      'Tip:': 'Tip:',
      'Configure app preferences.': 'Configure app preferences.',
    }
  },
  es: {
    translation: {
      'Sustainability Footprint Estimator': 'Estimador de Huella de Sostenibilidad',
      'Devices': 'Dispositivos',
      'Results': 'Resultados',
      'Suggestions': 'Sugerencias',
      'Settings': 'Configuración',
      'Your Devices': 'Tus Dispositivos',
      'Add Device': 'Agregar Dispositivo',
      'Reset': 'Restablecer',
      'Edit Device': 'Editar Dispositivo',
      'Device Name': 'Nombre del Dispositivo',
      'Category': 'Categoría',
      'Power (Watts)': 'Potencia (Vatios)',
      'Usage Hours/Day': 'Horas de Uso/Día',
      'Cancel': 'Cancelar',
      'Save': 'Guardar',
      'Region': 'Región',
      'Export CSV': 'Exportar CSV',
      'Export PDF': 'Exportar PDF',
      'Total Annual Energy Use:': 'Consumo Anual Total de Energía:',
      'Total Annual CO₂ Emissions:': 'Emisiones Anuales Totales de CO₂:',
      'Breakdown by Device': 'Desglose por Dispositivo',
      'Optimization Suggestions': 'Sugerencias de Optimización',
      'General Tips': 'Consejos Generales',
      'Tip:': 'Consejo:',
      'Configure app preferences.': 'Configura las preferencias de la aplicación.',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 