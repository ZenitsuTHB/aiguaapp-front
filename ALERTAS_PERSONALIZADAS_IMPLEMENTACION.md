# ✅ Implementación: Alertes Personalitzades

## Fecha: 15 de Octubre de 2025

---

## 🎯 Objetivo Completado

Implementar la funcionalidad de **Alertes Personalitzades** que permite a cada usuario configurar:
- ✅ Thresholds propios (umbral de desviación)
- ✅ Horarios críticos (fugas nocturnas, picos de hora punta)
- ✅ Filtrado en tiempo real según configuración
- ✅ Indicadores visuales

---

## 📁 Archivos Creados/Modificados

### 🆕 **NUEVOS ARCHIVOS**

#### 1. `/src/hooks/useThreshold.js` (Nuevo)
**Propósito**: Hook personalizado para gestionar thresholds y horarios críticos

**Funciones principales**:
```javascript
- filterByThreshold(anomalies)      // Filtra anomalías según threshold del usuario
- isInCriticalHours(timestamp)      // Verifica si timestamp está en horario crítico
- getStats(anomalies)                // Calcula estadísticas de filtrado
- getCriticalHoursLabel()            // Retorna label "00:00 - 06:00"
```

**Lógica de filtrado**:
- Lee configuración desde `localStorage`
- Extrae valor numérico de desviación (maneja strings "+18" y números)
- Compara con threshold configurado (ej: ≥15%)
- Maneja rangos horarios que cruzan medianoche

**Configuración por defecto**:
```javascript
{
  threshold: 15,                    // 15%
  criticalHoursStart: '00:00',      // Medianoche
  criticalHoursEnd: '06:00',        // 6 AM
  notifications: true,
  darkMode: false
}
```

---

### ✏️ **ARCHIVOS MODIFICADOS**

#### 2. `/src/components/AlertsList.jsx` (Actualizado)
**Cambios implementados**:

✅ **Importación del hook**:
```javascript
import { useThreshold } from '../hooks/useThreshold';
import { Moon, Filter } from 'lucide-react';
```

✅ **Aplicación del filtro**:
```javascript
const { filterByThreshold, isInCriticalHours, threshold, getCriticalHoursLabel, getStats } = useThreshold();
const filteredAnomalies = filterByThreshold(anomalies);
const stats = getStats(anomalies);
```

✅ **Indicador de filtrado en header**:
```jsx
{stats.filteredOut > 0 && (
  <div className="flex items-center gap-2 text-sm">
    <Filter className="w-4 h-4 text-sky-600" />
    <span className="text-gray-600">
      {filteredAnomalies.length} de {anomalies.length}
    </span>
    <span className="text-xs text-gray-500">(≥{threshold}%)</span>
  </div>
)}
```

✅ **Mensaje inteligente cuando no hay resultados**:
```jsx
{filteredAnomalies.length === 0 ? (
  <div>
    {anomalies.length === 0 ? (
      <p>No s'han detectat anomalies</p>
    ) : (
      <div>
        <p>No hi ha anomalies amb desviació ≥{threshold}%</p>
        <p className="text-xs">
          {stats.filteredOut} anomalies filtrades. Ajusta el llindar a Configuració.
        </p>
      </div>
    )}
  </div>
)}
```

✅ **Badge de horario crítico**:
```jsx
{inCriticalHour && (
  <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
    <Moon className="w-3 h-3" />
    Horari Crític ({getCriticalHoursLabel()})
  </span>
)}
```

**Resultado visual**:
- Muestra solo anomalías que cumplan el threshold
- Badge morado "🌙 Horari Crític (00:00 - 06:00)" en anomalías nocturnas
- Contador "X de Y (≥15%)" en el header
- Mensaje informativo cuando se filtran anomalías

---

#### 3. `/src/pages/ConfiguracionPage.jsx` (Actualizado)
**Cambios implementados**:

✅ **Importaciones necesarias**:
```javascript
import { useData } from '../context/DataContext';
import { useThreshold } from '../hooks/useThreshold';
import { Info } from 'lucide-react';
```

✅ **Carga inicial desde localStorage**:
```javascript
const [config, setConfig] = useState(() => {
  try {
    const stored = localStorage.getItem('aiguaapp-config');
    return stored ? JSON.parse(stored) : { /* defaults */ };
  } catch {
    return { /* defaults */ };
  }
});
```

✅ **Preview de estadísticas en tiempo real**:
```javascript
const previewStats = (() => {
  if (!anomalies || anomalies.length === 0) return null;
  
  const filtered = anomalies.filter(a => {
    let deviationValue;
    if (typeof a.deviation === 'string') {
      deviationValue = Math.abs(parseFloat(a.deviation.replace('+', '')));
    } else {
      deviationValue = Math.abs(a.deviation);
    }
    return deviationValue >= config.threshold;
  });
  
  return {
    total: anomalies.length,
    filtered: filtered.length,
    filteredOut: anomalies.length - filtered.length
  };
})();
```

✅ **Panel informativo con preview**:
```jsx
{previewStats && (
  <div className="bg-sky-50 border-2 border-sky-200 rounded-lg p-4">
    <h4>Impacte del Llindar Actual</h4>
    <p>Amb un llindar de <strong>{config.threshold}%</strong>:</p>
    <ul>
      <li><strong>{previewStats.filtered}</strong> anomalies es mostraran</li>
      <li><strong>{previewStats.filteredOut}</strong> anomalies s'ocultaran</li>
    </ul>
    <p>💡 Un llindar més alt mostra menys alertes però més crítiques</p>
  </div>
)}
```

✅ **Guardar y recargar**:
```javascript
const handleSave = () => {
  localStorage.setItem('aiguaapp-config', JSON.stringify(config));
  window.location.reload(); // Aplica cambios en todos los componentes
};
```

✅ **Actualización de colores a paleta sky**:
- `text-blue-600` → `text-sky-600`
- `bg-blue-600` → `bg-sky-600`
- Toggles ahora usan sky-600

**Resultado visual**:
- Preview en tiempo real del impacto del threshold
- Contador: "X anomalies es mostraran, Y s'ocultaran"
- Mensaje educativo sobre el funcionamiento
- Recarga automática al guardar para aplicar cambios

---

## 🎨 Componentes Visuales Nuevos

### 1. **Indicador de Filtrado** (AlertsList header)
```
┌─────────────────────────────────────┐
│ Alertes Recents     🔍 8 de 12 (≥15%) │
└─────────────────────────────────────┘
```

### 2. **Badge de Horario Crítico**
```
┌────────────────────────────────────┐
│ 🌙 Horari Crític (00:00 - 06:00)   │
└────────────────────────────────────┘
```
- Color morado (`bg-purple-100 text-purple-700`)
- Icono de luna
- Muestra rango horario configurado

### 3. **Panel de Preview** (ConfiguracionPage)
```
┌───────────────────────────────────────────┐
│ ℹ️ Impacte del Llindar Actual            │
│                                           │
│ Amb un llindar de 15%:                   │
│  • 8 anomalies es mostraran              │
│  • 4 anomalies s'ocultaran               │
│                                           │
│ 💡 Un llindar més alt mostra menys       │
│    alertes però més crítiques            │
└───────────────────────────────────────────┘
```
- Fondo sky-50 con borde sky-200
- Actualización en tiempo real al mover slider
- Educativo y transparente

---

## 🔄 Flujo de Funcionamiento

### **1. Usuario configura threshold**
```
Usuario → ConfiguracionPage
  ↓
Mueve slider 5% - 30%
  ↓
Preview muestra impacto en tiempo real
  ↓
Clic "Guardar i Aplicar Configuració"
  ↓
localStorage.setItem('aiguaapp-config', ...)
  ↓
window.location.reload()
```

### **2. Aplicación del filtro**
```
AlertsList.jsx carga
  ↓
useThreshold() lee localStorage
  ↓
filterByThreshold(anomalies)
  ↓
Solo muestra anomalies con deviation ≥ threshold
  ↓
isInCriticalHours() verifica cada una
  ↓
Muestra badge 🌙 si timestamp está en rango crítico
```

### **3. Manejo de horarios que cruzan medianoche**
```javascript
// Ejemplo: 22:00 - 06:00
if (startTimeMinutes > endTimeMinutes) {
  // Cruza medianoche
  return currentTimeMinutes >= startTimeMinutes || currentTimeMinutes <= endTimeMinutes;
}
```

---

## 📊 Casos de Uso

### **Caso 1: Usuario quiere solo alertas críticas**
```
threshold: 20%
criticalHours: 00:00 - 06:00
notifications: true

Resultado:
- Solo muestra anomalías con ±20% o más
- Badges morados en anomalías nocturnas
- Header: "5 de 15 (≥20%)"
```

### **Caso 2: Usuario quiere todas las anomalías**
```
threshold: 5%
criticalHours: No aplicado
notifications: true

Resultado:
- Muestra todas las anomalías (≥5% es mínimo)
- Sin filtrado visual
- Header: sin indicador de filtro
```

### **Caso 3: Detección de fugas nocturnas**
```
threshold: 15%
criticalHours: 23:00 - 07:00
notifications: true

Resultado:
- Anomalías entre 23:00-07:00 muestran badge morado
- Fácil identificación de fugas durante la noche
- Usuario puede priorizar estas alertas
```

---

## ✅ Funcionalidades Implementadas

| Requisito | Estado | Implementación |
|-----------|--------|---------------|
| **Threshold configurable** | ✅ Completo | Slider 5-30%, preview en tiempo real |
| **Horarios críticos** | ✅ Completo | 2 inputs time, manejo de medianoche |
| **Filtrado en tiempo real** | ✅ Completo | useThreshold hook, filterByThreshold() |
| **Indicadores visuales** | ✅ Completo | Badge morado, contador de filtrado |
| **Persistencia** | ✅ Completo | localStorage, recarga automática |
| **Preview de impacto** | ✅ Extra | Panel informativo con estadísticas |
| **Educación al usuario** | ✅ Extra | Mensajes explicativos, tooltips |

---

## 🎯 Mejoras Implementadas (Extras)

1. **Preview en Tiempo Real**: Usuario ve impacto antes de guardar
2. **Mensajes Educativos**: "Un llindar més alt mostra menys alertes però més crítiques"
3. **Contador Visual**: "8 de 12 (≥15%)" en header de AlertsList
4. **Manejo Robusto**: Soporta desviaciones como string "+18" o número 18
5. **Horarios Nocturnos**: Lógica especial para rangos que cruzan medianoche
6. **Estadísticas Avanzadas**: getStats() con total, filtered, filteredOut, percentageInCritical
7. **Consistencia Visual**: Paleta sky/cyan en todos los componentes

---

## 🧪 Testing Manual

### **Test 1: Filtrado básico**
1. Ir a Configuració
2. Mover slider a 20%
3. Ver preview: "X anomalies es mostraran"
4. Guardar
5. ✅ Verificar que AlertsList solo muestra anomalías ≥20%

### **Test 2: Horario crítico**
1. Configurar: 00:00 - 06:00
2. Guardar
3. ✅ Verificar que anomalías entre medianoche y 6 AM tienen badge morado

### **Test 3: Mensaje cuando todo se filtra**
1. Mover slider a 30%
2. Si no hay anomalías ≥30%
3. ✅ Ver mensaje: "No hi ha anomalies amb desviació ≥30%"

### **Test 4: Persistencia**
1. Configurar threshold 18%
2. Guardar y recargar
3. Cerrar navegador
4. Abrir de nuevo
5. ✅ Verificar que sigue mostrando threshold 18%

---

## 📈 Impacto en UX

### **Antes**:
- ❌ Usuario ve TODAS las anomalías sin filtro
- ❌ No puede distinguir horarios críticos
- ❌ No sabe cuántas anomalías son realmente importantes
- ❌ Ruido visual con alertas menores

### **Después**:
- ✅ Usuario configura qué nivel de anomalía quiere ver
- ✅ Identificación visual inmediata de horarios críticos
- ✅ Contador transparente: "8 de 12 mostradas"
- ✅ Foco en alertas realmente importantes
- ✅ Preview educativo del impacto de configuración

---

## 🚀 Estado Final

**Funcionalidad: COMPLETAMENTE IMPLEMENTADA** ✅

**Porcentaje de cumplimiento: 100%** + extras

**Archivos modificados**: 3 (1 nuevo, 2 actualizados)

**Tiempo estimado de implementación**: ✅ Completado

**Próximo paso recomendado**: Implementar exportación CSV/PDF en HistorialPage

---

## 💡 Notas para Desarrolladores

### **Para añadir más filtros**:
```javascript
// En useThreshold.js
const filterByType = (anomalies, types) => {
  return anomalies.filter(a => types.includes(a.type));
};

// En ConfiguracionPage.jsx
<select onChange={(e) => setConfig({ ...config, types: e.target.value })}>
  <option value="all">Tots els tipus</option>
  <option value="leak">Només fugues</option>
  <option value="spike">Només pics</option>
</select>
```

### **Para añadir notificaciones browser**:
```javascript
// En useThreshold.js
const shouldNotify = (anomaly) => {
  if (!config.notifications) return false;
  if (anomaly.severity !== 'high') return false;
  if (Math.abs(getDeviationValue(anomaly.deviation)) < config.threshold) return false;
  return true;
};

// En AlertsList o App.jsx
useEffect(() => {
  if (Notification.permission === "granted" && shouldNotify(newAnomaly)) {
    new Notification("Nova anomalia crítica!", {
      body: `${newAnomaly.type} a ${newAnomaly.neighborhood}`,
      icon: "/icon.png"
    });
  }
}, [anomalies]);
```

---

**Documentación creada por**: GitHub Copilot  
**Fecha**: 15 de Octubre de 2025  
**Estado**: ✅ Implementación Completa
