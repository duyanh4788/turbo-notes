/*
  Warnings:

  - You are about to drop the column `note_type` on the `notes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,userId]` on the table `notes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "NotesType" AS ENUM ('code', 'string', 'schedule');

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "note_type";

-- CreateIndex
CREATE UNIQUE INDEX "notes_id_userId_key" ON "notes"("id", "userId");
