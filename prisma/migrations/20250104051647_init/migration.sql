-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "item_id" UUID NOT NULL DEFAULT gen_random_uuid();
