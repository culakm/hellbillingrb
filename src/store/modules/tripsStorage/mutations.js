export default {
	// NEPOUZIVA SA!!
	deleteImage(state, { payload, rootState }) {
		console.log('deleteImage called');
		const trip = rootState.trips.trip;
		console.log('state trip', rootState);
		if (trip) {
			console.log('state trip', trip);
			trip.imageName = 'pako.jpg';
		} else {
			console.error('Trip not found in rootState.trips');
		}
	},
};