/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const { onRequest, onCall } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// ###################
exports.helloWorld2 = onRequest((request, response) => {
	logger.info("Hello logs message!", { structuredData: true });
	// response.send("Hello from Firebase! lala");
	response.json({ message: "Hello from Firebase! lala" });
});

// ###################
exports.helloWorld = onCall((request) => {
	console.log('moje data', request.data);
	const someParameter = request.data.someParameter;
	return {
		message: `${someParameter}, pridane vo funkcii!`
	};
});

// takto vyzera volanie tejto funkcie z componnentu:

// import { cloudFunctions } from '../../firebase.js';
// import { httpsCallable } from 'firebase/functions';
// async functionTest() {
// 	alert('Function test');
// 	let output = 'pako';
// 	const helloWorld = httpsCallable(cloudFunctions, 'helloWorld');
// 	try {
// 		const result = await helloWorld({ someParameter: 'poslane do funkcie' });
// 		output = result.data.message;
// 		console.log('vystup z funkcie: ' + result.data.message);
// 	} catch (error) {
// 		console.error('Error calling cloud function:', error);
// 	}
// 	alert(output);
// },

// ###################
const admin = require("firebase-admin");
admin.initializeApp();
exports.addAdminRole = onCall(async (request) => {
	try {
		const email = request.data.email;
		const user = await admin.auth().getUserByEmail(email);
		await admin.auth().setCustomUserClaims(user.uid, { admin: true });
		return {
			message: `Success! ${email} has been made an admin.`
		};
	} catch (err) {
		return {
			error: `Error making ${email} an admin: ${err.message}`
		};
	}
});

// takto vyzera volanie tejto funkcie z componnentu:
// async addAdminRole() {
// 	const email = 'karol.emul@hellbilling.com';
// 	const addAdminRole = httpsCallable(cloudFunctions, 'addAdminRole');
// 	try {
// 		const result = await addAdminRole({ email: email });
// 		console.log('vystup z funkcie: ', result.data);
// 	} catch (error) {
// 		console.error('Error calling cloud function:', error);
// 	}
// },

exports.getAdminRole = onCall(async (request) => {
	console.log('moje data', request.data);
	const user = await admin.auth().getUserByEmail(request.data.email);
	const customClaims = user.customClaims || {};
	return {
		admin: customClaims.admin || false
	};
});

const { onDocumentCreated, onDocumentDeleted } = require("firebase-functions/v2/firestore");
const { FieldValue } = require("firebase-admin/firestore");

exports.onLineAddIncrementLineCounter = onDocumentCreated("trips/{tripId}/lines/{lineId}", async (event) => {
	const tripId = event.params.tripId;
	const tripRef = admin.firestore().collection('trips').doc(tripId);

	try {
		// zitenie hodnoty z dokumentu
		// const tripDoc = await tripRef.get();
		// if (tripDoc.exists) {
		// 	const linesCount = tripDoc.data().linesCount;
		// 	console.log('linesCount', linesCount);

		// } else {
		// 	console.log('No such document!');
		// }
		await tripRef.update({ linesCount: FieldValue.increment(1) });
	} catch (error) {
		console.error('Error getting document:', error);
	}
});

exports.onLineDeleteDecrementLineCounter = onDocumentDeleted("trips/{tripId}/lines/{lineId}", async (event) => {
	const tripId = event.params.tripId;
	const tripRef = admin.firestore().collection('trips').doc(tripId);

	try {
		await tripRef.update({ linesCount: FieldValue.increment(-1) });
	} catch (error) {
		console.error('Error getting document:', error);
	}
});