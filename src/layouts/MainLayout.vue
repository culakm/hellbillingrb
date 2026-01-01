<template>
	<q-layout view="hHh lpR fFf">
		<TheHeader :toggleRightDrawer="toggleRightDrawer" :logoutLocal="logoutLocal" :authStore="authStore" />
		<TheDrawer v-model="rightDrawerOpen" :authStore="authStore" />
		<q-page-container>
			<router-view />
		</q-page-container>
		<TheFooter />
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import TheHeader from './TheHeader.vue';
import TheDrawer from './TheDrawer.vue';
import TheFooter from './TheFooter.vue';

export default {
	components: {
		TheHeader,
		TheDrawer,
		TheFooter
	},
	setup () {
		const componentName = 'MainLayout';
		const authStore = useAuthStore();
		const router = useRouter();

		const rightDrawerOpen = ref(false);

		function toggleRightDrawer () {
			rightDrawerOpen.value = !rightDrawerOpen.value;
		}

		async function logoutLocal() {
			try {
				authStore.logout();
				router.replace('/');
			} catch (error) {
				console.error(`Extra error, Component ${componentName}, ERROR: ${error.message}`);
			}
		}

		return {
			authStore,
			logoutLocal,
			rightDrawerOpen,
			toggleRightDrawer,
		}
	}
}
</script>