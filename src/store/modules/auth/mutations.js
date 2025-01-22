export default {
	setUser(state, payload) {
		state.token = payload.token;
		state.userId = payload.userId;
		state.email = payload.email;
		state.role = payload.role;
		state.didAutoLogout = false;
	},
	setAutoLogout(state) {
		state.didAutoLogout = true;
	}
};