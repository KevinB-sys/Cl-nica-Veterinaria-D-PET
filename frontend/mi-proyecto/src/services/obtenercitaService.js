export const obtenerCitas = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/citas", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Si la respuesta no es exitosa, lanzar un error con el mensaje del servidor
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al obtener citas");
        }

        return await res.json();
    } catch (error) {
        console.error("Error en obtener citas:", error);
        return { state: "error", message: error.message || "Error en la conexión con el servidor" };
    }
};
