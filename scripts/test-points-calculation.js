import { PrismaClient } from '../src/generated/prisma/index.js';
import { calculateAndUpdateRacePoints, recalculateAllPoints } from '../src/services/points-calculation.js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const prisma = new PrismaClient();

/**
 * Test the new automated points calculation system
 */
async function testPointsCalculation() {
  try {
    console.log('🧪 Testing Automated Points Calculation System');
    console.log('=' .repeat(50));
    
    // Get a completed race with results
    const raceWithResults = await prisma.race.findFirst({
      where: {
        status: 'COMPLETED',
        resultsImported: true,
      },
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

    if (!raceWithResults) {
      console.log('❌ No completed races with results found for testing');
      return;
    }

    console.log(`🏁 Testing with race: ${raceWithResults.name} (Round ${raceWithResults.round})`);
    console.log(`📊 Found ${raceWithResults.predictions.length} predictions to calculate`);
    
    if (raceWithResults.results.length === 0) {
      console.log('❌ No race results found');
      return;
    }

    const raceResult = raceWithResults.results[0];
    
    // Prepare race results data
    const raceResults = {
      polePosition: raceResult.polePosition,
      fastestLap: raceResult.fastestLap,
      raceResult: raceResult.raceResult,
      sprintPolePosition: raceResult.sprintPolePosition,
      sprintResult: raceResult.sprintResult,
    };

    console.log('\n📋 Race Results Summary:');
    console.log(`   Pole Position: ${raceResults.polePosition || 'Not set'}`);
    console.log(`   Fastest Lap: ${raceResults.fastestLap || 'Not set'}`);
    console.log(`   Sprint Race: ${raceResults.sprintResult ? 'Yes' : 'No'}`);
    console.log(`   Race Positions: ${raceResults.raceResult ? raceResults.raceResult.length : 0} drivers`);

    // Store current points for comparison
    const currentPoints = raceWithResults.predictions.map(p => ({
      userId: p.userId,
      userName: p.user.name,
      currentPoints: p.points,
    }));

    console.log('\n🔄 Calculating points...');
    
    // Test the automated calculation
    await calculateAndUpdateRacePoints(raceWithResults.id, raceResults);
    
    // Get updated predictions to compare
    const updatedPredictions = await prisma.prediction.findMany({
      where: { raceId: raceWithResults.id },
      include: {
        user: {
          select: {
            name: true,
            totalPoints: true,
          },
        },
      },
    });

    console.log('\n📊 Points Calculation Results:');
    console.log('-'.repeat(50));
    
    let totalChanges = 0;
    for (const prediction of updatedPredictions) {
      const oldData = currentPoints.find(cp => cp.userId === prediction.userId);
      const change = prediction.points - (oldData?.currentPoints || 0);
      
      if (change !== 0) totalChanges++;
      
      const changeStr = change > 0 ? `(+${change})` : change < 0 ? `(${change})` : '(no change)';
      console.log(`   ${prediction.user.name}: ${prediction.points} points ${changeStr}`);
      console.log(`      Total user points: ${prediction.user.totalPoints}`);
    }

    console.log(`\n✅ Points calculation completed!`);
    console.log(`   Updated ${updatedPredictions.length} predictions`);
    console.log(`   ${totalChanges} predictions had point changes`);

    // Test recalculation of all points
    console.log('\n🔄 Testing full points recalculation...');
    await recalculateAllPoints();
    console.log('✅ Full recalculation completed!');

    // Show final leaderboard
    const leaderboard = await prisma.user.findMany({
      orderBy: { totalPoints: 'desc' },
      take: 5,
      select: {
        name: true,
        totalPoints: true,
        predictions: {
          select: {
            points: true,
          },
        },
      },
    });

    console.log('\n🏆 Current Leaderboard (Top 5):');
    console.log('-'.repeat(40));
    leaderboard.forEach((user, index) => {
      const raceCount = user.predictions.length;
      const avgPoints = raceCount > 0 ? (user.totalPoints / raceCount).toFixed(1) : '0.0';
      console.log(`   ${index + 1}. ${user.name}: ${user.totalPoints} pts (${avgPoints} avg)`);
    });

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testPointsCalculation();
