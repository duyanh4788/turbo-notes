/*
  Warnings:

  - You are about to drop the column `label` on the `notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "label",
ADD COLUMN     "name" VARCHAR(255);
