function sortLines(lines) {
	lines.sort((a, b) => a.order - b.order);
}

// function sortTrips(trips) {
// 	trips.sort((a, b) => a.name.localeCompare(b.name));
// }

export default {
	passedLine(state, payload) {
		const lineId = payload.lineId;
		const passed = payload.passed;
		const line = state.trip.lines.find(line => line.lineId === lineId);
		line.passed = passed;
	},
	updateLines(state, payload) {
		state.trip.lines = payload;
	},
	createLine(state, payload) {
		state.trip.linesCount++;
		state.trip.lines.push(payload);
		sortLines(state.trip.lines);
	},
	updateLine(state, payload) {
		const line = state.trip.lines.find(line => line.lineId === payload.lineId);
		line.name = payload.name;
		line.kmTotal = payload.kmTotal;
		line.tulip = payload.tulip;
		line.roadNo = payload.roadNo;
		line.interest = payload.interest;
		line.stop = payload.stop;
		line.note = payload.note;
	},
	deleteLine(state, payload) {
		state.trip.linesCount--;
		const lineId = payload.lineId;
		const lineIndex = state.trip.lines.findIndex(line => line.lineId === lineId);
		state.trip.lines.splice(lineIndex, 1);
		state.trip.lines.forEach((line, index) => {
			line.order = index + 1;
		});
	},
	createTrip(state, payload) {
		state.trips.push(payload);
		sortLines(state.trips);
	},
	updateTrip(state, payload) {
		const trip = state.trip;
		trip.name = payload.name;
		trip.description = payload.description;
		trip.imageName = payload.imageName;
		trip.linesCount = payload.linesCount;
	},
	deleteTrip(state, payload) {
		const tripId = payload.tripId;
		const tripIndex = state.trips.findIndex(trip => trip.tripId === tripId);
		state.trips.splice(tripIndex, 1);
	},
	updateTripImage(state, payload) {
		const trip = state.trip;
		// for updated trip
		if (trip) {
			trip.imageName = payload.imageName;
		}
	},
	deleteTripImage(state, payload) {
		const trip = state.trip;
		trip.imageName = '';
	},
	loadTrips(state, payload) {
		state.trips = payload;
		state.trip = null;
		//sortTrips(state.trips); //toto je nahradene orderBy v actions.js
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