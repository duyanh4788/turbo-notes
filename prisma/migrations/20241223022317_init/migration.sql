-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('active', 'pending', 'inactive', 'banned', 'deleted');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(36) NOT NULL,
    "avatar" VARCHAR(255),
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "salt" VARCHAR(50) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "website_url" VARCHAR(255),
    "notes_count" INTEGER DEFAULT 0,
    "status" "StatusType" DEFAULT 'active',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" VARCHAR(36) NOT NULL,
    "title" VARCHAR(255),
    "note_type" VARCHAR(100) NOT NULL,
    "status" "StatusType" DEFAULT 'active',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_details" (
    "id" VARCHAR(36) NOT NULL,
    "content" VARCHAR(100) NOT NULL,
    "schedule_time" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusType" DEFAULT 'active',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noteId" TEXT NOT NULL,

    CONSTRAINT "note_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "role" ON "users"("role");

-- CreateIndex
CREATE INDEX "status" ON "users"("status");

-- CreateIndex
CREATE INDEX "userId" ON "note"("userId");

-- CreateIndex
CREATE INDEX "noteId" ON "note_details"("noteId");

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_details" ADD CONSTRAINT "note_details_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
