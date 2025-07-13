import { PrismaClient } from '../src/generated/prisma/index.js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const prisma = new PrismaClient();

// Points scoring system based on prediction-system.md
const POINTS_SYSTEM = {
  // Regular Race
  POLE_POSITION: 10,           // Correct pole position prediction
  RACE_WINNER: 15,             // Correct race winner (1st place)
  RACE_2ND_EXACT: 10,          // Exact 2nd place prediction
  RACE_2ND_PODIUM: 5,          // 2nd place prediction but finished on podium
  RACE_3RD_EXACT: 8,           // Exact 3rd place prediction
  RACE_3RD_PODIUM: 3,          // 3rd place prediction but finished on podium
  TOP_5_EXACT: 5,              // Exact position in top 5
  TOP_5_CORRECT: 1,            // Correct driver in top 5 but wrong position
  FASTEST_LAP: 1,              // Correct fastest lap prediction
  
  // Sprint Race
  SPRINT_POLE: 5,              // Correct sprint pole position
  SPRINT_WINNER: 8,            // Correct sprint winner (1st place)
  SPRINT_2ND_EXACT: 5,         // Exact sprint 2nd place
  SPRINT_2ND_PODIUM: 3,        // Sprint 2nd place but finished on podium
  SPRINT_3RD_EXACT: 3,         // Exact sprint 3rd place
  SPRINT_3RD_PODIUM: 1,        // Sprint 3rd place but finished on podium
  
  // Bonuses
  PERFECT_PODIUM: 10,          // Perfect podium prediction (1st, 2nd, 3rd exact)
  PERFECT_TOP_5: 10,           // Perfect top 5 prediction (all 5 exact)
  PERFECT_SPRINT_PODIUM: 5,    // Perfect sprint podium prediction
};

function calculateRacePoints(prediction, actual) {
  let points = 0;
  
  // Main race position points
  if (prediction.positions && actual.raceResult) {
    const actualPositions = actual.raceResult.map(r => r.driverId);
    const predictedPositions = prediction.positions;
    
    // Check each predicted position
    for (let i = 0; i < Math.min(predictedPositions.length, 5); i++) {
      const predictedDriver = predictedPositions[i];
      const actualPosition = actualPositions.indexOf(predictedDriver);
      
      if (actualPosition === i) {
        // Exact position match
        if (i === 0) {
          points += POINTS_SYSTEM.RACE_WINNER;
        } else if (i === 1) {
          points += POINTS_SYSTEM.RACE_2ND_EXACT;
        } else if (i === 2) {
          points += POINTS_SYSTEM.RACE_3RD_EXACT;
        } else if (i < 5) {
          points += POINTS_SYSTEM.TOP_5_EXACT;
        }
      } else if (actualPosition !== -1) {
        // Driver finished in different position
        if (i === 1 && actualPosition < 3) {
          // Predicted 2nd but finished on podium
          points += POINTS_SYSTEM.RACE_2ND_PODIUM;
        } else if (i === 2 && actualPosition < 3) {
          // Predicted 3rd but finished on podium
          points += POINTS_SYSTEM.RACE_3RD_PODIUM;
        } else if (i < 5 && actualPosition < 5) {
          // Predicted top 5, finished in top 5 but wrong position
          points += POINTS_SYSTEM.TOP_5_CORRECT;
        }
      }
    }
    
    // Check for perfect bonuses
    if (predictedPositions.length >= 3 && actualPositions.length >= 3) {
      // Perfect podium bonus
      if (predictedPositions[0] === actualPositions[0] && 
          predictedPositions[1] === actualPositions[1] && 
          predictedPositions[2] === actualPositions[2]) {
        points += POINTS_SYSTEM.PERFECT_PODIUM;
      }
      
      // Perfect top 5 bonus
      if (predictedPositions.length >= 5 && actualPositions.length >= 5) {
        let perfectTop5 = true;
        for (let i = 0; i < 5; i++) {
          if (predictedPositions[i] !== actualPositions[i]) {
            perfectTop5 = false;
            break;
          }
        }
        if (perfectTop5) {
          points += POINTS_SYSTEM.PERFECT_TOP_5;
        }
      }
    }
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
    const predictedSprintPositions = prediction.sprintPositions;
    
    // Check each predicted sprint position (only top 3 for sprint)
    for (let i = 0; i < Math.min(predictedSprintPositions.length, 3); i++) {
      const predictedDriver = predictedSprintPositions[i];
      const actualPosition = actualSprintPositions.indexOf(predictedDriver);
      
      if (actualPosition === i) {
        // Exact position match
        if (i === 0) {
          points += POINTS_SYSTEM.SPRINT_WINNER;
        } else if (i === 1) {
          points += POINTS_SYSTEM.SPRINT_2ND_EXACT;
        } else if (i === 2) {
          points += POINTS_SYSTEM.SPRINT_3RD_EXACT;
        }
      } else if (actualPosition !== -1 && actualPosition < 3) {
        // Driver finished on sprint podium but wrong position
        if (i === 1) {
          points += POINTS_SYSTEM.SPRINT_2ND_PODIUM;
        } else if (i === 2) {
          points += POINTS_SYSTEM.SPRINT_3RD_PODIUM;
        }
      }
    }
    
    // Perfect sprint podium bonus
    if (predictedSprintPositions.length >= 3 && actualSprintPositions.length >= 3) {
      if (predictedSprintPositions[0] === actualSprintPositions[0] && 
          predictedSprintPositions[1] === actualSprintPositions[1] && 
          predictedSprintPositions[2] === actualSprintPositions[2]) {
        points += POINTS_SYSTEM.PERFECT_SPRINT_PODIUM;
      }
    }
    
    // Sprint pole position points
    if (prediction.sprintPolePrediction === actual.sprintPolePosition) {
      points += POINTS_SYSTEM.SPRINT_POLE;
    }
  }
  
  return points;
}

async function calculateAllPoints() {
  console.log('Calculating prediction points...');
  console.log('=== SCORING SYSTEM ===');
  console.log('Pole Position: 10 pts | Race Winner: 15 pts | 2nd Place: 10 pts | 3rd Place: 8 pts');
  console.log('Top 5 Exact: 5 pts | Top 5 Correct: 1 pt | Fastest Lap: 1 pt');
  console.log('Perfect Podium Bonus: 10 pts | Perfect Top 5 Bonus: 10 pts');
  console.log('Sprint Winner: 8 pts | Sprint Pole: 5 pts | Perfect Sprint Podium: 5 pts');
  console.log('==================\n');
  
  // Get all predictions and results
  const predictions = await prisma.prediction.findMany({
    include: {
      race: {
        include: {
          results: true
        }
      },
      user: true
    }
  });
  
  const updates = [];
  const detailedResults = [];
  
  for (const prediction of predictions) {
    const raceResult = prediction.race.results[0]; // Assuming one result per race
    
    if (raceResult) {
      const points = calculateRacePoints(prediction, raceResult);
      
      updates.push({
        id: prediction.id,
        points: points
      });
      
      detailedResults.push({
        user: prediction.user.name,
        race: prediction.race.name,
        round: prediction.race.round,
        points: points,
        oldPoints: prediction.points
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
  
  // Show detailed breakdown by race
  console.log('\n=== DETAILED POINTS BREAKDOWN ===');
  const raceBreakdown = detailedResults.reduce((acc, result) => {
    const raceKey = `Round ${result.round}: ${result.race}`;
    if (!acc[raceKey]) acc[raceKey] = [];
    acc[raceKey].push(result);
    return acc;
  }, {});
  
  Object.entries(raceBreakdown).forEach(([raceName, results]) => {
    console.log(`\n${raceName}:`);
    results.forEach(result => {
      const change = result.points - result.oldPoints;
      const changeStr = change > 0 ? `(+${change})` : change < 0 ? `(${change})` : '(no change)';
      console.log(`  ${result.user}: ${result.points} points ${changeStr}`);
    });
  });
  
  // Display updated leaderboard
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
    const raceCount = user.predictions.length;
    const avgPoints = raceCount > 0 ? (user.totalPoints / raceCount).toFixed(1) : 0;
    console.log(`${index + 1}. ${user.name}: ${user.totalPoints} points (${avgPoints} avg/race)`);
  });
  
  // Calculate total possible points for comparison
  const maxRegularRace = POINTS_SYSTEM.POLE_POSITION + POINTS_SYSTEM.RACE_WINNER + 
                        POINTS_SYSTEM.RACE_2ND_EXACT + POINTS_SYSTEM.RACE_3RD_EXACT + 
                        (POINTS_SYSTEM.TOP_5_EXACT * 2) + POINTS_SYSTEM.FASTEST_LAP + 
                        POINTS_SYSTEM.PERFECT_PODIUM + POINTS_SYSTEM.PERFECT_TOP_5;
  
  const maxSprintRace = maxRegularRace + POINTS_SYSTEM.SPRINT_POLE + POINTS_SYSTEM.SPRINT_WINNER +
                       POINTS_SYSTEM.SPRINT_2ND_EXACT + POINTS_SYSTEM.SPRINT_3RD_EXACT +
                       POINTS_SYSTEM.PERFECT_SPRINT_PODIUM;
  
  console.log(`\n=== SCORING INFO ===`);
  console.log(`Max possible points per regular race: ${maxRegularRace}`);
  console.log(`Max possible points per sprint race: ${maxSprintRace}`);
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
