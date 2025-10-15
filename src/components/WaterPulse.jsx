import { useState } from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

export function WaterPulse({ data }) {
  const [viewMode, setViewMode] = useState('by-neighborhood'); // 'by-neighborhood' o 'timeline'

  // Agrupar datos por barrio
  const dataByNeighborhood = data.reduce((acc, item) => {
    if (!acc[item.neighborhood]) {
      acc[item.neighborhood] = {
        neighborhood: item.neighborhood,
        totalLiters: 0,
        count: 0,
        readings: [],
        severities: { high: 0, medium: 0, low: 0 }
      };
    }
    acc[item.neighborhood].totalLiters += item.liters;
    acc[item.neighborhood].count += 1;
    acc[item.neighborhood].readings.push(item);
    
    // Contar severidades
    if (item.severity) {
      acc[item.neighborhood].severities[item.severity] = 
        (acc[item.neighborhood].severities[item.severity] || 0) + 1;
    }
    
    return acc;
  }, {});

  const neighborhoodStats = Object.values(dataByNeighborhood).map(stat => {
    // Determinar la severidad predominante del barrio
    const { high, medium, low } = stat.severities;
    let predominantSeverity = 'low';
    if (high > medium && high > low) {
      predominantSeverity = 'high';
    } else if (medium > low) {
      predominantSeverity = 'medium';
    }
    
    return {
      ...stat,
      avgLiters: stat.totalLiters / stat.count,
      maxLiters: Math.max(...stat.readings.map(r => r.liters)),
      minLiters: Math.min(...stat.readings.map(r => r.liters)),
      predominantSeverity
    };
  }).sort((a, b) => b.avgLiters - a.avgLiters);

  const overallMax = Math.max(...neighborhoodStats.map(s => s.avgLiters), 1);
  const overallAvg = neighborhoodStats.reduce((sum, s) => sum + s.avgLiters, 0) / neighborhoodStats.length || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Consum per Barri</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('by-neighborhood')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'by-neighborhood'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-sky-50'
            }`}
          >
            Per Barri
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'timeline'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-sky-50'
            }`}
          >
            Línia Temporal
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="bg-sky-50 rounded-lg p-4 border border-sky-100">
          <p className="text-sm text-gray-600">Barris Totals</p>
          <p className="text-2xl font-bold text-sky-600">{neighborhoodStats.length}</p>
        </div>
        <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
          <p className="text-sm text-gray-600">Consum Mitjà</p>
          <p className="text-2xl font-bold text-cyan-600">{overallAvg.toFixed(0)}L</p>
        </div>
        <div className="bg-sky-50 rounded-lg p-4 border border-sky-100">
          <p className="text-sm text-gray-600">Lectures Totals</p>
          <p className="text-2xl font-bold text-sky-600">{data.length}</p>
        </div>
      </div>

      {viewMode === 'by-neighborhood' ? (
        <div className="space-y-3">
          {neighborhoodStats.map((stat, idx) => {
            const percentage = (stat.avgLiters / overallMax) * 100;
            
            // Usar la severidad predominante del barrio
            const severityColor = 
              stat.predominantSeverity === 'high' ? 'bg-red-600' :
              stat.predominantSeverity === 'medium' ? 'bg-amber-500' :
              'bg-cyan-600';
            
            const severityIcon = 
              stat.predominantSeverity === 'high' ? <TrendingUp className="w-4 h-4 text-red-600" /> :
              stat.predominantSeverity === 'medium' ? <TrendingUp className="w-4 h-4 text-amber-600" /> :
              <TrendingDown className="w-4 h-4 text-cyan-600" />;

            return (
              <div key={idx} className="group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{stat.neighborhood}</span>
                    {severityIcon}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600">{stat.count} lectures</span>
                    <span className="font-bold text-gray-900">{stat.avgLiters.toFixed(1)}L</span>
                  </div>
                </div>
                
                <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all ${severityColor} group-hover:opacity-80`}
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-3 text-xs text-gray-600">
                    <span className="relative z-10 mix-blend-difference text-white font-medium">
                      Rang: {stat.minLiters.toFixed(0)}L - {stat.maxLiters.toFixed(0)}L
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-64 flex items-end gap-1 overflow-x-auto">
          {data.slice(-50).map((point, idx) => {
            const height = (point.liters / Math.max(...data.map(d => d.liters), 1)) * 100;
            
            // Usar severity del backend
            const barColor = 
              point.severity === 'high' ? 'bg-red-600' :
              point.severity === 'medium' ? 'bg-amber-500' :
              point.severity === 'low' ? 'bg-cyan-600' :
              'bg-cyan-600';

            return (
              <div
                key={idx}
                className="flex-1 min-w-[8px] relative group cursor-pointer"
                style={{ height: '100%' }}
              >
                <div
                  className={`absolute bottom-0 w-full rounded-t transition-all ${barColor} hover:opacity-80`}
                  style={{ height: `${height}%` }}
                />

                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  <p className="font-semibold">{point.neighborhood}</p>
                  <p>{point.liters}L</p>
                  <p className="text-gray-300">
                    Severitat: {point.severity || 'N/A'}
                  </p>
                  <p className="text-gray-300">{new Date(point.timestamp).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cyan-600 rounded"></div>
          <span className="text-gray-600">Normal (low)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500 rounded"></div>
          <span className="text-gray-600">Atenció (medium)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded"></div>
          <span className="text-gray-600">Crític (high)</span>
        </div>
      </div>
    </div>
  );
}
