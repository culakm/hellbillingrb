const admin = require("firebase-admin");
admin.initializeApp();

async function getAdminRoleHandler(request) {
	const user = await admin.auth().getUserByEmail(request.data.email);
	const customClaims = user.customClaims || {};
	return {
		admin: customClaims.admin || false
	};
}

module.exports = getAdminRoleHandler;