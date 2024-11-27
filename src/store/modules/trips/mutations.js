function sortLines(lines) {
	lines.sort((a, b) => a.order - b.order);
}

function sortTrips(trips) {
	trips.sort((a, b) => a.name.localeCompare(b.name));
}

export default {
	addLine(state, payload) {
		state.trip.lines.push(payload);
		sortLines(state.trip.lines);
	},
	deleteLine(state, payload) {
		const lineId = payload.lineId;
		const lineIndex = state.trip.lines.findIndex(line => line.id === lineId);
		state.trip.lines.splice(lineIndex, 1);
		state.trip.lines.forEach((line, index) => {
			line.order = index + 1;
		});
	},
	updateLine(state, payload) {
		const line = state.trip.lines.find(line => line.id === payload.lineId);
		line.name = payload.name;
		line.tulip = payload.tulip;
		line.roadNo = payload.roadNo;
		line.note = payload.note;
	},
	passedLine(state, payload) {
		const lineId = payload.lineId;
		const passed = payload.passed;
		const line = state.trip.lines.find(line => line.id === lineId);
		line.passed = passed;
	},
	updateLines(state, payload) {
		state.trip.lines = payload;
	},
	addTrip(state, payload) {
		state.trips.push(payload);
		sortLines(state.trips);
	},
	deleteTrip(state, payload) {
		const tripId = payload.tripId;
		const tripIndex = state.trips.findIndex(trip => trip.id === tripId);
		state.trips.splice(tripIndex, 1);
	},
	updateTrip(state, payload) {
		const trip = state.trip;
		trip.name = payload.name;
		trip.description = payload.description;
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
	resetTrip(state, payload) {
		state.trip = undefined;
	},
};