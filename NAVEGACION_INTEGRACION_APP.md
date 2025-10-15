## ✅ OPCIÓN RECOMENDADA: Tu App.jsx Actual (Sin Cambios)

**Tu código actual funciona perfectamente con el nuevo sistema.**  
No necesitas cambiar nada en App.jsx.

```jsx
// src/App.jsx - ACTUAL (FUNCIONA PERFECTAMENTE)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Layout } from './layouts/Layout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapaPage } from './pages/MapaPage';
import { HistorialPage } from './pages/HistorialPage';
import { ConfiguracionPage } from './pages/ConfiguracionPage';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          {/* Landing page sin layout */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Rutas con layout (Header + Sidebar) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/mapa" element={<MapaPage />} />
            <Route path="/historial" element={<HistorialPage />} />
            <Route path="/configuracion" element={<ConfiguracionPage />} />
          </Route>

          {/* Redirect para rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🎯 Lo que Cambió (Todo Automático)

### **1. Sidebar** (actualizado automáticamente)
Ahora lee las rutas desde `/src/config/routes.js`:

```jsx
// src/layouts/Sidebar.jsx
import { getMenuRoutes } from '../config/routes';

const menuRoutes = getMenuRoutes(); // 🆕 Dinámico desde config

return (
  <nav>
    {menuRoutes.map(route => (
      <NavLink to={route.path}>
        <route.icon /> {route.name}
      </NavLink>
    ))}
  </nav>
);
```

### **2. Header** (ahora con navegación)
Integra botones de navegación y contexto de página:

```jsx
// src/layouts/Header.jsx
import { NavigationButtons } from '../components/NavigationButtons';
import { useNavigation } from '../hooks/useNavigation';

const { currentRoute } = useNavigation();

return (
  <header>
    <div>Logo + Título</div>
    <NavigationButtons /> {/* 🆕 Botones ← → */}
    <div>Última actualización</div>
  </header>
);
```

---

## 📦 Archivos Nuevos Creados

```
src/
├── config/
│   └── routes.js           🆕 Configuración de rutas
├── hooks/
│   └── useNavigation.js    🆕 Hook de navegación
├── components/
│   ├── Breadcrumbs.jsx     🆕 Componente breadcrumbs
│   └── NavigationButtons.jsx 🆕 Botones ← →
└── layouts/
    ├── Sidebar.jsx         ✏️  Actualizado
    └── Header.jsx          ✏️  Actualizado
```

---

## 🚀 Cómo Usar en tus Páginas

### **Ejemplo 1: DashboardPage con Navegación**

```jsx
import { useNavigation } from '../hooks/useNavigation';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function DashboardPage() {
  const { goTo, isActive } = useNavigation();

  return (
    <div className="max-w-7xl mx-auto">
      <Breadcrumbs /> {/* 🆕 Muestra: 🏠 › Dashboard */}
      
      <h1>Dashboard</h1>

      {/* Cards clickeables */}
      <div className="grid grid-cols-3 gap-4">
        <div 
          onClick={() => goTo('mapa')}
          className="p-6 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition"
        >
          <h3 className="font-bold">Mapa d'Incidències</h3>
          <p className="text-gray-600">12 incidències actives</p>
        </div>
        
        <div 
          onClick={() => goTo('historial')}
          className="p-6 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition"
        >
          <h3 className="font-bold">Historial</h3>
          <p className="text-gray-600">45 anomalies aquest mes</p>
        </div>
        
        <div 
          onClick={() => goTo('configuracion')}
          className="p-6 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition"
        >
          <h3 className="font-bold">Configuració</h3>
          <p className="text-gray-600">Personalitza els paràmetres</p>
        </div>
      </div>

      {/* Indicador de página activa */}
      {isActive('dashboard') && (
        <div className="mt-4 p-4 bg-sky-50 rounded-lg">
          ℹ️ Estàs al Dashboard principal
        </div>
      )}
    </div>
  );
}
```

### **Ejemplo 2: ConfiguracionPage con Guardar y Volver**

```jsx
import { useNavigation } from '../hooks/useNavigation';
import { useState } from 'react';

export function ConfiguracionPage() {
  const { goTo, goBack } = useNavigation();
  const [config, setConfig] = useState({ threshold: 15 });

  const handleSave = () => {
    // Guardar configuración
    localStorage.setItem('aiguaapp-config', JSON.stringify(config));
    
    // Mostrar confirmación
    alert('Configuració guardada correctament!');
    
    // Volver al dashboard
    goTo('dashboard');
  };

  const handleCancel = () => {
    // Volver sin guardar
    goBack();
  };

  return (
    <div>
      <h1>Configuració</h1>
      
      {/* Formulario */}
      <div className="space-y-4">
        <label>
          Llindar d'anomalia (%):
          <input 
            type="number" 
            value={config.threshold}
            onChange={(e) => setConfig({ ...config, threshold: e.target.value })}
          />
        </label>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 mt-6">
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
        >
          Guardar
        </button>
        <button 
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel·lar
        </button>
      </div>
    </div>
  );
}
```

### **Ejemplo 3: HistorialPage con Navegación al Mapa**

```jsx
import { useNavigation } from '../hooks/useNavigation';
import { useData } from '../context/DataContext';

export function HistorialPage() {
  const { anomalies } = useData();
  const { navigate } = useNavigation();

  const handleVerEnMapa = (anomaly) => {
    // Navegar al mapa con el ID de la anomalía
    navigate('/mapa', {
      state: {
        anomalyId: anomaly.id,
        neighborhood: anomaly.neighborhood,
        shouldHighlight: true
      }
    });
  };

  return (
    <div>
      <h1>Historial d'Anomalies</h1>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Barri</th>
            <th>Tipus</th>
            <th>Accions</th>
          </tr>
        </thead>
        <tbody>
          {anomalies.map(anomaly => (
            <tr key={anomaly.id}>
              <td>{new Date(anomaly.timestamp).toLocaleString()}</td>
              <td>{anomaly.neighborhood}</td>
              <td>{anomaly.type}</td>
              <td>
                <button 
                  onClick={() => handleVerEnMapa(anomaly)}
                  className="text-sky-600 hover:underline"
                >
                  📍 Ver al mapa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### **Ejemplo 4: MapaPage Recibiendo Datos de Navegación**

```jsx
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function MapaPage() {
  const location = useLocation();
  const { anomalyId, neighborhood, shouldHighlight } = location.state || {};
  
  const [highlightedNeighborhood, setHighlightedNeighborhood] = useState(null);

  useEffect(() => {
    if (shouldHighlight && neighborhood) {
      // Resaltar el barrio en el mapa
      setHighlightedNeighborhood(neighborhood);
      
      // Hacer zoom al barrio
      // ... lógica de zoom en Leaflet ...
    }
  }, [shouldHighlight, neighborhood]);

  return (
    <div>
      <h1>Mapa d'Incidències</h1>
      
      {highlightedNeighborhood && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          📍 Mostrant: <strong>{highlightedNeighborhood}</strong>
          {anomalyId && ` (Anomalia #${anomalyId})`}
        </div>
      )}

      {/* Componente de mapa */}
      <MapView highlightedNeighborhood={highlightedNeighborhood} />
    </div>
  );
}
```

---

## 📊 Comparación Visual

### **Antes (Sin Sistema de Navegación)**

```jsx
// ❌ Hardcoded
<button onClick={() => window.location.href = '/dashboard'}>
  Dashboard
</button>

// ❌ Sin contexto
<div>Página Actual: ???</div>

// ❌ Sin navegación programática limpia
```

### **Después (Con Sistema de Navegación)**

```jsx
// ✅ Tipado y centralizado
const { goTo } = useNavigation();
<button onClick={() => goTo('dashboard')}>
  Dashboard
</button>

// ✅ Con contexto completo
const { currentRoute } = useNavigation();
<div>Página Actual: {currentRoute.name}</div>

// ✅ Navegación programática elegante
goTo('mapa', { state: { data } });
```

---

## ✅ Checklist Final

- [x] **App.jsx**: No requiere cambios ✅
- [x] **Sidebar**: Actualizado con rutas dinámicas ✅
- [x] **Header**: Integrado con NavigationButtons ✅
- [x] **Hook useNavigation**: Disponible en toda la app ✅
- [x] **Breadcrumbs**: Componente listo ✅
- [x] **0 errores**: Compilación exitosa ✅

---

## 🎉 ¡Todo Listo!

Tu aplicación ahora tiene:
- ✅ Sistema de navegación centralizado
- ✅ Hook `useNavigation()` para usar en cualquier componente
- ✅ Breadcrumbs automáticos
- ✅ Botones de navegación ← →
- ✅ Compatible con tu código actual
- ✅ Escalable para futuras rutas

**No necesitas cambiar App.jsx** - el sistema funciona automáticamente.

---

**Documentación completa**: `NAVEGACION_IMPLEMENTACION.md`  
**Guía rápida**: `NAVEGACION_GUIA_RAPIDA.md`
