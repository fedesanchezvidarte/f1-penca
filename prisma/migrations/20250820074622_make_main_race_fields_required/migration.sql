/*
  Warnings:

  - Made the column `fastestLapPrediction` on table `Prediction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `polePositionPrediction` on table `Prediction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Prediction" ALTER COLUMN "fastestLapPrediction" SET NOT NULL,
ALTER COLUMN "polePositionPrediction" SET NOT NULL;
