const BASE_URL = import.meta.env.VITE_API_URL || 'https://repteweb-backend.onrender.com';

/**
 * Realiza una petición HTTP con manejo de errores
 * @param {string} endpoint - El endpoint a consumir
 * @returns {Promise<any>} - Los datos de la respuesta
 */
async function fetchFromAPI(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw new Error(`Failed to fetch data from ${endpoint}: ${error.message}`);
  }
}

export const api = {
  /**
   * Obtiene el resumen del consumo de agua
   * Endpoint: GET /consumption/summary
   * @returns {Promise<Array>} - Array con datos de consumo
   */
  async getConsumption() {
    return fetchFromAPI('/consumption/summary');
  },

  /**
   * Obtiene las anomalías detectadas
   * Endpoint: GET /anomalies/
   * @returns {Promise<Array>} - Array con anomalías
   */
  async getAnomalies() {
    return fetchFromAPI('/anomalies/');
  },

  /**
   * Obtiene los últimos incidentes/consumos
   * Endpoint: GET /consumption/
   * @returns {Promise<Array>} - Array con incidentes
   */
  async getLatestIncidents() {
    return fetchFromAPI('/consumption/');
  }
};
