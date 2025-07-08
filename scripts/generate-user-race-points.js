import { PrismaClient } from '../src/generated/prisma/index.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

// Function to generate simulated points based on the scoring system
function generateSimulatedPoints(userId) {
  // Different user profiles to make it more realistic
  const userProfiles = {
    'user1': 'expert',    // Very good
    'user2': 'expert',    // Very good  
    'user3': 'good',      // Good
    'user4': 'expert',    // Very good
    'user5': 'average',   // Average
    'user6': 'good',      // Good
    'user7': 'good',      // Good
    'user8': 'average',   // Average
    'user9': 'average',   // Average
    'user10': 'good',     // Good
    'user11': 'beginner', // Beginner
    'user12': 'average',  // Average
    'user13': 'beginner', // Beginner
    'user14': 'average',  // Average
    'user15': 'good',     // Good
    'user16': 'beginner', // Beginner
    'user17': 'average',  // Average
    'user18': 'beginner', // Beginner
    'user19': 'good',     // Good
    'user20': 'average',  // Average
    'user21': 'beginner', // Beginner
  };

  const profile = userProfiles[userId] || 'average';
  
  // 10% chance of not participating in a race
  if (Math.random() < 0.1) {
    return 0;
  }

  let basePoints;
  let variation;

  switch (profile) {
    case 'expert':
      basePoints = 45;
      variation = 25; // 20-70 points typically
      break;
    case 'good':
      basePoints = 35;
      variation = 20; // 15-55 points typically
      break;
    case 'average':
      basePoints = 25;
      variation = 15; // 10-40 points typically
      break;
    case 'beginner':
      basePoints = 15;
      variation = 12; // 3-27 points typically
      break;
    default:
      basePoints = 25;
      variation = 15;
  }

  // Add a "luck" factor - some races can be exceptional
  const luckFactor = Math.random();
  if (luckFactor > 0.95) {
    // 5% chance of an exceptional prediction
    basePoints += 30;
  } else if (luckFactor < 0.1) {
    // 10% chance of a very bad prediction
    basePoints -= 10;
  }

  // Generate points with random variation
  const points = Math.max(0, Math.min(100, 
    Math.round(basePoints + (Math.random() - 0.5) * variation * 2)
  ));

  return points;
}

async function main() {
  console.log('Generating simulated user points per race data...');

  // Read existing data
  const usersPath = join(__dirname, '..', 'data', 'dev', 'users.json');
  const racesPath = join(__dirname, '..', 'data', 'dev', 'races.json');
  
  const usersData = JSON.parse(readFileSync(usersPath, 'utf-8'));
  const racesData = JSON.parse(readFileSync(racesPath, 'utf-8'));

  // Filter first 12 races
  const first12Races = racesData.filter(race => race.round <= 12);
  
  console.log(`Users found: ${usersData.length}`);
  console.log(`First 12 races:`, first12Races.map(r => `Round ${r.round}: ${r.name}`));

  // Create a table to store points per user and race
  const userRacePoints = [];

  for (const user of usersData) {
    console.log(`Generating data for ${user.name} (${user.id})...`);
    
    let totalUserPoints = 0;
    
    for (const race of first12Races) {
      const points = generateSimulatedPoints(user.id);
      totalUserPoints += points;
      
      userRacePoints.push({
        userId: user.id,
        raceId: race.id,
        round: race.round,
        raceName: race.name,
        points: points
      });
      
      console.log(`  - Round ${race.round} (${race.name}): ${points} points`);
    }
    
    console.log(`  Total points for ${user.name}: ${totalUserPoints}`);
    console.log('');
  }

  // Save generated data to a JSON file
  const outputPath = join(__dirname, '..', 'data', 'dev', 'user-race-points.json');
  const fs = await import('fs');
  fs.writeFileSync(outputPath, JSON.stringify(userRacePoints, null, 2));
  
  console.log(`Data generated and saved at: ${outputPath}`);
  console.log(`Total records generated: ${userRacePoints.length}`);

  // Show summary by user
  console.log('\n=== SUMMARY BY USER ===');
  const userSummary = {};
  
  userRacePoints.forEach(record => {
    if (!userSummary[record.userId]) {
      userSummary[record.userId] = {
        totalPoints: 0,
        races: 0,
        averagePoints: 0
      };
    }
    userSummary[record.userId].totalPoints += record.points;
    userSummary[record.userId].races += 1;
  });

  Object.keys(userSummary).forEach(userId => {
    const user = usersData.find(u => u.id === userId);
    const summary = userSummary[userId];
    summary.averagePoints = Math.round(summary.totalPoints / summary.races);
    
    console.log(`${user.name}: ${summary.totalPoints} total points, ${summary.averagePoints} average per race`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
