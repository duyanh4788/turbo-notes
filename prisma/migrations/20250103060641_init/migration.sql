/*
  Warnings:

  - You are about to drop the column `parrent_id` on the `notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "parrent_id",
ADD COLUMN     "parrentId" VARCHAR(255);
