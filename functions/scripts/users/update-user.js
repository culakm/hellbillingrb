const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const authRoleCheck = require('../auth/auth-role-check');

async function updateUserHandler({ data, auth }) {
	try {
		await authRoleCheck(auth, 'admin');
		const { userId, name, email, password, description, role } = data.user;
		console.log('updateUserHandler', data);

		const userRecord = await admin.auth().updateUser(userId, {
			email: email,
			password: password,
		});

		await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

		await db.collection('users').doc(userRecord.uid).update({
			name: name,
			email: email,
			description: description,
		});

		return { message: `User ${name} was updated successfully` };
	} catch (error) {
		const errorMessage = `Error updating user, ${error}`;
		console.error(errorMessage);
		throw new functions.https.HttpsError('internal', errorMessage);
	}
}

module.exports = updateUserHandler;