export const getAllUsuarios = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/usuarios", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al obtener los usuarios");
        }
        const data = await res.json();
        const usuarios = data.map(usuario => ({
            usuarioId: usuario.usuario_id,
            nombre: usuario.nombre
        }));
        return usuarios;
    } catch (error) {
        console.error("Error en getAllUsuarios:", error);
        return { state: "error", message: error.message || "Error en la conexión con el servidor" };
    }
}