/*
  Warnings:

  - The primary key for the `note` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `note` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `note_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `note_details` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `userId` on the `note` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `noteId` on the `note_details` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "note" DROP CONSTRAINT "note_userId_fkey";

-- DropForeignKey
ALTER TABLE "note_details" DROP CONSTRAINT "note_details_noteId_fkey";

-- AlterTable
ALTER TABLE "note" DROP CONSTRAINT "note_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "note_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "note_details" DROP CONSTRAINT "note_details_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "noteId",
ADD COLUMN     "noteId" INTEGER NOT NULL,
ADD CONSTRAINT "note_details_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "userId" ON "note"("userId");

-- CreateIndex
CREATE INDEX "noteId" ON "note_details"("noteId");

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_details" ADD CONSTRAINT "note_details_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
