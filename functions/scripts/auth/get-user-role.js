const admin = require("firebase-admin");

async function getUserRoleHandler(request) {
	const user = await admin.auth().getUserByEmail(request.data.email);
	const customClaims = user.customClaims || {};
	return {
		role: customClaims.role || 'user'
	};
}

module.exports = getUserRoleHandler;