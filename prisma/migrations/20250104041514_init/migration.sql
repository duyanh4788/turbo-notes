/*
  Warnings:

  - You are about to drop the column `title` on the `notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "title",
ADD COLUMN     "label" VARCHAR(255);
