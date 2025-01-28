const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

// Initialize Firebase Admin
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

// Get the UID from command line arguments
const uid = process.argv[2];

if (!uid) {
	console.error('Please provide a user UID as an argument');
	process.exit(1);
}

// Set custom claims
async function setAdminClaim() {
	try {
		await admin.auth().setCustomUserClaims(uid, {
			role: 'admin'
		});

		// Verify the claims were set
		const user = await admin.auth().getUser(uid);
		console.log('Custom claims set successfully:', user.customClaims);
		process.exit(0);
	} catch (error) {
		console.error('Error setting custom claims:', error);
		process.exit(1);
	}
}

setAdminClaim();
