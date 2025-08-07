import { PrismaClient } from '../src/generated/prisma/index.js';
import { createReadStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import csv from 'csv-parser';

// Load environment variables from .env.local
config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

// Helper function to read CSV files
const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

async function main() {
  console.log('Start seeding ...');

  const driversPath = join(__dirname, '..', 'data', 'dev', 'Driver_rows.csv');
  const racesPath = join(__dirname, '..', 'data', 'dev', 'Race_rows.csv');
  const usersPath = join(__dirname, '..', 'data', 'dev', 'User_rows.csv');
  const predictionsPath = join(__dirname, '..', 'data', 'dev', 'Prediction_rows.csv');
  const resultsPath = join(__dirname, '..', 'data', 'dev', 'RaceResult_rows.csv');

  // Read CSV data
  const driversData = await readCSV(driversPath);
  const racesData = await readCSV(racesPath);
  const usersData = await readCSV(usersPath);
  const predictionsData = await readCSV(predictionsPath);
  const resultsData = await readCSV(resultsPath);

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
    data: driversData.map(driver => ({
      id: driver.id,
      number: parseInt(driver.number),
      code: driver.code,
      firstname: driver.firstname,
      lastname: driver.lastname,
      fullname: driver.fullname,
      nationality: driver.nationality,
      team: driver.team,
      active: driver.active === 'true',
    })),
  });

  // Seed races
  console.log('Seeding races...');
  await prisma.race.createMany({
    data: racesData.map(race => ({
      id: race.id,
      name: race.name,
      round: parseInt(race.round),
      circuit: race.circuit,
      date: new Date(race.date),
      deadline: race.deadline ? new Date(race.deadline) : null,
      season: parseInt(race.season),
      status: race.status,
      hasSprint: race.hasSprint === 'true',
      resultsImported: race.resultsImported === 'true',
    })),
  });

  // Seed users (beta users)
  console.log('Seeding beta users...');
  await prisma.user.createMany({
    data: usersData.map(user => ({
      id: user.id,
      name: user.name || null,
      email: user.email || null,
      password: user.password || null,
      image: user.image || null,
      totalPoints: parseInt(user.totalPoints) || 0,
      role: user.role,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    })),
  });

  // Seed race results for completed races
  console.log('Seeding race results...');
  const raceResultsToCreate = resultsData.map(result => ({
    raceId: result.raceId,
    polePosition: result.polePosition || null,
    raceResult: JSON.parse(result.raceResult),
    fastestLap: result.fastestLap || null,
    sprintRace: result.sprintRace === 'true',
    sprintPolePosition: result.sprintPolePosition || null,
    sprintResult: result.sprintResult ? JSON.parse(result.sprintResult) : null,
  }));

  await prisma.raceResult.createMany({
    data: raceResultsToCreate,
  });

  // Seed predictions
  console.log('Seeding predictions...');
  await prisma.prediction.createMany({
    data: predictionsData.map(prediction => ({
      id: prediction.id,
      userId: prediction.userId,
      raceId: prediction.raceId,
      positions: JSON.parse(prediction.positions),
      polePositionPrediction: prediction.polePositionPrediction || null,
      fastestLapPrediction: prediction.fastestLapPrediction || null,
      sprintPositions: prediction.sprintPositions ? JSON.parse(prediction.sprintPositions) : null,
      sprintPolePrediction: prediction.sprintPolePrediction || null,
      createdAt: new Date(prediction.createdAt),
      updatedAt: new Date(prediction.updatedAt),
      points: parseInt(prediction.points) || 0,
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
