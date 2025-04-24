export const getMascotas = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/mascotas", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al obtener las mascotas");
        }

        return await res.json();
    } catch (error) {
        console.error("Error en getMascotas:", error);
        return { state: "error", message: error.message || "Error en la conexión con el servidor" };
    }
};
