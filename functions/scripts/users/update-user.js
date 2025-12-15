const admin = require('firebase-admin');
admin.initializeApp();
const { HttpsError } = require("firebase-functions/v2/https");
const db = admin.firestore();
const authRoleCheck = require('../auth/auth-role-check');

async function updateUserHandler({ data, auth }) {
	try {
		await authRoleCheck(auth, 'admin');
		const { userId, name, email, password, description, role } = data.user;

		const userRecord = await admin.auth().getUser(userId);

		const updateData = {};
		if (userRecord.email !== email) {
			updateData.email = email;
		}
		if (password) {
			updateData.password = password;
		}

		if (Object.keys(updateData).length > 0) {
			await admin.auth().updateUser(userId, updateData);
		}

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
		throw new HttpsError('internal', errorMessage);
	}
}

module.exports = updateUserHandler;