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
		return state.trip && state.trip.lines && state.trip.lines.length > 0;
	}
};