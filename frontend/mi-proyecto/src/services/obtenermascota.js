// src/services/obtenermascota.js (o el nombre que uses para tu servicio de mascotas)

const API_BASE_URL = 'http://localhost:5000/api'; // Asegúrate de que esta URL sea la correcta

/**
 * Función para obtener todas las mascotas.
 * Requiere un token de autenticación para la autorización.
 */
export const getAllMascotas = async () => {
    try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage

        if (!token) {
            throw new Error("No se encontró token de autenticación. Por favor, inicie sesión.");
        }

        const res = await fetch(`${API_BASE_URL}/mascotas`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Incluir el token en el header de autorización
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al obtener todas las mascotas.");
        }

        return await res.json();
    } catch (error) {
        console.error("Error en getAllMascotas:", error);
        // Devolvemos el error para que el componente lo maneje, no un objeto { state: "error" }
        // porque el componente ListarCarnet ya espera un error para manejar el estado.
        throw error;
    }
};

/**
 * Función para obtener mascotas filtradas por el ID del dueño.
 * Requiere un token de autenticación para la autorización.
 */
export const getMascotasByDuenioId = async (duenioId) => {
    try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage

        if (!token) {
            throw new Error("No se encontró token de autenticación. Por favor, inicie sesión.");
        }

        const response = await fetch(`${API_BASE_URL}/mascotas/usuario/${duenioId}`, {
            method: "GET", // Aunque fetch por defecto es GET, es buena práctica especificarlo
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluir el token en los headers
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener las mascotas del dueño.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching mascotas by duenio ID:', error);
        throw error; // Re-lanza el error para que el componente pueda manejarlo
    }
};


//Obtener mascota por ID
export const getMascotaById = async (mascotaId) => {
    try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage

        if (!token) {
            throw new Error("No se encontró token de autenticación. Por favor, inicie sesión.");
        }

        const response = await fetch(`${API_BASE_URL}/mascotas/${mascotaId}`, {
            method: "GET", // Aunque fetch por defecto es GET, es buena práctica especificarlo
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluir el token en los headers
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener la mascota por ID.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching mascota by ID:', error);
        throw error; // Re-lanza el error para que el componente pueda manejarlo
    }
};