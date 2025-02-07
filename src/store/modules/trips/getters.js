export default {
	trips(state) {
		return state.trips;
	},
	trip(state) {
		return state.trip;
	},
	hasTrips(state) {
		return state.trips && state.trips.length > 0;
	},
	hasLines(state) {
		return state.trip && state.trip.linesCount && state.trip.linesCount > 0;
	}
};