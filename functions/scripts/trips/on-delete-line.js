const admin = require("firebase-admin");
admin.initializeApp();
const { FieldValue } = require("firebase-admin/firestore");

async function decrementLineCounterHandler(event) {
	const tripId = event.params.tripId;
	const tripRef = admin.firestore().collection("trips").doc(tripId);

	try {
		//load the trip linesCoutn value
		const trip = (await tripRef.get()).data();
		await tripRef.update({ linesCount: FieldValue.increment(-1) });
		//new value of linesCount
		const newTrip = (await tripRef.get()).data();
	} catch (error) {
		console.error(`Error decrease lines count, ${error}`);
	}
}

module.exports = decrementLineCounterHandler;
