import { createStore } from 'vuex';
import tripsModule from './modules/trips/index.js';
import authModule from './modules/auth/index.js';

const store = createStore({
	modules: {
		trips: tripsModule,
		auth: authModule
	}
});
export default store;