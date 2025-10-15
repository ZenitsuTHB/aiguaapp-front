# Configuración de la API

## Endpoints Disponibles

La aplicación consume los siguientes endpoints de la API:

### 1. Resumen de Consumo
**Endpoint:** `GET /consumption/summary`

**Respuesta:**
```json
[
  {
    "id": 1,
    "neighborhood": "Sants-Montjuic",
    "type": "spike",
    "severity": "high",
    "liters": 240.8,
    "deviation": 18,
    "timestamp": "2025-10-15T08:00"
  }
]
```

### 2. Consumos/Incidentes
**Endpoint:** `GET /consumption/`

**Respuesta:**
```json
[
  {
    "id": 1,
    "neighborhood": "Gracia",
    "type": "leak",
    "severity": "high",
    "liters": 512.4,
    "deviation": 24,
    "timestamp": "2025-10-15T03:00"
  }
]
```

### 3. Anomalías
**Endpoint:** `GET /anomalies/`

**Respuesta:**
```json
[
  {
    "id": 1,
    "neighborhood": "Gracia",
    "type": "leak",
    "severity": "high",
    "liters": 510.2,
    "deviation": "+18",
    "timestamp": "2025-10-15T03:00"
  }
]
```

## Configuración

### Archivo .env

Crea un archivo `.env` en la raíz del proyecto con la siguiente variable:

```env
# URL base de la API real
VITE_API_URL=https://repteweb-backend.onrender.com
```

**Nota:** La aplicación ahora usa **exclusivamente datos reales del backend**. El modo mock ha sido eliminado.

## Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación consumirá automáticamente los datos reales de la API configurada en `VITE_API_URL`.

## Estructura del Servicio API

El archivo `src/services/api.js` contiene tres funciones principales:

- `getConsumption()`: Obtiene el resumen de consumo
- `getAnomalies()`: Obtiene las anomalías detectadas
- `getLatestIncidents()`: Obtiene los últimos incidentes

Todas las funciones incluyen:
- Manejo de errores
- Soporte para modo mock
- Logs de errores en consola

## Actualización Automática

El Dashboard actualiza los datos automáticamente cada **30 segundos** mientras esté abierto.

## Manejo de Errores

Si hay un error al conectar con la API:
- Se muestra un mensaje de error en el Dashboard
- Se registra el error en la consola del navegador
- La aplicación mantiene los datos anteriores si los hay

## Campos de los Datos

Todos los endpoints devuelven objetos con los siguientes campos:

- `id`: Identificador único
- `neighborhood`: Nombre del barrio
- `type`: Tipo de anomalía (`spike`, `leak`, `drop`)
- `severity`: Nivel de severidad (`high`, `medium`, `low`)
- `liters`: Cantidad de litros
- `deviation`: Desviación (puede ser número o string con signo)
- `timestamp`: Fecha y hora del registro
