// Hook personalizado para manejar la navegación
import { useNavigate, useLocation } from 'react-router-dom';
import { routes, getRouteByPath, isActiveRoute } from '../config/routes';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navegar a una ruta específica
  const goTo = (routeName) => {
    const route = routes[routeName];
    if (route) {
      navigate(route.path);
    } else {
      console.warn(`Route "${routeName}" not found`);
    }
  };

  // Navegar hacia atrás
  const goBack = () => {
    navigate(-1);
  };

  // Navegar hacia adelante
  const goForward = () => {
    navigate(1);
  };

  // Reemplazar la ruta actual
  const replaceTo = (routeName) => {
    const route = routes[routeName];
    if (route) {
      navigate(route.path, { replace: true });
    }
  };

  // Obtener la ruta actual
  const getCurrentRoute = () => {
    return getRouteByPath(location.pathname);
  };

  // Verificar si estamos en una ruta específica
  const isActive = (routeName) => {
    const route = routes[routeName];
    if (!route) return false;
    return isActiveRoute(location.pathname, route.path);
  };

  // Obtener el path actual
  const currentPath = location.pathname;

  // Obtener el state de navegación (si existe)
  const navigationState = location.state;

  return {
    // Métodos de navegación
    goTo,
    goBack,
    goForward,
    replaceTo,
    
    // Estado actual
    currentPath,
    currentRoute: getCurrentRoute(),
    isActive,
    navigationState,
    
    // Rutas disponibles
    routes,
    
    // Location y navigate originales por si se necesitan
    location,
    navigate
  };
};
