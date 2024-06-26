function sortLines(lines) {
	lines.sort((a, b) => a.order - b.order);
}

export default {
	updateLines(state, payload) {
		state.trip.lines = payload;
	},
	deleteLine(state, payload) {
		const lineId = payload.lineId;
		const lineIndex = state.trip.lines.findIndex(line => line.id === lineId);
		state.trip.lines.splice(lineIndex, 1);
		state.trip.lines.forEach((line, index) => {
			line.order = index + 1;
		});
	},
	addLine(state, payload) {
		state.trip.lines.push(payload);
		// state.trip.lines.sort((a, b) => a.order - b.order);
		sortLines(state.trip.lines);
	},
	addTrip(state, payload) {
		state.trips.push(payload);
	},
	updateTrip(state, payload) {
		var trip = state.trips.find(trip => trip.id === payload.tripId);
		trip.name = payload.name;
		trip.description = payload.description;
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
	},
};