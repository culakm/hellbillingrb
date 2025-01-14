const admin = require("firebase-admin");
admin.initializeApp();

async function addAdminRoleHandler(request) {
	const email = request.data.email;
	const user = await admin.auth().getUserByEmail(email);
	await admin.auth().setCustomUserClaims(user.uid, { admin: true });
	return {
		message: `Success! ${email} has been made an admin.`
	};
}

module.exports = addAdminRoleHandler;