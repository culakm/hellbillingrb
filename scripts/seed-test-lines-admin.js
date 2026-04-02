/**
 * Inserts test lines with various HTML formatting into Firestore emulator.
 * Uses Firebase Admin SDK to bypass security rules.
 * Run with: node scripts/seed-test-lines-admin.js <tripId>
 * Requires emulators running (npm run fb-emul).
 */

import { readFileSync } from "fs";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8081";

const app = initializeApp({ projectId: "hellbillingrb" });
const db = getFirestore(app);

const tripId = process.argv[2];
if (!tripId) {
	console.error("Usage: node scripts/seed-test-lines-admin.js <tripId>");
	process.exit(1);
}

const testLines = JSON.parse(readFileSync(new URL("./data/lines-examples.json", import.meta.url), "utf-8"));

for (const line of testLines) {
	const data = { ...line, tripId };
	await db.collection(`trips/${tripId}/lines`).doc(line.lineId).set(data);
	console.log(`Inserted: ${line.lineId} — ${line.name}`);
}

console.log(`\nDone! ${testLines.length} test lines added to trip ${tripId}.`);
process.exit(0);
