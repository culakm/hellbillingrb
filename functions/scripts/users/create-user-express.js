const express = require('express');
const createUserApp = express();
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

createUserApp.post('/', async (request, response) => {
	console.log('createUserApp startuje');
	try {
		console.log('moje data', request.body.user);
		const { name, email, password, description, role } = request.body.user;
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

		response.status(200).json({ message: `User ${name} was created successfully` });
	} catch (error) {
		console.error('Error creating user:', error);
		response.status(500).json({ message: 'Error creating user' });
	}
});

createUserApp.delete('/', async (request, response) => {
	console.log('createUserApp startuje');
	try {

		const user = request.body.user;
		console.log('moje data', user);
		response.status(200).json({ message: `user ${user.name} was deleted successfully` });
	}
	catch (error) {
		console.error('Error creating user:', error);
		response.status(500).json({ message: 'Error creating user ' });
	}
});

module.exports = createUserApp;
