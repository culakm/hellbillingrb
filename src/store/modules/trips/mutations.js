function sortLines(lines) {
	lines.sort((a, b) => a.order - b.order);
}

function sortTrips(trips) {

	trips.sort((a, b) => a.name.localeCompare(b.name));
}

export default {
	passedLine(state, payload) {
		const lineId = payload.lineId;
		const passed = payload.passed;
		const line = state.trip.lines.find(line => line.id === lineId);
		line.passed = passed;
	},
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
		sortLines(state.trip.lines);
	},
	addTrip(state, payload) {
		state.trips.push(payload);
		sortLines(state.trips);
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
	loadTrips(state, payload) {
		state.trips = payload;
		sortTrips(state.trips);
	},
	setTrip(state, payload) {
		state.trip = payload;
		if (state.trip.lines) {
			state.trip.lines.sort((a, b) => a.order - b.order);
		}
	},
};