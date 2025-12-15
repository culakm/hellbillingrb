const { onCall } = require("firebase-functions/v2/https");

// #### User management, functions
// normalne je to onCall(async (request) => { ... })
// ale tu pouzivame destrukturalizaciu, takze je to onCall(async ({ data, auth }) => { ... })
// to su z requestu uz vybrane veci ktora vo funkcii potrebujeme: data a auth
exports.createUser = onCall(async ({ data, auth }) => {
	const createUserHandler = require('./scripts/users/create-user.js');
	return await createUserHandler({ data, auth });
});

exports.updateUser = onCall(async ({ data, auth }) => {
	const updateUserHandler = require('./scripts/users/update-user.js');
	return await updateUserHandler({ data, auth });
});

exports.deleteUser = onCall(async ({ data, auth }) => {
	console.log('deleteUser data', data);
	const deleteUserHandler = require('./scripts/users/delete-user.js');
	return await deleteUserHandler({ data, auth });
});

exports.getUserRole = onCall(async ({ data, auth }) => {
	const getUserRoleHandler = require('./scripts/auth/get-user-role.js');
	return await getUserRoleHandler({ data, auth });
});

// #### Trip management, triggers
const { onDocumentCreated, onDocumentDeleted } = require("firebase-functions/v2/firestore");

exports.incrementLineCounter = onDocumentCreated("trips/{tripId}/lines/{lineId}", async (event) => {
	const incrementLineCounterHandler = require('./scripts/trips/on-add-line.js');
	return await incrementLineCounterHandler(event);
});

exports.decrementLineCounter = onDocumentDeleted("trips/{tripId}/lines/{lineId}", async (event) => {
	const decrementLineCounterHandler = require('./scripts/trips/on-delete-line.js');
	return await decrementLineCounterHandler(event);
});

exports.helloWorld = onCall(async ({ data, auth }) => {
	const helloWorldHandler = require('./scripts/services/hello-world.js');
	return await helloWorldHandler({ data, auth });
});

exports.firstUserRole = onCall(async ({ data, auth }) => {
	const firstUserRoleHandler = require('./scripts/services/first-user-role.js');
	return await firstUserRoleHandler({ data, auth });
});