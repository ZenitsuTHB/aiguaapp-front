import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getMenuRoutes } from '../config/routes';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRoutes = getMenuRoutes();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Botón hamburguesa para móvil */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-sky-600 text-white rounded-full shadow-lg hover:bg-sky-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay para cerrar el menú en móvil */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-[73px] left-0 z-40
          w-64 bg-white border-r border-gray-200 
          h-[calc(100vh-73px)]
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <nav className="p-4 space-y-2">
          {menuRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <NavLink
                key={route.path}
                to={route.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-medium border-l-4 border-sky-600'
                      : 'text-gray-700 hover:bg-sky-50 hover:text-sky-600'
                  }`
                }
                title={route.description}
              >
                <Icon className="w-5 h-5" />
                <span>{route.name}</span>
              </NavLink>
            );
          })}
        </nav>
        
        {/* Info adicional en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600 text-center">
            <p className="font-medium text-sky-700">AiguaApp</p>
            <p>Monitorització intel·ligent</p>
          </div>
        </div>
      </aside>
    </>
  );
}
