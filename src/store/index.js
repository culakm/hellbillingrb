import { createStore } from 'vuex';
import authModule from './modules/auth/index.js';
import usersModule from './modules/users/index.js';
import tripsModule from './modules/trips/index.js';
import tripsStorageModule from './modules/tripsStorage/index.js';

const store = createStore({
	modules: {
		auth: authModule,
		users: usersModule,
		trips: tripsModule,
		tripsStorage: tripsStorageModule
	}
});

export default store;