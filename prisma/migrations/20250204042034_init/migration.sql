/*
  Warnings:

  - You are about to drop the column `userId` on the `note_details` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `note_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "note_details" DROP CONSTRAINT "note_details_userId_fkey";

-- AlterTable
ALTER TABLE "note_details" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "idx_note_details_user_id" ON "note_details"("user_id");

-- AddForeignKey
ALTER TABLE "note_details" ADD CONSTRAINT "note_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "noteId" RENAME TO "idx_note_details_note_id";

-- RenameIndex
ALTER INDEX "parentId" RENAME TO "idx_notes_parentId";

-- RenameIndex
ALTER INDEX "userId" RENAME TO "idx_notes_user_id";

-- RenameIndex
ALTER INDEX "role" RENAME TO "idx_users_role";

-- RenameIndex
ALTER INDEX "status" RENAME TO "idx_users_status";
