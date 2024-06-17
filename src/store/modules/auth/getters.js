export default {
	userId(state) {
		return state.userId;
	},
	token(state) {
		return state.token;
	},
	email(state) {
		return state.email;
	},
	isAuthenticated(state) {
		return !!state.token; // true boolean
	},
	didAutoLogout(state) {
		return state.didAutoLogout;
	}
};