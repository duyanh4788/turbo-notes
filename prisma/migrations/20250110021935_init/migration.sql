/*
  Warnings:

  - You are about to drop the column `noteId` on the `note_details` table. All the data in the column will be lost.
  - The primary key for the `notes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `item_id` on the `notes` table. All the data in the column will be lost.
  - The `id` column on the `notes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `parent_id` column on the `notes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `note_id` to the `note_details` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `note_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `notes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `label` on table `notes` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NoteDetailType" AS ENUM ('string', 'code', 'schedule');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('doc', 'folder', 'pdf', 'pinned');

-- DropForeignKey
ALTER TABLE "note_details" DROP CONSTRAINT "note_details_noteId_fkey";

-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_parent_id_fkey";

-- DropIndex
DROP INDEX "noteId";

-- AlterTable
ALTER TABLE "note_details" DROP COLUMN "noteId",
ADD COLUMN     "note_id" UUID NOT NULL,
ADD COLUMN     "type" "NoteDetailType" NOT NULL DEFAULT 'string',
ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "notes" DROP CONSTRAINT "notes_pkey",
DROP COLUMN "item_id",
ADD COLUMN     "type" "NoteType" NOT NULL DEFAULT 'doc',
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "status" SET NOT NULL,
DROP COLUMN "parent_id",
ADD COLUMN     "parent_id" UUID,
ALTER COLUMN "label" SET NOT NULL,
ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "NotesType";

-- CreateIndex
CREATE INDEX "noteId" ON "note_details"("note_id");

-- CreateIndex
CREATE INDEX "parentId" ON "notes"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "notes_id_userId_key" ON "notes"("id", "userId");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_details" ADD CONSTRAINT "note_details_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
