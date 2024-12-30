/*
  Warnings:

  - You are about to drop the `note` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "note" DROP CONSTRAINT "note_userId_fkey";

-- DropForeignKey
ALTER TABLE "note_details" DROP CONSTRAINT "note_details_noteId_fkey";

-- DropTable
DROP TABLE "note";

-- CreateTable
CREATE TABLE "notes" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "note_type" VARCHAR(100) NOT NULL,
    "status" "StatusType" DEFAULT 'active',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "userId" ON "notes"("userId");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_details" ADD CONSTRAINT "note_details_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
