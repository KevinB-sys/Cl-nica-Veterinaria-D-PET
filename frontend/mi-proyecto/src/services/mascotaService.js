export const registermascota = async (userData) => {
    try {
        const res = await fetch("http://localhost:5000/api/mascotas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        // Si la respuesta no es exitosa, lanzar un error con el mensaje del servidor
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error en el registro");
        }

        return await res.json();
    } catch (error) {
        console.error("Error en registermascota:", error);
        return { state: "error", message: error.message || "Error en la conexión con el servidor" };
    }
};

//Editar mascota por id ---
export const updateMascota = async (mascota_id, userData) => {
    try {
        const res = await fetch(`http://localhost:5000/api/mascotas/${mascota_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        // Si la respuesta no es exitosa, lanzar un error con el mensaje del servidor
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al actualizar la mascota");
        }

        return await res.json();
    } catch (error) {
        console.error("Error en updateMascota:", error);
        return { state: "error", message: error.message || "Error en la conexión con el servidor" };
    }
};

//Eliminar mascota por id ---
export const deleteMascota = async (mascota_id) => {
    try {
        const res = await fetch(`http://localhost:5000/api/mascotas/${mascota_id}`, {
            method: "DELETE",
        });

        // Si la respuesta no es exitosa, lanzar un error con el mensaje del servidor
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al eliminar la mascota");
        }

        return await res.json();
    } catch (error) {
        console.error("Error en deleteMascota:", error);
        return { state: "error", message: error.message || "Error en la conexión con el servidor" };
    }
};

