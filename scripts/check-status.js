import { PrismaClient } from '../src/generated/prisma/index.js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function checkDatabaseStatus() {
  console.log('=== F1 PENCA DATABASE STATUS ===\n');
  
  try {
    // Check users
    const users = await prisma.user.findMany({
      orderBy: { totalPoints: 'desc' }
    });
    
    console.log('👥 USERS:');
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.totalPoints} points - ${user.role}`);
    });
    
    // Check drivers
    const drivers = await prisma.driver.findMany({
      where: { active: true },
      orderBy: { number: 'asc' }
    });
    
    console.log(`\n🏎️  DRIVERS: ${drivers.length} active drivers`);
    
    // Check races
    const races = await prisma.race.findMany({
      orderBy: { round: 'asc' }
    });
    
    const completedRaces = races.filter(r => r.status === 'COMPLETED');
    const upcomingRaces = races.filter(r => r.status === 'UPCOMING');
    
    console.log(`\n🏁 RACES: ${races.length} total races`);
    console.log(`  - Completed: ${completedRaces.length}`);
    console.log(`  - Upcoming: ${upcomingRaces.length}`);
    
    // Check race results
    const raceResults = await prisma.raceResult.findMany({
      include: {
        race: true
      }
    });
    
    console.log(`\n📊 RACE RESULTS: ${raceResults.length} results imported`);
    
    // Check predictions
    const predictions = await prisma.prediction.findMany({
      include: {
        race: true,
        user: true
      }
    });
    
    console.log(`\n🎯 PREDICTIONS: ${predictions.length} total predictions`);
    
    // Group predictions by race
    const predictionsByRace = predictions.reduce((acc, pred) => {
      const raceKey = `${pred.race.round}. ${pred.race.name}`;
      if (!acc[raceKey]) acc[raceKey] = [];
      acc[raceKey].push(pred);
      return acc;
    }, {});
    
    console.log('\n📝 PREDICTIONS BY RACE:');
    Object.entries(predictionsByRace).forEach(([raceName, racePredictions]) => {
      console.log(`  ${raceName}: ${racePredictions.length} predictions`);
    });
    
    // Check points distribution
    const totalPoints = predictions.reduce((sum, pred) => sum + pred.points, 0);
    const avgPoints = totalPoints / predictions.length;
    
    console.log(`\n🏆 POINTS SUMMARY:`);
    console.log(`  - Total points awarded: ${totalPoints}`);
    console.log(`  - Average points per prediction: ${avgPoints.toFixed(1)}`);
    
    // Show next race
    const nextRace = races.find(r => r.status === 'UPCOMING');
    if (nextRace) {
      console.log(`\n🚀 NEXT RACE: ${nextRace.name} (Round ${nextRace.round})`);
      console.log(`  Date: ${nextRace.date.toLocaleDateString()}`);
      console.log(`  Circuit: ${nextRace.circuit}`);
    }
    
  } catch (error) {
    console.error('Error checking database status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStatus();
