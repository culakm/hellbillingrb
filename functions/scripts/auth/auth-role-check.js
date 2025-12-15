const { HttpsError } = require("firebase-functions/v2/https");
const admin = require('firebase-admin');

const authRoleCheck = async (auth, requiredRole) => {
	if (!auth) {
		throw new HttpsError('permission-denied', 'The user is not authenticated');
	}
	const uid = auth.uid;
	const user = await admin.auth().getUser(uid);
	if (!user.customClaims || user.customClaims.role !== requiredRole) {
		const errorMessage = `The user does not have the necessary permissions to execute this function.`;
		console.error(errorMessage);
		throw new HttpsError('permission-denied', errorMessage);
	}
	return user;
};

module.exports = authRoleCheck;