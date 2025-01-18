export default {
	loadUsers(state, payload) {
		state.users = payload;
	},
	addUser(state, payload) {
		state.users.push(payload);
	},
	updateUser(state, payload) {
		const user = state.user;
		user.name = payload.name;
		user.description = payload.description;
		user.imageName = payload.imageName;
	},
	deleteUser(state, payload) {
		const userId = payload.userId;
		const userIndex = state.users.findIndex(user => user.userId === userId);
		state.users.splice(userIndex, 1);
	}
};