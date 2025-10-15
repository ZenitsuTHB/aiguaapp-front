import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [consumption, setConsumption] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [consumptionData, anomaliesData, incidentsData] = await Promise.all([
        api.getConsumption(),
        api.getAnomalies(),
        api.getLatestIncidents()
      ]);

      setConsumption(consumptionData);
      setAnomalies(anomaliesData);
      setIncidents(incidentsData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Actualizar datos cada 30 segundos
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    consumption,
    anomalies,
    incidents,
    loading,
    error,
    lastUpdate,
    refreshData: fetchData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe usarse dentro de DataProvider');
  }
  return context;
}
