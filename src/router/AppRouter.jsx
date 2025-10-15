// Router principal de la aplicación
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../layouts/Layout';
import { LandingPage } from '../pages/LandingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { MapaPage } from '../pages/MapaPage';
import { HistorialPage } from '../pages/HistorialPage';
import { ConfiguracionPage } from '../pages/ConfiguracionPage';

export function AppRouter() {
  return (
    <Routes>
      {/* Ruta pública - Landing page sin layout */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Rutas privadas - Con layout (Header + Sidebar) */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/mapa" element={<MapaPage />} />
        <Route path="/historial" element={<HistorialPage />} />
        <Route path="/configuracion" element={<ConfiguracionPage />} />
      </Route>

      {/* Fallback - Redirect a landing para rutas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
