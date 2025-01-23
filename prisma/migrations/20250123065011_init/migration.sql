/*
  Warnings:

  - You are about to drop the column `note_details` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "note_details",
ADD COLUMN     "note_details_count" INTEGER DEFAULT 0;
