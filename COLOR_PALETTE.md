# 🎨 Paleta de Colores Profesional - AiguaApp

## Concepto
Paleta inspirada en el agua, con tonos azules dominantes que representan sostenibilidad, confianza y gestión responsable de recursos hídricos.

---

## 🌊 Colores Principales (Brand)

### Azul Principal (Primary)
- **Base**: `#0284c7` (sky-600) - Agua clara
- **Hover**: `#0369a1` (sky-700)
- **Light**: `#7dd3fc` (sky-300)
- **Uso**: Botones principales, iconos, enlaces, header

### Cyan Secundario (Secondary)
- **Base**: `#06b6d4` (cyan-500) - Agua tropical
- **Hover**: `#0891b2` (cyan-600)
- **Light**: `#67e8f9` (cyan-300)
- **Uso**: Acentos, gradientes, highlights

---

## 📊 Estados de Severidad (Coherentes con tema agua)

### ✅ Normal / Óptimo
- **Color**: `#0891b2` (cyan-600) - Agua limpia y fresca
- **Uso**: Consumo normal, bajo riesgo, estado saludable
- **Clase Tailwind**: `bg-cyan-600`, `text-cyan-600`, `border-cyan-600`

### ⚠️ Advertencia / Atención
- **Color**: `#f59e0b` (amber-500) - Sol mediterráneo
- **Uso**: Consumo moderadamente alto, requiere atención
- **Clase Tailwind**: `bg-amber-500`, `text-amber-600`, `border-amber-500`

### 🚨 Crítico / Alerta
- **Color**: `#dc2626` (red-600) - Urgencia
- **Uso**: Fugas, consumo crítico, acción inmediata
- **Clase Tailwind**: `bg-red-600`, `text-red-600`, `border-red-600`

---

## 🎨 Paleta Completa

```javascript
// Definición para Tailwind o CSS-in-JS
export const colors = {
  // Brand
  primary: {
    50: '#f0f9ff',   // sky-50
    100: '#e0f2fe',  // sky-100
    200: '#bae6fd',  // sky-200
    300: '#7dd3fc',  // sky-300
    400: '#38bdf8',  // sky-400
    500: '#0ea5e9',  // sky-500
    600: '#0284c7',  // sky-600 - PRINCIPAL
    700: '#0369a1',  // sky-700
    800: '#075985',  // sky-800
    900: '#0c4a6e',  // sky-900
  },
  
  secondary: {
    300: '#67e8f9',  // cyan-300
    400: '#22d3ee',  // cyan-400
    500: '#06b6d4',  // cyan-500
    600: '#0891b2',  // cyan-600
    700: '#0e7490',  // cyan-700
  },
  
  // Estados de severidad
  severity: {
    normal: '#0891b2',    // cyan-600
    warning: '#f59e0b',   // amber-500
    critical: '#dc2626',  // red-600
  },
  
  // Backgrounds
  bg: {
    light: '#f0f9ff',     // sky-50
    medium: '#e0f2fe',    // sky-100
    gradient: 'from-sky-50 via-cyan-50 to-sky-100',
  },
  
  // Neutrales
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
}
```

---

## 🎯 Aplicación por Componente

### WaterPulse (Gráficos)
```javascript
// Barras de consumo
normal:   'bg-cyan-600'    // Agua limpia
warning:  'bg-amber-500'   // Atención
critical: 'bg-red-600'     // Alerta urgente

// Background del gráfico
bg-white con border-gray-200
```

### MapView (Mapa)
```javascript
// Marcadores
low:    'bg-cyan-600'      // Círculo cyan
medium: 'bg-amber-500'     // Círculo amber
high:   'bg-red-600'       // Círculo rojo

// Popup
bg-white con shadow-xl
```

### AlertsList (Alertas)
```javascript
// Badges
low:    'bg-cyan-100 text-cyan-700 border-cyan-300'
medium: 'bg-amber-100 text-amber-700 border-amber-300'
high:   'bg-red-100 text-red-700 border-red-300'

// Tipos de anomalía
leak:    'bg-red-50 text-red-700'
spike:   'bg-amber-50 text-amber-700'
drop:    'bg-sky-50 text-sky-700'
savings: 'bg-cyan-50 text-cyan-700'
```

### Dashboard (Cards)
```javascript
// Tarjetas de estadísticas
bg-white con shadow-sm
Icono: text-sky-600
Números: text-sky-700 font-bold
```

### Header & Sidebar
```javascript
// Header
bg-white con border-b border-gray-200
Logo: text-sky-600

// Sidebar
bg-white
Link activo: bg-sky-50 text-sky-700 border-l-4 border-sky-600
Link hover: bg-sky-50
```

---

## 🌈 Gradientes Recomendados

```css
/* Hero / Landing */
bg-gradient-to-br from-sky-50 via-cyan-50 to-sky-100

/* Cards destacadas */
bg-gradient-to-r from-sky-500 to-cyan-500

/* Overlays */
bg-gradient-to-t from-sky-900/20 to-transparent
```

---

## 📋 Checklist de Implementación

- [ ] WaterPulse.jsx - Actualizar colores de barras
- [ ] MapView.jsx - Actualizar colores de marcadores
- [ ] AlertsList.jsx - Actualizar badges y colores
- [ ] Dashboard.jsx - Actualizar cards y estadísticas
- [ ] Header.jsx - Ya usa sky-600 ✅
- [ ] Sidebar.jsx - Actualizar links activos
- [ ] LandingPage.jsx - Ya usa gradientes sky/cyan ✅

---

## 🎨 Comparación Antes/Después

| Elemento | ❌ Antes | ✅ Después |
|----------|---------|-----------|
| Normal/Low | `bg-blue-500` | `bg-cyan-600` |
| Warning/Medium | `bg-orange-500` | `bg-amber-500` |
| Critical/High | `bg-red-500` | `bg-red-600` |
| Primary Brand | `bg-blue-600` | `bg-sky-600` |

**Ventajas:**
- ✅ Coherencia con tema del agua (cyan = agua)
- ✅ Mejor contraste y legibilidad
- ✅ Paleta profesional y moderna
- ✅ Gradientes sutiles que no sobrecargan
- ✅ Alineado con Tailwind CSS v3
