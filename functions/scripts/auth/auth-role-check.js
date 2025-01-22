const functions = require('firebase-functions');
const admin = require('firebase-admin');

const authRoleCheck = async (auth, requiredRole) => {
	if (!auth) {
		throw new functions.https.HttpsError('permission-denied', 'The user is not authenticated');
	}
	const uid = auth.uid;
	const user = await admin.auth().getUser(uid);
	if (!user.customClaims || user.customClaims.role !== requiredRole) {
		throw new functions.https.HttpsError('permission-denied', `The user does not have the necessary permissions to execute this function.`);
	}
	return user;
};

module.exports = authRoleCheck;