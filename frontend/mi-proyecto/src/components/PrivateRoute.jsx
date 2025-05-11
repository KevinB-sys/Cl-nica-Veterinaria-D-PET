import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react"; // Importamos useEffect y useNavigate
import AuthContext from "../state/AuthContext.jsx";
import Swal from 'sweetalert2'; // Importamos SweetAlert

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    if (user && allowedRoles && !allowedRoles.includes(role)) {
      // Si el usuario está autenticado, tiene roles permitidos definidos,
      // pero su rol no está incluido, mostramos la Sweet Alert y redirigimos.
      Swal.fire({
        title: 'Acceso Denegado',
        text: 'Solo el veterinario tiene permiso para acceder a esta página.',
        icon: 'warning',
        confirmButtonText: 'Ir al Inicio'
      }).then(() => {
        navigate('/'); // Redirigimos al home al hacer clic en "Ir al Inicio"
      });
    }
  }, [user, role, allowedRoles, navigate]);

  // Si no hay usuario autenticado, redirige al login inmediatamente.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si no se especifican roles permitidos, o el usuario tiene el rol permitido,
  // renderiza el componente hijo.
  if (!allowedRoles || allowedRoles.includes(role)) {
    return children;
  }

  // Si llegamos aquí, significa que la Sweet Alert ya se ha mostrado
  // y la redirección se está manejando allí. Podemos devolver null
  // para evitar que se renderice algo más.
  return null;
};

export default PrivateRoute;