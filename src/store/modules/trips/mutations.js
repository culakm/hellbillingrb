export default {
	addLine(state, payload) {
		state.trip.lines.push(payload);
	},
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
	setTrip(state, payload) {
		state.trip = payload;
		if (state.trip.lines) {
			state.trip.lines.sort((a, b) => a.order - b.order);
		}
	}
};