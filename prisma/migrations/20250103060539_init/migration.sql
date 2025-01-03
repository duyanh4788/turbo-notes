/*
  Warnings:

  - You are about to drop the column `item_id` on the `notes` table. All the data in the column will be lost.
  - The required column `parrent_id` was added to the `notes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "item_id",
ADD COLUMN     "parrent_id" UUID NOT NULL;
