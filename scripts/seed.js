import { PrismaClient } from '../src/generated/prisma/index.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const driversPath = join(__dirname, '..', 'data', 'dev', 'drivers.json');
  const racesPath = join(__dirname, '..', 'data', 'dev', 'races.json');
  const usersPath = join(__dirname, '..', 'data', 'dev', 'users.json');
  const predictionsPath = join(__dirname, '..', 'data', 'dev', 'predictions.json');

  const driversData = JSON.parse(readFileSync(driversPath, 'utf-8'));
  const racesData = JSON.parse(readFileSync(racesPath, 'utf-8'));
  const usersData = JSON.parse(readFileSync(usersPath, 'utf-8'));
  const predictionsData = JSON.parse(readFileSync(predictionsPath, 'utf-8'));

  // Clean up existing data
  await prisma.prediction.deleteMany({});
  await prisma.raceResult.deleteMany({});
  await prisma.race.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.user.deleteMany({});
  
  await prisma.driver.createMany({
    data: driversData,
  });

  await prisma.race.createMany({
    data: racesData.map(race => ({
      ...race,
      date: new Date(race.date),
    })),
  });

  await prisma.user.createMany({
    data: usersData.map((user, index) => ({
      ...user,
      role: index === 0 ? 'ADMIN' : 'USER',
    })),
  });

  await prisma.prediction.createMany({
    data: predictionsData,
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
