import { useMemo } from 'react';

/**
 * Hook para gestionar thresholds y horarios críticos personalizados
 * Lee la configuración del usuario desde localStorage
 */
export function useThreshold() {
  // Cargar configuración del usuario desde localStorage
  const config = useMemo(() => {
    try {
      const stored = localStorage.getItem('aiguaapp-config');
      return stored ? JSON.parse(stored) : {
        threshold: 15,
        criticalHoursStart: '00:00',
        criticalHoursEnd: '06:00',
        notifications: true,
        darkMode: false
      };
    } catch (error) {
      console.error('Error cargando configuración:', error);
      return {
        threshold: 15,
        criticalHoursStart: '00:00',
        criticalHoursEnd: '06:00',
        notifications: true,
        darkMode: false
      };
    }
  }, []);

  /**
   * Filtra anomalías según el threshold configurado por el usuario
   * @param {Array} anomalies - Array de anomalías del backend
   * @returns {Array} - Anomalías filtradas
   */
  const filterByThreshold = (anomalies) => {
    if (!anomalies || anomalies.length === 0) return [];
    
    return anomalies.filter(anomaly => {
      // Extraer el valor numérico de la desviación
      let deviationValue;
      if (typeof anomaly.deviation === 'string') {
        // Remover el signo + y convertir a número
        deviationValue = Math.abs(parseFloat(anomaly.deviation.replace('+', '')));
      } else {
        deviationValue = Math.abs(anomaly.deviation);
      }
      
      // Filtrar según threshold del usuario
      return deviationValue >= config.threshold;
    });
  };

  /**
   * Verifica si un timestamp cae dentro del horario crítico configurado
   * @param {string} timestamp - Timestamp ISO
   * @returns {boolean} - true si está en horario crítico
   */
  const isInCriticalHours = (timestamp) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    
    // Convertir horas críticas a números
    const [startHour, startMinute] = config.criticalHoursStart.split(':').map(Number);
    const [endHour, endMinute] = config.criticalHoursEnd.split(':').map(Number);
    
    const currentTimeMinutes = hour * 60 + minutes;
    const startTimeMinutes = startHour * 60 + startMinute;
    const endTimeMinutes = endHour * 60 + endMinute;
    
    // Manejar el caso cuando el rango cruza medianoche
    if (startTimeMinutes <= endTimeMinutes) {
      // Rango normal (ej: 08:00 - 18:00)
      return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes;
    } else {
      // Rango que cruza medianoche (ej: 22:00 - 06:00)
      return currentTimeMinutes >= startTimeMinutes || currentTimeMinutes <= endTimeMinutes;
    }
  };

  /**
   * Calcula estadísticas de las anomalías según configuración
   * @param {Array} anomalies - Array de anomalías
   * @returns {Object} - Estadísticas
   */
  const getStats = (anomalies) => {
    const filtered = filterByThreshold(anomalies);
    const inCriticalHours = filtered.filter(a => isInCriticalHours(a.timestamp));
    
    return {
      total: anomalies.length,
      filtered: filtered.length,
      inCriticalHours: inCriticalHours.length,
      filteredOut: anomalies.length - filtered.length,
      percentageInCritical: filtered.length > 0 
        ? Math.round((inCriticalHours.length / filtered.length) * 100)
        : 0
    };
  };

  /**
   * Obtiene el label del horario crítico
   * @returns {string}
   */
  const getCriticalHoursLabel = () => {
    return `${config.criticalHoursStart} - ${config.criticalHoursEnd}`;
  };

  return {
    config,
    threshold: config.threshold,
    criticalHoursStart: config.criticalHoursStart,
    criticalHoursEnd: config.criticalHoursEnd,
    notifications: config.notifications,
    filterByThreshold,
    isInCriticalHours,
    getStats,
    getCriticalHoursLabel
  };
}
