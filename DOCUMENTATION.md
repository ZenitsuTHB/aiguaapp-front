# 📚 Documentación Técnica - AiguaApp

> Documentación completa de todas las mejoras, implementaciones y configuraciones del proyecto AiguaApp Frontend

---

## 📋 Tabla de Contenidos

1. [Configuración del Proyecto](#1-configuración-del-proyecto)
2. [Integración con API Backend](#2-integración-con-api-backend)
3. [Arquitectura y Refactorización](#3-arquitectura-y-refactorización)
4. [Sistema de Navegación](#4-sistema-de-navegación)
5. [Componentes Principales](#5-componentes-principales)
6. [Sistema de Alertas Personalizadas](#6-sistema-de-alertas-personalizadas)
7. [Exportación de Datos](#7-exportación-de-datos)
8. [Diseño Responsive](#8-diseño-responsive)
9. [Despliegue en GitHub Pages](#9-despliegue-en-github-pages)
10. [Paleta de Colores](#10-paleta-de-colores)
11. [Mejoras y Fixes](#11-mejoras-y-fixes)

---

## 1. Configuración del Proyecto

### 1.1 Estructura del Proyecto

```
aiguaapp-front/
├── src/
│   ├── assets/          # Recursos estáticos
│   ├── components/      # Componentes reutilizables
│   ├── config/          # Configuraciones (rutas, etc.)
│   ├── context/         # Contextos de React
│   ├── hooks/           # Custom hooks
│   ├── layouts/         # Layouts (Header, Sidebar, Layout)
│   ├── pages/           # Páginas de la aplicación
│   ├── router/          # Configuración de rutas
│   └── services/        # Servicios (API)
├── .env                 # Variables de entorno
├── .env.example         # Ejemplo de variables de entorno
├── vite.config.ts       # Configuración de Vite
└── package.json         # Dependencias del proyecto
```

### 1.2 Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18.3.1 | Framework principal |
| React Router DOM | 7.9.4 | Enrutamiento |
| Vite | 5.4.2 | Build tool |
| Tailwind CSS | 3.4.1 | Estilos |
| Leaflet | 1.9.4 | Mapas interactivos |
| Lucide React | 0.344.0 | Iconografía |
| jsPDF | 3.0.3 | Exportación a PDF |
| Supabase | 2.57.4 | Cliente de base de datos |

### 1.3 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Type checking
npm run typecheck

# Desplegar a GitHub Pages
npm run deploy
```

---

## 2. Integración con API Backend

### 2.1 Configuración de la API

**Archivo:** `src/services/api.js`

La aplicación consume datos reales del backend mediante los siguientes endpoints:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/consumption/summary` | GET | Resumen del consumo por barrio |
| `/consumption/` | GET | Lista de consumos/incidents |
| `/anomalies/` | GET | Anomalías detectadas |

**Variables de Entorno:**

```env
# .env
VITE_API_URL=https://repteweb-backend.onrender.com
```

### 2.2 Funciones Principales

```javascript
// Obtener resumen de consumo
export async function getConsumption() {
  const response = await fetch(`${API_URL}/consumption/summary`);
  return await response.json();
}

// Obtener anomalías
export async function getAnomalies() {
  const response = await fetch(`${API_URL}/anomalies/`);
  return await response.json();
}

// Obtener últimos incidentes
export async function getLatestIncidents() {
  const response = await fetch(`${API_URL}/consumption/`);
  return await response.json();
}
```

### 2.3 Estructura de Datos

**Anomalía:**
```json
{
  "id": "uuid",
  "neighborhood": "Eixample",
  "type": "leak|spike|drop|savings",
  "severity": "high|medium|low",
  "liters": 1500,
  "deviation": 45.2,
  "timestamp": "2025-10-16T10:30:00Z"
}
```

### 2.4 Auto-actualización

- Intervalo: **30 segundos**
- Implementado en: `DataContext.jsx`
- Manejo de errores incluido

**Documentación completa:** Ver [API_CONFIG.md](./API_CONFIG.md)

---

## 3. Sistema de Navegación

### 3.1 Configuración de Rutas

**Archivo:** `src/config/routes.js`

```javascript
import { Home, LayoutDashboard, MapPin, History, Settings } from 'lucide-react';

export const routes = [
  {
    path: '/',
    name: 'Inici',
    component: LandingPage,
    icon: Home,
    public: true
  },
  {
    path: '/dashboard',
    name: 'Panell',
    component: DashboardPage,
    icon: LayoutDashboard,
    inMenu: true
  },
  // ... más rutas
];
```

### 3.2 Custom Hooks

**`useNavigation.js`** - Gestión de navegación

```javascript
export function useNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentRoute = routes.find(route => route.path === location.pathname);
  
  const goToNext = () => { /* ... */ };
  const goToPrevious = () => { /* ... */ };
  
  return { currentRoute, goToNext, goToPrevious, /* ... */ };
}
```

### 3.3 Componentes de Navegación

- **`NavigationButtons.jsx`** - Botones Anterior/Siguiente
- **`Breadcrumbs.jsx`** - Migas de pan
- **`Sidebar.jsx`** - Menú lateral con enlaces

**Documentación completa:** Ver [NAVEGACION_IMPLEMENTACION.md](./NAVEGACION_IMPLEMENTACION.md)

---

## 4. Componentes Principales

### 4.1 Dashboard

**Archivo:** `src/components/Dashboard.jsx`

**Funcionalidades:**
- Visualización de estadísticas globales
- Indicadores de consumo total y promedio
- Comparación con periodos anteriores
- Gráfico de tendencias (simulado)

**Tarjetas de Estadísticas:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Total anomalías, Críticas, Consumo total, Desviación promedio */}
</div>
```

### 4.2 MapView

**Archivo:** `src/components/MapView.jsx`

**Funcionalidades:**
- Mapa interactivo de Barcelona con Leaflet
- Marcadores por barrio con estados:
  - 🟢 Normal (verde)
  - 🟡 Atención (amarillo)
  - 🔴 Crítico (rojo)
- Popups con información detallada
- Clustering de marcadores

**Clasificación de Estados:**
```javascript
const getMarkerColor = (severity) => {
  if (severity === 'high') return 'red';
  if (severity === 'medium') return 'orange';
  return 'green';
};
```

### 4.3 AlertsList

**Archivo:** `src/components/AlertsList.jsx`

**Funcionalidades:**
- Lista de anomalías en tiempo real
- Filtrado por severidad
- Iconos según tipo de anomalía
- Badges de estado

### 4.4 WaterPulse

**Archivo:** `src/components/WaterPulse.jsx`

**Funcionalidades:**
- Animación de pulso para representar el consumo
- Indicador visual del estado del sistema
- Efecto de ondas CSS

**Documentación completa:** Ver componentes individuales en `/src/components/`

---

## 5. Sistema de Alertas

### 5.1 Alertas Personalizadas

**Archivo:** `src/pages/ConfiguracionPage.jsx`

**Funcionalidades:**
- Configuración de umbrales personalizados
- Tipos de alertas:
  - Fugas (leak)
  - Picos de consumo (spike)
  - Caídas (drop)
  - Ahorros (savings)
- Niveles de severidad configurables
- Activación/desactivación de alertas

### 5.2 Hook de Umbrales

**Archivo:** `src/hooks/useThreshold.js`

```javascript
export function useThreshold() {
  const [thresholds, setThresholds] = useState({
    leak: { enabled: true, severity: 'high', value: 100 },
    spike: { enabled: true, severity: 'medium', value: 150 },
    // ...
  });
  
  return { thresholds, updateThreshold };
}
```

**Documentación completa:** Ver [ALERTAS_PERSONALIZADAS_IMPLEMENTACION.md](./ALERTAS_PERSONALIZADAS_IMPLEMENTACION.md)

---

## 6. Exportación de Datos

### 6.1 Historial de Anomalías

**Archivo:** `src/pages/HistorialPage.jsx`

**Funcionalidades:**
- Tabla completa de anomalías
- Filtros múltiples:
  - Por barrio
  - Por tipo
  - Por severidad
  - Por rango de fechas
- Estadísticas agregadas
- Top 5 barrios más afectados

### 6.2 Exportación CSV

**Formato:**
```csv
Data,Hora,Barri,Tipus,Severitat,Litres,Desviació
16/10/2025,10:30,Eixample,leak,high,1500,45.2
```

**Características:**
- Encoding UTF-8 con BOM
- Separador por comas
- Headers en catalán

### 6.3 Exportación PDF

**Características:**
- Generado con jsPDF + autoTable
- Incluye:
  - Título e información del informe
  - Resumen ejecutivo con estadísticas
  - Tabla completa de anomalías
  - Estilos personalizados
- Formato: A4, orientación vertical

**Código de Ejemplo:**
```javascript
const exportToPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Informe d\'Anomalies - AiguaApp', 14, 20);
  
  autoTable(doc, {
    startY: 65,
    head: [['Data/Hora', 'Barri', 'Tipus', 'Severitat', 'Litres', 'Desviació']],
    body: filteredAnomalies.map(a => [/* ... */]),
    headStyles: { fillColor: [2, 132, 199] }
  });
  
  doc.save(`informe_anomalies_${new Date().toISOString().split('T')[0]}.pdf`);
};
```

**Documentación completa:** Ver [HISTORIAL_EXPORTACION_IMPLEMENTACION.md](./HISTORIAL_EXPORTACION_IMPLEMENTACION.md)

---

## 7. Diseño Responsive

### 7.1 Sidebar Responsive

**Características:**
- Desktop: Sidebar fijo en la izquierda
- Mobile: Menú hamburguesa con overlay
- Botón flotante en esquina inferior derecha
- Animaciones suaves de apertura/cierre
- Cierre automático al hacer clic en enlace

**Breakpoints:**
```css
/* Móvil: oculto por defecto */
-translate-x-full

/* Desktop (lg): visible */
lg:translate-x-0
```

### 7.2 HistorialPage Responsive

**Mejoras:**
- Grid adaptativo para estadísticas (2 cols móvil → 4 cols desktop)
- Filtros responsivos (1 col → 2 cols → 5 cols)
- Tabla con scroll horizontal en móvil
- Textos con tamaños adaptativos
- Fecha/hora separadas en 2 líneas en móvil

**Clases Tailwind:**
```jsx
// Estadísticas
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

// Filtros
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">

// Tabla
<div className="overflow-x-auto">
  <table className="w-full min-w-[640px]">
```

### 7.3 Breakpoints Tailwind

| Breakpoint | Ancho | Uso |
|------------|-------|-----|
| `sm` | 640px | Tablets pequeñas |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop pequeño |
| `xl` | 1280px | Desktop grande |
| `2xl` | 1536px | Pantallas grandes |

**Documentación completa:** Ver commits recientes sobre responsividad

---

## 8. Despliegue en GitHub Pages

### 8.1 Configuración

**Archivo:** `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/aiguaapp-front/',  // Importante para GitHub Pages
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

**Archivo:** `package.json`

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.3.0"
  }
}
```

### 8.2 Proceso de Despliegue

```bash
# Desplegar a GitHub Pages
npm run deploy
```

**Pasos automáticos:**
1. Ejecuta `npm run build` (predeploy)
2. Compila la aplicación en `/dist`
3. Crea/actualiza la rama `gh-pages`
4. Sube el contenido de `/dist` a la rama

### 8.3 URL de Producción

```
https://zenitsuthb.github.io/aiguaapp-front/
```

### 8.4 Configuración en GitHub

1. Ir a **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **(root)**
4. Guardar

**Tiempo de despliegue:** 1-3 minutos después del push

---

## 9. Paleta de Colores

### 9.1 Colores Principales

| Color | Código | Uso |
|-------|--------|-----|
| Sky 600 | `#0284c7` | Primary (botones, enlaces) |
| Sky 700 | `#0369a1` | Primary hover |
| Sky 50 | `#f0f9ff` | Backgrounds claros |
| Gray 900 | `#111827` | Textos principales |
| Gray 600 | `#4b5563` | Textos secundarios |
| White | `#ffffff` | Backgrounds |

### 9.2 Colores de Estado

| Estado | Color | Código | Uso |
|--------|-------|--------|-----|
| Normal | Green 500 | `#22c55e` | Sin anomalías |
| Atención | Amber 500 | `#f59e0b` | Severidad media |
| Crítico | Red 600 | `#dc2626` | Severidad alta |
| Info | Cyan 600 | `#0891b2` | Información |

### 9.3 Gradientes

```css
/* Background principal */
bg-gradient-to-br from-blue-50 to-cyan-50

/* Cards con borde */
border-l-4 border-sky-600
```

**Documentación completa:** Ver [COLOR_PALETTE.md](./COLOR_PALETTE.md) y [PALETA_ACTUALIZADA.md](./PALETA_ACTUALIZADA.md)

---

## 10. Arquitectura y Refactorización

### 10.1 Refactorización de App.jsx

**Objetivo:** Convertir App.jsx en un componente limpio y profesional

**Antes (35 líneas):**
```jsx
// Muchas importaciones de páginas
import { DashboardPage } from './pages/DashboardPage';
import { MapaPage } from './pages/MapaPage';
// ... más imports

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          {/* Rutas hardcodeadas */}
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}
```

**Después (13 líneas - 62% reducción):**
```jsx
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AppRouter } from './router/AppRouter';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AppRouter />
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
```

### 10.2 Nuevo Directorio `/router`

**AppRouter.jsx (Estático):**
- Agrupa todas las rutas en un archivo
- Separa rutas públicas y privadas
- Incluye fallback a landing page
- Documentado con comentarios claros

**AppRouterDynamic.jsx (Avanzado):**
- Genera rutas dinámicamente desde `routes.js`
- Perfecto para apps con muchas rutas
- Preparado para sistema de permisos
- Añadir ruta = 1 línea en config

### 10.3 Ventajas de la Refactorización

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Líneas en App.jsx | 35 | 13 | -62% |
| Importaciones | 8 | 4 | -50% |
| Responsabilidades | 3 | 1 | -66% |
| Testabilidad | Media | Alta | ⬆️ |
| Escalabilidad | Media | Muy Alta | ⬆️ |

---

## 11. Mejoras y Fixes

### 11.1 Fix de MapView

**Problema:** MapView no usaba datos reales del backend, siempre mostraba datos mock

**Solución:**
1. ✅ Usar datos del prop `incidents`
2. ✅ Mapeo de `severity` → `status` (high/medium/low → critical/warning/normal)
3. ✅ Conversión de `liters` en lugar de `lastReading`
4. ✅ Soporte para nombres de barrios con/sin tilde
5. ✅ Popup mejorado con todos los campos del backend
6. ✅ Formato de fecha en catalán
7. ✅ Contador de incidents activos

**Popup Mejorado:**
```
Gracia
─────────────────
Tipus: leak
Severitat: high (rojo)
Consum: 512.4L
Desviació: +24% (color)
Data: 15/10, 03:00
```

### 11.2 Limpieza de Archivos Mock

**Archivos eliminados:**
- ❌ `src/services/mockData.js`
- ❌ `src/services/mockData.ts`
- ❌ `src/data/anomalies.json`
- ❌ `src/data/consumption.json`
- ❌ `src/data/summary.json`
- ❌ Carpeta `/src/data/` completa

**Beneficios:**
- ✅ ~500+ líneas de código eliminadas
- ✅ Estructura más simple (1 carpeta menos)
- ✅ Bundle más pequeño
- ✅ Sin confusión - solo API real
- ✅ Código de producción limpio

### 11.3 Eliminación de Modo Mock

**Cambios en `api.js`:**
- ❌ Eliminado `USE_MOCK_DATA`
- ❌ Eliminado `simulateDelay()`
- ❌ Eliminados condicionales de modo mock
- ✅ Código simplificado solo para API real
- ✅ Mantenido manejo robusto de errores

**Variables de entorno simplificadas:**
```env
# Antes
VITE_API_URL=https://...
VITE_USE_MOCK_DATA=false

# Ahora
VITE_API_URL=https://...
```

---

## 📝 Resumen de Implementaciones

### ✅ Funcionalidades Completadas

| Funcionalidad | Estado | Porcentaje |
|---------------|--------|------------|
| Integración API Backend | ✅ Completo | 100% |
| Sistema de Navegación | ✅ Completo | 100% |
| Alertas Personalizadas | ✅ Completo | 100% + extras |
| Exportación CSV/PDF | ✅ Completo | 100% |
| Diseño Responsive | ✅ Completo | 100% |
| GitHub Pages Deploy | ✅ Completo | 100% |
| Refactorización App | ✅ Completo | 100% |
| Fix MapView | ✅ Completo | 100% |
| Limpieza Código | ✅ Completo | 100% |

### 📊 Métricas del Proyecto

- **Reducción de código:** -62% en App.jsx, -500+ líneas en total
- **Archivos eliminados:** 5 archivos mock + 1 carpeta
- **Nuevos componentes:** 6 (hooks, router, breadcrumbs, etc.)
- **Páginas responsive:** 100%
- **Cobertura API:** 3/3 endpoints
- **Tiempo de carga:** Optimizado con lazy loading potencial

---

## 🚀 Próximos Pasos

---

## 📝 Commits Importantes

### Últimos commits relevantes:

```bash
d2375d07 - feat: make Sidebar and HistorialPage responsive
7d7a1cb1 - Merge upstream/Integration with GitHub Pages configuration
60d45665 - Add .gitignore file
```

### Convención de commits:

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs
- `refactor:` - Refactorización de código
- `docs:` - Cambios en documentación
- `style:` - Cambios de estilos/formato
- `chore:` - Tareas de mantenimiento

---

## 🔗 Referencias Adicionales

### Documentación Específica

- [API_CONFIG.md](./API_CONFIG.md) - Configuración detallada de la API
- [NAVEGACION_IMPLEMENTACION.md](./NAVEGACION_IMPLEMENTACION.md) - Sistema de navegación
- [ALERTAS_PERSONALIZADAS_IMPLEMENTACION.md](./ALERTAS_PERSONALIZADAS_IMPLEMENTACION.md) - Alertas
- [HISTORIAL_EXPORTACION_IMPLEMENTACION.md](./HISTORIAL_EXPORTACION_IMPLEMENTACION.md) - Exportación
- [CHANGELOG.md](./CHANGELOG.md) - Registro de cambios

### Enlaces Externos

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Leaflet.js](https://leafletjs.com/)
- [jsPDF](https://github.com/parallax/jsPDF)

---

## 🚀 Próximos Pasos

### Mejoras Propuestas

1. **Performance:**
   - Implementar caché local
   - Lazy loading de componentes
   - Optimización de imágenes

2. **Funcionalidades:**
   - Sistema de notificaciones push
   - Filtros avanzados en el mapa
   - Gráficos de tendencias con Chart.js
   - Modo oscuro

3. **Testing:**
   - Unit tests con Vitest
   - E2E tests con Playwright
   - Coverage mínimo del 80%

4. **Accesibilidad:**
   - ARIA labels completos
   - Navegación por teclado
   - Contraste de colores WCAG AA

5. **SEO:**
   - Meta tags optimizados
   - Open Graph para redes sociales
   - Sitemap.xml

---

## 👥 Contribución

### Cómo contribuir

1. Fork del repositorio
2. Crear una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit de cambios: `git commit -m 'feat: añadir nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código

- ESLint configurado
- Prettier para formateo
- TypeScript para type checking
- Commits convencionales

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 📞 Contacto

- **Proyecto:** AiguaApp
- **Repositorio:** [ZenitsuTHB/aiguaapp-front](https://github.com/ZenitsuTHB/aiguaapp-front)
- **Deploy:** [https://zenitsuthb.github.io/aiguaapp-front/](https://zenitsuthb.github.io/aiguaapp-front/)

---

**Última actualización:** 16 de octubre de 2025

✨ **Documentación creada y mantenida por el equipo de AiguaApp** ✨
