import { createStore } from 'vuex';
import tripsModule from './modules/trips/index.js';
import tripsStorageModule from './modules/tripsStorage/index.js';
import authModule from './modules/auth/index.js';


const store = createStore({
	modules: {
		trips: tripsModule,
		tripsStorage: tripsStorageModule,
		auth: authModule
	}
});
export default store;