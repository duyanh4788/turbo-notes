/*
  Warnings:

  - You are about to drop the column `parrentId` on the `notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "parrentId",
ADD COLUMN     "parrent_id" INTEGER;
