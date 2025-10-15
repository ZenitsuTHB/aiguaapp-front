// Componente de botones de navegación (Back/Forward)
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';

export function NavigationButtons() {
  const { goBack, goForward } = useNavigation();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={goBack}
        className="p-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
        title="Tornar enrere"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={goForward}
        className="p-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
        title="Anar endavant"
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
