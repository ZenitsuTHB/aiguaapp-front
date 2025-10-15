import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function MapView({ incidents = [] }) {
  // Coordenadas fijas por barrio (aproximadas dentro de Barcelona)
  const neighborhoodCoords = {
    "Sants-Montjuïc": [41.363, 2.149],
    "Sants-Montjuic": [41.363, 2.149], // Variante sin tilde
    "Eixample": [41.392, 2.163],
    "Les Corts": [41.385, 2.125],
    "Ciutat Vella": [41.380, 2.173],
    "Sant Martí": [41.410, 2.208],
    "Sant Marti": [41.410, 2.208], // Variante sin tilde
    "Sant Andreu": [41.435, 2.190],
    "Gràcia": [41.406, 2.153],
    "Gracia": [41.406, 2.153], // Variante sin tilde
    "Horta-Guinardó": [41.430, 2.165],
    "Horta-Guinardo": [41.430, 2.165], // Variante sin tilde
    "Sarrià-Sant Gervasi": [41.400, 2.120],
    "Sarria-Sant Gervasi": [41.400, 2.120], // Variante sin tilde
    "Nou Barris": [41.445, 2.180],
  };

  // Función para determinar el estado basado en severity
  const getStatusFromSeverity = (severity) => {
    switch(severity) {
      case 'high': return 'critical';
      case 'medium': return 'warning';
      case 'low': return 'normal';
      default: return 'normal';
    }
  };

  // Usar datos reales del backend
  const data = incidents.length > 0 ? incidents : [];
  
  // Debug: ver qué datos llegan
  console.log('MapView - incidents recibidos:', incidents);
  console.log('MapView - data a mostrar:', data);  

  const mapRef = useRef(null);
  const mapDivRef = useRef(null);
  const markersRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current && mapDivRef.current) {
      mapRef.current = L.map(mapDivRef.current).setView([41.387, 2.170], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(mapRef.current);

      markersRef.current = L.layerGroup().addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;
    markersRef.current.clearLayers();

    data.forEach((incident) => {
      const coords = neighborhoodCoords[incident.neighborhood];
      if (!coords) {
        console.warn(`Coordenadas no encontradas para: ${incident.neighborhood}`);
        return;
      }

      // Determinar el estado basado en severity
      const status = getStatusFromSeverity(incident.severity);
      
      const color =
        status === 'critical'
          ? '#dc2626' // red-600
          : status === 'warning'
          ? '#f59e0b' // amber-500
          : '#0891b2'; // cyan-600

      const markerHtml = `
        <div style="
          background-color: ${color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 6px rgba(0,0,0,0.3);
        "></div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: [18, 18],
      });

      // Formatear la desviación (puede venir como string o número)
      const deviationStr = typeof incident.deviation === 'string' 
        ? incident.deviation 
        : (incident.deviation > 0 ? `+${incident.deviation}` : `${incident.deviation}`);

      const popupContent = `
        <div style="min-width: 200px;">
          <strong style="font-size: 16px;">${incident.neighborhood}</strong><br/>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #ddd;"/>
          <strong>Tipus:</strong> ${incident.type || 'N/A'}<br/>
          <strong>Severitat:</strong> <span style="color: ${color}; font-weight: bold;">${incident.severity}</span><br/>
          <strong>Consum:</strong> ${incident.liters}L<br/>
          <strong>Desviació:</strong> <span style="color: ${incident.deviation > 0 || (typeof incident.deviation === 'string' && incident.deviation.startsWith('+')) ? 'red' : 'green'}; font-weight: bold;">${deviationStr}%</span><br/>
          <strong>Data:</strong> ${new Date(incident.timestamp).toLocaleString('ca-ES', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      `;

      L.marker(coords, { icon: customIcon }).addTo(markersRef.current).bindPopup(popupContent);
    });
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Mapa de Barcelona</h2>
        {data.length > 0 && (
          <span className="text-sm text-gray-600">
            {data.length} incident{data.length !== 1 ? 's' : ''} detectat{data.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div ref={mapDivRef} className="h-96 w-full rounded-lg border-2 border-gray-200"></div>

      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cyan-600 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-600">Normal (low)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-600">Atenció (medium)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-600">Crític (high)</span>
        </div>
      </div>
    </div>
  );
}
