export default {
	loadUsers(state, payload) {
		state.users = payload;
	},
	deleteUser(state, payload) {
		const userId = payload.userId;
		const userIndex = state.users.findIndex(user => user.userId === userId);
		state.users.splice(userIndex, 1);
	}
};