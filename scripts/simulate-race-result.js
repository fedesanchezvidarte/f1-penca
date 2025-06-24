// scripts/simulate-race-result.js
import { PrismaClient } from '../src/generated/prisma';
const prisma = new PrismaClient();

// Point system: More points for correctly predicting top positions
const POINTS_SYSTEM = {
  exactMatch: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1], // Points for exact position matches (positions 1-10)
  closeMatch: 1 // Points for being within +/- 1 position
};

async function main() {
  try {
    // Get the race (Bahrain)
    const race = await prisma.race.findFirst({
      where: { round: 1, season: 2025 }
    });
    
    if (!race) {
      console.log('No races found. Please run add-races.js first');
      return;
    }
    
    // Get all drivers
    const drivers = await prisma.driver.findMany({
      where: { active: true }
    });
    
    if (drivers.length === 0) {
      console.log('No drivers found. Please run add-drivers.js first');
      return;
    }
    
    // Create a race result (randomly shuffled drivers)
    const driverPositions = drivers.map(driver => driver.id);
    
    // Shuffle to create random results
    for (let i = driverPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [driverPositions[i], driverPositions[j]] = [driverPositions[j], driverPositions[i]];
    }
    
    // Check if result already exists
    let raceResult = await prisma.raceResult.findFirst({
      where: { raceId: race.id }
    });
    
    if (raceResult) {
      // Update existing result
      raceResult = await prisma.raceResult.update({
        where: { id: raceResult.id },
        data: {
          positions: driverPositions,
          updatedAt: new Date()
        }
      });
      console.log(`Updated result for race: ${race.name}`);
    } else {
      // Create new result
      raceResult = await prisma.raceResult.create({
        data: {
          raceId: race.id,
          positions: driverPositions
        }
      });
      console.log(`Created result for race: ${race.name}`);
    }
    
    // Update race status to COMPLETED
    await prisma.race.update({
      where: { id: race.id },
      data: {
        status: 'COMPLETED',
        resultsImported: true
      }
    });
    
    // Get all predictions for this race
    const predictions = await prisma.prediction.findMany({
      where: { raceId: race.id },
      include: {
        user: { select: { name: true } }
      }
    });
    
    // Calculate points for each prediction
    for (const prediction of predictions) {
      let totalPoints = 0;
      const predictedPositions = prediction.positions;
      
      // Calculate points for this prediction
      for (let i = 0; i < predictedPositions.length; i++) {
        const driverId = predictedPositions[i];
        const actualPosition = raceResult.positions.indexOf(driverId);
        
        // Driver not found in results
        if (actualPosition === -1) continue;
        
        // Exact match (driver is in exactly the position predicted)
        if (actualPosition === i && i < POINTS_SYSTEM.exactMatch.length) {
          totalPoints += POINTS_SYSTEM.exactMatch[i];
          console.log(`${prediction.user.name} got exact match for position ${i+1}: ${POINTS_SYSTEM.exactMatch[i]} points`);
        }
        // Close match (driver is within +/- 1 position)
        else if (Math.abs(actualPosition - i) === 1) {
          totalPoints += POINTS_SYSTEM.closeMatch;
          console.log(`${prediction.user.name} got close match for position ${i+1}: ${POINTS_SYSTEM.closeMatch} points`);
        }
      }
      
      // Update prediction with points
      await prisma.prediction.update({
        where: { id: prediction.id },
        data: { points: totalPoints }
      });
      
      console.log(`${prediction.user.name} earned ${totalPoints} points for ${race.name}`);
    }
    
    // Show the race results
    console.log(`\nResults for ${race.name}:`);
    
    // Get the drivers in the result order
    const resultDriverIds = raceResult.positions;
    
    for (let i = 0; i < Math.min(10, resultDriverIds.length); i++) {
      const driverId = resultDriverIds[i];
      const driver = drivers.find(d => d.id === driverId);
      if (driver) {
        console.log(`${i+1}. ${driver.fullname} (${driver.code})`);
      }
    }
      // Show predictions and points
    console.log('\nPredictions and points:');
    
    // Fetch the updated predictions with points
    const updatedPredictions = await prisma.prediction.findMany({
      where: { raceId: race.id },
      include: {
        user: { select: { name: true } }
      }
    });
    
    for (const prediction of updatedPredictions) {
      console.log(`- ${prediction.user.name}: ${prediction.points} points`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
