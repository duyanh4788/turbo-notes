/*
  Warnings:

  - Added the required column `title` to the `note_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "note_details" ADD COLUMN     "title" VARCHAR(100) NOT NULL,
ALTER COLUMN "content" SET DATA TYPE VARCHAR;
