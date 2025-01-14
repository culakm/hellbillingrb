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

// ############################################################################################
const { onRequest, onCall } = require("firebase-functions/v2/https");

exports.helloWorld = onCall(async (request) => {
	const helloWorldHandler = require('./scripts/tests/hello-world.js');
	return await helloWorldHandler(request);
});

// ################### toto je helloWorld funkcia definovana priamo tu, nie z ./tests/hello-world.js
// exports.helloWorld = onCall((request) => {
// 	console.log('moje data', request.data);
// 	const someParameter = request.data.someParameter;
// 	return {
// 		message: `${someParameter}, pridane vo funkcii!`
// 	};
// });

exports.helloWorld2 = onRequest(async (request, response) => {
	const helloWorldHandler2 = require('./scripts/tests/hello-world2.js');
	return await helloWorldHandler2(request, response);
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

// // ###################
const { onDocumentCreated, onDocumentDeleted } = require("firebase-functions/v2/firestore");


exports.incrementLineCounter = onDocumentCreated("trips/{tripId}/lines/{lineId}", async (event) => {
	const incrementLineCounterHandler = require('./scripts/trips/on-add-line.js');
	return await incrementLineCounterHandler(event);
});

exports.decrementLineCounter = onDocumentDeleted("trips/{tripId}/lines/{lineId}", async (event) => {
	const decrementLineCounterHandler = require('./scripts/trips/on-delete-line.js');
	return await decrementLineCounterHandler(event);
});

// exports.incrementLineCounter = onDocumentCreated("trips/{tripId}/lines/{lineId}", async (event) => {
// 	const tripId = event.params.tripId;
// 	const tripRef = admin.firestore().collection('trips').doc(tripId);

// 	try {
// 		// zitenie hodnoty z dokumentu
// 		// const tripDoc = await tripRef.get();
// 		// if (tripDoc.exists) {
// 		// 	const linesCount = tripDoc.data().linesCount;
// 		// 	console.log('linesCount', linesCount);

// 		// } else {
// 		// 	console.log('No such document!');
// 		// }
// 		await tripRef.update({ linesCount: FieldValue.increment(1) });
// 	} catch (error) {
// 		console.error('Error getting document:', error);
// 	}
// });

// #################
exports.getAdminRole = onCall(async (request) => {
	const getAdminRoleHandler = require('./scripts/auth/get-admin-role.js');
	return await getAdminRoleHandler(request);
});

exports.addAdminRole = onCall(async (request) => {
	const addAdminRoleHandler = require('./scripts/auth/add-admin-role.js');
	return await addAdminRoleHandler(request);
});
// exports.addAdminRole = onCall(async (request) => {
// 	try {
// 		const email = request.data.email;
// 		const user = await admin.auth().getUserByEmail(email);
// 		await admin.auth().setCustomUserClaims(user.uid, { admin: true });
// 		return {
// 			message: `Success! ${email} has been made an admin.`
// 		};
// 	} catch (err) {
// 		return {
// 			error: `Error making ${email} an admin: ${err.message}`
// 		};
// 	}
// });

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
