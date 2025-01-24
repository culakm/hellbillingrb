const functions = require('firebase-functions');
const admin = require('firebase-admin');


async function helloWorldHandler({ data, auth }) {
	console.log('helloWorldHandler startuje');

	try {
		await authRoleCheck(auth, 'admin');
		console.log('moje data', data);
		const someParameter = data.someParameter;
		return { message: `${someParameter}, pridane vo funkcii tralala2! ${user.customClaims.role}` };
	}
	catch (error) {
		const errorMessage = `Error getting helloWorld, ${error}`;
		console.error(errorMessage);
		throw new functions.https.HttpsError('internal', errorMessage);
	}
}

module.exports = helloWorldHandler;