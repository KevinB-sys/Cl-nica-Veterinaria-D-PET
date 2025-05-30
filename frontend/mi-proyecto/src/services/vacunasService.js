export const createvacuna = async (userData) => {
    try {
        const res = await fetch("http://localhost:5000/api/vacunas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        // Si la respuesta no es exitosa, lanzar un error con el mensaje del servidor
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al crear vacuna");
        }

        return await res.json();
    } catch (error) {
        console.error("Error en crear vacuna:", error);
        return { state: "error", message: error.message || "Error en la conexión con el servidor" };
    }
};

//Obtener las vacunas por ID de mascota
export const getVacunasByMascota = async (mascotaId) => {
    try {
        // La URL debe coincidir con la ruta GET que configuraste en tu backend
        const res = await fetch(`http://localhost:5000/api/vacunas/${mascotaId}`); // Usamos template literals para el ID

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al obtener las vacunas de la mascota");
        }

        const data = await res.json();
        return { state: "success", data: data }; // Devuelve los datos de las vacunas
    } catch (error) {
        console.error("Error en getVacunasByMascota (frontend service):", error);
        return { state: "error", message: error.message || "Error en la conexión con el servidor" };
    }
};