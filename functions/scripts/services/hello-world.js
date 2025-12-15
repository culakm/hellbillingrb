const admin = require("firebase-admin");
admin.initializeApp();
const { HttpsError } = require("firebase-functions/v2/https");
async function helloWorldHandler({ data, auth }) {
	console.log('helloWorldHandler starts on server');
	try {
		console.log('Data from client: ', data);
		const mojInput = data.mojInput;
		return { message: `Vstup do funkcie z clienta je: "${mojInput}", a toto cele je vratene zo servera!` };
	}
	catch (error) {
		const errorMessage = `Error getting helloWorld, ${error}`;
		console.error(errorMessage);
		throw new HttpsError('internal', errorMessage);
	}
}

module.exports = helloWorldHandler;

/*
	logy z funkcie sa zobrazuju cez Firebase Console > Functions > v zozname vybrat funkciu > View logs
*/

/* obsluha na client strane:

		<div v-if="authStore.isAuthenticated">
			<button type="button" @click="cloudFunctionHelloWorld">Function test</button>
		</div>

		import { cloudFunctions } from '../../firebase.js';
		import { httpsCallable } from 'firebase/functions';

		async function cloudFunctionHelloWorld() {
			alert('Function cloudFunctionHelloWorld started on client');
			let output = '';
			const helloWorld = httpsCallable(cloudFunctions, 'helloWorld');
			try {
				const result = await helloWorld({ mojInput: 'Sokrates mal test na ohovaranie' });
				output = result.data.message;
			} catch (error) {
				output = error.message;
			}
			console.log(output);
		}
*/