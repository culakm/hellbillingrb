export default {
	users(state) {
		return state.users;
	},
	user(state) {
		return state.user;
	},
	hasUsers(state) {
		return state.users && state.users.length > 0;
	}
};