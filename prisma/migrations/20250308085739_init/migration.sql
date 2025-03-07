-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "sorting" DROP DEFAULT;
DROP SEQUENCE "notes_sorting_seq";
