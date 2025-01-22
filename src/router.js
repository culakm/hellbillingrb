import { createRouter, createWebHistory } from 'vue-router';
const UserAuth = () => import('./pages/auth/UserAuth.vue');

import TripList from './pages/trips/TripList.vue';
import TripAdd from './pages/trips/TripAdd.vue';
import TripEdit from './pages/trips/TripEdit.vue';
import TripView from './pages/trips/TripView.vue';
import TripViewPrint from './pages/trips/TripViewPrint.vue';

import UsersList from './pages/users/UsersList.vue';
import UserAdd from './pages/users/UserAdd.vue';
import UserEdit from './pages/users/UserEdit.vue';

import indexPage from './pages/IndexPage.vue';

import NotFound from './pages/NotFound.vue';
import store from './store/index.js';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: indexPage },

		{ name: 'trips', path: '/trips', component: TripList, meta: { requiresAuth: true } },
		{ name: 'trip-add', path: '/trip/add', component: TripAdd, meta: { requiresAuth: true } },
		{ name: 'trip-edit', path: '/trip/edit/:tripId', component: TripEdit, props: false, meta: { requiresAuth: true } },
		{ name: 'trip-view', path: '/trip/view/:tripId', component: TripView, props: false, meta: { requiresAuth: true } },
		{ name: 'trip-view-print', path: '/trip/view/print/:tripId', component: TripViewPrint, props: false, meta: { requiresAuth: true } },

		{ name: 'users', path: '/users', component: UsersList, meta: { requiresAuth: true } },
		{ name: 'user-add', path: '/user/add', component: UserAdd, meta: { requiresAuth: true } },
		{ name: 'user-edit', path: '/user/edit/:userId', component: UserEdit, props: false, meta: { requiresAuth: true } },

		{ name: 'users', path: '/users', component: UsersList, meta: { requiresAuth: true } },
		{ name: 'user-add', path: '/user/add', component: UserAdd, meta: { requiresAuth: true } },
		{ name: 'user-edit', path: '/user/edit/:userId', component: UserEdit, props: false, meta: { requiresAuth: true } },

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