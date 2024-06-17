import { createStore } from 'vuex';
import itemsModule from './modules/items/index.js';
import tripsModule from './modules/trips/index.js';
import authModule from './modules/auth/index.js';

const store = createStore({
	modules: {
		items: itemsModule,
		trips: tripsModule,
		auth: authModule
	}
});
export default store;