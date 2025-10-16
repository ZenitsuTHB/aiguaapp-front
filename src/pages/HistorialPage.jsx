import { History, Download, FileText, Filter, TrendingUp, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function HistorialPage() {
  const { anomalies } = useData();
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    neighborhood: 'all',
    type: 'all',
    severity: 'all',
    dateFrom: '',
    dateTo: ''
  });
  
  const [exportFormat, setExportFormat] = useState('csv'); // 'csv' o 'pdf'
  
  // Filtrar anomalías según criterios
  const filteredAnomalies = useMemo(() => {
    return anomalies.filter(anomaly => {
      // Filtro por barrio
      if (filters.neighborhood !== 'all' && anomaly.neighborhood !== filters.neighborhood) {
        return false;
      }
      
      // Filtro por tipo
      if (filters.type !== 'all' && anomaly.type !== filters.type) {
        return false;
      }
      
      // Filtro por severidad
      if (filters.severity !== 'all' && anomaly.severity !== filters.severity) {
        return false;
      }
      
      // Filtro por fecha desde
      if (filters.dateFrom) {
        const anomalyDate = new Date(anomaly.timestamp);
        const fromDate = new Date(filters.dateFrom);
        if (anomalyDate < fromDate) return false;
      }
      
      // Filtro por fecha hasta
      if (filters.dateTo) {
        const anomalyDate = new Date(anomaly.timestamp);
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59); // Incluir todo el día
        if (anomalyDate > toDate) return false;
      }
      
      return true;
    });
  }, [anomalies, filters]);
  
  // Estadísticas agregadas
  const stats = useMemo(() => {
    if (filteredAnomalies.length === 0) return null;
    
    // Por barrio
    const byNeighborhood = filteredAnomalies.reduce((acc, a) => {
      acc[a.neighborhood] = (acc[a.neighborhood] || 0) + 1;
      return acc;
    }, {});
    
    const mostAffected = Object.entries(byNeighborhood)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    // Por tipo
    const byType = filteredAnomalies.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    }, {});
    
    // Por severidad
    const bySeverity = filteredAnomalies.reduce((acc, a) => {
      acc[a.severity] = (acc[a.severity] || 0) + 1;
      return acc;
    }, {});
    
    // Promedio de litros y desviación
    const totalLiters = filteredAnomalies.reduce((sum, a) => sum + a.liters, 0);
    const avgLiters = totalLiters / filteredAnomalies.length;
    
    return {
      total: filteredAnomalies.length,
      mostAffected,
      byType,
      bySeverity,
      avgLiters
    };
  }, [filteredAnomalies]);
  
  // Obtener listas únicas para filtros
  const uniqueNeighborhoods = useMemo(() => {
    return [...new Set(anomalies.map(a => a.neighborhood))].sort();
  }, [anomalies]);
  
  // Exportar a CSV
  const exportToCSV = () => {
    try {
      console.log('Iniciando exportación CSV...');
      
      if (filteredAnomalies.length === 0) {
        alert('No hi ha dades per exportar');
        return;
      }
      
      const headers = ['Data', 'Hora', 'Barri', 'Tipus', 'Severitat', 'Litres', 'Desviació'];
      const rows = filteredAnomalies.map(a => [
        new Date(a.timestamp).toLocaleDateString('ca-ES'),
        new Date(a.timestamp).toLocaleTimeString('ca-ES'),
        a.neighborhood,
        a.type,
        a.severity,
        a.liters,
        a.deviation
      ]);
      
      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Añadir BOM para UTF-8
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.href = url;
      link.download = `anomalies_${new Date().toISOString().split('T')[0]}.csv`;
      
      // Asegurar que el link es clickeable
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('CSV exportado correctamente');
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      alert('Error al exportar CSV. Revisa la consola per més detalls.');
    }
  };
  
  // Exportar a PDF
  const exportToPDF = () => {
    try {
      console.log('Iniciando exportación PDF...');
      
      if (filteredAnomalies.length === 0) {
        alert('No hi ha dades per exportar');
        return;
      }
      
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.text('Informe d\'Anomalies - AiguaApp', 14, 20);
      
      // Fecha del informe
      doc.setFontSize(10);
      doc.text(`Data del informe: ${new Date().toLocaleDateString('ca-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, 14, 28);
      
      // Estadísticas generales
      if (stats) {
        doc.setFontSize(12);
        doc.text('Resum Executiu', 14, 38);
        doc.setFontSize(10);
        doc.text(`Total d'anomalies: ${stats.total}`, 14, 45);
        doc.text(`Consum mitja: ${stats.avgLiters.toFixed(1)}L`, 14, 51);
        doc.text(`Per severitat: High (${stats.bySeverity.high || 0}), Medium (${stats.bySeverity.medium || 0}), Low (${stats.bySeverity.low || 0})`, 14, 57);
      }
      
      // Tabla de anomalías usando autoTable
      autoTable(doc, {
        startY: 65,
        head: [['Data/Hora', 'Barri', 'Tipus', 'Severitat', 'Litres', 'Desviacio']],
        body: filteredAnomalies.map(a => [
          new Date(a.timestamp).toLocaleString('ca-ES', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          a.neighborhood,
          a.type,
          a.severity,
          `${a.liters}L`,
          `${a.deviation}%`
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [2, 132, 199] } // sky-600
      });
      
      // Guardar el PDF
      const filename = `informe_anomalies_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      console.log('PDF exportado correctamente:', filename);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Error al exportar PDF. Revisa la consola per més detalls.');
    }
  };
  
  // Handler unificado de exportación
  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else {
      exportToPDF();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        {/* Título */}
        <div className="flex items-center gap-3 mb-4">
          <History className="w-8 h-8 text-sky-600" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Historial d'Anomalies</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              {filteredAnomalies.length} de {anomalies.length} anomalies
            </p>
          </div>
        </div>
        
        {/* Selector de formato y botón exportar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm"
          >
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
          </select>
          
          <button
            onClick={handleExport}
            disabled={filteredAnomalies.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="whitespace-nowrap">Exportar {exportFormat.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Panel de estadísticas */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 border-l-4 border-sky-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Anomalies</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600 opacity-50" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Crítiques</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.bySeverity.high || 0}</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 opacity-50" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Mitjanes</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.bySeverity.medium || 0}</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 opacity-50" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 border-l-4 border-cyan-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Consum Mitjà</p>
                <p className="text-xl sm:text-2xl font-bold text-cyan-600">{stats.avgLiters.toFixed(0)}L</p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Panel de filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-sky-600" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filtres</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {/* Filtro por barrio */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Barri
            </label>
            <select
              value={filters.neighborhood}
              onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-xs sm:text-sm"
            >
              <option value="all">Tots els barris</option>
              {uniqueNeighborhoods.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          
          {/* Filtro por tipo */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Tipus
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-xs sm:text-sm"
            >
              <option value="all">Tots els tipus</option>
              <option value="leak">Fuita (leak)</option>
              <option value="spike">Pic (spike)</option>
              <option value="drop">Caiguda (drop)</option>
              <option value="savings">Estalvi (savings)</option>
            </select>
          </div>
          
          {/* Filtro por severidad */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Severitat
            </label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-xs sm:text-sm"
            >
              <option value="all">Totes</option>
              <option value="high">Alta (high)</option>
              <option value="medium">Mitjana (medium)</option>
              <option value="low">Baixa (low)</option>
            </select>
          </div>
          
          {/* Filtro fecha desde */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Des de
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-xs sm:text-sm"
            />
          </div>
          
          {/* Filtro fecha hasta */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Fins a
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-xs sm:text-sm"
            />
          </div>
        </div>
        
        {/* Botón reset filtros */}
        {(filters.neighborhood !== 'all' || filters.type !== 'all' || filters.severity !== 'all' || filters.dateFrom || filters.dateTo) && (
          <div className="mt-4">
            <button
              onClick={() => setFilters({
                neighborhood: 'all',
                type: 'all',
                severity: 'all',
                dateFrom: '',
                dateTo: ''
              })}
              className="text-xs sm:text-sm text-sky-600 hover:text-sky-700 font-medium"
            >
              Restablir tots els filtres
            </button>
          </div>
        )}
      </div>

      {/* Ranking de barrios más afectados */}
      {stats && stats.mostAffected.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Top 5 Barris Més Afectats</h2>
          <div className="space-y-3">
            {stats.mostAffected.map(([neighborhood, count], index) => {
              const percentage = (count / stats.total) * 100;
              return (
                <div key={neighborhood}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate mr-2">
                      {index + 1}. {neighborhood}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-sky-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barri
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipus
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severitat
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Litres
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Desviació
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAnomalies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500 text-sm">
                    {anomalies.length === 0 
                      ? "No hi ha anomalies registrades" 
                      : "No s'han trobat anomalies amb els filtres seleccionats"}
                  </td>
                </tr>
              ) : (
                filteredAnomalies.map((anomaly) => (
                  <tr key={anomaly.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      <div className="whitespace-nowrap">
                        {new Date(anomaly.timestamp).toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit' })}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {new Date(anomaly.timestamp).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                      {anomaly.neighborhood}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                      {anomaly.type}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        anomaly.severity === 'high' ? 'bg-red-100 text-red-800' :
                        anomaly.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-cyan-100 text-cyan-800'
                      }`}>
                        {anomaly.severity}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {anomaly.liters}L
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      {anomaly.deviation}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
