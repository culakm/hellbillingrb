const admin = require("firebase-admin");
admin.initializeApp();
const { HttpsError } = require("firebase-functions/v2/https");
const authRoleCheck = require('../auth/auth-role-check');

async function getUserRoleHandler({ data, auth }) {
	try {
		await authRoleCheck(auth, 'admin');
		const user = await admin.auth().getUserByEmail(data.email);
		const customClaims = user.customClaims || {};
		return {
			role: customClaims.role || 'user'
		};
	}
	catch (error) {
		const errorMessage = `Error getting user role, ${error}`;
		console.error(errorMessage);
		throw new HttpsError('internal', errorMessage);
	}
}

module.exports = getUserRoleHandler;