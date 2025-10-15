# 🧭 Sistema de Navegación - AiguaApp

## 📋 Resumen

Se ha implementado un **sistema de navegación centralizado y modular** para mejorar la estructura y mantenibilidad de la aplicación.

---

## 🆕 Archivos Creados

### 1. **`/src/config/routes.js`** - Configuración Central de Rutas

Centraliza todas las rutas de la aplicación en un solo lugar:

```javascript
export const routes = {
  landing: {
    path: '/',
    name: 'Inici',
    icon: Home,
    public: true,
    showInMenu: false
  },
  dashboard: {
    path: '/dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    public: false,
    showInMenu: true,
    description: 'Vista general del consum d\'aigua'
  },
  // ... más rutas
};
```

**Helpers incluidos**:
- `getMenuRoutes()` - Obtiene rutas que deben mostrarse en el menú
- `getRouteByPath(pathname)` - Busca ruta por path
- `isActiveRoute(currentPath, routePath)` - Verifica si una ruta está activa
- `getPrivateRoutes()` - Obtiene rutas privadas (con layout)
- `getPublicRoutes()` - Obtiene rutas públicas (sin layout)

---

### 2. **`/src/hooks/useNavigation.js`** - Hook Personalizado de Navegación

Hook que simplifica el manejo de navegación en toda la app:

```javascript
const {
  // Métodos de navegación
  goTo,           // goTo('dashboard') - navega por nombre de ruta
  goBack,         // goBack() - vuelve atrás
  goForward,      // goForward() - va adelante
  replaceTo,      // replaceTo('dashboard') - reemplaza en historial
  
  // Estado actual
  currentPath,    // '/dashboard'
  currentRoute,   // { name: 'Dashboard', path: '/dashboard', ... }
  isActive,       // isActive('dashboard') -> true/false
  
  // Rutas disponibles
  routes,         // Todas las rutas configuradas
  
  // Originales de React Router
  location,
  navigate
} = useNavigation();
```

---

### 3. **`/src/components/Breadcrumbs.jsx`** - Componente de Breadcrumbs

Muestra la navegación contextual (migajas de pan):

```jsx
// En cualquier página:
<Breadcrumbs />

// Renderiza:
// 🏠 > Dashboard
// 🏠 > Mapa
// etc.
```

---

### 4. **`/src/components/NavigationButtons.jsx`** - Botones de Navegación

Botones de atrás/adelante como en un navegador:

```jsx
<NavigationButtons />

// Renderiza:
// ← →
```

---

## 📝 Archivos Actualizados

### 1. **`/src/layouts/Sidebar.jsx`**

**Antes**:
```javascript
const navItems = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  // ...
];
```

**Después**:
```javascript
import { getMenuRoutes } from '../config/routes';

const menuRoutes = getMenuRoutes(); // Obtiene dinámicamente del config
```

**Mejoras**:
- ✅ Rutas centralizadas
- ✅ Tooltip con descripciones
- ✅ Footer informativo en el sidebar

---

### 2. **`/src/layouts/Header.jsx`**

**Mejoras añadidas**:
- ✅ Integración de `NavigationButtons` (botones ← →)
- ✅ Muestra nombre de página actual en móvil
- ✅ Usa `useNavigation` para contexto actual

---

## 🎯 Cómo Usar el Sistema de Navegación

### **Opción 1: Usar el Hook `useNavigation`**

En cualquier componente funcional:

```javascript
import { useNavigation } from '../hooks/useNavigation';

function MiComponente() {
  const { goTo, currentRoute, isActive } = useNavigation();
  
  return (
    <div>
      <h1>Estás en: {currentRoute?.name}</h1>
      
      <button onClick={() => goTo('dashboard')}>
        Ir al Dashboard
      </button>
      
      <button onClick={() => goTo('mapa')}>
        Ver Mapa
      </button>
      
      {isActive('historial') && (
        <p>¡Estás en el historial!</p>
      )}
    </div>
  );
}
```

---

### **Opción 2: Usar NavLink (React Router)**

Para enlaces estándar con estilos activos:

```javascript
import { NavLink } from 'react-router-dom';

<NavLink 
  to="/dashboard"
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Dashboard
</NavLink>
```

---

### **Opción 3: Navegación Programática**

```javascript
const { goTo, goBack, replaceTo } = useNavigation();

// Al hacer clic en un botón
const handleClick = () => {
  goTo('configuracion');
};

// Después de guardar algo
const handleSave = () => {
  // ... guardar datos ...
  goTo('dashboard'); // Redirige al dashboard
};

// Reemplazar en historial (no permite volver atrás)
const handleLogin = () => {
  replaceTo('dashboard');
};
```

---

## 🎨 Ejemplos de Uso en Páginas

### **DashboardPage con Navegación Rápida**

```javascript
import { useNavigation } from '../hooks/useNavigation';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function DashboardPage() {
  const { goTo } = useNavigation();

  return (
    <div className="max-w-7xl mx-auto">
      <Breadcrumbs />
      
      <h1>Dashboard</h1>
      
      {/* Cards con navegación rápida */}
      <div className="grid grid-cols-3 gap-4">
        <div 
          onClick={() => goTo('mapa')}
          className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg"
        >
          <h3>Ver Mapa</h3>
          <p>12 incidencias activas</p>
        </div>
        
        <div 
          onClick={() => goTo('historial')}
          className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg"
        >
          <h3>Ver Historial</h3>
          <p>45 anomalías este mes</p>
        </div>
      </div>
    </div>
  );
}
```

---

### **HistorialPage con Navegación Condicional**

```javascript
import { useNavigation } from '../hooks/useNavigation';

export function HistorialPage() {
  const { goTo, goBack } = useNavigation();
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);

  const handleAnomalyClick = (anomaly) => {
    // Ver detalle en el mapa
    goTo('mapa', { state: { anomalyId: anomaly.id } });
  };

  return (
    <div>
      <button onClick={goBack}>
        ← Volver
      </button>
      
      {/* Lista de anomalías */}
      {anomalies.map(a => (
        <div 
          key={a.id}
          onClick={() => handleAnomalyClick(a)}
        >
          {a.neighborhood} - {a.type}
        </div>
      ))}
    </div>
  );
}
```

---

### **ConfiguracionPage con Navegación después de Guardar**

```javascript
import { useNavigation } from '../hooks/useNavigation';

export function ConfiguracionPage() {
  const { goTo } = useNavigation();
  const [config, setConfig] = useState({});

  const handleSave = () => {
    // Guardar configuración
    localStorage.setItem('config', JSON.stringify(config));
    
    // Mostrar notificación
    alert('Configuració guardada correctament!');
    
    // Volver al dashboard
    goTo('dashboard');
  };

  return (
    <div>
      <h1>Configuració</h1>
      
      {/* Formulario de configuración */}
      
      <div className="flex gap-2">
        <button onClick={handleSave}>
          Guardar
        </button>
        <button onClick={() => goTo('dashboard')}>
          Cancel·lar
        </button>
      </div>
    </div>
  );
}
```

---

## 🔧 Integración con App.jsx

Tu `App.jsx` actual **ya funciona** con este sistema. No necesitas cambiar nada, pero puedes mejorarlo:

### **Opción A: Mantener como está (funciona perfectamente)**

```javascript
// Tu App.jsx actual - NO CAMBIAR
function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/mapa" element={<MapaPage />} />
            <Route path="/historial" element={<HistorialPage />} />
            <Route path="/configuracion" element={<ConfiguracionPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}
```

---

### **Opción B: Usar configuración de rutas (más escalable)**

Si en el futuro quieres generar rutas dinámicamente:

```javascript
import { routes, getPrivateRoutes, getPublicRoutes } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          {/* Rutas públicas */}
          {getPublicRoutes().map(route => (
            <Route 
              key={route.path} 
              path={route.path} 
              element={<route.component />} 
            />
          ))}
          
          {/* Rutas privadas con layout */}
          <Route element={<Layout />}>
            {getPrivateRoutes().map(route => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={<route.component />} 
              />
            ))}
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}
```

**Nota**: Para esto, necesitarías añadir `component` a cada ruta en `routes.js`.

---

## ✅ Ventajas del Sistema

### **1. Centralización**
- ✅ Todas las rutas en un solo archivo
- ✅ Fácil de modificar y mantener
- ✅ Única fuente de verdad

### **2. Type Safety**
- ✅ Navegación por nombre (no hardcoded strings)
- ✅ Menos errores de typos
- ✅ Autocomplete en IDE

### **3. Escalabilidad**
- ✅ Añadir nueva ruta = 1 línea en `routes.js`
- ✅ Se propaga automáticamente al menú
- ✅ Preparado para permisos/roles futuros

### **4. UX Mejorada**
- ✅ Breadcrumbs automáticos
- ✅ Botones de navegación
- ✅ Tooltips descriptivos
- ✅ Indicadores de página activa

---

## 🎯 Próximos Pasos Opcionales

### **1. Añadir Permisos/Roles**

```javascript
// routes.js
dashboard: {
  path: '/dashboard',
  name: 'Dashboard',
  icon: LayoutDashboard,
  public: false,
  showInMenu: true,
  roles: ['admin', 'user'] // NUEVO
}

// useNavigation.js
const canAccess = (routeName) => {
  const route = routes[routeName];
  const userRole = getCurrentUserRole(); // Tu lógica
  return route.roles.includes(userRole);
};
```

---

### **2. Rutas Anidadas (Subrutas)**

```javascript
// routes.js
historial: {
  path: '/historial',
  name: 'Historial',
  children: [
    { path: '/historial/anomalies', name: 'Anomalies' },
    { path: '/historial/estadisticas', name: 'Estadístiques' }
  ]
}
```

---

### **3. Navegación con Parámetros**

```javascript
const { navigate } = useNavigation();

// Navegar con state
navigate('/mapa', { 
  state: { 
    anomalyId: 123,
    highlight: true 
  } 
});

// En la página de destino
const location = useLocation();
const { anomalyId } = location.state || {};
```

---

## 📊 Comparación Antes/Después

### **Antes** (Sin sistema de navegación):
```javascript
// En cada componente
<button onClick={() => window.location.href = '/dashboard'}>
  Ir al Dashboard
</button>

// Rutas hardcoded
<NavLink to="/configuracion">Config</NavLink>

// Sin control de estado actual
```

### **Después** (Con sistema de navegación):
```javascript
// En cada componente
const { goTo } = useNavigation();
<button onClick={() => goTo('dashboard')}>
  Ir al Dashboard
</button>

// Rutas centralizadas
const { routes } = useNavigation();
<NavLink to={routes.configuracion.path}>Config</NavLink>

// Con contexto completo
const { currentRoute, isActive } = useNavigation();
```

---

## 🎉 Conclusión

Has implementado un **sistema de navegación profesional** que:

- ✅ Centraliza todas las rutas
- ✅ Simplifica la navegación programática
- ✅ Mejora la UX con breadcrumbs y botones
- ✅ Es escalable para futuras funcionalidades
- ✅ No rompe el código existente

**Estado**: ✅ **Ready to Use**  
**Compatibilidad**: ✅ **Compatible con tu App.jsx actual**

---

**Fecha**: 15 de Octubre de 2025  
**Branch**: Integration  
**Por**: GitHub Copilot
