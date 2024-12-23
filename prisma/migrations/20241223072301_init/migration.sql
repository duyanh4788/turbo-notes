/*
  Warnings:

  - You are about to drop the column `website_url` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "website_url",
ADD COLUMN     "email" VARCHAR(255);
