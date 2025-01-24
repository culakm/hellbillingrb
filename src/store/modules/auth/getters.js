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
	role(state) {
		return state.role;
	},
	isAuthenticated(state) {
		return !!state.token;
	},
	isAdmin(state) {
		return state.role === 'admin';
	},
	isEditor(state) {
		return state.role === 'editor';
	},
	isUser(state) {
		return state.role === 'user';
	},
	didAutoLogout(state) {
		return state.didAutoLogout;
	}
};