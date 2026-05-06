import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import routes from './routes';

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(async (to, _, next) => {
	const authStore = useAuthStore();
	await authStore.authReady;
	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		next('/auth');
	} else if (to.meta.requiresUnauth && authStore.isAuthenticated) {
		next('/');
	} else {
		next();
	}
});

export default router;
