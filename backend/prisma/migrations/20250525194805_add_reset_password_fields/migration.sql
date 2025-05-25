/*
  Warnings:

  - Added the required column `usuario_id` to the `Cita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cita" ADD COLUMN     "usuario_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;
