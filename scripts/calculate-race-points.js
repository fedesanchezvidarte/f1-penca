import { PrismaClient } from '../src/generated/prisma/index.js';
import { calculateAndUpdateRacePoints } from '../src/services/points-calculation.js';
import { config } from 'dotenv';

// Load environment variables from .env
config({ path: '.env' });

const prisma = new PrismaClient();

/**
 * Manual script to calculate points for a specific race
 * Usage: node scripts/calculate-race-points.js [raceId]
 */
async function calculateRacePoints(raceId) {
  try {
    if (!raceId) {
      console.log('❌ Please provide a race ID');
      console.log('Usage: node scripts/calculate-race-points.js [raceId]');
      return;
    }

    // Get the race with its results
    const race = await prisma.race.findUnique({
      where: { id: raceId },
      include: {
        results: true,
        predictions: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!race) {
      console.log(`❌ Race with ID ${raceId} not found`);
      return;
    }

    console.log(`🏁 Calculating points for: ${race.name} (Round ${race.round})`);
    
    if (race.results.length === 0) {
      console.log('❌ No race results found. Please import race results first.');
      return;
    }

    const raceResult = race.results[0];
    
    // Prepare race results data
    const raceResults = {
      polePosition: raceResult.polePosition,
      fastestLap: raceResult.fastestLap,
      raceResult: raceResult.raceResult,
      sprintPolePosition: raceResult.sprintPolePosition,
      sprintResult: raceResult.sprintResult,
    };

    console.log(`📊 Found ${race.predictions.length} predictions`);
    console.log('🔄 Calculating points...');

    // Calculate and update points
    await calculateAndUpdateRacePoints(raceId, raceResults);

    // Get updated results
    const updatedPredictions = await prisma.prediction.findMany({
      where: { raceId },
      include: {
        user: {
          select: {
            name: true,
            totalPoints: true,
          },
        },
      },
      orderBy: {
        points: 'desc',
      },
    });

    console.log('\n📊 Points Results:');
    console.log('-'.repeat(50));
    updatedPredictions.forEach((prediction, index) => {
      console.log(`   ${index + 1}. ${prediction.user.name}: ${prediction.points} points`);
      console.log(`      Total season points: ${prediction.user.totalPoints}`);
    });

    console.log('\n✅ Points calculation completed!');

  } catch (error) {
    console.error('❌ Error calculating points:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get race ID from command line arguments
const raceId = process.argv[2];
calculateRacePoints(raceId);
