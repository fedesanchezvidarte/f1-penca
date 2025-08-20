// Points calculation service based on prediction-system.md
import { prisma } from '@/lib/prisma';

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

interface DriverPosition {
  driverId: string;
  position: number;
}

interface RaceResults {
  polePosition?: string | null;
  fastestLap?: string | null;
  raceResult?: DriverPosition[];
  sprintPolePosition?: string | null;
  sprintResult?: DriverPosition[];
}

interface PredictionData {
  id: string;
  userId: string;
  positions: string[];
  polePositionPrediction?: string | null;
  fastestLapPrediction?: string | null;
  sprintPositions?: string[] | null;
  sprintPolePrediction?: string | null;
}

/**
 * Calculate points for a single prediction based on race results
 */
function calculatePredictionPoints(prediction: PredictionData, raceResults: RaceResults): number {
  let points = 0;
  
  // Main race position points
  if (prediction.positions && raceResults.raceResult) {
    const actualPositions = raceResults.raceResult
      .sort((a, b) => a.position - b.position)
      .map(r => r.driverId);
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
  if (prediction.polePositionPrediction === raceResults.polePosition) {
    points += POINTS_SYSTEM.POLE_POSITION;
  }
  
  // Fastest lap points
  if (prediction.fastestLapPrediction === raceResults.fastestLap) {
    points += POINTS_SYSTEM.FASTEST_LAP;
  }
  
  // Sprint race points
  if (prediction.sprintPositions && raceResults.sprintResult) {
    const actualSprintPositions = raceResults.sprintResult
      .sort((a, b) => a.position - b.position)
      .map(r => r.driverId);
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
    if (prediction.sprintPolePrediction === raceResults.sprintPolePosition) {
      points += POINTS_SYSTEM.SPRINT_POLE;
    }
  }
  
  return points;
}

/**
 * Calculate and update points for all predictions related to a specific race
 */
export async function calculateAndUpdateRacePoints(raceId: string, raceResults: RaceResults): Promise<void> {
  try {
    console.log(`Calculating points for race ${raceId}...`);
    
    // Get all predictions for this race
    const predictions = await prisma.prediction.findMany({
      where: { raceId },
      select: {
        id: true,
        userId: true,
        positions: true,
        polePositionPrediction: true,
        fastestLapPrediction: true,
        sprintPositions: true,
        sprintPolePrediction: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(`Found ${predictions.length} predictions to calculate points for.`);
    
    const pointsUpdates: Array<{
      id: string;
      userId: string;
      userName: string | null;
      points: number;
    }> = [];
    
    // Calculate points for each prediction
    for (const prediction of predictions) {
      const predictionData: PredictionData = {
        id: prediction.id,
        userId: prediction.userId,
        positions: prediction.positions as string[],
        polePositionPrediction: prediction.polePositionPrediction,
        fastestLapPrediction: prediction.fastestLapPrediction,
        sprintPositions: prediction.sprintPositions as string[] | null,
        sprintPolePrediction: prediction.sprintPolePrediction,
      };
      
      const points = calculatePredictionPoints(predictionData, raceResults);
      
      pointsUpdates.push({
        id: prediction.id,
        userId: prediction.userId,
        userName: prediction.user.name,
        points,
      });
      
      console.log(`${prediction.user.name}: ${points} points`);
    }
    
    // Update all predictions with calculated points in a transaction
    await prisma.$transaction(async (tx) => {
      // Update prediction points
      for (const update of pointsUpdates) {
        await tx.prediction.update({
          where: { id: update.id },
          data: { points: update.points },
        });
      }
      
      // Recalculate and update user total points for affected users
      const affectedUserIds = [...new Set(pointsUpdates.map(u => u.userId))];
      
      for (const userId of affectedUserIds) {
        const userPredictions = await tx.prediction.findMany({
          where: { userId },
          select: { points: true },
        });
        
        const totalPoints = userPredictions.reduce((sum, pred) => sum + pred.points, 0);
        
        await tx.user.update({
          where: { id: userId },
          data: { totalPoints },
        });
      }
    });
    
    console.log(`Points calculation completed for race ${raceId}. Updated ${pointsUpdates.length} predictions and ${[...new Set(pointsUpdates.map(u => u.userId))].length} user totals.`);
    
  } catch (error) {
    console.error(`Error calculating points for race ${raceId}:`, error);
    throw error;
  }
}

/**
 * Recalculate all points for all predictions (manual trigger for admin)
 */
export async function recalculateAllPoints(): Promise<void> {
  try {
    console.log('Recalculating all prediction points...');
    
    // Get all races with results
    const racesWithResults = await prisma.race.findMany({
      where: {
        resultsImported: true,
        status: 'COMPLETED',
      },
      include: {
        results: true,
      },
    });
    
    console.log(`Found ${racesWithResults.length} completed races with results.`);
    
    for (const race of racesWithResults) {
      if (race.results.length > 0) {
        const raceResult = race.results[0]; // Assuming one result per race
        
        // Transform the result data to match our interface
        const raceResults: RaceResults = {
          polePosition: raceResult.polePosition,
          fastestLap: raceResult.fastestLap,
          raceResult: raceResult.raceResult as unknown as DriverPosition[],
          sprintPolePosition: raceResult.sprintPolePosition,
          sprintResult: raceResult.sprintResult as unknown as DriverPosition[] | undefined,
        };
        
        await calculateAndUpdateRacePoints(race.id, raceResults);
      }
    }
    
    console.log('All points recalculation completed!');
    
  } catch (error) {
    console.error('Error recalculating all points:', error);
    throw error;
  }
}

/**
 * Get points breakdown for a specific prediction (for detailed display)
 */
export function getPredictionPointsBreakdown(prediction: PredictionData, raceResults: RaceResults): {
  total: number;
  breakdown: {
    category: string;
    points: number;
    description: string;
  }[];
} {
  const breakdown: { category: string; points: number; description: string }[] = [];
  let total = 0;
  
  // Main race position points
  if (prediction.positions && raceResults.raceResult) {
    const actualPositions = raceResults.raceResult
      .sort((a, b) => a.position - b.position)
      .map(r => r.driverId);
    const predictedPositions = prediction.positions;
    
    // Check each predicted position
    for (let i = 0; i < Math.min(predictedPositions.length, 5); i++) {
      const predictedDriver = predictedPositions[i];
      const actualPosition = actualPositions.indexOf(predictedDriver);
      
      if (actualPosition === i) {
        // Exact position match
        let points = 0;
        let description = '';
        
        if (i === 0) {
          points = POINTS_SYSTEM.RACE_WINNER;
          description = `Race Winner (${predictedDriver})`;
        } else if (i === 1) {
          points = POINTS_SYSTEM.RACE_2ND_EXACT;
          description = `2nd Place Exact (${predictedDriver})`;
        } else if (i === 2) {
          points = POINTS_SYSTEM.RACE_3RD_EXACT;
          description = `3rd Place Exact (${predictedDriver})`;
        } else if (i < 5) {
          points = POINTS_SYSTEM.TOP_5_EXACT;
          description = `${i + 1}th Place Exact (${predictedDriver})`;
        }
        
        breakdown.push({ category: 'Race Position', points, description });
        total += points;
      } else if (actualPosition !== -1) {
        // Driver finished in different position
        let points = 0;
        let description = '';
        
        if (i === 1 && actualPosition < 3) {
          points = POINTS_SYSTEM.RACE_2ND_PODIUM;
          description = `2nd Place Prediction on Podium (${predictedDriver})`;
        } else if (i === 2 && actualPosition < 3) {
          points = POINTS_SYSTEM.RACE_3RD_PODIUM;
          description = `3rd Place Prediction on Podium (${predictedDriver})`;
        } else if (i < 5 && actualPosition < 5) {
          points = POINTS_SYSTEM.TOP_5_CORRECT;
          description = `Top 5 Correct Driver (${predictedDriver})`;
        }
        
        if (points > 0) {
          breakdown.push({ category: 'Race Position', points, description });
          total += points;
        }
      }
    }
    
    // Check for perfect bonuses
    if (predictedPositions.length >= 3 && actualPositions.length >= 3) {
      // Perfect podium bonus
      if (predictedPositions[0] === actualPositions[0] && 
          predictedPositions[1] === actualPositions[1] && 
          predictedPositions[2] === actualPositions[2]) {
        breakdown.push({ 
          category: 'Bonus', 
          points: POINTS_SYSTEM.PERFECT_PODIUM, 
          description: 'Perfect Podium Prediction' 
        });
        total += POINTS_SYSTEM.PERFECT_PODIUM;
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
          breakdown.push({ 
            category: 'Bonus', 
            points: POINTS_SYSTEM.PERFECT_TOP_5, 
            description: 'Perfect Top 5 Prediction' 
          });
          total += POINTS_SYSTEM.PERFECT_TOP_5;
        }
      }
    }
  }
  
  // Pole position points
  if (prediction.polePositionPrediction === raceResults.polePosition) {
    breakdown.push({ 
      category: 'Qualifying', 
      points: POINTS_SYSTEM.POLE_POSITION, 
      description: `Pole Position (${prediction.polePositionPrediction})` 
    });
    total += POINTS_SYSTEM.POLE_POSITION;
  }
  
  // Fastest lap points
  if (prediction.fastestLapPrediction === raceResults.fastestLap) {
    breakdown.push({ 
      category: 'Race', 
      points: POINTS_SYSTEM.FASTEST_LAP, 
      description: `Fastest Lap (${prediction.fastestLapPrediction})` 
    });
    total += POINTS_SYSTEM.FASTEST_LAP;
  }
  
  // Sprint race points
  if (prediction.sprintPositions && raceResults.sprintResult) {
    const actualSprintPositions = raceResults.sprintResult
      .sort((a, b) => a.position - b.position)
      .map(r => r.driverId);
    const predictedSprintPositions = prediction.sprintPositions;
    
    // Check each predicted sprint position (only top 3 for sprint)
    for (let i = 0; i < Math.min(predictedSprintPositions.length, 3); i++) {
      const predictedDriver = predictedSprintPositions[i];
      const actualPosition = actualSprintPositions.indexOf(predictedDriver);
      
      if (actualPosition === i) {
        let points = 0;
        let description = '';
        
        if (i === 0) {
          points = POINTS_SYSTEM.SPRINT_WINNER;
          description = `Sprint Winner (${predictedDriver})`;
        } else if (i === 1) {
          points = POINTS_SYSTEM.SPRINT_2ND_EXACT;
          description = `Sprint 2nd Place (${predictedDriver})`;
        } else if (i === 2) {
          points = POINTS_SYSTEM.SPRINT_3RD_EXACT;
          description = `Sprint 3rd Place (${predictedDriver})`;
        }
        
        breakdown.push({ category: 'Sprint', points, description });
        total += points;
      } else if (actualPosition !== -1 && actualPosition < 3) {
        let points = 0;
        let description = '';
        
        if (i === 1) {
          points = POINTS_SYSTEM.SPRINT_2ND_PODIUM;
          description = `Sprint 2nd Prediction on Podium (${predictedDriver})`;
        } else if (i === 2) {
          points = POINTS_SYSTEM.SPRINT_3RD_PODIUM;
          description = `Sprint 3rd Prediction on Podium (${predictedDriver})`;
        }
        
        if (points > 0) {
          breakdown.push({ category: 'Sprint', points, description });
          total += points;
        }
      }
    }
    
    // Perfect sprint podium bonus
    if (predictedSprintPositions.length >= 3 && actualSprintPositions.length >= 3) {
      if (predictedSprintPositions[0] === actualSprintPositions[0] && 
          predictedSprintPositions[1] === actualSprintPositions[1] && 
          predictedSprintPositions[2] === actualSprintPositions[2]) {
        breakdown.push({ 
          category: 'Sprint Bonus', 
          points: POINTS_SYSTEM.PERFECT_SPRINT_PODIUM, 
          description: 'Perfect Sprint Podium' 
        });
        total += POINTS_SYSTEM.PERFECT_SPRINT_PODIUM;
      }
    }
    
    // Sprint pole position points
    if (prediction.sprintPolePrediction === raceResults.sprintPolePosition) {
      breakdown.push({ 
        category: 'Sprint Qualifying', 
        points: POINTS_SYSTEM.SPRINT_POLE, 
        description: `Sprint Pole (${prediction.sprintPolePrediction})` 
      });
      total += POINTS_SYSTEM.SPRINT_POLE;
    }
  }
  
  return { total, breakdown };
}

export { POINTS_SYSTEM };
