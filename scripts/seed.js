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
  const userRacePointsPath = join(__dirname, '..', 'data', 'dev', 'user-race-points.json');

  const driversData = JSON.parse(readFileSync(driversPath, 'utf-8'));
  const racesData = JSON.parse(readFileSync(racesPath, 'utf-8'));
  const usersData = JSON.parse(readFileSync(usersPath, 'utf-8'));
  const predictionsData = JSON.parse(readFileSync(predictionsPath, 'utf-8'));
  const userRacePointsData = JSON.parse(readFileSync(userRacePointsPath, 'utf-8'));

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

  // Create predictions with simulated points for the first 12 races
  console.log('Creating predictions with simulated points...');
  
  // Create a points map by user and race for quick lookup
  const pointsMap = new Map();
  userRacePointsData.forEach(item => {
    const key = `${item.userId}-${item.raceId}`;
    pointsMap.set(key, item.points);
  });

  // Get the first 12 races
  const first12Races = racesData.filter(race => race.round <= 12);
  
  // Create simulated predictions for all users in the first 12 races
  const predictionsToCreate = [];
  
  for (const user of usersData) {
    for (const race of first12Races) {
      const key = `${user.id}-${race.id}`;
      const points = pointsMap.get(key) || 0;
      
      // Only create prediction if user has points (participated)
      if (points > 0 || Math.random() > 0.1) { // 90% chance of creating prediction even with 0 points
        predictionsToCreate.push({
          userId: user.id,
          raceId: race.id,
          positions: ["VER", "HAM", "LEC", "SAI", "PER"], // Generic predictions to have data
          points: points
        });
      }
    }
  }

  console.log(`Creating ${predictionsToCreate.length} predictions with points...`);
  
  await prisma.prediction.createMany({
    data: predictionsToCreate,
  });

  // Also create the original predictions from predictions.json file (if they don't exist already)
  const existingPredictionsSet = new Set(
    predictionsToCreate.map(p => `${p.userId}-${p.raceId}`)
  );
  
  const originalPredictionsToCreate = predictionsData.filter(pred => 
    !existingPredictionsSet.has(`${pred.userId}-${pred.raceId}`)
  );

  if (originalPredictionsToCreate.length > 0) {
    console.log(`Creating ${originalPredictionsToCreate.length} additional original predictions...`);
    await prisma.prediction.createMany({
      data: originalPredictionsToCreate,
    });
  }

  // Update user total points based on the first 12 races
  console.log('Updating user total points...');
  
  const userTotalPoints = new Map();
  userRacePointsData.forEach(item => {
    if (!userTotalPoints.has(item.userId)) {
      userTotalPoints.set(item.userId, 0);
    }
    userTotalPoints.set(item.userId, userTotalPoints.get(item.userId) + item.points);
  });

  for (const [userId, totalPoints] of userTotalPoints) {
    await prisma.user.update({
      where: { id: userId },
      data: { totalPoints: totalPoints }
    });
  }

  console.log('Seeding finished.');
  console.log(`- ${driversData.length} drivers created`);
  console.log(`- ${racesData.length} races created`);
  console.log(`- ${usersData.length} users created`);
  console.log(`- ${predictionsToCreate.length} predictions with simulated points created`);
  console.log(`- User total points updated based on first 12 races`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
