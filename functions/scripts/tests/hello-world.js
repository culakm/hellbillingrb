const admin = require("firebase-admin");
admin.initializeApp();
const { HttpsError } = require("firebase-functions/v2/https");
async function helloWorldHandler({ data, auth }) {
	console.log('helloWorldHandler startuje');

	try {
		console.log('moje data', data);
		const mojInput = data.mojInput;
		return { message: `Vstup do funkcie z clienta: "${mojInput}", toto uz som pridal na serveri!` };
	}
	catch (error) {
		const errorMessage = `Error getting helloWorld, ${error}`;
		console.error(errorMessage);
		throw new HttpsError('internal', errorMessage);
	}
}

module.exports = helloWorldHandler;