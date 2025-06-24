// scripts/create-dev-data.js
import { PrismaClient } from "@prisma/client";

/**
 * Script to create development data for F1-Penca:
 * 1. Current F1 drivers
 * 2. Races for the 2025 season
 * 3. Test users
 * 4. Sample predictions
 */

const prisma = new PrismaClient();

// Drivers data for 2025
const drivers = [
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
	{
		number: 63,
		code: "RUS",
		firstname: "George",
		lastname: "Russell",
		fullname: "George Russell",
		nationality: "British",
		team: "Mercedes",
		active: true,
	},
	{
		number: 81,
		code: "PIA",
		firstname: "Oscar",
		lastname: "Piastri",
		fullname: "Oscar Piastri",
		nationality: "Australian",
		team: "McLaren",
		active: true,
	},
	{
		number: 14,
		code: "ALO",
		firstname: "Fernando",
		lastname: "Alonso",
		fullname: "Fernando Alonso",
		nationality: "Spanish",
		team: "Aston Martin",
		active: true,
	},
	{
		number: 18,
		code: "STR",
		firstname: "Lance",
		lastname: "Stroll",
		fullname: "Lance Stroll",
		nationality: "Canadian",
		team: "Aston Martin",
		active: true,
	},
	{
		number: 10,
		code: "GAS",
		firstname: "Pierre",
		lastname: "Gasly",
		fullname: "Pierre Gasly",
		nationality: "French",
		team: "Alpine",
		active: true,
	},
	{
		number: 31,
		code: "OCO",
		firstname: "Esteban",
		lastname: "Ocon",
		fullname: "Esteban Ocon",
		nationality: "French",
		team: "Alpine",
		active: true,
	},
	{
		number: 23,
		code: "ALB",
		firstname: "Alexander",
		lastname: "Albon",
		fullname: "Alexander Albon",
		nationality: "Thai",
		team: "Williams",
		active: true,
	},
	{
		number: 2,
		code: "SAR",
		firstname: "Logan",
		lastname: "Sargeant",
		fullname: "Logan Sargeant",
		nationality: "American",
		team: "Williams",
		active: true,
	},
	{
		number: 77,
		code: "BOT",
		firstname: "Valtteri",
		lastname: "Bottas",
		fullname: "Valtteri Bottas",
		nationality: "Finnish",
		team: "Stake F1 Team",
		active: true,
	},
	{
		number: 24,
		code: "ZHO",
		firstname: "Guanyu",
		lastname: "Zhou",
		fullname: "Guanyu Zhou",
		nationality: "Chinese",
		team: "Stake F1 Team",
		active: true,
	},
	{
		number: 20,
		code: "MAG",
		firstname: "Kevin",
		lastname: "Magnussen",
		fullname: "Kevin Magnussen",
		nationality: "Danish",
		team: "Haas F1 Team",
		active: true,
	},
	{
		number: 27,
		code: "HUL",
		firstname: "Nico",
		lastname: "Hulkenberg",
		fullname: "Nico Hulkenberg",
		nationality: "German",
		team: "Haas F1 Team",
		active: true,
	},
	{
		number: 3,
		code: "RIC",
		firstname: "Daniel",
		lastname: "Ricciardo",
		fullname: "Daniel Ricciardo",
		nationality: "Australian",
		team: "RB",
		active: true,
	},
	{
		number: 22,
		code: "TSU",
		firstname: "Yuki",
		lastname: "Tsunoda",
		fullname: "Yuki Tsunoda",
		nationality: "Japanese",
		team: "RB",
		active: true,
	},
];

// Races data for 2025
const races = [
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
	{
		name: "Chinese Grand Prix",
		round: 5,
		circuit: "Shanghai International Circuit",
		date: new Date("2025-04-20T07:00:00Z"),
		season: 2025,
		status: "UPCOMING",
	},
	{
		name: "Miami Grand Prix",
		round: 6,
		circuit: "Miami International Autodrome",
		date: new Date("2025-05-04T19:00:00Z"),
		season: 2025,
		status: "UPCOMING",
	},
	{
		name: "Emilia Romagna Grand Prix",
		round: 7,
		circuit: "Autodromo Enzo e Dino Ferrari",
		date: new Date("2025-05-18T13:00:00Z"),
		season: 2025,
		status: "UPCOMING",
	},
	{
		name: "Monaco Grand Prix",
		round: 8,
		circuit: "Circuit de Monaco",
		date: new Date("2025-05-25T13:00:00Z"),
		season: 2025,
		status: "UPCOMING",
	},
];

// Test users
const users = [
	{
		name: "Usuario Prueba",
		email: "test@example.com",
		role: "USER",
	},
	{
		name: "Admin Prueba",
		email: "admin@example.com",
		role: "ADMIN",
	},
	{
		name: "Fernando Alonso Fan",
		email: "alonso@fan.com",
		role: "USER",
	},
	{
		name: "Ferrari Fan",
		email: "ferrari@fan.com",
		role: "USER",
	},
];

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
			const existingRace = await prisma.race.findFirst({
				where: {
					round: race.round,
					season: race.season,
				},
			});

			if (!existingRace) {
				await prisma.race.create({ data: race });
				console.log(
					`  ✅ Race created: ${race.name} (Round ${race.round})`
				);
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
				console.log(
					`  ℹ️ User already exists: ${user.name} (${user.email})`
				);
			}
		}
		// 4. Create sample predictions
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
		// For each user and each race up to the 4th, create a prediction
		for (const user of allUsers) {
			for (const race of allRaces.slice(0, 4)) {
				const existingPrediction = await prisma.prediction.findFirst({
					where: {
						userId: user.id,
						raceId: race.id,
					},
				});

				if (!existingPrediction) {
					// Create a copy of driver IDs to shuffle
					const driverIds = allDrivers.map((p) => p.id);

					// Shuffle randomly to create a unique prediction
					for (let i = driverIds.length - 1; i > 0; i--) {
						const j = Math.floor(Math.random() * (i + 1));
						[driverIds[i], driverIds[j]] = [driverIds[j], driverIds[i]];
					}

					await prisma.prediction.create({
						data: {
							userId: user.id,
							raceId: race.id,
							positions: driverIds,
						},
					});
					console.log(
						`  ✅ Prediction created for ${user.name} - ${race.name}`
					);
				} else {
					console.log(
						`  ℹ️ Prediction already exists for ${user.name} - ${race.name}`
					);
				}
			}
		}
		// 5. Simulate result for the first race
		console.log("\n🏆 Simulating result for the first race...");
		const firstRace = allRaces[0];

		const existingResult = await prisma.raceResult.findFirst({
			where: { raceId: firstRace.id },
		});

		if (!existingResult) {
			// Create a copy of driver IDs to shuffle
			const driverIds = allDrivers.map((p) => p.id);

			// Shuffle randomly to create a result
			for (let i = driverIds.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[driverIds[i], driverIds[j]] = [driverIds[j], driverIds[i]];
			}

			await prisma.raceResult.create({
				data: {
					raceId: firstRace.id,
					positions: driverIds,
				},
			});			// Update race status
			await prisma.race.update({
				where: { id: firstRace.id },
				data: {
					status: "COMPLETED",
					resultsImported: true,
				},
			});

			console.log(`  ✅ Result simulated for ${firstRace.name}`);

			// Calculate points for predictions
			const predictions = await prisma.prediction.findMany({
				where: { raceId: firstRace.id },
				include: {
					user: { select: { name: true } },
				},
			});

			// Points system
			const POINTS_SYSTEM = {
				exact: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1], // Points for exact positions (1-10)
				close: 1, // Points for being +/- 1 position
			};			for (const prediction of predictions) {
				let totalPoints = 0;
				const predictedPositions = prediction.positions;

				// Calculate points for this prediction
				for (let i = 0; i < predictedPositions.length; i++) {
					const driverId = predictedPositions[i];
					const realPosition = driverIds.indexOf(driverId);

					// Driver not found in results
					if (realPosition === -1) continue;

					// Exact match (driver is in the exact predicted position)
					if (realPosition === i && i < POINTS_SYSTEM.exact.length) {
						totalPoints += POINTS_SYSTEM.exact[i];
						console.log(
							`  ${prediction.user.name} predicted exactly position ${
								i + 1
							}: ${POINTS_SYSTEM.exact[i]} points`
						);
					}
					// Close match (driver is within +/- 1 position)
					else if (Math.abs(realPosition - i) === 1) {
						totalPoints += POINTS_SYSTEM.close;
						console.log(
							`  ${prediction.user.name} almost predicted position ${i + 1}: ${
								POINTS_SYSTEM.close
							} points`
						);
					}
				}				// Update prediction with points
				await prisma.prediction.update({
					where: { id: prediction.id },
					data: { points: totalPoints },
				});

				console.log(
					`  ${prediction.user.name} earned ${totalPoints} points for ${firstRace.name}`
				);
			}
		} else {
			console.log(`  ℹ️ A result already exists for ${firstRace.name}`);
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
