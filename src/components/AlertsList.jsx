import { AlertTriangle, Droplets, TrendingDown, Moon, Filter } from 'lucide-react';
import { useThreshold } from '../hooks/useThreshold';

export function AlertsList({ anomalies }) {
  const { filterByThreshold, isInCriticalHours, threshold, getCriticalHoursLabel, getStats } = useThreshold();
  
  // Filtrar anomalías según threshold del usuario
  const filteredAnomalies = filterByThreshold(anomalies);
  const stats = getStats(anomalies);
  
  const getIcon = (type) => {
    switch (type) {
      case 'spike':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'leak':
        return <Droplets className="w-5 h-5 text-red-600" />;
      case 'drop':
        return <TrendingDown className="w-5 h-5 text-sky-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'medium':
        return 'bg-amber-50 border-amber-300 text-amber-800';
      case 'low':
        return 'bg-cyan-50 border-cyan-300 text-cyan-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'spike':
        return 'Pic de Consum';
      case 'leak':
        return 'Possible Escapada';
      case 'drop':
        return 'Caiguda Abrupta';
      default:
        return 'Anomalia';
    }
  };

  // Función para formatear la desviación (puede venir como string "+18" o número 18)
  const formatDeviation = (deviation) => {
    if (typeof deviation === 'string') {
      return deviation; // Ya viene con signo
    }
    return deviation > 0 ? `+${deviation}` : `${deviation}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Alertes Recents</h2>
        
        {stats.filteredOut > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-sky-600" />
            <span className="text-gray-600">
              {filteredAnomalies.length} de {anomalies.length}
            </span>
            <span className="text-xs text-gray-500">
              (≥{threshold}%)
            </span>
          </div>
        )}
      </div>

      {filteredAnomalies.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Droplets className="w-12 h-12 mx-auto mb-2 opacity-30" />
          {anomalies.length === 0 ? (
            <p>No s'han detectat anomalies</p>
          ) : (
            <div>
              <p className="font-medium">No hi ha anomalies amb desviació ≥{threshold}%</p>
              <p className="text-xs mt-1">
                {stats.filteredOut} anomalies filtrades. Ajusta el llindar a Configuració.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredAnomalies.map((anomaly) => {
            const inCriticalHour = isInCriticalHours(anomaly.timestamp);
            
            return (
            <div
              key={anomaly.id}
              className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getSeverityColor(anomaly.severity)}`}
            >
              <div className="flex items-start gap-3">
                {getIcon(anomaly.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{anomaly.neighborhood}</h3>
                    <span className="text-xs font-medium uppercase px-2 py-1 rounded-full bg-white bg-opacity-50">
                      {anomaly.severity}
                    </span>
                  </div>
                  <p className="text-sm mb-2 font-medium">{getTypeLabel(anomaly.type)}</p>
                  
                  {/* Indicador de horario crítico */}
                  {inCriticalHour && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                        <Moon className="w-3 h-3" />
                        Horari Crític ({getCriticalHoursLabel()})
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">💧 {anomaly.liters}L</span>
                    <span className={`font-bold ${
                      (typeof anomaly.deviation === 'string' && anomaly.deviation.startsWith('+')) || 
                      (typeof anomaly.deviation === 'number' && anomaly.deviation > 0)
                        ? 'text-red-700' 
                        : 'text-green-700'
                    }`}>
                      📊 {formatDeviation(anomaly.deviation)}%
                    </span>
                  </div>
                  <p className="text-xs mt-2 opacity-75">
                    🕒 {new Date(anomaly.timestamp).toLocaleString('ca-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
