// Configuración central de rutas de la aplicación
import { Home, LayoutDashboard, Map, History, Settings } from 'lucide-react';
import { LandingPage } from '../pages/LandingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { MapaPage } from '../pages/MapaPage';
import { HistorialPage } from '../pages/HistorialPage';
import { ConfiguracionPage } from '../pages/ConfiguracionPage';

export const routes = {
  // Ruta pública
  landing: {
    path: '/',
    name: 'Inici',
    icon: Home,
    component: LandingPage,
    public: true,
    showInMenu: false
  },
  
  // Rutas privadas (con layout)
  dashboard: {
    path: '/dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    component: DashboardPage,
    public: false,
    showInMenu: true,
    description: 'Vista general del consum d\'aigua'
  },
  
  mapa: {
    path: '/mapa',
    name: 'Mapa',
    icon: Map,
    component: MapaPage,
    public: false,
    showInMenu: true,
    description: 'Mapa d\'incidències per barris'
  },
  
  historial: {
    path: '/historial',
    name: 'Historial',
    icon: History,
    component: HistorialPage,
    public: false,
    showInMenu: true,
    description: 'Informe històric d\'anomalies'
  },
  
  configuracion: {
    path: '/configuracion',
    name: 'Configuració',
    icon: Settings,
    component: ConfiguracionPage,
    public: false,
    showInMenu: true,
    description: 'Paràmetres i preferències'
  }
};

// Helper: Obtener todas las rutas que deben mostrarse en el menú
export const getMenuRoutes = () => {
  return Object.values(routes).filter(route => route.showInMenu);
};

// Helper: Obtener ruta por path
export const getRouteByPath = (pathname) => {
  return Object.values(routes).find(route => route.path === pathname);
};

// Helper: Verificar si una ruta es activa
export const isActiveRoute = (currentPath, routePath) => {
  if (routePath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(routePath);
};

// Helper: Obtener rutas privadas (con layout)
export const getPrivateRoutes = () => {
  return Object.values(routes).filter(route => !route.public);
};

// Helper: Obtener rutas públicas (sin layout)
export const getPublicRoutes = () => {
  return Object.values(routes).filter(route => route.public);
};
