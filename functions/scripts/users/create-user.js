const admin = require('firebase-admin');
const db = admin.firestore();

async function createUserHandler(request, response) {
	console.log('createUserApp startuje');
	try {
		console.log('moje data', request.data);
		const { name, email, password, description, role } = request.data.user;
		console.log('nove data', { name, email, password, description, role });

		// Create user in Firebase Auth
		const userRecord = await admin.auth().createUser({
			email: email,
			password: password,
		});

		// Set custom user claims
		await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

		// Add user to Firestore
		await db.collection('users').doc(userRecord.uid).set({
			name: name,
			email: email,
			description: description,
			role: role,
		});

		return { message: `User ${name} was created successfully` };
	} catch (error) {
		console.error('Error creating user:', error);
		throw new functions.https.HttpsError('internal', 'Error creating user', error);
	}
}

module.exports = createUserHandler;