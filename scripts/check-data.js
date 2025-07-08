import { PrismaClient } from '../src/generated/prisma/index.js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function checkData() {
  console.log('=== INSERTED DATA VERIFICATION ===\n');

  // Count total records
  const usersCount = await prisma.user.count();
  const racesCount = await prisma.race.count();
  const predictionsCount = await prisma.prediction.count();
  const driversCount = await prisma.driver.count();

  console.log(`📊 GENERAL SUMMARY:`);
  console.log(`- Users: ${usersCount}`);
  console.log(`- Races: ${racesCount}`);
  console.log(`- Drivers: ${driversCount}`);
  console.log(`- Predictions: ${predictionsCount}\n`);

  // Verify predictions per race (first 12)
  console.log(`🏎️ PREDICTIONS PER RACE (First 12 rounds):`);
  const first12Races = await prisma.race.findMany({
    where: { round: { lte: 12 } },
    orderBy: { round: 'asc' },
    include: {
      _count: {
        select: { predictions: true }
      }
    }
  });

  first12Races.forEach(race => {
    console.log(`Round ${race.round}: ${race.name} - ${race._count.predictions} predictions`);
  });

  // Top 10 users with most points
  console.log(`\n🏆 TOP 10 USERS WITH MOST POINTS:`);
  const topUsers = await prisma.user.findMany({
    orderBy: { totalPoints: 'desc' },
    take: 10,
    select: {
      name: true,
      totalPoints: true
    }
  });

  topUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name}: ${user.totalPoints} points`);
  });

  // Points per prediction statistics
  console.log(`\n📈 POINTS PER PREDICTION STATISTICS:`);
  const pointsStats = await prisma.prediction.aggregate({
    _avg: { points: true },
    _max: { points: true },
    _min: { points: true },
    _sum: { points: true }
  });

  console.log(`- Average: ${Math.round(pointsStats._avg.points)} points`);
  console.log(`- Maximum: ${pointsStats._max.points} points`);
  console.log(`- Minimum: ${pointsStats._min.points} points`);
  console.log(`- Total: ${pointsStats._sum.points} points\n`);

  // Verify participation distribution per user
  console.log(`🎯 PARTICIPATION PER USER (first 10 sample):`);
  const userParticipation = await prisma.user.findMany({
    take: 10,
    select: {
      name: true,
      totalPoints: true,
      _count: {
        select: { predictions: true }
      }
    },
    orderBy: { totalPoints: 'desc' }
  });

  userParticipation.forEach(user => {
    const avgPerRace = user._count.predictions > 0 
      ? Math.round(user.totalPoints / user._count.predictions) 
      : 0;
    console.log(`${user.name}: ${user._count.predictions} predictions, ${user.totalPoints} total points (${avgPerRace} average per race)`);
  });

  console.log(`\n✅ Verification completed. Data is ready to implement the full view table.`);
}

checkData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
