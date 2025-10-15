import { Settings, Save, Info } from 'lucide-react';
import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useThreshold } from '../hooks/useThreshold';

export function ConfiguracionPage() {
  const { anomalies } = useData();
  const { getStats } = useThreshold();
  
  const [config, setConfig] = useState(() => {
    try {
      const stored = localStorage.getItem('aiguaapp-config');
      return stored ? JSON.parse(stored) : {
        threshold: 15,
        criticalHoursStart: '00:00',
        criticalHoursEnd: '06:00',
        notifications: true,
        darkMode: false
      };
    } catch {
      return {
        threshold: 15,
        criticalHoursStart: '00:00',
        criticalHoursEnd: '06:00',
        notifications: true,
        darkMode: false
      };
    }
  });

  // Calcular estadísticas en tiempo real según threshold actual
  const previewStats = (() => {
    if (!anomalies || anomalies.length === 0) return null;
    
    const filtered = anomalies.filter(a => {
      let deviationValue;
      if (typeof a.deviation === 'string') {
        deviationValue = Math.abs(parseFloat(a.deviation.replace('+', '')));
      } else {
        deviationValue = Math.abs(a.deviation);
      }
      return deviationValue >= config.threshold;
    });
    
    return {
      total: anomalies.length,
      filtered: filtered.length,
      filteredOut: anomalies.length - filtered.length
    };
  })();

  const handleSave = () => {
    localStorage.setItem('aiguaapp-config', JSON.stringify(config));
    // Recargar la página para aplicar cambios en todos los componentes
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-sky-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuració</h1>
            <p className="text-gray-600 mt-1">Personalitza els paràmetres de l'aplicació</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Umbral */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Llindar d'Anomalia (%)
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={config.threshold}
            onChange={(e) => setConfig({ ...config, threshold: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>5%</span>
            <span className="font-semibold text-sky-600">{config.threshold}%</span>
            <span>30%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Desviacions superiors a aquest percentatge es consideraran anomalies
          </p>
        </div>

        {/* Horarios críticos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horaris Crítics
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Inici</label>
              <input
                type="time"
                value={config.criticalHoursStart}
                onChange={(e) => setConfig({ ...config, criticalHoursStart: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fi</label>
              <input
                type="time"
                value={config.criticalHoursEnd}
                onChange={(e) => setConfig({ ...config, criticalHoursEnd: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Període de temps amb monitorització prioritària
          </p>
        </div>

        {/* Notificaciones */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notificacions
            </label>
            <p className="text-sm text-gray-500">
              Rebre alertes quan es detectin anomalies
            </p>
          </div>
          <button
            onClick={() => setConfig({ ...config, notifications: !config.notifications })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.notifications ? 'bg-sky-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Modo oscuro */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mode Fosc
            </label>
            <p className="text-sm text-gray-500">
              Canviar a tema fosc (proper)
            </p>
          </div>
          <button
            onClick={() => setConfig({ ...config, darkMode: !config.darkMode })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.darkMode ? 'bg-sky-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Panel de información con preview de estadísticas */}
        {previewStats && (
          <div className="bg-sky-50 border-2 border-sky-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sky-900 mb-2">
                  Impacte del Llindar Actual
                </h4>
                <div className="space-y-2 text-sm text-sky-800">
                  <p>
                    Amb un llindar de <strong>{config.threshold}%</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      <strong>{previewStats.filtered}</strong> anomalies es mostraran
                    </li>
                    {previewStats.filteredOut > 0 && (
                      <li className="text-sky-700">
                        <strong>{previewStats.filteredOut}</strong> anomalies s'ocultaran (desviació &lt;{config.threshold}%)
                      </li>
                    )}
                  </ul>
                  <p className="text-xs text-sky-600 mt-2">
                    💡 Un llindar més alt mostra menys alertes però més crítiques
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botón guardar */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
          >
            <Save className="w-5 h-5" />
            Guardar i Aplicar Configuració
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">
            La pàgina es recarregarà per aplicar els canvis
          </p>
        </div>
      </div>
    </div>
  );
}
