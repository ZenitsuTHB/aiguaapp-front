# 💧 AiguaBeat — Gestió sostenible dels recursos hídrics a Catalunya

![Logo del projecte](./src/assets/logo.png)

---

## 🌍 Context i repte

> **Repte 3 — Gestió sostenible dels recursos hídrics a Catalunya**  
> Hackató IT Academy 2025 | Medi ambient i sostenibilitat  
> **ODS 6:** Aigua neta i sanejament | **ODS 13:** Acció pel clima

L’aigua és un recurs fonamental per al benestar de la població, el funcionament de l’economia i la sostenibilitat ambiental.  
A les ciutats, el consum d’aigua sovint es manté alt malgrat les campanyes d’estalvi i conscienciació.  
La nostra proposta busca fer visible **on, quan i com** es produeixen consums anòmals o ineficients.

---

## 🚀 Objectiu del projecte

Desenvolupar una **aplicació web interactiva** que permeti:

- 📊 Monitorar el consum d’aigua per barri i hora.
- ⚠️ Detectar automàticament **anomalies** (fugues, pics o caigudes brusques).
- 💬 Generar **alertes personalitzades** segons llindars definits per l’usuari.
- 🗺️ Visualitzar dades en un **mapa dinàmic** amb codis de color.
- 🌦️ Contextualitzar el consum amb dades meteorològiques (pluja i temperatura).
- 📧 Enviar notificacions o informes periòdics (simulats).

---

## 💡 Solució proposada

**AiguaBeat** és una eina visual i intuïtiva que mostra en temps real l’estat del consum d’aigua a Barcelona.

- Mapa interactiu amb **Leaflet + React**
- Classificació automàtica de barris segons estat:
  - 🟢 **Normal**
  - 🟡 **Atenció**
  - 🔴 **Crític**
- Sistema d’alertes personalitzat
- Dashboard amb estadístiques globals

---

## 🧭 Arquitectura del projecte


## 📁 Estructura del projecte

```bash
📦 aiguabeat/
├── 📁 public/                     
│
├── 📁 src/                        
│   ├── 📁 assets/                             
│   │
│   ├── 📁 components/             
│   │   ├── Dashboard.jsx         
│   │   ├── MapView.jsx           
│   │   ├── AlertsList.jsx         
│   │   └── WaterPulse.jsx         
│   │
│   ├── 📁 services/               
│   │   └── api.js                 # Consumo de API REST real
│   │
│   ├── App.jsx                    
│   ├── main.jsx                   
│   └── index.css                  
│
├── .env                           # Configuración de la API
├── package.json                  
└── README.md                     




## ⚙️ Eines i tecnologies utilitzades

| Àmbit | Eina / Llibreria | Descripció |
|-------|------------------|-------------|
| Frontend | **React + Vite** | Estructura SPA, alta velocitat de compilació |
| Estils | **Tailwind CSS** | Disseny responsive i personalitzable |
| Mapa | **Leaflet.js** | Visualització geogràfica de barris i anomalies |
| Icons | **Lucide-react** | Iconografia moderna i vectorial |
| Backend API | **REST API** | Consum de dades reals del backend |
| Actualització | **Auto-refresh** | Dades actualitzades cada 30 segons |

---

## 🖥️ Frontend (React + Tailwind + Leaflet)

📸 *Afegeix aquí les teves captures de pantalla del front:*

- **Pantalla principal / Dashboard**
  <!-- 📸 -->  
  *(inserta aquí la captura del dashboard complet)*

- **Mapa de Barcelona amb alertes**
  <!-- 📸 -->  
  *(inserta aquí la captura del mapa Leaflet amb els punts de color)*

- **Detall del popup / tooltip**
  <!-- 📸 -->  
  *(inserta aquí la captura del popup amb consum i desviació)*

- **Alertes o estadístiques addicionals**
  <!-- 📸 -->  
  *(inserta aquí la captura del llistat o gràfic d’anomalies)*

---

## 🧮 Dades utilitzades

| Font | Descripció |
|------|-------------|
| **API Backend** | Dades reals del backend en temps real |
| `/consumption/summary` | Resum del consum per barri amb anomalies |
| `/anomalies/` | Llistat d'anomalies detectades |
| `/consumption/` | Registres de consums i incidents |

---

🏗️ Frameworks i llibreries utilitzades

⚛️ React — Componentització del frontend

💨 Tailwind CSS — Estils responsive i ràpids

🗺️ Leaflet.js — Mapa interactiu per a visualitzar barris i anomalies

🧩 Lucide-react — Icones modernes i minimalistes

🌐 REST API — Consum de dades reals del backend

---


## ⚙️ Instal·lació i execució

### 1. Instal·lar dependències
```bash
npm install
```

### 2. Configurar l'API

Crea un fitxer `.env` a l'arrel del projecte:

```env
# URL base de la API real
VITE_API_URL=https://repteweb-backend.onrender.com
```

**Nota:** L'aplicació utilitza exclusivament dades reals del backend.

### 3. Executar l'aplicació

```bash
# Modo desenvolupament
npm run dev

# Compilar per producció
npm run build
```

---

## 🔌 API Endpoints

L'aplicació consumeix els següents endpoints:

| Endpoint | Mètode | Descripció |
|----------|--------|------------|
| `/consumption/summary` | GET | Resum del consum d'aigua per barri |
| `/consumption/` | GET | Llistat de consums/incidents |
| `/anomalies/` | GET | Anomalies detectades al sistema |

**Documentació completa:** Veure [API_CONFIG.md](./API_CONFIG.md)

---
