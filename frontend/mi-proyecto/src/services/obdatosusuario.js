const API_BASE_URL = "http://localhost:5000/api/usuarios"; // Define la URL base de tu API

export const getUsuarioById = async (id) => {
    try {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Error al obtener el usuario con ID: ${id}`);
        }

        return await res.json();
    } catch (error) {
        console.error(`Error en getUsuarioById con ID ${id}:`, error);
        return { state: "error", message: error.message || "Error en la conexión con el servidor" };
    }
};

export const updateUsuario = async (id, userData) => {
    try {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Error al actualizar el usuario con ID: ${id}`);
        }

        return await res.json();
    } catch (error) {
        console.error(`Error en updateUsuario con ID ${id}:`, error);
        return { state: "error", message: error.message || "Error en la conexión con el servidor" };
    }
};
