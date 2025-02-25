-- CreateTable
CREATE TABLE "banners" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);
