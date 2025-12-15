const admin = require('firebase-admin');
admin.initializeApp();
const { HttpsError } = require("firebase-functions/v2/https");
const db = admin.firestore();
const authRoleCheck = require('../auth/auth-role-check');

async function deleteUserHandler({ data, auth }) {
	try {
		await authRoleCheck(auth, 'admin');

		const userId = data.userId;
		await admin.auth().deleteUser(userId);
		await db.collection('users').doc(userId).delete();

		return { message: `User ${userId} was deleted successfully` };
	} catch (error) {
		const errorMessage = `Error creating user, ${error}`;
		console.error(errorMessage);
		throw new HttpsError('internal', errorMessage);
	}
}

module.exports = deleteUserHandler;