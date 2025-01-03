/*
  Warnings:

  - You are about to drop the column `parrent_id` on the `notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "parrent_id",
ADD COLUMN     "parent_id" INTEGER;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
