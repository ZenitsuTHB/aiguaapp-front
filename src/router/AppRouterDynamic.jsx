// Router dinámico generado desde la configuración de rutas
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../layouts/Layout';
import { routes, getPublicRoutes, getPrivateRoutes } from '../config/routes';

export function AppRouterDynamic() {
  const publicRoutes = getPublicRoutes();
  const privateRoutes = getPrivateRoutes();

  return (
    <Routes>
      {/* Rutas públicas - Sin layout */}
      {publicRoutes.map((route) => {
        const Component = route.component;
        return (
          <Route 
            key={route.path} 
            path={route.path} 
            element={<Component />} 
          />
        );
      })}
      
      {/* Rutas privadas - Con layout (Header + Sidebar) */}
      <Route element={<Layout />}>
        {privateRoutes.map((route) => {
          const Component = route.component;
          return (
            <Route 
              key={route.path} 
              path={route.path} 
              element={<Component />} 
            />
          );
        })}
      </Route>

      {/* Fallback - Redirect a landing para rutas no encontradas */}
      <Route path="*" element={<Navigate to={routes.landing.path} replace />} />
    </Routes>
  );
}
