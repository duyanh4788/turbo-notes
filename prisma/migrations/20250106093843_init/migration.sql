-- AlterTable
ALTER TABLE "note_details" ADD COLUMN     "sorting" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "sorting" SERIAL NOT NULL;
