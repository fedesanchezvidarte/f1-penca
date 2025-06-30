import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  try {
    // Read the users.json file
    const usersData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '..', 'data', 'dev', 'users.json'), 'utf8')
    );

    console.log(`Found ${usersData.length} users in the JSON file.`);

    // Create or update users in the database
    let createdCount = 0;
    let updatedCount = 0;

    for (const userData of usersData) {
      const { name, email, image, totalPoints } = userData;
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        // Update existing user
        await prisma.user.update({
          where: { email },
          data: {
            name,
            image,
            totalPoints
          }
        });
        updatedCount++;
      } else {
        // Create new user
        await prisma.user.create({
          data: {
            name,
            email,
            image,
            totalPoints,
            role: 'USER'
          }
        });
        createdCount++;
      }
    }

    console.log(`Created ${createdCount} new users and updated ${updatedCount} existing users.`);
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
