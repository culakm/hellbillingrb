const admin = require("firebase-admin");
admin.initializeApp();
const functions = require('firebase-functions');
const db = admin.firestore();
const authRoleCheck = require('../auth/auth-role-check');

async function createUserHandler({ data, auth }) {
	try {
		await authRoleCheck(auth, 'admin');
		const { name, email, password, description, role } = data.user;

		const userRecord = await admin.auth().createUser({
			email: email,
			password: password,
		});

		await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

		// Add user to Firestore
		await db.collection('users').doc(userRecord.uid).set({
			name: name,
			email: email,
			description: description,
		});

		return { message: `User ${name} was created successfully` };
	} catch (error) {
		const errorMessage = `Error creating user, ${error}`;
		console.error(errorMessage);
		throw new functions.https.HttpsError('internal', errorMessage);
	}
}

module.exports = createUserHandler;