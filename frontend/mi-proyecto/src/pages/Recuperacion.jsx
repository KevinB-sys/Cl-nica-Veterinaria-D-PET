import { useState } from "react";
import "../estilos css/recuperacion.css";
import Swal from "sweetalert2";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Correo enviado",
                    text: data.message || "Revisa tu bandeja de entrada para restablecer tu contraseña.",
                });
            } else {
                throw new Error(data.message || "Error al enviar el correo");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container-recuperacion">
            <div className="login-image-recuperacion">
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8Hz0UUXxZm21BEiTgWaMMgmjHU0AKmWpwLck_ucBy2J0a2MlNaZbEeQ74sc_2-zxiqEPp3wpx43jHoEqKCWbbuwSXwSv3ihs9R2fSSh5K7-5nWVYtT6gSPG30_9qUoAZeFld2uCRcGiRmh8UD5QUH_jEzOGDncZluQbi6pnmYdjVDZIM0vmHDhetO0xE/s320/logo.png" alt="Login" />
            </div>
            <div className="form-title-recuperacion">
                <h2>Recuperar Contraseña</h2>
                <p>Ingresa tu correo registrado y te enviaremos un enlace para restablecer tu contraseña.</p>
            </div>

            <form onSubmit={handleSubmit} className="form-recuperacion">
                <div className="form-group-recuperacion">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="tucorreo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn-recuperacion" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar enlace"}
                </button>
            </form>
        </div>
    );
}
