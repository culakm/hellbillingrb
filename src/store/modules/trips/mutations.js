function sortLines(lines) {
	lines.sort((a, b) => a.order - b.order);
}

function reaclculateLineExtraValues(state) {
	const lines = state.trip.lines;
	lines.forEach((line, index) => {

		// kmParts
		line.kmPart = null;
		if (index === 0) {
			line.kmPart = 0;
		} else {
			let previousKmTotal = null;
			for (let i = index - 1; i >= 0; i--) {
				if (lines[i].kmTotal !== null) {
					previousKmTotal = lines[i].kmTotal;
					break;
				}
			}
			if (line.kmTotal !== null && previousKmTotal !== null) {
				line.kmPart = parseFloat((line.kmTotal - previousKmTotal).toFixed(2));
			}
		}

		// interests
		line.interest.forEach(value => {line[value] = true;});
		// Close
		if (!line.close) {line.close = false;}

		// Check if the difference between the next line's kmTotal and the current line's kmTotal is less than 5
		const nextLine = lines[index + 1];
		if (index < lines.length - 1 && line.kmTotal !== null && nextLine.kmTotal !== null) {
			if (nextLine.kmTotal - line.kmTotal < 2) {
				line.close = true;
			}
		}

	});
}

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
		reaclculateLineExtraValues(state);
	},
	updateLine(state, payload) {
		const line = state.trip.lines.find(line => line.lineId === payload.lineId);
		line.name = payload.name;
		line.kmTotal = payload.kmTotal;
		line.tulip = payload.tulip;
		line.mapPage = payload.mapPage;
		line.roadNo = payload.roadNo;
		line.interest = payload.interest;
		line.stop = payload.stop;
		line.note = payload.note;
		reaclculateLineExtraValues(state);
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
			// state.trip.lines.sort((a, b) => a.order - b.order);
			sortLines(state.trip.lines);
			reaclculateLineExtraValues(state);
		}
	},
	resetTrip(state, payload) {
		state.trip = undefined;
	},
};