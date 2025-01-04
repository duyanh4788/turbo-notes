/*
  Warnings:

  - Made the column `item_id` on table `notes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "item_id" SET NOT NULL,
ALTER COLUMN "item_id" SET DEFAULT gen_random_uuid();
