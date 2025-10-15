import { Map as MapIcon } from 'lucide-react';
import { MapView } from '../components/MapView.jsx';
import { useData } from '../context/DataContext.jsx';

export function MapaPage() {
  const { incidents } = useData();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <MapIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mapa d'Incidències</h1>
            <p className="text-gray-600 mt-1">Visualització geogràfica de les anomalies per barri</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <MapView incidents={incidents} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-semibold text-gray-800">Crítico</span>
          </div>
          <p className="text-sm text-gray-600">Desviaciones mayores del 20%</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="font-semibold text-gray-800">Advertencia</span>
          </div>
          <p className="text-sm text-gray-600">Desviaciones del 10-20%</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-semibold text-gray-800">Normal</span>
          </div>
          <p className="text-sm text-gray-600">Consumo dentro de parámetros</p>
        </div>
      </div>
    </div>
  );
}
