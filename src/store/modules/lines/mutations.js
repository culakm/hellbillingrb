export default {
	addTrip(state, payload) {
		state.trips.push(payload);
	},
	editTrip(state, payload) {
		const tripIndex = state.trips.findIndex(trip => trip.id === payload.tripId);
		state.trips[tripIndex] = payload;
	},
	deleteTrip(state, payload) {
		const tripId = payload.tripId;
		const tripIndex = state.trips.findIndex(trip => trip.id === tripId);
		state.trips.splice(tripIndex, 1);
	},
	setTrips(state, payload) {
		state.trips = payload;
	},
};