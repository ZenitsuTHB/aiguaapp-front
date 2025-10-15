# 🧭 Sistema de Navegación - Guía de Uso Rápida

## 🚀 Uso en Componentes

### **1. Navegación Básica**

```jsx
import { useNavigation } from '../hooks/useNavigation';

function MiComponente() {
  const { goTo, goBack } = useNavigation();
  
  return (
    <>
      <button onClick={() => goTo('dashboard')}>Ir al Dashboard</button>
      <button onClick={() => goTo('mapa')}>Ver Mapa</button>
      <button onClick={() => goTo('historial')}>Ver Historial</button>
      <button onClick={goBack}>Volver</button>
    </>
  );
}
```

### **2. Verificar Página Actual**

```jsx
const { currentRoute, isActive } = useNavigation();

// Obtener información de la página actual
console.log(currentRoute.name);        // "Dashboard"
console.log(currentRoute.path);        // "/dashboard"
console.log(currentRoute.description); // "Vista general del consum..."

// Verificar si estamos en una página específica
{isActive('dashboard') && <p>Estás en el Dashboard</p>}
```

### **3. Navegación con Estado**

```jsx
const { navigate } = useNavigation();

// Pasar datos a la siguiente página
const handleVerMapa = (anomalyId) => {
  navigate('/mapa', { 
    state: { 
      anomalyId,
      shouldHighlight: true 
    } 
  });
};

// En la página de destino (MapaPage)
import { useLocation } from 'react-router-dom';

function MapaPage() {
  const location = useLocation();
  const { anomalyId, shouldHighlight } = location.state || {};
  
  // Usar los datos...
}
```

---

## 📋 Rutas Disponibles

Todas las rutas están en `/src/config/routes.js`:

| Nombre | Path | Descripción |
|--------|------|-------------|
| `landing` | `/` | Página inicial pública |
| `dashboard` | `/dashboard` | Vista general del consum |
| `mapa` | `/mapa` | Mapa d'incidències per barris |
| `historial` | `/historial` | Informe històric d'anomalies |
| `configuracion` | `/configuracion` | Paràmetres i preferències |

---

## 🎯 Ejemplos por Caso de Uso

### **Caso 1: Card Clickeable que Navega**

```jsx
<div 
  onClick={() => goTo('mapa')}
  className="p-4 bg-white rounded-lg cursor-pointer hover:shadow-lg"
>
  <h3>Incidències al Mapa</h3>
  <p>12 incidències actives</p>
</div>
```

### **Caso 2: Botón "Guardar y Volver"**

```jsx
const handleSave = () => {
  // Guardar datos
  localStorage.setItem('config', JSON.stringify(config));
  
  // Volver al dashboard
  goTo('dashboard');
};

<button onClick={handleSave}>Guardar</button>
```

### **Caso 3: Menú Dropdown con Navegación**

```jsx
const { goTo, currentRoute } = useNavigation();

<select 
  value={currentRoute?.name} 
  onChange={(e) => goTo(e.target.value)}
>
  <option value="dashboard">Dashboard</option>
  <option value="mapa">Mapa</option>
  <option value="historial">Historial</option>
  <option value="configuracion">Configuració</option>
</select>
```

### **Caso 4: Breadcrumbs Personalizados**

```jsx
import { Breadcrumbs } from '../components/Breadcrumbs';

// Usar el componente incluido
<Breadcrumbs />

// O crear uno personalizado
const { currentRoute } = useNavigation();

<nav className="flex items-center gap-2">
  <span>🏠</span>
  <span>›</span>
  <span>{currentRoute?.name}</span>
</nav>
```

### **Caso 5: Redirigir Después de Login**

```jsx
const handleLogin = () => {
  // Hacer login...
  
  // Redirigir al dashboard
  replaceTo('dashboard'); // No permite volver atrás con el botón del navegador
};
```

---

## 🎨 Componentes Incluidos

### **NavigationButtons**

Botones de atrás/adelante (ya integrados en el Header):

```jsx
import { NavigationButtons } from '../components/NavigationButtons';

<NavigationButtons />
```

### **Breadcrumbs**

Migajas de pan automáticas:

```jsx
import { Breadcrumbs } from '../components/Breadcrumbs';

<Breadcrumbs />
// Muestra: 🏠 › Dashboard
```

---

## ⚡ Tips y Trucos

### **1. Navegación Condicional**

```jsx
const handleAction = () => {
  if (condition) {
    goTo('dashboard');
  } else {
    goTo('configuracion');
  }
};
```

### **2. Navegar y Scroll al Top**

```jsx
const handleNavigate = () => {
  goTo('historial');
  window.scrollTo(0, 0);
};
```

### **3. Confirmar antes de Navegar**

```jsx
const handleNavigate = () => {
  if (confirm('Tens canvis sense guardar. Continuar?')) {
    goTo('dashboard');
  }
};
```

### **4. Navegación con Delay**

```jsx
const handleSave = () => {
  // Guardar...
  
  // Mostrar mensaje
  toast.success('Guardat correctament!');
  
  // Navegar después de 1 segundo
  setTimeout(() => {
    goTo('dashboard');
  }, 1000);
};
```

---

## 🔍 Debugging

### **Ver Ruta Actual en Consola**

```jsx
const { currentRoute, currentPath } = useNavigation();

useEffect(() => {
  console.log('Ruta actual:', currentRoute);
  console.log('Path actual:', currentPath);
}, [currentRoute, currentPath]);
```

### **Ver Todas las Rutas Disponibles**

```jsx
const { routes } = useNavigation();

console.log('Rutas disponibles:', routes);
```

---

## ✅ Checklist de Implementación

- [x] Configuración de rutas centralizada (`/src/config/routes.js`)
- [x] Hook personalizado `useNavigation()`
- [x] Componente `Breadcrumbs`
- [x] Componente `NavigationButtons`
- [x] Sidebar actualizado con rutas dinámicas
- [x] Header integrado con navegación
- [x] 0 errores de compilación
- [x] Compatible con tu App.jsx actual

---

**¡Listo para usar!** 🎉

Tu aplicación ahora tiene un sistema de navegación profesional, escalable y fácil de mantener.
