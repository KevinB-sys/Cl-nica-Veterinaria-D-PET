import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Importar las rutas
import Agendar from './pages/Agendar'; //Pestaña de agendar cita
import About from './pages/About'; //Pestaña de Nosotros 
import Services from './pages/Services'; //Pestaña de servicios 
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
import PrivateRoute from './components/PrivateRoute';
import Addcarnet from './pages/Addcarnet'; //Pestaña de añadir carnet
import Profile from './pages/Profile'; //Pestaña de perfil
import ReactModal from "react-modal";
import Recuperacion from './pages/Recuperacion'; //Pestaña de recuperación de contraseña


const App = () => {
  return (
    <Router>  {/* Asegúrate de envolver todo con Router */}

      <Routes>
        {/* Definir las rutas aquí */}
        <Route element={<Layout />}>  
          <Route path="/" element={<HomeContent />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          {/* <Route 
      path="/services" 
      element={
        <PrivateRoute>
          <Services />
        </PrivateRoute>
      } 
    /> */}
          <Route path="/Agendar" element={<Agendar />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Carnet" element={<Carnet />} />
          <Route path="/CrearCarnet" element={<CrearCarnet />} />
          <Route path="/ListarCarnet" element={<ListarCarnet />} />
          <Route path="/Vercarnet" element={<Vercarnet />} />
          <Route path="/Editarcarnet" element={<Editarcarnet />} />
          <Route path="/Calendario" element={<Calendario />} />
          <Route path="/Addcarnet" element={<Addcarnet />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Recuperacion" element={<Recuperacion />} />
        </Route>
      </Routes>
    </Router>
  );
};
ReactModal.setAppElement("#root");
export default App;
