import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './estilos css/index.css';
import App from './App.jsx';
import { AuthProvider } from './state/AuthContext.jsx'; // Asegúrate de la ruta correcta

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);