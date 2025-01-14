const admin = require("firebase-admin");
admin.initializeApp();
const { FieldValue } = require("firebase-admin/firestore");

async function decrementLineCounterHandler(event) {
	const tripId = event.params.tripId;
	const tripRef = admin.firestore().collection('trips').doc(tripId);

	try {
		await tripRef.update({ linesCount: FieldValue.increment(-1) });
	} catch (error) {
		console.error('Error getting document:', error);
	}
}

module.exports = decrementLineCounterHandler;