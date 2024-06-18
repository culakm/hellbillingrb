export default {
	trips(state) {
		return state.trips;
	},
	hasTrips(state) {
		return state.trips && state.trips.length > 0;
	},
};