import { NavLink } from 'react-router-dom';
import { getMenuRoutes } from '../config/routes';

export function Sidebar() {
  const menuRoutes = getMenuRoutes();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-73px)] sticky top-[73px] hidden lg:block">
      <nav className="p-4 space-y-2">
        {menuRoutes.map((route) => {
          const Icon = route.icon;
          return (
            <NavLink
              key={route.path}
              to={route.path}
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
  );
}
