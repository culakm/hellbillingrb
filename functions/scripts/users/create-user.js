const admin = require("firebase-admin");
admin.initializeApp();
const { HttpsError } = require("firebase-functions/v2/https");
const db = admin.firestore();
const authRoleCheck = require("../auth/auth-role-check");
const { user } = require("firebase-functions/v1/auth");

async function createUserHandler({ data, auth }) {
	try {
		await authRoleCheck(auth, "admin");
		const { name, email, password, description, role } = data.user;

		const userRecord = await admin.auth().createUser({
			email: email,
			password: password,
		});

		await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

		await db.collection("users").doc(userRecord.uid).set({
			name: name,
			email: email,
			description: description,
			userId: userRecord.uid,
		});

		return { message: `User ${name} was created successfully`, userId: userRecord.uid };
	} catch (error) {
		const errorMessage = `Error creating user in cloud function: ${error}`;
		console.error(errorMessage);
		throw new HttpsError("internal", errorMessage);
	}
}

module.exports = createUserHandler;
