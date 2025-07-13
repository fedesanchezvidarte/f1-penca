/*
  Warnings:

  - You are about to drop the column `positions` on the `RaceResult` table. All the data in the column will be lost.
  - Added the required column `raceResult` to the `RaceResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "fastestLapPrediction" TEXT,
ADD COLUMN     "polePositionPrediction" TEXT,
ADD COLUMN     "sprintPolePrediction" TEXT,
ADD COLUMN     "sprintPositions" JSONB;

-- AlterTable
ALTER TABLE "RaceResult" DROP COLUMN "positions",
ADD COLUMN     "fastestLap" TEXT,
ADD COLUMN     "polePosition" TEXT,
ADD COLUMN     "raceResult" JSONB NOT NULL,
ADD COLUMN     "sprintPolePosition" TEXT,
ADD COLUMN     "sprintRace" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sprintResult" JSONB;
