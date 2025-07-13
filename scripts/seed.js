import { PrismaClient } from '../src/generated/prisma/index.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const driversPath = join(__dirname, '..', 'data', 'dev', 'drivers.json');
  const racesPath = join(__dirname, '..', 'data', 'dev', 'races.json');
  const usersPath = join(__dirname, '..', 'data', 'dev', 'users.json');
  const predictionsPath = join(__dirname, '..', 'data', 'dev', 'predictions.json');
  const resultsPath = join(__dirname, '..', 'data', 'dev', 'results.json');

  const driversData = JSON.parse(readFileSync(driversPath, 'utf-8'));
  const racesData = JSON.parse(readFileSync(racesPath, 'utf-8'));
  const usersData = JSON.parse(readFileSync(usersPath, 'utf-8'));
  const predictionsData = JSON.parse(readFileSync(predictionsPath, 'utf-8'));
  const resultsData = JSON.parse(readFileSync(resultsPath, 'utf-8'));

  // Clean up existing data
  console.log('Cleaning existing data...');
  await prisma.prediction.deleteMany({});
  await prisma.raceResult.deleteMany({});
  await prisma.race.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed drivers
  console.log('Seeding drivers...');
  await prisma.driver.createMany({
    data: driversData,
  });

  // Seed races
  console.log('Seeding races...');
  await prisma.race.createMany({
    data: racesData.map(race => ({
      ...race,
      date: new Date(race.date),
    })),
  });

  // Seed users (beta users)
  console.log('Seeding beta users...');
  await prisma.user.createMany({
    data: usersData.map((user, index) => ({
      ...user,
      role: index === 0 ? 'ADMIN' : 'USER', // Make first user admin
    })),
  });

  // Seed race results for completed races
  console.log('Seeding race results...');
  const raceResultsToCreate = resultsData.map(result => ({
    raceId: result.raceId,
    polePosition: result.polePosition,
    raceResult: result.raceResult,
    fastestLap: result.fastestLap,
    sprintRace: result.sprintRace,
    sprintPolePosition: result.sprintPolePosition || null,
    sprintResult: result.sprintResult || null,
  }));

  await prisma.raceResult.createMany({
    data: raceResultsToCreate,
  });

  // Seed predictions
  console.log('Seeding predictions...');
  await prisma.prediction.createMany({
    data: predictionsData.map(prediction => ({
      userId: prediction.userId,
      raceId: prediction.raceId,
      positions: prediction.positions,
      polePositionPrediction: prediction.polePositionPrediction,
      fastestLapPrediction: prediction.fastestLapPrediction,
      sprintPositions: prediction.sprintPositions,
      sprintPolePrediction: prediction.sprintPolePrediction,
      points: 0, // Initialize with 0, will be calculated later
    })),
  });

  console.log('Seeding finished successfully!');
  console.log(`- ${driversData.length} drivers created`);
  console.log(`- ${racesData.length} races created`);
  console.log(`- ${usersData.length} beta users created`);
  console.log(`- ${raceResultsToCreate.length} race results created`);
  console.log(`- ${predictionsData.length} predictions created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
