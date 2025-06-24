// scripts/setup-dev.js
import { PrismaClient } from "../src/generated/prisma";

/**
 * This script sets up the development environment:
 * 1. Creates F1 drivers
 * 2. Creates sample races
 * 3. Creates a test user
 * 4. Creates sample predictions
 */

const prisma = new PrismaClient();

// Sample driver data for 2025
const driversData = [
	{
		number: 1,
		code: "VER",
		firstname: "Max",
		lastname: "Verstappen",
		fullname: "Max Verstappen",
		nationality: "Dutch",
		team: "Red Bull Racing",
		active: true,
	},
	{
		number: 44,
		code: "HAM",
		firstname: "Lewis",
		lastname: "Hamilton",
		fullname: "Lewis Hamilton",
		nationality: "British",
		team: "Mercedes",
		active: true,
	},
	{
		number: 16,
		code: "LEC",
		firstname: "Charles",
		lastname: "Leclerc",
		fullname: "Charles Leclerc",
		nationality: "Monegasque",
		team: "Ferrari",
		active: true,
	},
	{
		number: 4,
		code: "NOR",
		firstname: "Lando",
		lastname: "Norris",
		fullname: "Lando Norris",
		nationality: "British",
		team: "McLaren",
		active: true,
	},
	{
		number: 55,
		code: "SAI",
		firstname: "Carlos",
		lastname: "Sainz",
		fullname: "Carlos Sainz",
		nationality: "Spanish",
		team: "Ferrari",
		active: true,
	},
	{
		number: 11,
		code: "PER",
		firstname: "Sergio",
		lastname: "Perez",
		fullname: "Sergio Perez",
		nationality: "Mexican",
		team: "Red Bull Racing",
		active: true,
	},
];

// Sample race data for 2025
const racesData = [
	{
		name: "Bahrain Grand Prix",
		round: 1,
		circuit: "Bahrain International Circuit",
		date: new Date("2025-03-02T15:00:00Z"),
		season: 2025,
		status: "UPCOMING",
	},
	{
		name: "Saudi Arabian Grand Prix",
		round: 2,
		circuit: "Jeddah Corniche Circuit",
		date: new Date("2025-03-09T15:00:00Z"),
		season: 2025,
		status: "UPCOMING",
	},
	{
		name: "Australian Grand Prix",
		round: 3,
		circuit: "Albert Park Circuit",
		date: new Date("2025-03-23T06:00:00Z"),
		season: 2025,
		status: "UPCOMING",
	},
	{
		name: "Japanese Grand Prix",
		round: 4,
		circuit: "Suzuka International Racing Course",
		date: new Date("2025-04-06T06:00:00Z"),
		season: 2025,
		status: "UPCOMING",
	},
];

async function main() {
	try {
		console.log("🏎️ Setting up F1-Penca development environment...");

		// 1. Create drivers
		console.log("\n📋 Creating drivers...");
		for (const driverData of driversData) {
			const existingDriver = await prisma.driver.findUnique({
				where: { code: driverData.code },
			});

			if (!existingDriver) {
				await prisma.driver.create({ data: driverData });
				console.log(
					`  ✅ Driver created: ${driverData.fullname} (${driverData.code})`
				);
			} else {
				console.log(
					`  ℹ️ Driver already exists: ${driverData.fullname} (${driverData.code})`
				);
			}
		}

		// 2. Create races
		console.log("\n🏁 Creating races...");
		for (const raceData of racesData) {
			const existingRace = await prisma.race.findFirst({
				where: {
					round: raceData.round,
					season: raceData.season,
				},
			});

			if (!existingRace) {
				await prisma.race.create({ data: raceData });
				console.log(
					`  ✅ Race created: ${raceData.name} (Round ${raceData.round})`
				);
			} else {
				console.log(
					`  ℹ️ Race already exists: ${raceData.name} (Round ${raceData.round})`
				);
			}
		}

		// 3. Create test user
		console.log("\n👤 Creating test user...");
		let testUser = await prisma.user.findFirst({
			where: { email: "test@example.com" },
		});

		if (!testUser) {
			testUser = await prisma.user.create({
				data: {
					name: "Test User",
					email: "test@example.com",
					role: "USER",
				},
			});
			console.log("  ✅ Test user created");
		} else {
			console.log("  ℹ️ Test user already exists");
		}

		// 4. Create sample prediction
		console.log("\n🔮 Creating sample prediction...");
		const firstRace = await prisma.race.findFirst({
			where: { round: 1, season: 2025 },
		});

		if (firstRace) {
			const allDrivers = await prisma.driver.findMany();
			const driverIds = allDrivers.map((d) => d.id);

			// Shuffle the array for a random prediction
			for (let i = driverIds.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[driverIds[i], driverIds[j]] = [driverIds[j], driverIds[i]];
			}

			const existingPrediction = await prisma.prediction.findFirst({
				where: {
					userId: testUser.id,
					raceId: firstRace.id,
				},
			});

			if (!existingPrediction) {
				await prisma.prediction.create({
					data: {
						userId: testUser.id,
						raceId: firstRace.id,
						positions: driverIds,
					},
				});
				console.log("  ✅ Prediction created for the first race");
			} else {
				console.log("  ℹ️ Prediction already exists for the first race");
			}
		}

		console.log("\n✨ Setup completed! ✨");
		console.log("\nSummary:");
		console.log(`- ${await prisma.driver.count()} drivers`);
		console.log(`- ${await prisma.race.count()} races`);
		console.log(`- ${await prisma.user.count()} users`);
		console.log(`- ${await prisma.prediction.count()} predictions`);
	} catch (error) {
		console.error("❌ Error:", error);
	} finally {
		await prisma.$disconnect();
	}
}

main();
