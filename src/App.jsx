// Componente raíz de la aplicación AiguaApp
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
