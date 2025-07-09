import { createRouter, createWebHistory } from 'vue-router';
const UserAuth = () => import('./pages/auth/UserAuth.vue');

import TripList from './pages/trips/TripList.vue';
import TripCreate from './pages/trips/TripCreate.vue';
import TripEdit from './pages/trips/TripEdit.vue';
import TripView from './pages/trips/TripView.vue';
import TripViewPrint from './pages/trips/TripViewPrint.vue';

import UserList from './pages/users/UserList.vue';
import UserCreate from './pages/users/UserCreate.vue';
import UserEdit from './pages/users/UserEdit.vue';

import CardsShow from './pages/cards/CardsShow.vue';

import indexPage from './pages/IndexPage.vue';

// dynamicky importovany component, ostatne su naloadovane vzdy
const testPage = () => import('./pages/test/TestPage.vue');

import NotFound from './pages/NotFound.vue';
import store from './store/index.js';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: indexPage },
		{ path: '/test', component: testPage, meta: { requiresAuth: true } },

		{ name: 'trips', path: '/trips', component: TripList, meta: { requiresAuth: true } },
		{ name: 'trip-add', path: '/trip/add', component: TripCreate, meta: { requiresAuth: true } },
		{ name: 'trip-edit', path: '/trip/edit/:tripId', component: TripEdit, props: false, meta: { requiresAuth: true } },
		{ name: 'trip-view', path: '/trip/view/:tripId', component: TripView, props: false, meta: { requiresAuth: true } },
		{ name: 'trip-view-print', path: '/trip/view/print/:tripId', component: TripViewPrint, props: false, meta: { requiresAuth: true } },

		{ name: 'cards', path: '/cards', component: CardsShow, meta: { requiresAuth: true } },

		{ name: 'users', path: '/users', component: UserList, meta: { requiresAuth: true } },
		{ name: 'user-add', path: '/user/add', component: UserCreate, meta: { requiresAuth: true } },
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