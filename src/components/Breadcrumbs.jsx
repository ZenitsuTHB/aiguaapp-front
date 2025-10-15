// Componente de Breadcrumbs para navegación contextual
import { ChevronRight, Home } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';

export function Breadcrumbs() {
  const { currentRoute, goTo } = useNavigation();

  // Si estamos en la landing, no mostramos breadcrumbs
  if (!currentRoute || currentRoute.public) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {/* Home */}
      <button
        onClick={() => goTo('dashboard')}
        className="flex items-center hover:text-sky-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>

      {/* Separador */}
      <ChevronRight className="w-4 h-4 text-gray-400" />

      {/* Página actual */}
      <span className="text-gray-900 font-medium">
        {currentRoute.name}
      </span>
    </nav>
  );
}
