import { createRouter, createWebHistory } from 'vue-router';

const UserAuth = () => import('./pages/auth/UserAuth.vue');

import ItemsList from './pages/items/ItemsList.vue';
import ItemAdd from './pages/items/ItemAdd.vue';
import itemEdit from './pages/items/ItemEdit.vue';

import TripList from './pages/trips/TripList.vue';
import TripAdd from './pages/trips/TripAdd.vue';
import TripEdit from './pages/trips/TripEdit.vue';


import indexPage from './pages/IndexPage.vue';

import NotFound from './pages/NotFound.vue';
import store from './store/index.js';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: indexPage },
		{ name: 'items', path: '/items', component: ItemsList, meta: { requiresAuth: true } },
		{ name: 'item-add', path: '/items/add', component: ItemAdd, meta: { requiresAuth: true } },
		{ name: 'item-edit', path: '/items/:itemId', component: itemEdit, props: true, meta: { requiresAuth: true } },

		{ name: 'trips', path: '/trips', component: TripList, meta: { requiresAuth: true } },
		{ name: 'trip-add', path: '/trips/add', component: TripAdd, meta: { requiresAuth: true } },
		{ name: 'trip-edit', path: '/trips/:tripId', component: TripEdit, props: true, meta: { requiresAuth: true } },

		{ name: 'auth', path: '/auth', component: UserAuth, meta: { requiresUnauth: true } },
		{ path: '/:notFound(.*)', component: NotFound }
	]
});

router.beforeEach((to, _, next) => {
	if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
		next('/auth');
	} else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
		next('/');
	} else {
		next();
	}
});

export default router;