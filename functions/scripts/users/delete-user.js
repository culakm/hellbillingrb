const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const authRoleCheck = require('../auth/auth-role-check');


async function deleteUserHandler({ data, auth }) {
	try {
		await authRoleCheck(auth, 'admin');

		const userId = data.userId;

		console.log('deletujem userId', userId);
		// Delete user from Firebase Authentication
		await admin.auth().deleteUser(userId);

		// Remove user document from Firestore
		await db.collection('users').doc(userId).delete();

		return { message: `User ${userId} was deleted successfully` };
	} catch (error) {
		const errorMessage = `Error creating user, ${error}`;
		console.error(errorMessage);
		throw new functions.https.HttpsError('internal', errorMessage);
	}
}

module.exports = deleteUserHandler;