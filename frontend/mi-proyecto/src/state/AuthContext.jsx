import { createContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from '../services/authService.js';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // Guardar el rol
 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        setRole(decodedToken.rol_id);
      } catch (error) {
        console.error('Token inválido:', error);
        // No llamamos a logout() aquí directamente.
        // Dejamos que el componente maneje la ausencia de usuario.
      }
    }
   
  }, []);

  const login = async (userData) => {
    try {
      const { token } = await loginUser(userData);
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
      setRole(decodedToken.rol_id);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    logoutUser();
    localStorage.removeItem('token'); // Limpia el token al cerrar sesión
    setUser(null);
    setRole(null);
  };


  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;