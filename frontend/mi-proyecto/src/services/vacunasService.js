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
