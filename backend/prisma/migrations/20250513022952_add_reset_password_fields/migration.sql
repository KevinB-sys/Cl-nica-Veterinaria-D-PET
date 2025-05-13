-- CreateTable
CREATE TABLE "Cita" (
    "id" SERIAL NOT NULL,
    "cita_id" VARCHAR(255) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "observaciones" TEXT,
    "recordatorio_enviado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cita_pkey" PRIMARY KEY ("cita_id")
);

-- CreateTable
CREATE TABLE "HistorialMedico" (
    "historial_id" VARCHAR(255) NOT NULL,
    "mascota_id" INTEGER NOT NULL,
    "veterinario_id" TEXT NOT NULL,
    "diagnostico" TEXT NOT NULL,
    "tratamiento" TEXT,
    "fecha_consulta" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialMedico_pkey" PRIMARY KEY ("historial_id")
);

-- CreateTable
CREATE TABLE "Mascota" (
    "mascota_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "raza" TEXT,
    "sexo" TEXT NOT NULL,
    "duenio_id" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3),

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("mascota_id")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "notificacion_id" VARCHAR(255) NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" TEXT,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "programada_para" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("notificacion_id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "rol_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("rol_id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "usuario_id" VARCHAR(255) NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefono" TEXT,
    "whatsapp" TEXT,
    "direccion" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "Vacunacion" (
    "vacunacion_id" VARCHAR(255) NOT NULL,
    "mascota_id" INTEGER NOT NULL,
    "vacuna" TEXT NOT NULL,
    "fecha_aplicacion" TIMESTAMP(3) NOT NULL,
    "proxima_visita" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "edad" TEXT,
    "peso" BIGINT,

    CONSTRAINT "Vacunacion_pkey" PRIMARY KEY ("vacunacion_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "HistorialMedico" ADD CONSTRAINT "HistorialMedico_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "Mascota"("mascota_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialMedico" ADD CONSTRAINT "HistorialMedico_veterinario_id_fkey" FOREIGN KEY ("veterinario_id") REFERENCES "Usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_duenio_id_fkey" FOREIGN KEY ("duenio_id") REFERENCES "Usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("rol_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacunacion" ADD CONSTRAINT "Vacunacion_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "Mascota"("mascota_id") ON DELETE RESTRICT ON UPDATE CASCADE;
