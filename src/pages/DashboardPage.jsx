import { AlertCircle } from 'lucide-react';
import { WaterPulse } from '../components/WaterPulse.jsx';
import { AlertsList } from '../components/AlertsList.jsx';
import { MapView } from '../components/MapView.jsx';
import { useData } from '../context/DataContext.jsx';

export function DashboardPage() {
  const { consumption, anomalies, incidents, error } = useData();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visió general del consum d'aigua</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error al carregar les dades</h3>
            <p className="text-sm text-red-700">{error}</p>
            <p className="text-xs text-red-600 mt-2">
              Assegureu-vos que el backend estigui funcionant a {import.meta.env.VITE_API_URL}
            </p>
          </div>
        </div>
      )}

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Lectures Totals</h3>
          <p className="text-3xl font-bold text-blue-600">{consumption.length}</p>
          <p className="text-sm text-gray-500 mt-2">Dades actualitzades</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Anomalies Actives</h3>
          <p className="text-3xl font-bold text-orange-600">{anomalies.length}</p>
          <p className="text-sm text-gray-500 mt-2">Requereixen atenció</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Zones Crítiques</h3>
          <p className="text-3xl font-bold text-red-600">
            {incidents.filter(i => i.status === 'critical').length}
          </p>
          <p className="text-sm text-gray-500 mt-2">Nivell crític</p>
        </div>
      </div>

      {/* Grid de componentes principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WaterPulse data={consumption} />
          <MapView incidents={incidents} />
        </div>

        <div>
          <AlertsList anomalies={anomalies} />
        </div>
      </div>
    </div>
  );
}
