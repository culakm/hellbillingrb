const admin = require("firebase-admin");
admin.initializeApp();
const { HttpsError } = require("firebase-functions/v2/https");
async function firstUserRoleHandler({ auth }) {
	console.log('firstUserRoleHandler starts on server');
	try {
		admin.auth().setCustomUserClaims(auth.uid, { role: "admin" });
		const message = `User id: "${auth.uid}", email: "${auth.email}", role: "admin" successfully set.`;
		console.log(message);
		return { message: message};
	}
	catch (error) {
		const errorMessage = `Error getting firstUserRole, ${error}`;
		console.error(errorMessage);
		throw new HttpsError('internal', errorMessage);
	}
}

module.exports = firstUserRoleHandler;

/* obsluha na client strane:

		<div v-if="authStore.isAuthenticated">
			<button type="button" @click="cloudFunctionFirstUserRole">FirstUserRole</button>
		</div>

		import { cloudFunctions } from '../../firebase.js';
		import { httpsCallable } from 'firebase/functions';

		async function cloudFunctionFirstUserRole() {
			console.log('Function cloudFunctionFirstUserRole started on client');
			let output = '';
			const firstUserRole = httpsCallable(cloudFunctions, 'firstUserRole');
			try {
				const result = await firstUserRole();
				output = result.data.message;
			} catch (error) {
				output = error.message;
			}
			console.log(output);
		}
*/