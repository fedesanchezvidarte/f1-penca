// scripts/create-dev-data-from-json.js
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Script to create development data for F1-Penca:
 * 1. Current F1 drivers
 * 2. Races for the 2025 season
 * 3. Test users
 * 4. Sample predictions
 * 5. Race results
 *
 * Data is loaded from JSON files in the /data/dev directory
 */

const prisma = new PrismaClient();

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "..", "data", "dev");

// Load data from JSON files
const loadJsonData = (fileName) => {
	const filePath = path.join(dataDir, fileName);
	try {
		const data = fs.readFileSync(filePath, "utf8");
		return JSON.parse(data);
	} catch (error) {
		console.error(`Error loading ${fileName}:`, error);
		return [];
	}
};

// Load all data files
const drivers = loadJsonData("drivers.json");
// Note: Teams data is loaded but not used directly in this script
loadJsonData("teams.json");
const races = loadJsonData("races.json");
const users = loadJsonData("users.json");
const predictions = loadJsonData("predictions.json");
const results = loadJsonData("results.json");

async function main() {
	try {
		console.log("🏎️ Creating development data for F1-Penca...");

		// 1. Create drivers
		console.log("\n📋 Creating drivers...");
		for (const driver of drivers) {
			const existingDriver = await prisma.driver.findUnique({
				where: { code: driver.code },
			});

			if (!existingDriver) {
				await prisma.driver.create({ data: driver });
				console.log(`  ✅ Driver created: ${driver.fullname} (${driver.code})`);
			} else {
				console.log(
					`  ℹ️ Driver already exists: ${driver.fullname} (${driver.code})`
				);
			}
		}

		// 2. Create races
		console.log("\n🏁 Creating races...");
		for (const race of races) {
			// Convert string date to Date object
			const raceData = {
				...race,
				date: new Date(race.date),
			};

			const existingRace = await prisma.race.findFirst({
				where: {
					round: race.round,
					season: race.season,
				},
			});

			if (!existingRace) {
				await prisma.race.create({ data: raceData });
				console.log(`  ✅ Race created: ${race.name} (Round ${race.round})`);
			} else {
				console.log(
					`  ℹ️ Race already exists: ${race.name} (Round ${race.round})`
				);
			}
		}

		// 3. Create test users
		console.log("\n👤 Creating test users...");
		for (const user of users) {
			const existingUser = await prisma.user.findFirst({
				where: { email: user.email },
			});

			if (!existingUser) {
				await prisma.user.create({
					data: user,
				});
				console.log(`  ✅ User created: ${user.name} (${user.email})`);
			} else {
				console.log(`  ℹ️ User already exists: ${user.name} (${user.email})`);
			}
		} // 4. Create sample predictions
		console.log("\n🔮 Creating sample predictions...");

		// Get all races
		const allRaces = await prisma.race.findMany({
			where: { season: 2025 },
			orderBy: { round: "asc" },
		});

		// Get all users
		const allUsers = await prisma.user.findMany();

		// Get all drivers
		const allDrivers = await prisma.driver.findMany({
			where: { active: true },
		});

		// Create predictions from JSON file
		for (const prediction of predictions) {
			// Find user by ID or email
			const user = allUsers.find(
				(u) => u.id === prediction.userId || u.email === prediction.userId
			);
			if (!user) {
				console.log(`  ⚠️ User not found for prediction: ${prediction.userId}`);
				continue;
			}

			// Find race by ID or round
			const race = allRaces.find(
				(r) => r.id === prediction.raceId || r.round === prediction.raceId
			);
			if (!race) {
				console.log(`  ⚠️ Race not found for prediction: ${prediction.raceId}`);
				continue;
			}

			const existingPrediction = await prisma.prediction.findFirst({
				where: {
					userId: user.id,
					raceId: race.id,
				},
			});

			if (!existingPrediction) {
				// Convert positions array to the format expected by the database
				// Map the driver codes to IDs
				const positions = [];

				for (const pos of prediction.positions) {
					const driverCode = pos.driverId;
					const driver = allDrivers.find((d) => d.code === driverCode);

					if (driver) {
						positions.push(driver.id);
					} else {
						console.log(`  ⚠️ Driver not found: ${driverCode}`);
					}
				}

				if (positions.length > 0) {
					await prisma.prediction.create({
						data: {
							userId: user.id,
							raceId: race.id,
							positions: positions,
							points: prediction.pointsEarned || 0,
							createdAt: prediction.createdAt
								? new Date(prediction.createdAt)
								: new Date(),
						},
					});
					console.log(
						`  ✅ Prediction created for ${user.name} - ${race.name}`
					);
				} else {
					console.log(
						`  ⚠️ No valid drivers found for prediction: ${user.name} - ${race.name}`
					);
				}
			} else {
				console.log(
					`  ℹ️ Prediction already exists for ${user.name} - ${race.name}`
				);
			}
		} // 5. Create race results
		console.log("\n🏆 Creating race results...");
		for (const result of results) {
			// Find race by ID or round
			const race = allRaces.find(
				(r) => r.id === result.raceId || r.round === result.raceId
			);
			if (!race) {
				console.log(`  ⚠️ Race not found for result: ${result.raceId}`);
				continue;
			}

			const existingResult = await prisma.raceResult.findFirst({
				where: { raceId: race.id },
			});

			if (!existingResult) {
				// Convert positions array to the format expected by the database
				// Map the driver codes to IDs
				const positions = [];

				for (const pos of result.positions) {
					const driverCode = pos.driverId;
					const driver = allDrivers.find((d) => d.code === driverCode);

					if (driver) {
						positions.push(driver.id);
					} else {
						console.log(`  ⚠️ Driver not found: ${driverCode}`);
					}
				}

				if (positions.length > 0) {
					await prisma.raceResult.create({
						data: {
							raceId: race.id,
							positions: positions,
							createdAt: result.createdAt
								? new Date(result.createdAt)
								: new Date(),
						},
					});

					// Update race status
					await prisma.race.update({
						where: { id: race.id },
						data: {
							status: "COMPLETED",
							resultsImported: true,
						},
					});

					console.log(`  ✅ Result created for ${race.name}`);
				} else {
					console.log(`  ⚠️ No valid drivers found for result: ${race.name}`);
				}
			} else {
				console.log(`  ℹ️ Result already exists for ${race.name}`);
			}
		}

		console.log("\n✨ Setup completed! ✨");
		console.log("\nSummary:");
		console.log(`- ${await prisma.driver.count()} drivers`);
		console.log(`- ${await prisma.race.count()} races`);
		console.log(`- ${await prisma.user.count()} users`);
		console.log(`- ${await prisma.prediction.count()} predictions`);
		console.log(`- ${await prisma.raceResult.count()} race results`);
	} catch (error) {
		console.error("❌ Error:", error);
	} finally {
		await prisma.$disconnect();
	}
}

main();
