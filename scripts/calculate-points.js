import { PrismaClient } from '../src/generated/prisma/index.js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const prisma = new PrismaClient();

// Points scoring system
const POINTS_SYSTEM = {
  EXACT_POSITION: 10,      // Exact position match
  PODIUM_CORRECT: 5,       // Driver in correct podium position
  TOP_5_CORRECT: 3,        // Driver in top 5 but wrong position
  POLE_POSITION: 5,        // Correct pole position prediction
  FASTEST_LAP: 3,          // Correct fastest lap prediction
  SPRINT_EXACT: 5,         // Exact sprint position match
  SPRINT_PODIUM: 3,        // Sprint podium correct
  SPRINT_POLE: 3,          // Sprint pole position correct
};

function calculateRacePoints(prediction, actual) {
  let points = 0;
  
  // Main race position points
  if (prediction.positions && actual.raceResult) {
    const actualPositions = actual.raceResult.map(r => r.driverId);
    
    prediction.positions.forEach((driverId, index) => {
      const actualPosition = actualPositions.indexOf(driverId);
      
      if (actualPosition === index) {
        // Exact position match
        points += POINTS_SYSTEM.EXACT_POSITION;
      } else if (actualPosition !== -1) {
        // Driver finished in different position
        if (index < 3 && actualPosition < 3) {
          // Both in podium
          points += POINTS_SYSTEM.PODIUM_CORRECT;
        } else if (index < 5 && actualPosition < 5) {
          // Both in top 5
          points += POINTS_SYSTEM.TOP_5_CORRECT;
        }
      }
    });
  }
  
  // Pole position points
  if (prediction.polePositionPrediction === actual.polePosition) {
    points += POINTS_SYSTEM.POLE_POSITION;
  }
  
  // Fastest lap points
  if (prediction.fastestLapPrediction === actual.fastestLap) {
    points += POINTS_SYSTEM.FASTEST_LAP;
  }
  
  // Sprint race points
  if (actual.sprintRace && prediction.sprintPositions && actual.sprintResult) {
    const actualSprintPositions = actual.sprintResult.map(r => r.driverId);
    
    prediction.sprintPositions.forEach((driverId, index) => {
      const actualPosition = actualSprintPositions.indexOf(driverId);
      
      if (actualPosition === index) {
        points += POINTS_SYSTEM.SPRINT_EXACT;
      } else if (actualPosition !== -1 && index < 3 && actualPosition < 3) {
        points += POINTS_SYSTEM.SPRINT_PODIUM;
      }
    });
    
    // Sprint pole position points
    if (prediction.sprintPolePrediction === actual.sprintPolePosition) {
      points += POINTS_SYSTEM.SPRINT_POLE;
    }
  }
  
  return points;
}

async function calculateAllPoints() {
  console.log('Calculating prediction points...');
  
  // Get all predictions and results
  const predictions = await prisma.prediction.findMany({
    include: {
      race: {
        include: {
          results: true
        }
      }
    }
  });
  
  const updates = [];
  
  for (const prediction of predictions) {
    const raceResult = prediction.race.results[0]; // Assuming one result per race
    
    if (raceResult) {
      const points = calculateRacePoints(prediction, raceResult);
      
      updates.push({
        id: prediction.id,
        points: points
      });
    }
  }
  
  // Update predictions with calculated points
  console.log(`Updating ${updates.length} predictions with calculated points...`);
  
  for (const update of updates) {
    await prisma.prediction.update({
      where: { id: update.id },
      data: { points: update.points }
    });
  }
  
  // Calculate and update user total points
  console.log('Updating user total points...');
  
  const users = await prisma.user.findMany({
    include: {
      predictions: true
    }
  });
  
  for (const user of users) {
    const totalPoints = user.predictions.reduce((sum, pred) => sum + pred.points, 0);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { totalPoints }
    });
  }
  
  console.log('Points calculation completed!');
  
  // Display results
  const finalUsers = await prisma.user.findMany({
    orderBy: { totalPoints: 'desc' },
    include: {
      predictions: {
        include: {
          race: true
        }
      }
    }
  });
  
  console.log('\n=== LEADERBOARD ===');
  finalUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name}: ${user.totalPoints} points`);
  });
}

async function main() {
  try {
    await calculateAllPoints();
  } catch (error) {
    console.error('Error calculating points:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
