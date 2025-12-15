const admin = require("firebase-admin");
admin.initializeApp();
const { FieldValue } = require("firebase-admin/firestore");

async function incrementLineCounterHandler(event) {
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
		console.error(`Error increase lines count, ${error}`);
	}
}

module.exports = incrementLineCounterHandler;