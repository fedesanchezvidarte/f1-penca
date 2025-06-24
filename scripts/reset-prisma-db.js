// scripts/reset-prisma-db.js
import { execSync } from "child_process";

/**
 * Script to reset the database and reapply migrations
 */
async function main() {
	try {
		console.log("🔄 Resetting F1-Penca database...");

		// Execute prisma migrate reset (deletes and recreates the database)
		console.log("\n🗑️ Deleting and recreating the database...");
		execSync("npx prisma migrate reset --force", { stdio: "inherit" });

		console.log("\n✅ Database reset successfully.");
		console.log(
			"\nYou can run 'npm run seed' to load development data."
		);
	} catch (error) {
		console.error("\n❌ Error resetting the database:", error);
		process.exit(1);
	}
}

main();
