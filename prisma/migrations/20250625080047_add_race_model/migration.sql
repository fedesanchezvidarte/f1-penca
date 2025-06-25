-- CreateEnum
CREATE TYPE "RaceStatus" AS ENUM ('UPCOMING', 'LIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "Race" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "circuit" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "season" INTEGER NOT NULL,
    "status" "RaceStatus" NOT NULL DEFAULT 'UPCOMING',
    "resultsImported" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);
