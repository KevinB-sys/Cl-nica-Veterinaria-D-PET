import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Agendar from './pages/Agendar';
import About from './pages/About';
import Services from './pages/Services';
import './estilos css/App.css';
import Layout from './layouts/Layout';
import HomeContent from './components/HomeContent';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carnet from './pages/Carnet';
import CrearCarnet from './pages/CrearCarnet';
import ListarCarnet from './pages/ListarCarnet';
import Vercarnet from './pages/Vercarnet';
import Editarcarnet from './pages/Editarcarnet';
import Calendario from './pages/Calendario';
import PrivateRoute from './components/PrivateRoute'; // Importa el PrivateRoute modificado
import Addcarnet from './pages/Addcarnet';
import Profile from './pages/Profile';
import ReactModal from "react-modal";
import Recuperacion from './pages/Recuperacion';
import Reset from './pages/Reset'; // Asegúrate de que la ruta sea correcta
import RegistrarVet from'./pages/RegistrarVet';
import Administrar from './pages/Administrar';
import Horario from './pages/Horario';
import Citas from './pages/Citas'; // Asegúrate de que la ruta sea correcta

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeContent />} />
          <Route path="/about" element={<About />} />
          {/* Ruta de Servicios protegida para administradores (rol_id: 1) */}
          <Route
            path="/services"
            element={
              <PrivateRoute allowedRoles={[1, 3]}>
                <Services />
              </PrivateRoute>
            }
          />
          <Route path="/Agendar" element={<PrivateRoute allowedRoles={[1, 2, 3]}><Agendar /></PrivateRoute>} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registro" element={<Registro />} />
          {/* Rutas de Carnet protegidas para administradores (rol_id: 1) */}
          <Route path="/Carnet" element={<PrivateRoute allowedRoles={[1, 3]}><Carnet /></PrivateRoute>} />
          <Route path="/CrearCarnet" element={<PrivateRoute allowedRoles={[1, 3]}><CrearCarnet /></PrivateRoute>} />
          <Route path="/ListarCarnet" element={<PrivateRoute allowedRoles={[1, 2, 3]}><ListarCarnet /></PrivateRoute>} />
          {/* <Route path="/Vercarnet" element={<PrivateRoute allowedRoles={[1, 2, 3]}><Vercarnet /></PrivateRoute>} /> */}
          <Route path="/Vercarnet/:id" element={<PrivateRoute allowedRoles={[1, 2, 3]}><Vercarnet /></PrivateRoute>} />
          {/* Ruta para editar el carnet de vacunación */}
          <Route path="/Editarcarnet" element={<PrivateRoute allowedRoles={[1, 3]}><Editarcarnet /></PrivateRoute>} />
          <Route path="/Calendario" element={<PrivateRoute allowedRoles={[1, 2, 3]}><Calendario /></PrivateRoute>} />
          {/* <Route path="/Addcarnet" element={<PrivateRoute allowedRoles={[1, 3]}><Addcarnet /></PrivateRoute>} /> */}
          <Route path="/Addcarnet/:id" element={<PrivateRoute allowedRoles={[1, 3]}><Addcarnet /></PrivateRoute>} />
          <Route path="/Profile" element={<PrivateRoute allowedRoles={[1, 2, 3]}><Profile /></PrivateRoute>} />
          <Route path="/Recuperacion" element={<Recuperacion />} /> {/* La recuperación usualmente es pública */}
          <Route path="/Reset" element={<Reset />} /> {/* Ruta para restablecer la contraseña */}
          <Route path="/RegistrarVet" element={<PrivateRoute allowedRoles={[3]}><RegistrarVet /></PrivateRoute>} />
          <Route path="/Administrar" element={<PrivateRoute allowedRoles={[3]}><Administrar /></PrivateRoute>} />
          <Route path="/Horario" element={<PrivateRoute allowedRoles={[3]}><Horario /></PrivateRoute>} />
          <Route path="/Citas" element={<PrivateRoute allowedRoles={[1, 2, 3]}><Citas /></PrivateRoute>} />

        </Route>
      </Routes>
    </Router>
  );
};
ReactModal.setAppElement("#root");
export default App;