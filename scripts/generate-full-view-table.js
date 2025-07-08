import { PrismaClient } from '../src/generated/prisma/index.js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function generateFullViewTable() {
  console.log('=== FULL VIEW TABLE - POINTS PER USER PER ROUND ===\n');

  // Get all predictions with user and race data for the first 12 rounds
  const predictions = await prisma.prediction.findMany({
    include: {
      user: {
        select: {
          name: true,
          totalPoints: true
        }
      },
      race: {
        select: {
          round: true,
          name: true
        }
      }
    },
    where: {
      race: {
        round: {
          lte: 12
        }
      }
    },
    orderBy: [
      { user: { totalPoints: 'desc' } },
      { race: { round: 'asc' } }
    ]
  });

  // Organize data by user
  const userDataMap = new Map();
  
  predictions.forEach(prediction => {
    const userId = prediction.userId;
    const userName = prediction.user.name;
    const userTotalPoints = prediction.user.totalPoints;
    const round = prediction.race.round;
    const points = prediction.points;

    if (!userDataMap.has(userId)) {
      userDataMap.set(userId, {
        name: userName,
        totalPoints: userTotalPoints,
        rounds: new Map()
      });
    }

    userDataMap.get(userId).rounds.set(round, points);
  });

  // Generate the table
  console.log('Pos | User                  | Total | R1  | R2  | R3  | R4  | R5  | R6  | R7  | R8  | R9  | R10 | R11 | R12');
  console.log('----|-----------------------|-------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----');

  let position = 1;
  // Convert Map to Array and sort by total points
  const sortedUsers = Array.from(userDataMap.values()).sort((a, b) => b.totalPoints - a.totalPoints);

  sortedUsers.forEach(user => {
    let row = `${position.toString().padStart(3)} | ${user.name.padEnd(21)} | ${user.totalPoints.toString().padStart(5)} |`;
    
    // Add points per round (1-12)
    for (let round = 1; round <= 12; round++) {
      const points = user.rounds.get(round) || 0;
      const pointsStr = points === 0 ? '-' : points.toString();
      row += ` ${pointsStr.padStart(3)} |`;
    }
    
    console.log(row);
    position++;
  });

  console.log('----|-----------------------|-------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----');
  console.log('\nLegend:');
  console.log('- R1-R12: Points obtained in each round');
  console.log('- "-": Did not participate in that round');
  console.log('- Total: Sum of points from the first 12 rounds');

  // Additional statistics
  console.log('\n📊 ADDITIONAL STATISTICS:');
  
  // User with best average per race
  let bestAverage = 0;
  let bestAverageUser = '';
  
  sortedUsers.forEach(user => {
    const participatedRounds = Array.from(user.rounds.values()).filter(points => points > 0).length;
    if (participatedRounds > 0) {
      const average = user.totalPoints / participatedRounds;
      if (average > bestAverage) {
        bestAverage = average;
        bestAverageUser = user.name;
      }
    }
  });

  console.log(`🎯 Best average per race: ${bestAverageUser} (${Math.round(bestAverage)} points per race)`);

  // Race with most participation
  const roundParticipation = new Map();
  for (let round = 1; round <= 12; round++) {
    let count = 0;
    sortedUsers.forEach(user => {
      if (user.rounds.has(round) && user.rounds.get(round) > 0) {
        count++;
      }
    });
    roundParticipation.set(round, count);
  }

  const maxParticipation = Math.max(...roundParticipation.values());
  const roundWithMaxParticipation = Array.from(roundParticipation.entries()).find(([, count]) => count === maxParticipation)[0];
  
  console.log(`🏁 Round with most participation: Round ${roundWithMaxParticipation} (${maxParticipation} users)`);
  
  console.log('\n✅ Full view table generated successfully.');
}

generateFullViewTable()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
