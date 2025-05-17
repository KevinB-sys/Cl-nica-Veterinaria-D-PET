// import api from './api';

// Función de registro
export const registerUser = async (userData) => {
    //   try {
    //     const response = await api.post('/usuarios/register', userData);
    //     return response.data;
    //   } catch (error) {
    //     throw new Error(error.response?.data?.message || 'Error en el registro');
    //   }
    try {
        const res = await fetch("http://localhost:5000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        return res.json();
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error en el registro');
    }

};
export const registerVet = async (userData) => {
    //   try {
    //     const response = await api.post('/usuarios/register', userData);
    //     return response.data;
    //   } catch (error) {
    //     throw new Error(error.response?.data?.message || 'Error en el registro');
    //   }
    try {
        const res = await fetch("http://localhost:5000/auth/registerveterinario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        return res.json();
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error en el registro');
    }

};

// Función de login
export const loginUser = async ({email, password}) => {
    // try {
    //     const response = await api.post('/usuarios/login', userData);
    //     return response.data.token;  // Devuelves el token para almacenarlo
    // } catch (error) {
    //     throw new Error(error.response?.data?.message || 'Error en el login');
    // }

    try {
        const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
              });

              return res.json();
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error en el login');
        
    }
};

// Función de logout
export const logoutUser = () => {
    localStorage.removeItem('token');  // Eliminar el token del localStorage
};
