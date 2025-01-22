const functions = require('firebase-functions');
const admin = require('firebase-admin');


async function helloWorldHandler({ data, auth }) {
	console.log('helloWorldHandler startuje3');

	if (!auth) {
		return { message: `nepreslo cez context.auth` };
	}

	const uid = auth.uid;
	const user = await admin.auth().getUser(uid);
	if (!user.customClaims || user.customClaims.role !== 'admin') {
		throw new functions.https.HttpsError('permission-denied', 'The user does not have the necessary permissions to execute this function. No admin role found!');
	}

	console.log('moje data', data);
	const someParameter = data.someParameter;
	return { message: `${someParameter}, pridane vo funkcii tralala2! ${user.customClaims.role}` };
}

module.exports = helloWorldHandler;