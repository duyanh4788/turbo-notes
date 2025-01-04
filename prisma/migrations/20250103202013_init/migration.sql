/*
  Warnings:

  - You are about to drop the column `name` on the `notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "name",
ADD COLUMN     "label" VARCHAR(255);
