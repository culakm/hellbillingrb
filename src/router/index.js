import { createRouter, createWebHistory } from 'vue-router';
// import store from '@/store/index.js';
import { useAuthStore } from '@/stores/auth';
import routes from './routes';

const router = createRouter({
	history: createWebHistory(),
	routes
});

router.beforeEach((to, _, next) => {
	const authStore = useAuthStore();
	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		next('/auth');
	} else if (to.meta.requiresUnauth && authStore.isAuthenticated) {
		next('/');
	} else {
		next();
	}
});

export default router;