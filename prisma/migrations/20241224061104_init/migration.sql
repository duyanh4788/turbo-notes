/*
  Warnings:

  - You are about to drop the column `token_gg` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "token_gg",
ADD COLUMN     "token_data" VARCHAR(255);
